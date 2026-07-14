import os
import sys
import json
import re
import argparse
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from playwright.sync_api import sync_playwright

# Configuration
USD_RATE = 160.0  # 1 USD = 160 JPY

def is_hotel_match(name1, name2):
    n1 = re.sub(r'[^\w\s]', '', name1.lower()).strip()
    n2 = re.sub(r'[^\w\s]', '', name2.lower()).strip()
    
    # Remove common country suffix from comparison for clean matching
    n1 = n1.replace("sri lanka", "").strip()
    n2 = n2.replace("sri lanka", "").strip()
    
    if not n1 or not n2:
        return False
        
    # 1. Exact match
    if n1 == n2:
        return True
        
    # 2. Substring matches (e.g. "Hotel Sigiriya" in "Hotel Sigiriya Sigiriya")
    if n1 in n2 or n2 in n1:
        return True
        
    # 3. Sequence similarity
    from difflib import SequenceMatcher
    ratio = SequenceMatcher(None, n1, n2).ratio()
    if ratio >= 0.75:
        return True
        
    # 4. Keyword matching (ignoring common words)
    words1 = set(n1.split())
    words2 = set(n2.split())
    stopwords = {"the", "hotel", "resort", "hostel", "inn", "guesthouse", "villa", "villas", "colombo", "kandy", "sigiriya", "galle", "yala", "weligama", "sri", "lanka", "and", "spa", "by", "of"}
    
    unique1 = words1 - stopwords
    unique2 = words2 - stopwords
    
    if not unique1 or not unique2:
        return ratio >= 0.65
        
    overlap = unique1.intersection(unique2)
    # If all unique words of one are in the other, or significant overlap
    if len(overlap) >= len(unique1) or len(overlap) >= len(unique2):
        return True
        
    return False

