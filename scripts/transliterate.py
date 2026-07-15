"""
Best-effort English -> katakana transliteration for hotel names.

Strategy:
  1. Split the name into words.
  2. Look each word up (case-insensitive, punctuation stripped) in WORD_DICT,
     which was mined from the katakana already present in the existing 144
     hotelData.js entries (real, human-written hotel-industry vocabulary:
     "Resort" -> "リゾート", "Lodge" -> "ロッジ", "Sigiriya" -> "シーギリヤ", etc).
  3. Anything not in the dictionary falls back to a generic phonetic
     syllable-by-syllable converter. This is a heuristic, not a proper
     Japanese linguistics engine -- it aims for "sensible", human-reviewable
     output, not perfection. A human reviews every curated hotel before it
     ships (see ingest_curated.py), so an occasional rough edge here is
     acceptable.

This module has no dependency on hotelData.js at import time; WORD_DICT is
a frozen snapshot (regenerating it from hotelData.js is unnecessary for the
pilot and would make output non-reproducible as the dataset changes).
"""

import re

WORD_DICT = {
    "addara": "アッダラ", "adventure": "アドベンチャー", "ahangama": "アハンガマ",
    "aliya": "アリヤ", "amaara": "アマアラ", "amangalla": "アマンガラ", "amaya": "アマヤ",
    "andrews": "アンドリュース", "araliya": "アラリヤ", "asia": "アジア",
    "backpackers": "バックパッカーズ", "bay": "ベイ", "bazaar": "バザール",
    "beach": "ビーチ", "breeze": "ブリーズ", "bungalow": "バンガロー",
    "bunkyard": "バンキヤード", "by": "バイ", "camping": "キャンピング",
    "cape": "ケープ", "caravan": "キャラバン", "castle": "キャッスル",
    "chandrika": "チャンドリカ", "chena": "チェナ", "cinnamon": "シナモン",
    "citadel": "シタデル", "city": "シティ", "clock": "クロック",
    "closenberg": "クローゼンバーグ", "club": "クラブ", "coast": "コースト",
    "colombo": "コロンボ", "cottage": "コテージ", "cottages": "コテージズ",
    "cozy": "コージー", "crown": "クラウン", "domain": "ドメイン",
    "downtown": "ダウンタウン", "earls": "アールズ", "eco": "エコ", "edge": "エッジ",
    "elephant": "エレファント", "era": "エラ", "eraeliya": "エラエリア",
    "escape": "エスケープ", "face": "フェイス", "factory": "ファクトリー",
    "fairway": "フェアウェイ", "flower": "フラワー", "forest": "フォレスト",
    "fort": "フォート", "galle": "ゴール", "garden": "ガーデン", "gardens": "ガーデンズ",
    "gem": "ジェム", "glenfall": "グレンフォール", "golden": "ゴールデン",
    "grand": "グランド", "green": "グリーン", "hanthana": "ハインタナ",
    "haven": "ヘブン", "heaven": "ヘブン", "heights": "ハイツ", "heritance": "ヘリタンス",
    "hill": "ヒル", "hills": "ヒルズ", "hilton": "ヒルトン", "home": "ホーム",
    "homestay": "ホームステイ", "hostel": "ホステル", "hostels": "ホステルズ",
    "hotel": "ホテル", "hotels": "ホテルズ", "house": "ハウス", "huts": "ハッツ",
    "inn": "イン", "insight": "インサイト", "jetwing": "ジェットウィング",
    "jungle": "ジャングル", "jungles": "ジャングルズ", "kahanda": "カハンダ",
    "kanda": "カンダ", "kandalama": "カンダラマ", "kandy": "キャンディ",
    "kassapa": "カッサパ", "kaveri": "カヴェリ", "kings": "キングス",
    "kingsbury": "キングズベリー", "kithala": "キタラ", "lady": "レディ",
    "lake": "レイク", "lakeside": "レイクサイド", "leisure": "レジャー",
    "lighthouse": "ライトハウス", "lion": "ライオン", "lions": "ライオンズ",
    "lodge": "ロッジ", "luxury": "ラグジュアリー", "mandarina": "マンダリナ",
    "marino": "マリーノ", "moss": "モス", "mountbatten": "マウントバッテン",
    "nature": "ネイチャー", "neptune": "ネプチューン", "nest": "ネスト",
    "ocean": "オーシャン", "ozo": "オゾ", "park": "パーク", "parkview": "パークビュー",
    "pavilion": "パビリオン", "peace": "ピース", "pedlars": "ペドラーズ",
    "pink": "ピンク", "pidurangala": "ピドゥランガラ", "premium": "プレミアム",
    "printers": "プリンターズ", "private": "プライベート", "priyankara": "プリヤンカラ",
    "radh": "ラッド", "radisson": "ラディソン", "ramada": "ラマダ",
    "randholee": "ランドリー", "reach": "リーチ", "red": "レッド",
    "regency": "リージェンシー", "resort": "リゾート", "ridge": "リッジ",
    "river": "リバー", "rock": "ロック", "roys": "ロイズ", "safari": "サファリ",
    "samudra": "サムドラ", "seerock": "シーロック", "sevana": "セバナ",
    "seven": "セブン", "shangrila": "シャングリラ", "side": "サイド",
    "sigiri": "シーギリ", "sigiriya": "シーギリヤ", "single": "シングル",
    "spa": "スパ", "st": "セント", "stafford": "スタッフォード", "suisse": "スイス",
    "suite": "スイート", "sunset": "サンセット", "taj": "タージ", "tea": "ティー",
    "tented": "テンティッド", "the": "ザ", "tissamaharama": "ティッサマハラーマ",
    "topaz": "トパーズ", "tree": "ツリー", "uga": "ウガ", "unique": "ユニーク",
    "uyana": "ウヤナ", "view": "ビュー", "vil": "ヴィル", "villa": "ヴィラ",
    "village": "ヴィレッジ", "villas": "ヴィラズ", "warwick": "ワーウィック",
    "water": "ウォーター", "we": "ウィー", "weligama": "ウェリガマ", "wewa": "ウェワ",
    "wild": "ワイルド", "yala": "ヤーラ", "cave": "ケーブ", "dambulla": "ダンブッラ",
    "boutique": "ブティック", "retreat": "リトリート", "camp": "キャンプ",
    "cliff": "クリフ", "farm": "ファーム", "trail": "トレイル", "glamping": "グランピング",
    "wildlife": "ワイルドライフ", "heritage": "ヘリテージ", "art": "アート",
    "cave": "ケーブ", "valley": "バレー", "sky": "スカイ", "star": "スター",
    "dream": "ドリーム", "paradise": "パラダイス", "sanctuary": "サンクチュアリ",
    "canopy": "キャノピー", "treehouse": "ツリーハウス", "camping": "キャンピング",
}

