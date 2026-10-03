import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from app.services.ai_service import AIAnalysisService, RuleBasedAnalysisEngine
from app.services.url_service import URLAnalysisService
from app.services.ocr_service import OCRService
from app.services.complaint_service import ComplaintService
from app.models.database import (
    save_scan,
    get_scans,
    get_scan_by_id,
    delete_scan,
    clear_all_scans,
    get_dashboard_stats
)
from app.utils.validators import sanitize_text, is_valid_url_format

api_bp = Blueprint("api", __name__)

RAW_DEMO_SAMPLES = [
    {
        "id": "sample-internship",
        "title": "Fake Internship Offer",
        "category": "Internship Scam",
        "content_type": "message",
        "text": "Congratulations! You have been selected for an exclusive internship at TechVanguard Solutions. Pay ₹999 registration fee within 30 minutes to confirm your position. Click here: http://secure-job-enroll.biz/pay"
    },
    {
        "id": "sample-bank",
        "title": "Fake Bank KYC Alert",
        "category": "Banking Phishing",
        "content_type": "message",
        "text": "Dear SBI Customer, Your A/C XX4892 is temporarily blocked due to pending KYC verification. To avoid permanent suspension, update your PAN & Aadhaar details immediately at http://sbi-banking-kyc-update.xyz/verify-pan within 24 hours."
    },
    {
        "id": "sample-lottery",
        "title": "Prize / Lottery Scam",
        "category": "Lottery Fraud",
        "content_type": "message",
        "text": "DEAR WINNER! Your mobile number won cash prize of Rs 25,00,000 in KBC All India Lucky Draw 2026. To claim your prize cheque, contact WhatsApp Manager Mr. Rana on +91-9876543210 and pay Rs 1,500 file processing fee now. Ticket ID: KBC-998822."
    },
    {
        "id": "sample-login",
        "title": "Suspicious Login Security Alert",
        "category": "Credential Theft",
        "content_type": "message",
        "text": "SECURITY ALERT: We detected an unauthorized login attempt to your Amazon account from Moscow, Russia. If this was not you, verify your identity immediately to protect your saved payment methods: http://amazon-account-protection.site/restore"
    },
    {
        "id": "sample-legit",
        "title": "Normal Legitimate Meeting Invite",
        "category": "Normal Message",
        "content_type": "message",
        "text": "Hi Team, the project design sync is confirmed for tomorrow at 3:00 PM on Google Meet. Please find the agenda attached in our shared workspace drive. See you then! - Priya"
    },
    {
        "id": "sample-url-phish",
        "title": "Suspicious Banking URL",
        "category": "Phishing Link",
        "content_type": "url",
        "text": "http://sbi-banking-kyc-update.xyz/verify-pan"
    },
    {
        "id": "sample-url-legit",
        "title": "Legitimate Official Domain",
        "category": "Verified URL",
        "content_type": "url",
        "text": "https://www.onlinesbi.sbi"
    }
]


@api_bp.route("/health", methods=["GET"])
def health_check():
    ai_key_present = bool(current_app.config.get("AI_API_KEY"))
    return jsonify({
        "status": "healthy",
        "service": "SafeSpeak AI API",
        "ai_provider_configured": ai_key_present,
        "ai_mode": "LLM_ENABLED" if ai_key_present else "HEURISTIC_RULE_ENGINE_ACTIVE"
    })


@api_bp.route("/demo/samples", methods=["GET"])
def get_demo_samples():
    """
    Computes sample metadata dynamically via the real analysis engine
    to prevent arbitrary hardcoded scores.
    """
    computed_samples = []
    for s in RAW_DEMO_SAMPLES:
        if s["content_type"] == "url":
            res = URLAnalysisService.analyze(s["text"])
        else:
            res = RuleBasedAnalysisEngine.analyze(s["text"], content_type=s["content_type"], is_demo=True)
        
        computed_samples.append({
            "id": s["id"],
            "title": s["title"],
            "category": s["category"],
            "content_type": s["content_type"],
            "text": s["text"],
            "tag": f"{res['risk_level']} ({res['risk_score']}/100)",
            "expected_risk": res["risk_level"],
            "calculated_score": res["risk_score"],
            "confidence": res.get("confidence", "High")
        })

    return jsonify({"samples": computed_samples})


@api_bp.route("/dashboard/stats", methods=["GET"])
def dashboard_stats():
    try:
        stats = get_dashboard_stats(current_app.config["DATABASE_PATH"])
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve dashboard stats: {str(e)}"}), 500


