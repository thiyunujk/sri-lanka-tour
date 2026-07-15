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
    saveErrorPrefix: '保存エラー: ',
    dbNotInit: 'データベースが初期化されていません！',
    loadingVotes: '投票を読み込んでいます...',
    noVotes: 'まだ投票されていません。',
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
    fewReviewsNote: '※レビュー数少'
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
    saveErrorPrefix: 'Save error: ',
    dbNotInit: 'The database is not initialized!',
    loadingVotes: 'Loading votes...',
    noVotes: 'No votes have been cast yet.',
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
    fewReviewsNote: '※ few reviews'
  }
};

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

// Appends checkin/checkout/group size to a Booking.com URL for verified
// hotels only (old, unverified booking_urls are known WAF-blocked anyway
// -- see scripts/url_audit_report.json -- so there's no point dating them).
// Curated hotels from ingest_curated.py already have these baked in at
// ingest time (see canonicalize_booking_url there) -- this is a no-op for
// those, it only fills in dates for anything that isn't pre-canonicalized.
function withBookingDates(url, destKey) {
  if (!url) return url;
  if (url.includes('checkin=')) return url;
  const dates = destDates[destKey];
  if (!dates) return url;
  const params = new URLSearchParams({
    checkin: dates.checkin,
    checkout: dates.checkout,
    group_adults: '5',
    no_rooms: '3'
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
  // Small delay for UI smoothness
  setTimeout(() => {
    alert(votingT().welcome(name));
  }, 300);
}

function openHotelVoting(dayNum) {
  currentDestKey = dayToDest[dayNum];
  if (!currentDestKey || !hotelData[currentDestKey]) {
    alert(votingT().unknownDest);
    return;
  }
  const T = votingT();
  openModal('modal-hotel-selection');
  document.getElementById('modal-title-hotel-dest').innerText = getDestName(currentDestKey);
  document.getElementById('modal-subtitle-hotel').textContent = T.hotelModalSubtitle;
  ['Premium', 'Standard', 'Economy'].forEach(t => {
    document.getElementById(`tab-${t}`).textContent = T.tierTabs[t];
  });
  switchHotelTier('Premium');
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
}

// Compact card + hidden expandable detail section for one hotel
function hotelCardHTML(h, lang, T, destKey) {
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
  const imgs = h.images || {};

  // --- compact section ---
  // Every hotel gets a thumbnail block: a real photo if we have one, else a
  // clean destination-colored placeholder (never a broken <img> icon).
  const thumb = imgs.exterior_image ? `
      <div class="h-32 bg-slate-100 overflow-hidden">
        <img src="${escapeHtml(imgs.exterior_image)}" alt="${escapeHtml(primaryName)}" loading="lazy" class="w-full h-32 object-cover">
      </div>` : `
      <div class="h-32 bg-gradient-to-br ${destPlaceholderGradient[destKey] || DEFAULT_PLACEHOLDER_GRADIENT} flex flex-col items-center justify-center gap-1 px-3 text-white">
        <span class="text-3xl leading-none" aria-hidden="true">🏨</span>
        <span class="text-[11px] font-bold text-center leading-tight line-clamp-2">${escapeHtml(primaryName)}</span>
      </div>`;

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
  const badgeChips = [verifiedBadge, cancelChip].filter(Boolean).join('');

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

  const timeRows = [
    h.check_in_time ? `<div class="flex justify-between"><span class="text-slate-500">${T.checkIn}</span><span class="font-semibold text-slate-800">${escapeHtml(h.check_in_time)}</span></div>` : '',
    h.check_out_time ? `<div class="flex justify-between"><span class="text-slate-500">${T.checkOut}</span><span class="font-semibold text-slate-800">${escapeHtml(h.check_out_time)}</span></div>` : ''
  ].join('');

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

  const links = [
    [h.official_website, T.officialSite],
    [bookingHref, 'Booking.com'],
    [h.agoda_url, 'Agoda'],
    [h.google_maps_url, 'Google Maps']
  ].filter(([url]) => typeof url === 'string' && url.trim() !== '')
   .map(([url, label]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="flex-1 min-w-[45%] text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors">${label}</a>`)
   .join('');

  const morePhotosHTML = typeof h.booking_url === 'string' && h.booking_url.trim() !== ''
    ? `<a href="${escapeHtml(bookingHref)}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1">${T.morePhotos} <span aria-hidden="true">→</span> Booking.com</a>`
    : '';

  const detailSections = [
    (priceRows || timeRows) ? `<div class="space-y-1.5 text-xs">${priceRows}${timeRows}</div>` : '',
    roomConfigHTML,
    facChips ? `<div class="flex flex-wrap gap-1.5">${facChips}</div>` : '',
    highlightsHTML,
    disadvantagesHTML,
    desc ? `<p class="text-xs text-slate-500 leading-relaxed">${escapeHtml(desc)}</p>` : '',
    links ? `<div class="flex flex-wrap gap-2">${links}</div>` : '',
    morePhotosHTML
  ].filter(Boolean).join('');

  return `
    <div data-hotel-card class="bg-white rounded-[16px] mb-4 shadow-sm border border-slate-100 overflow-hidden">
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

        <div class="pt-2 border-t border-slate-100 flex gap-2">
          <button data-hotel="${escapeHtml(h.name)}" data-choice="1" class="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors border border-emerald-100">${T.choices[0]}</button>
          <button data-hotel="${escapeHtml(h.name)}" data-choice="2" class="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white transition-colors border border-sky-100">${T.choices[1]}</button>
          <button data-hotel="${escapeHtml(h.name)}" data-choice="3" class="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors border border-amber-100">${T.choices[2]}</button>
        </div>

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

  container.innerHTML = hotels.map(h => hotelCardHTML(h, lang, T, currentDestKey)).join('');
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

  const voteRef = db.ref(`votes/${currentDestKey}/${currentVoter}`);
  let updates = {};
  updates[`choice${choiceLevel}`] = hotelName;

  voteRef.update(updates)
    .then(() => alert(T.saveSuccess(hotelName, choiceLevel)))
    .catch(e => alert(T.saveErrorPrefix + e.message));
}

function openGroupVotes() {
  openModal('modal-group-votes');
  document.getElementById('modal-title-group-votes').textContent = votingT().groupVotesTitle;
  renderGroupVotes();
}

// Add event listener to open Group Votes
document.addEventListener('DOMContentLoaded', () => {
  // We need to wait for DOM to be fully loaded
  const btnGroupVotes = document.getElementById('btn-group-votes');
  if (btnGroupVotes) {
    btnGroupVotes.parentElement.onclick = openGroupVotes;
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

  // Check identity slightly after load
  setTimeout(() => {
    checkIdentity();
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

function renderGroupVotes() {
  const container = document.getElementById('group-votes-container');
  const T = votingT();
  if (!db) {
    container.innerHTML = `<p class="text-red-500 text-center py-10">${T.dbNotInit}</p>`;
    return;
  }

  container.innerHTML = `<p class="text-center text-slate-500 py-10">${T.loadingVotes}</p>`;

  db.ref('votes').once('value').then(snapshot => {
    const data = snapshot.val();
    if (!data) {
      container.innerHTML = `<p class="text-center text-slate-500 py-10">${T.noVotes}</p>`;
      return;
    }

    let html = '';
    for (const [dest, voters] of Object.entries(data)) {
      const destName = getDestName(dest);
      html += `<h4 class="font-bold text-slate-800 mt-4 mb-2 pb-1 border-b border-slate-200">${escapeHtml(destName)}</h4>`;

      for (const [voter, choices] of Object.entries(voters)) {
        html += `
          <div class="bg-white rounded-xl p-3 mb-2 shadow-sm border border-slate-100">
            <p class="font-bold text-emerald-700 text-sm mb-1">${escapeHtml(voter)}</p>
            <ul class="text-xs text-slate-600 space-y-1 pl-2 border-l-2 border-emerald-100">
              <li><span class="font-semibold text-emerald-600">${T.choices[0]}:</span> ${escapeHtml(displayVoteName(dest, choices.choice1))}</li>
              <li><span class="font-semibold text-sky-600">${T.choices[1]}:</span> ${escapeHtml(displayVoteName(dest, choices.choice2))}</li>
              <li><span class="font-semibold text-amber-600">${T.choices[2]}:</span> ${escapeHtml(displayVoteName(dest, choices.choice3))}</li>
            </ul>
          </div>
        `;
      }
    }
    container.innerHTML = html;
  }).catch(e => {
    container.innerHTML = `<p class="text-red-500 text-center py-10">${T.loadErrorPrefix}${escapeHtml(e.message)}</p>`;
  });
}
