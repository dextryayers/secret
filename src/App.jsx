import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Welcome from './pages/Welcome'
import Card from './pages/Card'
import Camera from './pages/Camera'

function Protected({ children }) {
  const { authed } = useAuth()
  const [count, setCount] = useState(15)
  const location = useLocation()

  useEffect(() => {
    if (!authed && count > 0) {
      const t = setTimeout(() => setCount(count - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [authed, count])

  if (!authed) {
    if (count === 0) return <Navigate to="/" state={{ from: location }} replace />
    return <ForbiddenPage count={count} />
  }

  return children
}

function ForbiddenPage({ count }) {
  const pct = count / 15 * 100
  return (
    <div style={f9.p}>
      <div style={f9.deco}>
        {[
          { t: '8%', l: '-5%', w: '160', h: '160', d: '0s' },
          { t: '55%', l: '82%', w: '180', h: '180', d: '2s' },
          { t: '70%', l: '-3%', w: '120', h: '120', d: '4s' },
          { t: '20%', l: '85%', w: '140', h: '140', d: '1s' },
        ].map((o, i) => (
          <div key={i} style={{ ...f9.ob, top: o.t, left: o.l, width: o.w+'px', height: o.h+'px', animationDelay: o.d }} />
        ))}
      </div>

      <div style={f9.w}>
        <div style={f9.c}>
          <div style={f9.bar}>
            <div style={f9.dots}>
              {['#ff5f57','#ffbd2e','#28c840'].map((c,i) => (
                <div key={i} style={{ ...f9.dt, background: c, animationDelay: `${i*0.12}s` }} />
              ))}
            </div>
            <div style={f9.id} />
          </div>

          <div style={f9.icon}>🔒</div>
          <h1 style={f9.hh}>403</h1>
          <p style={f9.t1}>Akses Ditolak</p>
          <p style={f9.t2}>Selesaikan kode di kalkulator dulu~</p>

          <div style={f9.pbw}>
            <div style={{ ...f9.pb, width: `${pct}%` }} />
          </div>

          <div style={f9.cntw}>
            <span style={f9.cnt}>{count}</span>
            <span style={f9.cntl}>detik</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pu{
          0%{transform:scale(0.35) translateY(30px);opacity:0}
          100%{transform:scale(1) translateY(0);opacity:1}
        }
        @keyframes or{
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(25px,-20px) scale(1.08)}
          66%{transform:translate(-12px,15px) scale(0.92)}
        }
        @keyframes bk{
          0%,100%{opacity:1}
          4%{opacity:0}
          8%{opacity:1}
        }
        @keyframes flt{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-6px)}
        }
      `}</style>
    </div>
  )
}

const f9 = {
  p: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(160deg, #fce4ec 0%, #f8bbd0 35%, #f48fb1 65%, #ec407a 100%)',
    position: 'relative', overflow: 'hidden', padding: '16px',
  },
  deco: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden',
  },
  ob: {
    position: 'absolute', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(233,30,99,0.03) 100%)',
    animation: 'or 11s ease-in-out infinite', filter: 'blur(45px)',
  },
  w: {
    width: '100%', maxWidth: '340px', position: 'relative', zIndex: 1,
    animation: 'pu 0.5s ease',
  },
  c: {
    background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
    borderRadius: '36px', padding: '22px 22px 26px',
    boxShadow: '0 24px 72px rgba(233,30,99,0.18), 0 0 0 1px rgba(255,255,255,0.55) inset',
    border: '1px solid rgba(255,255,255,0.3)',
    textAlign: 'center',
  },
  bar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px',
  },
  dots: { display: 'flex', gap: '6px' },
  dt: {
    width: '8px', height: '8px', borderRadius: '50%',
    boxShadow: '0 0 3px rgba(0,0,0,0.03)', animation: 'bk 3.5s ease infinite',
    animationDelay: '0s',
  },
  id: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: '#ff5f57', boxShadow: '0 0 4px rgba(0,0,0,0.03)',
  },
  icon: {
    fontSize: '38px', marginBottom: '6px', animation: 'flt 2.5s ease-in-out infinite',
  },
  hh: {
    fontSize: '40px', fontWeight: 700, color: '#e53935', marginBottom: '4px',
    letterSpacing: '3px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
  },
  t1: {
    fontSize: '15px', fontWeight: 600, color: '#880e4f', marginBottom: '4px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  t2: {
    fontSize: '12px', color: '#ad1457', opacity: 0.6, marginBottom: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  pbw: {
    height: '5px', background: 'rgba(233,30,99,0.07)', borderRadius: '3px',
    marginBottom: '16px', overflow: 'hidden',
  },
  pb: {
    height: '100%', background: 'linear-gradient(90deg, #e91e63, #c2185b)',
    borderRadius: '3px', transition: 'width 1s linear',
  },
  cntw: {
    display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '5px',
  },
  cnt: {
    fontSize: '38px', fontWeight: 700, color: '#e91e63',
    fontFamily: '"SF Mono", "Fira Code", monospace',
    lineHeight: 1,
  },
  cntl: {
    fontSize: '12px', color: '#ad1457', opacity: 0.45,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
}

function LogoutBtn() {
  const { authed, logout } = useAuth()
  if (!authed) return null
  return (
    <button
      onClick={() => { logout() }}
      style={{
        position: 'fixed', top: '16px', right: '16px', zIndex: 999,
        padding: '8px 16px', fontSize: '12px', fontWeight: 500,
        border: '1px solid rgba(233,30,99,0.2)', borderRadius: '10px',
        cursor: 'pointer', background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)', color: '#880e4f',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
        transition: 'all 0.15s',
      }}
    >
      Logout
    </button>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LogoutBtn />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Protected><Home /></Protected>} />
        <Route path="/welcome/hbd" element={<Protected><Welcome /></Protected>} />
        <Route path="/welcome/hbd/card" element={<Protected><Card /></Protected>} />
        <Route path="/camera" element={<Protected><Camera /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
