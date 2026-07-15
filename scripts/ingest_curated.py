"""
Ingest a curated, human-verified hotel list for one destination and replace
that destination's array in js/hotelData.js wholesale. Other destinations
are left byte-for-byte untouched.

Usage:
    python scripts/ingest_curated.py <destination_key> <input_file>
    python scripts/ingest_curated.py <destination_key> -        # read stdin

Input format -- one hotel per line, fields separated by " / " (a slash with
optional surrounding spaces), in this exact order:

    Name / Booking URL / Total price / Star rating / Booking.com score / Free cancellation / Tier / Note

Example:
    Hotel Sigiriya / https://www.booking.com/hotel/lk/hotel-sigiriya.html / 45000 / 4 / 8.5 / Yes / Standard / Great rock views from the pool

Rules (per the curated-data spec):
  - Name (required), Booking URL (required, must be http(s))
  - Total price (required): digits only after stripping currency symbols/
    commas -> stored as group_total_price (JPY). No twin/single breakdown
    is stored since the curated paste doesn't provide one -- the card
    rendering already omits that row gracefully when absent.
  - Star rating (optional): 1-5 int -> star_rating
  - Booking.com score (optional): float -> booking_rating
  - Free cancellation (optional): Yes/No/true/false/blank -> drives
    price_note ("free_cancellation" | "non_refundable"), which the UI uses
    to render the "free cancellation" chip and localized price note text
    from the votingUI dictionary (no hardcoded bilingual strings per hotel).
  - Tier (required): Premium | Standard | Economy
  - Note (optional): free text -> short_description_en verbatim.
    NOT auto-translated -- short_description_ja is left blank rather than
    guessed, since a wrong translation is worse than none; the card
    rendering already omits the description line when blank. A human can
    fill in short_description_ja by hand later if desired.

Every ingested hotel additionally gets:
  - japanese_name: best-effort katakana via transliterate.py (dictionary of
    real hotel-industry vocabulary mined from the existing 144 entries,
    phonetic fallback for anything novel -- see transliterate.py's module
    docstring for the accuracy caveat)
  - verified: true
  - availability_checked: today's date (YYYY-MM-DD), or --date override
  - images.exterior_image: "" (placeholder UI renders a clean fallback)
  - image_source: "none"
  - agoda_url / official_website: intentionally absent (not collected here)

This script does not touch booking_url query params (checkin/checkout/
group_adults/no_rooms) -- those are appended at render time in voting.js
based on the trip's destDates map, not baked into stored data.
"""

import argparse
import datetime
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from transliterate import transliterate_name  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
HOTEL_DATA_PATH = ROOT / "js" / "hotelData.js"

TIER_JA = {
    "Premium": "プレミアム",
    "Standard": "スタンダード",
    "Economy": "エコノミー",
}

FREE_CANCEL_TRUE = {"yes", "y", "true", "1", "○", "free", "ok"}
FREE_CANCEL_FALSE = {"no", "n", "false", "0", "×", "non-refundable", "nonrefundable"}


class IngestError(ValueError):
    pass


def parse_price(text):
    """'¥45,000' / 'JPY 45000' / '45,000' -> 45000 (int)."""
    digits = re.sub(r"[^\d]", "", text or "")
    if not digits:
        raise IngestError(f"could not parse a price from {text!r}")
    return int(digits)


def parse_star_rating(text):
    text = (text or "").strip()
    if not text:
        return None
    m = re.search(r"\d+", text)
    if not m:
        raise IngestError(f"could not parse a star rating from {text!r}")
    return int(m.group(0))


def parse_score(text):
    text = (text or "").strip()
    if not text:
        return None
    m = re.search(r"\d+(\.\d+)?", text)
    if not m:
        raise IngestError(f"could not parse a Booking.com score from {text!r}")
    return float(m.group(0))


def parse_free_cancellation(text):
    key = (text or "").strip().lower()
    if not key:
        return None
    if key in FREE_CANCEL_TRUE:
        return True
    if key in FREE_CANCEL_FALSE:
        return False
    raise IngestError(f"could not parse free-cancellation flag from {text!r} (expected Yes/No)")


def parse_tier(text):
    key = (text or "").strip().lower()
    for tier in TIER_JA:
        if tier.lower() == key:
            return tier
    raise IngestError(f"tier must be one of Premium/Standard/Economy, got {text!r}")


