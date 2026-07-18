import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const cards = [
  {
    icon: '🎂',
    title: 'Terima Kasih Sudah Lahir',
    lines: [
      'Tanggal 20 Juli 2007,',
      'mungkin biasa bagi banyak orang,',
      'tapi bagi dunia yang',
      'kenal kamu kelak,',
      'itu hari yang istimewa.',
      '',
      'Sejak hari itu,',
      'tumbuh seorang perempuan',
      'dengan hati yang hangat,',
      'senyum yang menular,',
      'dan semangat yang',
      'menginspirasi banyak orang.',
      '',
      'Selamat ulang tahun, Zahwa.',
      'Terima kasih sudah lahir,',
      'sudah bertahan,',
      'sudah menjadi dirimu',
      'yang apa adanya.',
      '',
      'Semoga usiamu yang baru',
      'menjadi awal dari',
      'petualangan indah',
      'yang belum pernah',
      'kau bayangkan sebelumnya.',
    ],
  },
  {
    icon: '🥰',
    title: 'Tentang Kamu',
    lines: [
      'Zahwa, ada sesuatu',
      'yang membuatmu berbeda.',
      'Bukan karena siapa kamu,',
      'tapi karena caramu',
      'memperlakukan orang lain.',
      '',
      'Kamu pendengar yang baik,',
      'teman yang setia,',
      'dan sosok yang selalu',
      'memberi tanpa pannrih.',
      'Hal-hal kecil darimu',
      'sering kali terasa besar.',
      '',
      'Jangan pernah berubah.',
      'Dunia butuh lebih banyak',
      'orang baik sepertimu.',
      'Teruslah jadi Zahwa',
      'yang tulus dan hangat,',
      'karena kamu sudah',
      'cukup sempurna dengan',
      'caramu sendiri.',
    ],
  },
  {
    icon: '🤗',
    title: 'Bersyukur Kenal Kamu',
    lines: [
      'Aku gak tahu bagaimana,',
      'caranya Tuhan mempertemukan,',
      'tapi aku percaya',
      'ada alasan di balik',
      'setiap pertemuan.',
      '',
      'Dan pertemuan kita',
      'adalah salah satu',
      'yang paling berharga.',
      'Kamu datang dan',
      'membawa warna baru',
      'di hidupku.',
      '',
      'Setiap obrolan,',
      'setiap tawa,',
      'setiap cerita yang',
      'kita bagi bersama,',
      'semua itu berarti.',
      '',
      'Makasih ya, Zahwa,',
      'sudah hadir dan',
      'menjadi bagian dari',
      'perjalanan hidupku.',
    ],
  },
  {
    icon: '🙏',
    title: 'Maafkan Aku',
    lines: [
      'Zahwa, aku ingin minta maaf',
      'untuk hal-hal yang mungkin',
      'tanpa sengaja pernah',
      'membuatmu kecewa',
      'atau merasa tidak nyaman.',
      '',
      'Kadang kata-kata',
      'bisa meleset dari hati,',
      'dan aku sadar',
      'aku tidak selalu',
      'menjadi teman yang baik.',
      '',
      'Tapi percayalah,',
      'persahabatan ini',
      'sangat berarti bagiku.',
      'Dan aku akan terus',
      'belajar jadi lebih peka,',
      'lebih peduli,',
      'dan lebih ada untukmu.',
      '',
      'Makasih sudah mau',
      'memaafkan dan tetap',
      'bertahan selama ini.',
    ],
  },
  {
    icon: '🤲',
    title: 'Doa dan Harapan',
    lines: [
      'Di hari yang spesial ini,',
      'aku cuma ingin berdoa,',
      'semoga hidup selalu',
      'berpihak padamu.',
      '',
      'Semoga setiap langkahmu',
      'dipermudah,',
      'setiap air matamu',
      'diganti tawa,',
      'dan setiap mimpi besarmu',
      'dikabulkan tepat waktu.',
      '',
      'Semoga kamu dikelilingi',
      'orang-orang yang tulus,',
      'yang melihat keistimewaanmu',
      'dan merayakan keberadaanmu.',
      '',
      'Jangan pernah lelah',
      'menjadi dirimu sendiri.',
      'Karena dengan menjadi',
      'dirimu yang sejati,',
      'kamu sudah membuat',
      'dunia ini lebih indah.',
      '',
      'Selamat ulang tahun, Zahwa.',
      'Semoga tahun ini',
      'membawa seribu cerita,',
      'seribu tawa,',
      'dan sejuta kebahagiaan',
      'yang tak terlupakan.',
    ],
  },
  {
    icon: '🎂',
    title: 'Tiup Lilin!',
    lines: [],
  },
  {
    icon: '💌',
    title: 'Surat Cinta',
    lines: [],
  },
]