def fetch_live_prices(destinations, base_dir):
    print("\n" + "="*60)
    print("🚀 STARTING LIVE PRICE FETCHING VIA PLAYWRIGHT...")
    print("This will search Booking.com for 144 hotels.")
    print("To prevent IP bans, we fetch Twin rates and approximate Single rates.")
    print("Strict hotel name matching is used to prevent price contamination.")
    print("Failed searches will gracefully fall back to local cached rates.")
    print("="*60 + "\n")
    
    # Check-in and Check-out dates for each stop in August 2026
    DATES = {
        "colombo_arrival": ("2026-08-11", "2026-08-12"),
        "sigiriya": ("2026-08-12", "2026-08-14"),
        "kandy": ("2026-08-14", "2026-08-15"),
        "nuwara_eliya": ("2026-08-15", "2026-08-16"),
        "yala": ("2026-08-16", "2026-08-17"),
        "weligama": ("2026-08-17", "2026-08-18"),
        "galle": ("2026-08-18", "2026-08-19"),
        "colombo_departure": ("2026-08-19", "2026-08-20")
    }
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            # Use a real user-agent to look like a browser
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                viewport={"width": 1280, "height": 800}
            )
            page = context.new_page()
            
            # Add a default timeout
            page.set_default_timeout(15000)
            
            for dest in destinations:
                dest_id = dest["id"]
                if dest_id not in DATES:
                    continue
                
                checkin, checkout = DATES[dest_id]
                print(f"\n📂 Fetching rates for {dest['name']} ({checkin} to {checkout})...")
                
                hotels = dest.get("hotels", [])
                for i, h in enumerate(hotels, 1):
                    hotel_name = h["name"]
                    print(f"[{i}/{len(hotels)}] Searching: {hotel_name}...")
                    
                    # Construct search URL
                    import urllib.parse
                    city_name = dest.get("name", "")
                    query = urllib.parse.quote_plus(f"{hotel_name} {city_name} Sri Lanka")
                    url = f"https://www.booking.com/searchresults.html?ss={query}&checkin={checkin}&checkout={checkout}&group_adults=2&no_rooms=1&selected_currency=JPY"
                    
                    try:
                        page.goto(url, wait_until="domcontentloaded")
                        page.wait_for_timeout(2500)  # Wait a bit for Javascript to evaluate prices
                        
                        # Find all property cards on the page
                        cards = page.query_selector_all('div[data-testid="property-card"]')
                        matched = False
                        
                        for card in cards:
                            # Extract title of this specific card
                            title_el = card.query_selector('[data-testid="title"], h3[class*="title"], div[class*="title"]')
                            if title_el:
                                title_text = title_el.inner_text().strip()
                                if is_hotel_match(hotel_name, title_text):
                                    # We found a matching hotel card! Now extract the price from this card.
                                    price_element = None
                                    selectors = [
                                        'span[data-testid="price-and-discounted-price"]',
                                        'span[data-testid="price-display"]',
                                        '.bui-price-display__value',
                                        'div[data-testid="price-and-discounted-price"]',
                                        'span[class*="price"]',
                                        'div[class*="price"]'
                                    ]
                                    
                                    for sel in selectors:
                                        el = card.query_selector(sel)
                                        if el:
                                            price_element = el
                                            break
                                            
                                    if price_element:
                                        price_text = price_element.inner_text()
                                        digits = re.sub(r'[^\d]', '', price_text)
                                        if digits:
                                            twin_price = int(digits)
                                            single_price = int(round((twin_price * 0.75) / 500.0) * 500.0)
                                            group_total = (twin_price * 2) + single_price
                                            
                                            print(f"  ✨ MATCH FOUND ({title_text}): Twin: ¥{twin_price:,} | Single: ¥{single_price:,} | Total: ¥{group_total:,}")
                                            h["twin_room_price"] = twin_price
                                            h["single_room_price"] = single_price
                                            h["group_total_price"] = group_total
                                            h["yen_conversion_date"] = datetime.now().strftime("%Y-%m-%d")
                                            
                                            # Try to extract the real exterior image URL from the property card (Fallback)
                                            img_el = card.query_selector('img[data-testid="image"], img[class*="image"], img[src*="booking"]')
                                            if img_el:
                                                img_src = img_el.get_attribute("src")
                                                if img_src and img_src.startswith("http"):
                                                    if "images" not in h:
                                                        h["images"] = {}
                                                    h["images"]["exterior_image"] = img_src
                                            
                                            # --- DEEP SCRAPE FOR 4 REAL PHOTOS ---
                                            link_el = card.query_selector('a[data-testid="title-link"]')
                                            if link_el:
                                                hotel_url = link_el.get_attribute("href")
                                                if hotel_url:
                                                    full_url = hotel_url if hotel_url.startswith("http") else f"https://www.booking.com{hotel_url}"
                                                    h["verified_booking_url"] = full_url  # Save exact URL so the button always points directly to it
                                                    detail_page = context.new_page()
                                                    try:
                                                        detail_page.goto(full_url, wait_until="domcontentloaded", timeout=20000)
                                                        
                                                        real_photos = []
                                                        # Strategy 1: data-thumb-url on gallery anchors
                                                        gallery_imgs = detail_page.query_selector_all('a[data-thumb-url]')
                                                        for g_img in gallery_imgs:
                                                            src = g_img.get_attribute("data-thumb-url")
                                                            if src:
                                                                high_res = re.sub(r'max\d+', 'max1280x900', src)
                                                                high_res = re.sub(r'square\d+', 'max1280x900', high_res)
                                                                if high_res not in real_photos:
                                                                    real_photos.append(high_res)
                                                            if len(real_photos) >= 4:
                                                                break
                                                                
                                                        # Strategy 2: generic hotel images if strategy 1 fails
                                                        if len(real_photos) < 4:
                                                            imgs = detail_page.query_selector_all('img[src*="images/hotel"]')
                                                            for img in imgs:
                                                                src = img.get_attribute("src")
                                                                if src and ("max" in src or "square" in src):
                                                                    high_res = re.sub(r'max\d+', 'max1280x900', src)
                                                                    high_res = re.sub(r'square\d+', 'max1280x900', high_res)
                                                                    if high_res not in real_photos:
                                                                        real_photos.append(high_res)
                                                                if len(real_photos) >= 4:
                                                                    break
                                                                    
                                                        if "images" not in h:
                                                            h["images"] = {}
                                                        
                                                        if real_photos:
                                                            print(f"  📸 Scraped {len(real_photos)} real high-res photos!")
                                                            h["images"]["real_photos"] = real_photos
                                                        else:
                                                            print(f"  ⚠️ Could not find 4 gallery photos. Using search thumbnail fallback.")
                                                    except Exception as e:
                                                        print(f"  ⚠️ Deep scrape failed: {e}")
                                                    finally:
                                                        detail_page.close()
                                                        
                                            matched = True
                                            break
                        
                        if not matched:
                            print("  ⚠️ NO MATCH: Could not find any search results matching hotel name. Keeping local rate.")
                    except Exception as e:
                        print(f"  ❌ ERROR: {e}. Keeping local rate.")
                    
                    # Throttle delay to avoid rate limiting
                    page.wait_for_timeout(1000)
                    
                # Save progress back to JSON file per destination
                hotels_path = os.path.join(base_dir, "data", f"{dest_id}.json")
                with open(hotels_path, "w", encoding="utf-8") as f:
                    json.dump(hotels, f, ensure_ascii=False, indent=2)
                print(f"💾 Saved updated prices to {dest_id}.json")
                
            browser.close()
    except Exception as outer_e:
        print(f"❌ Failed to run Playwright scraper: {outer_e}")

