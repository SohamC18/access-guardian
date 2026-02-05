from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

# This is our fake "Memory" (Database)
# In a real app, we'd use PostgreSQL [cite: 188]
user_database = {
    "atharv": {"role": "intern", "permissions": ["read_docs"]}
}

class RoleChange(BaseModel):
    username: str
    new_role: str
    new_permissions: List[str]

@app.get("/")
def home():
    return {"message": "Obsidian Access Guardian API is running!"}

@app.post("/update-role")
def update_role(data: RoleChange):
    user = user_database.get(data.username)
    if user:
        # THE CREEP LOGIC: We add new permissions but FORGET to remove old ones 
        updated_perms = list(set(user["permissions"] + data.new_permissions))
        user_database[data.username] = {
            "role": data.new_role,
            "permissions": updated_perms
        }
        return {
            "status": "Success", 
            "current_permissions": updated_perms,
            "note": "Privilege creep simulated!"
        }
    return {"error": "User not found"}