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
    }
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
    }
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
function hotelCardHTML(h, lang, T) {
  const jaName = h.japanese_name || '';
  const enName = h.name || '';
  const primaryName = lang === 'ja' ? (jaName || enName) : (enName || jaName);
  const secondaryName = lang === 'ja' ? enName : jaName;
  const stars = Number(h.star_rating) > 0 ? '★'.repeat(Number(h.star_rating)) : '';
  const tierLabel = (T.tierTabs && T.tierTabs[h.tier]) || h.tier || '';
  const groupPrice = formatPrice(h.group_total_price, h.currency);
  const twinPrice = formatPrice(h.twin_room_price, h.currency);
  const singlePrice = formatPrice(h.single_room_price, h.currency);
  const desc = lang === 'ja' ? (h.short_description_ja || '') : (h.short_description_en || '');
  const imgs = h.images || {};

  // --- compact section ---
  const thumb = imgs.exterior_image ? `
      <div class="h-32 bg-slate-100 overflow-hidden">
        <img src="${escapeHtml(imgs.exterior_image)}" alt="${escapeHtml(primaryName)}" loading="lazy" class="w-full h-32 object-cover">
      </div>` : '';

  const ratings = [];
  if (isFinite(Number(h.booking_rating)) && h.booking_rating != null && h.booking_rating !== '') {
    ratings.push(`<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600"><span class="bg-blue-600 text-white rounded px-1 py-0.5 text-[10px] font-bold">B</span>Booking.com ${Number(h.booking_rating)}</span>`);
  }
  if (isFinite(Number(h.google_rating)) && h.google_rating != null && h.google_rating !== '') {
    ratings.push(`<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600"><span class="bg-slate-200 text-slate-700 rounded px-1 py-0.5 text-[10px] font-bold">G</span>Google ${Number(h.google_rating)}</span>`);
  }

  // --- detail section ---
  const priceRows = [
    twinPrice ? `<div class="flex justify-between"><span class="text-slate-500">${T.twinRoom}</span><span class="font-bold text-slate-800">${twinPrice}</span></div>` : '',
    singlePrice ? `<div class="flex justify-between"><span class="text-slate-500">${T.singleRoom}</span><span class="font-bold text-slate-800">${singlePrice}</span></div>` : ''
  ].join('');

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

  const links = [
    [h.official_website, T.officialSite],
    [h.booking_url, 'Booking.com'],
    [h.agoda_url, 'Agoda'],
    [h.google_maps_url, 'Google Maps']
  ].filter(([url]) => typeof url === 'string' && url.trim() !== '')
   .map(([url, label]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="flex-1 min-w-[45%] text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors">${label}</a>`)
   .join('');

  const extraImages = [imgs.room_image, imgs.bathroom_image, imgs.facility_image]
    .filter(src => typeof src === 'string' && src.trim() !== '')
    .map(src => `<img src="${escapeHtml(src)}" alt="" loading="lazy" class="h-16 w-full object-cover rounded-lg bg-slate-100">`)
    .join('');

  const detailSections = [
    (priceRows || timeRows) ? `<div class="space-y-1.5 text-xs">${priceRows}${timeRows}</div>` : '',
    facChips ? `<div class="flex flex-wrap gap-1.5">${facChips}</div>` : '',
    highlightsHTML,
    disadvantagesHTML,
    desc ? `<p class="text-xs text-slate-500 leading-relaxed">${escapeHtml(desc)}</p>` : '',
    links ? `<div class="flex flex-wrap gap-2">${links}</div>` : '',
    extraImages ? `<div class="grid grid-cols-3 gap-2">${extraImages}</div>` : ''
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
            ${stars ? `<div class="text-amber-400 text-xs leading-none">${stars}</div>` : ''}
            ${tierLabel ? `<span class="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">${escapeHtml(tierLabel)}</span>` : ''}
          </div>
        </div>

        ${groupPrice ? `
        <div class="flex justify-between items-center bg-orange-50/60 border border-orange-100 rounded-lg px-3 py-2">
          <span class="text-[10px] font-bold text-orange-700 uppercase tracking-wider">${T.groupTotal}</span>
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

  container.innerHTML = hotels.map(h => hotelCardHTML(h, lang, T)).join('');
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
