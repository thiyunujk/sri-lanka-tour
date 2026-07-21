// --- HOTEL VOTING SYSTEM ---

const destinationMeta = {
  colombo_arrival:   { ja: 'コロンボ（到着）', en: 'Colombo (Arrival)' },
  colombo_departure: { ja: 'コロンボ（出発）', en: 'Colombo (Departure)' },
  sigiriya:          { ja: 'シギリヤ', en: 'Sigiriya' },
  kandy:             { ja: 'キャンディ', en: 'Kandy' },
  nuwara_eliya:      { ja: 'ヌワラエリヤ', en: 'Nuwara Eliya' },
  yala:              { ja: 'ヤラ', en: 'Yala' },
  galle:             { ja: 'ゴール', en: 'Galle' },
  weligama:          { ja: 'ウェリガマ', en: 'Weligama' }
};

// Every user-facing string rendered by this file, per language
const votingUI = {
  ja: {
    choices: ['第1希望', '第2希望', '第3希望'],
    tierTabs: { Premium: 'プレミアム', Standard: 'スタンダード', Economy: 'エコノミー' },
    hotelModalSubtitle: '第1、第2、第3希望を選択',
    groupVotesTitle: 'グループ投票結果',
    emptyTier: 'このティアにはホテルがありません',
    unknownDest: 'この目的地のホテルデータはまだありません。',
    identityTitle: '誰が投票しますか？',
    identitySubtitle: '名前を選択してください。',
    welcome: (name) => `ようこそ、${name}さん！ホテルの投票ができます。`,
    dbConnectError: 'データベースに接続できませんでした！',
    saveSuccess: (hotel, n) => `${hotel} を第${n}希望として保存しました！`,
    moveSuccess: (hotel, n) => `${hotel} を第${n}希望に変更しました！`,
    unvoteSuccess: (hotel, n) => `${hotel} の第${n}希望を取り消しました。`,
    saveErrorPrefix: '保存エラー: ',
    dbNotInit: 'データベースが初期化されていません！',
    loadingVotes: '投票を読み込んでいます...',
    noVotes: 'まだ投票がありません — 最初の投票をどうぞ！',
    loadErrorPrefix: '読み込みエラー: ',
    groupTotal: 'グループ合計',
    showDetails: '詳細を見る ▾',
    hideDetails: '閉じる ▴',
    twinRoom: 'ツインルーム',
    singleRoom: 'シングルルーム',
    checkIn: 'チェックイン',
    checkOut: 'チェックアウト',
    highlightsTitle: '良い点',
    disadvantagesTitle: '注意点',
    officialSite: '公式サイト',
    facilities: {
      breakfast: '朝食', swimming_pool: 'プール', wifi: 'WiFi', air_conditioning: 'エアコン',
      restaurant: 'レストラン', parking: '駐車場', gym: 'ジム', front_desk_24h: '24hフロント'
    },
    verifiedBadge: (monthDay) => `✓ 空室確認済み (${monthDay}時点)`,
    freeCancellation: 'キャンセル無料',
    morePhotos: 'もっと写真を見る',
    totalInclTax: '総額（税込）',
    roomRate: '宿泊料金',
    taxesFees: '税・サービス料',
    roomSetup: '部屋構成',
    freeCancelUntil: (monthDay) => `${monthDay}まで無料キャンセル`,
    nonRefundable: '返金不可',
    newProperty: '新規オープン',
    fewReviewsNote: '※レビュー数少',
    voteDeadlineBanner: '投票締切: 8月3日（キャンセル無料期限のため）',
    deadlineWarningChip: '⚠ 締切前に要決定',
    bookedBanner: (name) => `✓ 予約済み：${name}`,
    bookedMapsLink: 'Googleマップで見る',
    votingLockedNote: 'この宿泊地は予約確定済みです',
    votingClosedBanner: '投票は締め切りました',
    bookedMarkerChip: '✓ 予約済み',
    switchUser: 'ユーザー切替',
    hotelsHubTitle: 'ホテル',
    tonightBadge: '今夜の宿',
    archiveLinkLabel: '投票結果・他の候補を見る',
    bookedRoomTitle: '予約した部屋',
    votesCount: (n, total) => `${n}/${total}人が投票済み`,
    pointsLabel: (n) => `${n}点`,
    closeRace: '接戦！',
    seeAllVotes: '全員の投票を見る ▾',
    howToTitle: '使い方 ❔',
    // Occupancy-dependent -- prepended to howToBullets at render time via
    // getOccupancy(currentDestKey), since Colombo (4名・2部屋) differs from
    // every other destination (5名・3部屋).
    priceDisclaimer: (occ) => `価格は私たちの実際の日程・${occ.adults}名・${occ.rooms}部屋分の実際の総額です（2026年7月中旬に確認済み）。`,
    colomboOccupancyNote: (occ) => `※ コロンボはカップル2組のみ宿泊（${occ.adults}名・${occ.rooms}部屋）`,
    howToBullets: [
      '「Booking.com」ボタンをタップすると最新の価格を確認できます。',
      'プレミアム／スタンダード／エコノミーは星評価ではなく予算帯の目安です。',
      '第1〜第3希望をタップして順位をつけられます。8月3日まで何度でも変更・取り消しができます。',
      '⚠マークは、投票終了前にこのホテルのキャンセル無料期限が来ることを示します。早めの決定が必要です。'
    ]
  },
  en: {
    choices: ['1st Choice', '2nd Choice', '3rd Choice'],
    tierTabs: { Premium: 'Premium', Standard: 'Standard', Economy: 'Economy' },
    hotelModalSubtitle: 'Pick your 1st, 2nd and 3rd choices',
    groupVotesTitle: 'Group Vote Results',
    emptyTier: 'No hotels in this tier',
    unknownDest: 'No hotel data for this destination yet.',
    identityTitle: 'Who is voting?',
    identitySubtitle: 'Please select your name.',
    welcome: (name) => `Welcome, ${name}! You can now vote for hotels.`,
    dbConnectError: 'Could not connect to the database!',
    saveSuccess: (hotel, n) => `Saved ${hotel} as your ${['1st', '2nd', '3rd'][n - 1] || n} choice!`,
    moveSuccess: (hotel, n) => `Moved ${hotel} to your ${['1st', '2nd', '3rd'][n - 1] || n} choice!`,
    unvoteSuccess: (hotel, n) => `Removed ${hotel} from your ${['1st', '2nd', '3rd'][n - 1] || n} choice.`,
    saveErrorPrefix: 'Save error: ',
    dbNotInit: 'The database is not initialized!',
    loadingVotes: 'Loading votes...',
    noVotes: 'No votes yet — be the first!',
    loadErrorPrefix: 'Load error: ',
    groupTotal: 'Group Total',
    showDetails: 'See details ▾',
    hideDetails: 'Close ▴',
    twinRoom: 'Twin Room',
    singleRoom: 'Single Room',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    highlightsTitle: 'Highlights',
    disadvantagesTitle: 'Considerations',
    officialSite: 'Official Site',
    facilities: {
      breakfast: 'Breakfast', swimming_pool: 'Pool', wifi: 'WiFi', air_conditioning: 'A/C',
      restaurant: 'Restaurant', parking: 'Parking', gym: 'Gym', front_desk_24h: '24h Desk'
    },
    verifiedBadge: (monthDay) => `✓ Availability checked (as of ${monthDay})`,
    freeCancellation: 'Free cancellation',
    morePhotos: 'More photos',
    totalInclTax: 'Total (incl. taxes)',
    roomRate: 'Room rate',
    taxesFees: 'Taxes & fees',
    roomSetup: 'Room setup',
    freeCancelUntil: (monthDay) => `Free cancel until ${monthDay}`,
    nonRefundable: 'Non-refundable',
    newProperty: 'New property',
    fewReviewsNote: '※ few reviews',
    voteDeadlineBanner: 'Voting closes Aug 3 (due to free-cancellation deadlines)',
    deadlineWarningChip: '⚠ Decide before vote close',
    bookedBanner: (name) => `✓ Booked: ${name}`,
    bookedMapsLink: 'View on Google Maps',
    votingLockedNote: 'This stay is already booked',
    votingClosedBanner: 'Voting has closed',
    bookedMarkerChip: '✓ Booked',
    switchUser: 'Switch user',
    hotelsHubTitle: 'Hotels',
    tonightBadge: 'Tonight',
    archiveLinkLabel: 'Voting results & other candidates',
    bookedRoomTitle: 'Your rooms',
    votesCount: (n, total) => `${n} of ${total} voted`,
    pointsLabel: (n) => `${n} pt${n === 1 ? '' : 's'}`,
    closeRace: 'Close race!',
    seeAllVotes: 'See everyone\'s votes ▾',
    howToTitle: 'How to use ❔',
    // Occupancy-dependent -- prepended to howToBullets at render time via
    // getOccupancy(currentDestKey), since Colombo (4 guests, 2 rooms) differs
    // from every other destination (5 guests, 3 rooms).
    priceDisclaimer: (occ) => `Prices are real, verified totals for our exact dates and ${occ.adults} guests, ${occ.rooms} rooms (checked mid-July 2026).`,
    colomboOccupancyNote: (occ) => `※ In Colombo, only the 2 couples stay (${occ.adults} guests, ${occ.rooms} rooms)`,
    howToBullets: [
      'Tap "Booking.com" on a card to check the current live price.',
      'Premium / Standard / Economy are budget bands, not star ratings.',
      'Tap 1st–3rd Choice to rank your picks — change or remove them anytime until Aug 3.',
      "A ⚠ chip means this hotel's free-cancellation window closes before voting ends, so it needs an early decision."
    ]
  }
};

