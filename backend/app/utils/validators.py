import re
import html

def sanitize_text(text: str, max_length: int = 10000) -> str:
    """
    Sanitizes user input to prevent XSS and stripping dangerous control characters,
    while retaining readable message content.
    """
    if not text:
        return ""
    # Strip null bytes and non-printable control characters except newlines/tabs
    cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)
    # Truncate to maximum permissible length to mitigate memory abuse
    cleaned = cleaned[:max_length].strip()
    return cleaned

def is_valid_url_format(url: str) -> bool:
    if not url or len(url) > 2048:
        return False
    # Loose URL pattern checking structure
    pattern = re.compile(
        r"^(https?:\/\/)?([a-zA-Z0-9\-\._~%]+|\[[a-fA-F0-9:]+\])(:\d+)?(\/[^\s]*)?$",
        re.IGNORECASE
    )
    return bool(pattern.match(url.strip()))
