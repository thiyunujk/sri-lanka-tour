# Photo mapping verification — all 36 hotels

## Important caveat on "original filename"

The requested fourth column — **the original filename each photo was renamed from** — cannot be
produced from any evidence available to this session. Checked and ruled out:

- **Git history**: exactly one commit ever touched `resources/hotels/` —
  `d4bd369 feat: stateful vote buttons, switch user, ranked group dashboard, incremental local photos`.
  In that commit all 36 files appear as brand-new blobs (`Bin 0 -> N bytes`), not as renames — git's
  own rename detection (`git log --diff-filter=R --follow`) found nothing, because git never saw a
  prior version of these files under any other name. The commit message itself confirms why: "Renamed
  the 36 already-sourced hotel photos to their slugs" — past tense, done on disk before that commit,
  outside version control.
- **Working tree / reflog / stash / dangling objects**: clean, empty, empty, empty — no leftover
  original-named copies anywhere in this repo.
- **`scripts/image_fetch_report.json`**: an unrelated, earlier og:image-scraping attempt against a
  different (fabricated, later-purged — see commit `c6e0031`) hotel list. Only 8 of its 144 entries
  happen to share a name with one of the current 36 curated hotels, and only one of those 8 has a
  URL (`Mandarina Colombo` → `.../og.jpg`) — not a distinctive original filename, and there's no
  evidence that URL is actually where the currently-committed `mandarina-colombo.jpg` came from.

So: the filename-based fuzzy-match check as literally specified can't be done — that data doesn't
exist anywhere accessible. What follows instead is (1) the full name → slug → filename table, which
*is* fully verifiable, and (2) a substitute risk signal built from what's actually checkable: hotel
name/brand collisions (the exact pattern that would cause a human renaming files by hand to mix two
up) plus a direct visual spot-check of every photo in that risk group.

## Full mapping (36/36 present, slug matches filename exactly for all)

