import os
import sqlite3
import json
import uuid
from datetime import datetime, timezone

CURRENT_DB_PATH = None

def get_db_path(db_path=None):
    global CURRENT_DB_PATH
    if db_path:
        CURRENT_DB_PATH = db_path
    return CURRENT_DB_PATH or os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "safespeak.db")

def get_connection(db_path=None):
    path = get_db_path(db_path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_path=None):
    path = get_db_path(db_path)
    with get_connection(path) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                scan_id TEXT UNIQUE NOT NULL,
                created_at TEXT NOT NULL,
                content_type TEXT NOT NULL,
                input_content TEXT NOT NULL,
                extracted_text TEXT,
                risk_level TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                confidence TEXT DEFAULT 'High',
                engine TEXT DEFAULT 'rule-based',
                summary TEXT NOT NULL,
                warning_signals TEXT NOT NULL,
                risk_story TEXT NOT NULL,
                recommended_actions TEXT NOT NULL,
                explanation TEXT NOT NULL,
                is_demo INTEGER NOT NULL DEFAULT 0
            )
        """)
        # Safe migrations for existing databases
        try:
            cursor.execute("ALTER TABLE scans ADD COLUMN confidence TEXT DEFAULT 'High'")
        except Exception:
            pass
        try:
            cursor.execute("ALTER TABLE scans ADD COLUMN engine TEXT DEFAULT 'rule-based'")
        except Exception:
            pass

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_scans_risk_level ON scans(risk_level)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_scans_content_type ON scans(content_type)")
        conn.commit()

        # Seed initial demo scans if table is empty
        cursor.execute("SELECT COUNT(*) FROM scans")
        count = cursor.fetchone()[0]
        if count == 0:
            seed_initial_data(conn)

def seed_initial_data(conn):
    cursor = conn.cursor()
    sample_scans = [
        {
            "scan_id": "demo-scan-001",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content_type": "message",
            "input_content": "Congratulations! You have been selected for an exclusive internship at Google Partners. Pay ₹999 registration fee within 30 minutes to confirm your position. Click here: http://secure-job-enroll.biz/pay",
            "extracted_text": None,
            "risk_level": "HIGH",
            "risk_score": 87,
            "confidence": "High",
            "engine": "rule-based",
            "summary": "High-risk indicators detected. Fraudulent internship lure combining artificial urgency, upfront payment demand, and an unverified HTTP link.",
            "warning_signals": json.dumps([
                {
                    "signal_id": "URGENCY",
                    "title": "Urgent language",
                    "description": "Scammers enforce tight artificial deadlines to prevent you from researching or verifying the offer.",
                    "explanation": "Scammers enforce tight artificial deadlines to prevent you from researching or verifying the offer.",
                    "severity": "high",
                    "evidence": "within 30 minutes",
                    "quote": "within 30 minutes",
                    "score_contribution": 25
                },
                {
                    "signal_id": "PAYMENT_REQUEST",
                    "title": "Payment request",
                    "description": "Legitimate companies and top internships never charge registration fees or onboarding charges.",
                    "explanation": "Legitimate companies and top internships never charge registration fees or onboarding charges.",
                    "severity": "critical",
                    "evidence": "Pay ₹999 registration fee",
                    "quote": "Pay ₹999 registration fee",
                    "score_contribution": 30
                },
                {
                    "signal_id": "SUSPICIOUS_URL",
                    "title": "Suspicious unverified link",
                    "description": "Uses insecure HTTP protocol and an unofficial third-party domain mimicking legitimate corporate portals.",
                    "explanation": "Uses insecure HTTP protocol and an unofficial third-party domain mimicking legitimate corporate portals.",
                    "severity": "high",
                    "evidence": "http://secure-job-enroll.biz/pay",
                    "quote": "http://secure-job-enroll.biz/pay",
                    "score_contribution": 20
                },
                {
                    "signal_id": "REWARD_OR_PRIZE",
                    "title": "Unverified opportunity claim",
                    "description": "Selection without prior formal interview rounds or standard verification pipeline is a hallmark of internship fraud.",
                    "explanation": "Selection without prior formal interview rounds or standard verification pipeline is a hallmark of internship fraud.",
                    "severity": "high",
                    "evidence": "Congratulations! You have been selected",
                    "quote": "Congratulations! You have been selected",
                    "score_contribution": 20
                }
            ]),
            "risk_story": json.dumps({
                "trigger": "Congratulations! You have been selected for an exclusive internship.",
                "pressure": "Pay registration fee within 30 minutes to confirm your position.",
                "request": "Pay ₹999 registration fee via external link.",
                "potential_risk": "Direct financial loss of ₹999 plus potential exposure of payment card details to an unencrypted phishing portal."
            }),
            "recommended_actions": json.dumps([
                "Do not click the provided link or submit payment.",
                "Do not send ₹999 or transfer funds via UPI / QR code.",
                "Never share OTPs, CVV, or passwords on unverified sites.",
                "Verify internship offers on the company's official careers portal.",
                "Report the message to cybersecurity authorities or your college placement cell."
            ]),
            "explanation": "This message is trying to rush you into paying money for an internship before you have time to check if it is real. Genuine employers do not charge registration fees to give you a job.",
            "is_demo": 1
        },
        {
            "scan_id": "demo-scan-002",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content_type": "url",
            "input_content": "http://sbi-banking-kyc-update.xyz/verify-pan",
            "extracted_text": None,
            "risk_level": "HIGH",
            "risk_score": 92,
            "confidence": "High",
            "engine": "url-heuristics",
            "summary": "High-risk indicators detected on sbi-banking-kyc-update.xyz. Brand impersonation, deceptive domain name, and missing HTTPS encryption.",
            "warning_signals": json.dumps([
                {
                    "signal_id": "UNENCRYPTED_HTTP",
                    "title": "Missing HTTPS encryption",
                    "description": "Insecure HTTP connection transmits sensitive banking credentials in plain text.",
                    "explanation": "Insecure HTTP connection transmits sensitive banking credentials in plain text.",
                    "severity": "medium",
                    "evidence": "http://",
                    "quote": "http://",
                    "score_contribution": 20
                },
                {
                    "signal_id": "BRAND_IMPERSONATION_URL",
                    "title": "Brand impersonation in subdomain/domain",
                    "description": "Unofficial third-party domain attempting to impersonate official banking domains (onlinesbi.sbi).",
                    "explanation": "Unofficial third-party domain attempting to impersonate official banking domains (onlinesbi.sbi).",
                    "severity": "high",
                    "evidence": "sbi-banking-kyc-update.xyz",
                    "quote": "sbi-banking-kyc-update.xyz",
                    "score_contribution": 35
                },
                {
                    "signal_id": "SUSPICIOUS_PATH_KEYWORDS",
                    "title": "Sensitive credential harvesting path",
                    "description": "Pretends to collect KYC and PAN details to steal net banking identities.",
                    "explanation": "Pretends to collect KYC and PAN details to steal net banking identities.",
                    "severity": "medium",
                    "evidence": "Keywords: verify, pan",
                    "quote": "Keywords: verify, pan",
                    "score_contribution": 20
                }
            ]),
            "risk_story": json.dumps({
                "trigger": "Notice regarding mandatory banking KYC verification.",
                "pressure": "Threat of account restriction or suspension.",
                "request": "Enter banking credentials and PAN on unverified website.",
                "potential_risk": "Full account takeover, unauthorized fund transfers, and identity theft."
            }),
            "recommended_actions": json.dumps([
                "Do not enter passwords, PINs, or PAN details on this link.",
                "Banks never request KYC updates via unofficial third-party domains.",
                "Always access your bank by manually typing their official URL in your browser.",
                "Immediately contact your bank's fraud helpline (e.g., 1930 in India) if credentials were entered."
            ]),
            "explanation": "This website is a fake banking page built to steal your bank password and personal identity details. It does not belong to the real bank.",
            "is_demo": 1
        },
        {
            "scan_id": "demo-scan-003",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content_type": "message",
            "input_content": "Hi Team, the project design sync is confirmed for tomorrow at 3:00 PM on Google Meet. Please find the agenda attached in our shared workspace drive.",
            "extracted_text": None,
            "risk_level": "LOW",
            "risk_score": 12,
            "confidence": "High",
            "engine": "rule-based",
            "summary": "No significant warning indicators were detected from the content provided.",
            "warning_signals": json.dumps([]),
            "risk_story": json.dumps({
                "trigger": "Routine work calendar notification.",
                "pressure": "None detected (standard scheduling).",
                "request": "Attend scheduled meeting and review internal agenda.",
                "potential_risk": "Minimal risk detected under standard digital hygiene practices."
            }),
            "recommended_actions": json.dumps([
                "Normal business communication.",
                "Ensure meeting links correspond to your organization's standard collaboration suite."
            ]),
            "explanation": "This appears to be a legitimate, routine work message. It does not ask for money, passwords, or personal secrets, and does not create fake urgency.",
            "is_demo": 1
        }
    ]
    for s in sample_scans:
        cursor.execute("""
            INSERT INTO scans (
                scan_id, created_at, content_type, input_content, extracted_text,
                risk_level, risk_score, confidence, engine, summary, warning_signals, risk_story,
                recommended_actions, explanation, is_demo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            s["scan_id"], s["created_at"], s["content_type"], s["input_content"], s["extracted_text"],
            s["risk_level"], s["risk_score"], s.get("confidence", "High"), s.get("engine", "rule-based"),
            s["summary"], s["warning_signals"], s["risk_story"],
            s["recommended_actions"], s["explanation"], s["is_demo"]
        ))
    conn.commit()

