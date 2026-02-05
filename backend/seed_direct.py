from database import SessionLocal, init_db
from models import UserPermissionModel
import random
import json
from datetime import datetime, timedelta

# Initialize database (if not already)
init_db()

# Sample roles and permissions
ROLES = {
    "HR": ["view_salaries", "edit_profiles", "onboard_users"],
    "Developer": ["access_github", "deploy_code", "read_logs"],
    "Finance": ["process_payments", "view_tax_data", "approve_expenses"],
    "DevOps": ["db_admin", "server_root", "manage_cloud"]
}

def seed_users():
    print("🚀 Seeding database directly...")
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(UserPermissionModel).delete()
        db.commit()
        
        # Create 20 sample users with privilege creep
        for i in range(1, 21):
            username = f"user_{i:02d}"
            
            # Simulate privilege creep: user had 2-3 different roles
            roles_history = random.sample(list(ROLES.keys()), random.randint(2, 3))
            current_role = roles_history[-1]
            
            # Accumulate permissions from all roles (THE CREEP!)
            all_permissions = []
            for role in roles_history:
                all_permissions.extend(ROLES[role])
            
            # Remove duplicates
            all_permissions = list(set(all_permissions))
            
            # Random last_updated time (1-30 days ago)
            days_ago = random.randint(1, 30)
            last_updated = datetime.utcnow() - timedelta(days=days_ago)
            
            user = UserPermissionModel(
                username=username,
                current_role=current_role,
                accumulated_permissions=all_permissions,
                last_updated=last_updated
            )
            
            db.add(user)
            print(f"✅ {username}: {current_role} with {len(all_permissions)} permissions")
        
        db.commit()
        print(f"\n🎉 Seeded {20} users successfully!")
        
        # Display sample
        users = db.query(UserPermissionModel).all()
        print("\n📋 Sample users:")
        for user in users[:3]:  # Show first 3
            print(f"  - {user.username}: {user.current_role}, {len(user.accumulated_permissions)} perms")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()