const iconColors = ['#e91e63', '#f48fb1', '#ff80ab', '#ab47bc', '#e91e63', '#ff6f00', '#d81b60']

function TypeText({ lines, speed, onDone }) {
  const [d, setD] = useState('')
  const full = lines.join('\n')
  const idx = useRef(0)
  const timer = useRef(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    idx.current = 0; setD('')
    timer.current = setInterval(() => {
      if (idx.current < full.length) {
        setD(full.slice(0, idx.current + 1))
        idx.current++
      } else {
        clearInterval(timer.current)
        doneRef.current?.()
      }
    }, speed)
    return () => clearInterval(timer.current)
  }, [lines, speed])

  return <span style={{ whiteSpace: 'pre-wrap' }}>{d}</span>
}

function CakeScene({ onBlown }) {
  const [blown, setBlown] = useState(false)
  const blownRef = useRef(false)

  const handleBlow = async () => {
    if (blownRef.current) return
    blownRef.current = true
    setBlown(true)
    const c = (await import('canvas-confetti')).default
    c({ particleCount: 40, spread: 80, origin: { y: 0.6, x: 0.5 }, colors: ['#ff6f00','#ffab00','#ffd700','#e91e63','#f48fb1'] })
    setTimeout(() => {
      c({ particleCount: 100, spread: 120, origin: { y: 0.5 }, colors: ['#e91e63','#f48fb1','#ff80ab','#ffd700','#ff6f00'] })
    }, 300)
    setTimeout(() => onBlown?.(), 600)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '2px', padding: '10px 0 4px', cursor: 'pointer', userSelect: 'none',
    }} onClick={handleBlow}>
      {!blown ? (
        <div style={{
          width: '16px', height: '22px', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          background: 'radial-gradient(ellipse at 50% 40%, #fff7a0 0%, #ffcc00 30%, #ff8800 60%, #ff4400 100%)',
          boxShadow: '0 0 16px rgba(255,200,0,0.5), 0 0 32px rgba(255,150,0,0.25)',
          animation: 'flicker 0.25s ease-in-out infinite alternate',
          marginBottom: '-2px', position: 'relative', zIndex: 5,
        }} />
      ) : (
        ['#ddd','#ccc','#bbb'].map((c, i) => (
          <div key={i} style={{
            width: `${16 - i * 4}px`, height: `${16 - i * 4}px`,
            borderRadius: '50%', background: c, opacity: 0.3 - i * 0.08,
            animation: `puffUp ${0.5 + i * 0.1}s ease-out forwards`,
            position: 'absolute', marginTop: `${-10 - i * 6}px`,
          }} />
        ))
      )}

      <div style={{
        width: '7px', height: '32px',
        background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 50%, #e0e0e0 100%)',
        borderRadius: '2px 2px 3px 3px', position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <div style={{
          position: 'absolute', top: '6px', left: 0, width: '100%', height: '4px',
          background: 'linear-gradient(90deg, #ff80ab, #f06292, #ff80ab)',
          borderRadius: '1px',
        }} />
      </div>

      <div style={{
        width: '120px', height: '40px',
        background: 'linear-gradient(180deg, #fce4ec 0%, #f8bbd0 100%)',
        borderRadius: '50% 50% 8px 8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative', zIndex: 2,
      }}>
        <div style={{
          position: 'absolute', bottom: '-5px', left: '8px', right: '8px', height: '10px',
          background: '#f48fb1', borderRadius: '0 0 6px 6px',
        }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} style={{
            position: 'absolute', fontSize: '7px',
            left: `${12 + i * 18}px`, top: `${8 + (i % 3) * 10}px`,
            opacity: 0.7,
          }}>{['💖','🌟','✨','💗','🌸','🩷'][i]}</span>
        ))}
      </div>

      <div style={{
        width: '170px', height: '44px',
        background: 'linear-gradient(180deg, #f8bbd0 0%, #f48fb1 100%)',
        borderRadius: '50% 50% 10px 10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1,
        marginTop: '-10px',
      }}>
        <div style={{
          position: 'absolute', bottom: '-5px', left: '12px', right: '12px', height: '10px',
          background: '#e91e63', borderRadius: '0 0 8px 8px', opacity: 0.5,
        }} />
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{
            position: 'absolute', fontSize: '6px',
            left: `${10 + i * 20}px`, top: `${6 + (i % 4) * 10}px`,
            opacity: 0.6,
          }}>{['🌟','💕','✨','💖','🌸','💗','🩷','💫'][i]}</span>
        ))}
      </div>

      <div style={{
        width: '200px', height: '12px',
        background: 'linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%)',
        borderRadius: '50%', marginTop: '-4px', zIndex: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }} />

      {!blown && (
        <p style={{
          fontSize: '12px', color: '#ad1457', opacity: 0.7,
          marginTop: '6px', animation: 'popIn 0.4s ease',
        }}>
          👆 tekam lilinnya buat ditiup!
        </p>
      )}
    </div>
  )
}

