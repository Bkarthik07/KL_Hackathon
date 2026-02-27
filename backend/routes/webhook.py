from flask import Blueprint, request
from twilio.twiml.messaging_response import MessagingResponse
from backend.services.agent import run_agent
from backend.database import get_db
import json

webhook_bp = Blueprint('webhook', __name__)

@webhook_bp.route('/whatsapp', methods=['POST'])
def whatsapp_reply():
    incoming_msg = request.form.get('Body')
    sender = request.form.get('From')
    phone = sender.replace('whatsapp:', '')

    db = get_db()
    patient = db.execute("SELECT id, name FROM patients WHERE phone = ? AND is_active=1", (phone,)).fetchone()
    if not patient:
        resp = MessagingResponse()
        resp.message("You are not registered.")
        return str(resp)

    final_state = run_agent(patient['id'], incoming_msg)
    reply = final_state['response']

    db.execute("""
        INSERT INTO conversations (patient_id, patient_message, agent_response, extracted_symptoms, risk_level)
        VALUES (?, ?, ?, ?, ?)
    """, (patient['id'], incoming_msg, reply,
          json.dumps({"symptoms": final_state['symptoms'], "pain": final_state['pain_level']}),
          final_state['risk']))
    db.commit()

    resp = MessagingResponse()
    resp.message(reply)
    return str(resp)