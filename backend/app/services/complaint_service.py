"""
SafeSpeak AI - Cybercrime Complaint Generation Service
Provides factual, structured complaint drafting for digital crimes, financial fraud,
phishing, and social engineering incidents.
"""
from datetime import datetime, timezone
import re

class ComplaintService:
    VALID_CATEGORIES = [
        "Online financial fraud",
        "UPI or payment fraud",
        "Phishing or fake bank messages",
        "Fake job or internship offers",
        "Social media impersonation",
        "Account compromise",
        "Online shopping fraud",
        "Cyberbullying or online harassment",
        "Identity theft",
        "Suspicious website or link",
        "Other cybercrime"
    ]

    OFFICIAL_PORTAL_URL = "https://cybercrime.gov.in/"
    FINANCIAL_FRAUD_HELPLINE = "1930"

    @classmethod
    def validate_complaint_data(cls, data):
        """
        Validates complaint input data.
        Returns a tuple: (is_valid, errors_list)
        """
        errors = []
        if not data:
            return False, ["Complaint data payload is empty."]

        category = data.get("category", "").strip()
        if not category:
            errors.append("Incident category is required.")
        elif category not in cls.VALID_CATEGORIES:
            errors.append(f"Invalid category. Must be one of: {', '.join(cls.VALID_CATEGORIES)}")

        description = data.get("description", "").strip()
        if not description or len(description) < 10:
            errors.append("Incident description must be at least 10 characters long.")

        # Financial loss validation
        money_lost = bool(data.get("money_lost", False))
        if money_lost:
            amount = data.get("amount")
            if amount is None or str(amount).strip() == "":
                errors.append("Loss amount is required when money was lost.")
            else:
                try:
                    num_amount = float(amount)
                    if num_amount < 0:
                        errors.append("Loss amount cannot be negative.")
                except (ValueError, TypeError):
                    errors.append("Loss amount must be a valid number.")

        # Privacy check: Ensure user hasn't inadvertently entered raw OTP or password keywords
        # Warn if highly sensitive authentication secrets are detected
        combined_text = f"{description} {data.get('suspect_identifier', '')}"
        if re.search(r'\b(my password is|my otp is|my pin is)\b', combined_text, re.IGNORECASE):
            errors.append("Security Warning: Do not submit live passwords, PINs, or current OTPs in the complaint text.")

        return len(errors) == 0, errors

    @classmethod
    def generate_draft(cls, data):
        """
        Generates a professional, factual complaint draft formatted for submission
        to cybercrime reporting portals and law enforcement.
        """
        is_valid, errors = cls.validate_complaint_data(data)
        if not is_valid:
            raise ValueError("; ".join(errors))

        category = data.get("category", "Cybercrime Incident").strip()
        date_time = data.get("incident_date", datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")).strip()
        platform = data.get("platform", "Digital Communication Channel").strip()
        description = data.get("description", "").strip()
        suspect = data.get("suspect_identifier", "").strip() or "Not specifically identified / Under investigation"
        money_lost = bool(data.get("money_lost", False))
        amount = data.get("amount", "0")
        currency = data.get("currency", "INR").strip().upper()
        transaction_ref = data.get("transaction_ref", "").strip() or "N/A"
        bank_contacted = bool(data.get("bank_contacted", False))
        evidence_list = data.get("evidence_items", [])
        if isinstance(evidence_list, str):
            evidence_list = [item.strip() for item in evidence_list.split("\n") if item.strip()]

        scan_findings = data.get("scan_findings")  # Optional scan findings from SafeSpeak AI

        # Subject Line
        if money_lost:
            subject = f"COMPLAINT: Incident of {category} involving financial loss of {currency} {amount}"
        else:
            subject = f"COMPLAINT: Incident of {category} via {platform}"

        # Draft generation
        lines = [
            "=" * 72,
            "CYBERCRIME INCIDENT REPORT DRAFT",
            "Prepared using SafeSpeak AI Incident Documentation Assistant",
            "=" * 72,
            "",
            f"DATE OF REPORT : {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')} UTC",
            f"INCIDENT TYPE  : {category}",
            f"PRIMARY PORTAL : {cls.OFFICIAL_PORTAL_URL} (India: Helpline 1930)",
            "",
            "-" * 72,
            f"SUBJECT: {subject}",
            "-" * 72,
            "",
            "1. INCIDENT SUMMARY & TIMELINE:",
            f"   - Approximate Date & Time of Occurrence : {date_time}",
            f"   - Channel / Platform of Occurrence      : {platform}",
            f"   - Suspect Contact / Identifier / URL    : {suspect}",
            "",
            "2. DETAILED CHRONOLOGICAL STATEMENT:",
            f"   {description}",
            ""
        ]

        if money_lost:
            lines.extend([
                "3. FINANCIAL LOSS INFORMATION:",
                f"   - Total Amount Defrauded         : {currency} {amount}",
                f"   - Bank / Payment Transaction Ref : {transaction_ref}",
                f"   - Bank / Provider Notified       : {'Yes - Bank was alerted' if bank_contacted else 'No / In progress'}",
                "   - Emergency Helpline Status      : Advised to report immediately to 1930 for golden-hour freezing.",
                ""
            ])
        else:
            lines.extend([
                "3. FINANCIAL LOSS INFORMATION:",
                "   - Direct Financial Loss          : None reported at this time.",
                f"   - Bank / Provider Notified       : {'Yes' if bank_contacted else 'Not applicable'}",
                ""
            ])

        lines.extend([
            "4. EVIDENCE AVAILABLE & PRESERVED:",
            "   (The complainant maintains unaltered original records of the following):"
        ])

        if evidence_list:
            for item in evidence_list:
                lines.append(f"   [x] {item}")
        else:
            lines.append("   [x] Full unedited screenshots of communication with timestamps.")
            lines.append("   [x] Suspect phone numbers, email headers, or URL links.")
            if money_lost:
                lines.append("   [x] Bank transaction receipt and account debit statement.")

        lines.append("")

        if scan_findings:
            lines.extend([
                "5. AUTOMATED TECHNICAL TELEMETRY (SafeSpeak AI Scan Findings):",
                f"   - Assessed Risk Level : {scan_findings.get('risk_level', 'N/A')}",
                f"   - Risk Score          : {scan_findings.get('risk_score', 'N/A')}/100",
                f"   - Confidence Rating   : {scan_findings.get('confidence', 'N/A')}",
            ])
            signals = scan_findings.get("signals") or []
            if signals:
                signal_names = [s.get("title", s.get("signal_id", "")) for s in signals if isinstance(s, dict)]
                lines.append(f"   - Detected Red Flags  : {', '.join(signal_names)}")
            if scan_findings.get("explanation"):
                lines.append(f"   - Technical Notes     : {scan_findings.get('explanation')}")
            lines.append("   * Note: The above findings represent automated threat heuristic analysis.")
            lines.append("")

        lines.extend([
            "6. REQUESTED LAW ENFORCEMENT ACTION:",
            "   - Register this complaint under appropriate provisions of the Information Technology Act",
            "     and Indian Penal Code / Bharatiya Nyaya Sanhita (or applicable jurisdiction).",
            "   - Trace and block the fraudulent identifiers, bank accounts, or digital infrastructure.",
            f"   - Assist in potential fund recovery / lien marked via the National Cyber Crime Portal (1930)." if money_lost else "   - Take necessary preventive and investigative measures.",
            "",
            "7. DECLARATION:",
            "   I hereby confirm that the facts stated above are true and accurate to the best of my knowledge.",
            "   I have preserved the original digital evidence and will present it upon request.",
            "",
            "=" * 72,
            "IMPORTANT SUBMISSION ADVISORY:",
            "This draft has been prepared to facilitate your filing. You must now submit this information",
            f"directly at the official National Cyber Crime Reporting Portal: {cls.OFFICIAL_PORTAL_URL}",
            "If financial loss occurred, call 1930 immediately to freeze funds before they are withdrawn.",
            "=" * 72
        ])

        draft_text = "\n".join(lines)

        return {
            "subject": subject,
            "draft_text": draft_text,
            "category": category,
            "money_lost": money_lost,
            "amount": amount if money_lost else 0,
            "currency": currency,
            "official_portal_url": cls.OFFICIAL_PORTAL_URL,
            "helpline": cls.FINANCIAL_FRAUD_HELPLINE,
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