function EnvelopeScene({ onDone }) {
  const [phase, setPhase] = useState('closed')

  const openEnv = () => { if (phase === 'closed') setPhase('open') }
  const closeEnv = () => { if (phase === 'open') setPhase('closed') }
  const pullLetter = (e) => { e?.stopPropagation(); if (phase === 'open') setPhase('out') }
  const flipLetter = () => { setPhase(p => p === 'out' ? 'flipped' : 'out') }
  const putBack = () => {
    if (phase === 'flipped') setPhase('out')
    else setPhase('open')
  }

  const isIn = phase === 'closed'
  const isOpen = phase === 'open'
  const isOut = phase === 'out' || phase === 'flipped'
  const isFlipped = phase === 'flipped'
  const lY = isIn ? '108px' : isOpen ? '15px' : '-50px'
  const lS = isIn ? '0.86' : isOpen ? '0.93' : '1'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div style={{ position: 'relative', width: '220px', height: '150px' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: '66px', zIndex: isIn ? 5 : 2,
          background: 'linear-gradient(175deg, #f0ddc8, #f7e8d8)',
          borderRadius: '12px 12px 6px 6px', borderBottom: '2px dashed #d4b896',
          transform: isIn ? 'translateY(0)' : 'translateY(-66px)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isIn ? 'pointer' : 'default',
        }} onClick={isIn ? openEnv : undefined}>
          {isIn && (
            <span style={{ fontSize: '28px', animation: 'pulse 1.6s ease infinite' }}>💌</span>
          )}
        </div>

        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '100px',
          background: 'linear-gradient(180deg, #f7e8d8, #f0ddc8)',
          borderRadius: '6px 6px 12px 12px', border: '2px solid #e3cdb5',
          cursor: isIn || isOpen ? 'pointer' : 'default', zIndex: 2,
        }} onClick={isIn ? openEnv : isOpen ? closeEnv : undefined} />

        <div style={{
          position: 'absolute', left: '12px', right: '12px', height: '118px', zIndex: 4,
          cursor: isOpen ? 'pointer' : 'default',
          transform: `translateY(${lY}) scale(${lS})`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isIn ? 0 : 1,
          pointerEvents: isIn ? 'none' : 'auto',
        }} onClick={isOpen ? pullLetter : undefined}>
          <div style={{
            width: '100%', height: '100%', position: 'relative',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              background: 'linear-gradient(180deg, #fffdf7, #fff)',
              borderRadius: '8px', padding: '18px 14px 12px',
              boxShadow: '0 3px 14px rgba(0,0,0,0.06)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#e91e63', margin: '0 0 6px' }}>Hai Zahwa! 👋</p>
              <p style={{ fontSize: '11px', color: '#4a1a2c', lineHeight: 1.6, margin: '0', textAlign: 'center' }}>Makasih udah jadi teman</p>
              <p style={{ fontSize: '11px', color: '#4a1a2c', lineHeight: 1.6, margin: '2px 0 0', textAlign: 'center' }}>yang selalu peduli dan</p>
              <p style={{ fontSize: '11px', color: '#4a1a2c', lineHeight: 1.6, margin: '2px 0 0', textAlign: 'center' }}>ngertiin aku selama ini.</p>
            </div>
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              background: 'linear-gradient(180deg, #fff, #fffdf7)',
              borderRadius: '8px', padding: '18px 14px 12px',
              boxShadow: '0 3px 14px rgba(0,0,0,0.06)',
              transform: 'rotateY(180deg)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#e91e63', margin: '0 0 6px' }}>Balikannya~ ✨</p>
              <p style={{ fontSize: '11px', color: '#4a1a2c', lineHeight: 1.6, margin: '0', textAlign: 'center' }}>Apapun yang terjadi,</p>
              <p style={{ fontSize: '11px', color: '#4a1a2c', lineHeight: 1.6, margin: '2px 0 0', textAlign: 'center' }}>aku bakal selalu ada</p>
              <p style={{ fontSize: '11px', color: '#4a1a2c', lineHeight: 1.6, margin: '2px 0 0', textAlign: 'center' }}>buat dengerin ceritamu.</p>
            </div>
          </div>
        </div>
      </div>

      {isOut && (
        <div style={{ display: 'flex', gap: '6px', animation: 'popIn 0.3s ease' }}>
          <button style={{
            padding: '7px 13px', fontSize: '11px', fontWeight: 600,
            border: '1.5px solid #e53935', borderRadius: '10px', cursor: 'pointer',
            background: '#fff', color: '#e53935', fontFamily: 'Poppins, sans-serif',
          }} onClick={flipLetter}>🔄 Balik</button>
          <button style={{
            padding: '7px 13px', fontSize: '11px', fontWeight: 600,
            border: '1.5px solid #e53935', borderRadius: '10px', cursor: 'pointer',
            background: '#fff', color: '#e53935', fontFamily: 'Poppins, sans-serif',
          }} onClick={putBack}>📨 Masukin</button>
          <button style={{
            padding: '7px 18px', fontSize: '11px', fontWeight: 700,
            border: 'none', borderRadius: '10px', cursor: 'pointer',
            background: 'linear-gradient(135deg, #e91e63, #c2185b)',
            color: '#fff', fontFamily: 'Poppins, sans-serif',
          }}             onClick={onDone}>Selesai ✨</button>
        </div>
      )}
    </div>
  )
}

