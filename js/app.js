/**
 * Itinerary Data Payload
 * Contains detailed steps in English (EN) and Japanese (JA)
 */
const itineraryData = [
  {
    dayNum: 1,
    date: "Aug 10",
    img: "resources/welcome%20srilanka.webp",
    en: {
      title: "Day 1: Arrival",
      timeline: [
        "23:50 PM: Arrival at Katunayake International Airport (CMB)."
      ],
      hotel: "Airport Transfer / Transit (Directly to Colombo hotel).",
      vanRoute: null
    },
    ja: {
      title: "1日目：スリランカ到着",
      timeline: [
        "23:50: カトゥナーヤカ国際空港（CMB）に到着。"
      ],
      hotel: "空港送迎 / 移動（直接コロンボのホテルへ）",
      vanRoute: null
    }
  },
  {
    dayNum: 2,
    date: "Aug 11",
    img: "resources/day2.png",
    en: {
      title: "Day 2: Colombo & Family Visit",
      timeline: [
        "02:00 AM: Check in to the Colombo hotel and rest.",
        "Morning: Enjoy breakfast at the hotel.",
        "Noon: Depart to Mr. Thiyunu's home for lunch and a visit.",
        "03:00 PM: Return to the Colombo hotel and spend the evening relaxing."
      ],
      hotel: "Colombo Premium/Standard Hotel.",
      vanRoute: null
    },
    ja: {
      title: "2日目：コロンボ滞在＆ホスト宅訪問",
      timeline: [
        "02:00: コロンボのホテルにチェックインして休憩。",
        "午前：ホテルで朝食。",
        "正午：ティユヌ氏の自宅へ出発し、昼食と訪問。",
        "15:00: コロンボのホテルに戻り、夕方はリラックスして過ごす。"
      ],
      hotel: "コロンボ プレミアム/スタンダード ホテル",
      vanRoute: null
    }
  },
  {
    dayNum: 3,
    date: "Aug 12",
    img: "resources/day3.jpg",
    en: {
      title: "Day 3: Dambulla Cave Temple",
      timeline: [
        "Morning: Breakfast at the hotel in Colombo.",
        "11:30 AM: Depart for Dambulla from the Colombo hotel.",
        "Midway: Stop for lunch at a restaurant along the way.",
        "03:00 PM: Arrive at and explore the Dambulla Cave Temple.",
        "Evening: Head to the hotel in Sigiriya for the night."
      ],
      hotel: "Sigiriya Nature Resort (Night 1).",
      vanRoute: "Colombo ➔ Dambulla (approx. 3.5 hrs) | Dambulla ➔ Sigiriya (approx. 30 mins)."
    },
    ja: {
      title: "3日目：ダンブッラ石窟寺院",
      timeline: [
        "午前：コロンボのホテルで朝食。",
        "11:30: コロンボのホテルを出発し、ダンブッラへ向かう。",
        "途中：道中のレストランで昼食。",
        "15:00: ダンブッラ石窟寺院に到着、見学。",
        "夕方：夜に向けてシーギリヤのホテルへ移動。"
      ],
      hotel: "シーギリヤ ネイチャー リゾート（1泊目）",
      vanRoute: "コロンボ ➔ ダンブッラ (約3.5時間) | ダンブッラ ➔ シーギリヤ (約30分)"
    }
  },
  {
    dayNum: 4,
    date: "Aug 13",
    img: "resources/day4.jpg",
    en: {
      title: "Day 4: Pidurangala Sunset",
      timeline: [
        "Morning: Have a slow, relaxing morning at the resort.",
        "Evening: Climb Pidurangala Rock to watch the spectacular sunset.",
        "Night: Return and stay at the Sigiriya hotel."
      ],
      hotel: "Sigiriya Nature Resort (Night 2).",
      vanRoute: null
    },
    ja: {
      title: "4日目：ピドゥランガラ・ロックの夕日",
      timeline: [
        "午前：リゾートでゆっくりとした朝を過ごす。",
        "夕方：ピドゥランガラ・ロックに登り、素晴らしい夕日を鑑賞。",
        "夜：シーギリヤのホテルに戻り宿泊。"
      ],
      hotel: "シーギリヤ ネイチャー リゾート（2泊目）",
      vanRoute: null
    }
  },
  {
    dayNum: 5,
    date: "Aug 14",
    img: "resources/day5.jpeg",
    en: {
      title: "Day 5: Sigiriya Rock & Ayurveda",
      timeline: [
        "Morning: Breakfast at the hotel, then begin the climb up Sigiriya Rock.",
        "Midday: Return to the hotel to rest and recover.",
        "Afternoon: Try a traditional Sri Lankan Ayurveda massage.",
        "Night: Stay at the Sigiriya hotel."
      ],
      hotel: "Sigiriya Nature Resort (Night 3).",
      vanRoute: null
    },
    ja: {
      title: "5日目：シーギリヤ登頂＆マッサージ",
      timeline: [
        "午前：ホテルで朝食後、シーギリヤ・ロック登頂を開始。",
        "日中：ホテルに戻り休憩。",
        "午後：伝統的なスリランカのアーユルヴェーダ・マッサージを体験。",
        "夜：シーギリヤのホテルに宿泊。"
      ],
      hotel: "シーギリヤ ネイチャー リゾート（3泊目）",
      vanRoute: null
    }
  },
  {
    dayNum: 6,
    date: "Aug 15",
    img: "resources/SriDaladaMaligawa1.webp",
    en: {
      title: "Day 6: Temple of the Tooth & Cultural Show",
      timeline: [
        "Morning: Have breakfast and head to the Temple of the Sacred Tooth Relic in Kandy.",
        "Afternoon: Dress up in the traditional 'Udarata Nilame' royal costumes for a unique photoshoot.",
        "Evening: Watch a traditional Kandyan cultural dance show.",
        "Night: Stay in Kandy."
      ],
      hotel: "Kandy Hills Boutique Hotel.",
      vanRoute: "Sigiriya ➔ Kandy (approx. 2.5 hrs)."
    },
    ja: {
      title: "6日目：仏歯寺と伝統衣装体験",
      timeline: [
        "午前：朝食を取り、キャンディの仏歯寺へ向かう。",
        "午後：伝統的な王室衣装「ウダラタ・ニラメ」を着て記念撮影。",
        "夕方：キャンディの伝統的な文化ダンスショーを鑑賞。",
        "夜：キャンディに宿泊。"
      ],
      hotel: "キャンディ ヒルズ ブティック ホテル",
      vanRoute: "シーギリヤ ➔ キャンディ (約2.5時間)"
    }
  },
  {
    dayNum: 7,
    date: "Aug 16",
    img: "resources/nuwaraeliya.webp",
    en: {
      title: "Day 7: High Tea in Nuwara Eliya",
      timeline: [
        "Morning: Enjoy breakfast at the hotel in Kandy.",
        "Noon: Depart for the scenic mountainous region of Nuwara Eliya.",
        "Afternoon: Experience High Tea at the elegant Araliya Hotel.",
        "Late Afternoon: Visit a local tea factory and take photos while tea plucking in the fields.",
        "Night: Stay in Nuwara Eliya."
      ],
      hotel: "Araliya Green Hills (Bring a light jacket).",
      vanRoute: "Kandy ➔ Nuwara Eliya (approx. 2.5 hrs)."
    },
    ja: {
      title: "7日目：紅茶工場とハイティー",
      timeline: [
        "午前：キャンディのホテルで朝食。",
        "正午：風光明媚な山岳地帯ヌワラエリヤへ出発。",
        "午後：エレガントなアラリヤ・ホテルでハイティーを体験。",
        "夕方：地元の紅茶工場を訪れ、茶畑で茶摘みの写真を撮影。",
        "夜：ヌワラエリヤに宿泊。"
      ],
      hotel: "アラリヤ グリーン ヒルズ（薄手のジャケットを持参）",
      vanRoute: "キャンディ ➔ ヌワラエリヤ (約2.5時間)"
    }
  },
  {
    dayNum: 8,
    date: "Aug 17",
    img: "resources/day8.jpg",
    en: {
      title: "Day 8: Scenic Train & Nine Arch Bridge",
      timeline: [
        "09:00 AM: Arrive at Nanu Oya Station to catch the famous Ella scenic train.",
        "Midday: Ride the train to Demodara Station. The train will slowly cross the Nine Arch Bridge without stopping, offering great photo opportunities from inside.",
        "Afternoon: Disembark at Demodara Station, meet the driver, and take the van to the bottom of the Nine Arch Bridge to watch and photograph another train passing by.",
        "Evening: Drive south to the Yala area and check in to the hotel."
      ],
      hotel: "Yala Safari Wild Luxury Lodge.",
      vanRoute: "Demodara ➔ Yala National Park (approx. 2 hrs)."
    },
    ja: {
      title: "8日目：高原列車と九連アーチ橋",
      timeline: [
        "09:00: ナヌオヤ駅に到着し、有名な絶景列車に乗車。",
        "日中：列車でデモダラ駅へ向かう。列車は停車せずに九連アーチ橋をゆっくり通過するため、車内から素晴らしい写真撮影の機会があります。",
        "午後：デモダラ駅で下車し、ドライバーと合流。バンで九連アーチ橋のふもとへ向かい、別の列車が通過する様子を見学・撮影。",
        "夕方：南部のヤーラ地区へドライブし、ホテルにチェックイン。"
      ],
      hotel: "ヤーラ サファリ ワイルド ラグジュアリー ロッジ",
      vanRoute: "デモダラ ➔ ヤーラ国立公園 (約2時間)"
    }
  },
  {
    dayNum: 9,
    date: "Aug 18",
    img: "resources/day9.jpg",
    en: {
      title: "Day 9: Early Safari & Return to Colombo",
      timeline: [
        "04:00 AM: Head to Yala National Park early to beat the ticket queue and increase the chances of spotting leopards, which are most active at dawn.",
        "Morning: Enjoy a thrilling half-day wildlife jeep safari.",
        "Afternoon: Depart Yala and head back to the capital, Colombo.",
        "Night: Stay at a hotel in Colombo."
      ],
      hotel: "Colombo City Center Hotel.",
      vanRoute: "Yala ➔ Colombo (Expressway) (approx. 4 hrs)."
    },
    ja: {
      title: "9日目：早朝サファリ＆コロンボ帰還",
      timeline: [
        "04:00: ヤーラ国立公園へ早朝に出発。チケットの行列を避け、夜明けに最も活発になるヒョウの目撃確率を高めます。",
        "午前：スリリングな半日の野生動物ジープサファリを楽しむ。",
        "午後：ヤーラを出発し、首都コロンボへ戻る。",
        "夜：コロンボのホテルに宿泊。"
      ],
      hotel: "コロンボ シティ センター ホテル",
      vanRoute: "ヤーラ ➔ コロンボ（高速道路） (約4時間)"
    }
  },
  {
    dayNum: 10,
    date: "Aug 19",
    img: "resources/day10.jpg",
    en: {
      title: "Day 10: Red Mosque & Shopping",
      timeline: [
        "Morning: Breakfast at the Colombo hotel.",
        "Midday: Visit the famous Red Mosque (Jami Ul-Alfar) in Pettah and explore the area.",
        "Afternoon: Spend the rest of the day souvenir shopping around Colombo.",
        "Night: Stay at the Colombo hotel."
      ],
      hotel: "Colombo City Center Hotel.",
      vanRoute: null
    },
    ja: {
      title: "10日目：赤モスク見学と買い物",
      timeline: [
        "午前：コロンボのホテルで朝食。",
        "日中：ペター地区の有名な赤モスク（ジャミ・ウル・アルファー）を訪れ、周辺を散策。",
        "午後：コロンボ周辺でお土産の買い物をして過ごす。",
        "夜：コロンボのホテルに宿泊。"
      ],
      hotel: "コロンボ シティ センター ホテル",
      vanRoute: null
    }
  },
  {
    dayNum: 11,
    date: "Aug 20",
    img: "resources/srilankan%20depart.jpg",
    en: {
      title: "Day 11: Farewell & Departure",
      timeline: [
        "Morning: Relax and enjoy breakfast at the hotel.",
        "Afternoon: Last-minute shopping and relaxing in the city.",
        "Evening: Head back to Mr. Thiyunu's place for a farewell evening tea.",
        "09:00 PM: Arrive at Katunayake International Airport for departure."
      ],
      hotel: null,
      vanRoute: null
    },
    ja: {
      title: "11日目：お別れのお茶会＆帰国",
      timeline: [
        "午前：ホテルでリラックスし、朝食を楽しむ。",
        "午後：街で最後のお土産の買い物やリラックスした時間を過ごす。",
        "夕方：ティユヌ氏の自宅に戻り、お別れのイブニングティー。",
        "21:00: 出発のためカトゥナーヤカ国際空港に到着。"
      ],
      hotel: null,
      vanRoute: null
    }
  }
];

