import sqlite3
import sys
import os
from dotenv import load_dotenv
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from backend.auth_utils import hash_password

load_dotenv()
DB_PATH = os.getenv('DATABASE_PATH', 'data/patients.db')

conn = sqlite3.connect(DB_PATH)
# Add hospital
conn.execute("INSERT OR IGNORE INTO hospitals (name) VALUES ('General Hospital')")
# Add doctor
conn.execute("""
    INSERT OR IGNORE INTO doctors (name, phone, email, hospital_id)
    VALUES ('Dr. Smith', '+15551234567', 'smith@hospital.com', 1)
""")
# Add patient
conn.execute("""
    INSERT OR IGNORE INTO patients (phone, name, surgery_date, primary_doctor_id)
    VALUES ('+917893929482', 'Bommidi Karthik', '2025-03-01', 1)
""")
conn.commit()
conn.close()

def create_user(username, password, role, patient_id=None, doctor_id=None):
    """Create a user account in the users table"""
    password_hash = hash_password(password)
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        INSERT OR IGNORE INTO users (username, password_hash, role, patient_id, doctor_id)
        VALUES (?, ?, ?, ?, ?)
    """, (username, password_hash, role, patient_id, doctor_id))
    conn.commit()
    conn.close()
    print(f"Created {role} user: {username}")

# Create user accounts
create_user('+1234567890', 'patient123', 'patient', patient_id=1)
create_user('doctor@hospital.com', 'doc456', 'doctor', doctor_id=1)
create_user('admin', 'adminpass', 'admin')