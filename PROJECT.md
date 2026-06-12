# Op Weg — Project Brief

## The Problem

Als je wegrijdt naar vakantie, dan komt er vroeg of laat dat moment dat je bij McDonald's gaat eten. Wil je dat? Niet echt, maar dat is nou eenmaal wat je én en route kan vinden, én waarvan je weet wat je krijgt — dat het überhaupt open is bijvoorbeeld.

Wie willen dit? Ouders uit Haarlem, onderweg naar Frankrijk. Die zijn rond lunchtijd op de Belgische E17 of de Franse A1. Wat willen ze dan? Iets leuks, lokaal, dat open is (halszaak). Chiquer dan McDonald's, maar minder chic dan de Gault Milau (de kinderen blijven nooit zo lang stil zitten). Oh, en niet meer dan 20 minuten omrijden.

Hoe kunnen we dat regelen? Een app met maar één knop, of zelfs nul. Makkelijk.

---

## Brand

**Luxe volgens kakkers. Niet Gucci maar een Volvo V40.**

The target user is a Dutch dual-income family. They have taste, they have standards, they are not flashy about it. They want things that work, look good, and don't require explanation. The app should feel the same way.

### Story

Ooit was ik in Viareggio met mijn (toen nog niet) vrouw. Voor lokale begrippen waar we belachelijk vroeg uit eten (20:00?) en we kwamen bij een klein oud-bruin trattoriaatje. We waren tot vrijwel de enigen, en het enige personeel dat we gezien hebben was de chefkok/eigenaar (compleet met witte koksmuts). We hebben geen menukaart gezien, en we hebben nooit meer zo lekker gegeten. Dat is vakantie. 

Ik ga met plezier naar een sterrenrestaurant, en soms met hetzelfde plezier naar de Burger King. Er is een tijd en plaats voor dat soort dingen. En 

Bij mij om de hoek ken ik dit soort plekken: twee straten verderop woont een ouder Indisch echtpaar. Ze lopen altijd op sloffen, ze kijken TV op plastic tuinstoelen in de huiskamer achter hun toko, en als ik binnenkom dan noemen ze me bij de voornaam van mijn jongste dochter en de lievelingssaus van mijn vrouw hebben ze dan al onder toonbank staan. Ietsje verderop staat staat een ouderwetste keet op een pleintje. Ik zou niet verbaasd zijn als die daar naar toe is gebracht met paard en wagen. Erin werkt een stel dat 35 of 55 zou kunnen zijn, en die werken samen als een machine. De man heeft klauwen als kolenschoppen, waar hij 200 kilo aardappelen op een dag mee schilt. De vrouw zag ik laatst een jack teruggeven aan een klant die hij twee weken geleden als was vergeten - zij niet. 

Maar ik woon hier, jij woont daar, en we wonen niet op vakantie. 
Daarom is deze app er: op de eerste dag van de zomervakantie wil iedereen die chefkok/eigenaar met sloffen 200 kilo aardappelen. 

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
2. See one restaurant (or "you're out of bounds")
3. Tap **Call** or **Navigate**

No search. No filters. No list to scroll. The curation *is* the product.

---

## Algorithm

```
filter:  restaurant.km_marker > huidige_km          # niet gepasseerd
         reistijd + restaurant.detour_minutes ≤ 40  # binnen bereik
sort:    priority ascending                          # editor bepaalt volgorde
display: top 1
```

**Reistijd berekening:**

```python
SNELWEG_SNELHEID = 120  # km/u — vaste aanname, geen live data

def reistijd_minuten(huidige_km, restaurant):
    snelweg_minuten = (restaurant.km_marker - huidige_km) / SNELWEG_SNELHEID * 60
    return snelweg_minuten + restaurant.detour_minutes
```

**Ontwerpkeuzes:**

