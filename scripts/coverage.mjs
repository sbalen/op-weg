import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const restaurants = JSON.parse(readFileSync(join(__dirname, '../src/data/restaurants.json'), 'utf8'))
const route = JSON.parse(readFileSync(join(__dirname, '../data/production/route.json'), 'utf8'))

const HIGHWAY_SPEED_KMH = 120
const MAX_TOTAL_MINUTES = 40

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Build cumulative km index over the full route polyline
const coords = route.coords
const routeWithKm = []
let cum = 0
for (let i = 0; i < coords.length - 1; i++) {
  routeWithKm.push({ lat: coords[i][0], lng: coords[i][1], km: cum })
  cum += haversineKm(coords[i][0], coords[i][1], coords[i + 1][0], coords[i + 1][1])
}
routeWithKm.push({ lat: coords[coords.length - 1][0], lng: coords[coords.length - 1][1], km: cum })
const totalRoute = cum

// Simplified polyline for km_marker projection (sampled from full route)
const ROUTE = routeWithKm.filter((_, i) => i % 55 === 0).map(p => [p.lat, p.lng])
if (ROUTE[ROUTE.length - 1] !== routeWithKm[routeWithKm.length - 1]) {
  ROUTE.push([routeWithKm[routeWithKm.length - 1].lat, routeWithKm[routeWithKm.length - 1].lng])
}

function getKmMarker(userLat, userLng) {
  let bestDist = Infinity
  let bestKm = 0
  let cumKm = 0
  for (let i = 0; i < ROUTE.length - 1; i++) {
    const [lat1, lng1] = ROUTE[i]
    const [lat2, lng2] = ROUTE[i + 1]
    const segLen = haversineKm(lat1, lng1, lat2, lng2)
    const dx = lat2 - lat1, dy = lng2 - lng1
    const len2 = dx * dx + dy * dy
    let t = len2 > 0 ? ((userLat - lat1) * dx + (userLng - lng1) * dy) / len2 : 0
    t = Math.max(0, Math.min(1, t))
    const dist = haversineKm(userLat, userLng, lat1 + t * dx, lng1 + t * dy)
    if (dist < bestDist) { bestDist = dist; bestKm = cumKm + t * segLen }
    cumKm += segLen
  }
  return bestKm
}

function totalMinutes(userKm, r) {
  return (r.km_marker - userKm) / HIGHWAY_SPEED_KMH * 60 + r.detour_minutes
}

function findRecommendation(lat, lng) {
  const km = getKmMarker(lat, lng)
  const candidates = restaurants
    .filter(r => r.active && r.km_marker > km && totalMinutes(km, r) <= MAX_TOTAL_MINUTES)
    .sort((a, b) => a.priority - b.priority)
  return { km, result: candidates[0] ?? null }
}

// --- Run coverage test every 5 km ---
console.log('Coverage test — every 5 km along the corridor\n')

let prev = null
const gaps = []

for (let targetKm = 0; targetKm <= totalRoute; targetKm += 5) {
  const pt = routeWithKm.reduce((a, b) =>
    Math.abs(b.km - targetKm) < Math.abs(a.km - targetKm) ? b : a)
  const { km, result } = findRecommendation(pt.lat, pt.lng)
  const name = result?.name ?? null

  if (!name) gaps.push({ targetKm: Math.round(targetKm), lat: pt.lat.toFixed(4), lng: pt.lng.toFixed(4) })

  if (name !== prev) {
    const label = name ?? '--- NO RESULT ---'
    console.log(`km ${String(Math.round(targetKm)).padStart(3)}: ${label}`)
    prev = name
  }
}

console.log()
if (gaps.length === 0) {
  console.log('No gaps — full coverage.')
} else {
  // Summarise as ranges rather than listing every 5 km point
  const ranges = []
  let rangeStart = gaps[0].targetKm
  let rangeEnd = gaps[0].targetKm
  for (let i = 1; i < gaps.length; i++) {
    if (gaps[i].targetKm <= rangeEnd + 5) {
      rangeEnd = gaps[i].targetKm
    } else {
      ranges.push([rangeStart, rangeEnd])
      rangeStart = rangeEnd = gaps[i].targetKm
    }
  }
  ranges.push([rangeStart, rangeEnd])

  console.log(`Gaps (${ranges.length} stretch${ranges.length === 1 ? '' : 'es'}):`)
  ranges.forEach(([start, end]) => {
    const label = start === end ? `km ${start}` : `km ${start}–${end}`
    console.log(`  ${label}`)
  })
}
