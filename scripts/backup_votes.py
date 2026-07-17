"""
Read-only backup of the live Firebase `votes` node.

Fetches https://srilanka-tour-hotels-default-rtdb.firebaseio.com/votes.json
via a single GET and writes the raw JSON to backups/votes-<ISO-timestamp>.json.
Never writes to Firebase. backups/ is gitignored -- vote data (voter names,
choices) is real user data and does not belong in a public repo.

Run before any manual or automated testing that could plausibly touch the
production `votes` node, and periodically as a safety net. For actual test
runs, prefer TEST_MODE (js/voting.js, activated via ?test=1) which never
touches `votes` at all -- this backup is a fallback, not a substitute.

Usage:
    python scripts/backup_votes.py
"""

import json
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

DATABASE_URL = "https://srilanka-tour-hotels-default-rtdb.firebaseio.com"
VOTES_ENDPOINT = f"{DATABASE_URL}/votes.json"

REPO_ROOT = Path(__file__).resolve().parent.parent
BACKUPS_DIR = REPO_ROOT / "backups"


def fetch_votes() -> bytes:
    req = urllib.request.Request(VOTES_ENDPOINT, method="GET")
    with urllib.request.urlopen(req, timeout=30) as resp:
        if resp.status != 200:
            raise RuntimeError(f"unexpected status {resp.status} from {VOTES_ENDPOINT}")
        return resp.read()


def main() -> int:
    try:
        raw = fetch_votes()
    except urllib.error.URLError as exc:
        print(f"backup_votes: failed to reach {VOTES_ENDPOINT}: {exc}", file=sys.stderr)
        return 1

    # Validate it's actually JSON before writing anything to disk.
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"backup_votes: response was not valid JSON: {exc}", file=sys.stderr)
        return 1

    BACKUPS_DIR.mkdir(exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")
    out_path = BACKUPS_DIR / f"votes-{timestamp}.json"
    out_path.write_text(json.dumps(parsed, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"backup_votes: wrote {out_path} ({len(raw)} bytes fetched)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
