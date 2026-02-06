from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import SessionLocal, init_db, get_db
from backend.models import UserPermissionModel
from pydantic import BaseModel
from typing import List, Dict, Any
import json
from datetime import datetime, timedelta
import pandas as pd
from sklearn.ensemble import IsolationForest

# Initialize the database tables on start
init_db()

app = FastAPI()

# Add CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============== EXISTING ENDPOINTS ===============
class RoleChange(BaseModel):
    username: str
    new_role: str
    new_permissions: List[str]

@app.post("/update-role")
def update_role(data: RoleChange, db: Session = Depends(get_db)):
    # 1. Look for existing user in Postgres
    user = db.query(UserPermissionModel).filter(UserPermissionModel.username == data.username).first()
    
    if not user:
        # Create user if they don't exist for demo purposes
        user = UserPermissionModel(
            username=data.username, 
            current_role="New Hire", 
            accumulated_permissions=[]
        )
        db.add(user)

    # 2. THE CREEP LOGIC: Add new perms, but don't remove old ones [cite: 46]
    existing_perms = user.accumulated_permissions or []
    updated_perms = list(set(existing_perms + data.new_permissions))
    
    # 3. Save back to PostgreSQL 
    user.current_role = data.new_role
    user.accumulated_permissions = updated_perms
    db.commit()
    
    return {
        "status": "Success",
        "user": user.username,
        "new_role": user.current_role,
        "total_permissions": updated_perms
    }

@app.get("/audit-data")
def get_audit_data(db: Session = Depends(get_db)):
    # This endpoint provides the raw data for Person 2's AI Engine [cite: 177]
    return db.query(UserPermissionModel).all()

# Create a way to actually FIX the problem
class RemediationRequest(BaseModel):
    username: str
    permission_to_remove: str

