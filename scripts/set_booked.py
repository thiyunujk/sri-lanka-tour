"""
Set (or clear) the confirmed-booking marker for one destination.

Writes to the Firebase `booked/{destKey}` node (or `booked_test/{destKey}`
under --test), the single source of truth js/voting.js reads at load to
show the green "booked" banner on day cards, lock that destination's voting
modal, and mark the booked hotel on the group-votes dashboard. There is no
in-app admin UI for this -- booking decisions are entered here, by hand, by
whoever is actually confirming a room.

Before writing, the given hotel name is validated against js/hotelData.js
for that destination (exact match on the English `name` field -- the same
string voting.js stores for a vote) so a typo can never silently produce a
banner nobody's hotel matches.

Usage:
    python scripts/set_booked.py <destKey> "<hotel name>"
    python scripts/set_booked.py <destKey> "<hotel name>" --date 2026-07-20
    python scripts/set_booked.py <destKey> --clear
    python scripts/set_booked.py <destKey> "<hotel name>" --test   # booked_test/, for ?test=1 verification

Both forms write to the LIVE `booked/` node unless --test is given, and (for
a live write) ask for a y/n confirmation naming the destination and hotel
before touching Firebase -- pass --yes to skip that prompt for scripted use.
"""

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOTEL_DATA_PATH = ROOT / "js" / "hotelData.js"
DATABASE_URL = "https://srilanka-tour-hotels-default-rtdb.firebaseio.com"


def load_hotel_data():
    text = HOTEL_DATA_PATH.read_text(encoding="utf-8")
    m = re.match(r"^\s*const\s+hotelData\s*=\s*(.*?)\s*;?\s*$", text, re.S)
    if not m:
        raise ValueError("Could not locate 'const hotelData = ...' wrapper in hotelData.js")
    return json.loads(m.group(1))


def booked_endpoint(dest_key: str, test_mode: bool) -> str:
    node = "booked_test" if test_mode else "booked"
    return f"{DATABASE_URL}/{node}/{dest_key}.json"


def firebase_request(url: str, method: str, payload=None) -> None:
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method,
                                  headers={"Content-Type": "application/json"} if data else {})
    with urllib.request.urlopen(req, timeout=30) as resp:
        if resp.status not in (200, 204):
            raise RuntimeError(f"unexpected status {resp.status} from {url}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("dest_key", help="destination key, e.g. sigiriya (must exist in hotelData.js)")
    parser.add_argument("hotel_name", nargs="?", help="exact English hotel name from hotelData.js (required unless --clear)")
    parser.add_argument("--date", help="bookedDate as YYYY-MM-DD; defaults to today (UTC)")
    parser.add_argument("--clear", action="store_true", help="remove the booked marker for this destination instead of setting one")
    parser.add_argument("--test", action="store_true", help="write to booked_test/ instead of the live booked/ node")
    parser.add_argument("--yes", "-y", action="store_true", help="skip the confirmation prompt for a live (non---test) write")
    args = parser.parse_args()

    try:
        hotel_data = load_hotel_data()
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"set_booked: failed to read {HOTEL_DATA_PATH}: {exc}", file=sys.stderr)
        return 1

    if args.dest_key not in hotel_data:
        known = ", ".join(sorted(hotel_data.keys()))
        print(f"set_booked: unknown destination '{args.dest_key}'. Known destinations: {known}", file=sys.stderr)
        return 1

    node = "booked_test" if args.test else "booked"
    url = booked_endpoint(args.dest_key, args.test)

    if args.clear:
        if args.hotel_name:
            print("set_booked: --clear takes no hotel name, only a destination", file=sys.stderr)
            return 1
        if not args.test and not args.yes:
            reply = input(f"Clear the LIVE booked/{args.dest_key} marker? [y/N] ").strip().lower()
            if reply != "y":
                print("set_booked: aborted")
                return 1
        try:
            firebase_request(url, "DELETE")
        except urllib.error.URLError as exc:
            print(f"set_booked: failed to reach {url}: {exc}", file=sys.stderr)
            return 1
        print(f"set_booked: cleared {node}/{args.dest_key}")
        return 0

    if not args.hotel_name:
        print("set_booked: a hotel name is required unless --clear is given", file=sys.stderr)
        return 1

    valid_names = [h.get("name") for h in hotel_data[args.dest_key]]
    if args.hotel_name not in valid_names:
        print(f"set_booked: '{args.hotel_name}' is not a hotel name in hotelData.js under '{args.dest_key}'.", file=sys.stderr)
        print("Valid names:", file=sys.stderr)
        for name in valid_names:
            print(f"  - {name}", file=sys.stderr)
        return 1

    booked_date = args.date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", booked_date):
        print(f"set_booked: --date must be YYYY-MM-DD, got '{booked_date}'", file=sys.stderr)
        return 1

    payload = {"hotel": args.hotel_name, "bookedDate": booked_date}

    if not args.test and not args.yes:
        reply = input(
            f"Write to the LIVE booked/{args.dest_key}: hotel={args.hotel_name!r}, "
            f"bookedDate={booked_date!r}? [y/N] "
        ).strip().lower()
        if reply != "y":
            print("set_booked: aborted")
            return 1

    try:
        firebase_request(url, "PUT", payload)
    except urllib.error.URLError as exc:
        print(f"set_booked: failed to reach {url}: {exc}", file=sys.stderr)
        return 1

    print(f"set_booked: wrote {node}/{args.dest_key} = {json.dumps(payload, ensure_ascii=False)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