// UI Dictionary for static texts
const staticTextUI = {
  en: {
    headerTitle: "Sri Lanka Tour",
    headerDates: "August 10 - 20, 2026",
    heroTitle: "Your Detailed Itinerary",
    heroSubtitle: "Scroll to view your daily schedule, transit routes, and accommodations.",
    btnTop: "Scroll to Top",
    btnStart: "Start Tour",
    btnChecklist: "Checklist",
    btnDocs: "Documents",
    modalTitleChecklist: "Packing Checklist",
    modalTitleDocs: "Important Documents",
    lblRoute: "Transit Route",
    lblHotel: "Accommodation",
    lblMap: "Open Map",
    lblBooking: "View Booking"
  },
  ja: {
    headerTitle: "スリランカ ツアー",
    headerDates: "2026年8月10日 - 20日",
    heroTitle: "詳細な旅程表",
    heroSubtitle: "スクロールして毎日のスケジュール、移動ルート、宿泊先を確認してください。",
    btnTop: "トップへ",
    btnStart: "ツアー開始",
    btnChecklist: "持ち物",
    btnDocs: "書類",
    modalTitleChecklist: "持ち物リスト",
    modalTitleDocs: "重要書類",
    lblRoute: "移動ルート",
    lblHotel: "宿泊先",
    lblMap: "地図を開く",
    lblBooking: "予約を確認"
  }
};