_KANA_TABLE = [
    ("kya", "キャ"), ("kyu", "キュ"), ("kyo", "キョ"),
    ("sha", "シャ"), ("shu", "シュ"), ("sho", "ショ"), ("shi", "シ"), ("she", "シェ"),
    ("cha", "チャ"), ("chu", "チュ"), ("cho", "チョ"), ("chi", "チ"), ("che", "チェ"),
    ("tsu", "ツ"), ("ye", "イェ"),
    ("nya", "ニャ"), ("nyu", "ニュ"), ("nyo", "ニョ"),
    ("hya", "ヒャ"), ("hyu", "ヒュ"), ("hyo", "ヒョ"),
    ("mya", "ミャ"), ("myu", "ミュ"), ("myo", "ミョ"),
    ("rya", "リャ"), ("ryu", "リュ"), ("ryo", "リョ"),
    ("gya", "ギャ"), ("gyu", "ギュ"), ("gyo", "ギョ"),
    ("ja", "ジャ"), ("ju", "ジュ"), ("jo", "ジョ"), ("ji", "ジ"), ("je", "ジェ"),
    ("fa", "ファ"), ("fi", "フィ"), ("fu", "フ"), ("fe", "フェ"), ("fo", "フォ"),
    ("va", "ヴァ"), ("vi", "ヴィ"), ("vu", "ヴ"), ("ve", "ヴェ"), ("vo", "ヴォ"),
    ("ti", "ティ"), ("tu", "トゥ"), ("di", "ディ"), ("du", "ドゥ"),
    ("ka", "カ"), ("ki", "キ"), ("ku", "ク"), ("ke", "ケ"), ("ko", "コ"),
    ("ga", "ガ"), ("gi", "ギ"), ("gu", "グ"), ("ge", "ゲ"), ("go", "ゴ"),
    ("sa", "サ"), ("su", "ス"), ("se", "セ"), ("so", "ソ"),
    ("za", "ザ"), ("zu", "ズ"), ("ze", "ゼ"), ("zo", "ゾ"),
    ("ta", "タ"), ("te", "テ"), ("to", "ト"),
    ("da", "ダ"), ("de", "デ"), ("do", "ド"),
    ("na", "ナ"), ("ni", "ニ"), ("nu", "ヌ"), ("ne", "ネ"), ("no", "ノ"),
    ("ha", "ハ"), ("hi", "ヒ"), ("he", "ヘ"), ("ho", "ホ"),
    ("ba", "バ"), ("bi", "ビ"), ("bu", "ブ"), ("be", "ベ"), ("bo", "ボ"),
    ("pa", "パ"), ("pi", "ピ"), ("pu", "プ"), ("pe", "ペ"), ("po", "ポ"),
    ("ma", "マ"), ("mi", "ミ"), ("mu", "ム"), ("me", "メ"), ("mo", "モ"),
    ("ya", "ヤ"), ("yu", "ユ"), ("yo", "ヨ"),
    ("ra", "ラ"), ("ri", "リ"), ("ru", "ル"), ("re", "レ"), ("ro", "ロ"),
    ("wa", "ワ"), ("wi", "ウィ"), ("we", "ウェ"), ("wo", "ヲ"),
    ("a", "ア"), ("i", "イ"), ("u", "ウ"), ("e", "エ"), ("o", "オ"),
    ("n", "ン"),
]

