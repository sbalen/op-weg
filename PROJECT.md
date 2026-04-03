# Op Weg — Project Brief

## The Problem

Als je wegrijdt naar vakantie, dan komt er vroeg of laat dat moment dat je bij McDonald's gaat eten. Wil je dat? Niet echt, maar dat is nou eenmaal wat je én en route kan vinden, én waarvan je weet wat je krijgt — dat het überhaupt open is bijvoorbeeld.

Wie willen dit? Ouders uit Haarlem, onderweg naar Frankrijk. Die zijn rond lunchtijd op de Belgische E17 of de Franse A1. Wat willen ze dan? Iets leuks, lokaal, dat open is (halszaak). Chiquer dan McDonald's, maar minder chic dan de Gault Milau (de kinderen blijven nooit zo lang stil zitten). Oh, en niet meer dan 20 minuten omrijden.

Hoe kunnen we dat regelen? Een app met maar één knop, of zelfs nul. Makkelijk.

---

## Brand

**Luxe volgens kakkers. Niet Gucci maar een Volvo V40.**

The target user is a Dutch dual-income family. They have taste, they have standards, they are not flashy about it. They want things that work, look good, and don't require explanation. The app should feel the same way.

The authority in this product is the authority of the sommelier — not the Michelin inspector. The sommelier has been there, tasted it, and hands you the bottle without over-explaining. Warm, experienced, confident. Never a list, never a hedge.

---

## Brand Values

Four values, in order of priority:

1. **Competence** — we are always right, we never hedge. One recommendation. No alternatives. No "also consider."
2. **Clarity** — one answer, no noise. Every design decision removes a choice from the user.
3. **Understated quality** — Volvo, not Gucci. Good taste without performance.
4. **Anticipation** — this stop will be worth it. The promise that the detour becomes a memory.

These four values are the filter for every product and design decision.

---

## Target User

- Dutch couple, dual income, kids in the back
- Leaving from the Netherlands, heading to France for vacation
- On the E17 (Belgium) or A1 (France) around lunchtime
- Not looking to discover — looking to **decide**
- Trust is everything: if the app says go, they go

---

## Product

A mobile PWA that does one thing: tells you where to have lunch, right now, on your route.

**Core interaction:**
1. Open the app
2. See one restaurant (or "you're out of range")
3. Tap **Navigeer** or **Bel**

No search. No filters. No list to scroll. The curation *is* the product.

---

## Algorithm

```
filter:  active == true, km_marker > current position, detour_minutes <= 20
sort:    priority ascending (lower = shown first)
display: top 1
```

If no results: show out-of-bounds state. This is a defined, graceful state — not an error.

---

## Data Model

```python
Restaurant(
    id:             uuid
    name:           str
    address:        str
    lat:            float
    lng:            float
    km_marker:      float   # position along E17/A1 corridor from Haarlem origin
    detour_minutes: int     # round trip from highway exit, set at curation time
    priority:       int     # editor-controlled sort order; lower = shown first
    price_range:    int     # 1=€  2=€€  3=€€€
    editorial_note: str     # "why stop here" — the soul of the record
    phone:          str
    website:        str
    opening_hours:  dict    # {mon: "12-14", tue: null, ...} — verified by phone
    verified_date:  date
    active:         bool
)
```

---

## Geographic Scope (MVP)

**Corridor:** E17 (Gent → Lille) + A1 (Lille → Paris)
**Coverage:** ~300 km, roughly 10–15 km either side of the highway
**Origin/nulpunt:** Haarlem (52.3874, 4.6462) — all km_markers calculated from this point

**Target dataset size: 15–20 restaurants**

Small enough to curate properly — by hand, in person. You can call every restaurant on the list in an afternoon to verify hours. You can visit all of them over a weekend on the way down. Every editorial note comes from actual experience, not a Google review.

> The Michelin guide started as a practical tool for drivers on the road — not a fine dining bible. It told you where to stop, where to sleep, where to eat. Useful, trusted, curated by people who had actually been there. That is what this is.

Post-MVP: extend corridor north (NL) and south (deeper into France).

---

## Design System

### Typography

| Role | Font | Usage |
|---|---|---|
| Wordmark / logomark | IM Fell English | Brand identity only |
| Editorial note | DM Serif Display | The restaurant's "why" — the voice of the product |
| All functional text | DM Sans 400/500 | Names, metadata, buttons, labels |

Two weights only: 400 regular, 500 medium. Never 600 or 700.

### Colour Palette

| Name | Hex | Usage |
|---|---|---|
| Parchment | `#F4EFE6` | App background |
| Near-black | `#1A1410` | Primary text, buttons, accent line |
| Sand-dark | `#2C2418` | Status bar text |
| Sand-mid | `#7A6F5E` | Secondary text, metadata |
| Sand-light | `#C9BEA8` | Dividers, muted states |
| Sand-pale | `#E0D9CC` | Skeleton/loading elements |
| White | `#FFFFFF` | Secondary button fill |

