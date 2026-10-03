import os
import io
import re
import logging
import asyncio
from PIL import Image

logger = logging.getLogger("safespeak.ocr")

class OCRService:
    DEMO_SAMPLE_PRESETS = {
        "internship": (
            "Congratulations! You have been selected for an exclusive internship at TechVanguard Solutions. "
            "Pay ₹999 registration fee within 30 minutes to confirm your position. "
            "Click here to register: http://secure-job-enroll.biz/pay\n"
            "HR Team - TechVanguard"
        ),
        "bank": (
            "Dear SBI Customer, Your A/C XX4892 is temporarily blocked due to pending KYC verification. "
            "To avoid permanent suspension, immediately update your PAN & Aadhaar details at: "
            "http://sbi-banking-kyc-update.xyz/verify-pan within 24 hours. - State Bank Helpline"
        ),
        "lottery": (
            "DEAR WINNER! Your mobile number won cash prize of Rs 25,00,000 in KBC All India Lucky Draw 2026. "
            "To claim your cheque, WhatsApp Manager Mr. Rana on +91-9876543210 and pay Rs 1,500 file processing fee now. "
            "Ticket ID: KBC-998822"
        ),
        "login": (
            "SECURITY ALERT: We detected a suspicious login attempt to your Amazon account from Moscow, Russia. "
            "If this was not you, verify your identity immediately to protect your saved cards: "
            "https://amazon-account-protection.site/restore"
        ),
        "legit": (
            "Hi Priya, just a reminder that our project status meeting is tomorrow morning at 10:30 AM in Conference Room B. "
            "Please review the slide deck in our shared Google Drive beforehand. See you then! - Rahul"
        )
    }

    @classmethod
    def _run_winocr(cls, pil_image: Image.Image, lang: str = "en-US") -> str:
        """
        Runs Windows 10/11 native OCR engine (Windows.Media.Ocr) via winocr.
        Requires no external binaries, 100% offline and accurate.
        """
        try:
            import winocr
            async def _extract():
                result = await winocr.recognize_pil(pil_image, lang)
                return result.text if result else ""
            
            return asyncio.run(_extract())
        except Exception as e:
            logger.warning(f"Windows native OCR error: {e}")
            return ""

    @classmethod
    def _run_pytesseract(cls, pil_image: Image.Image) -> str:
        """
        Runs PyTesseract if Tesseract OCR binary is installed and configured.
        """
        try:
            import pytesseract
            text = pytesseract.image_to_string(pil_image)
            return text.strip() if text else ""
        except Exception as e:
            logger.debug(f"PyTesseract not available or failed: {e}")
            return ""

    @classmethod
    def process_image(cls, file_storage, preset_hint: str = None) -> dict:
        """
        Validates the uploaded image and extracts ACTUAL text using real OCR.
        NEVER falls back to hard-coded demo scam text for real uploaded images.
        """
        if not file_storage or not file_storage.filename:
            raise ValueError("Please upload a screenshot image.")

        original_filename = file_storage.filename
        content_type = getattr(file_storage, "content_type", "image/unknown")
        
        file_bytes = file_storage.read()
        file_size = len(file_bytes)
        file_storage.seek(0)  # Reset pointer for downstream readers

        # Logging for debugging (Requirement 13)
        print(f"\n[OCR DEBUG] Screenshot received:")
        print(f"  filename     = {original_filename}")
        print(f"  content_type = {content_type}")
        print(f"  size         = {file_size} bytes")

        if file_size > 10 * 1024 * 1024:
            raise ValueError("File size exceeds 10MB limit. Please upload a smaller screenshot.")

        # Validate that it is a valid image using PIL
        try:
            image = Image.open(io.BytesIO(file_bytes))
            image.verify()  # Verify file integrity
            image = Image.open(io.BytesIO(file_bytes))  # Re-open after verify
            width, height = image.size
            format_name = image.format or "PNG"
        except Exception as e:
            raise ValueError(f"Uploaded file is not a valid image: {str(e)}")

        # Only use demo presets when EXPLICITLY requested by user (e.g. clicking demo sample)
        # NEVER match against filename words for uploaded files!
        if preset_hint and preset_hint in cls.DEMO_SAMPLE_PRESETS:
            preset_text = cls.DEMO_SAMPLE_PRESETS[preset_hint]
            print(f"[OCR DEBUG] Explicit demo preset '{preset_hint}' selected.")
            return {
                "extracted_text": preset_text,
                "method": "demo_preset",
                "filename": original_filename,
                "dimensions": f"{width}x{height}",
                "format": format_name,
                "notes": f"Loaded demo preset '{preset_hint}'."
            }

        # REAL OCR EXTRACTION:
        extracted_text = ""
        method_used = "none"

        # 1. Try Windows native OCR (Windows.Media.Ocr via winocr)
        win_text = cls._run_winocr(image)
        if win_text and win_text.strip():
            extracted_text = win_text.strip()
            method_used = "windows_native_ocr"

        # 2. If Windows OCR gave nothing, try PyTesseract
        if not extracted_text:
            tes_text = cls._run_pytesseract(image)
            if tes_text and tes_text.strip():
                extracted_text = tes_text.strip()
                method_used = "tesseract_ocr"

        # Normalize linebreaks and whitespace
        extracted_text = re.sub(r'[ \t]+', ' ', extracted_text).strip()

        # Debug logging of OCR extraction result (without sensitive credentials)
        char_count = len(extracted_text)
        preview = extracted_text[:80].replace('\n', ' ') if extracted_text else "(none)"
        print(f"[OCR DEBUG] OCR characters extracted = {char_count}")
        print(f"[OCR DEBUG] First part of extracted text: '{preview}...'")
        print(f"[OCR DEBUG] Engine used: {method_used}\n")

        # If OCR detected real text
        if extracted_text:
            return {
                "extracted_text": extracted_text,
                "method": method_used,
                "filename": original_filename,
                "dimensions": f"{width}x{height}",
                "format": format_name,
                "notes": f"Text successfully extracted via {method_used}."
            }

        # If NO readable text was detected:
        # DO NOT fall back to fake scam text. Return empty text with clean advisory message.
        return {
            "extracted_text": "",
            "method": method_used,
            "filename": original_filename,
            "dimensions": f"{width}x{height}",
            "format": format_name,
            "message": "No readable text was detected in this screenshot."
        }