def save_scan(data, db_path=None):
    scan_id = data.get("scan_id") or data.get("analysis_id") or str(uuid.uuid4())
    created_at = data.get("created_at") or data.get("timestamp") or datetime.now(timezone.utc).isoformat()
    content_type = data.get("content_type", "message")
    input_content = data.get("input_content", "")
    extracted_text = data.get("extracted_text")
    risk_level = data.get("risk_level", "LOW")
    risk_score = int(data.get("risk_score", 0))
    confidence = data.get("confidence", "High")
    engine = data.get("engine", "rule-based")
    summary = data.get("summary", "")
    
    warning_signals = data.get("warning_signals") or data.get("signals") or []
    if not isinstance(warning_signals, str):
        warning_signals = json.dumps(warning_signals)

    risk_story = data.get("risk_story", {})
    if not isinstance(risk_story, str):
        risk_story = json.dumps(risk_story)

    recommended_actions = data.get("recommended_actions", [])
    if not isinstance(recommended_actions, str):
        recommended_actions = json.dumps(recommended_actions)

    explanation = data.get("explanation", "")
    is_demo = 1 if data.get("is_demo") else 0

    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO scans (
                scan_id, created_at, content_type, input_content, extracted_text,
                risk_level, risk_score, confidence, engine, summary, warning_signals, risk_story,
                recommended_actions, explanation, is_demo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            scan_id, created_at, content_type, input_content, extracted_text,
            risk_level, risk_score, confidence, engine, summary, warning_signals, risk_story,
            recommended_actions, explanation, is_demo
        ))
        conn.commit()
    
    return scan_id