@app.post("/remediate")
def remediate_access(data: RemediationRequest, db: Session = Depends(get_db)):
    user = db.query(UserPermissionModel).filter(UserPermissionModel.username == data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove the specific 'creepy' permission
    if data.permission_to_remove in user.accumulated_permissions:
        user.accumulated_permissions.remove(data.permission_to_remove)
        db.commit()
        return {"message": f"Successfully revoked {data.permission_to_remove} from {data.username}"}
    
    return {"message": "Permission not found in user's list"}

# =============== NEW ENDPOINTS FOR FRONTEND ===============
class UserResponse(BaseModel):
    id: int
    name: str
    role: str
    department: str
    riskScore: float
    permissions: int
    excessPermissions: int
    lastChange: str
    status: str

class StatsResponse(BaseModel):
    total_users: int
    high_risk_users: int
    anomalies_detected: int
    compliance_score: float

class AnomalyResponse(BaseModel):
    id: int
    user: str
    description: str
    severity: str
    time: str
    system: str

@app.get("/api/users", response_model=List[UserResponse])
def get_users_for_frontend(db: Session = Depends(get_db)):
    """Get users in frontend format with calculated risk scores"""
    users = db.query(UserPermissionModel).all()
    
    # Calculate risk scores using AI model
    risk_data = calculate_risk_scores(db)
    
    result = []
    for user in users:
        # Get risk score from AI calculation
        user_risk = risk_data.get(user.id, {"risk_score": 0, "status": "low"})
        
        # Determine status based on risk
        risk_score = user_risk.get("risk_score", 0)
        if risk_score >= 80:
            status = "critical"
        elif risk_score >= 60:
            status = "high"
        elif risk_score >= 40:
            status = "medium"
        else:
            status = "low"
        
        # Calculate time since last update
        if user.last_updated:
            time_diff = datetime.utcnow() - user.last_updated
            if time_diff.days == 0:
                if time_diff.seconds < 3600:
                    last_change = f"{time_diff.seconds // 60} minutes ago"
                else:
                    last_change = f"{time_diff.seconds // 3600} hours ago"
            elif time_diff.days == 1:
                last_change = "yesterday"
            else:
                last_change = f"{time_diff.days} days ago"
        else:
            last_change = "never"
        
        # Calculate excess permissions
        excess_perms = 0
        if user.accumulated_permissions:
            # Simplified: count permissions not in current role's typical set
            role_permissions = {
                "HR": ["view_salaries", "edit_profiles", "onboard_users"],
                "Developer": ["access_github", "deploy_code", "read_logs"],
                "Finance": ["process_payments", "view_tax_data", "approve_expenses"],
                "DevOps": ["db_admin", "server_root", "manage_cloud"]
            }
            expected = role_permissions.get(user.current_role, [])
            excess_perms = len([p for p in user.accumulated_permissions if p not in expected])
        
        result.append(UserResponse(
            id=user.id,
            name=user.username,
            role=user.current_role,
            department=user.current_role,  # Using role as department for now
            riskScore=risk_score,
            permissions=len(user.accumulated_permissions) if user.accumulated_permissions else 0,
            excessPermissions=excess_perms,
            lastChange=last_change,
            status=status
        ))
    
    return result

@app.get("/api/stats", response_model=StatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    users = db.query(UserPermissionModel).all()
    
    # Calculate risk scores
    risk_data = calculate_risk_scores(db)
    
    # Count high risk users (risk >= 60)
    high_risk_count = sum(1 for user_id, data in risk_data.items() 
                         if data.get("risk_score", 0) >= 60)
    
    # Calculate compliance score (inverse of average risk)
    if risk_data:
        avg_risk = sum(data.get("risk_score", 0) for data in risk_data.values()) / len(risk_data)
        compliance_score = max(0, 100 - avg_risk)
    else:
        compliance_score = 100
    
    # Count anomalies (users with status "⚠️ DANGER" from AI)
    anomalies_count = sum(1 for data in risk_data.values() 
                         if data.get("status") == "⚠️ DANGER")
    
    return StatsResponse(
        total_users=len(users),
        high_risk_users=high_risk_count,
        anomalies_detected=anomalies_count,
        compliance_score=round(compliance_score, 1)
    )

@app.get("/api/anomalies", response_model=List[AnomalyResponse])
def get_anomalies(db: Session = Depends(get_db)):
    """Get AI-detected anomalies"""
    risk_data = calculate_risk_scores(db)
    users = db.query(UserPermissionModel).all()
    
    anomalies = []
    anomaly_id = 1
    
    for user in users:
        user_risk = risk_data.get(user.id, {})
        
        if user_risk.get("status") == "⚠️ DANGER":
            # Create anomaly description based on risk reason
            reason = user_risk.get("reason", "Unknown risk factors")
            
            # Determine system based on permissions
            systems = {
                "view_salaries": "HR System",
                "db_admin": "Database",
                "process_payments": "Finance Portal",
                "deploy_code": "CI/CD System"
            }
            
            detected_system = "Multiple Systems"
            if user.accumulated_permissions:
                for perm in user.accumulated_permissions:
                    if perm in systems:
                        detected_system = systems[perm]
                        break
            
            anomalies.append(AnomalyResponse(
                id=anomaly_id,
                user=user.username,
                description=f"High risk detected: {reason}",
                severity="High" if user_risk.get("risk_score", 0) < 80 else "Critical",
                time="Recent",
                system=detected_system
            ))
            anomaly_id += 1
    
    return anomalies

@app.post("/api/calculate-risks")
def trigger_risk_calculation(db: Session = Depends(get_db)):
    """Trigger AI risk calculation and update database"""
    risk_data = calculate_risk_scores(db, update_db=True)
    return {"message": "Risk scores updated", "users_processed": len(risk_data)}

# =============== HELPER FUNCTIONS ===============
def calculate_risk_scores(db: Session, update_db=False):
    """Calculate risk scores using Isolation Forest"""
    users = db.query(UserPermissionModel).all()
    
    if not users:
        return {}
    
    # Get all unique permissions
    all_permissions = set()
    for user in users:
        if user.accumulated_permissions:
            all_permissions.update(user.accumulated_permissions)
    
    if not all_permissions:
        return {user.id: {"risk_score": 0, "status": "✅ SAFE", "reason": "No permissions"} 
                for user in users}
    
    # Create DataFrame for AI model
    data = []
    for user in users:
        row = {"user_id": user.id}
        for perm in all_permissions:
            row[perm] = 1 if user.accumulated_permissions and perm in user.accumulated_permissions else 0
        data.append(row)
    
    try:
        df = pd.DataFrame(data)
        
        # Run Isolation Forest model
        features = df.drop('user_id', axis=1)
        model = IsolationForest(contamination=0.1, random_state=42)
        model.fit(features)
        
        # Calculate risk scores (0-100)
        raw_scores = model.decision_function(features)
        risk_scores = [round((0.5 - s) * 100, 1) for s in raw_scores]
        
        # Get reasons (columns with 1 where average is low)
        result = {}
        for idx, user in enumerate(users):
            risk_score = max(0, min(100, risk_scores[idx]))  # Clamp to 0-100
            
            # Find suspicious permissions
            reasons = []
            if user.accumulated_permissions:
                for perm in user.accumulated_permissions:
                    perm_avg = features[perm].mean()
                    if perm_avg < 0.3:  # Rare permission
                        reasons.append(perm)
            
            status = "⚠️ DANGER" if risk_score > 65 else "✅ SAFE"
            
            result[user.id] = {
                "risk_score": risk_score,
                "status": status,
                "reason": ", ".join(reasons) if reasons else "Normal Usage"
            }
            
            # Update database if requested
            if update_db:
                user.risk_score = risk_score
                db.commit()
        
        return result
        
    except Exception as e:
        print(f"AI calculation error: {e}")
        # Return default scores if AI fails
        return {user.id: {"risk_score": 0, "status": "✅ SAFE", "reason": "AI Error"} 
                for user in users}