// Hotels whose free-cancellation deadline falls on or before this date get
// an amber warning chip -- the group needs to decide before the hotel's
// own refund window closes, not just before the trip.
const VOTE_DEADLINE = '2026-08-03';

// Global freeze: once today's date passes VOTE_DEADLINE, voting locks for
// EVERY destination regardless of booked state (see isDestLocked below).
function isPastDeadline() {
  return new Date().toISOString().slice(0, 10) > VOTE_DEADLINE;
}

// A destination is read-only once either the group deadline has passed, or
// that specific destination has a hotel booked (bookedByDest, populated by
// refreshBookedState). Deadline takes precedence in the banner text (see
// lockBannerInfo) since it applies to every destination at once.
function isDestLocked(destKey) {
  if (isPastDeadline()) return true;
  return !!(bookedByDest[destKey] && bookedByDest[destKey].hotel);
}

// getCurrentLang() is defined in app.js, which loads after this file
function votingLang() {
  return (typeof getCurrentLang === 'function') ? getCurrentLang() : 'ja';
}

function votingT() {
  return votingUI[votingLang()] || votingUI.ja;
}

function getDestName(key) {
  const meta = destinationMeta[key];
  if (!meta) return key;
  return meta[votingLang()] || meta.ja;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// "" for anything that is not a finite number, so a missing price row is omitted
function formatPrice(value, currency) {
  const n = Number(value);
  if (value == null || value === '' || !isFinite(n)) return '';
  const symbol = currency === 'JPY' ? '¥' : (currency ? currency + ' ' : '');
  return symbol + n.toLocaleString('en-US');
}

const dayToDest = {
  1: 'colombo_arrival',
  2: 'colombo_arrival',
  3: 'sigiriya',
  4: 'sigiriya',
  5: 'sigiriya',
  6: 'kandy',
  7: 'nuwara_eliya',
  8: 'yala',
  9: 'colombo_departure',
  10: 'colombo_departure',
  11: 'colombo_departure'
};

// Gradient shown behind the 🏨 placeholder icon for hotels with no photo,
// one per destination so cards stay visually distinguishable in a list.
const destPlaceholderGradient = {
  colombo_arrival:   'from-sky-400 to-sky-600',
  colombo_departure: 'from-sky-500 to-indigo-600',
  sigiriya:          'from-amber-500 to-orange-600',
  kandy:             'from-emerald-500 to-teal-600',
  nuwara_eliya:      'from-teal-400 to-emerald-600',
  yala:              'from-yellow-600 to-amber-700',
  galle:             'from-blue-500 to-cyan-600',
  weligama:          'from-cyan-400 to-blue-500'
};
const DEFAULT_PLACEHOLDER_GRADIENT = 'from-slate-400 to-slate-600';

// Bump this whenever a resources/hotels/<slug>-room.jpg file is replaced
// in place (same filename, new bytes -- e.g. swapping in a sharper photo).
// Browsers that already cached the old image under that exact URL would
// otherwise keep serving it from cache indefinitely, since nothing else
// about the URL changes. Appended as a query string in hotelCardHTML's
// roomPhotoHTML; does not affect the main exterior thumbnail (hotelThumbHTML),
// only the booked-room photo.
const ROOM_PHOTO_CACHE_BUST = 'v2';

// Day 1 of the trip. destDates below is derived from this + dayToDest, so
// it stays correct if the itinerary's day-to-destination mapping changes.
const TRIP_START_DATE = new Date(Date.UTC(2026, 7, 10)); // Aug 10, 2026

function addDaysISO(baseDate, days) {
  const d = new Date(baseDate.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Day 11 is the trip's final day: per itineraryData (js/app.js) its "hotel"
// field is null -- the group just uses the Colombo hotel as a daytime base
// before a 21:00 flight, with no additional night booked. It's still
// mapped to colombo_departure in dayToDest above (so voting still resolves
// to the right hotel list from the Day 11 card), but it must NOT extend
// the colombo_departure checkout date the way an actual night would.
const DAYS_WITH_NO_HOTEL_NIGHT = [11];

// { destKey: { checkin: 'YYYY-MM-DD', checkout: 'YYYY-MM-DD' } }, derived
// from dayToDest: checkin = first day slept at that destination, checkout
// = the morning after the last day slept there.
function buildDestDates() {
  const spanByDest = {};
  Object.entries(dayToDest).forEach(([dayStr, dest]) => {
    const day = Number(dayStr);
    if (DAYS_WITH_NO_HOTEL_NIGHT.includes(day)) return;
    if (!spanByDest[dest]) {
      spanByDest[dest] = { minDay: day, maxDay: day };
    } else {
      spanByDest[dest].minDay = Math.min(spanByDest[dest].minDay, day);
      spanByDest[dest].maxDay = Math.max(spanByDest[dest].maxDay, day);
    }
  });
  const result = {};
  Object.entries(spanByDest).forEach(([dest, { minDay, maxDay }]) => {
    result[dest] = {
      checkin: addDaysISO(TRIP_START_DATE, minDay - 1),
      checkout: addDaysISO(TRIP_START_DATE, maxDay)
    };
  });
  return result;
}

const destDates = buildDestDates();

// 'YYYY-MM-DD' using the DEVICE's local calendar date, not UTC -- used for
// the Hotels hub's "tonight" highlight (checkin <= today < checkout), which
// must match what the traveler's phone actually shows as today's date.
function todayLocalISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// True while today (device local date) falls inside destKey's booked stay --
// checkin <= today < checkout. ISO 'YYYY-MM-DD' strings compare correctly
// lexicographically.
function isTonightAt(destKey) {
  const dates = destDates[destKey];
  if (!dates) return false;
  const today = todayLocalISO();
  return today >= dates.checkin && today < dates.checkout;
}

// { checkin, checkout } -> '8/12–15' (ja) or 'Aug 12–15' (en); spans a month
// boundary as '7/31–8/2' / 'Jul 31–Aug 2'.
function formatStayDateRange(checkinISO, checkoutISO, lang) {
  const parse = iso => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    return m ? { mo: Number(m[2]), d: Number(m[3]) } : null;
  };
  const ci = parse(checkinISO), co = parse(checkoutISO);
  if (!ci || !co) return '';
  if (lang === 'ja') {
    return ci.mo === co.mo ? `${ci.mo}/${ci.d}–${co.d}` : `${ci.mo}/${ci.d}–${co.mo}/${co.d}`;
  }
  return ci.mo === co.mo
    ? `${EN_MONTH_ABBR[ci.mo - 1]} ${ci.d}–${co.d}`
    : `${EN_MONTH_ABBR[ci.mo - 1]} ${ci.d}–${EN_MONTH_ABBR[co.mo - 1]} ${co.d}`;
}

// destDayGroups (js/app.js) -> 'Day 3–5' / 'Day 8'. Guarded with typeof since
// app.js (which defines it) loads after this file -- fine here because this
// only ever runs from a later user interaction, well after both scripts and
// DOMContentLoaded have executed.
function formatDayRange(destKey) {
  const group = (typeof destDayGroups !== 'undefined') ? destDayGroups[destKey] : null;
  if (!group || !group.length) return '';
  const min = Math.min(...group), max = Math.max(...group);
  return min === max ? `Day ${min}` : `Day ${min}–${max}`;
}

// '8/12–15・Day 3–5' (ja) / 'Aug 12–15 · Day 3–5' (en) for a booked stay.
function formatStaySpanCaption(destKey, lang) {
  const dates = destDates[destKey];
  if (!dates) return '';
  const parts = [formatStayDateRange(dates.checkin, dates.checkout, lang), formatDayRange(destKey)].filter(Boolean);
  return parts.join(lang === 'ja' ? '・' : ' · ');
}

// Destination keys with a confirmed booking, in trip (chronological) order --
// mirrors renderGroupVotes' orderedDestKeys, filtered down to booked ones.
function orderedBookedDestKeys() {
  return [...new Set(Object.keys(dayToDest).map(d => dayToDest[d]))]
    .filter(dest => Array.isArray(hotelData[dest]) && bookedByDest[dest] && bookedByDest[dest].hotel);
}

// True once every destination hotelData.js knows about has a confirmed
// booking -- i.e. the decision phase is fully over. Drives whether the
// identity gate still bothers prompting "who is voting" on load (see the
// DOMContentLoaded handler below): with nothing left to vote on, asking is
// an orphaned decision-phase affordance.
function allKnownDestinationsBooked() {
  return Object.keys(hotelData).every(dest => bookedByDest[dest] && bookedByDest[dest].hotel);
}

// Real sleeping arrangements per destination: in Colombo (both the arrival
// and departure legs) only the 2 couples stay at the hotel -- the organizer
// lives in Colombo and sleeps at home -- so those nights are 4 adults / 2
// rooms, not the full group of 5 / 3 rooms every other destination books.
// Mirrored in scripts/ingest_curated.py's DEST_OCCUPANCY -- keep both in
// sync if this ever changes.
const destOccupancy = {
  colombo_arrival:   { adults: 4, rooms: 2 },
  colombo_departure: { adults: 4, rooms: 2 }
  // all others default to { adults: 5, rooms: 3 } via getOccupancy below
};
const DEFAULT_OCCUPANCY = { adults: 5, rooms: 3 };

function getOccupancy(destKey) {
  return destOccupancy[destKey] || DEFAULT_OCCUPANCY;
}

// Appends checkin/checkout/group size to a Booking.com URL for verified
// hotels only (old, unverified booking_urls are known WAF-blocked anyway
// -- see scripts/url_audit_report.json -- so there's no point dating them).
// Curated hotels from ingest_curated.py already have these baked in at
// ingest time (see canonicalize_booking_url there) -- this is a no-op for
// those, it only fills in dates (and occupancy) for anything that isn't
// pre-canonicalized.
function withBookingDates(url, destKey) {
  if (!url) return url;
  if (url.includes('checkin=')) return url;
  const dates = destDates[destKey];
  if (!dates) return url;
  const occ = getOccupancy(destKey);
  const params = new URLSearchParams({
    checkin: dates.checkin,
    checkout: dates.checkout,
    group_adults: String(occ.adults),
    no_rooms: String(occ.rooms)
  });
  const sep = url.includes('?') ? '&' : '?';
  return url + sep + params.toString();
}

// 'YYYY-MM-DD' -> 'M/D' (no leading zeros), used in the verified-availability badge.
function formatMonthDay(isoDate) {
  const m = /^\d{4}-(\d{2})-(\d{2})/.exec(isoDate || '');
  if (!m) return isoDate || '';
  return `${Number(m[1])}/${Number(m[2])}`;
}

const EN_MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 'YYYY-MM-DD' -> 'M/D' (ja) or 'Mon D' (en), used in the free-cancellation-deadline chip.
function formatDeadline(isoDate, lang) {
  const m = /^\d{4}-(\d{2})-(\d{2})/.exec(isoDate || '');
  if (!m) return isoDate || '';
  const month = Number(m[1]);
  const day = Number(m[2]);
  return lang === 'ja' ? `${month}/${day}` : `${EN_MONTH_ABBR[month - 1]} ${day}`;
}

// TEST_MODE routes every vote read/write to votes_test/ instead of the real
// votes/ node, and unhides the red ribbon in index.html so a test session
// can never be mistaken for a real one. Default false -- only ever active
// when the page is loaded with ?test=1. ALL automated/manual testing of the
// voting flow MUST use ?test=1; never exercise voting against production
// votes/. See docs/incident-2026-07.md and context.md's deployment section.
const TEST_MODE = new URLSearchParams(window.location.search).get('test') === '1';

// Single source of truth for which Firebase node votes read/write against --
// every db.ref() call that touches vote data must go through this, never a
// literal 'votes' string.
function votesRootPath() {
  return TEST_MODE ? 'votes_test' : 'votes';
}

// Mirrors votesRootPath() for the booked/{destKey} node -- same TEST_MODE
// isolation rules apply: ?test=1 must never read or write the live booked/
// node, only booked_test/. scripts/set_booked.py's --test flag targets the
// same booked_test/ node.
function bookedRootPath() {
  return TEST_MODE ? 'booked_test' : 'booked';
}

const firebaseConfig = {
  apiKey: "AIzaSyAt9qkyMnpz5G9lJ6Sv0rZrZwrZMXP5zaw",
  authDomain: "srilanka-tour-hotels.firebaseapp.com",
  databaseURL: "https://srilanka-tour-hotels-default-rtdb.firebaseio.com",
  projectId: "srilanka-tour-hotels",
  storageBucket: "srilanka-tour-hotels.firebasestorage.app",
  messagingSenderId: "372596220117",
  appId: "1:372596220117:web:4f69869d795637c12ac25c"
};

let db = null;
if (firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
}

const VOTER_NAMES = ["チユヌ", "イガラシ", "チコ", "ナカマ", "ルミコ"];
let currentVoter = localStorage.getItem('voterName');
let currentDestKey = null;
let currentTier = 'Premium';
// Whether the currently-open hotel-selection modal (currentDestKey) is
// read-only -- recomputed by isDestLocked() each time the modal opens, and
// consulted by renderHotelList/hotelCardHTML to decide whether to render
// vote buttons at all.
let currentDestLocked = false;
// { choice1: hotelName|null, choice2: ..., choice3: ... } for currentVoter at
// currentDestKey. Fetched once per modal open (see refreshMyVotes), then
// kept in sync locally via optimistic updates after each successful vote
// write -- not a live listener, since only this user's own actions change it.
let currentUserVotes = {};

// { destKey: { choice1, choice2, choice3 } } for currentVoter, across ALL
// destinations -- powers the day cards' Choose/Voted button state. Loaded
// once on identity resolution (see refreshAllMyVotes), then kept in sync
// via optimistic updates alongside currentUserVotes after each vote write.
let myVotesByDest = {};

function hasAnyVoteForDest(destKey) {
  const v = myVotesByDest[destKey];
  return !!(v && (v.choice1 || v.choice2 || v.choice3));
}

// { destKey: { hotel: '<English name>', bookedDate: 'YYYY-MM-DD' } } for
// every destination that has a confirmed booking. Written only by
// scripts/set_booked.py -- there is no in-app admin UI. Loaded once at
// startup (see refreshBookedState call below), independent of currentVoter
// since the booked banner/lock must show even before identity is chosen.
let bookedByDest = {};

// Fetches the whole booked/ (or booked_test/, under TEST_MODE) node in one
// read, alongside the vote-state cache (refreshAllMyVotes below).
function refreshBookedState() {
  if (!db) {
    bookedByDest = {};
    return Promise.resolve();
  }
  return db.ref(bookedRootPath()).once('value')
    .then(snapshot => { bookedByDest = snapshot.val() || {}; })
    .catch(() => { bookedByDest = {}; });
}

// Fetches currentVoter's votes for every destination in one read of the
// `votes` node (cheaper than 6 separate per-destination reads).
function refreshAllMyVotes() {
  if (!currentVoter || !db) {
    myVotesByDest = {};
    return Promise.resolve();
  }
  return db.ref(votesRootPath()).once('value')
    .then(snapshot => {
      const data = snapshot.val() || {};
      const next = {};
      Object.keys(hotelData).forEach(destKey => {
        next[destKey] = (data[destKey] && data[destKey][currentVoter]) || {};
      });
      myVotesByDest = next;
    })
    .catch(() => { myVotesByDest = {}; });
}

function refreshHotelButtonsIfReady() {
  if (typeof updateAllHotelButtons === 'function') updateAllHotelButtons();
}

function checkIdentity() {
  if (!currentVoter) {
    const T = votingT();
    openModal('modal-identity');
    document.getElementById('identity-title').textContent = T.identityTitle;
    document.getElementById('identity-subtitle').textContent = T.identitySubtitle;
    const container = document.getElementById('voter-buttons');
    container.innerHTML = VOTER_NAMES.map(name =>
      `<button onclick="setVoter('${name}')" class="w-full p-3 text-left font-bold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-xl transition-colors shadow-sm">${name}</button>`
    ).join('');
  }
}

function setVoter(name) {
  currentVoter = name;
  localStorage.setItem('voterName', name);
  closeAllModals();
  refreshAllMyVotes().then(refreshHotelButtonsIfReady);
  // Small delay for UI smoothness
  setTimeout(() => {
    alert(votingT().welcome(name));
  }, 300);
}

// Clears the stored identity and reopens the identity gate, so a different
// traveler can vote from the same device/browser without clearing storage
// manually.
function switchUser() {
  currentVoter = null;
  localStorage.removeItem('voterName');
  myVotesByDest = {};
  currentUserVotes = {};
  refreshHotelButtonsIfReady();
  closeAllModals();
  setTimeout(() => {
    checkIdentity();
  }, 300);
}

// Kick off the votes fetch immediately for a returning visitor whose
// identity is already known from localStorage (checkIdentity only handles
// the first-visit case). Buttons refresh once this resolves -- app.js may
// not have defined updateAllHotelButtons yet at this exact line, but by the
// time this async read comes back it certainly has (see refreshHotelButtonsIfReady).
// Also tracked as a promise so the DOMContentLoaded identity-gate check below
// can wait for bookedByDest to actually be populated before deciding whether
// there's anything left to vote on.
const bookedStateReady = refreshBookedState().then(refreshHotelButtonsIfReady);
if (currentVoter) {
  refreshAllMyVotes().then(refreshHotelButtonsIfReady);
}

// { text, locked } for whichever banner (hotel-selection or group-votes
// modal) is currently shown for destKey. The global deadline note always
// wins over the per-destination booked note, since once VOTE_DEADLINE has
// passed every destination is locked regardless of booking status.
function lockBannerInfo(destKey) {
  const T = votingT();
  if (isPastDeadline()) return { text: T.votingClosedBanner, locked: true };
  if (bookedByDest[destKey] && bookedByDest[destKey].hotel) return { text: T.votingLockedNote, locked: true };
  return { text: T.voteDeadlineBanner, locked: false };
}

// Swaps a deadline-banner element between its normal amber "reminder" look
// and a neutral slate "locked" look, driven by lockBannerInfo's `locked` flag.
function applyLockBannerStyle(el, info) {
  if (!el) return;
  el.textContent = info.text;
  el.classList.toggle('bg-amber-50', !info.locked);
  el.classList.toggle('border-amber-100', !info.locked);
  el.classList.toggle('text-amber-700', !info.locked);
  el.classList.toggle('bg-slate-100', info.locked);
  el.classList.toggle('border-slate-200', info.locked);
  el.classList.toggle('text-slate-600', info.locked);
}

// Google Maps link for a hotel: prefers an explicit google_maps_url on the
// hotel record, else falls back to a maps search built from its address or
// name -- so the link is always present even before hotelData.js grows
// dedicated address/maps fields.
function bookedGoogleMapsUrl(hotel) {
  if (hotel && hotel.google_maps_url) return hotel.google_maps_url;
  const query = hotel && (hotel.address || hotel.name);
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '';
}

// Shared address / tap-to-call phone / Maps-link markup for one hotel --
// used by the day-card booked banner, the single-hotel detail view, and the
// Hotels hub cards, so the three views can never drift out of sync on what
// "practical info" means. Any field the hotel record doesn't have (address,
// phone) is simply omitted rather than fabricated -- matches this codebase's
// existing no-invented-data convention (see the placeholder-photo policy).
function hotelContactLinesHTML(hotel, T) {
  const mapsUrl = bookedGoogleMapsUrl(hotel);
  const addressLine = hotel && hotel.address
    ? `<p class="text-[11px] text-slate-600 py-1">${escapeHtml(hotel.address)}</p>` : '';
  // phoneLine/mapsLine are the two TAPPABLE items here, so each gets its own
  // flex row with a 44px-tall hit area (touch-target minimum) -- `flex` makes
  // an <a> block-level, so plain callers (a bare <div> wrapper, e.g.
  // bookedBannerHTML/contactHTML below) get these stacked on separate lines
  // for free, while flex-row callers (the Hotels hub card) lay them out as
  // side-by-side chips via their own gap. Either way the previous bug --
  // two bare inline <a> tags rendering flush against each other with zero
  // gap ("+94778694838View on Google Maps") -- can't recur.
  const phoneLine = hotel && hotel.phone
    ? `<a href="tel:${escapeHtml(hotel.phone.replace(/\s+/g, ''))}" class="flex items-center min-h-[44px] text-[12px] font-semibold text-blue-600 hover:text-blue-700">${escapeHtml(hotel.phone)}</a>` : '';
  const mapsLine = mapsUrl
    ? `<a href="${escapeHtml(mapsUrl)}" target="_blank" rel="noopener noreferrer" class="flex items-center min-h-[44px] text-[12px] font-semibold text-sky-600 hover:text-sky-700 underline">${T.bookedMapsLink}</a>` : '';
  return { addressLine, phoneLine, mapsLine };
}

// The green "✓ Booked" confirmation banner shown on a day card in place of
// the Choose/Voted button once bookedByDest[destKey] is set. Returns '' if
// the destination is not booked.
function bookedBannerHTML(destKey) {
  const bookedInfo = bookedByDest[destKey];
  if (!bookedInfo || !bookedInfo.hotel) return '';
  const T = votingT();
  const lang = votingLang();
  const hotels = hotelData[destKey];
  const hotel = Array.isArray(hotels) ? hotels.find(h => h.name === bookedInfo.hotel) : null;
  const jaName = (hotel && hotel.japanese_name) || bookedInfo.hotel;
  const enName = (hotel && hotel.name) || bookedInfo.hotel;
  const displayName = lang === 'ja' ? jaName : enName;
  const bannerLabel = T.bookedBanner(displayName);

  const { addressLine, phoneLine, mapsLine } = hotelContactLinesHTML(hotel, T);
  const timeParts = [];
  if (hotel && hotel.check_in_time) timeParts.push(`${T.checkIn} ${hotel.check_in_time}`);
  if (hotel && hotel.check_out_time) timeParts.push(`${T.checkOut} ${hotel.check_out_time}`);
  const timesLine = timeParts.length
    ? `<p class="text-[11px] text-slate-600">${escapeHtml(timeParts.join(' · '))}</p>` : '';
  const practicalLines = [addressLine, phoneLine, timesLine, mapsLine].filter(Boolean).join('');

  return `
    <button type="button" onclick="openBookedHotelDetail('${destKey}')" class="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border-2 border-emerald-500 text-emerald-700 text-xs font-bold rounded-xl transition-colors text-center">
      ${escapeHtml(bannerLabel)}
    </button>
    ${practicalLines ? `<div class="mt-2 space-y-0.5 px-1">${practicalLines}</div>` : ''}`;
}

// Shows/hides the decision-phase chrome (tier tabs, how-to box, deadline
// banner) around the hotel-list-container. Visible for the archive/candidate
// -list path (openHotelCandidateList) where it's still meaningful; hidden for
// the trip-mode single-hotel path (openBookedHotelDetail), where there is
// nothing left to decide and "Pick your 1st/2nd/3rd choice" or a vote-close
// countdown would just be confusing leftover copy.
function setHotelModalChromeVisible(visible) {
  document.getElementById('hotel-tier-tabs').classList.toggle('hidden', !visible);
  document.getElementById('how-to-toggle').closest('.border-b').classList.toggle('hidden', !visible);
  document.getElementById('vote-deadline-banner-hotel').classList.toggle('hidden', !visible);
}

// Trip-mode single-hotel detail view: opened from a day card's booked banner
// or a Hotels hub card. Shows ONLY the confirmed hotel -- no tier tabs, no
// other candidates, no vote buttons (hotelCardHTML's locked=true already
// suppresses those) -- by reusing hotelCardHTML for the card itself and then
// force-expanding its detail section in place of the collapsed toggle.
function openBookedHotelDetail(destKey) {
  const bookedInfo = bookedByDest[destKey];
  if (!bookedInfo || !bookedInfo.hotel || !hotelData[destKey]) return;
  const hotel = hotelData[destKey].find(h => h.name === bookedInfo.hotel);
  if (!hotel) return;

  currentDestKey = destKey;
  const T = votingT();
  const lang = votingLang();
  openModal('modal-hotel-selection');
  document.getElementById('modal-title-hotel-dest').innerText = getDestName(destKey);
  document.getElementById('modal-subtitle-hotel').textContent = '';
  document.getElementById('modal-colombo-note-hotel').classList.add('hidden');
  setHotelModalChromeVisible(false);

  resetHotelListScroll();
  const container = document.getElementById('hotel-list-container');
  container.innerHTML = hotelCardHTML(hotel, lang, T, destKey, true, { hideDeadlineChip: true });
  const card = container.querySelector('[data-hotel-card]');
  if (card) {
    const details = card.querySelector('[data-details]');
    const toggleBtn = card.querySelector('[data-toggle-details]');
    if (details) details.classList.remove('hidden');
    if (toggleBtn) toggleBtn.remove();
  }
}

// Opens the full, tier-tabbed candidate list for one destination -- the
// archive view. Reachable today from the Hotels hub's "voting results & other
// candidates" link into the group-votes dashboard (see the destination
// header's onclick in renderGroupVotes). Always read-only here since a
// destination only ever gets this far once it's booked (isDestLocked).
function openHotelCandidateList(destKey) {
  currentDestKey = destKey;
  if (!currentDestKey || !hotelData[currentDestKey]) {
    alert(votingT().unknownDest);
    return;
  }
  const T = votingT();
  const occ = getOccupancy(currentDestKey);
  openModal('modal-hotel-selection');
  document.getElementById('modal-title-hotel-dest').innerText = getDestName(currentDestKey);
  document.getElementById('modal-subtitle-hotel').textContent = T.hotelModalSubtitle;
  setHotelModalChromeVisible(true);
  applyLockBannerStyle(document.getElementById('vote-deadline-banner-hotel'), lockBannerInfo(currentDestKey));
  currentDestLocked = isDestLocked(currentDestKey);
  ['Premium', 'Standard', 'Economy'].forEach(t => {
    document.getElementById(`tab-${t}`).textContent = T.tierTabs[t];
  });

  const colomboNoteEl = document.getElementById('modal-colombo-note-hotel');
  const isColombo = currentDestKey === 'colombo_arrival' || currentDestKey === 'colombo_departure';
  colomboNoteEl.classList.toggle('hidden', !isColombo);
  colomboNoteEl.textContent = isColombo ? T.colomboOccupancyNote(occ) : '';

  document.getElementById('how-to-toggle-label').textContent = T.howToTitle;
  const howToItems = [T.priceDisclaimer(occ), ...T.howToBullets];
  document.getElementById('how-to-list').innerHTML = howToItems.map(b => `<li>${escapeHtml(b)}</li>`).join('');
  document.getElementById('how-to-content').classList.add('hidden');
  document.getElementById('how-to-chevron').classList.remove('rotate-180');

  currentUserVotes = {};
  // Modal always opens fresh at the top of the hotel list, not wherever a
  // previous session's scroll happened to leave off.
  resetHotelListScroll();
  refreshMyVotes().then(() => switchHotelTier('Premium'));
}

// Day-card entry point: resolves the day to its destination and defers to
// openHotelCandidateList. Kept separate since day cards only know dayNum,
// not destKey directly.
function openHotelVoting(dayNum) {
  openHotelCandidateList(dayToDest[dayNum]);
}

// The hotel list itself is the scrollable element inside the modal (it's
// the only flex-1 overflow-y-auto child; the header/how-to/tabs above it
// are fixed) -- resetting the modal wrapper's scroll would be a no-op.
function resetHotelListScroll() {
  const list = document.getElementById('hotel-list-container');
  if (list) list.scrollTop = 0;
}

// Fetches this user's votes for the currently open destination ONCE (not a
// live listener -- see currentUserVotes comment above).
function refreshMyVotes() {
  if (!currentVoter || !db || !currentDestKey) {
    currentUserVotes = {};
    return Promise.resolve();
  }
  return db.ref(`${votesRootPath()}/${currentDestKey}/${currentVoter}`).once('value')
    .then(snapshot => { currentUserVotes = snapshot.val() || {}; })
    .catch(() => { currentUserVotes = {}; });
}

function toggleHowTo() {
  const content = document.getElementById('how-to-content');
  const chevron = document.getElementById('how-to-chevron');
  const nowHidden = content.classList.toggle('hidden');
  chevron.classList.toggle('rotate-180', !nowHidden);
}

function switchHotelTier(tier) {
  currentTier = tier;
  ['Premium', 'Standard', 'Economy'].forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    if(t === tier) {
      btn.classList.add('border-emerald-500', 'text-emerald-600');
      btn.classList.remove('border-transparent', 'text-slate-500');
    } else {
      btn.classList.remove('border-emerald-500', 'text-emerald-600');
      btn.classList.add('border-transparent', 'text-slate-500');
    }
  });
  renderHotelList();
  resetHotelListScroll();
}

