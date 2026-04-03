import { useState } from 'react'
import Header from './Header'

function priceSymbol(n) {
  if (!n) return ''
  return '€'.repeat(n)
}

function extractCity(address) {
  const parts = address.split(',')
  return parts[parts.length - 1].trim()
}

export default function RecommendationScreen({ restaurant }) {
  const [navigeerPressed, setNavigeerPressed] = useState(false)
  const [belPressed, setBelPressed] = useState(false)

  const city = extractCity(restaurant.address)
  const price = priceSymbol(restaurant.price_range)
  const cityPrice = [city, price].filter(Boolean).join(' · ')
  const detour = Math.round(restaurant.detour_minutes)
  const mapsUrl = `https://maps.google.com/?q=${restaurant.lat},${restaurant.lng}`

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#F4EFE6',
    }}>
      <Header variant="active" />

      {/* Accent line */}
      <div style={{
        width: 28,
        height: 2,
        backgroundColor: '#1A1410',
        marginLeft: 20,
        marginTop: 12,
      }} />

      {/* Editorial note */}
      <div style={{
        flex: 1,
        padding: '20px 20px 16px',
        display: 'flex',
        alignItems: 'flex-start',
      }}>
        <p style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 17,
          lineHeight: 1.55,
          color: '#1A1410',
          margin: 0,
        }}>
          {restaurant.editorial_note || '\u00A0'}
        </p>
      </div>

      {/* Divider */}
      <div style={{
        height: 0.5,
        backgroundColor: '#C9BEA8',
        marginLeft: 20,
        marginRight: 20,
      }} />

      {/* Restaurant info */}
      <div style={{ padding: '14px 20px 0' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: '#1A1410',
          lineHeight: 1.4,
          margin: 0,
        }}>
          {restaurant.name}
        </p>
        {cityPrice && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 400,
            color: '#7A6F5E',
            lineHeight: 1.5,
            margin: '2px 0 0',
          }}>
            {cityPrice}
          </p>
        )}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 400,
          color: '#7A6F5E',
          lineHeight: 1.5,
          margin: '2px 0 0',
        }}>
          +{detour} min h&amp;t
        </p>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        padding: '16px 20px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
      }}>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onPointerDown={() => setNavigeerPressed(true)}
          onPointerUp={() => setNavigeerPressed(false)}
          onPointerLeave={() => setNavigeerPressed(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 44,
            backgroundColor: navigeerPressed ? '#2C2418' : '#1A1410',
            color: '#F4EFE6',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            borderRadius: 6,
            letterSpacing: '0.01em',
            transition: 'background-color 0.1s',
          }}
        >
          Navigeer
        </a>

        {restaurant.phone ? (
          <a
            href={`tel:${restaurant.phone}`}
            onPointerDown={() => setBelPressed(true)}
            onPointerUp={() => setBelPressed(false)}
            onPointerLeave={() => setBelPressed(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 44,
              backgroundColor: belPressed ? '#F4EFE6' : '#FFFFFF',
              color: '#1A1410',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              borderRadius: 6,
              border: '1.5px solid #1A1410',
              letterSpacing: '0.01em',
              transition: 'background-color 0.1s',
            }}
          >
            Bel
          </a>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 44,
            backgroundColor: '#FFFFFF',
            color: '#C9BEA8',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 6,
            border: '1.5px solid #C9BEA8',
            letterSpacing: '0.01em',
          }}>
            Bel
          </div>
        )}
      </div>
    </div>
  )
}
