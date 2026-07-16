# Hotel photos

Drop a real photo for any hotel into this folder using the exact filename
below (all lowercase, `.jpg`) and it appears on that hotel's card automatically
— **no code changes needed**. The card's `<img>` points straight at
`resources/hotels/<slug>.jpg`; if the file is missing, the browser's `onerror`
handler swaps in the existing destination-colored placeholder, so there is
nothing else to wire up.

Each hotel's slug comes from its English name in `js/hotelData.js`
(`slug` field), lowercased and hyphenated.

All 36 filenames currently in this folder already have a matching photo —
this list also serves as the source of truth if any get renamed, moved, or
need replacing with a better shot.

### Colombo (Arrival)
- `shangri-la-colombo.jpg` (Shangri-La Colombo)
- `amari-colombo-sri-lanka.jpg` (Amari Colombo, Sri Lanka)
- `granbell-hotel-colombo.jpg` (Granbell Hotel Colombo)
- `mandarina-colombo.jpg` (Mandarina Colombo)
- `tarshish-villa-colombo.jpg` (Tarshish Villa - Colombo)
- `orion-city-hotel.jpg` (Orion City Hotel)

### Colombo (Departure)
- `hilton-colombo-residence.jpg` (Hilton Colombo Residence)
- `radisson-hotel-colombo.jpg` (Radisson Hotel Colombo)
- `c-1-colombo-fort.jpg` (C 1 Colombo Fort)
- `srilax.jpg` (Srilax)
- `marino-beach-colombo.jpg` (Marino Beach Colombo)
- `cinnamon-lakeside.jpg` (Cinnamon Lakeside)

### Kandy
- `360-viewpoint-by-queens-mount.jpg` (360 Viewpoint by Queens Mount)
- `eagle-regency-hotel.jpg` (Eagle Regency Hotel)
- `cinnamon-citadel-kandy.jpg` (Cinnamon Citadel Kandy)
- `radisson-hotel-kandy.jpg` (Radisson Hotel Kandy)
- `mountbatten-bungalow-thema-collection.jpg` (Mountbatten Bungalow- Thema Collection)
- `simpson-s-forest-luxury-boutique-resort-spa-kandy.jpg` (Simpson's Forest - Luxury Boutique Resort & Spa - Kandy)

### Nuwara Eliya
- `araliya-green-city-your-gateway-to-everything-in-nuwara-eliya.jpg` (Araliya Green City - Your Gateway to Everything in Nuwara Eliya)
- `jetwing-broomfield-bungalow.jpg` (Jetwing Broomfield Bungalow)
- `winsanda-boutique-bungalow-nuwara-eliya-l-heated-pool-buffet-dining.jpg` (Winsanda Boutique Bungalow, Nuwara Eliya l Heated Pool & Buffet Dining)
- `yara-nuwara-eliya.jpg` (Yara Nuwara Eliya)
- `cool-cloud-villa.jpg` (Cool Cloud Villa)
- `wonder-hills.jpg` (Wonder hills)

### Sigiriya
- `tepraas-sigiriya.jpg` (Tepraas Sigiriya)
- `cinnamon-lodge-habarana.jpg` (Cinnamon Lodge Habarana)
- `pinthaliya-resort.jpg` (Pinthaliya Resort)
- `sigiriya-jungles-resort-spa.jpg` (Sigiriya Jungles Resort & Spa)
- `sandila-nivasa.jpg` (Sandila Nivasa)
- `tropicara-resort.jpg` (Tropicara Resort)

### Yala
- `aqua-hotel-yala.jpg` (Aqua Hotel Yala)
- `blue-sky-hotel-yala.jpg` (Blue Sky Hotel Yala)
- `yala-villa.jpg` (Yala Villa)
- `enchanted-escapes-yala.jpg` (Enchanted Escapes Yala)
- `wild-coast-tented-lodge-relais-and-chateaux-all-inclusive.jpg` (Wild Coast Tented Lodge - Relais and Chateaux - All Inclusive)
- `jetwing-yala.jpg` (Jetwing Yala)