const packingListData = [
  { id: 'item1', en: 'Passport & E-Visa', ja: 'パスポート＆電子ビザ' },
  { id: 'item2', en: 'Light Jacket (Nuwara Eliya)', ja: '薄手のジャケット（ヌワラエリヤ用）' },
  { id: 'item3', en: 'Temple Clothes (Cover knees/shoulders)', ja: '寺院用衣服（膝・肩を隠す）' },
  { id: 'item4', en: 'Universal Power Adapter', ja: '万能電源アダプター' },
  { id: 'item5', en: 'Sunscreen & Sunglasses', ja: '日焼け止め＆サングラス' },
  { id: 'item6', en: 'Power Bank', ja: 'モバイルバッテリー' },
  { id: 'item7', en: 'Mosquito Repellent', ja: '虫除けスプレー' },
];

const documentsData = {
  en: {
    driver: { title: 'Driver Contact', name: '[Placeholder Name]', phone: '[Placeholder Phone]' },
    emergency: { title: 'Emergency Number', name: 'Tourist Police', phone: '1912' },
    links: [ { title: 'Sri Lanka E-Visa Portal', url: 'https://eta.gov.lk' } ]
  },
  ja: {
    driver: { title: 'ドライバー連絡先', name: '[名前]', phone: '[電話番号]' },
    emergency: { title: '緊急連絡先', name: '観光警察', phone: '1912' },
    links: [ { title: 'スリランカ電子ビザ（ETA）', url: 'https://eta.gov.lk' } ]
  }
};

