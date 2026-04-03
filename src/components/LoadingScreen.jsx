import Header from './Header'

function Skeleton({ width, height, style = {} }) {
  return (
    <div style={{
      width,
      height,
      backgroundColor: '#E0D9CC',
      borderRadius: 4,
      animation: 'pulse 1.8s ease-in-out infinite',
      ...style,
    }} />
  )
}

export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#F4EFE6',
    }}>
      <Header variant="loading" />

      {/* Accent line skeleton */}
      <div style={{
        width: 28,
        height: 2,
        backgroundColor: '#E0D9CC',
        marginLeft: 20,
        marginTop: 12,
        animation: 'pulse 1.8s ease-in-out infinite',
      }} />

      {/* Editorial note skeleton */}
      <div style={{
        flex: 1,
        padding: '20px 20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <Skeleton width="100%" height={17} />
        <Skeleton width="92%" height={17} />
        <Skeleton width="85%" height={17} />
        <Skeleton width="70%" height={17} />
      </div>

      {/* Divider skeleton */}
      <div style={{
        height: 0.5,
        backgroundColor: '#C9BEA8',
        marginLeft: 20,
        marginRight: 20,
      }} />

      {/* Restaurant info skeleton */}
      <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton width={140} height={13} />
        <Skeleton width={100} height={11} />
        <Skeleton width={80} height={11} />
      </div>

      {/* Buttons skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        padding: '16px 20px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
      }}>
        <Skeleton width="100%" height={44} style={{ borderRadius: 6 }} />
        <Skeleton width="100%" height={44} style={{ borderRadius: 6 }} />
      </div>
    </div>
  )
}
