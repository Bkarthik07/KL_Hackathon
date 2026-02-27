#!/usr/bin/env python
"""Seed database with test users and sample data"""

import sqlite3
import sys
import os
from datetime import datetime, timedelta
import json
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.auth_utils import hash_password
from backend.database import init_db

# Ensure database is initialized
print("Initializing database...")
init_db()

DB_PATH = 'data/patients.db'

def seed_data():
    """Seed database with test data and conversations"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Clear old data
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM conversations")
    cursor.execute("DELETE FROM alerts")
    cursor.execute("DELETE FROM patients")
    cursor.execute("DELETE FROM doctors")
    cursor.execute("DELETE FROM hospitals")
    
    # Create hospital
    cursor.execute("INSERT INTO hospitals (id, name) VALUES (1, 'General Hospital')")
    
    # Create doctors
    cursor.execute("""
        INSERT INTO doctors (id, name, phone, email, hospital_id)
        VALUES (1, 'Dr. Smith', '+15551234567', 'smith@hospital.com', 1)
    """)
    cursor.execute("""
        INSERT INTO doctors (id, name, phone, email, hospital_id)
        VALUES (2, 'Dr. Johnson', '+15551234568', 'johnson@hospital.com', 1)
    """)
    
    # Create patients
    cursor.execute("""
        INSERT INTO patients (id, phone, name, surgery_date, surgery_type, primary_doctor_id, hospital_id, is_active)
        VALUES (1, '+917893929482', 'John Doe', '2025-02-20', 'Knee Surgery', 1, 1, 1)
    """)
    cursor.execute("""
        INSERT INTO patients (id, phone, name, surgery_date, surgery_type, primary_doctor_id, hospital_id, is_active)
        VALUES (2, '+917893929483', 'Jane Smith', '2025-02-15', 'Hip Surgery', 2, 1, 1)
    """)
    cursor.execute("""
        INSERT INTO patients (id, phone, name, surgery_date, surgery_type, primary_doctor_id, hospital_id, is_active)
        VALUES (3, '+917893929484', 'Robert Brown', '2025-02-10', 'Shoulder Surgery', 1, 1, 1)
    """)
    
    # Create users
    users = [
        ('patient', 'password123', 'patient', 1, None),
        ('doctor', 'password123', 'doctor', None, 1),
        ('admin', 'password123', 'admin', None, None),
    ]
    
    for username, password, role, patient_id, doctor_id in users:
        password_hash = hash_password(password)
        cursor.execute("""
            INSERT INTO users (username, password_hash, role, patient_id, doctor_id)
            VALUES (?, ?, ?, ?, ?)
        """, (username, password_hash, role, patient_id, doctor_id))
        print(f"✅ Created user: {username} (role: {role})")
    
    # Add sample conversations with pain data
    print("\n📝 Adding sample conversations...")
    conversations = [
        {
            'patient_id': 1,
            'doctor_id': 1,
            'message': 'I have pain in my knee when walking',
            'response': 'Take pain medication as prescribed and do gentle exercises. Contact if pain increases.',
            'pain_level': 6,
            'risk_level': 'MEDIUM',
            'days_ago': 6
        },
        {
            'patient_id': 1,
            'doctor_id': 1,
            'message': 'Pain is better today, swelling reduced',
            'response': 'Great progress! Continue with physical therapy. Pain management is going well.',
            'pain_level': 4,
            'risk_level': 'LOW',
            'days_ago': 5
        },
        {
            'patient_id': 1,
            'doctor_id': 1,
            'message': 'Had some discomfort tonight',
            'response': 'This is normal during recovery. Elevate your leg and apply ice. Call if severe pain occurs.',
            'pain_level': 5,
            'risk_level': 'MEDIUM',
            'days_ago': 4
        },
        {
            'patient_id': 1,
            'doctor_id': 1,
            'message': 'Feeling much better now',
            'response': 'Excellent! Your recovery is on track. Continue current treatment plan.',
            'pain_level': 3,
            'risk_level': 'LOW',
            'days_ago': 3
        },
        {
            'patient_id': 1,
            'doctor_id': 1,
            'message': 'Pain almost gone, can walk without crutches',
            'response': 'Fantastic progress! You are recovering well. Keep up with physical therapy.',
            'pain_level': 2,
            'risk_level': 'LOW',
            'days_ago': 2
        },
        {
            'patient_id': 1,
            'doctor_id': 1,
            'message': 'Slight cramping, otherwise feeling great',
            'response': 'Cramping is normal during recovery. Continue exercises and stretches.',
            'pain_level': 1,
            'risk_level': 'LOW',
            'days_ago': 1
        },
        {
            'patient_id': 2,
            'doctor_id': 2,
            'message': 'Hip surgery recovery, some pain and difficulty walking',
            'response': 'Pain is expected. Use crutches as advised and take prescribed pain medication.',
            'pain_level': 7,
            'risk_level': 'MEDIUM',
            'days_ago': 4
        },
        {
            'patient_id': 2,
            'doctor_id': 2,
            'message': 'Pain improving but still stiff',
            'response': 'Stiffness is normal. Continue gentle range of motion exercises.',
            'pain_level': 5,
            'risk_level': 'MEDIUM',
            'days_ago': 3
        },
        {
            'patient_id': 3,
            'doctor_id': 1,
            'message': 'Shoulder pain is severe after surgery',
            'response': 'HIGH PAIN ALERT: Please rest and elevate arm. Take prescribed pain medication and contact clinic if pain persists.',
            'pain_level': 8,
            'risk_level': 'HIGH',
            'days_ago': 3
        },
        {
            'patient_id': 3,
            'doctor_id': 1,
            'message': 'Pain is better with medication',
            'response': 'Good. Continue current medication. Start gentle shoulder movements if pain allows.',
            'pain_level': 6,
            'risk_level': 'MEDIUM',
            'days_ago': 2
        },
    ]
    
    for conv in conversations:
        days_ago = conv.pop('days_ago')
        created_at = (datetime.now() - timedelta(days=days_ago)).isoformat()
        
        symptoms = {
            'pain_level': conv.pop('pain_level'),
            'swelling': 'mild' if conv['patient_id'] == 1 else 'moderate',
            'mobility': 'improving' if conv['patient_id'] == 1 else 'limited'
        }
        
        cursor.execute("""
            INSERT INTO conversations 
            (patient_id, doctor_id, channel, patient_message, agent_response, extracted_symptoms, risk_level, created_at)
            VALUES (?, ?, 'whatsapp', ?, ?, ?, ?, ?)
        """, (
            conv['patient_id'],
            conv['doctor_id'],
            conv['message'],
            conv['response'],
            json.dumps(symptoms),
            conv['risk_level'],
            created_at
        ))
    
    print(f"✅ Added {len(conversations)} sample conversations")
    
    # Add sample alerts
    print("\n🚨 Adding sample alerts...")
    alerts = [
        {
            'patient_id': 3,
            'doctor_id': 1,
            'type': 'HIGH_RISK',
            'reason': 'High pain level (8/10) reported - patient may need intervention',
            'acknowledged': 0,
            'days_ago': 2
        },
        {
            'patient_id': 2,
            'doctor_id': 2,
            'type': 'WARNING',
            'reason': 'Patient not responding to messages - check on status',
            'acknowledged': 0,
            'days_ago': 1
        },
        {
            'patient_id': 3,
            'doctor_id': 1,
            'type': 'CRITICAL',
            'reason': 'Potential infection risk - fever reported in previous check-in',
            'acknowledged': 1,
            'days_ago': 1
        },
    ]
    
    for alert in alerts:
        days_ago = alert.pop('days_ago')
        acknowledged = alert.pop('acknowledged')
        created_at = (datetime.now() - timedelta(days=days_ago)).isoformat()
        
        cursor.execute("""
            INSERT INTO alerts 
            (patient_id, doctor_id, alert_type, reason, acknowledged, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            alert['patient_id'],
            alert['doctor_id'],
            alert['type'],
            alert['reason'],
            acknowledged,
            created_at
        ))
    
    print(f"✅ Added {len(alerts)} sample alerts")
    
    conn.commit()
    conn.close()
    print("\n✅ Database seeded successfully with sample data!")

if __name__ == "__main__":
    try:
        seed_data()
        print("\n🎉 Ready to login with:")
        print("   Patient: patient / password123")
        print("   Doctor:  doctor / password123")
        print("   Admin:   admin / password123")
        print("\n📊 Sample data includes:")
        print("   - 3 test patients with past surgeries")
        print("   - 10 conversations with pain level tracking")
        print("   - Pain trend data for graphs")
        print("   - 3 alerts (acknowledged and pending)")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)