// State Variables
let currentLang = 'ja'; // Default state on load is JA

// DOM Elements for global text
const domEls = {
  container: document.getElementById('itinerary-container'),
  langToggleBtn: document.getElementById('lang-toggle'),
  langText: document.getElementById('lang-text'),
  headerTitle: document.getElementById('header-title'),
  headerDates: document.getElementById('header-dates'),
  heroTitle: document.getElementById('hero-title'),
  heroSubtitle: document.getElementById('hero-subtitle'),
  btnTop: document.getElementById('btn-top'),
  btnStart: document.getElementById('btn-start'),
  btnChecklist: document.getElementById('btn-checklist'),
  btnDocs: document.getElementById('btn-docs'),
  modalTitleChecklist: document.getElementById('modal-title-checklist'),
  modalTitleDocs: document.getElementById('modal-title-docs'),
  checklistContainer: document.getElementById('checklist-container'),
  docsContainer: document.getElementById('docs-container'),
  modalOverlay: document.getElementById('modal-overlay')
};

/**
 * Rebuilds the itinerary HTML structure.
 * With the new requirement, all cards are OPEN by default.
 */
function renderItinerary() {
  domEls.container.innerHTML = ''; 

  itineraryData.forEach(day => {
    const data = day[currentLang];
    const uiText = staticTextUI[currentLang];
    const dateParts = day.date.split(' ');
    
    // --- Parent Card ---
    const card = document.createElement('div');
    card.className = 'bg-white border border-slate-200/75 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300';
    card.id = `day-${day.dayNum}`;
    
    // --- Clickable Accordion Header ---
    const header = document.createElement('button');
    header.className = 'w-full text-left p-4 flex items-center justify-between bg-white focus:outline-none group';
    header.onclick = () => toggleAccordion(day.dayNum);
    
    header.innerHTML = `
      <div class="flex items-center gap-4 pr-3">
        <div class="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 text-slate-800 rounded-xl w-[54px] h-[54px] shrink-0 group-hover:bg-emerald-50 group-hover:border-emerald-100 group-hover:text-emerald-700 transition-colors">
          <span class="text-[10px] font-bold uppercase tracking-wider mb-0.5">${dateParts[0]}</span>
          <span class="text-[19px] font-bold leading-none">${dateParts[1]}</span>
        </div>
        <h3 class="font-bold text-slate-800 leading-snug text-[15px] max-w-[210px]">${data.title}</h3>
      </div>
      <div class="text-slate-300 shrink-0 chevron open transition-colors group-hover:text-emerald-500" id="chevron-${day.dayNum}">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    `;

    // --- Content Wrapper (OPEN by default) ---
    const content = document.createElement('div');
    content.id = `content-${day.dayNum}`;
    content.className = 'accordion-content open px-4 pb-0';

    // 0. Image Section
    let imageHTML = '';
    if (day.img) {
      imageHTML = `
        <div class="mt-2 mb-4 rounded-xl overflow-hidden shadow-sm aspect-video border border-slate-100 bg-slate-50 relative group">
          <img src="${day.img}" alt="Sightseeing ${day.dayNum}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
        </div>
      `;
    }

    // 1. Timeline Section
    let timelineHTML = `<div class="relative pl-[22px] py-1 mt-2 mb-5 border-l-2 border-slate-100 ml-1">`;
    data.timeline.forEach(item => {
      timelineHTML += `
        <div class="mb-6 last:mb-0 relative">
          <div class="absolute -left-[29px] top-1.5 w-[12px] h-[12px] bg-emerald-400 rounded-full border-[2.5px] border-white shadow-sm"></div>
          <p class="text-[14px] text-slate-600 leading-relaxed font-medium">${item}</p>
        </div>
      `;
    });
    timelineHTML += `</div>`;

    // 2. Van Route Section
    let vanHTML = '';
    if (data.vanRoute) {
      let mapIframe = `
        <div class="mt-3 rounded-[12px] overflow-hidden border border-sky-100 shadow-sm h-32 relative">
          <iframe width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0" 
            src="https://maps.google.com/maps?q=${encodeURIComponent(data.vanRoute)}&t=&z=9&ie=UTF8&iwloc=&output=embed">
          </iframe>
        </div>
      `;
      vanHTML = `
        <div class="mb-4 bg-sky-50/50 border border-sky-100 rounded-[14px] p-3.5 flex flex-col gap-1">
          <div class="flex items-start gap-3.5 w-full">
            <div class="bg-sky-100 text-sky-600 p-2 rounded-xl shrink-0 mt-0.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-[10px] font-bold text-sky-800 uppercase tracking-widest mb-1">${uiText.lblRoute}</p>
              <p class="text-[13px] text-slate-800 leading-relaxed font-semibold">${data.vanRoute}</p>
            </div>
          </div>
          <div class="w-full">${mapIframe}</div>
        </div>
      `;
    }

    // 3. Hotel Section
    let hotelHTML = '';
    if (data.hotel) {
      hotelHTML = `
        <div class="mb-4 bg-orange-50/40 border border-orange-100 rounded-[14px] p-3.5 flex items-start gap-3.5">
          <div class="bg-orange-100 text-orange-600 p-2 rounded-xl shrink-0 mt-0.5 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <p class="text-[10px] font-bold text-orange-800 uppercase tracking-widest mb-1">${uiText.lblHotel}</p>
            <p class="text-[13px] text-slate-800 leading-relaxed font-semibold">${data.hotel}</p>
            <a href="#" class="inline-flex items-center gap-1 mt-2.5 text-[11px] font-bold text-orange-600 hover:text-orange-800 transition-colors">
              ${uiText.lblBooking}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </a>
          </div>
        </div>
      `;
    }

    content.innerHTML = `<div class="pb-5 pt-1">${imageHTML}${timelineHTML}${vanHTML}${hotelHTML}</div>`;
    
    // Assemble Card
    card.appendChild(header);
    card.appendChild(content);
    domEls.container.appendChild(card);
  });

  updateStaticGlobalText();
}

