# Sri Lanka Tour & Hotel Voting App

## 🎯 Project Goal
The primary goal of this project is to serve as a mobile-first, interactive digital itinerary for a group of 5 friends traveling to Sri Lanka. Instead of relying on static PDFs or shared documents, this web application provides a dynamic daily schedule, essential travel documents, packing checklists, and—most importantly—a **Multiplayer Hotel Voting System**. 

The group has not yet finalized their hotel bookings. To solve this, the app allows the 5 travelers (チユヌ, イガラシ, チコ, ナカマ, ルミコ) to view curated hotel options for each destination and cast their 1st, 2nd, and 3rd choices to ensure everyone agrees and to have backup options if a hotel is fully booked.

---

## 🏗️ Architecture & Design

### 1. Front-End Technologies
- **HTML5 & Vanilla JavaScript**: The app is built without complex frameworks (no React, Vue, or npm build steps) to ensure it can be easily hosted on GitHub Pages as a static site.
- **Tailwind CSS**: Used via a CDN script for rapid, utility-first styling. The design focuses on a modern, clean, and warm aesthetic using colors like orange, emerald, and slate.
- **Responsive & Mobile-First**: The layout is optimized for smartphone screens, featuring a floating bottom navigation bar and touch-friendly modals.

### 2. Data Structure
All content is separated from the UI logic to make updates easy.
- **`itineraryData` (in `app.js`)**: An array of objects containing the daily schedule, dates, timeline events, and associated destinations.
- **`hotelData.js`**: A flat, per-destination-key object. Every hotel is a flat record (no nested tier grouping) with a `tier` field (`Premium`/`Standard`/`Economy`) used to filter at render time. Key fields: `price_base`/`price_taxes`/`price_total` (JPY, tax-inclusive total is what's shown), `cancellation: { free, deadline, raw }` (deadline is `null` for non-refundable or true "anytime" cancellation), `verified: true` + `availability_checked` (an ISO date, shown as a badge), and `japanese_name` (hand-reviewed katakana, not just a machine transliteration).
  - **Currently curated from real Booking.com listings** (real prices, real cancellation terms, real availability as of mid-July 2026): `colombo_arrival`, `sigiriya`, `kandy`, `nuwara_eliya`, `yala`, `colombo_departure` — 36 hotels total, 6 per destination. The itinerary never visits Galle or Weligama, so those destination keys don't exist in `hotelData.js` (their `destinationMeta` entries remain in `voting.js` for UI purposes, but there's no hotel data behind them).
  - **Ingestion pipeline**: hotels are collected by hand from Booking.com (a human copies name/URL/price/cancellation text/tier per hotel into a `scripts/curated/<destination>.txt` file), then `python scripts/ingest_curated.py <destination> scripts/curated/<destination>.txt` parses that file and replaces the destination's array wholesale. The parser is intentionally strict — a missing or unparseable field errors out naming the block, rather than guessing (use `--allow-partial` to keep the hotels that did parse while reporting the rest). Re-run ingestion any time a `scripts/curated/*.txt` file is updated.
  - **Placeholder-photo policy**: no fabricated stock photos. Every hotel has `images.exterior_image: ""` and `image_source: "none"`; the UI shows a destination-colored gradient placeholder with the hotel name instead of a broken or fake `<img>`.

### 3. The Hotel Voting System (Firebase Integration)
Because GitHub Pages only serves static files, saving votes across 5 different phones requires a backend. We use **Firebase Realtime Database** for this — unchanged by the hotel-data work above.
- **Identity Gate**: On the first visit, the app prompts the user to select their name from the predefined list of 5 travelers. This identity is saved in the browser's `localStorage`.
- **Voting UI**: Inside each day's itinerary card, a `[ ホテルを選択 ]` (Choose Hotels) button appears. Clicking it opens a modal filtering the `hotelData` to show only hotels relevant to that day's destination.
- **Vote deadline**: `VOTE_DEADLINE = '2026-08-03'` in `voting.js` — the group needs to finalize before hotels' own free-cancellation windows start closing. A banner stating this shows at the top of both the hotel selection and group votes modals, and any hotel whose cancellation deadline falls on or before that date gets an amber "decide before vote close" chip.
- **Data Flow**: When a user clicks "第1希望" (Choice 1) on a hotel, the vote is sent directly to Firebase under the path: `votes/{destination}/{userName}/choice1 = hotelName`.
- **Group Dashboard**: The bottom navigation includes a "グループ投票結果" (Group Votes) button that queries the Firebase database and renders everyone's choices grouped by destination in real-time.

---

## 📁 File Structure

- `index.html`: The main entry point. Contains the UI shell, bottom navigation, and structural templates for all modals (Checklist, Documents, Voting, Identity).
- `js/app.js`: Contains the core logic for rendering the daily itinerary cards, handling the floating bottom navigation modals, and defining the `itineraryData`.
- `js/hotelData.js`: Contains the master object of all available hotels, organized by destination key; see Data Structure above. Generated/replaced by `ingest_curated.py`, not hand-edited.
- `js/voting.js`: Contains all logic related to the voting system, including Firebase initialization, the identity gate, rendering the destination-specific hotel lists, pushing votes to Firebase, rendering the Group Votes dashboard, and the vote-deadline banner/chip.
- `scripts/curated/<destination>.txt`: Hand-collected Booking.com listing data, one file per destination, in the input format `ingest_curated.py` expects.
- `scripts/ingest_curated.py`: Parses a `scripts/curated/*.txt` file and replaces that destination's array in `hotelData.js`.
- `resources/`: Contains local images used in the itinerary cards.

---

## 🚀 Deployment
The app is continuously deployed via **GitHub Pages**. Pushing changes to the `main` branch of the repository automatically updates the live URL (https://thiyunujk.github.io/sri-lanka-tour/).

### Testing against Firebase — TEST_MODE is mandatory
The voting system's real data lives in the Firebase `votes` node (real voter names and choices).
**All automated or manual testing of the voting flow MUST load the page with `?test=1`**, e.g.
`https://thiyunujk.github.io/sri-lanka-tour/?test=1`. This sets `TEST_MODE = true` in `js/voting.js`,
which routes every vote read/write to `votes_test/` instead of `votes/`, and shows a red
「テストモード」/ "TEST MODE" ribbon above the header so a test session can never be mistaken for a
real one. Never exercise the voting flow against a normal (no-param) load. Before any testing
outside of `?test=1` (e.g. inspecting production data), run `scripts/backup_votes.py` first — see
that script's docstring and `docs/incident-2026-07.md` for why.