@api_bp.route("/analyze/message", methods=["POST"])
def analyze_message():
    try:
        data = request.get_json(force=True, silent=True) or {}
        raw_message = data.get("message", "")
        is_demo = bool(data.get("is_demo", False))

        message = sanitize_text(raw_message)
        if not message:
            return jsonify({"error": "Message text cannot be empty."}), 400

        ai_service = AIAnalysisService(
            api_key=current_app.config.get("AI_API_KEY"),
            provider=current_app.config.get("AI_PROVIDER", "auto"),
            model=current_app.config.get("AI_MODEL", "gemini-2.5-flash")
        )

        analysis = ai_service.analyze(message, content_type="message", is_demo=is_demo)

        scan_id = str(uuid.uuid4())
        scan_record = {
            "scan_id": scan_id,
            "content_type": "message",
            "input_content": message,
            "extracted_text": None,
            "risk_level": analysis["risk_level"],
            "risk_score": analysis["risk_score"],
            "confidence": analysis.get("confidence", "High"),
            "engine": analysis.get("engine", "rule-based"),
            "summary": analysis["summary"],
            "warning_signals": analysis.get("signals") or analysis.get("warning_signals", []),
            "risk_story": analysis["risk_story"],
            "recommended_actions": analysis["recommended_actions"],
            "explanation": analysis["explanation"],
            "is_demo": analysis.get("is_demo", is_demo)
        }

        save_scan(scan_record, current_app.config["DATABASE_PATH"])
        analysis["scan_id"] = scan_id
        analysis["analysis_id"] = scan_id
        analysis["content_type"] = "message"
        analysis["input_content"] = message

        return jsonify(analysis), 200

    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@api_bp.route("/analyze/url", methods=["POST"])
def analyze_url():
    try:
        data = request.get_json(force=True, silent=True) or {}
        raw_url = data.get("url", "")
        is_demo = bool(data.get("is_demo", False))

        cleaned_url = sanitize_text(raw_url, max_length=2048)
        if not cleaned_url:
            return jsonify({"error": "URL cannot be empty."}), 400

        analysis = URLAnalysisService.analyze(cleaned_url)
        scan_id = str(uuid.uuid4())

        scan_record = {
            "scan_id": scan_id,
            "content_type": "url",
            "input_content": cleaned_url,
            "extracted_text": None,
            "risk_level": analysis["risk_level"],
            "risk_score": analysis["risk_score"],
            "confidence": analysis.get("confidence", "High"),
            "engine": analysis.get("engine", "url-heuristics"),
            "summary": analysis["summary"],
            "warning_signals": analysis.get("signals") or analysis.get("warning_signals", []),
            "risk_story": analysis["risk_story"],
            "recommended_actions": analysis["recommended_actions"],
            "explanation": analysis["explanation"],
            "is_demo": is_demo
        }

        save_scan(scan_record, current_app.config["DATABASE_PATH"])
        analysis["scan_id"] = scan_id
        analysis["analysis_id"] = scan_id
        analysis["content_type"] = "url"
        analysis["input_content"] = cleaned_url
        analysis["is_demo"] = is_demo

        return jsonify(analysis), 200

    except Exception as e:
        return jsonify({"error": f"URL analysis failed: {str(e)}"}), 500


@api_bp.route("/analyze/screenshot/extract", methods=["POST"])
def extract_screenshot_text():
    """
    Step 1 of Screenshot Scanner:
    Extract text from uploaded screenshot and return for user review.
    """
    try:
        file = request.files.get("image") or request.files.get("file")
        if not file or not file.filename:
            return jsonify({"error": "Please upload a screenshot image."}), 400

        preset_hint = request.form.get("preset_hint")
        extracted_info = OCRService.process_image(file, preset_hint=preset_hint)
        return jsonify(extracted_info), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"OCR processing failed: {str(e)}"}), 500