// Thumbnail block shared by hotelCardHTML and the Hotels hub cards: a real
// photo if we have one, else a clean destination-colored placeholder (never
// a broken <img> icon). Local photos live at resources/hotels/<slug>.jpg and
// are dropped in incrementally -- existence is checked via the <img> onerror
// handler (swap to the placeholder sibling) rather than a fetch, since a
// fetch would mean a network round-trip per card just to check existence.
function hotelThumbHTML(h, destKey, primaryName) {
  const imgs = h.images || {};
  const placeholderInner = `
        <span class="text-3xl leading-none" aria-hidden="true">🏨</span>
        <span class="text-[11px] font-bold text-center leading-tight line-clamp-2">${escapeHtml(primaryName)}</span>`;
  const photoSrc = imgs.exterior_image || (h.slug ? `resources/hotels/${h.slug}.jpg` : '');
  return photoSrc ? `
      <div class="h-32 bg-slate-100 overflow-hidden">
        <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(primaryName)}" loading="lazy" class="w-full h-32 object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div style="display:none" class="h-32 bg-gradient-to-br ${destPlaceholderGradient[destKey] || DEFAULT_PLACEHOLDER_GRADIENT} flex-col items-center justify-center gap-1 px-3 text-white">${placeholderInner}
        </div>
      </div>` : `
      <div class="h-32 bg-gradient-to-br ${destPlaceholderGradient[destKey] || DEFAULT_PLACEHOLDER_GRADIENT} flex flex-col items-center justify-center gap-1 px-3 text-white">${placeholderInner}
      </div>`;
}

