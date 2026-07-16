"""
Ingest a curated, human-collected hotel list for one destination and
replace that destination's array in js/hotelData.js wholesale. Other
destinations are left byte-for-byte untouched.

Usage:
    python scripts/ingest_curated.py <destination_key> <input_file>
    python scripts/ingest_curated.py <destination_key> -        # read stdin

Input format -- this matches what a human actually pastes out of a
Booking.com search session (see scripts/curated/sigiriya.txt for a real
example). Hotels are separated by lines of dashes of ANY length ("--",
"---", "-------------", ...); the same dash-line style is also used
*inside* a block as a sub-separator, so block boundaries are actually
detected by "Name:" lines, not by the dashes (which are stripped and
otherwise ignored). Each block looks like:

    Name: <hotel name>
    Booking URL: <raw Booking.com URL, with tracking query string>
    ---
    Total price (<room config text, may contain nested parens>): ¥<base>
    +¥<taxes> taxes and charges as shown
    ---
    Star rating: <integer | N/A | new>
    Booking.com score: <float>
    Free cancellation: <free text, e.g. "Free cancellation before 5 August 2026"
                         or "Total cost to cancel">
    Tier (<any commentary>): <Premium | Standard | Economy, case-insensitive>
    One-line note: (optional -- "<one or more paragraphs>")

Parsing is tolerant of: varying dash-separator lengths and positions,
blank lines, trailing commas, the price+taxes line being split in two,
and multi-paragraph notes. It is NOT tolerant of a missing/unparseable
required field -- that raises an error naming the block and field rather
than silently skipping or guessing, since bad data here becomes a wrong
price or wrong cancellation term on a card someone books a real room from.
"""

import argparse
import datetime
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, urlencode

sys.path.insert(0, str(Path(__file__).resolve().parent))
from transliterate import transliterate_name  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
HOTEL_DATA_PATH = ROOT / "js" / "hotelData.js"

TIER_JA = {
    "Premium": "プレミアム",
    "Standard": "スタンダード",
    "Economy": "エコノミー",
}

# Mirrors js/voting.js's buildDestDates() output exactly: derived from
# dayToDest + trip start (Aug 10, 2026), with day 11 excluded because it
# has no hotel night (fly-out day). If the itinerary ever changes, update
# both places together.
DEST_DATES = {
    "colombo_arrival":   {"checkin": "2026-08-10", "checkout": "2026-08-12"},
    "sigiriya":          {"checkin": "2026-08-12", "checkout": "2026-08-15"},
    "kandy":             {"checkin": "2026-08-15", "checkout": "2026-08-16"},
    "nuwara_eliya":      {"checkin": "2026-08-16", "checkout": "2026-08-17"},
    "yala":              {"checkin": "2026-08-17", "checkout": "2026-08-18"},
    "colombo_departure": {"checkin": "2026-08-18", "checkout": "2026-08-20"},
}

MONTHS = {
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12,
}

FIELD_LABELS = ["Star rating", "Booking.com score", "Free cancellation", "Tier", "One-line note"]


class IngestError(ValueError):
    pass


def extract_balanced_parens(text, open_idx):
    """text[open_idx] must be '('. Returns (inner_content, index_after_close)."""
    if text[open_idx] != "(":
        raise IngestError(f"expected '(' at position {open_idx}")
    depth = 0
    i = open_idx
    while i < len(text):
        if text[i] == "(":
            depth += 1
        elif text[i] == ")":
            depth -= 1
            if depth == 0:
                return text[open_idx + 1:i], i + 1
        i += 1
    raise IngestError("unbalanced parentheses")


def strip_separator_lines(text):
    """Removes lines that are pure dash separators (any length >= 2),
    which appear both between blocks and as sub-separators within a
    block -- they carry no data either way."""
    lines = text.splitlines()
    kept = [ln for ln in lines if not re.match(r"^\s*-{2,}\s*$", ln)]
    return "\n".join(kept)


