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
        user['id'], user['role'],
        patient_id=user.get('patient_id'),
        doctor_id=user.get('doctor_id')
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