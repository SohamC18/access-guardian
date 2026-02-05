# backend/setup.py
import sqlite3
import os
from datetime import datetime, timedelta
import random

# In setup.py, ensure it creates db in backend folder:
def setup_database():
    print("🔧 Setting up Access Guardian database...")
    
    # Database should be in current directory (backend/)
    db_path = 'obsidian.db'
    
    # Remove if exists in current directory
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"🗑️  Removed old database from {os.path.abspath(db_path)}")
    
    # ... rest of your code ...
def setup_database():
    print("🔧 Setting up Access Guardian database...")
    
    # Connect to database (creates if doesn't exist)
    db_path = 'obsidian.db'
    
    # Remove old database if exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print("🗑️  Removed old database")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Read and execute schema
    with open('schema.sql', 'r') as f:
        schema = f.read()
        cursor.executescript(schema)
    print("✅ Created database tables")
    
    # Insert sample users
    sample_users = [
        ('alice', 'admin', '{"read": true, "write": true, "delete": true}'),
        ('bob', 'developer', '{"read": true, "write": true, "delete": false}'),
        ('charlie', 'viewer', '{"read": true, "write": false, "delete": false}'),
        ('diana', 'manager', '{"read": true, "write": true, "delete": false}'),
        ('eve', 'analyst', '{"read": true, "write": false, "delete": false}')
    ]
    
    cursor.executemany(
        "INSERT INTO users (username, role, permissions) VALUES (?, ?, ?)",
        sample_users
    )
    print(f"✅ Added {len(sample_users)} sample users")
    
    # Insert sample access logs
    resources = ['financial_db', 'hr_system', 'prod_server', 'backup_files', 'admin_panel']
    actions = ['read', 'write', 'delete', 'execute']
    
    logs = []
    for user_id in range(1, 6):  # For each user
        for _ in range(20):  # 20 logs per user
            timestamp = datetime.now() - timedelta(days=random.randint(0, 30))
            logs.append((
                user_id,
                random.choice(resources),
                random.choice(actions),
                timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                random.choice([True, False])  # is_anomaly
            ))
    
    cursor.executemany(
        """INSERT INTO access_logs 
        (user_id, resource, action, timestamp, is_anomaly) 
        VALUES (?, ?, ?, ?, ?)""",
        logs
    )
    print(f"✅ Added {len(logs)} sample access logs")
    
    # Insert sample anomalies
    anomalies = [
        (1, 'Privilege escalation detected', 'CRITICAL', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
        (3, 'Unusual access time', 'MEDIUM', (datetime.now() - timedelta(hours=2)).strftime('%Y-%m-%d %H:%M:%S')),
        (2, 'Access to sensitive resource', 'HIGH', (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S'))
    ]
    
    cursor.executemany(
        "INSERT INTO anomalies (user_id, description, severity, detected_at) VALUES (?, ?, ?, ?)",
        anomalies
    )
    print(f"✅ Added {len(anomalies)} sample anomalies")
    
    conn.commit()
    conn.close()
    
    print("🎉 Database setup complete!")
    print(f"📁 Database created at: {os.path.abspath(db_path)}")
    print("\n👉 Next steps:")
    print("1. Start backend: python main.py")
    print("2. Start frontend: cd ../dashboard && npm start")
    print("3. Open http://localhost:3000")

if __name__ == "__main__":
    setup_database()