def split_into_blocks(text):
    """Splits on lines starting with 'Name:' (case-insensitive), since
    dash-separators are not reliably block boundaries (they're also used
    as sub-separators inside a block)."""
    cleaned = strip_separator_lines(text)
    parts = re.split(r"(?im)^(?=Name:\s*)", cleaned)
    return [p.strip("\n") for p in parts if p.strip()]


def _find_label(text, label, flags=re.I | re.M):
    """Returns the match object for '^\\s*<label>' (NOT including the
    colon) or None. Used only for 'Total price'/'Tier', whose colon comes
    after a parenthetical rather than directly after the label."""
    pattern = r"^\s*" + re.escape(label) + r"\s*"
    return re.search(pattern, text, flags)


def _simple_field(text, label):
    """Extracts the rest of the line after 'label:' for single-line
    fields (Name, Booking URL, Star rating, Booking.com score, Free
    cancellation). Returns the stripped value, or None if the label
    isn't present."""
    pattern = r"^\s*" + re.escape(label) + r"\s*:\s*(.*)$"
    m = re.search(pattern, text, re.I | re.M)
    return m.group(1).strip() if m else None


def parse_star_rating(text):
    key = text.strip().lower()
    if key in ("n/a", "na", ""):
        return None, False
    if key == "new":
        return None, True
    m = re.match(r"^\d+$", key)
    if not m:
        raise IngestError(f"could not parse star rating from {text!r} (expected an integer, 'N/A', or 'new')")
    return int(key), False


def parse_cancellation(raw_text):
    raw = raw_text.strip()
    lowered = raw.lower()
    # Curated-input placeholders the collector forgot to replace with real
    # Booking.com text (e.g. "<copy the EXACT text from Booking.com, e.g.
    # ...>"). These must error out rather than parse -- the bracketed
    # example text often contains a fake but well-formed date, which would
    # otherwise be silently ingested as a real cancellation deadline.
    if "<" in raw or lowered.startswith("e.g.") or "copy the exact text" in lowered:
        raise IngestError(f"cancellation text looks like an unfilled placeholder, not real data: {raw!r}")
    if re.fullmatch(r"(?i)free cancellation\s+anytime\.?", raw):
        return {"free": True, "deadline": None, "raw": raw}
    # Optional "HH:MM on" between "before" and the date -- Booking.com
    # sometimes includes a same-day cutoff time (e.g. "before 18:00 on 17
    # August 2026"); the time itself isn't tracked, only the date.
    m = re.search(
        r"(?i)free cancellation\s+before\s+(?:\d{1,2}:\d{2}\s+on\s+)?(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})",
        raw,
    )
    if m:
        day, month_name, year = m.groups()
        month = MONTHS.get(month_name.lower())
        if month is None:
            raise IngestError(f"could not parse month name {month_name!r} in cancellation text {raw!r}")
        deadline = datetime.date(int(year), month, int(day)).isoformat()
        return {"free": True, "deadline": deadline, "raw": raw}
    # Anything not clearly stating free cancellation (e.g. "Total cost to
    # cancel") is treated as non-refundable.
    return {"free": False, "deadline": None, "raw": raw}


def clean_room_config(raw):
    text = re.sub(r"\s+", " ", raw).strip()
    text = re.sub(r"(?i)^(aug\s+\d{1,2}\s*-\s*\d{1,2}|your dates)\s*,\s*", "", text)
    text = text.strip(" ,")
    return text


def derive_short_description(long_note):
    if not long_note:
        return ""
    first_para = long_note.split("\n\n", 1)[0].strip()
    sentences = re.split(r"(?<=[.!?])\s+", first_para)
    return " ".join(sentences[:2]).strip()


