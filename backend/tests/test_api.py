import os
import json
import pytest
import io
from app import create_app
from app.config.config import Config

class TestConfig(Config):
    TESTING = True
    DATABASE_PATH = os.path.join(os.path.dirname(__file__), "test_safespeak.db")
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "test_uploads")

@pytest.fixture
def client():
    app = create_app(TestConfig)
    with app.test_client() as client:
        yield client
    # Cleanup test db
    if os.path.exists(TestConfig.DATABASE_PATH):
        try:
            os.remove(TestConfig.DATABASE_PATH)
        except Exception:
            pass

# ============================================================================
# Core Health & Stats Tests
# ============================================================================

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "healthy"
    assert "ai_mode" in data

def test_demo_samples_dynamic_scoring(client):
    res = client.get("/api/demo/samples")
    assert res.status_code == 200
    data = res.get_json()
    assert "samples" in data
    assert len(data["samples"]) >= 5
    for s in data["samples"]:
        assert "calculated_score" in s
        assert 0 <= s["calculated_score"] <= 100
        assert s["expected_risk"] in ["LOW", "MEDIUM", "HIGH"]

def test_dashboard_stats(client):
    res = client.get("/api/dashboard/stats")
    assert res.status_code == 200
    data = res.get_json()
    assert "total_scans" in data
    assert "high_risk_count" in data
    assert "type_distribution" in data

# ============================================================================
# Safe Content Tests
# ============================================================================