def _normalize_spelling(word):
    w = word.lower()
    w = re.sub(r"oy", "oi", w)
    w = re.sub(r"ay", "ei", w)
    w = re.sub(r"tch", "ch", w)
    w = re.sub(r"ck", "k", w)
    w = re.sub(r"qu", "kw", w)
    w = re.sub(r"ph", "f", w)
    w = re.sub(r"wh", "w", w)
    w = re.sub(r"igh", "ai", w)
    w = re.sub(r"tion", "shon", w)
    w = re.sub(r"sion", "shon", w)
    w = re.sub(r"th", "s", w)
    w = re.sub(r"c(?=[eiy])", "s", w)   # soft c -> s (space, city)
    w = re.sub(r"g(?=[eiy])", "j", w)   # soft g -> j (village, cottage)
    w = re.sub(r"ge$", "j", w)          # trailing "-ge" -> j + silent e handled below
    w = re.sub(r"x", "kus", w)
    w = re.sub(r"c", "k", w)            # any remaining (hard) c -> k; no bare "c" row in kana
    # drop a lone trailing silent 'e' after a consonant (lake -> lak, house -> hous)
    if len(w) > 3 and w.endswith("e") and w[-2] not in "aeiou":
        w = w[:-1]
    return w


def _syllabify_fallback(word):
    w = _normalize_spelling(word)
    out = []
    i = 0
    n = len(w)
    while i < n:
        matched = False
        for pat, kana in _KANA_TABLE:
            if w.startswith(pat, i):
                out.append(kana)
                i += len(pat)
                matched = True
                break
        if matched:
            continue
        ch = w[i]
        if ch in "bdfghjklmnpqrstvwxyz":
            # consonant with no following vowel match (cluster/coda) ->
            # insert epenthetic vowel (standard Japanese loanword adaptation).
            # Prefer "u" ("o" after t/d), but try the rest of the vowels
            # rather than silently dropping the sound if that CV pair
            # doesn't exist in the table (e.g. no plain "yu"... it does,
            # but some consonants only have partial rows).
            preferred = "o" if ch in "td" else "u"
            fillers = [preferred] + [v for v in "uoiea" if v != preferred]
            for filler in fillers:
                found = False
                for pat, kana in _KANA_TABLE:
                    if pat == ch + filler:
                        out.append(kana)
                        found = True
                        break
                if found:
                    break
            i += 1
        else:
            i += 1  # unrecognized char (e.g. stray vowel-only leftover), skip
    return "".join(out)


def transliterate_word(word):
    """Transliterate a single English word to katakana, dictionary-first.

    Note: WORD_DICT keys were mined by stripping non-letter characters from
    the original English words, so a possessive like "King's" collapses to
    the same key as "Kings" ("kings") -- look that up directly rather than
    stripping the trailing "s" ourselves, or a dictionary hit like
    "kings" -> "キングス" would be missed and re-derived (worse) by the
    phonetic fallback.
    """
    stripped = re.sub(r"[^A-Za-z']", "", word)
    if not stripped:
        return word  # punctuation-only token (e.g. "&") passed through by caller

    key = re.sub(r"'", "", stripped).lower()

    kana = WORD_DICT.get(key)
    if kana is None:
        kana = _syllabify_fallback(key)

    return kana


def transliterate_name(name):
    """Transliterate a full hotel name, word by word, preserving spacing
    and passing through punctuation tokens like '&' as their conventional
    full-width katakana-context equivalents."""
    tokens = name.split()
    out_tokens = []
    for tok in tokens:
        if tok == "&":
            out_tokens.append("＆")
            continue
        out_tokens.append(transliterate_word(tok))
    return " ".join(out_tokens)


if __name__ == "__main__":
    import sys
    for name in sys.argv[1:]:
        print(name, "->", transliterate_name(name))
