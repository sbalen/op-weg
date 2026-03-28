# Op Weg — Project Brief

## The Problem

Als je wegrijdt naar vakantie, dan komt er vroeg of laat dat moment dat je bij McDonald's gaat eten. Wil je dat? Niet echt, maar dat is nou eenmaal wat je én en route kan vinden, én waarvan je weet wat je krijgt — dat het überhaupt open is bijvoorbeeld.

Wie willen dit? Ouders uit Haarlem, onderweg naar Frankrijk. Die zijn rond lunchtijd op de Belgische E17 of de Franse A1. Wat willen ze dan? Iets leuks, lokaal, dat open is (halszaak). Chiquer dan McDonald's, maar minder chic dan de Gault Milau (de kinderen blijven nooit zo lang stil zitten). Oh, en niet meer dan 20 minuten omrijden.

Hoe kunnen we dat regelen? Een app met maar één knop, of zelfs nul. Makkelijk.

---

## Brand

**Luxe volgens kakkers. Niet Gucci maar een Volvo V40.**

The target user is a Dutch dual-income family. They have taste, they have standards, they are not flashy about it. They want things that work, look good, and don't require explanation. The app should feel the same way.

---

## Target User

- Dutch couple, dual income, kids in the back
- Leaving from the Netherlands, heading to France for vacation
- On the E17 (Belgium) or A1 (France) around lunchtime
- Not looking to discover — looking to **decide**
- Trust is everything: if the app says go, they go

---

## Product

A mobile app that does one thing: tells you where to have lunch, right now, on your route.

**Core interaction:**
1. Open the app
2. See one restaurant (or "you're out of range")
3. Tap **Call** or **Navigate**

No search. No filters. No list to scroll. The curation *is* the product.

---

## Algorithm

```
filter:  restaurants ahead on corridor, within 60 min of current position
sort:    editor priority (ascending)
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
    km_marker:      float   # position along E17/A1 corridor
    detour_minutes: int     # one-way from highway exit, set at curation time
    priority:       int     # editor-controlled sort order; lower = shown first
    price_range:    int     # 1=€  2=€€  3=€€€
    editorial_note: str     # "why stop here" — the soul of the record
    phone:          str
    website:        str
    opening_hours:  dict    # {mon: "12-14", tue: null, ...}
    verified_date:  date
    active:         bool
)
```

---

## Geographic Scope (MVP)

**Corridor:** E17 (Gent → Lille) + A1 (Lille → Paris)
**Coverage:** ~300 km, roughly 10–15 km either side of the highway

**Target dataset size: 15–20 restaurants**

Small enough to curate properly — by hand, in person. You can call every restaurant on the list in an afternoon to verify hours. You can visit all of them over a weekend on the way down. Every editorial note comes from actual experience, not a Google review.

This is not a dataset. It is a personal recommendation list. Which is exactly what the brand promises.

> The Michelin guide started as a practical tool for drivers on the road — not a fine dining bible. It told you where to stop, where to sleep, where to eat. Useful, trusted, curated by people who had actually been there. That is what this is.

Post-MVP: extend corridor north (NL) and south (deeper into France).

---

## Dataset Pipeline

```
Google Places API → candidate scrape (bounded by corridor bbox)
        ↓
Claude API → pre-score candidates against target audience profile
        ↓
Editor review UI → approve / reject / set priority / write editorial note
        ↓
Production DB
```

Data is **static**, updated manually a few times per year.
Freshness strategy: verified_date field + seasonal review cycle.

---

## MVP Scope

| In | Out |
|---|---|
| GPS-based corridor detection | User accounts |
| Single restaurant recommendation | Reviews or ratings |
| Call button | Cuisine filtering |
| Google Maps navigation button | Community curation |
| Out-of-bounds state | Real-time hours API |
| Editor admin / curation UI | Multi-language |

---

## Open Questions (Post-MVP)

- Rotating algorithm to avoid showing regulars the same restaurant every trip
- Extending the corridor (NL → south of Paris)
- Community submissions with editorial approval
- Seasonal data refresh automation