| # | Destination | Hotel name | Slug | Filename found |
|---|---|---|---|---|
| 1 | colombo_arrival | Shangri-La Colombo | `shangri-la-colombo` | shangri-la-colombo.jpg |
| 2 | colombo_arrival | Amari Colombo, Sri Lanka | `amari-colombo-sri-lanka` | amari-colombo-sri-lanka.jpg |
| 3 | colombo_arrival | Granbell Hotel Colombo | `granbell-hotel-colombo` | granbell-hotel-colombo.jpg |
| 4 | colombo_arrival | Mandarina Colombo | `mandarina-colombo` | mandarina-colombo.jpg |
| 5 | colombo_arrival | Tarshish Villa - Colombo | `tarshish-villa-colombo` | tarshish-villa-colombo.jpg |
| 6 | colombo_arrival | Orion City Hotel | `orion-city-hotel` | orion-city-hotel.jpg |
| 7 | colombo_departure | Hilton Colombo Residence | `hilton-colombo-residence` | hilton-colombo-residence.jpg |
| 8 | colombo_departure | Radisson Hotel Colombo | `radisson-hotel-colombo` | radisson-hotel-colombo.jpg |
| 9 | colombo_departure | C 1 Colombo Fort | `c-1-colombo-fort` | c-1-colombo-fort.jpg |
| 10 | colombo_departure | Srilax | `srilax` | srilax.jpg |
| 11 | colombo_departure | Marino Beach Colombo | `marino-beach-colombo` | marino-beach-colombo.jpg |
| 12 | colombo_departure | Cinnamon Lakeside | `cinnamon-lakeside` | cinnamon-lakeside.jpg |
| 13 | kandy | 360 Viewpoint by Queens Mount | `360-viewpoint-by-queens-mount` | 360-viewpoint-by-queens-mount.jpg |
| 14 | kandy | Eagle Regency Hotel | `eagle-regency-hotel` | eagle-regency-hotel.jpg |
| 15 | kandy | Cinnamon Citadel Kandy | `cinnamon-citadel-kandy` | cinnamon-citadel-kandy.jpg |
| 16 | kandy | Radisson Hotel Kandy | `radisson-hotel-kandy` | radisson-hotel-kandy.jpg |
| 17 | kandy | Mountbatten Bungalow- Thema Collection | `mountbatten-bungalow-thema-collection` | mountbatten-bungalow-thema-collection.jpg |
| 18 | kandy | Simpson's Forest - Luxury Boutique Resort & Spa - Kandy | `simpson-s-forest-luxury-boutique-resort-spa-kandy` | simpson-s-forest-luxury-boutique-resort-spa-kandy.jpg |
| 19 | nuwara_eliya | Araliya Green City - Your Gateway to Everything in Nuwara Eliya | `araliya-green-city-your-gateway-to-everything-in-nuwara-eliya` | araliya-green-city-your-gateway-to-everything-in-nuwara-eliya.jpg |
| 20 | nuwara_eliya | Jetwing Broomfield Bungalow | `jetwing-broomfield-bungalow` | jetwing-broomfield-bungalow.jpg |
| 21 | nuwara_eliya | Winsanda Boutique Bungalow, Nuwara Eliya l Heated Pool & Buffet Dining | `winsanda-boutique-bungalow-nuwara-eliya-l-heated-pool-buffet-dining` | winsanda-boutique-bungalow-nuwara-eliya-l-heated-pool-buffet-dining.jpg |
| 22 | nuwara_eliya | Yara Nuwara Eliya | `yara-nuwara-eliya` | yara-nuwara-eliya.jpg |
| 23 | nuwara_eliya | Cool Cloud Villa | `cool-cloud-villa` | cool-cloud-villa.jpg |
| 24 | nuwara_eliya | Wonder hills | `wonder-hills` | wonder-hills.jpg |
| 25 | sigiriya | Tepraas Sigiriya | `tepraas-sigiriya` | tepraas-sigiriya.jpg |
| 26 | sigiriya | Cinnamon Lodge Habarana | `cinnamon-lodge-habarana` | cinnamon-lodge-habarana.jpg |
| 27 | sigiriya | Pinthaliya Resort | `pinthaliya-resort` | pinthaliya-resort.jpg |
| 28 | sigiriya | Sigiriya Jungles Resort & Spa | `sigiriya-jungles-resort-spa` | sigiriya-jungles-resort-spa.jpg |
| 29 | sigiriya | Sandila Nivasa | `sandila-nivasa` | sandila-nivasa.jpg |
| 30 | sigiriya | Tropicara Resort | `tropicara-resort` | tropicara-resort.jpg |
| 31 | yala | Aqua Hotel Yala | `aqua-hotel-yala` | aqua-hotel-yala.jpg |
| 32 | yala | Blue Sky Hotel Yala | `blue-sky-hotel-yala` | blue-sky-hotel-yala.jpg |
| 33 | yala | Yala Villa | `yala-villa` | yala-villa.jpg |
| 34 | yala | Enchanted Escapes Yala | `enchanted-escapes-yala` | enchanted-escapes-yala.jpg |
| 35 | yala | Wild Coast Tented Lodge - Relais and Chateaux - All Inclusive | `wild-coast-tented-lodge-relais-and-chateaux-all-inclusive` | wild-coast-tented-lodge-relais-and-chateaux-all-inclusive.jpg |
| 36 | yala | Jetwing Yala | `jetwing-yala` | jetwing-yala.jpg |

Verified programmatically: every hotel's `slug` field in `js/hotelData.js` has exactly one matching
`<slug>.jpg` in `resources/hotels/`, all 36 present, none missing, none orphaned (no extra `.jpg`
files without a matching hotel).

**No duplicate images**: SHA-256 hashed all 36 files — 36 distinct hashes, zero collisions. This
rules out the most damning class of mixup (the same photo accidentally assigned to two different
hotels).

## Shortlist for human review — name/brand-collision risk

Since the true original filenames are unrecoverable, this is a proxy risk signal: hotels that share
a brand name or a generic/similar name with another hotel in the set are exactly the ones a person
manually renaming files without careful cross-referencing would be most likely to mix up. I opened
and visually inspected every photo in this group myself; findings below.