function updateStaticGlobalText() {
  const texts = staticTextUI[currentLang];
  domEls.headerTitle.textContent = texts.headerTitle;
  domEls.headerDates.textContent = texts.headerDates;
  domEls.heroTitle.textContent = texts.heroTitle;
  domEls.heroSubtitle.textContent = texts.heroSubtitle;
  domEls.btnTop.textContent = texts.btnTop;
  domEls.btnStart.textContent = texts.btnStart;
  domEls.btnChecklist.textContent = texts.btnChecklist;
  domEls.btnDocs.textContent = texts.btnDocs;
  domEls.modalTitleChecklist.textContent = texts.modalTitleChecklist;
  domEls.modalTitleDocs.textContent = texts.modalTitleDocs;
  
  document.documentElement.lang = currentLang;
  domEls.langText.textContent = currentLang === 'ja' ? 'EN' : 'JA';
}

/**
 * Accordion Logic
 * Now allows multiple cards to be open independently.
 */
function toggleAccordion(dayNum) {
  const targetContent = document.getElementById(`content-${dayNum}`);
  const targetChevron = document.getElementById(`chevron-${dayNum}`);
  
  if (targetContent.classList.contains('open')) {
    targetContent.classList.remove('open');
    targetChevron.classList.remove('open');
  } else {
    targetContent.classList.add('open');
    targetChevron.classList.add('open');
  }
}

