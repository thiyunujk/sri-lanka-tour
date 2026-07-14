// --- HOTEL VOTING SYSTEM ---

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
    openModal('modal-identity');
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
    alert(`ようこそ、${name}さん！ホテルの投票ができます。`);
  }, 300);
}

function openHotelVoting(dayNum) {
  currentDestKey = dayToDest[dayNum];
  if (!currentDestKey || !hotelData[currentDestKey]) {
    alert("この目的地のホテルデータはまだありません。");
    return;
  }
  openModal('modal-hotel-selection');
  document.getElementById('modal-title-hotel-dest').innerText = hotelData[currentDestKey].name;
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

function renderHotelList() {
  const container = document.getElementById('hotel-list-container');
  if (!currentDestKey) return;
  const hotels = hotelData[currentDestKey].tiers[currentTier];
  
  if (!hotels || hotels.length === 0) {
    container.innerHTML = `<p class="text-center text-slate-500 py-10">このクラスのホテルは見つかりませんでした。</p>`;
    return;
  }

  container.innerHTML = hotels.map((h, index) => `
    <div class="bg-white rounded-[16px] p-4 mb-4 shadow-sm border border-slate-100 flex flex-col gap-2">
      <div class="flex justify-between items-start">
        <h4 class="font-bold text-slate-800 text-[15px] leading-tight pr-2">${h.name}</h4>
        <div class="flex text-amber-400 shrink-0 text-xs">${'★'.repeat(h.stars || 4)}</div>
      </div>
      <p class="text-xs text-slate-500 line-clamp-2">${h.description || hotelData[currentDestKey].name + 'での素敵な滞在'}</p>
      
      <div class="mt-2 pt-3 border-t border-slate-100 flex gap-2">
        <button onclick="voteHotel('${h.name.replace(/'/g, "\\'")}', 1)" class="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors border border-emerald-100">第1希望</button>
        <button onclick="voteHotel('${h.name.replace(/'/g, "\\'")}', 2)" class="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white transition-colors border border-sky-100">第2希望</button>
        <button onclick="voteHotel('${h.name.replace(/'/g, "\\'")}', 3)" class="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors border border-amber-100">第3希望</button>
      </div>
    </div>
  `).join('');
}

function voteHotel(hotelName, choiceLevel) {
  if (!currentVoter) {
    checkIdentity();
    return;
  }
  if (!db) {
    alert(`データベースに接続できませんでした！`);
    return;
  }
  
  const voteRef = db.ref(`votes/${currentDestKey}/${currentVoter}`);
  let updates = {};
  updates[`choice${choiceLevel}`] = hotelName;
  
  voteRef.update(updates)
    .then(() => alert(`${hotelName} を第${choiceLevel}希望として保存しました！`))
    .catch(e => alert("保存エラー: " + e.message));
}

// Add event listener to open Group Votes
document.addEventListener('DOMContentLoaded', () => {
  // We need to wait for DOM to be fully loaded
  const btnGroupVotes = document.getElementById('btn-group-votes');
  if (btnGroupVotes) {
    btnGroupVotes.parentElement.onclick = () => {
      openModal('modal-group-votes');
      renderGroupVotes();
    };
  }

  // Check identity slightly after load
  setTimeout(() => {
    checkIdentity();
  }, 500);
});

function renderGroupVotes() {
  const container = document.getElementById('group-votes-container');
  if (!db) {
    container.innerHTML = `<p class="text-red-500 text-center py-10">データベースが初期化されていません！</p>`;
    return;
  }
  
  container.innerHTML = `<p class="text-center text-slate-500 py-10">投票を読み込んでいます...</p>`;
  
  db.ref('votes').once('value').then(snapshot => {
    const data = snapshot.val();
    if (!data) {
      container.innerHTML = `<p class="text-center text-slate-500 py-10">まだ投票されていません。</p>`;
      return;
    }
    
    let html = '';
    for (const [dest, voters] of Object.entries(data)) {
      const destName = hotelData[dest] ? hotelData[dest].name : dest;
      html += `<h4 class="font-bold text-slate-800 mt-4 mb-2 pb-1 border-b border-slate-200">${destName}</h4>`;
      
      for (const [voter, choices] of Object.entries(voters)) {
        html += `
          <div class="bg-white rounded-xl p-3 mb-2 shadow-sm border border-slate-100">
            <p class="font-bold text-emerald-700 text-sm mb-1">${voter}</p>
            <ul class="text-xs text-slate-600 space-y-1 pl-2 border-l-2 border-emerald-100">
              <li><span class="font-semibold text-emerald-600">第1希望:</span> ${choices.choice1 || '...'}</li>
              <li><span class="font-semibold text-sky-600">第2希望:</span> ${choices.choice2 || '...'}</li>
              <li><span class="font-semibold text-amber-600">第3希望:</span> ${choices.choice3 || '...'}</li>
            </ul>
          </div>
        `;
      }
    }
    container.innerHTML = html;
  }).catch(e => {
    container.innerHTML = `<p class="text-red-500 text-center py-10">読み込みエラー: ${e.message}</p>`;
  });
}
