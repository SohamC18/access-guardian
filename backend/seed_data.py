import requests
import random

# The URL of your running FastAPI server
# Try localhost if 127.0.0.1 failed
# Change this line:
API_URL = "http://127.0.0.1:8000/update-role"

# Sample roles and their specific permissions
ROLES = {
    "HR": ["view_salaries", "edit_profiles", "onboard_users"],
    "Developer": ["access_github", "deploy_code", "read_logs"],
    "Finance": ["process_payments", "view_tax_data", "approve_expenses"],
    "DevOps": ["db_admin", "server_root", "manage_cloud"]
}

def seed_users():
    print("🚀 Starting Team Obsidian Data Seeder...")
    
    for i in range(1, 51):
        username = f"user_{i}"
        
        # Step 1: Give them an initial role
        initial_role = random.choice(list(ROLES.keys()))
        initial_perms = ROLES[initial_role]
        
        # Step 2: Simulate role changes (the "Creep" happens here)
        # We move them to a new role but they keep the old perms!
        final_role = random.choice(list(ROLES.keys()))
        final_perms = ROLES[final_role]
        
        payload = {
            "username": username,
            "new_role": final_role,
            "new_permissions": final_perms
        }
        
        # Send to your API
        response = requests.post(API_URL, json=payload)
        
        if response.status_code == 200:
            print(f"✅ Created {username}: Moved to {final_role} (Creep active)")
        else:
            print(f"❌ Failed to create {username}")

if __name__ == "__main__":
    seed_users()