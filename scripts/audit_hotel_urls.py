"""
Read-only audit of booking_url / agoda_url validity for all 144 hotels
in js/hotelData.js. Does NOT modify hotelData.js.

For each URL:
  - fake_placeholder : example.com or empty/missing
  - http_403         : blocked (real HTTP 403, or a 200 page whose body is
                        an obvious bot-block/interstitial page)
  - http_404         : not found
  - other_error      : timeout, DNS failure, 5xx, or any other error
  - redirect_generic : 200, but the final URL / page looks like a generic
                        homepage or search-results page rather than a
                        specific property page
  - ok               : 200 and the final URL looks like a specific
                        property page

Also takes a sample of up to 10 'ok' URLs and checks whether an og:image
(or twitter:image) meta tag is present on that page.

Writes scripts/url_audit_report.json.
"""

import json
import re
import socket
import ssl
import sys
import time
import urllib.error
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))
from fetch_real_images import (  # noqa: E402
    USER_AGENT,
    TIMEOUT_SECONDS,
    SSL_CONTEXT,
    MAX_HTML_BYTES,
    http_get,
    extract_candidate_images,
    load_hotel_data,
)

ROOT = Path(__file__).resolve().parent.parent
REPORT_PATH = ROOT / "scripts" / "url_audit_report.json"

DELAY_BETWEEN_REQUESTS = 0.5  # seconds
OG_IMAGE_SAMPLE_SIZE = 10

BOT_BLOCK_MARKERS = [
    "access denied",
    "attention required",
    "checking your browser",
    "unusual traffic",
    "are you a human",
    "captcha",
    "request unsuccessful",
    "pardon our interruption",
    "reference id",  # generic Akamai/Imperva block page footer text
    "awswafcookiedomainlist",  # AWS WAF JS challenge (seen on booking.com)
    "__challenge_",
    "reportchallengeerror",
]

FIELD_HOST = {
    "booking_url": "booking.com",
    "agoda_url": "agoda.com",
}


def is_fake_placeholder(url):
    if not url or not str(url).strip():
        return True
    host = urlparse(url).netloc.lower()
    return "example.com" in host or host == ""


def fetch_page(url):
    """Returns (status_code, final_url, html_text) or raises."""
    with http_get(url) as resp:
        final_url = resp.geturl()
        status = resp.status
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
        return status, final_url, html


def looks_generic(field, final_url, html):
    """True if the final URL/page looks like a homepage or search-results
    page rather than a specific hotel property page."""
    path = urlparse(final_url).path.lower()
    query = urlparse(final_url).query.lower()

    if "/hotel/" in path:
        return False

    if path in ("", "/") :
        return True
    if "searchresults" in path or "search" in query:
        return True
    if re.search(r"/index\.(html?|php)?$", path):
        return True
    # No recognizable property-page path segment for either site's typical
    # URL shape -> treat conservatively as generic.
    return True


def is_bot_block(html):
    low = html[:6000].lower()
    return any(marker in low for marker in BOT_BLOCK_MARKERS)


def classify_url(field, url):
    """Returns dict: status, final_url, note."""
    if is_fake_placeholder(url):
        return {"status": "fake_placeholder", "final_url": "", "note": "example.com or empty URL"}

    try:
        status, final_url, html = fetch_page(url)
    except socket.timeout:
        return {"status": "other_error", "final_url": "", "note": "timeout"}
    except urllib.error.HTTPError as e:
        if e.code == 403:
            return {"status": "http_403", "final_url": e.geturl() or url, "note": "HTTP 403"}
        if e.code == 404:
            return {"status": "http_404", "final_url": e.geturl() or url, "note": "HTTP 404"}
        return {"status": "other_error", "final_url": e.geturl() or url, "note": f"HTTP {e.code}"}
    except (urllib.error.URLError, ssl.SSLError, ConnectionError, OSError, ValueError) as e:
        return {"status": "other_error", "final_url": "", "note": str(e)}

    if is_bot_block(html):
        return {"status": "http_403", "final_url": final_url, "note": f"HTTP {status} but body is a bot-block/interstitial/JS-challenge page"}

    if status != 200:
        return {"status": "other_error", "final_url": final_url, "note": f"HTTP {status}"}

    if looks_generic(field, final_url, html):
        return {"status": "redirect_generic", "final_url": final_url, "note": "final URL/page looks like a homepage or search page"}

    return {"status": "ok", "final_url": final_url, "note": ""}


def main():
    data = load_hotel_data()
    report = []

    total_urls = sum(
        1
        for hotels in data.values()
        for h in hotels
        for field in ("booking_url", "agoda_url")
    )
    done = 0

    for destination, hotels in data.items():
        for h in hotels:
            for field in ("booking_url", "agoda_url"):
                done += 1
                url = h.get(field, "")
                print(f"[{done}/{total_urls}] {destination}: {h.get('name','')} [{field}] ...", end=" ", flush=True)
                result = classify_url(field, url)
                print(result["status"])
                report.append({
                    "destination": destination,
                    "name": h.get("name", ""),
                    "field": field,
                    "url": url,
                    "status": result["status"],
                    "final_url": result["final_url"],
                    "note": result["note"],
                })
                time.sleep(DELAY_BETWEEN_REQUESTS)

    # --- og:image extractability sample ---
    ok_entries = [r for r in report if r["status"] == "ok"]
    sample = ok_entries[:OG_IMAGE_SAMPLE_SIZE]
    og_sample_results = []
    for entry in sample:
        print(f"[og:image sample] {entry['name']} [{entry['field']}] ...", end=" ", flush=True)
        try:
            status, final_url, html = fetch_page(entry["url"])
            candidates = extract_candidate_images(html)
            has_og = len(candidates) > 0
            og_sample_results.append({
                "destination": entry["destination"],
                "name": entry["name"],
                "field": entry["field"],
                "url": entry["url"],
                "og_image_found": has_og,
                "og_image_url": candidates[0] if candidates else "",
            })
            print("og:image found" if has_og else "no og:image")
        except Exception as e:
            og_sample_results.append({
                "destination": entry["destination"],
                "name": entry["name"],
                "field": entry["field"],
                "url": entry["url"],
                "og_image_found": False,
                "og_image_url": "",
                "error": str(e),
            })
            print("error:", e)
        time.sleep(DELAY_BETWEEN_REQUESTS)

    output = {
        "url_audit": report,
        "og_image_sample": og_sample_results,
    }
    REPORT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {REPORT_PATH}")


if __name__ == "__main__":
    main()
