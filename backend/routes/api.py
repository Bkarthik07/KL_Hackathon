from flask import Blueprint, jsonify, request, g
from backend.database import get_db
from backend.auth import token_required, role_required
from backend.auth_utils import check_password
from backend.auth import generate_token
import json

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@api_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    phone = data.get('phone')
    role = data.get('role', 'patient')  # default to patient
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    if role == 'patient' and not phone:
        return jsonify({'error': 'Phone number required for patient registration'}), 400

    db = get_db()
    # check if user exists
    existing = db.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    if existing:
        return jsonify({'error': 'Username already taken'}), 409

    # optionally create patient entry
    patient_id = None
    if role == 'patient':
        try:
            cur = db.execute(
                "INSERT INTO patients (phone, name, is_active) VALUES (?, ?, 1)",
                (phone, username)
            )
            patient_id = cur.lastrowid
        except Exception as e:
            # could be unique constraint on phone
            return jsonify({'error': 'Unable to create patient record: {}'.format(str(e))}), 400

    # create user
    from backend.auth_utils import hash_password
    pwd_hash = hash_password(password)
    db.execute(
        "INSERT INTO users (username, password_hash, role, patient_id) VALUES (?, ?, ?, ?)",
        (username, pwd_hash, role, patient_id)
    )
    db.commit()
    return jsonify({'status': 'registered'}), 201


@api_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    db = get_db()
    user = db.execute("""
        SELECT id, username, password_hash, role, patient_id, doctor_id
        FROM users WHERE username = ?
    """, (username,)).fetchone()
    if not user or not check_password(password, user['password_hash']):
        return jsonify({'error': 'Invalid credentials'}), 401

    # attach the associated patient/doctor IDs so they are embedded in the JWT
    token = generate_token(
        user['id'], user['role']
    )
    return jsonify({
        'token': token,
        'role': user['role'],
        'patient_id': user['patient_id'],
        'doctor_id': user['doctor_id']
    })

@api_bp.route('/patients', methods=['GET'])
@token_required
@role_required('admin', 'doctor')
def get_patients():
    db = get_db()
    patients = db.execute("SELECT id, name, phone, surgery_date, is_active FROM patients").fetchall()
    return jsonify([dict(p) for p in patients])

@api_bp.route('/patients/<int:pid>', methods=['GET'])
@token_required
@role_required('doctor', 'admin')
def get_patient(pid):
    db = get_db()
    patient = db.execute("SELECT * FROM patients WHERE id = ?", (pid,)).fetchone()
    if not patient:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(dict(patient))

@api_bp.route('/patients/<int:pid>/conversations', methods=['GET'])
@token_required
@role_required('patient', 'doctor', 'admin')
def patient_conversations(pid):
    if request.user['role'] == 'patient' and request.user.get('patient_id') != pid:
        return jsonify({'error': 'Forbidden'}), 403
    db = get_db()
    convs = db.execute("""
        SELECT id, patient_message, agent_response, extracted_symptoms, risk_level, created_at
        FROM conversations WHERE patient_id = ? ORDER BY created_at DESC
    """, (pid,)).fetchall()
    return jsonify([dict(c) for c in convs])

@api_bp.route('/patients/<int:pid>/pain-trend', methods=['GET'])
@token_required
@role_required('patient', 'doctor', 'admin')
def pain_trend(pid):
    if request.user['role'] == 'patient' and request.user.get('patient_id') != pid:
        return jsonify({'error': 'Forbidden'}), 403
    db = get_db()
    rows = db.execute("""
        SELECT date(created_at) as day,
               json_extract(extracted_symptoms, '$.pain_level') as pain
        FROM conversations
        WHERE patient_id = ? AND json_extract(extracted_symptoms, '$.pain_level') IS NOT NULL
        ORDER BY day
    """, (pid,)).fetchall()
    return jsonify([{"date": r["day"], "pain": r["pain"]} for r in rows])

@api_bp.route('/alerts', methods=['GET'])
@token_required
@role_required('doctor', 'admin')
def get_alerts():
    db = get_db()
    alerts = db.execute("""
        SELECT alerts.id, patients.name, alerts.alert_type, alerts.reason, alerts.acknowledged, alerts.created_at
        FROM alerts JOIN patients ON alerts.patient_id = patients.id
        WHERE alerts.acknowledged = 0
        ORDER BY alerts.created_at DESC
    """).fetchall()
    return jsonify([dict(a) for a in alerts])

@api_bp.route('/alerts/<int:aid>/acknowledge', methods=['POST'])
@token_required
@role_required('doctor', 'admin')
def acknowledge_alert(aid):
    db = get_db()
    db.execute("UPDATE alerts SET acknowledged = 1, acknowledged_at = CURRENT_TIMESTAMP WHERE id = ?", (aid,))
    db.commit()
    return jsonify({"status": "ok"})

@api_bp.route('/hospital/stats', methods=['GET'])
@token_required
@role_required('admin')
def hospital_stats():
    db = get_db()
    
    # Total active patients
    total_patients = db.execute(
        "SELECT COUNT(*) as count FROM patients WHERE is_active = 1"
    ).fetchone()['count']
    
    # Total doctors
    total_doctors = db.execute(
        "SELECT COUNT(*) as count FROM doctors"
    ).fetchone()['count']
    
    # Active alerts
    active_alerts = db.execute(
        "SELECT COUNT(*) as count FROM alerts WHERE acknowledged = 0"
    ).fetchone()['count']
    
    # High risk patients (high risk alerts)
    high_risk_patients = db.execute(
        "SELECT COUNT(DISTINCT patient_id) as count FROM alerts WHERE acknowledged = 0 AND alert_type = 'HIGH_RISK'"
    ).fetchone()['count']
    
    # Recovery rate (patients with recent conversations)
    recovery_rate = db.execute(
        "SELECT COUNT(DISTINCT patient_id) as count FROM conversations WHERE created_at >= datetime('now', '-7 days')"
    ).fetchone()['count']
    
    return jsonify({
        'total_patients': total_patients,
        'total_doctors': total_doctors,
        'active_alerts': active_alerts,
        'high_risk_patients': high_risk_patients,
        'recovery_rate': recovery_rate
    })

@api_bp.route('/hospital/alerts-summary', methods=['GET'])
@token_required
@role_required('admin')
def hospital_alerts_summary():
    db = get_db()
    
    alerts = db.execute("""
        SELECT alerts.id, patients.name, alerts.alert_type, alerts.reason, alerts.created_at
        FROM alerts 
        JOIN patients ON alerts.patient_id = patients.id
        WHERE alerts.acknowledged = 0
        ORDER BY alerts.created_at DESC
        LIMIT 20
    """).fetchall()
    
    return jsonify([dict(a) for a in alerts])

@api_bp.route('/hospital/patient-list', methods=['GET'])
@token_required
@role_required('admin')
def hospital_patient_list():
    db = get_db()
    
    patients = db.execute("""
        SELECT 
            p.id, p.name, p.phone, p.surgery_date, p.surgery_type, 
            p.is_active, d.name as doctor_name,
            COUNT(c.id) as conversation_count,
            (SELECT COUNT(*) FROM alerts WHERE patient_id = p.id AND acknowledged = 0) as alert_count
        FROM patients p
        LEFT JOIN doctors d ON p.primary_doctor_id = d.id
        LEFT JOIN conversations c ON p.id = c.patient_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
    """).fetchall()
    
    return jsonify([dict(p) for p in patients])