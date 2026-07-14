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
- **`hotelData.js`**: A centralized JSON-like structure containing curated hotel data for 8 destinations (Colombo Arrival, Sigiriya, Kandy, Nuwara Eliya, Yala, Weligama, Galle, Colombo Departure). Hotels are divided into 3 tiers: Premium, Standard, and Economy.

### 3. The Hotel Voting System (Firebase Integration)
Because GitHub Pages only serves static files, saving votes across 5 different phones requires a backend. We use **Firebase Realtime Database** for this.
- **Identity Gate**: On the first visit, the app prompts the user to select their name from the predefined list of 5 travelers. This identity is saved in the browser's `localStorage`.
- **Voting UI**: Inside each day's itinerary card, a `[ ホテルを選択 ]` (Choose Hotels) button appears. Clicking it opens a modal filtering the `hotelData` to show only hotels relevant to that day's destination.
- **Data Flow**: When a user clicks "第1希望" (Choice 1) on a hotel, the vote is sent directly to Firebase under the path: `votes/{destination}/{userName}/choice1 = hotelName`.
- **Group Dashboard**: The bottom navigation includes a "グループ投票結果" (Group Votes) button that queries the Firebase database and renders everyone's choices grouped by destination in real-time.

---

## 📁 File Structure

- `index.html`: The main entry point. Contains the UI shell, bottom navigation, and structural templates for all modals (Checklist, Documents, Voting, Identity).
- `js/app.js`: Contains the core logic for rendering the daily itinerary cards, handling the floating bottom navigation modals, and defining the `itineraryData`.
- `js/hotelData.js`: Contains the master object of all available hotels, organized by destination key and tier.
- `js/voting.js`: Contains all logic related to the voting system, including Firebase initialization, the identity gate, rendering the destination-specific hotel lists, pushing votes to Firebase, and rendering the Group Votes dashboard.
- `resources/`: Contains local images used in the itinerary cards.

---

## 🚀 Deployment
The app is continuously deployed via **GitHub Pages**. Pushing changes to the `main` branch of the repository automatically updates the live URL (https://thiyunujk.github.io/sri-lanka-tour/).
