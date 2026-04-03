import Header from './Header'

export default function OutOfBoundsScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#F4EFE6',
    }}>
      <Header variant="outOfBounds" />

      {/* Accent line */}
      <div style={{
        width: 28,
        height: 2,
        backgroundColor: '#C9BEA8',
        marginLeft: 20,
        marginTop: 12,
      }} />

      {/* Centred content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0 20px',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          fontWeight: 500,
          color: '#7A6F5E',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          margin: '0 0 12px',
        }}>
          Geen resultaat
        </p>
        <p style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 20,
          lineHeight: 1.4,
          color: '#1A1410',
          margin: '0 0 10px',
        }}>
          Je rijdt buiten het gebied.
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 400,
          color: '#7A6F5E',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Op Weg werkt op de E17 en A1, richting Parijs. Tot zo.
        </p>
      </div>
    </div>
  )
}
