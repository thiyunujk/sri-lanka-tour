# Incident report — data-safety incident referenced 2026-07-17 (partial reconstruction)

**Status: PARTIAL RECONSTRUCTION. Not a first-hand account.**

This report was assembled by a Claude Code session on 2026-07-17 that has **no memory of the
incident it is documenting**. The incident was described (by the project owner) as having occurred
in a different Claude Code session, on a different machine, at an unknown prior date. This session
has no conversation history, no cross-session memory entry, and no first-hand knowledge of what
happened. Everything below was reconstructed from artifacts left in this repository and in the live
Firebase project as of 2026-07-17. It should be treated as a starting point for the original
session's author to confirm or correct, not as a verified account.

## 1. Evidence found

Verifiable facts, each with its source. Checked on 2026-07-17.

- **Git history contains no commit that ever added a backup, snapshot, or test-mode file.**
  Source: `git log --all --diff-filter=A --name-only --oneline` filtered for
  `test|backup|snapshot|firebase` returns only two commits, both original feature work:
  `483a6f0 Initialize Firebase Realtime Database for Hotel Voting` and
  `800fe98 Implement Hotel Voting System UI and Firebase logic`. No commit named or containing a
  backup/snapshot artifact exists on any branch.

- **No commit diff, on any branch, contains the strings `votes_test`, `TEST_MODE`,
  `backup_votes`, `pre-test`, or `test-mode`.**
  Source: `git log --all -p | grep -iE "votes_test|TEST_MODE|backup_votes|pre-test|test-mode|firebase.*test"`
  returned zero matches.

- **The working tree is clean and has no untracked files.**
  Source: `git status --porcelain=v1 -uall` returned no output — nothing staged, modified, or
  untracked, including no stray backup/snapshot JSON left on disk from a prior session.

- **No stash entries and no dangling/unreachable commits exist in this local repo.**
  Source: `git stash list` (empty) and `git fsck --no-reflog --unreachable --dangling` (empty).
  If the incident happened on *this* machine and left a commit that was later reset or amended
  away, git would normally still hold it as a dangling object — there isn't one. This is evidence
  the incident (if it involved commits) did not happen in this local repo, consistent with the
  owner's statement that it happened on a different machine.

- **The reflog only goes back to the fast-forward pull that produced the current HEAD**
  (`f9ee7df`); it shows no evidence of resets, hard-resets, or forced ref updates on this clone.

- **`.gitignore` currently contains only one entry, `.claude/`** (added in commit `f9ee7df`,
  "Ignore local Claude Code configuration folder"). It has never ignored a `backups/` directory or
  any votes-related path — so if a snapshot file was ever created and gitignored during the
  incident, that .gitignore change did not happen in this repository's history.

- **`js/voting.js` contains the live Firebase config** (`databaseURL:
  "https://srilanka-tour-hotels-default-rtdb.firebaseio.com"`, `js/voting.js:290`) and writes/reads
  directly against the `votes` node at the database root (`db.ref('votes')`, e.g.
  `js/voting.js:854`). There is currently no code path, flag, or URL parameter that redirects
  reads/writes to any other node — i.e., as of this session's start, every vote interaction in the
  deployed code touches the single production `votes` node with no isolation. This matches the
  premise of Step 2 of the current task (add `TEST_MODE`) and is consistent with an incident
  scenario where test activity had no separate node to land in.

- **The live `votes` node, read once via a read-only GET against the Firebase REST API on
  2026-07-17T05:24:26Z, currently contains data for one voter, `チユヌ`, across five destinations**
  (`colombo_arrival`, `colombo_departure`, `nuwara_eliya`, `sigiriya`, `yala`) — see the Baseline
  section below for the full payload. This is a *current* fact, not evidence about the incident
  itself, but it establishes what production data exists today.

## 2. Unknown

What cannot be determined from this machine, this repository, or this session's memory:

- **What specifically happened** — whether it was a test script writing to the production `votes`
  node, an accidental overwrite, a deletion, a schema change, or something else.
- **When it happened** — no commit, reflog entry, or file timestamp in this repo corresponds to it.
- **Which operations touched the production node and what data was in it at the time** — this
  session has no access to Firebase's own audit/history log (Realtime Database does not retain a
  queryable change history via the REST API used here; that would require the Firebase console's
  own history feature or Cloud Logging, neither of which this session has credentials or access
  path for).
- **How any "pre-test state" snapshot was captured** — no such snapshot exists anywhere in this
  repo (tracked, untracked, stashed, or dangling), so the mechanism, timing, and reasoning behind
  it cannot be reconstructed from here. It may have been a manual export, a REST GET redirected to
  a local file, or something else entirely — unknown.
- **How "byte-for-byte verification" was performed** — no script, log, or diff artifact describing
  a comparison exists in this repo. Cannot be reconstructed.
- **Whether the original session's changes (if any) were ever committed and later removed, or
  were simply never committed** — both are consistent with the evidence (a clean repo with no
  dangling objects), and this session cannot distinguish between them.
- **What remains at risk** — without knowing what the incident actually was, this session cannot
  assess residual risk beyond the general, evidence-backed fact stated above: production `votes`
  currently has no test-mode isolation, so *any* future testing against this code as it stood
  before this task risked writing to or reading from real voter data. That gap is what Step 2 of
  the current task closes going forward.