def row_to_dict(row):
    d = dict(row)
    try:
        d["warning_signals"] = json.loads(d["warning_signals"])
    except Exception:
        d["warning_signals"] = []
    d["signals"] = d["warning_signals"]
    try:
        d["risk_story"] = json.loads(d["risk_story"])
    except Exception:
        d["risk_story"] = {}
    try:
        d["recommended_actions"] = json.loads(d["recommended_actions"])
    except Exception:
        d["recommended_actions"] = []
    d["is_demo"] = bool(d["is_demo"])
    d["confidence"] = d.get("confidence") or "High"
    d["engine"] = d.get("engine") or "rule-based"
    return d

def get_scans(limit=50, content_type=None, risk_level=None, db_path=None):
    query = "SELECT * FROM scans WHERE 1=1"
    params = []
    if content_type:
        query += " AND content_type = ?"
        params.append(content_type)
    if risk_level:
        query += " AND risk_level = ?"
        params.append(risk_level.upper())
    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)

    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [row_to_dict(r) for r in rows]

def get_scan_by_id(scan_id, db_path=None):
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM scans WHERE scan_id = ?", (scan_id,))
        row = cursor.fetchone()
        return row_to_dict(row) if row else None

def delete_scan(scan_id, db_path=None):
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM scans WHERE scan_id = ?", (scan_id,))
        conn.commit()
        return cursor.rowcount > 0

def clear_all_scans(db_path=None):
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM scans")
        conn.commit()
        return True

def get_dashboard_stats(db_path=None):
    with get_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM scans")
        total_scans = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM scans WHERE risk_level = 'HIGH'")
        high_risk_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM scans WHERE risk_level = 'MEDIUM'")
        medium_risk_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM scans WHERE risk_level = 'LOW'")
        low_risk_count = cursor.fetchone()[0]

        cursor.execute("""
            SELECT content_type, COUNT(*) as count 
            FROM scans 
            GROUP BY content_type
        """)
        type_dist = {r["content_type"]: r["count"] for r in cursor.fetchall()}

        cursor.execute("SELECT * FROM scans ORDER BY created_at DESC LIMIT 5")
        recent_scans = [row_to_dict(r) for r in cursor.fetchall()]

        return {
            "total_scans": total_scans,
            "high_risk_count": high_risk_count,
            "medium_risk_count": medium_risk_count,
            "low_risk_count": low_risk_count,
            "type_distribution": {
                "message": type_dist.get("message", 0),
                "screenshot": type_dist.get("screenshot", 0),
                "url": type_dist.get("url", 0)
            },
            "recent_scans": recent_scans
        }
