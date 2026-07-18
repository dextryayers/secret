import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const emojis = [
  '💗','✨','💖','🌸','💕','🌟',
  '💘','👑','💝','🥰','💞','🫶',
]

export default function Home() {
  const [name, setName] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [forbidden, setForbidden] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.toLowerCase().trim() === 'zahwa') {
      setShowPopup(true)
    } else {
      setForbidden(true)
    }
  }

  useEffect(() => {
    if (showPopup) {
      const t = setTimeout(() => navigate('/welcome/hbd'), 2800)
      return () => clearTimeout(t)
    }
  }, [showPopup, navigate])

  if (forbidden) {
    return (
      <div style={st.p}>
        <div style={st.r}>
          {emojis.map((e, i) => (
            <span key={i} style={{
              position: 'absolute', left: `${(i*3.3+5)%100}%`, top: '-60px',
              fontSize: `${16+(i%7)*5}px`, opacity: 0.75+(i%4)*0.08,
              animation: `rh${i%3} ${8+(i%3)*2}s linear ${i*0.2}s infinite`,
              pointerEvents: 'none', userSelect: 'none', willChange: 'transform',
            }}>{e}</span>
          ))}
        </div>
        <div style={st.w}>
          <div style={st.c}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>🚫</span>
            <h1 style={{ fontSize: '44px', fontWeight: 700, color: '#e53935', marginBottom: '8px' }}>403</h1>
            <p style={{ fontSize: '14px', color: '#880e4f', marginBottom: '20px' }}>Akses Ditolak! Bukan kamu yang dicari 😤</p>
            <button onClick={() => { setForbidden(false); setName('') }} style={st.bt}>Coba Lagi</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={st.p}>
      <div style={st.r}>
        {emojis.map((e, i) => (
            <span key={i} style={{
              position: 'absolute', left: `${(i*3.3+5)%100}%`, top: '-60px',
              fontSize: `${16+(i%7)*5}px`, opacity: 0.75+(i%4)*0.08,
              animation: `rh${i%3} ${8+(i%3)*2}s linear ${i*0.2}s infinite`,
              pointerEvents: 'none', userSelect: 'none', willChange: 'transform',
            }}>{e}</span>
          ))}
        </div>

        <div style={st.deco}>
        {[
          { t: '10%', l: '-5%', w: '160', h: '160', d: '0s' },
          { t: '60%', l: '82%', w: '180', h: '180', d: '2.5s' },
          { t: '75%', l: '-3%', w: '120', h: '120', d: '4s' },
          { t: '15%', l: '85%', w: '140', h: '140', d: '1.5s' },
        ].map((o, i) => (
          <div key={i} style={{ ...st.ob, top: o.t, left: o.l, width: o.w+'px', height: o.h+'px', animationDelay: o.d }} />
        ))}
      </div>

      <div style={st.w}>
        <div style={st.c}>
          <div style={st.bar}>
            <div style={st.dots}>
              {['#ff5f57','#ffbd2e','#28c840'].map((c,i) => (
                <div key={i} style={{ ...st.dt, background: c, animationDelay: `${i*0.12}s` }} />
              ))}
            </div>
            <div style={st.id} />
          </div>

          <span style={st.wv}>👋</span>
          <h2 style={st.hh}>Halo! Siapa Namamu?</h2>
          <p style={st.sb}>Masukin nama kamu dulu yuk~</p>
          <form onSubmit={handleSubmit} style={st.fm}>
            <input style={st.in} placeholder="Nama kamu..." value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            <button type="submit" style={st.bt}>Masuk 💗</button>
          </form>
        </div>
      </div>

      {showPopup && (
        <div style={st.ov}>
          <div style={st.pp}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '6px' }}>🥺💗</span>
            <h2 style={st.pt}>Zahwaaaaa!</h2>
            <p style={st.ppt}>
              Akhirnya kamu datang jugaa~ 💕
              <br />
              Aku udah nungguin dari tadi 😳💗
            </p>
            <div style={st.dt2}>
              <span style={st.dd}>.</span>
              <span style={{ ...st.dd, animationDelay: '0.2s' }}>.</span>
              <span style={{ ...st.dd, animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes rh0{
          0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}
          8%{opacity:1}
          20%{transform:translateY(20vh) translateX(8px) rotate(120deg)}
          50%{transform:translateY(50vh) translateX(-5px) rotate(240deg)}
          80%{transform:translateY(80vh) translateX(6px) rotate(360deg);opacity:0.85}
          100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(480deg);opacity:0}
        }
        @keyframes rh1{
          0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}
          8%{opacity:1}
          20%{transform:translateY(20vh) translateX(-6px) rotate(-90deg)}
          50%{transform:translateY(50vh) translateX(9px) rotate(-200deg)}
          80%{transform:translateY(80vh) translateX(-4px) rotate(-320deg);opacity:0.85}
          100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(-400deg);opacity:0}
        }
        @keyframes rh2{
          0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}
          8%{opacity:1}
          20%{transform:translateY(20vh) translateX(10px) rotate(80deg)}
          50%{transform:translateY(50vh) translateX(-8px) rotate(180deg)}
          80%{transform:translateY(80vh) translateX(5px) rotate(280deg);opacity:0.85}
          100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(380deg);opacity:0}
        }
        @keyframes pu{
          0%{transform:scale(0.35) translateY(30px);opacity:0}
          100%{transform:scale(1) translateY(0);opacity:1}
        }
        @keyframes bn{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-8px)}
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
        @keyframes dp{
          0%,80%,100%{opacity:0}
          40%{opacity:1}
        }
        button{
          transition:all 0.1s cubic-bezier(0.34,1.56,0.64,1)!important;
          -webkit-tap-highlight-color:transparent
        }
        button:active{transform:scale(0.94)!important}
        @media(hover:hover){button:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(233,30,99,0.15)}}
      `}</style>
    </div>
  )
}

const st = {
  p: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(160deg, #fce4ec 0%, #f8bbd0 35%, #f48fb1 65%, #ec407a 100%)',
    position: 'relative', overflow: 'hidden', padding: '16px',
  },
  r: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0,
    overflow: 'hidden',
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
    width: '100%', maxWidth: '360px', position: 'relative', zIndex: 1,
    animation: 'pu 0.5s ease',
  },
  c: {
    background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
    borderRadius: '36px', padding: '26px 24px 28px',
    boxShadow: '0 24px 72px rgba(233,30,99,0.18), 0 0 0 1px rgba(255,255,255,0.55) inset',
    border: '1px solid rgba(255,255,255,0.3)',
    textAlign: 'center',
  },
  bar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px',
  },
  dots: { display: 'flex', gap: '6px' },
  dt: {
    width: '8px', height: '8px', borderRadius: '50%',
    boxShadow: '0 0 3px rgba(0,0,0,0.03)', animation: 'bk 3.5s ease infinite',
    animationDelay: '0s',
  },
  id: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: 'rgba(200,200,200,0.35)', boxShadow: '0 0 4px rgba(0,0,0,0.03)',
  },
  wv: {
    fontSize: '44px', display: 'block', marginBottom: '8px',
    animation: 'bn 1.5s ease infinite',
  },
  hh: {
    fontSize: '20px', fontWeight: 600, color: '#880e4f',
    letterSpacing: '0.5px', marginBottom: '4px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  sb: {
    fontSize: '13px', color: '#ad1457', opacity: 0.65,
    marginBottom: '20px', fontWeight: 400,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  fm: { display: 'flex', flexDirection: 'column', gap: '12px' },
  in: {
    padding: '14px 18px', fontSize: '15px',
    border: '1.5px solid rgba(233,30,99,0.1)', borderRadius: '14px',
    outline: 'none', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
    color: '#4e342e', background: 'rgba(255,255,255,0.6)',
    transition: 'border 0.2s',
    textAlign: 'center',
  },
  bt: {
    padding: '13px', fontSize: '15px', fontWeight: 500,
    border: 'none', borderRadius: '14px', cursor: 'pointer',
    background: 'linear-gradient(135deg, #e91e63, #c2185b)',
    color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
    boxShadow: '0 4px 14px rgba(233,30,99,0.25)',
  },
  ov: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, backdropFilter: 'blur(4px)',
  },
  pp: {
    background: '#fff', borderRadius: '28px', padding: '36px 28px',
    width: '340px', maxWidth: '90%', textAlign: 'center',
    animation: 'pu 0.4s ease',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  pt: {
    fontSize: '22px', fontWeight: 600, color: '#e91e63', marginBottom: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  ppt: {
    fontSize: '14px', color: '#880e4f', lineHeight: 1.7,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  dt2: {
    marginTop: '14px', fontSize: '34px', color: '#e91e63',
  },
  dd: {
    animation: 'dp 1.4s infinite',
    display: 'inline-block', fontSize: '38px', lineHeight: 1,
  },
}
