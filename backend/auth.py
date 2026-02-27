import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app

def generate_token(user_id, role, patient_id=None, doctor_id=None):
    # include any relevant IDs so that downstream authorization checks can
    # validate ownership without extra DB lookups.
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    if patient_id is not None:
        payload['patient_id'] = patient_id
    if doctor_id is not None:
        payload['doctor_id'] = doctor_id

    token = jwt.encode(payload, current_app.config['JWT_SECRET'], algorithm='HS256')
    # PyJWT may return bytes in older versions
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def decode_token(token):
    try:
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        payload = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token missing'}), 401
        payload = decode_token(token)
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        request.user = payload
        return f(*args, **kwargs)
    return decorated

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if request.user.get('role') not in allowed_roles:
                return jsonify({'error': 'Forbidden'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator