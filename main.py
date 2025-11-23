from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS after app is defined

# SMTP config
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
    business_name = data.get('businessName', '')
    industry = data.get('industry', '')

    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = EMAIL_TO
    msg['Subject'] = f"New Lead from {source}"

    body = f"""
    You received a new lead:

    Name: {name}
    Email: {email}
    Phone: {phone}
    Business Name: {business_name}
    Industry: {industry}
    Source: {source}
    """
    msg.attach(MIMEText(body, 'plain'))

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

@app.route('/assessments', methods=['POST'])
def save_assessment():
    """Save calculator assessment data"""
    print("🔔 /assessments endpoint hit")
    data = request.json
    print("📊 Assessment data received")

    # In a production environment, you would save this to a database
    # For now, we'll send it via email

    name = data.get('name')
    email = data.get('email')
    business_name = data.get('businessName', 'N/A')
    score = data.get('score', 0)
    annual_revenue = data.get('annualRevenue', 0)

    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = EMAIL_TO
    msg['Subject'] = f"Exit Readiness Assessment: {business_name} (Score: {score})"

    body = f"""
    Exit Readiness Assessment Completed:

    === CONTACT INFO ===
    Name: {name}
    Email: {email}
    Phone: {data.get('phone', 'N/A')}
    Business: {business_name}

    === KEY METRICS ===
    Exit Readiness Score: {score}/100
    Annual Revenue: ${annual_revenue:,}
    Industry: {data.get('industry', 'N/A')}
    Years in Business: {data.get('yearsInBusiness', 'N/A')}
    Employees: {data.get('employeeCount', 'N/A')}

    === FINANCIAL ===
    EBITDA Margin: {data.get('ebitdaMargin', 'N/A')}%
    Growth Rate: {data.get('growthRate', 'N/A')}%
    Recurring Revenue: {data.get('recurringRevenue', 'N/A')}%
    Customer Concentration: {data.get('customerConcentration', 'N/A')}%

    === SYSTEMS (1-10) ===
    Process Documentation: {data.get('processDocumentation', 'N/A')}
    Owner Dependency: {data.get('ownerDependency', 'N/A')}
    Management Team: {data.get('managementTeam', 'N/A')}
    Customer Acquisition: {data.get('customerAcquisition', 'N/A')}
    Brand Strength: {data.get('brandStrength', 'N/A')}
    Tech Assets: {data.get('techAssets', 'N/A')}

    === MARKET ===
    Competitive Advantage: {data.get('competitiveAdvantage', 'N/A')}
    Market Conditions: {data.get('marketConditions', 'N/A')}
    Customer Retention: {data.get('customerRetention', 'N/A')}%
    Contract Terms: {data.get('contractTerms', 'N/A')}

    Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        print("✅ Assessment email sent successfully")
        return jsonify({"message": "Assessment saved successfully"}), 201
    except Exception as e:
        print("❌ Assessment email failed:", e)
        return jsonify({"error": "Failed to save assessment"}), 500

@app.route('/send-results', methods=['POST'])
def send_results():
    """Send results email to user"""
    print("🔔 /send-results endpoint hit")
    data = request.json

    recipient_email = data.get('email')
    name = data.get('name')
    score = data.get('score')

    if not recipient_email or not SMTP_USERNAME or not SMTP_PASSWORD:
        return jsonify({"error": "Email configuration missing"}), 500

    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = recipient_email
    msg['Subject'] = f"Your Exit Readiness Assessment Results (Score: {score})"

    body = f"""
    Hi {name},

    Thank you for completing the Business Exit Readiness Assessment!

    Your Exit Readiness Score: {score}/100

    Your personalized report is ready! You can download it from your results page or access it anytime using the link you received.

    Key Next Steps:
    1. Review your detailed PDF report
    2. Focus on the top 3 value gaps identified
    3. Consider scheduling a free consultation to discuss your exit strategy

    We're here to help you maximize your business value and achieve a successful exit.

    Book your free 30-minute consultation:
    [Your Calendly Link]

    Best regards,
    Business Exit Consulting Team

    ---
    This is an automated message. Please do not reply to this email.
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        print("✅ Results email sent to:", recipient_email)
        return jsonify({"message": "Results email sent successfully"}), 200
    except Exception as e:
        print("❌ Results email failed:", e)
        return jsonify({"error": "Failed to send results email"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
