import hashlib


def get_client_fingerprint(request):
    ip = (
        request.META.get("REMOTE_ADDR", "")
        or request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip()
    )
    ua = request.META.get("HTTP_USER_AGENT", "") or ""
    raw = f"{ip}:{ua}"
    return hashlib.sha256(raw.encode()).hexdigest()