def test_safe_work_invitation(client):
    payload = {
        "message": "Hi Team, the project design sync is confirmed for tomorrow at 3:00 PM on Google Meet. Please find the agenda attached in our shared workspace drive.",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "LOW"
    assert data["risk_score"] < 35
    assert len(data["warning_signals"]) == 0
    assert "No significant warning indicators" in data["summary"]

def test_safe_meeting_schedule(client):
    payload = {
        "message": "Let's schedule our sprint planning for next Monday morning at 10 AM. Let me know if that time works for you.",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "LOW"
    assert data["risk_score"] < 35

def test_safe_ordinary_message(client):
    payload = {
        "message": "Hey Priya, hope you are doing well! Are you free for lunch tomorrow near the cafeteria?",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "LOW"
    assert data["risk_score"] < 35

# ============================================================================
# Suspicious Content Tests
# ============================================================================

def test_suspicious_payment_request(client):
    payload = {
        "message": "Please pay registration fee of Rs 1500 immediately to confirm your seat via Google Pay UPI.",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    assert data["risk_score"] >= 65
    signal_ids = [s["signal_id"] for s in data["warning_signals"]]
    assert "PAYMENT_REQUEST" in signal_ids

def test_suspicious_otp_request(client):
    payload = {
        "message": "Dear customer, your bank account transaction requires verification. Share your 6-digit OTP code with our agent to prevent suspension.",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    signal_ids = [s["signal_id"] for s in data["warning_signals"]]
    assert "OTP_REQUEST" in signal_ids

def test_suspicious_fake_internship(client):
    payload = {
        "message": "Congratulations! You have been selected for an exclusive internship at TechVanguard Solutions. Pay ₹999 registration fee within 30 minutes to confirm your position. Click here: http://secure-job-enroll.biz/pay",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    assert data["risk_score"] >= 70
    assert "risk_story" in data
    assert data["risk_story"]["trigger"] != ""
    assert data["risk_story"]["pressure"] != ""
    assert data["risk_story"]["request"] != ""
    assert data["risk_story"]["potential_risk"] != ""

def test_suspicious_fake_bank_alert(client):
    payload = {
        "message": "Dear SBI Customer, Your A/C XX4892 is temporarily blocked due to pending KYC verification. Update PAN immediately at http://sbi-banking-kyc-update.xyz/verify-pan within 24 hours.",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    signal_ids = [s["signal_id"] for s in data["warning_signals"]]
    assert "ACCOUNT_SUSPENSION" in signal_ids or "IMPERSONATION" in signal_ids

def test_suspicious_prize_lottery_scam(client):
    payload = {
        "message": "DEAR WINNER! Your mobile number won cash prize of Rs 25,00,000 in KBC All India Lucky Draw 2026. Contact WhatsApp Manager and pay Rs 1500 processing fee now.",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    signal_ids = [s["signal_id"] for s in data["warning_signals"]]
    assert "REWARD_OR_PRIZE" in signal_ids

def test_suspicious_account_suspension_threat(client):
    payload = {
        "message": "FINAL NOTICE: Your electricity connection will be disconnected tonight at 9:30 PM due to unpaid penalty. Legal action will be taken immediately.",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    signal_ids = [s["signal_id"] for s in data["warning_signals"]]
    assert "THREAT_LANGUAGE" in signal_ids or "URGENCY" in signal_ids

def test_suspicious_url_phishing(client):
    payload = {
        "url": "http://sbi-banking-kyc-update.xyz/verify-pan",
        "is_demo": True
    }
    res = client.post("/api/analyze/url", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    assert data["risk_score"] >= 65
    assert len(data["warning_signals"]) >= 2
    assert "confidence" in data
    assert data["confidence"] in ["High", "Medium"]

def test_safe_url_benign(client):
    payload = {
        "url": "https://www.google.com",
        "is_demo": True
    }
    res = client.post("/api/analyze/url", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "LOW"
    assert data["risk_score"] < 35
    assert "No significant warning indicators" in data["summary"]

# ============================================================================
# Edge Cases & Multilingual (Tamil & Unicode) Tests
# ============================================================================

def test_edge_case_empty_input(client):
    res = client.post("/api/analyze/message", json={"message": "   "})
    assert res.status_code == 400
    assert "error" in res.get_json()

def test_edge_case_long_input(client):
    # 5,000 character input
    long_msg = "Hello team, please review this draft document. " * 120
    res = client.post("/api/analyze/message", json={"message": long_msg, "is_demo": True})
    assert res.status_code == 200
    data = res.get_json()
    assert "risk_score" in data
    assert 0 <= data["risk_score"] <= 100

def test_edge_case_repeated_warning_words_duplicate_protection(client):
    # Test that repeating the same urgency words does not inflate score uncontrollably
    base_msg = "Urgent: Action required within 30 minutes."
    repeated_msg = "Urgent! Urgent! Immediately! Urgent within 30 minutes! Hurry! Last chance! Act now! Immediately!"
    
    res_base = client.post("/api/analyze/message", json={"message": base_msg, "is_demo": True}).get_json()
    res_rep = client.post("/api/analyze/message", json={"message": repeated_msg, "is_demo": True}).get_json()
    
    # Both should be identified as URGENCY and the score contribution should be capped under 30
    urgency_signal = next((s for s in res_rep["warning_signals"] if s["signal_id"] == "URGENCY"), None)
    assert urgency_signal is not None
    assert urgency_signal["score_contribution"] <= 25

def test_edge_case_tamil_unicode_message(client):
    # Tamil text asking for immediate payment
    tamil_msg = "உடனடியாக ரூ. 999 கட்டணம் செலுத்தவும். வேலை உறுதி செய்யப்படும்."
    res = client.post("/api/analyze/message", json={"message": tamil_msg, "is_demo": True})
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    signal_ids = [s["signal_id"] for s in data["warning_signals"]]
    assert "URGENCY" in signal_ids or "PAYMENT_REQUEST" in signal_ids
    assert "Tamil Unicode text processed" in data["summary"]

def test_edge_case_tamil_english_mixed_message(client):
    # Code-mixed Tamil + English
    mixed_msg = "SBI வங்கி KYC update உடனடியாக செய்யவும் இல்லையெனில் account blocked ஆகும். Click: http://sbi-update.xyz"
    res = client.post("/api/analyze/message", json={"message": mixed_msg, "is_demo": True})
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    assert data["risk_score"] >= 65

def test_edge_case_malformed_url(client):
    res = client.post("/api/analyze/url", json={"url": "http://[invalid-ipv6-bracket/path", "is_demo": True})
    assert res.status_code == 200
    data = res.get_json()
    assert data["risk_level"] == "HIGH"
    signal_ids = [s["signal_id"] for s in data["warning_signals"]]
    assert "MALFORMED_URL_SYNTAX" in signal_ids

def test_structured_signals_schema(client):
    payload = {
        "message": "Congratulations! You won cash prize. Pay ₹500 fee within 10 minutes.",
        "is_demo": True
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert len(data["warning_signals"]) > 0
    for s in data["warning_signals"]:
        assert "signal_id" in s
        assert "title" in s
        assert "description" in s
        assert "severity" in s
        assert s["severity"] in ["critical", "high", "medium", "low"]
        assert "evidence" in s
        assert "score_contribution" in s
        assert isinstance(s["score_contribution"], int)

def test_history_persistence_and_deletion(client):
    res = client.post("/api/analyze/message", json={"message": "Urgent alert! Pay Rs 500 now or account blocked.", "is_demo": True})
    scan_id = res.get_json()["scan_id"]
    
    # Retrieve history
    hist = client.get("/api/history").get_json()["scans"]
    matching = next((s for s in hist if s["scan_id"] == scan_id), None)
    assert matching is not None
    assert matching["confidence"] in ["High", "Medium", "Low"]
    assert matching["engine"] in ["rule-based", "hybrid"]

    # Delete
    del_res = client.delete(f"/api/history/{scan_id}")
    assert del_res.status_code == 200


# ============================================================================
# Cybercrime Complaint Assistance System Tests
# ============================================================================

def test_complaint_categories(client):
    res = client.get("/api/complaint/categories")
    assert res.status_code == 200
    data = res.get_json()
    assert "categories" in data
    assert len(data["categories"]) >= 10
    assert "Phishing or fake bank messages" in data["categories"]
    assert "Online financial fraud" in data["categories"]
    assert data["official_portal_url"] == "https://cybercrime.gov.in/"
    assert data["helpline"] == "1930"

def test_complaint_draft_generation_success(client):
    payload = {
        "category": "Phishing or fake bank messages",
        "incident_date": "2026-10-01 14:30 UTC",
        "platform": "SMS / WhatsApp",
        "description": "Received an urgent SMS claiming my SBI bank account was blocked due to pending KYC.",
        "suspect_identifier": "+91-9876543210 / http://sbi-banking-kyc.xyz",
        "money_lost": False,
        "evidence_items": [
            "Screenshot of WhatsApp message with timestamp",
            "Copy of phishing URL"
        ]
    }
    res = client.post("/api/complaint/generate-draft", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert "draft_text" in data
    assert "SUBJECT:" in data["draft_text"]
    assert "INCIDENT SUMMARY & TIMELINE" in data["draft_text"]
    assert "https://cybercrime.gov.in/" in data["draft_text"]
    assert "1930" in data["draft_text"]
    assert "Phishing or fake bank messages" in data["draft_text"]

def test_complaint_draft_financial_guidance(client):
    payload = {
        "category": "UPI or payment fraud",
        "incident_date": "2026-10-02 10:15 UTC",
        "platform": "Telegram",
        "description": "Was induced to pay an internship registration fee via GooglePay UPI.",
        "suspect_identifier": "fraudster@upi",
        "money_lost": True,
        "amount": 999,
        "currency": "INR",
        "transaction_ref": "UPI/20261002/987654321",
        "bank_contacted": True
    }
    res = client.post("/api/complaint/generate-draft", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["money_lost"] is True
    assert "FINANCIAL LOSS INFORMATION:" in data["draft_text"]
    assert "INR 999" in data["draft_text"]
    assert "UPI/20261002/987654321" in data["draft_text"]
    assert "1930" in data["draft_text"]

def test_complaint_draft_with_scan_findings(client):
    payload = {
        "category": "Fake job or internship offers",
        "description": "Offered fraudulent internship requiring upfront security deposit.",
        "money_lost": False,
        "scan_findings": {
            "risk_level": "HIGH",
            "risk_score": 98,
            "confidence": "High",
            "explanation": "Artificial urgency and advance fee solicitation detected.",
            "signals": [
                {"title": "Upfront Internship / Job Fee Demanded", "signal_id": "JOB_OR_INTERNSHIP_FEE"},
                {"title": "Urgent Pressuring Language", "signal_id": "URGENCY"}
            ]
        }
    }
    res = client.post("/api/complaint/generate-draft", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert "AUTOMATED TECHNICAL TELEMETRY" in data["draft_text"]
    assert "HIGH" in data["draft_text"]
    assert "98/100" in data["draft_text"]

def test_complaint_validation_empty_or_short(client):
    # Empty description
    res = client.post("/api/complaint/generate-draft", json={"category": "Other cybercrime", "description": "short"})
    assert res.status_code == 400
    assert "at least 10 characters" in res.get_json()["error"]

def test_complaint_privacy_warning_on_sensitive_input(client):
    # Entering live password/OTP keywords
    payload = {
        "category": "Account compromise",
        "description": "Someone hacked my account. Note: my password is secret123."
    }
    res = client.post("/api/complaint/generate-draft", json=payload)
    assert res.status_code == 400
    assert "Security Warning: Do not submit live passwords" in res.get_json()["error"]

def test_complaint_official_portal_link_validity(client):
    res = client.get("/api/complaint/categories")
    assert res.status_code == 200
    data = res.get_json()
    # Ensure exact official government URL and verified emergency helpline
    assert data["official_portal_url"] == "https://cybercrime.gov.in/"
    assert data["helpline"] == "1930"

# ============================================================================
# Screenshot Scanner & OCR Real Image Tests
# ============================================================================

def _generate_synthetic_image(text_lines):
    import io
    from PIL import Image, ImageDraw, ImageFont
    try:
        font = ImageFont.truetype('arial.ttf', 24)
    except Exception:
        font = ImageFont.load_default(size=20)

    img = Image.new('RGB', (800, 60 + len(text_lines) * 50), color='white')
    d = ImageDraw.Draw(img)
    y = 25
    for line in text_lines:
        d.text((30, y), line, fill='black', font=font)
        y += 50

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf

def test_screenshot_extract_unique_image_a(client):
    lines = [
        "TEST SCREENSHOT 84721",
        "Congratulations! You have been selected for a remote job.",
        "Pay Rs 999 registration fee today to activate your offer.",
        "Contact test-scam-84721@example.com."
    ]
    img_buf = _generate_synthetic_image(lines)
    data = {"image": (img_buf, "screenshot_a.png", "image/png")}
    res = client.post("/api/analyze/screenshot/extract", data=data, content_type="multipart/form-data")
    assert res.status_code == 200
    result = res.get_json()
    extracted = result.get("extracted_text", "")
    assert "84721" in extracted
    assert "999" in extracted
    assert "registration fee" in extracted

def test_screenshot_extract_unique_image_b(client):
    lines = [
        "Your package delivery is scheduled for tomorrow.",
        "Track your package using the official delivery app."
    ]
    img_buf = _generate_synthetic_image(lines)
    data = {"image": (img_buf, "screenshot_b.png", "image/png")}
    res = client.post("/api/analyze/screenshot/extract", data=data, content_type="multipart/form-data")
    assert res.status_code == 200
    result = res.get_json()
    extracted = result.get("extracted_text", "")
    assert "package delivery" in extracted
    assert "official delivery app" in extracted
    # Ensure Screenshot A text does NOT appear
    assert "84721" not in extracted
    assert "999" not in extracted

def test_screenshot_extract_blank_image(client):
    import io
    from PIL import Image
    blank_img = Image.new('RGB', (400, 200), color='white')
    buf = io.BytesIO()
    blank_img.save(buf, format='PNG')
    buf.seek(0)

    data = {"image": (buf, "blank.png", "image/png")}
    res = client.post("/api/analyze/screenshot/extract", data=data, content_type="multipart/form-data")
    assert res.status_code == 200
    result = res.get_json()
    assert result.get("extracted_text") == ""
    assert "No readable text was detected" in result.get("message", "")

def test_screenshot_analyze_multipart_image_a(client):
    lines = [
        "TEST SCREENSHOT 84721",
        "Congratulations! You have been selected for a remote job.",
        "Pay Rs 999 registration fee today to activate your offer.",
        "Contact test-scam-84721@example.com."
    ]
    img_buf = _generate_synthetic_image(lines)
    data = {"image": (img_buf, "screenshot_a.png", "image/png")}
    res = client.post("/api/analyze/screenshot", data=data, content_type="multipart/form-data")
    assert res.status_code == 200
    analysis = res.get_json()
    assert analysis["risk_level"] == "HIGH"
    assert analysis["risk_score"] >= 80
    assert "84721" in analysis["extracted_text"]
    signals = [s["signal_id"] for s in analysis.get("warning_signals", [])]
    assert "PAYMENT_REQUEST" in signals or "JOB_OR_INTERNSHIP_FEE" in signals

def test_screenshot_analyze_missing_image(client):
    res = client.post("/api/analyze/screenshot", data={}, content_type="multipart/form-data")
    assert res.status_code == 400
    assert "Please upload a screenshot image." in res.get_json()["error"]