def parse_price_field(block, name):
    m = _find_label(block, "Total price")
    if not m:
        raise IngestError(f"block ({name}): missing 'Total price' field")
    i = m.end()
    while i < len(block) and block[i].isspace():
        i += 1
    if i >= len(block) or block[i] != "(":
        raise IngestError(f"block ({name}): 'Total price' has no parenthetical room description")
    raw_room_config, after_paren = extract_balanced_parens(block, i)
    rest = block[after_paren:].lstrip()
    if not rest.startswith(":"):
        raise IngestError(f"block ({name}): expected ':' after 'Total price (...)'")
    rest = rest[1:]

    # Value runs until the next known field label (or end of block).
    next_positions = [pos for pos in (_pos(rest, lbl) for lbl in FIELD_LABELS) if pos is not None]
    end = min(next_positions) if next_positions else len(rest)
    price_blob = rest[:end]
    price_blob_flat = re.sub(r"\s+", " ", price_blob)

    base_m = re.search(r"¥\s*([\d,]+)", price_blob_flat)
    if not base_m:
        raise IngestError(f"block ({name}): could not find a base price (¥...) in {price_blob_flat!r}")
    price_base = int(base_m.group(1).replace(",", ""))

    taxes_m = re.search(r"\+\s*¥\s*([\d,]+)", price_blob_flat)
    price_taxes = int(taxes_m.group(1).replace(",", "")) if taxes_m else 0

    return {
        "room_config": clean_room_config(raw_room_config),
        "price_base": price_base,
        "price_taxes": price_taxes,
        "price_total": price_base + price_taxes,
    }


def _pos(text, label):
    m = _find_label(text, label)
    return m.start() if m else None


def parse_tier_field(block, name):
    m = _find_label(block, "Tier")
    if not m:
        raise IngestError(f"block ({name}): missing 'Tier' field")
    i = m.end()
    while i < len(block) and block[i].isspace():
        i += 1
    if i < len(block) and block[i] == "(":
        _, i = extract_balanced_parens(block, i)  # discard commentary, e.g. "(your judgment)"
    rest = block[i:].lstrip()
    if not rest.startswith(":"):
        raise IngestError(f"block ({name}): expected ':' after 'Tier (...)'")
    rest = rest[1:]
    line_end = rest.find("\n")
    value = (rest if line_end == -1 else rest[:line_end]).strip()
    for tier in TIER_JA:
        if tier.lower() == value.lower():
            return tier
    raise IngestError(f"block ({name}): tier must be one of Premium/Standard/Economy, got {value!r}")


def parse_note_field(block):
    m = _find_label(block, "One-line note")
    if not m:
        return "", ""
    rest = block[m.end():].lstrip()
    if not rest.startswith(":"):
        raise IngestError("expected ':' after 'One-line note'")
    value = rest[1:].strip()
    value = re.sub(r'^\(optional\s*[—\-–]\s*"', "", value)
    value = re.sub(r'"\s*\)\s*$', "", value)
    long_note = value.strip()
    return long_note, derive_short_description(long_note)


def parse_block(block, block_no, today, destination):
    name = _simple_field(block, "Name")
    if name is None:
        raise IngestError(f"block {block_no}: missing 'Name' field")
    if not name:
        raise IngestError(f"block {block_no}: 'Name' field is empty")

    raw_url = _simple_field(block, "Booking URL")
    if raw_url is None:
        raise IngestError(f"block ({name}): missing 'Booking URL' field")
    if not re.match(r"^https?://", raw_url):
        raise IngestError(f"block ({name}): Booking URL must start with http(s)://, got {raw_url!r}")

    dest_dates = DEST_DATES.get(destination)
    if not dest_dates:
        raise IngestError(f"no DEST_DATES entry for destination {destination!r}")
    booking_url = canonicalize_booking_url(raw_url, dest_dates)

    price = parse_price_field(block, name)

    star_text = _simple_field(block, "Star rating")
    if star_text is None:
        raise IngestError(f"block ({name}): missing 'Star rating' field")
    star_rating, is_new = parse_star_rating(star_text)

    score_text = _simple_field(block, "Booking.com score")
    if score_text is None:
        raise IngestError(f"block ({name}): missing 'Booking.com score' field")
    # Tolerate stray trailing punctuation from copy-paste typos (e.g. "8.6>"),
    # since the leading number is unambiguous -- unlike price or cancellation
    # fields, there's no real value being guessed here.
    score_clean = re.sub(r"[^\d.]+$", "", score_text.strip())
    try:
        review_score = float(score_clean)
    except ValueError:
        raise IngestError(f"block ({name}): could not parse Booking.com score from {score_text!r}") from None

    cancel_text = _simple_field(block, "Free cancellation")
    if cancel_text is None:
        raise IngestError(f"block ({name}): missing 'Free cancellation' field")
    if not cancel_text:
        raise IngestError(f"block ({name}): 'Free cancellation' field is empty")
    cancellation = parse_cancellation(cancel_text)

    tier = parse_tier_field(block, name)
    long_note_en, short_description_en = parse_note_field(block)

    hotel = {
        "name": name,
        "japanese_name": transliterate_name(name),
        "tier": tier,
        "tier_japanese": TIER_JA[tier],
    }
    if star_rating is not None:
        hotel["star_rating"] = star_rating
    hotel["is_new"] = is_new

    hotel["room_config"] = price["room_config"]
    hotel["price_base"] = price["price_base"]
    hotel["price_taxes"] = price["price_taxes"]
    hotel["price_total"] = price["price_total"]
    hotel["currency"] = "JPY"

    hotel["review_score"] = review_score
    hotel["cancellation"] = cancellation

    hotel["booking_url"] = booking_url

    if short_description_en:
        hotel["short_description_en"] = short_description_en
    if long_note_en:
        hotel["long_note_en"] = long_note_en

    hotel["images"] = {"exterior_image": ""}
    hotel["image_source"] = "none"

    hotel["verified"] = True
    hotel["availability_checked"] = today

    return hotel