| Hotel | Risk reason | Visual check result |
|---|---|---|
| Cinnamon Lakeside (colombo_departure) | Shares "Cinnamon" brand with 2 others below | Waterfront hotel, large pool beside a river/lagoon — distinct from the other two Cinnamon properties |
| Cinnamon Citadel Kandy (kandy) | Shares "Cinnamon" brand | Hillside resort overlooking a river at dusk — distinct, Kandy's riverine setting is plausible |
| Cinnamon Lodge Habarana (sigiriya) | Shares "Cinnamon" brand | Aerial shot of a red-roofed jungle lodge beside a lake — visually distinct from the other two |
| Jetwing Broomfield Bungalow (nuwara_eliya) | Shares "Jetwing" brand with 1 other | Aerial view, colonial-style bungalow amid tea plantations — consistent with Nuwara Eliya tea country |
| Jetwing Yala (yala) | Shares "Jetwing" brand | Beachfront thatched-roof resort with infinity pool — consistent with coastal Yala |
| Radisson Hotel Colombo (colombo_departure) | Shares "Radisson" brand with 1 other | Modern interior lobby/lounge with sea view through glass wall — urban Colombo setting |
| Radisson Hotel Kandy (kandy) | Shares "Radisson" brand | Rooftop infinity-style pool with hills in the background — Kandy's hill setting is plausible |
| Aqua Hotel Yala (yala) | 1 of 6 Yala hotels, generic name | Budget-tier poolside with wooden loungers, modest building — consistent with a lower-tier "Aqua Hotel" |
| Blue Sky Hotel Yala (yala) | 1 of 6 Yala hotels, generic name | Plain multi-story guesthouse building, no resort grounds visible — consistent with a small budget hotel |
| Yala Villa (yala) | 1 of 6 Yala hotels, generic name | Private villa with courtyard pool at dusk — consistent with a standalone "villa" |
| Enchanted Escapes Yala (yala) | 1 of 6 Yala hotels | Tented-cabin interior at night — consistent with a boutique tented-camp brand |
| Wild Coast Tented Lodge - Relais and Chateaux - All Inclusive (yala) | 1 of 6 Yala hotels, top-tier | Architecturally striking bamboo-vaulted bar/lounge beside an infinity pool — clearly the most premium of the 6, consistent with its Relais & Châteaux billing |
| Srilax (colombo_departure) | Very generic/short name | Plain white guesthouse bedroom — unremarkable but not contradictory; **hardest of this group to confirm identity from the photo alone**, since it shows no exterior, signage, or distinguishing feature |
| Wonder hills (nuwara_eliya) | Generic name | Bedroom with a large window onto a green mountain/tea-field valley — consistent with "Wonder hills" and Nuwara Eliya's terrain |
| Tepraas Sigiriya (sigiriya) | Shares "Sigiriya" with 1 other | Poolside with red-roofed buildings, flat scrubland in background — plausible for Sigiriya's dry-zone landscape |
| Sigiriya Jungles Resort & Spa (sigiriya) | Shares "Sigiriya" with 1 other | Aerial jungle-canopy shot with a red-roofed lodge and pool, farmland in the distance — distinct from Tepraas Sigiriya's image and consistent with "jungle resort" |

**Bottom line from the visual pass**: none of the 16 highest-risk photos show an obvious contradiction
(wrong building type, wrong terrain, or a clash with another entry). The one flagged for extra
scrutiny is **Srilax** — not because anything is visibly wrong, but because the photo (a generic
interior bedroom shot) offers no external cue at all to confirm it's actually that property, unlike
every other entry in this table which has some visible signature (brand-style architecture, coastal
vs. hill terrain, etc.) a reviewer could cross-check against a listing photo.

The remaining 20 hotels not listed above have names distinct enough (no shared brand, no near-duplicate
name within the same destination) that a manual-rename mixup is much less likely; they weren't
individually re-verified against an external source here, since doing so is exactly the kind of
judgment call this report is handing back to a human reviewer rather than a repo-evidence check.
