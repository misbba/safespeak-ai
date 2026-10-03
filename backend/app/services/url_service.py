import re
import uuid
import urllib.parse
import ipaddress
from datetime import datetime, timezone

class URLAnalysisService:
    """
    Structural URL security analyzer evaluating protocol encryption, host anatomy,
    Punycode homoglyphs, brand spoofing, and payload obfuscation.
    Does not make unsupported claims about live WHOIS or blacklist statuses.
    """

    SUSPICIOUS_TLDS = {
        "xyz", "top", "click", "buzz", "work", "rest", "country", "stream",
        "gq", "cf", "tk", "ml", "ga", "fit", "kim", "loan", "party", "icu",
        "cam", "win", "bid", "monster", "online", "site", "vip"
    }

    URL_SHORTENERS = {
        "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "ow.ly",
        "cutt.ly", "rb.gy", "shorturl.at", "tiny.cc", "trib.al"
    }

    HIGH_PROFILE_BRANDS = [
        "paypal", "apple", "google", "microsoft", "netflix", "amazon", "facebook",
        "instagram", "whatsapp", "telegram", "sbi", "hdfc", "icici", "chase",
        "wellsfargo", "bankofamerica", "binance", "coinbase", "metamask", "paytm",
        "phonepe", "gpay", "irs", "incometax", "gov"
    ]

    SUSPICIOUS_PATH_KEYWORDS = [
        "login", "signin", "verify", "verification", "update", "banking", "secure",
        "security", "wallet", "kyc", "otp", "confirm", "account-alert", "recover",
        "claim", "free-gift", "bonus", "reward", "prize", "invoice"
    ]

    DANGEROUS_EXTENSIONS = [
        ".exe", ".apk", ".scr", ".bat", ".cmd", ".vbs", ".msi", ".jar", ".ps1", ".iso"
    ]

    @classmethod
    def analyze(cls, raw_url: str) -> dict:
        url = raw_url.strip()
        if not url:
            raise ValueError("URL cannot be empty")

        if not (url.startswith("http://") or url.startswith("https://") or url.startswith("//")):
            url = "http://" + url

        try:
            parsed = urllib.parse.urlparse(url)
        except Exception as e:
            return cls._generate_malformed_url_result(raw_url, str(e))

        hostname = (parsed.hostname or "").lower()
        scheme = parsed.scheme.lower()
        path = parsed.path.lower()
        query = parsed.query.lower()

        signals = []
        raw_score = 0

        # 1. Scheme Check
        if scheme == "http":
            raw_score += 20
            signals.append({
                "signal_id": "UNENCRYPTED_HTTP",
                "title": "Unencrypted HTTP Connection",
                "description": "The site does not utilize TLS/HTTPS encryption, transmitting all data in plain text.",
                "explanation": "The site does not utilize TLS/HTTPS encryption, transmitting all data in plain text.",
                "severity": "medium",
                "evidence": "http://",
                "quote": "http://",
                "score_contribution": 20
            })

        # 2. IP Address as Hostname
        is_ip = False
        try:
            ipaddress.ip_address(hostname)
            is_ip = True
            raw_score += 40
            signals.append({
                "signal_id": "IP_ADDRESS_HOST",
                "title": "Direct IP Address Hostname",
                "description": "Legitimate consumer services register domain names; direct IP URLs are commonly utilized in malicious hosting.",
                "explanation": "Legitimate consumer services register domain names; direct IP URLs are commonly utilized in malicious hosting.",
                "severity": "high",
                "evidence": hostname,
                "quote": hostname,
                "score_contribution": 40
            })
        except ValueError:
            is_ip = False

        # 3. URL Shortener Check
        is_shortener = hostname in cls.URL_SHORTENERS
        if is_shortener:
            raw_score += 25
            signals.append({
                "signal_id": "URL_SHORTENER_MASK",
                "title": "URL Shortener Masking Destination",
                "description": "Shortened links conceal the actual destination server, preventing upfront manual inspection.",
                "explanation": "Shortened links conceal the actual destination server, preventing upfront manual inspection.",
                "severity": "medium",
                "evidence": hostname,
                "quote": hostname,
                "score_contribution": 25
            })

        # 4. Punycode / Homoglyph Detection
        if "xn--" in hostname:
            raw_score += 40
            signals.append({
                "signal_id": "PUNYCODE_HOMOGLYPH",
                "title": "Punycode / Homograph Encoding",
                "description": "Internationalized character encoding (xn--) can visually disguise look-alike domains to mimic authentic brands.",
                "explanation": "Internationalized character encoding (xn--) can visually disguise look-alike domains to mimic authentic brands.",
                "severity": "critical",
                "evidence": hostname,
                "quote": hostname,
                "score_contribution": 40
            })

        # 5. TLD Inspection
        tld = hostname.split(".")[-1] if "." in hostname else ""
        if tld in cls.SUSPICIOUS_TLDS:
            raw_score += 20
            signals.append({
                "signal_id": "HIGH_RISK_TLD",
                "title": f"High-Risk / Low-Cost TLD (.{tld})",
                "description": f"The top-level domain '.{tld}' is frequently associated with disposable domains due to low registration barriers.",
                "explanation": f"The top-level domain '.{tld}' is frequently associated with disposable domains due to low registration barriers.",
                "severity": "medium",
                "evidence": f".{tld}",
                "quote": f".{tld}",
                "score_contribution": 20
            })

        # 6. Excessive Subdomains
        domain_parts = [p for p in hostname.split(".") if p]
        if len(domain_parts) >= 4 and not is_ip:
            raw_score += 20
            signals.append({
                "signal_id": "EXCESSIVE_SUBDOMAINS",
                "title": "Excessive Subdomain Nesting",
                "description": "Multiple nested subdomains are often deployed to push deceptive domain suffixes out of mobile address bars.",
                "explanation": "Multiple nested subdomains are often deployed to push deceptive domain suffixes out of mobile address bars.",
                "severity": "medium",
                "evidence": hostname,
                "quote": hostname,
                "score_contribution": 20
            })

        # 7. Brand Impersonation / Typosquatting in Hostname
        impersonated_brand = None
        for brand in cls.HIGH_PROFILE_BRANDS:
            if brand in hostname:
                official_suffixes = [f"{brand}.com", f"{brand}.org", f"{brand}.net", f"{brand}.co.in", f"{brand}.sbi", f"{brand}.gov.in"]
                is_legit_root = any(hostname == root or hostname.endswith("." + root) for root in official_suffixes)
                if not is_legit_root:
                    impersonated_brand = brand
                    raw_score += 35
                    signals.append({
                        "signal_id": "BRAND_IMPERSONATION_URL",
                        "title": f"Potential Brand Impersonation ({brand.upper()})",
                        "description": f"The domain incorporates '{brand}' without matching official registered domains for that entity.",
                        "explanation": f"The domain incorporates '{brand}' without matching official registered domains for that entity.",
                        "severity": "high",
                        "evidence": hostname,
                        "quote": hostname,
                        "score_contribution": 35
                    })
                    break

        # 8. Suspicious Path & Query Keywords
        matched_keywords = [kw for kw in cls.SUSPICIOUS_PATH_KEYWORDS if kw in path or kw in query]
        if matched_keywords:
            contribution = min(25, 10 * len(matched_keywords))
            raw_score += contribution
            signals.append({
                "signal_id": "SUSPICIOUS_PATH_KEYWORDS",
                "title": "Sensitive Action Keywords in URL Path",
                "description": "The URL specifies actions related to authentication or financial collection outside official apps.",
                "explanation": "The URL specifies actions related to authentication or financial collection outside official apps.",
                "severity": "medium",
                "evidence": f"Keywords: {', '.join(matched_keywords[:3])}",
                "quote": f"Keywords: {', '.join(matched_keywords[:3])}",
                "score_contribution": contribution
            })

        # 9. Dangerous File Extensions
        for ext in cls.DANGEROUS_EXTENSIONS:
            if path.endswith(ext):
                raw_score += 45
                signals.append({
                    "signal_id": "EXECUTABLE_FILE_LINK",
                    "title": f"Executable or Script File Download ({ext})",
                    "description": f"The link points directly to an executable file ({ext}), which may download untrusted binaries.",
                    "explanation": f"The link points directly to an executable file ({ext}), which may download untrusted binaries.",
                    "severity": "critical",
                    "evidence": ext,
                    "quote": ext,
                    "score_contribution": 45
                })
                break

        # 10. Unusually Long URL / Obfuscation
        if len(raw_url) > 100 or len(path) > 70:
            raw_score += 15
            signals.append({
                "signal_id": "UNUSUALLY_LONG_URL",
                "title": "Unusually Long or Obfuscated URL Structure",
                "description": "Excessively long URLs are often used to conceal real query payloads and redirect parameters.",
                "explanation": "Excessively long URLs are often used to conceal real query payloads and redirect parameters.",
                "severity": "low",
                "evidence": f"{len(raw_url)} characters",
                "quote": f"{len(raw_url)} characters",
                "score_contribution": 15
            })

        # 11. Deceptive Characters (@ symbol or multiple slashes)
        if "@" in raw_url or "//" in path:
            raw_score += 30
            signals.append({
                "signal_id": "OBFUSCATED_CHARACTERS",
                "title": "Deceptive URL Character Obfuscation",
                "description": "The URL contains '@' or irregular slashes, often used to mislead browsers into routing to unexpected hosts.",
                "explanation": "The URL contains '@' or irregular slashes, often used to mislead browsers into routing to unexpected hosts.",
                "severity": "high",
                "evidence": "Irregular '@' or '//' syntax detected",
                "quote": "Irregular syntax",
                "score_contribution": 30
            })

        # Calculate Final Score and Level
        if len(signals) == 0:
            risk_score = 5
            risk_level = "LOW"
            confidence = "High"
            summary = f"No significant warning indicators were detected from the content provided for {hostname}."
        else:
            risk_score = max(20, min(98, raw_score))
            if risk_score >= 65:
                risk_level = "HIGH"
                summary = f"High-risk indicators detected on {hostname}. Structural heuristics indicate potential phishing or spoofing."
            elif risk_score >= 35:
                risk_level = "MEDIUM"
                summary = f"Potential warning signs detected on {hostname}. Elevated caution recommended."
            else:
                risk_level = "LOW"
                summary = f"No significant warning indicators were detected from the content provided for {hostname}."

            confidence = "High" if len(signals) >= 2 else "Medium"

        # Generate Risk Story
        trigger = f"Link pointing to {hostname}" + (f" mimicking {impersonated_brand.upper()}." if impersonated_brand else ".")
        pressure = "Frequently paired with urgent notifications like 'Verify immediately' or 'Account blocked'."
        if matched_keywords:
            request = f"Entering credentials for: {', '.join(matched_keywords[:2])}."
        elif is_shortener:
            request = "Navigating through an obfuscated redirection hop."
        else:
            request = "Visiting an external web resource with structural anomalies."

        potential_risk = "Possible credential harvesting, session hijacking, or malicious download." if risk_level == "HIGH" else "Unverified external destination."

        # Plain language explanation
        if risk_level == "HIGH":
            explanation = (
                f"We detected multiple structural warning signs on '{hostname}'. "
                + ("It does not use encrypted HTTPS. " if scheme == "http" else "")
                + (f"It appears to impersonate {impersonated_brand.upper()} without being an official domain. " if impersonated_brand else "")
                + "Do not enter passwords, credit cards, or personal secrets on this link."
            )
        elif risk_level == "MEDIUM":
            explanation = f"The link '{hostname}' exhibits atypical structural indicators. Verify the authentic domain before entering data."
        else:
            explanation = f"The URL '{hostname}' appears structurally standard and uses encrypted HTTPS. Standard web browsing precautions apply."

        # Actions
        actions = []
        if risk_level == "HIGH":
            actions.append("Do not enter login credentials, passwords, or payment cards on this site.")
            actions.append("Never download or run executable files from unverified links.")
            actions.append("Access services by typing their known official address directly into your browser.")
            actions.append("Report the URL to your organization's IT department or national cybercrime portal.")
        elif risk_level == "MEDIUM":
            actions.append("Verify the address bar carefully before entering personal information.")
            actions.append("Inspect the security certificate in your browser.")
        else:
            actions.append("Standard digital hygiene applies.")
            actions.append("Verify the security lock icon in the browser address bar.")

        return {
            "analysis_id": str(uuid.uuid4()),
            "content_type": "url",
            "risk_level": risk_level,
            "risk_score": risk_score,
            "confidence": confidence,
            "summary": summary,
            "signals": signals,
            "warning_signals": signals,  # Backwards compatibility
            "risk_story": {
                "trigger": trigger,
                "pressure": pressure,
                "request": request,
                "potential_risk": potential_risk
            },
            "recommended_actions": actions,
            "explanation": explanation,
            "engine": "url-heuristics",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "url_details": {
                "url": raw_url,
                "normalized_url": url,
                "hostname": hostname,
                "scheme": scheme,
                "path": path,
                "tld": tld,
                "is_ip": is_ip,
                "is_shortener": is_shortener
            }
        }

    @classmethod
    def _generate_malformed_url_result(cls, raw_url: str, error_msg: str) -> dict:
        signal = {
            "signal_id": "MALFORMED_URL_SYNTAX",
            "title": "Invalid or Obfuscated URL Syntax",
            "description": f"The URL syntax could not be parsed: {error_msg}.",
            "explanation": f"The URL syntax could not be parsed: {error_msg}.",
            "severity": "high",
            "evidence": raw_url[:60],
            "quote": raw_url[:60],
            "score_contribution": 45
        }
        return {
            "analysis_id": str(uuid.uuid4()),
            "content_type": "url",
            "risk_level": "HIGH",
            "risk_score": 85,
            "confidence": "High",
            "summary": "Malformed or deliberately obfuscated URL syntax detected.",
            "signals": [signal],
            "warning_signals": [signal],
            "risk_story": {
                "trigger": "User invited to click an irregular URL.",
                "pressure": "Unknown.",
                "request": "Clicking an unparseable or obfuscated link.",
                "potential_risk": "High likelihood of redirect to a malicious payload or exploit."
            },
            "recommended_actions": [
                "Do not open or forward this link.",
                "Delete the message containing this URL."
            ],
            "explanation": "This URL is broken or deliberately obfuscated to bypass safety scanners. Avoid clicking it.",
            "engine": "url-heuristics",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "url_details": {"url": raw_url}
        }