@api_bp.route("/analyze/screenshot", methods=["POST"])
def analyze_screenshot():
    """
    Step 2 of Screenshot Scanner:
    Analyzes the reviewed/edited extracted text from a screenshot or directly analyzes an uploaded image.
    """
    try:
        file = request.files.get("image") or request.files.get("file")
        preset_hint = request.form.get("preset_hint") if not request.is_json else None
        
        if request.is_json:
            data = request.get_json() or {}
            extracted_text = sanitize_text(data.get("extracted_text", ""))
            filename = data.get("filename", "screenshot.png")
            is_demo = bool(data.get("is_demo", False))
        elif file and file.filename:
            filename = file.filename
            is_demo = request.form.get("is_demo", "false").lower() == "true"
            # If user already edited/reviewed text in frontend, respect it; otherwise run OCR
            form_text = request.form.get("extracted_text")
            if form_text and form_text.strip():
                extracted_text = sanitize_text(form_text)
            else:
                extracted_info = OCRService.process_image(file, preset_hint=preset_hint)
                extracted_text = extracted_info.get("extracted_text", "")
        else:
            return jsonify({"error": "Please upload a screenshot image."}), 400

        if not extracted_text or not extracted_text.strip():
            return jsonify({
                "error": "SafeSpeak could not read text from this screenshot. Try a clearer screenshot with readable text."
            }), 400

        ai_service = AIAnalysisService(
            api_key=current_app.config.get("AI_API_KEY"),
            provider=current_app.config.get("AI_PROVIDER", "auto"),
            model=current_app.config.get("AI_MODEL", "gemini-2.5-flash")
        )

        analysis = ai_service.analyze(extracted_text, content_type="screenshot", is_demo=is_demo)

        scan_id = str(uuid.uuid4())
        scan_record = {
            "scan_id": scan_id,
            "content_type": "screenshot",
            "input_content": f"[Screenshot: {filename}]",
            "extracted_text": extracted_text,
            "risk_level": analysis["risk_level"],
            "risk_score": analysis["risk_score"],
            "confidence": analysis.get("confidence", "High"),
            "engine": analysis.get("engine", "rule-based"),
            "summary": analysis["summary"],
            "warning_signals": analysis.get("signals") or analysis.get("warning_signals", []),
            "risk_story": analysis["risk_story"],
            "recommended_actions": analysis["recommended_actions"],
            "explanation": analysis["explanation"],
            "is_demo": analysis.get("is_demo", is_demo)
        }

        save_scan(scan_record, current_app.config["DATABASE_PATH"])
        analysis["scan_id"] = scan_id
        analysis["analysis_id"] = scan_id
        analysis["content_type"] = "screenshot"
        analysis["input_content"] = f"[Screenshot: {filename}]"
        analysis["extracted_text"] = extracted_text

        return jsonify(analysis), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Screenshot analysis failed: {str(e)}"}), 500


@api_bp.route("/history", methods=["GET"])
def list_history():
    try:
        limit = min(100, int(request.args.get("limit", 50)))
        content_type = request.args.get("content_type")
        risk_level = request.args.get("risk_level")

        scans = get_scans(
            limit=limit,
            content_type=content_type,
            risk_level=risk_level,
            db_path=current_app.config["DATABASE_PATH"]
        )
        return jsonify({"scans": scans})
    except Exception as e:
        return jsonify({"error": f"Failed to list history: {str(e)}"}), 500


@api_bp.route("/history/<scan_id>", methods=["GET"])
def get_scan_detail(scan_id):
    try:
        scan = get_scan_by_id(scan_id, db_path=current_app.config["DATABASE_PATH"])
        if not scan:
            return jsonify({"error": "Scan record not found."}), 404
        return jsonify(scan)
    except Exception as e:
        return jsonify({"error": f"Failed to get scan: {str(e)}"}), 500


@api_bp.route("/history/<scan_id>", methods=["DELETE"])
def remove_scan(scan_id):
    try:
        deleted = delete_scan(scan_id, db_path=current_app.config["DATABASE_PATH"])
        if not deleted:
            return jsonify({"error": "Scan record not found or already deleted."}), 404
        return jsonify({"success": True, "scan_id": scan_id})
    except Exception as e:
        return jsonify({"error": f"Failed to delete scan: {str(e)}"}), 500


@api_bp.route("/history", methods=["DELETE"])
def clear_history():
    try:
        clear_all_scans(db_path=current_app.config["DATABASE_PATH"])
        return jsonify({"success": True, "message": "Scan history cleared successfully."})
    except Exception as e:
        return jsonify({"error": f"Failed to clear history: {str(e)}"}), 500


@api_bp.route("/complaint/categories", methods=["GET"])
def get_complaint_categories():
    """Returns valid incident categories and official emergency reporting helplines."""
    return jsonify({
        "categories": ComplaintService.VALID_CATEGORIES,
        "official_portal_url": ComplaintService.OFFICIAL_PORTAL_URL,
        "helpline": ComplaintService.FINANCIAL_FRAUD_HELPLINE
    })


@api_bp.route("/complaint/generate-draft", methods=["POST"])
def generate_complaint_draft():
    """Generates a professional, factual cybercrime complaint draft."""
    try:
        data = request.get_json(force=True, silent=True) or {}
        draft_result = ComplaintService.generate_draft(data)
        return jsonify(draft_result), 200
    except ValueError as val_err:
        return jsonify({"error": str(val_err)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to generate complaint draft: {str(e)}"}), 500

