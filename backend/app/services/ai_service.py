import os
import re
import json
import uuid
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

class RuleBasedAnalysisEngine:
    """
    Intelligent cybersecurity heuristic engine with duplicate-signal protection,
    weighted multi-factor scoring, structured signal objects, confidence calibration,
    and Unicode / Tamil multilingual support.
    """

    PATTERNS_CONFIG = {
        "URGENCY": {
            "title": "Urgent or Pressuring Language",
            "description": "Artificial deadlines or coercive urgency rush the recipient to prevent careful verification.",
            "severity": "high",
            "base_score": 20,
            "max_cap": 25,
            "patterns": [
                r"\b(within\s+\d+\s*(?:minutes?|mins?|hours?|hrs?|days?))\b",
                r"\b(immediately|urgent(?:ly)?|hurry|act\s+now|last\s+chance|before\s+it\s+expires|expir(?:ing|ed)\s+today)\b",
                r"\b(final\s+notice|suspended\s+tonight|disconnected\s+tonight|limited\s+time\s+only|action\s+required\s+now)\b",
                r"(உடனடியாக|இன்றே|கடைசி\s*வாய்ப்பு|24\s*மணி\s*நேரத்திற்குள்|விரைவாக)"
            ]
        },
        "PAYMENT_REQUEST": {
            "title": "Payment / Fee Request",
            "description": "Demanding upfront monetary payments, registration charges, or crypto transfers is a primary fraud indicator.",
            "severity": "critical",
            "base_score": 35,
            "max_cap": 40,
            "patterns": [
                r"(?:₹|rs\.?|inr|\$)\s*(\d+(?:,\d+)*(?:\.\d+)?)",
                r"\b(registration\s+fee|processing\s+fee|security\s+deposit|refundable\s+amount|advance\s+payment|enrollment\s+fee)\b",
                r"\b(pay\s+(?:now|online|fee)|transfer\s+(?:money|funds)|upi|google\s*pay|phonepe|paytm\s+transfer|crypto|gift\s*card)\b",
                r"(?:ரூ\.?|ரூபாய்)\s*(\d+)",
                r"(பணம்|கட்டணம்|ரூபாய்|ரூ\.)"
            ]
        },
        "JOB_OR_INTERNSHIP_FEE": {
            "title": "Job / Internship Registration Fee",
            "description": "Legitimate employers never charge candidates registration fees or training deposits to secure employment.",
            "severity": "critical",
            "base_score": 25,
            "max_cap": 30,
            "patterns": [
                r"\b(?:internship|job|position|offer\s+letter|hiring|interview)\b.*?\b(?:fee|pay|₹|rs|deposit|charge)\b",
                r"\b(?:fee|pay|₹|rs|deposit|charge)\b.*?\b(?:internship|job|position|offer\s+letter|hiring)\b",
                r"(?:வேலை|பணி).*?(?:கட்டணம்|பணம்|ரூ\.)"
            ]
        },
        "OTP_REQUEST": {
            "title": "Request for OTP / One-Time Password",
            "description": "Legitimate organizations never ask users to disclose one-time authorization codes over text or chat.",
            "severity": "critical",
            "base_score": 65,
            "max_cap": 75,
            "patterns": [
                r"\b(otp|one\s+time\s+password|security\s+code|passcode|verification\s+code|auth\s+code)\b",
                r"(ஒடிபி|ரகசிய\s*எண்)"
            ]
        },
        "CREDENTIAL_REQUEST": {
            "title": "Request for Passwords / Security PINs",
            "description": "Direct requests for secret passwords, ATM PINs, or banking credentials indicate credential-theft attempts.",
            "severity": "critical",
            "base_score": 65,
            "max_cap": 75,
            "patterns": [
                r"\b(password|pin\s+number|atm\s+pin|cvv|netbanking\s+password|login\s+credentials|secret\s+key)\b",
                r"(கடவுச்சொல்|பின்\s*எண்)"
            ]
        },
        "PERSONAL_INFORMATION_REQUEST": {
            "title": "Personal Identification Data Solicit",
            "description": "Soliciting sensitive identity numbers (PAN, Aadhaar, SSN) exposes targets to identity theft.",
            "severity": "high",
            "base_score": 25,
            "max_cap": 30,
            "patterns": [
                r"\b(aadhaar\s*(?:card|number)?|pan\s*(?:card|number)?|ssn|social\s+security|passport\s+number)\b",
                r"(ஆதார்|பான்\s*கார்டு)"
            ]
        },
        "REWARD_OR_PRIZE": {
            "title": "Unsolicited Prize / Lottery Claim",
            "description": "Unsolicited claims of winning lotteries or cash prizes are classic advance-fee social-engineering bait.",
            "severity": "high",
            "base_score": 30,
            "max_cap": 35,
            "patterns": [
                r"\b(lottery|lucky\s+draw|cash\s+prize|won\s+(?:₹|\$)\d+|kbc\s+lucky|free\s+gift|jackpot|bonus\s+prize)\b",
                r"\b(congratulations|congrats|you\s+have\s+been\s+selected|chosen\s+for)\b",
                r"(பரிசு|வெற்றி|தேர்வு\s*செய்யப்பட்டுள்ளீர்கள்)"
            ]
        },
        "UNREALISTIC_PROMISE": {
            "title": "Unrealistic Employment or Income Promise",
            "description": "Promises of high guaranteed earnings for simple tasks (data entry, liking videos) are common scam lures.",
            "severity": "medium",
            "base_score": 20,
            "max_cap": 25,
            "patterns": [
                r"\b(exclusive\s+internship|guaranteed\s+job|part\s*time\s+job|work\s+from\s+home\s+job|earn\s+(?:₹|\$)\d+\s+daily)\b",
                r"\b(no\s+interview\s+needed|without\s+interview|instant\s+hiring|easy\s+money)\b",
                r"(வேலை\s*உறுதி|வேலை\s*வாய்ப்பு|வீட்டிலிருந்தே\s*சம்பாதிக்க)"
            ]
        },
        "ACCOUNT_SUSPENSION": {
            "title": "Account Suspension / Block Threat",
            "description": "Threatening immediate account restrictions creates panic to compel compliance without independent checks.",
            "severity": "high",
            "base_score": 30,
            "max_cap": 35,
            "patterns": [
                r"\b(account\s+(?:blocked|suspended|deactivated|frozen|locked|terminated))\b",
                r"\b(pending\s+kyc|kyc\s+update\s+required|pan\s+update\s+mandatory|service\s+blocked)\b",
                r"\b(?:prevent|avoid|due\s+to)\s+(?:suspension|deactivation|blocking)\b",
                r"(கணக்கு\s*முடக்கப்படும்|முடக்கப்பட்டுள்ளது|கேஒய்சி)"
            ]
        },
        "THREAT_LANGUAGE": {
            "title": "Coercive Threats / Punitive Consequences",
            "description": "Invoking law enforcement, arrest warrants, or power disconnection aims to intimidate victims into obedience.",
            "severity": "high",
            "base_score": 30,
            "max_cap": 35,
            "patterns": [
                r"\b(legal\s+action|police\s+case|arrest\s+warrant|court\s+summons|customs\s+fine|penalty\s+applied)\b",
                r"\b(electricity\s+disconnected|power\s+cut\s+tonight|connection\s+terminated|disconnected\s+tonight)\b",
                r"(சட்ட\s*நடவடிக்கை|மின்சாரம்\s*துண்டிக்கப்படும்|கைது)"
            ]
        },
        "IMPERSONATION": {
            "title": "Institutional or Brand Impersonation",
            "description": "Misrepresenting trusted banks, tech providers, or government bodies to exploit recipient trust.",
            "severity": "medium",
            "base_score": 20,
            "max_cap": 25,
            "patterns": [
                r"\b(sbi|state\s+bank|hdfc|icici|axis\s+bank|rbi|reserve\s+bank)\b",
                r"\b(amazon|netflix|apple|google|microsoft|meta|instagram|whatsapp\s+support)\b",
                r"\b(fedex|dhl|india\s+post|postal\s+service|customs\s+department|electricity\s+board)\b",
                r"(வங்கி|அரசு\s*அலுவலகம்)"
            ]
        },
        "SUSPICIOUS_URL": {
            "title": "Suspicious or Obfuscated Web Link",
            "description": "Directing recipients to insecure HTTP links, URL shorteners, or high-risk disposable domains.",
            "severity": "high",
            "base_score": 25,
            "max_cap": 30,
            "patterns": [
                r"(http://[^\s]+)",
                r"(https?://(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|rb\.gy|cutt\.ly)/[^\s]+)",
                r"(https?://[a-zA-Z0-9\.\-]+\.(?:xyz|top|click|buzz|online|site|vip|biz|work)/[^\s]*)",
                r"(https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}[^\s]*)"
            ]
        },
        "CALL_TO_ACTION": {
            "title": "Direct Contact / Click Redirection",
            "description": "Pressuring the recipient to take immediate external action via unverified contacts.",
            "severity": "low",
            "base_score": 8,
            "max_cap": 10,
            "patterns": [
                r"\b(click\s+(?:here|the\s+link)|open\s+link|whatsapp\s+manager|call\s+officer|contact\s+immediately)\b",
                r"(இங்கே\s*கிளிக்\s*செய்யவும்|தொடர்பு\s*கொள்ளவும்)"
            ]
        }
    }

    @classmethod
    def analyze(cls, text: str, content_type: str = "message", is_demo: bool = False) -> Dict[str, Any]:
        """
        Analyzes message text, detects structured warning signals with duplicate-protection,
        calculates calibrated risk score and analysis confidence, and returns standardized schema.
        """
        if not text or not text.strip():
            raise ValueError("Input content cannot be empty.")

        text_clean = text.strip()
        signals: List[Dict[str, Any]] = []
        total_score = 0
        detected_categories = set()

        # Check for Tamil script presence
        is_tamil = bool(re.search(r"[\u0b80-\u0bff]", text_clean))

        # Check each signal category with Duplicate Protection
        for signal_id, config in cls.PATTERNS_CONFIG.items():
            matched_evidence = []
            for pattern in config["patterns"]:
                matches = re.findall(pattern, text_clean, re.IGNORECASE | re.UNICODE)
                if matches:
                    for m in matches:
                        evidence_str = m if isinstance(m, str) else m[0]
                        evidence_str = evidence_str.strip()
                        if evidence_str and evidence_str not in matched_evidence:
                            matched_evidence.append(evidence_str)

            if matched_evidence:
                detected_categories.add(signal_id)
                # Duplicate protection: base score for first match + small increment per additional distinct match, capped
                count = len(matched_evidence)
                contribution = config["base_score"] + min(config["max_cap"] - config["base_score"], (count - 1) * 2)

                primary_evidence = matched_evidence[0]
                if count > 1:
                    evidence_repr = f"{primary_evidence} (+{count - 1} related indicators)"
                else:
                    evidence_repr = primary_evidence

                signal_obj = {
                    "signal_id": signal_id,
                    "title": config["title"],
                    "description": config["description"],
                    "explanation": config["description"],  # Backwards compatibility
                    "severity": config["severity"],
                    "evidence": evidence_repr,
                    "quote": evidence_repr,  # Backwards compatibility
                    "score_contribution": contribution
                }
                signals.append(signal_obj)

        # Context Filter: Brand mention without ANY other red flag is benign (e.g. "Google Meet", "shared drive")
        other_red_flags = {"URGENCY", "PAYMENT_REQUEST", "JOB_OR_INTERNSHIP_FEE", "OTP_REQUEST", 
                           "CREDENTIAL_REQUEST", "PERSONAL_INFORMATION_REQUEST", "REWARD_OR_PRIZE", 
                           "ACCOUNT_SUSPENSION", "THREAT_LANGUAGE", "SUSPICIOUS_URL"}
        if "IMPERSONATION" in detected_categories and not (detected_categories & other_red_flags):
            signals = [s for s in signals if s["signal_id"] != "IMPERSONATION"]
            detected_categories.remove("IMPERSONATION")

        # Sum up contributions from remaining valid signals
        total_score = sum(s["score_contribution"] for s in signals)

        # Compound bonuses for combined threat patterns
        if ("PAYMENT_REQUEST" in detected_categories or "JOB_OR_INTERNSHIP_FEE" in detected_categories) and \
           ("UNREALISTIC_PROMISE" in detected_categories or "REWARD_OR_PRIZE" in detected_categories or is_tamil):
            total_score += 15

        if "URGENCY" in detected_categories and ("THREAT_LANGUAGE" in detected_categories or "ACCOUNT_SUSPENSION" in detected_categories):
            total_score += 15

        if "OTP_REQUEST" in detected_categories or "CREDENTIAL_REQUEST" in detected_categories:
            if "ACCOUNT_SUSPENSION" in detected_categories or "IMPERSONATION" in detected_categories or "URGENCY" in detected_categories:
                total_score += 15

        # Calibrate Final Score
        if len(signals) == 0:
            risk_score = min(15, max(5, int(len(text_clean.split()) / 8)))
        else:
            risk_score = max(20, min(98, total_score))

        # Determine Risk Level using clear thresholds
        if risk_score >= 65:
            risk_level = "HIGH"
        elif risk_score >= 35:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Determine Analysis Confidence
        word_count = len(text_clean.split())
        if word_count < 4 and len(signals) <= 1:
            confidence = "Low"
        elif len(signals) >= 2 or (len(signals) == 0 and word_count >= 8):
            confidence = "High"
        else:
            confidence = "Medium"

        # Synthesize Responsible Summary
        if risk_level == "HIGH":
            summary = "High-risk indicators detected. This content contains several warning signs commonly associated with digital fraud or social-engineering scams."
        elif risk_level == "MEDIUM":
            summary = "Elevated caution recommended: warning indicators detected that warrant independent verification before responding."
        else:
            summary = "No significant warning indicators were detected from the content provided."

        if is_tamil:
            summary += " [Tamil Unicode text processed]"

        # Synthesize Signature 4-Stage Risk Story
        trigger_signal = next((s for s in signals if s["signal_id"] in ["REWARD_OR_PRIZE", "UNREALISTIC_PROMISE", "IMPERSONATION"]), None)
        pressure_signal = next((s for s in signals if s["signal_id"] in ["URGENCY", "THREAT_LANGUAGE", "ACCOUNT_SUSPENSION"]), None)
        request_signal = next((s for s in signals if s["signal_id"] in ["PAYMENT_REQUEST", "JOB_OR_INTERNSHIP_FEE", "OTP_REQUEST", "CREDENTIAL_REQUEST", "SUSPICIOUS_URL"]), None)

        trigger_text = f"The message opens with an initial lure: '{trigger_signal['evidence']}'." if trigger_signal else "Routine communication opening or announcement."
        pressure_text = f"Applies psychological urgency or fear: '{pressure_signal['evidence']}' to accelerate action." if pressure_signal else "Standard pacing with no intense psychological pressure detected."
        request_text = f"Demands action: '{request_signal['evidence']}'." if request_signal else "Standard informational message with no direct credential or financial demands."

        if risk_level == "HIGH":
            potential_risk_text = "Potential financial loss, unauthorized fund transfers, credential theft, or identity compromise."
        elif risk_level == "MEDIUM":
            potential_risk_text = "Possible spam solicitation, unsolicited marketing, or unverified secondary data collection."
        else:
            potential_risk_text = "Minimal risk detected under standard digital hygiene practices."

        # Plain-English "Explain Simply"
        explanation_items = []
        for s in signals:
            if s["signal_id"] in ["URGENCY", "THREAT_LANGUAGE"]:
                explanation_items.append("trying to rush you into acting before you can think or verify")
            elif s["signal_id"] in ["PAYMENT_REQUEST", "JOB_OR_INTERNSHIP_FEE"]:
                explanation_items.append("asking for money upfront, which is a major warning sign")
            elif s["signal_id"] in ["OTP_REQUEST", "CREDENTIAL_REQUEST"]:
                explanation_items.append("asking for secret passwords or OTPs that you should never share")
            elif s["signal_id"] == "SUSPICIOUS_URL":
                explanation_items.append("directing you to an unofficial or insecure web address")

        if explanation_items:
            unique_explanations = list(dict.fromkeys(explanation_items))
            explanation = "This message is " + " and ".join(unique_explanations) + ". Legitimate organizations do not communicate this way."
        elif risk_level == "LOW":
            explanation = "This message does not exhibit common scam patterns. It does not demand money, does not ask for secret codes, and does not create artificial panic."
        else:
            explanation = "This message contains atypical communication characteristics. Exercise caution and independently verify the sender through official channels."

        # Dynamic Recommended Actions
        actions = []
        if risk_level == "HIGH":
            if any(s["signal_id"] in ["PAYMENT_REQUEST", "JOB_OR_INTERNSHIP_FEE"] for s in signals):
                actions.append("Do not send money, registration fees, or transfer funds via UPI / QR code.")
            if any(s["signal_id"] in ["OTP_REQUEST", "CREDENTIAL_REQUEST", "PERSONAL_INFORMATION_REQUEST"] for s in signals):
                actions.append("Never share your OTP, PIN, password, or Aadhaar/PAN details with anyone.")
            if any(s["signal_id"] == "SUSPICIOUS_URL" for s in signals):
                actions.append("Do not click links or download files from this message.")
            actions.append("Verify the organization independently using their verified official website.")
            actions.append("Report suspicious communication to cybercrime authorities (e.g. 1930 in India / FTC in US).")
        elif risk_level == "MEDIUM":
            actions.append("Verify the sender's identity through a secondary trusted communication channel.")
            actions.append("Do not provide confidential or financial details.")
            actions.append("Check official apps or websites directly instead of replying.")
        else:
            actions.append("Standard digital hygiene applies.")
            actions.append("Verify domain names before entering sensitive credentials.")

        return {
            "analysis_id": str(uuid.uuid4()),
            "content_type": content_type,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "confidence": confidence,
            "summary": summary,
            "signals": signals,
            "warning_signals": signals,  # Backwards compatibility
            "risk_story": {
                "trigger": trigger_text,
                "pressure": pressure_text,
                "request": request_text,
                "potential_risk": potential_risk_text
            },
            "recommended_actions": actions,
            "explanation": explanation,
            "engine": "rule-based",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "is_demo": is_demo
        }


