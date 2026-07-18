import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const questions = [
  {
    emoji: '🥺💗',
    title: 'Hey Zahwaa...',
    text: 'Mau gak kamu jadi <strong>someone spesial</strong> nya<br /><span class="qh">Juvevavian Rifqi</span>? 🥺💗',
  },
  {
    emoji: '🥺💕',
    title: 'Zahwa...',
    text: 'Boleh gak aku jadi tempat kamu bersandar<br />dan berbagi cerita? 💕',
  },
  {
    emoji: '😳💗',
    title: 'Zahwaa...',
    text: 'Kalo aku bilang aku sayang banget sama kamu,<br />kamu percaya gak? 🥺',
  },
  {
    emoji: '💖',
    title: 'Yang terakhir...',
    text: 'Mau gak kamu jadi alasan aku tersenyum<br />setiap hari selamanya? 💗',
  },
]

export default function Welcome() {
  const navigate = useNavigate()
  const [qIdx, setQIdx] = useState(0)
  const [step, setStep] = useState('question')
  const [noActive, setNoActive] = useState(false)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [noCount, setNoCount] = useState(0)
  const [lastNoCount, setLastNoCount] = useState(0)
  const [showLastPopup, setShowLastPopup] = useState(false)
  const noBtnRef = useRef(null)
  const noInit = useRef(false)
  const q = questions[qIdx]

  const noScale = Math.max(0.04, Math.pow(0.5, noCount))
  const yesScale = Math.min(15, 1 + noCount * 0.7)
  const yesPad = Math.min(90, 14 + noCount * 5)
  const yesSize = Math.min(60, 17 + noCount * 4)

  const lastNoTexts = ['Tidak 😤', 'Tidak 😅', 'Tidak 🙈']

  const moveNoBtn = useCallback(() => {
    if (!noInit.current) {
      noInit.current = true
      setNoActive(true)
    }
    const btn = noBtnRef.current
    if (!btn) return
    const card = btn.closest('[data-card]')
    if (!card) return
    const cw = card.clientWidth
    const ch = card.clientHeight
    const bw = btn.offsetWidth || 100
    const bh = btn.offsetHeight || 46
    const pad = 12
    const mx = Math.max(cw - bw - pad, pad + 10)
    const my = Math.max(ch - bh - pad - 60, pad + 10)
    const x = pad + Math.random() * (mx - pad)
    const y = pad + Math.random() * (my - pad)
    setNoPos({ x, y })
  }, [])

  const handleYes = async () => {
    if (qIdx < questions.length - 1) {
      setQIdx(qIdx + 1)
      setNoActive(false)
      setNoCount(0)
      setLastNoCount(0)
      noInit.current = false
      return
    }
    setStep('answer')
    const confetti = (await import('canvas-confetti')).default
    const dur = 4000
    const end = Date.now() + dur
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#e91e63','#f48fb1','#ff80ab','#f8bbd0','#ff4081'] })
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#e91e63','#f48fb1','#ff80ab','#f8bbd0','#ff4081'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
    setTimeout(() => {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors: ['#e91e63','#f48fb1','#ff80ab','#f8bbd0','#ff4081','#ff69b4'] })
    }, 500)
    setTimeout(() => navigate('/welcome/hbd/card'), 2000)
  }

  return (
    <div style={st.page}>
      <div style={st.rain}>
        {['💗','✨','💖','🌸','💕','🌟','💘','🩷','💝','🥰','💞','🫶'].map((e, i) => (
          <span key={i} style={{
            position: 'absolute', left: `${(i*3.3+5)%100}%`, top: '-60px',
            fontSize: `${16+(i%7)*4}px`, opacity: 0.75+(i%4)*0.08,
            animation: `rf${i%3} ${9+(i%3)*2}s linear ${i*0.25}s infinite`,
            pointerEvents: 'none', userSelect: 'none', willChange: 'transform',
          }}>{e}</span>
        ))}
      </div>

      {step === 'question' && (
        <div style={st.qs}>
          <div style={st.qc} data-card>
            <div style={st.qstep}>pertanyaan {qIdx + 1} dari {questions.length}</div>
            <span style={st.qe}>{q.emoji}</span>
            <h2 style={st.qt}>{q.title}</h2>
            <p style={st.qp} dangerouslySetInnerHTML={{ __html: q.text }} />

            <div style={st.br}>
              <button
                ref={noBtnRef}
                style={{
                  ...st.nb,
                  transform: `scale(${noScale}) rotate(${(1-noScale)*15}deg)`,
                  opacity: Math.min(1, noScale + 0.3),
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  ...(noActive ? {
                    position: 'absolute',
                    left: `${noPos.x}px`,
                    top: `${noPos.y}px`,
                    zIndex: 20,
                    transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.12s ease, top 0.12s ease',
                  } : {}),
                }}
                onMouseEnter={(e) => {
                  if (qIdx === 1 || qIdx === 3) return
                  moveNoBtn()
                }}
                onClick={(e) => {
                  e.preventDefault()
                  if (qIdx === 1) {
                    if (noCount > 8) return
                    setNoCount(c => c + 1)
                    return
                  }
                  if (qIdx === 3) {
                    if (lastNoCount >= 3) return
                    const next = lastNoCount + 1
                    setLastNoCount(next)
                    if (next >= 3) {
                      setTimeout(() => setShowLastPopup(true), 400)
                    }
                    return
                  }
                  moveNoBtn()
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  if (qIdx === 1) {
                    if (noCount > 8) return
                    setNoCount(c => c + 1)
                    return
                  }
                  if (qIdx === 3) {
                    if (lastNoCount >= 3) return
                    const next = lastNoCount + 1
                    setLastNoCount(next)
                    if (next >= 3) {
                      setTimeout(() => setShowLastPopup(true), 400)
                    }
                    return
                  }
                  moveNoBtn()
                }}
              >
                {qIdx === 3 ? lastNoTexts[lastNoCount] : 'Tidak 😤'}
              </button>
              <button
                style={{
                  ...st.yb,
                  transform: noCount > 3
                    ? `translate(-50%, -50%) scale(${yesScale})`
                    : `scale(${yesScale})`,
                  padding: `${yesPad}px ${yesPad * 1.5}px`,
                  fontSize: `${yesSize}px`,
                  zIndex: noCount > 3 ? 50 : 'auto',
                  position: noCount > 3 ? 'fixed' : 'relative',
                  left: noCount > 3 ? '50%' : 'auto',
                  top: noCount > 3 ? '50%' : 'auto',
                  width: noCount > 3 ? '80vw' : 'auto',
                  maxWidth: noCount > 3 ? '500px' : 'none',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: noCount > 0
                    ? `0 ${4+noCount*4}px ${20+noCount*8}px rgba(233,30,99,${0.25+noCount*0.04})`
                    : '0 4px 20px rgba(233,30,99,0.3)',
                }}
                onClick={handleYes}
              >
                Iyaaa! 💗
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'answer' && (
        <div style={st.waitMsg}>
          <span style={{ fontSize: '48px', display: 'block' }}>💗</span>
          <p style={st.waitText}>Yeay! kamu mauu~ 🥺💕</p>
        </div>
      )}

      {showLastPopup && (
        <div style={st.popupOverlay} onClick={() => {}}>
          <div style={st.popupCard}>
            <span style={{ fontSize: '56px', display: 'block', marginBottom: '8px' }}>🥺💗</span>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e91e63', marginBottom: '10px' }}>
              Kok kenapa tidak sih? 😣
            </h2>
            <p style={{ fontSize: '14px', color: '#880e4f', lineHeight: 1.7, marginBottom: '6px' }}>
              Padahal aku udah sayang banget sama kamu 🥺
            </p>
            <p style={{ fontSize: '14px', color: '#880e4f', lineHeight: 1.7, marginBottom: '20px' }}>
              Dibayar pake cinta, mau kan? 😳💕
            </p>
            <button
              style={{
                padding: '16px 48px', fontSize: '18px', fontWeight: 700,
                border: 'none', borderRadius: '16px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #e91e63, #c2185b)',
                color: '#fff', fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 6px 24px rgba(233,30,99,0.35)',
                transition: 'transform 0.2s',
              }}
              onClick={() => { setShowLastPopup(false); handleYes() }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              Iyaaa! 💗
            </button>
          </div>
        </div>
      )}

      <style>{`
        .qh {
          font-size: 18px; font-weight: 700; color: #c2185b;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          padding: 2px 12px; border-radius: 8px; display: inline-block; margin-top: 4px;
        }
        @keyframes rf0{
          0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}
          8%{opacity:1}
          20%{transform:translateY(20vh) translateX(8px) rotate(120deg)}
          50%{transform:translateY(50vh) translateX(-5px) rotate(240deg)}
          80%{transform:translateY(80vh) translateX(6px) rotate(360deg);opacity:0.8}
          100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(480deg);opacity:0}
        }
        @keyframes rf1{
          0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}
          8%{opacity:1}
          20%{transform:translateY(20vh) translateX(-6px) rotate(-90deg)}
          50%{transform:translateY(50vh) translateX(9px) rotate(-200deg)}
          80%{transform:translateY(80vh) translateX(-4px) rotate(-320deg);opacity:0.8}
          100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(-400deg);opacity:0}
        }
        @keyframes rf2{
          0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}
          8%{opacity:1}
          20%{transform:translateY(20vh) translateX(10px) rotate(80deg)}
          50%{transform:translateY(50vh) translateX(-8px) rotate(180deg)}
          80%{transform:translateY(80vh) translateX(5px) rotate(280deg);opacity:0.8}
          100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(380deg);opacity:0}
        }
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{
          0%{transform:scale(0.3);opacity:0}
          100%{transform:scale(1);opacity:1}
        }
      `}</style>
    </div>
  )
}

const st = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(150deg, #fce4ec 0%, #f8bbd0 40%, #f48fb1 100%)',
    fontFamily: 'Poppins, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  rain: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0,
    overflow: 'hidden',
  },

  qs: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', zIndex: 1, padding: '16px',
  },
  qc: {
    background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(24px)',
    borderRadius: '32px', padding: '36px 28px', width: '360px', maxWidth: '100%',
    textAlign: 'center', boxShadow: '0 20px 60px rgba(233,30,99,0.18)',
    animation: 'popIn 0.5s ease',
    position: 'relative', minHeight: '300px',
  },
  qstep: {
    fontSize: '11px', color: '#ad1457', opacity: 0.45, marginBottom: '10px',
    letterSpacing: '1px', fontWeight: 400,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
  },
  qe: { fontSize: '48px', display: 'block', marginBottom: '8px' },
  qt: { fontSize: '22px', fontWeight: 700, color: '#e91e63', marginBottom: '10px' },
  qp: { fontSize: '15px', color: '#880e4f', lineHeight: 1.8, marginBottom: '24px' },
  qh: {
    fontSize: '18px', fontWeight: 700, color: '#c2185b',
    background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
    padding: '2px 12px', borderRadius: '8px', display: 'inline-block', marginTop: '4px',
  },
  qbr: {
    position: 'relative', width: '100%', height: '52px',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    overflow: 'visible',
  },
  br: {
    display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center',
    marginTop: '24px', position: 'relative', minHeight: '50px',
  },
  nb: {
    padding: '12px 28px', fontSize: '15px', fontWeight: 600,
    border: '2px solid #e57373', borderRadius: '14px',
    background: '#fff', color: '#e53935', fontFamily: 'Poppins, sans-serif',
    cursor: 'default', userSelect: 'none', whiteSpace: 'nowrap',
  },
  yb: {
    padding: '14px 36px', fontSize: '17px', fontWeight: 700,
    border: 'none', borderRadius: '14px', cursor: 'pointer',
    background: 'linear-gradient(135deg, #e91e63, #c2185b)',
    color: '#fff', fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 4px 20px rgba(233,30,99,0.3)',
  },

  waitMsg: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', zIndex: 1, padding: '20px',
    animation: 'popIn 0.5s ease',
  },
  waitText: {
    fontSize: '20px', fontWeight: 600, color: '#e91e63', marginTop: '12px',
    fontFamily: 'Poppins, sans-serif',
  },

  popupOverlay: {
    position: 'fixed', inset: 0, zIndex: 100,
    background: 'rgba(233,30,99,0.2)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  popupCard: {
    background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)',
    borderRadius: '36px', padding: '40px 32px',
    width: '340px', maxWidth: '90vw', textAlign: 'center',
    boxShadow: '0 24px 80px rgba(233,30,99,0.25)',
    animation: 'popIn 0.4s ease',
  },

}