## 3. Baseline — live `votes` node as of this session

Captured via a single read-only `GET` against the Firebase REST API, no auth token used (the node
currently allows public read per the app's existing rules).

- **Timestamp:** 2026-07-17T05:24:26Z
- **Endpoint:** `https://srilanka-tour-hotels-default-rtdb.firebaseio.com/votes.json`
- **HTTP status:** 200
- **Full payload:**

```json
{
  "colombo_arrival": {
    "チユヌ": {
      "choice1": "Granbell Hotel Colombo",
      "choice2": "Mandarina Colombo",
      "choice3": "Orion City Hotel"
    }
  },
  "colombo_departure": {
    "チユヌ": {
      "choice1": "Marino Beach Colombo",
      "choice2": "C 1 Colombo Fort"
    }
  },
  "nuwara_eliya": {
    "チユヌ": {
      "choice1": "Araliya Green City - Your Gateway to Everything in Nuwara Eliya",
      "choice2": "Yara Nuwara Eliya",
      "choice3": "Wonder hills"
    }
  },
  "sigiriya": {
    "チユヌ": {
      "choice1": "Cinnamon Lodge Habarana",
      "choice2": "Pinthaliya Resort",
      "choice3": "Sandila Nivasa"
    }
  },
  "yala": {
    "チユヌ": {
      "choice1": "Wild Coast Tented Lodge - Relais and Chateaux - All Inclusive",
      "choice2": "Yala Villa",
      "choice3": "Blue Sky Hotel Yala"
    }
  }
}
```

This baseline is also captured as a timestamped file by `scripts/backup_votes.sh` (Step 2 of this
task), so this exact payload should additionally exist at `backups/votes-2026-07-17T*.json`
immediately after that script's first run.

## Next step

This document should be reviewed and corrected by whoever ran the original session where the
incident occurred, filling in Sections 1–2 with the first-hand account (what test/tooling was run,
what production data existed at the time, how the pre-test snapshot and byte-for-byte check were
actually done). Until then, treat this as an evidence log, not a closed incident report.

---

# Incident 2 — unredacted guide photos committed to a public repo (2026-07-17)

**Status: remediated, with two residual items tracked below. This is a first-hand account —
written by the same session that caused and then fixed the exposure.**

## What was exposed

A prior task in this same session added 5 photos to `resources/guide/` for the Documents-hub
guide section: 4 group photos containing unredacted faces of past tour guests and traditional
Kandyan dancers, and a photo of the guide's physical National Tourist Guide license card showing
his full license number, category, issue/expiry dates, and a QR code. These were committed
(`140b785`) and pushed to this repository's public GitHub remote
(`github.com/thiyunujk/sri-lanka-tour`), and served live via GitHub Pages.

**Exposure window:** from the `140b785` push until the history rewrite below, roughly within the
same working session (2026-07-17). The repo has been public throughout.

## Remediation performed

1. Redacted all 5 photos in place (separate task, commit `38bafa5`): every face other than the
   guide's own was pixelated + blurred; every license text field except his name and the
   "National Tourist Guide" title was blacked out. Verified unreadable at full size before and
   after committing.
2. Discovered that overwriting + committing on top does **not** remove the original unredacted
   blobs from git history — `140b785` remained fetchable via GitHub's raw-content URLs. Flagged
   this to the project owner rather than treating the redaction commit as sufficient on its own.
3. With explicit confirmation, ran a full history rewrite:
   - Backed up the entire repo first: `git clone --mirror . ../sl-trip-backup-before-filter-repo.git`.
   - Copied the redacted files out to a temp location outside the repo.
   - `git filter-repo --invert-paths --path resources/guide/ --force` — purged `resources/guide/`
     from every commit in history. The follow-up redaction commit (`38bafa5`) had touched nothing
     else, so it became empty and was auto-pruned.
   - Restored the redacted files as a new commit (`cc7da2e`, "feat: guide photos (redacted)").
   - Re-added the `origin` remote (filter-repo removes it) and force-pushed `main`.
4. Verified: `git log --all -- resources/guide/` now shows only `cc7da2e`; `git cat-file -e` on
   the old commit SHA fails locally ("not a valid object name"); the live site
   (`thiyunujk.github.io/sri-lanka-tour`) still renders the guide section correctly and serves the
   redacted images (SHA-256 verified against the redacted files, not the originals).

## Residual items — not fully closed

- **GitHub raw-content caching.** `raw.githubusercontent.com/.../140b785/...` and
  `.../38bafa5/...` still return HTTP 200 with the *original* content after the force-push. The
  blob is unreachable from any ref in the repo (confirmed above), but GitHub's CDN/object storage
  had not yet garbage-collected it at verification time. This can take anywhere from hours to
  longer, and for a truly sensitive exposure GitHub also offers a support request to force cache
  purging of specific URLs — worth filing if this needs to be closed faster than GC alone.
- **The other machine.** The original session that produced the unredacted photos ran on a
  different, unspecified machine. If that machine (or anywhere else) still has a clone of this
  repo made before the force-push, `git pull` there will fail to fast-forward (history diverged)
  and, if force-pulled or merged carelessly, could reintroduce the old history. Any such clone
  needs to be **deleted and freshly re-cloned** from `origin/main`, not synced.