class AIAnalysisService:
    """
    Main AI Service interface supporting:
    - Rule-based analysis
    - External LLM (Gemini / OpenAI) integration
    - Hybrid AI + Rule synthesis
    - Graceful zero-downtime fallback
    - Strict response validation
    """

    def __init__(self, api_key: Optional[str] = None, provider: str = "auto", model: str = "gemini-2.5-flash"):
        self.api_key = api_key or os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
        self.provider = provider
        self.model = model

    def analyze(self, text: str, content_type: str = "message", is_demo: bool = False) -> Dict[str, Any]:
        """
        Executes hybrid analysis when API key is available, or cleanly falls back
        to the RuleBasedAnalysisEngine with identical structured schema.
        """
        if not text or not text.strip():
            raise ValueError("Input content cannot be empty.")

        # Always run RuleBasedAnalysisEngine first to generate deterministic signals and baseline score
        rule_result = RuleBasedAnalysisEngine.analyze(text, content_type=content_type, is_demo=is_demo)

        # If user explicitly requests demo mode or no external API key is configured, return rule result
        if is_demo or not self.api_key:
            return rule_result

        # Hybrid Path: When API key is available, enrich with LLM insights
        try:
            llm_result = self._call_llm(text, content_type, rule_result["signals"])
            if llm_result and self._validate_response_schema(llm_result):
                hybrid_result = {
                    "analysis_id": str(uuid.uuid4()),
                    "content_type": content_type,
                    "risk_level": llm_result.get("risk_level", rule_result["risk_level"]),
                    "risk_score": int(llm_result.get("risk_score", rule_result["risk_score"])),
                    "confidence": llm_result.get("confidence", rule_result["confidence"]),
                    "summary": llm_result.get("summary", rule_result["summary"]),
                    "signals": rule_result["signals"],
                    "warning_signals": rule_result["signals"],
                    "risk_story": llm_result.get("risk_story", rule_result["risk_story"]),
                    "recommended_actions": llm_result.get("recommended_actions", rule_result["recommended_actions"]),
                    "explanation": llm_result.get("explanation", rule_result["explanation"]),
                    "engine": "hybrid",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "is_demo": False
                }
                return hybrid_result
        except Exception as e:
            logger.warning(f"External AI call failed or timed out: {e}. Gracefully using rule-based analysis.")

        # Graceful fallback: return rule_result
        return rule_result

    def _call_llm(self, text: str, content_type: str, deterministic_signals: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """
        Invokes Gemini or OpenAI API to produce structured cybersecurity analysis.
        """
        import requests

        system_prompt = (
            "You are SafeSpeak AI, an elite cybersecurity assistant.\n"
            "Analyze the provided user content. You MUST output strict valid JSON with this exact schema:\n"
            "{\n"
            '  "risk_level": "LOW" | "MEDIUM" | "HIGH",\n'
            '  "risk_score": <integer from 0 to 100>,\n'
            '  "confidence": "Low" | "Medium" | "High",\n'
            '  "summary": "<concise responsible assessment; never claim absolute certainty>",\n'
            '  "warning_signals": [\n'
            '    {\n'
            '      "signal_id": "<UPPERCASE_ID e.g. URGENCY, PAYMENT_REQUEST>",\n'
            '      "title": "<title>",\n'
            '      "description": "<why dangerous>",\n'
            '      "severity": "low" | "medium" | "high" | "critical",\n'
            '      "evidence": "<exact quote from text>",\n'
            '      "score_contribution": <integer>\n'
            '    }\n'
            '  ],\n'
            '  "risk_story": {\n'
            '    "trigger": "<the initial hook or lure used>",\n'
            '    "pressure": "<the urgency or coercion applied>",\n'
            '    "request": "<the demanded action: payment, credentials, click>",\n'
            '    "potential_risk": "<the exact consequence or vulnerability>"\n'
            '  },\n'
            '  "recommended_actions": ["<action item 1>", "<action item 2>"],\n'
            '  "explanation": "<clear non-technical plain English explanation for ordinary users>"\n'
            "}\n"
            "Never use defamatory or absolute claims like 'definitely a scam'. Use responsible phrasing: 'High-risk indicators detected.'\n"
        )

        prompt_content = f"{system_prompt}\n\nDETERMINISTIC SIGNALS FOUND SO FAR:\n{json.dumps(deterministic_signals)}\n\nUSER CONTENT TO ANALYZE:\n{text}"

        # Check for Gemini vs OpenAI format
        if self.api_key.startswith("AIza") or "gemini" in self.model.lower():
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt_content}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json"
                }
            }
            resp = requests.post(url, json=payload, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                raw_json = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(raw_json)
        else:
            url = "https://api.openai.com/v1/chat/completions"
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"DETERMINISTIC SIGNALS:\n{json.dumps(deterministic_signals)}\n\nCONTENT:\n{text}"}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.2
            }
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            resp = requests.post(url, headers=headers, json=payload, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                return json.loads(data["choices"][0]["message"]["content"])

        return None

    def _validate_response_schema(self, data: Any) -> bool:
        if not isinstance(data, dict):
            return False
        required_keys = ["risk_level", "risk_score", "summary", "warning_signals", "risk_story", "recommended_actions", "explanation"]
        for k in required_keys:
            if k not in data:
                return False
        if data["risk_level"] not in ["LOW", "MEDIUM", "HIGH"]:
            return False
        if not isinstance(data["risk_score"], (int, float)):
            return False
        if not (0 <= data["risk_score"] <= 100):
            return False
        if not isinstance(data["warning_signals"], list):
            return False
        if not isinstance(data["risk_story"], dict):
            return False
        for story_k in ["trigger", "pressure", "request", "potential_risk"]:
            if story_k not in data["risk_story"]:
                return False
        if not isinstance(data["recommended_actions"], list):
            return False
        return True
