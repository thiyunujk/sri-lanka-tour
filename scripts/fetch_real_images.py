"""
Stage A / Step 1 patch script.

Reads js/hotelData.js, visits each hotel's official_website, and tries to
pull a real photo from the page's og:image (falling back to
og:image:secure_url, then twitter:image). Writes the results back into
js/hotelData.js and a full report to scripts/image_fetch_report.json.

Standard-library only (no requests/bs4/lxml available in this environment).
"""

import json
import re
import socket
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parent.parent
HOTEL_DATA_PATH = ROOT / "js" / "hotelData.js"
REPORT_PATH = ROOT / "scripts" / "image_fetch_report.json"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
TIMEOUT_SECONDS = 10
DELAY_BETWEEN_REQUESTS = 0.5  # seconds
MAX_HTML_BYTES = 400_000  # don't read an entire huge page into memory

# Tolerant SSL context: some hotel sites have weak/expired intermediate
# chains but are still reachable in a real browser. We only use this to
# *fetch a photo URL*, not for anything security sensitive.
SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE

META_TAG_RE = re.compile(r"<meta\b[^>]*>", re.I)
ATTR_RE = re.compile(r'([a-zA-Z][\w:-]*)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')')

FIELDS_TO_DELETE = ("room_image", "bathroom_image", "facility_image")


def load_hotel_data():
    text = HOTEL_DATA_PATH.read_text(encoding="utf-8")
    m = re.match(r"^\s*const\s+hotelData\s*=\s*(.*?)\s*;?\s*$", text, re.S)
    if not m:
        raise ValueError("Could not locate 'const hotelData = ...' wrapper in hotelData.js")
    body = m.group(1)
    return json.loads(body)


def save_hotel_data(data):
    body = json.dumps(data, indent=2, ensure_ascii=False)
    HOTEL_DATA_PATH.write_text(f"const hotelData = {body};\n", encoding="utf-8")


def http_get(url, headers=None):
    req_headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/*;q=0.8,*/*;q=0.7",
    }
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, headers=req_headers, method="GET")
    return urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS, context=SSL_CONTEXT)


def fetch_html(url):
    """Returns (final_url, html_text) or raises (socket.timeout | urllib.error.*)."""
    with http_get(url) as resp:
        final_url = resp.geturl()
        raw = resp.read(MAX_HTML_BYTES)
        ctype = resp.headers.get("Content-Type", "")
        charset = "utf-8"
        m = re.search(r"charset=([\w-]+)", ctype, re.I)
        if m:
            charset = m.group(1)
        try:
            html = raw.decode(charset, errors="replace")
        except (LookupError, UnicodeDecodeError):
            html = raw.decode("utf-8", errors="replace")
        return final_url, html


def parse_meta_attrs(tag_text):
    attrs = {}
    for m in ATTR_RE.finditer(tag_text):
        key = m.group(1).lower()
        val = m.group(2) if m.group(2) is not None else m.group(3)
        attrs[key] = val
    return attrs


def extract_candidate_images(html):
    """Returns an ordered, de-duplicated list of candidate image URLs:
    og:image, og:image:secure_url, twitter:image (in that priority order)."""
    buckets = {"og:image": [], "og:image:secure_url": [], "twitter:image": []}
    for tag_match in META_TAG_RE.finditer(html):
        attrs = parse_meta_attrs(tag_match.group(0))
        key = (attrs.get("property") or attrs.get("name") or "").lower()
        content = attrs.get("content")
        if key in buckets and content:
            buckets[key].append(content.strip())

    ordered = []
    for key in ("og:image", "og:image:secure_url", "twitter:image"):
        for v in buckets[key]:
            if v not in ordered:
                ordered.append(v)
    return ordered


def validate_image_url(url):
    """Returns (ok: bool, reason: 'ok'|'http_error'|'timeout'|'not_image')."""
    try:
        with http_get(url) as resp:
            status = resp.status
            ctype = resp.headers.get("Content-Type", "")
            if status != 200:
                return False, "http_error"
            if not ctype.lower().startswith("image/"):
                return False, "not_image"
            return True, "ok"
    except socket.timeout:
        return False, "timeout"
    except urllib.error.HTTPError:
        return False, "http_error"
    except (urllib.error.URLError, ssl.SSLError, ConnectionError, OSError):
        return False, "http_error"


def process_hotel(hotel):
    """Mutates `hotel` in place. Returns a report dict."""
    website = (hotel.get("official_website") or "").strip()

    for field in FIELDS_TO_DELETE:
        hotel.get("images", {}).pop(field, None)

    result = {"name": hotel.get("name", ""), "status": "http_error", "url": ""}

    if not website:
        hotel.setdefault("images", {})["exterior_image"] = ""
        hotel["image_source"] = "none"
        result["status"] = "http_error"
        return result

    try:
        final_url, html = fetch_html(website)
    except socket.timeout:
        hotel.setdefault("images", {})["exterior_image"] = ""
        hotel["image_source"] = "none"
        result["status"] = "timeout"
        return result
    except urllib.error.HTTPError:
        hotel.setdefault("images", {})["exterior_image"] = ""
        hotel["image_source"] = "none"
        result["status"] = "http_error"
        return result
    except (urllib.error.URLError, ssl.SSLError, ConnectionError, OSError, ValueError):
        hotel.setdefault("images", {})["exterior_image"] = ""
        hotel["image_source"] = "none"
        result["status"] = "http_error"
        return result

    candidates = extract_candidate_images(html)
    if not candidates:
        hotel.setdefault("images", {})["exterior_image"] = ""
        hotel["image_source"] = "none"
        result["status"] = "no_og_tag"
        return result

    last_reason = "not_image"
    for candidate in candidates:
        resolved = urljoin(final_url, candidate)
        parsed = urlparse(resolved)
        if parsed.scheme not in ("http", "https"):
            last_reason = "not_image"
            continue
        time.sleep(DELAY_BETWEEN_REQUESTS)
        ok, reason = validate_image_url(resolved)
        if ok:
            hotel.setdefault("images", {})["exterior_image"] = resolved
            hotel["image_source"] = "official_og"
            result["status"] = "ok"
            result["url"] = resolved
            return result
        last_reason = reason

    hotel.setdefault("images", {})["exterior_image"] = ""
    hotel["image_source"] = "none"
    result["status"] = last_reason
    return result


def main():
    data = load_hotel_data()
    report = []
    total = sum(len(hotels) for hotels in data.values())
    done = 0

    for destination, hotels in data.items():
        for hotel in hotels:
            done += 1
            print(f"[{done}/{total}] {destination}: {hotel.get('name', '')} ...", end=" ", flush=True)
            r = process_hotel(hotel)
            print(r["status"])
            report.append({
                "destination": destination,
                "name": r["name"],
                "status": r["status"],
                "url": r["url"],
            })
            time.sleep(DELAY_BETWEEN_REQUESTS)

    save_hotel_data(data)
    REPORT_PATH.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    ok_count = sum(1 for r in report if r["status"] == "ok")
    print(f"\nDone. {ok_count}/{total} hotels got a real og:image photo.")
    print(f"Wrote {HOTEL_DATA_PATH}")
    print(f"Wrote {REPORT_PATH}")


if __name__ == "__main__":
    main()