def build_hotel(fields, today, line_no):
    if len(fields) < 8:
        fields = fields + [""] * (8 - len(fields))
    name, booking_url, price_text, star_text, score_text, cancel_text, tier_text, note = fields[:8]

    name = name.strip()
    booking_url = booking_url.strip()
    note = note.strip()

    if not name:
        raise IngestError(f"line {line_no}: hotel name is required")
    if not booking_url or not re.match(r"^https?://", booking_url):
        raise IngestError(f"line {line_no} ({name}): booking URL must start with http(s)://, got {booking_url!r}")

    try:
        group_total_price = parse_price(price_text)
        star_rating = parse_star_rating(star_text)
        booking_rating = parse_score(score_text)
        free_cancellation = parse_free_cancellation(cancel_text)
        tier = parse_tier(tier_text)
    except IngestError as e:
        raise IngestError(f"line {line_no} ({name}): {e}") from None

    hotel = {
        "name": name,
        "japanese_name": transliterate_name(name),
        "tier": tier,
        "tier_japanese": TIER_JA[tier],
    }
    if star_rating is not None:
        hotel["star_rating"] = star_rating

    hotel["group_total_price"] = group_total_price
    hotel["currency"] = "JPY"

    if booking_rating is not None:
        hotel["booking_rating"] = booking_rating

    if free_cancellation is True:
        hotel["price_note"] = "free_cancellation"
    elif free_cancellation is False:
        hotel["price_note"] = "non_refundable"
    # else: unknown -> omit price_note, UI shows no chip/note

    hotel["booking_url"] = booking_url
    # agoda_url, official_website: intentionally absent

    if note:
        hotel["short_description_en"] = note
        # short_description_ja intentionally left unset (not translated)

    hotel["images"] = {"exterior_image": ""}
    hotel["image_source"] = "none"

    hotel["verified"] = True
    hotel["availability_checked"] = today

    return hotel


def parse_input(text):
    """Returns a list of hotel field-lists. Blank lines and '#' comment
    lines are ignored."""
    blocks = []
    for line_no, raw_line in enumerate(text.splitlines(), start=1):
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        # Split only on "/" that has whitespace on both sides, so slashes
        # inside the booking URL (which have no surrounding spaces) survive.
        fields = [f.strip() for f in re.split(r"\s+/\s+", line)]
        blocks.append((line_no, fields))
    return blocks


def load_hotel_data():
    text = HOTEL_DATA_PATH.read_text(encoding="utf-8")
    m = re.match(r"^\s*const\s+hotelData\s*=\s*(.*?)\s*;?\s*$", text, re.S)
    if not m:
        raise ValueError("Could not locate 'const hotelData = ...' wrapper in hotelData.js")
    return json.loads(m.group(1))


def save_hotel_data(data):
    body = json.dumps(data, indent=2, ensure_ascii=False)
    HOTEL_DATA_PATH.write_text(f"const hotelData = {body};\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("destination", help="destination key, e.g. sigiriya")
    parser.add_argument("input_file", help="path to the curated text file, or '-' for stdin")
    parser.add_argument("--date", default=None, help="override availability_checked date (YYYY-MM-DD); defaults to today")
    args = parser.parse_args()

    today = args.date or datetime.date.today().isoformat()

    if args.input_file == "-":
        raw_text = sys.stdin.read()
    else:
        raw_text = Path(args.input_file).read_text(encoding="utf-8")

    blocks = parse_input(raw_text)
    if not blocks:
        print("No hotel lines found in input.", file=sys.stderr)
        sys.exit(1)

    hotels = []
    errors = []
    for line_no, fields in blocks:
        try:
            hotels.append(build_hotel(fields, today, line_no))
        except IngestError as e:
            errors.append(str(e))

    if errors:
        print(f"{len(errors)} error(s) while parsing -- fix and re-run. Nothing was written.", file=sys.stderr)
        for e in errors:
            print(" -", e, file=sys.stderr)
        sys.exit(1)

    data = load_hotel_data()
    previous_count = len(data.get(args.destination, []))
    data[args.destination] = hotels
    save_hotel_data(data)

    print(f"Replaced '{args.destination}': {previous_count} -> {len(hotels)} hotels.")
    for h in hotels:
        price_note = h.get("price_note", "(none)")
        print(f"  - {h['name']} [{h['japanese_name']}] tier={h['tier']} total={h['group_total_price']} price_note={price_note}")
    print(f"Wrote {HOTEL_DATA_PATH}")


if __name__ == "__main__":
    main()