- **40 minuten** is het venster omdat dat is wat de gebruiker bedoelt als ze zeggen "ik wil nu stoppen" — niet 60 km, niet 30 km, maar een tijdsbeleving.
- **120 km/u** is de gemiddelde corridorsnelheid, niet de momentane. Betrouwbaarder dan live GPS-snelheid, die onnauwkeurig is in file of bij het openen van de app na een pauze.
- **Priority wint altijd** binnen het venster. Dichtstbijzijnde-eerst verplaatst de belofte van "wij weten wat goed is" naar "wij weten wat dichtbij is." Dat kan Google Maps ook.
- **Geen heading detectie** in MVP. De app werkt alleen richting Parijs; de out-of-bounds state vangt de terugweg op.

**Out-of-bounds state:** als geen restaurant aan de filtercriteria voldoet, toont de app expliciet "Je rijdt buiten het gebied of in de verkeerde richting." Dit is een gedefinieerde staat, geen fout.

---

## Data Model

```python
Restaurant(
    id:             uuid
    name:           str
    address:        str
    lat:            float
    lng:            float
    km_marker:      float   # position along E17/A1 corridor, vanaf Haarlem (52.39, 4.64)
    detour_minutes: int     # one-way from highway exit, set at curation time
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

**Rating drempel is 4.2, niet 4.0.** Geen enkel restaurant in de uiteindelijke selectie van 11 heeft een Google rating lager dan 4.2. In de eerste pipeline run werd gefilterd op ≥ 4.0 — dit kan in de volgende run aangescherpt worden.

---

## Curation Learnings

From the first manual review pass of ~50 Google Places candidates:

**Parking as a rurality proxy.** Free street parking in the Google object strongly correlates with being outside a city centre. Useful as a pipeline filter — possibly more reliable than the city centre radius approach.

**Snackbar noise.** Many candidates were pizza places and snackbars. Google's "Snelle hap" type tag is the most reliable filter for snackbars — better than `meal_takeaway` alone. Some pizza places may make the final cut if the vibe is right.

**Price level 2 is the sweet spot.** Level 1 = snackbar territory. Level 3+ = too formal for kids and a highway lunch stop. Filter hard on `price_level == 2` in future pipeline runs. Note that price level is often missing from the Google object — absence is not disqualifying, but presence of level 1 or 3+ is a strong signal to exclude.

---

## Bekende beperkingen (MVP)

- **Rijrichting**: de app werkt alleen richting Parijs (km oplopend). Rijdt de gebruiker terug richting Nederland, dan zijn er geen resultaten. De out-of-bounds state vangt dit op: "Je rijdt buiten het gebied of in de verkeerde richting." Post-MVP op te lossen via GPS heading detectie.

- **Nulpunt is Haarlem** (52.39, 4.64) — alle km_markers zijn berekend vanaf dit punt. De app moet de huidige positie van de gebruiker altijd uitdrukken als km vanaf datzelfde nulpunt, via dezelfde route.

- **Route moet deterministisch zijn** — OSRM kan op een andere dag een andere route teruggeven (file, omleiding, gewijzigde wegdata). De route is daarom eenmalig vastgelegd als een vaste polyline in de productie database en wordt niet runtime herberekend. De km_markers zijn alleen geldig zolang deze vaste route gebruikt wordt.

- **Snelheidsaanname is 120 km/u** — reistijd naar een restaurant wordt berekend op basis van een vaste snelweg snelheid, niet de momentane GPS snelheid. Momentane snelheid is onbetrouwbaar in file of direct na het openen van de app na een pauze.

---

## Open Questions (Post-MVP)

- Rotating algorithm to avoid showing regulars the same restaurant every trip
- Extending the corridor (NL → south of Paris)
- Community submissions with editorial approval
- Seasonal data refresh automation
- Admin tool for managing the restaurant list (add, edit, deactivate, update hours)
- GPS heading detectie voor rijrichting (terugweg)
- Uitgebreide pipeline met subboxen: splits elke corridorbox op in een 2×2 grid van kleinere zoekopdrachten (max 240 candidates per box in plaats van 60) voor betere dekking, gecombineerd met geautomatiseerde filtering op basis van geleerde criteria: rating ≥ 4.2, price_level == 2, uitsluiting van "Snelle hap", vrij parkeren als proxy voor ligging buiten stadscentrum