/**
 * Listener for Bilingual Toggle.
 */
domEls.langToggleBtn.addEventListener('click', () => {
  // Find all currently open cards to preserve their state
  const openCards = [];
  document.querySelectorAll('.accordion-content.open').forEach(el => {
    // Extract dayNum from id like "content-1"
    const num = el.id.split('-')[1];
    if (num) openCards.push(num);
  });

  // Switch language
  currentLang = currentLang === 'ja' ? 'en' : 'ja';
  
  // Re-render
  renderItinerary();
  renderPackingList();
  renderDocsHub();
  
  // The renderItinerary function automatically opens ALL cards by default now.
  // So if any cards were manually CLOSED by the user before toggling, we should close them again.
  // Alternatively, we can just leave them all open, which is the new default. 
  // It's a bit nicer if we just keep the exact state they had:
  
  itineraryData.forEach(day => {
    const num = day.dayNum.toString();
    const content = document.getElementById(`content-${num}`);
    const chevron = document.getElementById(`chevron-${num}`);
    
    if (!openCards.includes(num)) {
      // It was closed before, so close it again
      content.classList.remove('open');
      chevron.classList.remove('open');
    }
  });
});

// Initialize Web App
renderItinerary();
renderPackingList();
renderDocsHub();
highlightCurrentDay();

