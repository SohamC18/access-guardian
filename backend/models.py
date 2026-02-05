from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class UserPermissionModel(Base):
    __tablename__ = "user_permissions"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    current_role = Column(String)
    
    # We store permissions as a JSON list to track the 'creep' [cite: 46]
    accumulated_permissions = Column(JSON) 
    
    # Risk score calculated by the AI Engine [cite: 84, 87]
    risk_score = Column(Integer, default=0) 
    
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)