def canonicalize_booking_url(raw_url, dest_dates):
    """Strips the entire query string (sid/aid/label/all tracking) and
    appends exactly the params the card needs."""
    parts = urlsplit(raw_url)
    clean_base = urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))
    params = {
        "checkin": dest_dates["checkin"],
        "checkout": dest_dates["checkout"],
        "group_adults": "5",
        "no_rooms": "3",
        "group_children": "0",
    }
    return clean_base + "?" + urlencode(params)


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
    parser.add_argument("--allow-partial", action="store_true",
                         help="write successfully parsed hotels even if some blocks failed "
                              "(failures are printed to stderr, not silently dropped)")
    args = parser.parse_args()

    today = args.date or datetime.date.today().isoformat()

    if args.input_file == "-":
        raw_text = sys.stdin.read()
    else:
        raw_text = Path(args.input_file).read_text(encoding="utf-8")

    blocks = split_into_blocks(raw_text)
    if not blocks:
        print("No 'Name:' blocks found in input.", file=sys.stderr)
        sys.exit(1)

    hotels = []
    errors = []
    for i, block in enumerate(blocks, start=1):
        try:
            hotels.append(parse_block(block, i, today, args.destination))
        except IngestError as e:
            errors.append(str(e))

    if errors:
        if not args.allow_partial:
            print(f"{len(errors)} error(s) while parsing -- fix and re-run. Nothing was written.", file=sys.stderr)
            for e in errors:
                print(" -", e, file=sys.stderr)
            sys.exit(1)
        print(f"{len(errors)} block(s) failed to parse and were skipped (--allow-partial set):", file=sys.stderr)
        for e in errors:
            print(" -", e, file=sys.stderr)
        if not hotels:
            print("No blocks parsed successfully; nothing written.", file=sys.stderr)
            sys.exit(1)

    data = load_hotel_data()
    previous_count = len(data.get(args.destination, []))
    data[args.destination] = hotels
    save_hotel_data(data)

    print(f"Replaced '{args.destination}': {previous_count} -> {len(hotels)} hotels.")
    for h in hotels:
        c = h["cancellation"]
        cancel_desc = f"free until {c['deadline']}" if c["free"] else "non-refundable"
        print(f"  - {h['name']} [{h['japanese_name']}] tier={h['tier']} total=¥{h['price_total']:,} "
              f"(base=¥{h['price_base']:,}+tax=¥{h['price_taxes']:,}) cancellation={cancel_desc} "
              f"star={h.get('star_rating')} is_new={h['is_new']}")
        print(f"      url={h['booking_url']}")
    print(f"Wrote {HOTEL_DATA_PATH}")


if __name__ == "__main__":
    main()