export default function Card() {
  const navigate = useNavigate()
  const [idx, setIdx] = useState(0)
  const [ready, setReady] = useState(false)
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  const [typingDone, setTypingDone] = useState(false)
  const [btnShow, setBtnShow] = useState(false)
  const [cakeBlown, setCakeBlown] = useState(false)
  const [envDone, setEnvDone] = useState(false)
  const [musicBlocked, setMusicBlocked] = useState(false)
  const cardRef = useRef(null)
  const transitioning = useRef(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const startConfetti = async () => {
      const c = (await import('canvas-confetti')).default
      const e = Date.now() + 3500
      const f = () => {
        c({ particleCount: 3, angle: 60, spread: 50, origin: { x: 0, y: 0.7 }, colors: ['#e91e63','#f48fb1','#ff80ab'] })
        c({ particleCount: 3, angle: 120, spread: 50, origin: { x: 1, y: 0.7 }, colors: ['#e91e63','#f48fb1','#ff80ab'] })
        if (Date.now() < e) requestAnimationFrame(f)
      }
      f()
      setTimeout(() => c({ particleCount: 100, spread: 100, origin: { y: 0.6 }, colors: ['#e91e63','#f48fb1','#ff80ab','#f8bbd0','#ff4081'] }), 500)
    }
    startConfetti()
    const t = setTimeout(() => setReady(true), 2000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (ready) {
      const t = setTimeout(() => setShow(true), 100)
      return () => clearTimeout(t)
    }
  }, [ready])

  useEffect(() => {
    if (show) {
      setTypingDone(false)
      setBtnShow(false)
      setCakeBlown(false)
      setEnvDone(false)
    }
  }, [show])

  useEffect(() => {
    if (typingDone) {
      const t = setTimeout(() => setBtnShow(true), 400)
      return () => clearTimeout(t)
    }
  }, [typingDone])

  const playMusic = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = 0.35
    a.loop = true
    a.play().then(() => setMusicBlocked(false)).catch(() => setMusicBlocked(true))
  }, [])

  useEffect(() => {
    const t = setTimeout(playMusic, 500)
    return () => clearTimeout(t)
  }, [playMusic])

  const next = () => {
    if (transitioning.current) return
    transitioning.current = true
    setShow(false)
    setTimeout(() => {
      transitioning.current = false
      if (idx < cards.length - 1) {
        setIdx(idx + 1)
        setShow(true)
      } else {
        setDone(true)
      }
    }, 300)
  }

  const isCake = idx === cards.length - 2
  const isEnvelope = idx === cards.length - 1

  return (
    <div style={st.page}>
      <div style={st.sky}>
        <div style={st.glow1} />
        <div style={st.glow2} />
        <div style={st.stars}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{
              position: 'absolute',
              left: `${(i * 15 + 6) % 100}%`,
              top: `${(i * 8 + 5) % 100}%`,
              fontSize: `${8 + (i % 3) * 5}px`,
              opacity: 0.4 + (i % 3) * 0.2,
              animation: `twinkle ${2.5 + (i % 2)}s ease-in-out ${i * 0.3}s infinite`,
              color: '#fff', willChange: 'transform',
            }}>✦</span>
          ))}
        </div>
        <div style={st.floating}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} style={{
              position: 'absolute',
              left: `${15 + i * 24}%`,
              top: `${18 + i * 22}%`,
              fontSize: `${22 + (i % 2) * 10}px`,
              opacity: 0.18 + (i % 2) * 0.1,
              animation: `float ${6 + i}s ease-in-out ${i * 0.8}s infinite`,
              pointerEvents: 'none', willChange: 'transform',
            }}>
              {['💗', '✨', '🌸', '💕'][i]}
            </span>
          ))}
        </div>
      </div>

      <div style={st.rain}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{
            position: 'absolute', left: `${(i * 8 + 4) % 100}%`, top: '-60px',
            fontSize: `${18 + (i % 4) * 6}px`, opacity: 0.75 + (i % 3) * 0.08,
            animation: `rf${i % 3} ${10 + (i % 3) * 3}s linear ${i * 0.3}s infinite`,
            pointerEvents: 'none', userSelect: 'none', willChange: 'transform',
          }}>
            {['💗','✨','💖','🌸','💕','🌟','💘','🥰','💞','🫶','💓','🌷'][i]}
          </span>
        ))}
      </div>

      <div style={st.ctr}>
        {!ready && !done && (
          <div style={st.wait}>
            <div style={st.heartPulse}>💗</div>
            <p style={st.waitT}>Yeay! akhirnya~ 🎉</p>
          </div>
        )}

        {ready && !done && (
          <div style={{ ...st.cw, animation: show ? 'slideIn 0.4s ease' : 'slideOut 0.3s ease forwards' }}>
            <div ref={cardRef} style={st.card}>
              <div style={st.progress}>
                {cards.map((_, i) => (
                  <div key={i} style={{ ...st.dot, background: i <= idx ? '#e91e63' : 'rgba(233,30,99,0.12)' }} />
                ))}
              </div>

              {idx < 5 ? (
                <div style={st.gifWrap}><img src={`/gif/${idx + 1}.gif`} alt="" style={st.gifImg} /></div>
              ) : (
                !isEnvelope && <span style={{ ...st.cardIcon, color: iconColors[idx] }}>{cards[idx].icon}</span>
              )}
              <span style={st.cardTitle}>{cards[idx].title}</span>
              <div style={st.cardBody}>
                {show && !isCake && !isEnvelope && (
                  <TypeText lines={cards[idx].lines} speed={34} onDone={() => setTypingDone(true)} />
                )}
                {isCake && (
                  <>
                    <p style={{
                      fontSize: '13px', color: '#880e4f', marginBottom: '8px',
                      animation: 'popIn 0.4s ease', fontWeight: 500,
                    }}>
                      Sekarang, tiup lilin dan buat permintaan! 🎂✨
                    </p>
                    <CakeScene onBlown={() => setCakeBlown(true)} />
                    {cakeBlown && (
                      <p style={{
                        fontSize: '14px', color: '#e91e63', fontWeight: 700,
                        marginTop: '8px', animation: 'popIn 0.5s ease',
                      }}>
                        Yeay! Happy birthday, Zahwa! 🥳🎉✨
                      </p>
                    )}
                  </>
                )}
                {isEnvelope && (
                  <EnvelopeScene onDone={() => setEnvDone(true)} />
                )}
              </div>

              {show && !isCake && !isEnvelope && btnShow && (
                <button style={st.btn} onClick={next}>Lanjut ✨</button>
              )}
              {isCake && cakeBlown && (
                <button style={st.btn} onClick={next}>Lanjut ✨</button>
              )}
              {isEnvelope && envDone && (
                <button style={st.btn} onClick={next}>Selesai ✨</button>
              )}
            </div>
          </div>
        )}

        {done && (
          <div style={st.final}>
            <div style={st.finalCard}>
              <span style={{ fontSize: '48px', display: 'block' }}>🥳🎉✨</span>
              <p style={st.finalT}>
                Selamat Ulang Tahun, Zahwa!
                <br />
                <span style={{ fontSize: '16px', color: '#e91e63' }}>Semoga selalu bahagia! 🌟</span>
              </p>
              <div style={st.finalEmo}>
                {Array.from('💗✨💖🌸💕🌟💘').map((e, i) => (
                  <span key={i} style={{ fontSize: '22px', animation: `popIn 0.5s ease ${i * 0.12}s both` }}>{e}</span>
                ))}
              </div>
              <p style={st.finalMsg}>
                Sebelum kamu pergi, foto booth dulu yuk~
                <br />
                Biar momen bahagia ini selalu terabadikan ✨
              </p>
              <Link to="/camera" style={st.finalBtn}>
                📸 Lanjut Foto
              </Link>
            </div>
          </div>
        )}
      </div>

      <audio ref={audioRef} src="/music/Jaz - Bersamamu (Official Lyric Video) [D-VytLhH-KE].mp3" preload="auto" />

      {musicBlocked && (
        <button onClick={playMusic} style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 10,
          width: '48px', height: '48px', borderRadius: '50%',
          border: 'none', cursor: 'pointer', fontSize: '20px',
          background: 'rgba(233,30,99,0.9)', color: '#fff',
          boxShadow: '0 4px 16px rgba(233,30,99,0.3)',
          fontFamily: 'Poppins, sans-serif',
        }}>🎵</button>
      )}

      <style>{`
        @keyframes rf0{0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}8%{opacity:1}20%{transform:translateY(20vh) translateX(8px) rotate(120deg)}50%{transform:translateY(50vh) translateX(-5px) rotate(240deg)}80%{transform:translateY(80vh) translateX(6px) rotate(360deg);opacity:0.8}100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(480deg);opacity:0}}
        @keyframes rf1{0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}8%{opacity:1}20%{transform:translateY(20vh) translateX(-6px) rotate(-90deg)}50%{transform:translateY(50vh) translateX(9px) rotate(-200deg)}80%{transform:translateY(80vh) translateX(-4px) rotate(-320deg);opacity:0.85}100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(-400deg);opacity:0}}
        @keyframes rf2{0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}8%{opacity:1}20%{transform:translateY(20vh) translateX(10px) rotate(80deg)}50%{transform:translateY(50vh) translateX(-8px) rotate(180deg)}80%{transform:translateY(80vh) translateX(5px) rotate(280deg);opacity:0.85}100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(380deg);opacity:0}}
        @keyframes popIn{0%{transform:scale(0.3) translateY(10px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}
        @keyframes slideIn{0%{transform:translateX(60px) scale(0.96);opacity:0}100%{transform:translateX(0) scale(1);opacity:1}}
        @keyframes slideOut{0%{transform:translateX(0) scale(1);opacity:1}100%{transform:translateX(-60px) scale(0.96);opacity:0}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
        @keyframes twinkle{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}
        @keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(10deg)}}
        @keyframes flicker{0%{transform:scaleY(1) scaleX(1)}25%{transform:scaleY(1.08) scaleX(0.92)}50%{transform:scaleY(0.92) scaleX(1.05)}75%{transform:scaleY(1.05) scaleX(0.95)}100%{transform:scaleY(0.95) scaleX(1.02)}}
        @keyframes puffUp{0%{transform:scale(1) translateY(0);opacity:0.4}100%{transform:scale(2.5) translateY(-30px);opacity:0}}
      `}</style>
    </div>
  )
}

