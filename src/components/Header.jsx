import { useState, useEffect } from 'react'

function formatTime(date) {
  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
}

const VARIANTS = {
  active: {
    bg: '#1A1410',
    text: '#F4EFE6',
    slashOpacity: 0.6,
  },
  outOfBounds: {
    bg: '#C9BEA8',
    text: '#F4EFE6',
    slashOpacity: 0.5,
  },
  loading: {
    bg: '#E0D9CC',
    text: '#E0D9CC',
    slashOpacity: 0,
  },
}

export default function Header({ variant = 'active' }) {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  const v = VARIANTS[variant]
  const isPulsing = variant === 'loading'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px 0',
    }}>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 400,
        color: isPulsing ? 'transparent' : (variant === 'active' ? '#1A1410' : '#C9BEA8'),
        letterSpacing: '0.02em',
        animation: isPulsing ? 'pulse 1.8s ease-in-out infinite' : 'none',
        backgroundColor: isPulsing ? '#E0D9CC' : 'transparent',
        borderRadius: isPulsing ? 4 : 0,
        padding: isPulsing ? '2px 8px' : 0,
      }}>
        {time}
      </span>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        backgroundColor: v.bg,
        borderRadius: 6,
        animation: isPulsing ? 'pulse 1.8s ease-in-out infinite' : 'none',
        userSelect: 'none',
      }}>
        <span style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: 13,
          color: v.text,
          lineHeight: 1,
        }}>O</span>
        <span style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: 10,
          color: v.text,
          opacity: v.slashOpacity,
          lineHeight: 1,
          margin: '0 1px',
        }}>/</span>
        <span style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: 13,
          color: v.text,
          lineHeight: 1,
        }}>W</span>
      </div>
    </div>
  )
}
