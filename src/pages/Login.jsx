import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const btns = [
  { l: '7' }, { l: '8' }, { l: '9' }, { l: '÷', c: 'op' },
  { l: '4' }, { l: '5' }, { l: '6' }, { l: '×', c: 'op' },
  { l: '1' }, { l: '2' }, { l: '3' }, { l: '−', c: 'op' },
  { l: '⌫', c: 'bs' }, { l: '0' }, { l: '=', c: 'eq' }, { l: '+', c: 'op' },
]

const emojis = [
  '💗','✨','💖','🌸','💕','🌟','💘','🩷','💝','🥰',
  '💞','🫶','💓','🌷','💗','✨','💖','🌸','💕','🌟',
  '💘','🩷','💝','🥰','💞','🫶','💓','🌷','💗','✨'
]

export default function Login() {
  const [d, setD] = useState('0')
  const [buf, setBuf] = useState(null)
  const [op, setOp] = useState(null)
  const [fr, setFr] = useState(true)
  const [ok, setOk] = useState(false)
  const [no, setNo] = useState(false)
  const [mood, setMood] = useState('idle')
  const [pp, setPp] = useState({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const nav = useNavigate()
  const { login } = useAuth()
  const faceRef = useRef(null)
  const raf = useRef(null)
  const px = useRef(0)
  const py = useRef(0)

  const track = useCallback((cx, cy) => {
    const r = faceRef.current?.getBoundingClientRect()
    if (!r) return
    const rx = r.left + r.width / 2
    const ry = r.top + r.height / 2
    const tx = Math.max(-9, Math.min(9, ((cx - rx) / r.width) * 18))
    const ty = Math.max(-6, Math.min(6, ((cy - ry) / r.height) * 12))
    px.current += (tx - px.current) * 0.18
    py.current += (ty - py.current) * 0.18
    if (!raf.current) {
      raf.current = requestAnimationFrame(() => {
        setPp({ x: px.current, y: py.current })
        raf.current = null
        if (Math.abs(px.current - tx) > 0.3 || Math.abs(py.current - ty) > 0.3) {
          raf.current = requestAnimationFrame(() => {
            setPp({ x: px.current, y: py.current })
            raf.current = null
          })
        }
      })
    }
  }, [])

  useEffect(() => {
    const onMouse = (e) => track(e.clientX, e.clientY)
    const onTouch = (e) => { const t = e.touches[0]; if (t) track(t.clientX, t.clientY) }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch)
    const bt = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 110)
    }, 3000)
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      clearInterval(bt)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [track])

  const limit = (s) => s.length > 14 ? s.slice(0, 15) : s

  const n = (v) => {
    if (fr) { setD(String(v)); setFr(false) }
    else setD(limit(d === '0' ? String(v) : d + v))
    setMood('think'); setTimeout(() => setMood('idle'), 280)
  }

  const dot = () => {
    if (fr) { setD('0.'); setFr(false); return }
    if (!d.includes('.')) setD(limit(d + '.'))
  }

  const bs = () => {
    if (d.length <= 1 || d === 'Error') { setD('0'); setFr(true); return }
    setD(d.slice(0, -1))
  }

  const o = (c) => {
    const cur = parseFloat(d)
    if (buf !== null && op && !fr) {
      const r = calc(buf, cur, op)
      if (r === 'Error') { setD('Error'); setBuf(null); setOp(null); setFr(true); return }
      setD(fmt(r)); setBuf(r)
    } else setBuf(cur)
    setOp(c); setFr(true); setMood('think')
    setTimeout(() => setMood('idle'), 180)
  }

  const eq = () => {
    if (buf === null || !op) return
    const cur = parseFloat(d)
    const r = calc(buf, cur, op)
    if (r === 'Error') { setD('Error'); setBuf(null); setOp(null); setFr(true); return }
    const s = fmt(r)
    setD(s); setBuf(null); setOp(null); setFr(true)
    if (s === '19') { setOk(true); setNo(false); setMood('love'); login() }
    else { setNo(true); setOk(false); setMood('sad'); setTimeout(() => setNo(false), 400) }
    setTimeout(() => setMood('idle'), 650)
  }

  const clr = () => {
    setD('0'); setBuf(null); setOp(null); setFr(true)
    setOk(false); setNo(false); setMood('idle')
  }

  const calc = (a, b, op) => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 'Error'
      default: return b
    }
  }

  const fmt = (v) => {
    if (v === 'Error') return 'Error'
    const s = Number.isInteger(v) ? String(v) : parseFloat(v.toFixed(6)).toString()
    return s.length > 14 ? parseFloat(v).toExponential(4) : s
  }

  useEffect(() => { if (ok) { const t = setTimeout(() => nav('/home'), 950); return () => clearTimeout(t) } }, [ok, nav])

  useEffect(() => {
    const h = (e) => {
      const k = e.key
      if (k >= '0' && k <= '9') n(Number(k))
      else if (k === '.') dot()
      else if (k === '+' || k === '-' || k === '*' || k === '/') {
        if (k === '*') o('×')
        else if (k === '/') o('÷')
        else o(k === '-' ? '-' : k)
      }
      else if (k === 'Enter' || k === '=') eq()
      else if (k === 'Backspace') bs()
      else if (k === 'Delete' || k === 'Escape') clr()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [d, fr, buf, op])

  const mc = {
    idle: { w: 14, h: 5, r: 5, y: 0 },
    think: { w: 9, h: 9, r: 4.5, y: -1 },
    sad: { w: 16, h: 4, r: 8, y: 2, d: true },
    love: { w: 22, h: 11, r: 11, y: -1 },
  }[mood]

  return (
    <div style={st.p}>
      <div style={st.r}>
        {emojis.map((e, i) => (
          <span key={i} style={{
            ...st.dr,
            left: `${(i*3.4 + (i%7)*1.5) % 100}%`,
            fontSize: `${8 + (i%8)*4}px`,
            animationDelay: `${i*0.28}s`,
            animationDuration: `${11 + (i%5)*2.5}s`,
            opacity: 0.12 + (i%6)*0.06,
          }}>{e}</span>
        ))}
      </div>

      <div style={st.deco}>
        {[
          { t: '8%', l: '-5%', w: '160px', h: '160px', d: '0s' },
          { t: '55%', l: '80%', w: '180px', h: '180px', d: '2.5s' },
          { t: '70%', l: '-3%', w: '110px', h: '110px', d: '4.5s' },
          { t: '20%', l: '88%', w: '130px', h: '130px', d: '1s' },
        ].map((o, i) => (
          <div key={i} style={{ ...st.ob, top: o.t, left: o.l, width: o.w, height: o.h, animationDelay: o.d }} />
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
            <div style={{ ...st.ind, background: ok ? '#28c840' : 'rgba(200,200,200,0.35)' }} />
          </div>

          <div ref={faceRef} style={st.face}>
            <div style={st.fi}>
              <div style={st.er}>
                {[0,1].map((_,i) => (
                  <div key={i} style={st.eb}>
                    <div style={st.ew}>
                      <div style={{
                        ...st.ir,
                        transform: `translate(${pp.x}px,${pp.y}px)`,
                        background: mood === 'love' ? '#e91e63' : '#4e342e',
                      }} />
                    </div>
                    <div style={{ ...st.el, transform: blink ? 'scaleY(1)' : 'scaleY(0)' }} />
                    <div style={{
                      ...st.bl,
                      opacity: mood === 'love' ? 0.5 : mood === 'sad' ? 0.15 : 0,
                      ...(i===0?{left:'-9px'}:{right:'-9px'}),
                    }} />
                  </div>
                ))}
              </div>
              <div style={st.mw}>
                <div style={{
                  ...st.mt,
                  width: mc.w + 'px', height: mc.h + 'px',
                  borderRadius: mc.d ? `0 0 ${mc.r}px ${mc.r}px` : `${mc.r}px ${mc.r}px 0 0`,
                  transform: `translateY(${mc.y}px)`,
                  background: mood === 'love' ? '#e91e63' : '#4e342e',
                }} />
              </div>
            </div>
          </div>

          <h2 style={st.tt}>Calculator</h2>
          <p style={st.sb}>cute edition</p>

          <div style={{ ...st.sc, ...(no ? st.sw : {}), ...(ok ? st.sp : {}) }}>
            <div style={st.sn}>
              {buf !== null && <span>{buf} {op}</span>}
            </div>
            <span style={st.di}>{d}</span>
            {ok && <div style={st.ch}>&#10003;</div>}
          </div>

          <div style={st.g}>
            {btns.map((b, i) => (
              <button key={i} onClick={() => {
                if (b.c === 'op') o(b.l === '−' ? '-' : b.l)
                else if (b.c === 'bs') bs()
                else if (b.c === 'eq') eq()
                else n(Number(b.l))
              }} style={{
                ...st.bn,
                ...(b.c==='op'?st.bp:{}),
                ...(b.c==='bs'?st.bbs:{}),
                ...(b.c==='eq'?st.be:{}),
              }}>
                {b.l}
              </button>
            ))}
          </div>

          {ok && (
            <div style={st.msg}>
              <span style={st.mh}>&#10084;</span>
              <span>yaay bener! masuk~</span>
              <span style={st.mh}>&#10084;</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fl{
          0%{transform:translateY(-70px) rotate(0deg) scale(0.4);opacity:0}
          10%{opacity:0.4}
          85%{opacity:0.18}
          100%{transform:translateY(calc(100vh + 70px)) rotate(480deg) scale(1.2);opacity:0}
        }
        @keyframes sy{
          0%,100%{margin-left:0}
          25%{margin-left:6px}
          75%{margin-left:-4px}
        }
        @keyframes pu{
          0%{transform:scale(0.35) translateY(30px);opacity:0}
          100%{transform:scale(1) translateY(0);opacity:1}
        }
        @keyframes sh{
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        @keyframes ft{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-4px)}
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
        @keyframes gw{
          0%,100%{box-shadow:0 0 0 0 rgba(233,30,99,0)}
          50%{box-shadow:0 0 28px 6px rgba(233,30,99,0.04)}
        }
        button{
          transition:all 0.1s cubic-bezier(0.34,1.56,0.64,1)!important;
          -webkit-tap-highlight-color:transparent
        }
        button:active{transform:scale(0.92)!important}
        @media(hover:hover){button:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(233,30,99,0.1)}}
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
  },
  dr: {
    position: 'absolute', top: '-70px',
    animation: 'fl linear infinite, sy 3.2s ease-in-out infinite',
    willChange: 'transform',
    filter: 'drop-shadow(0 2px 5px rgba(233,30,99,0.04))',
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
    background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
    borderRadius: '36px', padding: '14px 18px 20px',
    boxShadow: '0 24px 72px rgba(233,30,99,0.18), 0 0 0 1px rgba(255,255,255,0.55) inset',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  bar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px',
  },
  dots: { display: 'flex', gap: '6px' },
  dt: {
    width: '8px', height: '8px', borderRadius: '50%',
    boxShadow: '0 0 3px rgba(0,0,0,0.03)', animation: 'bk 3.5s ease infinite',
    animationDelay: '0s',
  },
  ind: {
    width: '7px', height: '7px', borderRadius: '50%',
    transition: 'background 0.3s',
    boxShadow: '0 0 4px rgba(0,0,0,0.03)',
  },
  face: { textAlign: 'center', marginBottom: '6px', userSelect: 'none', animation: 'ft 3.5s ease-in-out infinite' },
  fi: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '3px' },
  er: { display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center' },
  eb: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ew: {
    width: '28px', height: '28px', borderRadius: '50%',
    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(233,30,99,0.08), inset 0 1px 2px rgba(0,0,0,0.01)',
    border: '1.5px solid rgba(233,30,99,0.06)',
    position: 'relative', overflow: 'visible',
  },
  ir: {
    width: '11px', height: '11px', borderRadius: '50%', background: '#4e342e',
    transition: 'background 0.3s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    position: 'relative', zIndex: 1,
  },
  el: {
    position: 'absolute', top: 0, left: '-2px',
    width: 'calc(100% + 4px)', height: '100%',
    background: 'linear-gradient(180deg, #fce4ec 0%, #fff 40%, #fff 60%, #fce4ec 100%)',
    borderRadius: '50%',
    transition: 'transform 0.1s ease',
    transformOrigin: 'center',
    zIndex: 2,
  },
  bl: {
    position: 'absolute', top: '15px', width: '12px', height: '7px',
    borderRadius: '50%', background: '#ff8a80',
    transition: 'opacity 0.35s',
    zIndex: 0,
  },
  mw: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '12px' },
  mt: {
    borderRadius: '5px 5px 0 0',
    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  tt: {
    textAlign: 'center', fontSize: '15px', fontWeight: 500, color: '#880e4f',
    letterSpacing: '4px', textTransform: 'lowercase', marginBottom: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  sb: {
    textAlign: 'center', fontSize: '9px', color: '#ad1457', opacity: 0.35,
    letterSpacing: '3px', marginBottom: '14px', fontWeight: 400,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  sc: {
    background: 'rgba(255,255,255,0.5)', borderRadius: '18px',
    padding: '10px 14px 11px', marginBottom: '14px',
    border: '1px solid rgba(233,30,99,0.05)', transition: 'all 0.25s',
    minHeight: '66px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    position: 'relative',
  },
  sw: {
    animation: 'sh 0.4s ease',
    borderColor: 'rgba(229,115,115,0.25)', background: 'rgba(229,115,115,0.03)',
  },
  sp: {
    borderColor: 'rgba(107,203,119,0.35)', background: 'rgba(200,230,201,0.1)',
    animation: 'gw 2.5s ease infinite',
  },
  sn: { minHeight: '14px', fontSize: '10px', color: '#ad1457', opacity: 0.3, fontFamily: '"SF Mono","Fira Code",monospace' },
  di: {
    fontSize: '32px', fontWeight: 500, color: '#4e342e',
    fontFamily: '"SF Mono","Fira Code",monospace', letterSpacing: '1.5px',
    lineHeight: 1.15, wordBreak: 'break-all', textAlign: 'right',
  },
  ch: {
    position: 'absolute', top: '-6px', right: '-6px',
    background: '#28c840', color: '#fff', width: '20px', height: '20px',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 600, boxShadow: '0 2px 8px rgba(40,200,64,0.35)',
    animation: 'pu 0.3s ease',
  },
  g: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
  bn: {
    padding: '13px 0', fontSize: '16px', fontWeight: 500,
    border: 'none', borderRadius: '14px', cursor: 'pointer',
    background: '#fff', color: '#4e342e',
    boxShadow: '0 1px 4px rgba(233,30,99,0.03)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
    userSelect: 'none', WebkitTapHighlightColor: 'transparent', lineHeight: 1,
  },
  bp: { background: 'rgba(248,187,208,0.15)', color: '#c2185b' },
  bbs: { background: 'rgba(200,200,200,0.15)', color: '#4e342e', fontSize: '18px' },
  be: {
    background: 'linear-gradient(135deg, #e91e63, #c2185b)', color: '#fff',
    fontWeight: 600, fontSize: '18px',
    boxShadow: '0 4px 14px rgba(233,30,99,0.25)',
  },
  msg: {
    marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
    animation: 'pu 0.4s ease', fontSize: '12px', fontWeight: 500, color: '#2e7d32',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  mh: { fontSize: '12px', color: '#e91e63' },
}
