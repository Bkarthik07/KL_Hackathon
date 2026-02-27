from twilio.rest import Client
import os

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_WHATSAPP_NUMBER")

client = Client(account_sid, auth_token)

def send_whatsapp(to_number, message):
    from_whatsapp = f"whatsapp:{twilio_number}"
    to_whatsapp = f"whatsapp:{to_number}"
    client.messages.create(
        body=message,
        from_=from_whatsapp,
        to=to_whatsapp
    )