import sqlite3
from datetime import datetime, timedelta

def init_auth_tables():
    """Initialize authentication database tables"""
    try:
        conn = sqlite3.connect('obsidian.db')
        cursor = conn.cursor()
        
        # Create access requests table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS access_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                reason TEXT,
                status TEXT DEFAULT 'pending',
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                reviewed_at TIMESTAMP
            )
        ''')
        
        print("✅ Authentication tables created successfully")
        
        # Add some sample requests for demo
        sample_requests = [
            ("John Doe", "john@example.com", "Need access to HR system for employee onboarding"),
            ("Jane Smith", "jane@example.com", "Finance department requires payment processing access"),
            ("Bob Johnson", "bob@example.com", "Developer needing GitHub access for new project")
        ]
        
        for name, email, reason in sample_requests:
            cursor.execute('''
                INSERT OR IGNORE INTO access_requests (name, email, reason, status)
                VALUES (?, ?, ?, ?)
            ''', (name, email, reason, "pending"))
        
        conn.commit()
        print(f"✅ Added {len(sample_requests)} sample access requests")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error initializing auth tables: {e}")
        return False

if __name__ == "__main__":
    init_auth_tables()