def build_guide(fetch_live=False):
    # Setup paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    templates_dir = os.path.join(base_dir, "templates")
    assets_dir = os.path.join(base_dir, "assets")
    output_dir = os.path.join(base_dir, "output")

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    print("Loading itinerary and hotel data...")
    itinerary_path = os.path.join(data_dir, "itinerary.json")
    if not os.path.exists(itinerary_path):
        raise FileNotFoundError(f"Itinerary file not found at: {itinerary_path}")

    with open(itinerary_path, "r", encoding="utf-8") as f:
        destinations = json.load(f)

    # Load hotels for each destination from local JSON cache first
    for dest in destinations:
        dest_id = dest["id"]
        hotels_path = os.path.join(data_dir, f"{dest_id}.json")
        
        if os.path.exists(hotels_path):
            with open(hotels_path, "r", encoding="utf-8") as f:
                hotels = json.load(f)
            dest["hotels"] = hotels
        else:
            dest["hotels"] = []

    # Run Playwright scraper if explicitly requested
    if fetch_live:
        fetch_live_prices(destinations, base_dir)

    # Recalculate group totals and perform final verification on all loaded data
    for dest in destinations:
        for h in dest.get("hotels", []):
            expected_total = (h["twin_room_price"] * 2) + h["single_room_price"]
            if h["group_total_price"] != expected_total:
                h["group_total_price"] = expected_total

    # Read CSS styles
    css_path = os.path.join(assets_dir, "style.css")
    if not os.path.exists(css_path):
        raise FileNotFoundError(f"CSS styles file not found at: {css_path}")

    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()

    # Setup Jinja2 Environment
    print("Rendering templates...")
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template("base.html")

    generation_date = datetime.now().strftime("%B %d, %Y")
    
    html_output = template.render(
        destinations=destinations,
        css_content=css_content,
        usd_rate=USD_RATE,
        generation_date=generation_date
    )

    html_output_path = os.path.join(output_dir, "guide.html")
    with open(html_output_path, "w", encoding="utf-8") as f:
        f.write(html_output)
    print(f"HTML guide generated at: {html_output_path}")

    # Generate PDF using Playwright
    pdf_output_path = os.path.join(output_dir, "guide.pdf")
    print("Generating PDF via Playwright...")
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            
            # Use absolute path for file URL
            html_url = f"file:///{os.path.abspath(html_output_path).replace(os.sep, '/')}"
            page.goto(html_url)
            page.wait_for_load_state("networkidle")
            
            # Print page as A4 PDF with backgrounds enabled
            page.pdf(
                path=pdf_output_path,
                format="A4",
                print_background=True,
                margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
            )
            browser.close()
        print(f"PDF guide generated successfully at: {pdf_output_path}")
    except Exception as e:
        print(f"Error generating PDF: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sri Lanka Travel & Hotel Selection Guide Compiler")
    parser.add_argument("--fetch-live", action="store_true", help="Fetch live hotel prices from Booking.com via Playwright")
    args = parser.parse_args()
    
    build_guide(fetch_live=args.fetch_live)