// Compact card + hidden expandable detail section for one hotel. `locked`
// suppresses the vote row (booked destination or past VOTE_DEADLINE).
// `opts.hideDeadlineChip` additionally suppresses the per-hotel "decide
// before vote close" chip -- used only by the single-hotel trip-mode detail
// view (openBookedHotelDetail), where the hotel is already booked and that
// chip's call-to-action is stale/nonsensical.
function hotelCardHTML(h, lang, T, destKey, locked, opts) {
  opts = opts || {};
  const jaName = h.japanese_name || '';
  const enName = h.name || '';
  const primaryName = lang === 'ja' ? (jaName || enName) : (enName || jaName);
  const secondaryName = lang === 'ja' ? enName : jaName;
  const stars = Number(h.star_rating) > 0 ? '★'.repeat(Number(h.star_rating)) : '';
  const tierLabel = (T.tierTabs && T.tierTabs[h.tier]) || h.tier || '';
  // price_total (curated hotels, tax-inclusive) takes priority over the
  // older group_total_price (fabricated-data hotels, no tax breakdown).
  const hasCuratedPrice = h.price_total != null;
  const displayTotal = hasCuratedPrice ? h.price_total : h.group_total_price;
  const totalLabel = hasCuratedPrice ? T.totalInclTax : T.groupTotal;
  const groupPrice = formatPrice(displayTotal, h.currency);
  const basePrice = formatPrice(h.price_base, h.currency);
  const taxesPrice = formatPrice(h.price_taxes, h.currency);
  const twinPrice = formatPrice(h.twin_room_price, h.currency);
  const singlePrice = formatPrice(h.single_room_price, h.currency);
  const desc = lang === 'ja' ? (h.short_description_ja || '') : (h.short_description_en || '');

  const thumb = hotelThumbHTML(h, destKey, primaryName);

  const verifiedBadge = h.verified === true && h.availability_checked
    ? `<span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5 text-[10px] font-bold">${T.verifiedBadge(formatMonthDay(h.availability_checked))}</span>`
    : '';
  // Deadline-aware cancellation chip (curated hotels). Green + deadline
  // when free, red/non-refundable otherwise -- never silently omitted,
  // since "can I get my money back" is exactly what this chip is for.
  let cancelChip = '';
  if (h.cancellation) {
    if (h.cancellation.free) {
      const label = h.cancellation.deadline
        ? T.freeCancelUntil(formatDeadline(h.cancellation.deadline, lang))
        : T.freeCancellation;
      cancelChip = `<span class="inline-flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full px-2 py-0.5 text-[10px] font-bold">${label}</span>`;
    } else {
      cancelChip = `<span class="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 rounded-full px-2 py-0.5 text-[10px] font-bold">${T.nonRefundable}</span>`;
    }
  }
  // Free-cancellation deadline lands on or before the group's vote-close
  // date -- the hotel needs a decision before the vote itself closes, or
  // its refund window will already be gone.
  const deadlineWarningChip = (!opts.hideDeadlineChip && h.cancellation && h.cancellation.free && h.cancellation.deadline && h.cancellation.deadline <= VOTE_DEADLINE)
    ? `<span class="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 text-[10px] font-bold">${T.deadlineWarningChip}</span>`
    : '';
  const badgeChips = [verifiedBadge, cancelChip, deadlineWarningChip].filter(Boolean).join('');

  // New-listing hotels (Booking.com "new" star rating) get a badge in
  // place of stars, since there is no star rating to show.
  const newBadge = h.is_new === true
    ? `<span class="bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">${T.newProperty}</span>`
    : '';

  const ratings = [];
  // review_score (curated hotels) takes priority over the older booking_rating.
  const reviewScoreValue = (h.review_score != null && h.review_score !== '') ? h.review_score : h.booking_rating;
  if (isFinite(Number(reviewScoreValue)) && reviewScoreValue != null && reviewScoreValue !== '') {
    const fewReviewsSup = h.is_new === true ? `<sup class="text-amber-600">${T.fewReviewsNote}</sup>` : '';
    ratings.push(`<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600"><span class="bg-blue-600 text-white rounded px-1 py-0.5 text-[10px] font-bold">B</span>Booking.com ${Number(reviewScoreValue)}${fewReviewsSup}</span>`);
  }
  if (isFinite(Number(h.google_rating)) && h.google_rating != null && h.google_rating !== '') {
    ratings.push(`<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600"><span class="bg-slate-200 text-slate-700 rounded px-1 py-0.5 text-[10px] font-bold">G</span>Google ${Number(h.google_rating)}</span>`);
  }

  // --- detail section ---
  const priceRows = hasCuratedPrice ? [
    basePrice ? `<div class="flex justify-between"><span class="text-slate-500">${T.roomRate}</span><span class="font-bold text-slate-800">${basePrice}</span></div>` : '',
    taxesPrice ? `<div class="flex justify-between"><span class="text-slate-500">${T.taxesFees}</span><span class="font-bold text-slate-800">${taxesPrice}</span></div>` : ''
  ].join('') : [
    twinPrice ? `<div class="flex justify-between"><span class="text-slate-500">${T.twinRoom}</span><span class="font-bold text-slate-800">${twinPrice}</span></div>` : '',
    singlePrice ? `<div class="flex justify-between"><span class="text-slate-500">${T.singleRoom}</span><span class="font-bold text-slate-800">${singlePrice}</span></div>` : ''
  ].join('');

  const roomConfigHTML = typeof h.room_config === 'string' && h.room_config.trim() !== ''
    ? `<div><p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">${T.roomSetup}</p><p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(h.room_config)}</p></div>`
    : '';

  // "予約した部屋" / "Your rooms" -- the actual booked room summary (curated by
  // hand, includes the derived room count), present only on the 6 booked
  // hotels. Shown above roomConfigHTML (the raw Booking.com room string) so
  // the polished, trip-relevant text takes visual priority. The room photo
  // (resources/hotels/<slug>-room.jpg, same convention as the main exterior
  // thumbnail) sits directly under it when the file exists -- existence is
  // checked the same way as every other hotel photo in this codebase: try
  // loading it, onerror removes the <img> rather than showing a broken icon
  // or a placeholder (there's nothing sensible to placeholder a room with).
  const bookedRoomText = h.booked_room && (h.booked_room[lang] || h.booked_room.en);
  const roomPhotoHTML = (bookedRoomText && h.slug)
    ? `<img src="resources/hotels/${escapeHtml(h.slug)}-room.jpg?${ROOM_PHOTO_CACHE_BUST}" alt="${escapeHtml(bookedRoomText)}" loading="lazy" class="w-full h-40 object-cover rounded-lg border border-slate-100 mt-2" onerror="this.remove()">`
    : '';
  const bookedRoomHTML = bookedRoomText
    ? `<div><p class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">${T.bookedRoomTitle}</p><p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(bookedRoomText)}</p>${roomPhotoHTML}</div>`
    : '';

  const timeRows = [
    h.check_in_time ? `<div class="flex justify-between"><span class="text-slate-500">${T.checkIn}</span><span class="font-semibold text-slate-800">${escapeHtml(h.check_in_time)}</span></div>` : '',
    h.check_out_time ? `<div class="flex justify-between"><span class="text-slate-500">${T.checkOut}</span><span class="font-semibold text-slate-800">${escapeHtml(h.check_out_time)}</span></div>` : ''
  ].join('');

  // Address + tap-to-call phone, when the hotel record has them (currently
  // absent from every curated hotel -- see hotelContactLinesHTML). Rendered
  // as its own small block above the facility chips rather than folded into
  // timeRows, since these are contact info, not stay logistics.
  const { addressLine, phoneLine } = hotelContactLinesHTML(h, T);
  const contactHTML = (addressLine || phoneLine)
    ? `<div class="space-y-0.5">${addressLine}${phoneLine}</div>` : '';

  const facChips = Object.entries(h.facilities || {})
    .filter(([key, on]) => on && T.facilities[key])
    .map(([key]) => `<span class="inline-block bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 text-[10px] font-semibold">${T.facilities[key]}</span>`)
    .join('');

  const highlights = (lang === 'ja' ? h.highlights_ja : h.highlights_en) || [];
  const disadvantages = (lang === 'ja' ? h.disadvantages_ja : h.disadvantages_en) || [];
  const highlightsHTML = Array.isArray(highlights) && highlights.length ? `
      <div>
        <p class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">${T.highlightsTitle}</p>
        <ul class="space-y-0.5">${highlights.map(x => `<li class="text-xs text-slate-600"><span class="text-emerald-500 font-bold">✓</span> ${escapeHtml(x)}</li>`).join('')}</ul>
      </div>` : '';
  const disadvantagesHTML = Array.isArray(disadvantages) && disadvantages.length ? `
      <div>
        <p class="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">${T.disadvantagesTitle}</p>
        <ul class="space-y-0.5">${disadvantages.map(x => `<li class="text-xs text-slate-600"><span class="text-amber-500 font-bold">⚠</span> ${escapeHtml(x)}</li>`).join('')}</ul>
      </div>` : '';

  // Booking.com deep-links get the trip's check-in/out dates and group size
  // baked in, but only for verified (curated) hotels -- old, unverified
  // booking_urls are known WAF-blocked regardless (see url_audit_report.json).
  const bookingHref = h.verified === true ? withBookingDates(h.booking_url, destKey) : h.booking_url;

  // Maps always falls back to a name-based search (bookedGoogleMapsUrl) when
  // there's no explicit google_maps_url, so the link is never silently
  // missing just because hotelData.js hasn't grown that field yet.
  const links = [
    [h.official_website, T.officialSite],
    [bookingHref, 'Booking.com'],
    [h.agoda_url, 'Agoda'],
    [bookedGoogleMapsUrl(h), 'Google Maps']
  ].filter(([url]) => typeof url === 'string' && url.trim() !== '')
   .map(([url, label]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="flex-1 min-w-[45%] text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors">${label}</a>`)
   .join('');

  // Highlight whichever of this user's 3 slots (if any) this hotel currently
  // occupies -- a hotel can hold at most one slot at a time (see voteHotel's
  // move logic), so at most one of these three is ever true.
  const myChoiceLevel = [1, 2, 3].find(n => currentUserVotes[`choice${n}`] === h.name) || null;
  const CHOICE_STYLES = [
    { base: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border-emerald-100', selected: 'bg-emerald-500 text-white border-emerald-500' },
    { base: 'bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white border-sky-100', selected: 'bg-sky-500 text-white border-sky-500' },
    { base: 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white border-amber-100', selected: 'bg-amber-500 text-white border-amber-500' }
  ];
  const choiceButtons = [1, 2, 3].map(n => {
    const isSelected = myChoiceLevel === n;
    const style = isSelected ? CHOICE_STYLES[n - 1].selected : CHOICE_STYLES[n - 1].base;
    const label = isSelected ? `✓ ${T.choices[n - 1]}` : T.choices[n - 1];
    return `<button data-hotel="${escapeHtml(h.name)}" data-choice="${n}" class="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${style}">${label}</button>`;
  }).join('');
  const selectedCardClass = myChoiceLevel ? 'border-2 border-emerald-300' : 'border border-slate-100';
  // Locked (booked destination, or past VOTE_DEADLINE): no vote buttons at
  // all -- the modal-level banner (see lockBannerInfo) already explains why.
  const voteRowHTML = locked ? '' : `
        <div class="pt-2 border-t border-slate-100 flex gap-2">
          ${choiceButtons}
        </div>`;

  const morePhotosHTML = typeof h.booking_url === 'string' && h.booking_url.trim() !== ''
    ? `<a href="${escapeHtml(bookingHref)}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1">${T.morePhotos} <span aria-hidden="true">→</span> Booking.com</a>`
    : '';

  const detailSections = [
    (priceRows || timeRows) ? `<div class="space-y-1.5 text-xs">${priceRows}${timeRows}</div>` : '',
    contactHTML,
    bookedRoomHTML,
    roomConfigHTML,
    facChips ? `<div class="flex flex-wrap gap-1.5">${facChips}</div>` : '',
    highlightsHTML,
    disadvantagesHTML,
    desc ? `<p class="text-xs text-slate-500 leading-relaxed">${escapeHtml(desc)}</p>` : '',
    links ? `<div class="flex flex-wrap gap-2">${links}</div>` : '',
    morePhotosHTML
  ].filter(Boolean).join('');

  return `
    <div data-hotel-card data-hotel-name="${escapeHtml(h.name)}" class="bg-white rounded-[16px] mb-4 shadow-sm ${selectedCardClass} overflow-hidden">
      ${thumb}
      <div class="p-4 flex flex-col gap-2">
        <div class="flex justify-between items-start gap-2">
          <div class="min-w-0">
            <h4 class="font-bold text-slate-800 text-[15px] leading-tight">${escapeHtml(primaryName)}</h4>
            ${secondaryName && secondaryName !== primaryName ? `<p class="text-[11px] text-slate-400 mt-0.5">${escapeHtml(secondaryName)}</p>` : ''}
          </div>
          <div class="flex flex-col items-end gap-1 shrink-0">
            ${newBadge || (stars ? `<div class="text-amber-400 text-xs leading-none">${stars}</div>` : '')}
            ${tierLabel ? `<span class="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">${escapeHtml(tierLabel)}</span>` : ''}
          </div>
        </div>

        ${badgeChips ? `<div class="flex flex-wrap gap-1.5">${badgeChips}</div>` : ''}

        ${groupPrice ? `
        <div class="flex justify-between items-center bg-orange-50/60 border border-orange-100 rounded-lg px-3 py-2">
          <span class="text-[10px] font-bold text-orange-700 uppercase tracking-wider">${totalLabel}</span>
          <span class="text-[15px] font-bold text-slate-800">${groupPrice}</span>
        </div>` : ''}

        ${ratings.length ? `<div class="flex gap-3">${ratings.join('')}</div>` : ''}
        ${voteRowHTML}

        <button data-toggle-details class="w-full py-1.5 text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-colors">${T.showDetails}</button>
        <div data-details class="hidden space-y-3 pt-2 border-t border-slate-100">${detailSections}</div>
      </div>
    </div>`;
}

function renderHotelList() {
  const container = document.getElementById('hotel-list-container');
  const lang = votingLang();
  const T = votingT();

  if (!currentDestKey || !Array.isArray(hotelData[currentDestKey])) {
    container.innerHTML = `<p class="text-center text-slate-500 py-10">${T.unknownDest}</p>`;
    return;
  }

  const hotels = hotelData[currentDestKey].filter(h => h.tier === currentTier);

  if (hotels.length === 0) {
    container.innerHTML = `<p class="text-center text-slate-500 py-10">${T.emptyTier}</p>`;
    return;
  }

  container.innerHTML = hotels.map(h => hotelCardHTML(h, lang, T, currentDestKey, currentDestLocked)).join('');
}

// One card in the Hotels hub: photo, bilingual name, stay dates with day
// numbers, check-in/out times, address + Maps link, tap-to-call phone,
// Booking link. Tapping anywhere on the card opens the same single-hotel
// detail view as a day card's booked banner.
function hotelHubCardHTML(destKey, h, tonight, lang, T) {
  const { primary, secondary } = resolveHotelNames(destKey, h.name);
  const thumb = hotelThumbHTML(h, destKey, primary);
  const staySpan = formatStaySpanCaption(destKey, lang);
  const { addressLine, phoneLine, mapsLine } = hotelContactLinesHTML(h, T);

  const timeParts = [];
  if (h.check_in_time) timeParts.push(`${T.checkIn} ${escapeHtml(h.check_in_time)}`);
  if (h.check_out_time) timeParts.push(`${T.checkOut} ${escapeHtml(h.check_out_time)}`);
  const timesLine = timeParts.length ? `<p class="text-[11px] text-slate-600">${timeParts.join(' · ')}</p>` : '';

  // One-line room summary (the full, titled version with its photo lives in
  // the single-hotel detail view -- see hotelCardHTML's bookedRoomHTML).
  const bookedRoomText = h.booked_room && (h.booked_room[lang] || h.booked_room.en);
  const roomLine = bookedRoomText
    ? `<p class="text-[11px] text-slate-500 truncate">${escapeHtml(bookedRoomText)}</p>` : '';

  const bookingHref = h.verified === true ? withBookingDates(h.booking_url, destKey) : h.booking_url;
  // Same flex/min-h-[44px] touch-target treatment as phoneLine/mapsLine
  // (hotelContactLinesHTML) so all three chips in this row are consistently
  // tappable, not just the two that had the reported flush-spacing bug.
  const bookingLine = typeof bookingHref === 'string' && bookingHref.trim() !== ''
    ? `<a href="${escapeHtml(bookingHref)}" target="_blank" rel="noopener noreferrer" class="flex items-center min-h-[44px] text-[12px] font-bold text-sky-600 hover:text-sky-700" onclick="event.stopPropagation()">Booking.com</a>` : '';

  const tonightBadgeHTML = tonight
    ? `<span class="absolute top-2 left-2 z-10 inline-flex items-center gap-1 bg-amber-500 text-white rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm">✦ ${escapeHtml(T.tonightBadge)}</span>` : '';

  // A <div> wrapper, not a <button> -- the card also contains real <a> tap
  // targets (phone/maps/booking), and nesting interactive elements inside a
  // <button> is invalid HTML and unreliable on mobile (the outer button can
  // swallow taps meant for the inner links). Those links stop propagation so
  // tapping them doesn't also trigger the card's own onclick.
  return `
    <div role="button" tabindex="0" onclick="openBookedHotelDetailFromHub('${destKey}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openBookedHotelDetailFromHub('${destKey}');}" data-hub-card data-dest-key="${destKey}" class="relative w-full text-left bg-white rounded-[16px] mb-4 shadow-sm border ${tonight ? 'border-2 border-amber-400 ring-2 ring-amber-100' : 'border-slate-100'} overflow-hidden cursor-pointer">
      ${tonightBadgeHTML}
      ${thumb}
      <div class="p-4 flex flex-col gap-1">
        <div>
          <h4 class="font-bold text-slate-800 text-[15px] leading-tight">${escapeHtml(primary)}</h4>
          ${secondary ? `<p class="text-[11px] text-slate-400 mt-0.5">${escapeHtml(secondary)}</p>` : ''}
        </div>
        ${staySpan ? `<p class="text-xs font-bold text-emerald-700 mt-1">${escapeHtml(staySpan)}</p>` : ''}
        ${roomLine}
        ${timesLine}
        ${addressLine}
        <div class="flex flex-wrap gap-3 mt-1.5 items-center" onclick="event.stopPropagation()">
          ${phoneLine}
          ${mapsLine}
          ${bookingLine}
        </div>
      </div>
    </div>`;
}

// Renders the Hotels hub: the 6 booked hotels in trip order, with whichever
// one is being slept in tonight (device local date) pinned to the top and
// visually badged. Array.prototype.sort has been stable (insertion order
// preserved among equal keys) since ES2019 in every browser this app targets,
// so the non-tonight cards simply keep their original trip order.
function renderHotelsHub() {
  const container = document.getElementById('hotels-hub-container');
  const lang = votingLang();
  const T = votingT();

  const cards = orderedBookedDestKeys().map(destKey => {
    const bookedInfo = bookedByDest[destKey];
    const hotel = hotelData[destKey].find(h => h.name === bookedInfo.hotel);
    return hotel ? { destKey, hotel, tonight: isTonightAt(destKey) } : null;
  }).filter(Boolean);

  cards.sort((a, b) => (b.tonight === a.tonight ? 0 : (b.tonight ? 1 : -1)));

  container.innerHTML = cards.length
    ? cards.map(c => hotelHubCardHTML(c.destKey, c.hotel, c.tonight, lang, T)).join('')
    : `<p class="text-center text-slate-500 py-10">${T.unknownDest}</p>`;
}

// Opens the Hotels hub modal (the bottom-nav "ホテル"/"Hotels" button).
function openHotelsHub() {
  openModal('modal-hotels-hub');
  const T = votingT();
  document.getElementById('modal-title-hotels-hub').textContent = T.hotelsHubTitle;
  const archiveLink = document.getElementById('btn-hotels-archive-link');
  if (archiveLink) archiveLink.textContent = T.archiveLinkLabel;
  renderHotelsHub();
}

// Entry point for a Hotels hub card: closes the hub first, same stacking
// reason as openArchiveFromHub -- modal-hotels-hub and modal-hotel-selection
// are both bottom sheets in the same slot.
function openBookedHotelDetailFromHub(destKey) {
  closeAllModals();
  setTimeout(() => openBookedHotelDetail(destKey), 300);
}

// Quiet link at the bottom of the Hotels hub into the (unchanged) group-votes
// dashboard. Closes the hub first since both modals occupy the same bottom-
// sheet slot -- opening one on top of the other would visually stack them.
function openArchiveFromHub() {
  closeAllModals();
  setTimeout(() => openGroupVotes(), 300);
}

// Entry point for the group-votes dashboard's per-destination header (see
// renderGroupVotes): closes the dashboard first, same stacking reason as
// openArchiveFromHub above -- modal-hotel-selection and modal-group-votes
// are both bottom sheets in the same slot, so opening one while the other is
// still up would leave the dashboard painted on top.
function openHotelCandidateListFromDashboard(destKey) {
  closeAllModals();
  setTimeout(() => openHotelCandidateList(destKey), 300);
}

function voteHotel(hotelName, choiceLevel) {
  if (!currentVoter) {
    checkIdentity();
    return;
  }
  const T = votingT();
  if (!db) {
    alert(T.dbConnectError);
    return;
  }
  // Defensive: the vote buttons are never rendered when locked (see
  // hotelCardHTML), so this only guards against a stray/stale call.
  if (isDestLocked(currentDestKey)) return;

  const key = `choice${choiceLevel}`;
  // Tapping the already-✓-highlighted button for this hotel/slot means
  // "unvote" -- clear it rather than re-saving the same value.
  const isUnvote = currentUserVotes[key] === hotelName;
  // A hotel can only occupy one of the user's three slots at a time: if
  // it's currently sitting in a different slot, moving it here must clear
  // that other slot in the same multi-path update (not two separate writes,
  // so there's no window where the hotel briefly occupies both).
  const vacatedLevel = !isUnvote
    ? [1, 2, 3].find(n => n !== choiceLevel && currentUserVotes[`choice${n}`] === hotelName)
    : null;

  const voteRef = db.ref(`${votesRootPath()}/${currentDestKey}/${currentVoter}`);
  const updates = {};
  if (isUnvote) {
    updates[key] = null;
  } else {
    if (vacatedLevel) updates[`choice${vacatedLevel}`] = null;
    updates[key] = hotelName;
  }

  voteRef.update(updates)
    .then(() => {
      // Optimistic local update: reflect the write immediately in the
      // highlight/border without waiting on a fresh fetch from Firebase.
      Object.assign(currentUserVotes, updates);
      myVotesByDest[currentDestKey] = Object.assign({}, myVotesByDest[currentDestKey], updates);
      renderHotelList();
      refreshHotelButtonsIfReady();
      if (isUnvote) {
        alert(T.unvoteSuccess(hotelName, choiceLevel));
      } else if (vacatedLevel) {
        alert(T.moveSuccess(hotelName, choiceLevel));
      } else {
        alert(T.saveSuccess(hotelName, choiceLevel));
      }
    })
    .catch(e => alert(T.saveErrorPrefix + e.message));
}

function openGroupVotes() {
  openModal('modal-group-votes');
  const T = votingT();
  document.getElementById('modal-title-group-votes').textContent = T.groupVotesTitle;
  // Only the global deadline (not individual bookings) changes this banner --
  // per-destination booked status is shown inline via the ✓ marker instead.
  applyLockBannerStyle(
    document.getElementById('vote-deadline-banner-group'),
    isPastDeadline() ? { text: T.votingClosedBanner, locked: true } : { text: T.voteDeadlineBanner, locked: false }
  );
  const switchUserBtn = document.getElementById('btn-switch-user');
  if (switchUserBtn) switchUserBtn.textContent = T.switchUser;
  renderGroupVotes();
}

// Add event listener to open Group Votes
document.addEventListener('DOMContentLoaded', () => {
  // Reveal the red TEST MODE ribbon whenever TEST_MODE is active. Left
  // hidden (index.html default) for every normal load.
  if (TEST_MODE) {
    const ribbon = document.getElementById('test-mode-ribbon');
    if (ribbon) ribbon.classList.remove('hidden');
  }

  // We need to wait for DOM to be fully loaded. The bottom-nav button
  // (id kept as btn-group-votes for historical reasons, label now "ホテル"/
  // "Hotels") now opens the Hotels hub instead of the dashboard directly --
  // the dashboard is reachable from the hub's archive link.
  const btnGroupVotes = document.getElementById('btn-group-votes');
  if (btnGroupVotes) {
    btnGroupVotes.parentElement.onclick = openHotelsHub;
  }

  // Delegated listener for vote buttons and detail toggles rendered by renderHotelList
  const hotelListContainer = document.getElementById('hotel-list-container');
  if (hotelListContainer) {
    hotelListContainer.addEventListener('click', (e) => {
      const voteBtn = e.target.closest('button[data-hotel]');
      if (voteBtn) {
        voteHotel(voteBtn.dataset.hotel, Number(voteBtn.dataset.choice));
        return;
      }
      const toggleBtn = e.target.closest('button[data-toggle-details]');
      if (toggleBtn) {
        const card = toggleBtn.closest('[data-hotel-card]');
        const details = card && card.querySelector('[data-details]');
        if (details) {
          const nowHidden = details.classList.toggle('hidden');
          const T = votingT();
          toggleBtn.textContent = nowHidden ? T.showDetails : T.hideDetails;
        }
      }
    });
  }

  // Delegated listener for the per-destination "see everyone's votes" toggles
  // rendered by renderGroupVotes
  const groupVotesContainer = document.getElementById('group-votes-container');
  if (groupVotesContainer) {
    groupVotesContainer.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-toggle-group-detail]');
      if (toggleBtn) {
        const target = document.getElementById(toggleBtn.dataset.target);
        if (target) {
          const nowHidden = target.classList.toggle('hidden');
          const T = votingT();
          toggleBtn.textContent = nowHidden ? T.seeAllVotes : T.hideDetails;
        }
      }
    });
  }

  // Check identity slightly after load -- but only if there's still a
  // destination left to vote on. Once every destination is booked, asking
  // "who is voting" is a leftover decision-phase prompt with nothing behind
  // it (see allKnownDestinationsBooked), so it's skipped entirely.
  setTimeout(() => {
    bookedStateReady.then(() => {
      if (!allKnownDestinationsBooked()) checkIdentity();
    });
  }, 500);
});

// Resolve a stored vote (English hotel name) to a display name for the current language.
// Falls back to the stored string itself for renamed/missing hotels.
function displayVoteName(dest, storedName) {
  if (!storedName) return '...';
  const hotels = hotelData[dest];
  if (Array.isArray(hotels) && votingLang() === 'ja') {
    const hotel = hotels.find(h => h.name === storedName);
    if (hotel && hotel.japanese_name) return hotel.japanese_name;
  }
  return storedName;
}

// Points-based ranking: 1st choice = 3, 2nd = 2, 3rd = 1. Returns
// { hotelName: { points, voters: [{ name, rank }] } } for one destination's
// voters object (as stored at votes/{dest}).
const CHOICE_POINTS = { 1: 3, 2: 2, 3: 1 };
function aggregateDestVotes(voters) {
  const byHotel = {};
  Object.entries(voters || {}).forEach(([voter, choices]) => {
    [1, 2, 3].forEach(n => {
      const hotelName = choices && choices[`choice${n}`];
      if (!hotelName) return;
      if (!byHotel[hotelName]) byHotel[hotelName] = { points: 0, voters: [] };
      byHotel[hotelName].points += CHOICE_POINTS[n];
      byHotel[hotelName].voters.push({ name: voter, rank: n });
    });
  });
  return byHotel;
}

// Bilingual hotel name resolution matching hotelCardHTML's primary/secondary
// rule, but keyed off a vote's stored (always-English) hotel name.
function resolveHotelNames(dest, storedName) {
  const hotels = hotelData[dest];
  const hotel = Array.isArray(hotels) ? hotels.find(h => h.name === storedName) : null;
  const jaName = (hotel && hotel.japanese_name) || '';
  const enName = (hotel && hotel.name) || storedName;
  const lang = votingLang();
  const primary = lang === 'ja' ? (jaName || enName) : (enName || jaName);
  const secondary = lang === 'ja' ? enName : jaName;
  return { primary, secondary: (secondary && secondary !== primary) ? secondary : '' };
}

// Small rank-colored avatar chips, one per voter who ranked this hotel,
// matching the emerald/sky/amber 1st/2nd/3rd-choice colors used elsewhere.
const RANK_AVATAR_STYLES = [
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-sky-100 text-sky-700 border-sky-200',
  'bg-amber-100 text-amber-700 border-amber-200'
];

function renderGroupVotes() {
  const container = document.getElementById('group-votes-container');
  const T = votingT();
  if (!db) {
    container.innerHTML = `<p class="text-red-500 text-center py-10">${T.dbNotInit}</p>`;
    return;
  }

  container.innerHTML = `<p class="text-center text-slate-500 py-10">${T.loadingVotes}</p>`;

  // Chronological destination order (each destKey's first appearance in
  // dayToDest), so the dashboard reads in itinerary order rather than
  // hotelData.js's file order.
  const orderedDestKeys = [...new Set(Object.keys(dayToDest).map(d => dayToDest[d]))]
    .filter(dest => Array.isArray(hotelData[dest]));

  db.ref(votesRootPath()).once('value').then(snapshot => {
    const data = snapshot.val() || {};
    const totalVoters = VOTER_NAMES.length;

    const html = orderedDestKeys.map(dest => {
      const voters = data[dest] || {};
      const destName = getDestName(dest);
      const participantEntries = Object.entries(voters).filter(([, choices]) =>
        choices && (choices.choice1 || choices.choice2 || choices.choice3));
      const participationCount = participantEntries.length;

      // The destination name itself opens the full, tier-tabbed candidate
      // list for this destination (openHotelCandidateList) -- the only
      // remaining path to it now that day cards show the single-hotel view
      // instead (see openBookedHotelDetail). Everything else about this
      // dashboard (ranking, chips, seeAllVotes toggle) is unchanged.
      const header = `
        <div class="flex items-center justify-between mb-2">
          <h4 onclick="openHotelCandidateListFromDashboard('${dest}')" class="font-bold text-slate-800 text-[15px] cursor-pointer hover:text-emerald-600 transition-colors">${escapeHtml(destName)}</h4>
          <span class="text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 shrink-0">${T.votesCount(participationCount, totalVoters)}</span>
        </div>`;

      // The booked hotel may not be rank 1 (or may have zero votes at all) --
      // chosen can differ from what the group voted for, so this marks
      // whatever booked/{dest} actually says, never assumes rank 1.
      const bookedInfo = bookedByDest[dest];
      const bookedHotelName = bookedInfo && bookedInfo.hotel;

      if (participationCount === 0) {
        const standaloneBookedHTML = bookedHotelName ? (() => {
          const { primary, secondary } = resolveHotelNames(dest, bookedHotelName);
          return `
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-2 flex items-center gap-2">
            <span class="inline-flex items-center gap-1 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0">${T.bookedMarkerChip}</span>
            <div class="min-w-0">
              <p class="font-bold text-slate-800 text-sm truncate">${escapeHtml(primary)}</p>
              ${secondary ? `<p class="text-[10px] text-slate-400 truncate">${escapeHtml(secondary)}</p>` : ''}
            </div>
          </div>`;
        })() : '';
        return `
        <div class="mb-6">
          ${header}
          ${standaloneBookedHTML}
          <p class="text-center text-slate-400 text-xs py-6 bg-white rounded-xl border border-dashed border-slate-200">${T.noVotes}</p>
        </div>`;
      }

      const byHotel = aggregateDestVotes(voters);
      const ranked = Object.entries(byHotel)
        .map(([hotelName, info]) => ({ hotelName, ...info }))
        .sort((a, b) => b.points - a.points);

      const closeRace = ranked.length >= 2 && (ranked[0].points - ranked[1].points) <= 1;
      // If the booked hotel got zero votes, it won't appear in `ranked` at
      // all -- surface it separately above the ranked list rather than
      // silently dropping the booking from the dashboard.
      const bookedOutsideRanked = bookedHotelName && !ranked.some(r => r.hotelName === bookedHotelName);
      const standaloneBookedHTML = bookedOutsideRanked ? (() => {
        const { primary, secondary } = resolveHotelNames(dest, bookedHotelName);
        return `
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-2 flex items-center gap-2">
            <span class="inline-flex items-center gap-1 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0">${T.bookedMarkerChip}</span>
            <div class="min-w-0">
              <p class="font-bold text-slate-800 text-sm truncate">${escapeHtml(primary)}</p>
              ${secondary ? `<p class="text-[10px] text-slate-400 truncate">${escapeHtml(secondary)}</p>` : ''}
            </div>
          </div>`;
      })() : '';

      const rows = ranked.map((entry, idx) => {
        const rank = idx + 1;
        const { primary, secondary } = resolveHotelNames(dest, entry.hotelName);
        const isTop = rank === 1;
        const medal = rank === 1 ? '🏆' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
        const avatars = [...entry.voters].sort((a, b) => a.rank - b.rank).map(v => {
          const style = RANK_AVATAR_STYLES[v.rank - 1] || RANK_AVATAR_STYLES[2];
          const initial = v.name.charAt(0);
          return `<span title="${escapeHtml(v.name)} · ${escapeHtml(T.choices[v.rank - 1])}" class="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold border ${style}">${escapeHtml(initial)}</span>`;
        }).join('');

        const isBooked = bookedHotelName === entry.hotelName;

        return `
          <div class="bg-white rounded-xl p-3 shadow-sm border ${isBooked ? 'border-emerald-300 ring-1 ring-emerald-200' : (isTop ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-100')} flex items-center gap-3">
            <div class="w-7 text-center shrink-0">
              ${medal ? `<span class="text-lg leading-none">${medal}</span>` : `<span class="text-xs font-bold text-slate-400">#${rank}</span>`}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <p class="font-bold text-slate-800 text-sm truncate">${escapeHtml(primary)}</p>
                ${isBooked ? `<span class="inline-flex items-center gap-1 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0">${T.bookedMarkerChip}</span>` : ''}
              </div>
              ${secondary ? `<p class="text-[10px] text-slate-400 truncate">${escapeHtml(secondary)}</p>` : ''}
              <div class="flex flex-wrap gap-1 mt-1.5">${avatars}</div>
            </div>
            <div class="text-right shrink-0">
              <p class="font-bold text-emerald-600 text-sm">${T.pointsLabel(entry.points)}</p>
              ${rank === 1 && closeRace ? `<span class="inline-block mt-1 bg-red-50 text-red-600 border border-red-200 rounded-full px-1.5 py-0.5 text-[9px] font-bold">${T.closeRace}</span>` : ''}
            </div>
          </div>`;
      }).join('<div class="h-2"></div>');

      const detailId = `group-detail-${dest}`;
      const detailHTML = Object.entries(voters).map(([voter, choices]) => `
          <div class="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
            <p class="font-bold text-emerald-700 text-sm mb-1">${escapeHtml(voter)}</p>
            <ul class="text-xs text-slate-600 space-y-1 pl-2 border-l-2 border-emerald-100">
              <li><span class="font-semibold text-emerald-600">${T.choices[0]}:</span> ${escapeHtml(displayVoteName(dest, choices.choice1))}</li>
              <li><span class="font-semibold text-sky-600">${T.choices[1]}:</span> ${escapeHtml(displayVoteName(dest, choices.choice2))}</li>
              <li><span class="font-semibold text-amber-600">${T.choices[2]}:</span> ${escapeHtml(displayVoteName(dest, choices.choice3))}</li>
            </ul>
          </div>`).join('<div class="h-2"></div>');

      return `
        <div class="mb-6">
          ${header}
          ${standaloneBookedHTML}
          <div>${rows}</div>
          <button data-toggle-group-detail data-target="${detailId}" class="w-full mt-2 py-1.5 text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-colors">${T.seeAllVotes}</button>
          <div id="${detailId}" class="hidden space-y-2 mt-1">${detailHTML}</div>
        </div>`;
    }).join('');

    container.innerHTML = html;
  }).catch(e => {
    container.innerHTML = `<p class="text-red-500 text-center py-10">${T.loadErrorPrefix}${escapeHtml(e.message)}</p>`;
  });
}
