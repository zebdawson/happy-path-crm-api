from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

app = Flask(__name__)

# Load email and SMTP config from environment variables
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_TO = os.getenv("EMAIL_TO")
@app.route("/", methods=["GET"])
def root():
    return "Happy Path CRM API is live!"

@app.route('/leads', methods=['POST'])
def collect_lead():
    print("🔔 /leads endpoint hit")
    data = request.json
    print("📨 Received data:", data)

    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    source = data.get('source', 'ChatGPT Assistant')

    # Create the email message
    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = EMAIL_TO
    msg['Subject'] = f"New Lead from {source}"

    body = f"""
    You received a new lead:

    Name: {name}
    Email: {email}
    Phone: {phone}
    Source: {source}
    """
    msg.attach(MIMEText(body, 'plain'))

    # Send the email
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        print("✅ Email sent successfully to:", EMAIL_TO)
        return jsonify({"message": "Lead submitted successfully"}), 201
    except Exception as e:
        print("❌ Email sending failed:", e)
        return jsonify({"error": "Failed to send lead"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