### Logo Mark

The O/W mark: the letters O and W from IM Fell English, separated by a forward slash `/` at slightly reduced size and opacity.

- **Active state**: parchment `#F4EFE6` on near-black `#1A1410` rounded square (border-radius ~6px at 28px)
- **Out of bounds state**: parchment on sand-light `#C9BEA8` square
- **Loading state**: pulsing, muted — same as skeleton elements

The slash is set at ~75% the size of the O and W, with reduced opacity (0.6), so it reads as notation rather than competing with the letters.

### Accent Line

A 2px × 28px horizontal rule below the header. Colour communicates state:
- Active: `#1A1410`
- Out of bounds: `#C9BEA8`
- Loading: `#E0D9CC`

---

## Screens

### 1. Recommendation (main screen)

Layout top to bottom:
- **Header**: time (left) · O/W logomark (right)
- **Accent line**
- **Editorial note** — DM Serif Display 17px, line-height 1.5, fills available space
- **Divider** — 0.5px sand-light
- **Restaurant name** — DM Sans 500 13px
- **City · €€** — DM Sans 400 11px, sand-mid, on its own line
- **+N min h&t** — DM Sans 400 11px, sand-mid, on its own line (round trip detour)
- **Buttons** — two-column grid
  - Navigeer: `#1A1410` fill, white text — opens `https://maps.google.com/?q=lat,lng`
  - Bel: white fill, `#1A1410` 1.5px border — opens `tel:` link
  - Hover states via JS event listeners (CSS hover overridden by host environment)

### 2. Out of Bounds

Layout:
- **Header**: time · O/W mark (sand-light fill)
- **Accent line** (sand-light)
- **Vertically centred content**:
  - Label: "Geen resultaat" — DM Sans 500, 10px, uppercase, tracked, sand-mid
  - Message: "Je rijdt buiten het gebied." — DM Serif Display 20px
  - Sub: "Op Weg werkt op de E17 en A1, richting Parijs. Tot zo." — DM Sans 400 12px, sand-mid

### 3. Loading

Skeleton screen that mirrors the exact layout of the recommendation screen. All elements replaced with `#E0D9CC` rounded rectangles, pulsing via JS opacity animation. Logo mark also pulses. When content loads, snaps into place with no layout shift.

---

## Tech Stack (MVP)

| Layer | Choice | Notes |
|---|---|---|
| Framework | React (Vite) | Fast, PWA-ready |
| Data | Static JSON | `/src/data/restaurants.json` — no backend |
| Hosting | Vercel | Connected to GitHub repo, free tier |
| Fonts | Google Fonts | IM Fell English, DM Serif Display, DM Sans |
| Location | Browser Geolocation API | No dependency needed |

---

## Dataset Pipeline

```
Google Places API → candidate scrape (bounded by corridor bbox)
        ↓
Editor review (Excel export) → approve / reject / set priority / write editorial note
        ↓
restaurants.json
```

Data is **static**, updated manually a few times per year.
Freshness strategy: `verified_date` field + seasonal review cycle.

---

## MVP Scope

| In | Out |
|---|---|
| GPS-based corridor detection | User accounts |
| Single restaurant recommendation | Reviews or ratings |
| Navigeer button (Google Maps) | Cuisine filtering |
| Bel button (tel: link) | Community curation |
| Out-of-bounds state | Real-time hours API |
| Loading/skeleton state | Multi-language |
| PWA (installable, mobile-optimised) | App Store distribution |

---

## Curation Learnings

**Rating drempel is 4.2, niet 4.0.** Geen enkel restaurant in de uiteindelijke selectie van 11 heeft een Google rating lager dan 4.2.

**Parking as a rurality proxy.** Free street parking in the Google object strongly correlates with being outside a city centre.

**Snackbar noise.** Google's "Snelle hap" type tag is the most reliable filter for snackbars.

**Price level 2 is the sweet spot.** Level 1 = snackbar territory. Level 3+ = too formal for kids and a highway lunch stop.

---

## Bekende beperkingen (MVP)

- **Rijrichting**: de app werkt alleen richting Parijs (km oplopend). Rijdt de gebruiker terug richting Nederland, dan zijn er geen resultaten. De out-of-bounds state vangt dit op.
- **Nulpunt is Haarlem** (52.3874, 4.6462) — alle km_markers zijn berekend vanaf dit punt via een vaste route.
- **Route moet deterministisch zijn** — de route is eenmalig vastgelegd als een vaste polyline. De km_markers zijn alleen geldig zolang deze vaste route gebruikt wordt.

---

## Open Questions (Post-MVP)

- Rotating algorithm to avoid showing regulars the same restaurant every trip
- Photo support (V2) — photo leads the card above the editorial note
- Extending the corridor (NL → south of Paris)
- Community submissions with editorial approval
- Seasonal data refresh automation
- Admin tool for managing the restaurant list
- App Store distribution (React Native port)
- International expansion beyond NL/BE corridor