// ==== New Feature Functions ====

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  domEls.modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
  domEls.modalOverlay.classList.add('opacity-100', 'pointer-events-auto');
  modal.classList.remove('translate-y-full');
  modal.classList.add('translate-y-0');
  document.body.classList.add('modal-open');
}

function closeAllModals() {
  domEls.modalOverlay.classList.remove('opacity-100', 'pointer-events-auto');
  domEls.modalOverlay.classList.add('opacity-0', 'pointer-events-none');
  ['modal-checklist', 'modal-docs'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('translate-y-0');
      modal.classList.add('translate-y-full');
    }
  });
  document.body.classList.remove('modal-open');
}

function toggleCheckItem(id) {
  let saved = JSON.parse(localStorage.getItem('sl-packing')) || {};
  saved[id] = !saved[id];
  localStorage.setItem('sl-packing', JSON.stringify(saved));
  renderPackingList();
}

function renderPackingList() {
  domEls.checklistContainer.innerHTML = '';
  let saved = JSON.parse(localStorage.getItem('sl-packing')) || {};
  
  packingListData.forEach(item => {
    const isChecked = saved[item.id] ? 'checked' : '';
    const textClass = saved[item.id] ? 'line-through text-slate-400' : 'text-slate-700 font-medium';
    // Using standard Tailwind styling for checkboxes since we don't have standard forms plugin
    domEls.checklistContainer.innerHTML += `
      <label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer active:scale-[0.98] transition-transform">
        <input type="checkbox" onchange="toggleCheckItem('${item.id}')" class="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 bg-white" ${isChecked}>
        <span class="text-[14px] ${textClass} transition-colors">${item[currentLang]}</span>
      </label>
    `;
  });
}

function renderDocsHub() {
  const data = documentsData[currentLang];
  domEls.docsContainer.innerHTML = `
    <!-- Driver -->
    <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
      <div class="bg-blue-100 text-blue-600 p-2.5 rounded-lg shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
      </div>
      <div>
        <p class="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-0.5">${data.driver.title}</p>
        <p class="font-bold text-slate-800 text-[15px]">${data.driver.name}</p>
        <a href="tel:${data.driver.phone}" class="text-blue-600 font-semibold text-sm mt-1 inline-block">${data.driver.phone}</a>
      </div>
    </div>
    
    <!-- Emergency -->
    <div class="bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-start gap-3 mt-3">
      <div class="bg-red-100 text-red-600 p-2.5 rounded-lg shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <div>
        <p class="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-0.5">${data.emergency.title}</p>
        <p class="font-bold text-slate-800 text-[15px]">${data.emergency.name}</p>
        <a href="tel:${data.emergency.phone}" class="text-red-600 font-semibold text-sm mt-1 inline-block">${data.emergency.phone}</a>
      </div>
    </div>
    
    <!-- Links -->
    <div class="mt-4 pt-4 border-t border-slate-100">
      ${data.links.map(l => `
        <a href="${l.url}" target="_blank" class="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
          <span class="text-sm font-semibold text-slate-700">${l.title}</span>
          <svg class="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      `).join('')}
    </div>
  `;
}

function highlightCurrentDay() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 7 = August
  const date = today.getDate();

  if (year === 2026 && month === 7 && date >= 10 && date <= 20) {
    const dayNum = date - 9;
    const card = document.getElementById(`day-${dayNum}`);
    if (card) {
      card.classList.add('highlight-today');
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }
}

