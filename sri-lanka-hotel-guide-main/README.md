# Sri Lanka Travel & Hotel Selection Guide Generator

A reusable, bilingual (English + Japanese) brochure generator built with Python, Jinja2, and Playwright. It reads structured travel itinerary and hotel options from JSON files and renders a beautiful, mobile-friendly HTML guide and a print-ready A4 PDF brochure.

## Features

- **Bilingual Design**: English and Japanese labels for all components.
- **Automated Pricing**: Calculates group pricing based on 2 Twin Rooms + 1 Single Room for a group of 5. Converts JPY to USD dynamically.
- **Visual Budget Tiers**: Separates and highlights Premium (gold), Standard (blue), and Economy (teal) hotel selections.
- **Bawa-inspired Aesthetics**: Clean modern typography (`Outfit` + `Noto Sans JP`), responsive grids, elegant icons, and glassmorphism.
- **Print Optimization**: Explicit CSS rules for A4 page breaks, preventing card splitting across pages.

## Directory Structure

```text
sri lanka hotel guide/
├── data/                    # JSON data files
│   ├── itinerary.json       # Trip stops and route descriptions
│   ├── colombo_arrival.json # Hotels for Colombo (Arrival) stop
│   ├── sigiriya.json        # Hotels for Sigiriya stop
│   └── ...                  # Other destination hotel files
├── templates/               # HTML templates
│   ├── base.html            # Main wrapper skeleton
│   ├── cover.html           # Document cover page
│   ├── how_to_use.html      # Guidelines page
│   ├── destination.html     # Layout for a single stop
│   └── hotel_card.html      # Individual hotel card component
├── assets/
│   └── style.css            # Custom CSS styles (grid, tiers, print breaks)
├── scripts/
│   ├── generate_data.py     # Script to generate full hotel database
│   └── build.py             # Compiler script rendering HTML & PDF
├── output/                  # Generated files
│   ├── guide.html           # Responsive HTML guide
│   └── guide.pdf            # PDF brochure (A4)
└── README.md
```

## How to Run

1. **Install Dependencies**:
   Ensure Python 3.10+ is installed, then run:
   ```bash
   pip install jinja2 playwright
   python -m playwright install chromium
   ```

2. **Generate the Guide**:
   Run the build script to compile the templates and data into HTML and PDF outputs:
   ```bash
   python scripts/build.py
   ```
   Outputs will be saved in the `output/` directory.

3. **Re-generating Data Files**:
   To reset or rebuild the sample database of 72 hotels:
   ```bash
   python scripts/generate_data.py
   ```

## Reusable System

To adapt this system for another country or trip:
1. Edit `data/itinerary.json` with the new route details, dates, and stops.
2. Create/update `{stop_id}.json` files in the `data/` directory matching the IDs in `itinerary.json`.
3. Run `python scripts/build.py` to compile the new guide.
