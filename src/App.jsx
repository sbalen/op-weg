import { useState, useEffect } from 'react'
import { getKmMarker } from './utils/corridor'
import restaurants from './data/restaurants.json'
import RecommendationScreen from './components/RecommendationScreen'
import OutOfBoundsScreen from './components/OutOfBoundsScreen'
import LoadingScreen from './components/LoadingScreen'

function findRecommendation(userLat, userLng) {
  const km = getKmMarker(userLat, userLng)

  const candidates = restaurants
    .filter(r => r.active && r.km_marker > km && r.detour_minutes <= 20)
    .sort((a, b) => a.priority - b.priority)

  return candidates[0] ?? null
}

export default function App() {
  const [status, setStatus] = useState('loading') // 'loading' | 'found' | 'outOfBounds'
  const [restaurant, setRestaurant] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const lat = parseFloat(params.get('lat'))
    const lng = parseFloat(params.get('lng'))

    if (!isNaN(lat) && !isNaN(lng)) {
      const result = findRecommendation(lat, lng)
      setRestaurant(result ?? null)
      setStatus(result ? 'found' : 'outOfBounds')
      return
    }

    if (!navigator.geolocation) {
      setStatus('outOfBounds')
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const result = findRecommendation(coords.latitude, coords.longitude)
        if (result) {
          setRestaurant(result)
          setStatus('found')
        } else {
          setStatus('outOfBounds')
        }
      },
      () => {
        setStatus('outOfBounds')
      },
      { timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  if (status === 'loading') return <LoadingScreen />
  if (status === 'found') return <RecommendationScreen restaurant={restaurant} />
  return <OutOfBoundsScreen />
}