const st = {
  page: {
    minHeight: '100vh', fontFamily: 'Poppins, sans-serif',
    position: 'relative', overflow: 'hidden',
  },
  sky: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
    background: 'linear-gradient(160deg, #1a0a2e 0%, #2d1b4e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%)',
    overflow: 'hidden',
  },
  glow1: {
    position: 'absolute', top: '15%', left: '20%', width: '400px', height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(233,30,99,0.12) 0%, transparent 70%)',
    animation: 'drift 8s ease-in-out infinite',
  },
  glow2: {
    position: 'absolute', bottom: '20%', right: '15%', width: '350px', height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(156,39,176,0.1) 0%, transparent 70%)',
    animation: 'drift 10s ease-in-out infinite reverse',
  },
  stars: {
    position: 'absolute', inset: 0,
  },
  floating: {
    position: 'absolute', inset: 0,
  },
  rain: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
  },
  ctr: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px 14px', position: 'relative', zIndex: 1,
  },
  wait: {
    textAlign: 'center', animation: 'popIn 0.5s ease',
  },
  heartPulse: {
    fontSize: '52px', animation: 'pulse 1.2s ease infinite',
  },
  waitT: {
    fontSize: '18px', fontWeight: 600, color: '#e91e63', marginTop: '12px',
  },
  cw: {
    width: '100%', maxWidth: '440px', margin: '0 auto',
  },
  card: {
    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
    borderRadius: '32px', padding: '28px 24px',
    boxShadow: '0 16px 48px rgba(233,30,99,0.12)',
    border: '1px solid rgba(255,255,255,0.4)',
    textAlign: 'center', position: 'relative', overflow: 'hidden',
  },
  progress: {
    display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '18px',
  },
  dot: {
    width: '8px', height: '8px', borderRadius: '50%',
    transition: 'background 0.3s',
  },
  gifWrap: {
    width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
    margin: '0 auto 10px', boxShadow: '0 4px 16px rgba(233,30,99,0.15)',
    border: '3px solid rgba(233,30,99,0.1)',
  },
  gifImg: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
  },
  cardIcon: {
    fontSize: '40px', display: 'block', marginBottom: '6px',
  },
  cardTitle: {
    fontSize: '16px', fontWeight: 700, color: '#880e4f',
    display: 'block', marginBottom: '16px',
    letterSpacing: '0.5px',
  },
  cardBody: {
    fontSize: '14px', color: '#4a1a2c', lineHeight: 1.9,
    textAlign: 'center', marginBottom: '8px', minHeight: '120px',
  },
  btn: {
    marginTop: '6px', padding: '13px 34px', fontSize: '15px', fontWeight: 700,
    border: 'none', borderRadius: '16px', cursor: 'pointer',
    background: 'linear-gradient(135deg, #e91e63, #c2185b)',
    color: '#fff', fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 6px 20px rgba(233,30,99,0.25)',
    animation: 'popIn 0.4s ease', transition: 'transform 0.15s',
  },
  final: {
    animation: 'popIn 0.5s ease', textAlign: 'center',
  },
  finalCard: {
    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
    borderRadius: '32px', padding: '32px 24px',
    maxWidth: '400px', width: '100%',
    boxShadow: '0 16px 48px rgba(233,30,99,0.12)',
    border: '1px solid rgba(255,255,255,0.4)',
  },
  finalT: {
    fontSize: '18px', fontWeight: 700, color: '#c2185b',
    lineHeight: 1.7, marginTop: '8px', marginBottom: '16px',
  },
  finalEmo: {
    display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap',
  },
  finalMsg: {
    fontSize: '13px', color: '#ad1457', lineHeight: 1.7,
    marginTop: '18px', marginBottom: '16px', opacity: 0.75,
  },
  finalBtn: {
    display: 'inline-block', padding: '14px 36px', fontSize: '16px', fontWeight: 700,
    border: 'none', borderRadius: '16px', cursor: 'pointer',
    background: 'linear-gradient(135deg, #e91e63, #c2185b)',
    color: '#fff', fontFamily: 'Poppins, sans-serif', textDecoration: 'none',
    boxShadow: '0 6px 24px rgba(233,30,99,0.3)',
    transition: 'transform 0.2s',
  },
}
