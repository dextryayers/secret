import { useState, useRef, useEffect, useCallback } from 'react'

const PW = 270, PH = 480

const frames = [
  { name: 'Love 💗', id: 0, color: '#e91e63' },
  { name: 'Crown 👑', id: 1, color: '#ff6f00' },
  { name: 'Star 🌟', id: 2, color: '#7c4dff' },
  { name: 'Polaroid 📸', id: 3, color: '#ad1457' },
  { name: 'Butterfly 🦋', id: 4, color: '#ce93d8' },
  { name: 'Rainbow 🌈', id: 5, color: '#d500f9' },
  { name: 'Cloud ☁️', id: 6, color: '#42a5f5' },
  { name: 'Moon 🌙', id: 7, color: '#5c6bc0' },
]

function drawFrame(ctx, idx) {
  const w = PW, h = PH
  const p = Math.min(w, h) * 0.03
  const cx = w / 2, cy = h / 2
  ctx.save()

  const corner = (emoji, sz) => {
    ctx.font = `${sz || p * 2.4}px sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const d = p * 1.8
    ctx.fillText(emoji, d, d); ctx.fillText(emoji, w - d, d)
    ctx.fillText(emoji, d, h - d); ctx.fillText(emoji, w - d, h - d)
  }

  const scatter = (emoji, n, radius, alpha = 0.3) => {
    ctx.globalAlpha = alpha; ctx.font = `${p * 1.6}px sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const r = radius || p * 2.5
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.3
      ctx.fillText(emoji, cx + r * Math.cos(a), cy + r * Math.sin(a))
    }
    ctx.globalAlpha = 1
  }

  const edgeDeco = (emoji, count, offset = 0) => {
    ctx.font = `${p * 1.3}px sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const gap = (w - p * 3.6) / (count + 1)
    for (let i = 0; i < count; i++) {
      const x = p * 1.8 + gap * (i + 1)
      ctx.fillText(emoji, x, p * 1.8 + offset)
      ctx.fillText(emoji, x, h - p * 1.8 - offset)
    }
  }

  const label = (text, pos) => {
    ctx.font = `600 ${p * 1.6}px sans-serif`
    ctx.fillStyle = pos === 'top' ? ctx.strokeStyle : ctx.fillStyle
    ctx.textAlign = 'center'; ctx.textBaseline = pos === 'top' ? 'top' : 'bottom'
    ctx.fillText(text, cx, pos === 'top' ? p * 0.6 : h - p * 0.6)
  }

  if (idx === 0) {
    ctx.shadowColor = 'rgba(233,30,99,0.18)'; ctx.shadowBlur = 16
    ctx.strokeStyle = '#e91e63'; ctx.lineWidth = p * 2.6
    ctx.strokeRect(p * 0.6, p * 0.6, w - p * 1.2, h - p * 1.2)
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#f48fb1'; ctx.lineWidth = p * 0.5; ctx.setLineDash([p * 0.8, p * 0.6])
    ctx.strokeRect(p * 0.3, p * 0.3, w - p * 0.6, h - p * 0.6); ctx.setLineDash([])
    ctx.fillStyle = '#e91e63'
    edgeDeco('💗', 6, p * 0.3)
    corner('💗', p * 2.6)
    ctx.fillStyle = '#e91e63'
    label('💗 Love You 💗', 'bottom')
  } else if (idx === 1) {
    ctx.shadowColor = 'rgba(255,215,0,0.15)'; ctx.shadowBlur = 14
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = p * 2.4
    ctx.strokeRect(p * 0.8, p * 0.8, w - p * 1.6, h - p * 1.6)
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#ff8f00'; ctx.lineWidth = p * 0.6
    ctx.strokeRect(p * 0.3, p * 0.3, w - p * 0.6, h - p * 0.6)
    ctx.font = `${p * 3.2}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
    ctx.fillStyle = '#ffd700'
    ctx.fillText('👑', cx, p * 0.4)
    ctx.fillStyle = '#ffd700'
    corner('👑', p * 2.4)
    scatter('✨', 8, p * 3, 0.35)
    ctx.fillStyle = '#ff6f00'
    label('👑 Zahwa 👑', 'bottom')
  } else if (idx === 2) {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#7c4dff'); g.addColorStop(1, '#e040fb')
    ctx.shadowColor = 'rgba(124,77,255,0.18)'; ctx.shadowBlur = 18
    ctx.strokeStyle = g; ctx.lineWidth = p * 2.2
    ctx.strokeRect(p * 0.7, p * 0.7, w - p * 1.4, h - p * 1.4)
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#b388ff'; ctx.lineWidth = p * 0.4
    ctx.strokeRect(p * 0.3, p * 0.3, w - p * 0.6, h - p * 0.6)
    ctx.fillStyle = '#7c4dff'
    corner('⭐', p * 2.6)
    scatter('✨', 10, p * 2.8, 0.35)
    edgeDeco('⭐', 5, p * 0.2)
    ctx.fillStyle = '#7c4dff'
    label('✨🌟✨', 'bottom')
  } else if (idx === 3) {
    const bh = h * 0.18
    ctx.shadowColor = 'rgba(0,0,0,0.03)'; ctx.shadowBlur = 6
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = p * 0.4
    ctx.strokeRect(p * 0.4, p * 0.4, w - p * 0.8, h - bh - p * 0.4)
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.fillRect(0, h - bh, w, bh)
    ctx.fillStyle = '#880e4f'
    ctx.font = `600 ${bh * 0.22}px sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const d = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    ctx.fillText(`💗 Zahwa • ${d} 💗`, cx, h - bh / 2)
    ctx.fillStyle = '#ad1457'
    ctx.font = `${bh * 0.3}px sans-serif`
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
    ctx.fillText('🌸', p * 1.2, h - bh / 2)
    ctx.textAlign = 'right'
    ctx.fillText('💗', w - p * 1.2, h - bh / 2)
    ctx.fillStyle = '#e0e0e0'; ctx.lineWidth = p * 0.3
    ctx.strokeRect(p * 0.4, p * 0.4, w - p * 0.8, h - p * 0.4)
  } else if (idx === 4) {
    ctx.shadowColor = 'rgba(206,147,216,0.15)'; ctx.shadowBlur = 16
    ctx.strokeStyle = '#ce93d8'; ctx.lineWidth = p * 1.8; ctx.setLineDash([p * 1.2, p * 0.8])
    ctx.strokeRect(p * 0.8, p * 0.8, w - p * 1.6, h - p * 1.6); ctx.setLineDash([])
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#ab47bc'; ctx.lineWidth = p * 0.5
    ctx.strokeRect(p * 0.3, p * 0.3, w - p * 0.6, h - p * 0.6)
    ctx.fillStyle = '#ce93d8'
    corner('🦋', p * 2.6)
    scatter('💜', 8, p * 3, 0.3)
    scatter('🌸', 6, p * 2, 0.2)
    ctx.fillStyle = '#ab47bc'
    label('🦋💗🦋', 'bottom')
  } else if (idx === 5) {
    const colors = ['#e91e63','#ff6f00','#ffd600','#00c853','#2979ff','#d500f9']
    const seg = (Math.PI / 2) / (colors.length - 1)
    for (let i = 0; i < colors.length; i++) {
      ctx.strokeStyle = colors[i]; ctx.lineWidth = p * 1.6
      const a1 = i * seg; const a2 = (i + 1) * seg
      ctx.beginPath()
      ctx.arc(p * 1.8, p * 1.8, p * 3, Math.PI + a1, Math.PI + a2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(w - p * 1.8, p * 1.8, p * 3, -a2, -a1)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(p * 1.8, h - p * 1.8, p * 3, Math.PI / 2 + a1, Math.PI / 2 + a2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(w - p * 1.8, h - p * 1.8, p * 3, -Math.PI / 2 + a1, -Math.PI / 2 + a2)
      ctx.stroke()
    }
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = p * 0.3; ctx.setLineDash([p * 0.5, p * 0.5])
    ctx.strokeRect(p * 0.4, p * 0.4, w - p * 0.8, h - p * 0.8); ctx.setLineDash([])
    scatter('🌈', 8, p * 3.2, 0.25)
    scatter('⭐', 6, p * 2, 0.2)
    ctx.fillStyle = '#d500f9'
    label('🌈 Colorful 🌈', 'bottom')
  } else if (idx === 6) {
    ctx.shadowColor = 'rgba(66,165,245,0.12)'; ctx.shadowBlur = 14
    ctx.strokeStyle = '#90caf9'; ctx.lineWidth = p * 2.4
    ctx.strokeRect(p * 0.7, p * 0.7, w - p * 1.4, h - p * 1.4)
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#e3f2fd'; ctx.lineWidth = p * 1; ctx.setLineDash([p * 0.8, p * 0.6])
    ctx.strokeRect(p * 0.2, p * 0.2, w - p * 0.4, h - p * 0.4); ctx.setLineDash([])
    ctx.fillStyle = '#42a5f5'
    corner('☁️', p * 2.6)
    scatter('💙', 8, p * 3, 0.3)
    edgeDeco('💙', 5, p * 0.2)
    ctx.fillStyle = '#42a5f5'
    label('☁️💙☁️', 'bottom')
  } else {
    ctx.shadowColor = 'rgba(92,107,192,0.15)'; ctx.shadowBlur = 16
    ctx.strokeStyle = '#5c6bc0'; ctx.lineWidth = p * 2.4
    ctx.strokeRect(p * 0.7, p * 0.7, w - p * 1.4, h - p * 1.4)
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#c5cae9'; ctx.lineWidth = p * 0.5
    ctx.strokeRect(p * 0.3, p * 0.3, w - p * 0.6, h - p * 0.6)
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = p * 0.3; ctx.setLineDash([p * 0.6, p * 0.6])
    ctx.strokeRect(p * 0.5, p * 0.5, w - p, h - p); ctx.setLineDash([])
    ctx.fillStyle = '#5c6bc0'
    corner('🌙', p * 2.6)
    ctx.fillStyle = '#ffd700'
    scatter('⭐', 10, p * 3, 0.4)
    ctx.fillStyle = '#5c6bc0'
    label('🌙⭐🌙', 'bottom')
  }
  ctx.restore()
}

const overlayStyles = [
  { boxShadow: 'inset 0 0 0 5px #e91e63, inset 0 0 0 8px #f48fb1', borderRadius: '12px' },
  { boxShadow: 'inset 0 0 0 4px #ffd700, inset 0 0 0 7px #ffe082', borderRadius: '12px' },
  { boxShadow: 'inset 0 0 0 4px #7c4dff, inset 0 0 0 7px rgba(124,77,255,0.12)', borderRadius: '12px' },
  { boxShadow: 'inset 0 0 0 6px #fff, 0 0 0 1px #e0e0e0', borderRadius: '12px' },
  { boxShadow: 'inset 0 0 0 5px #ce93d8, inset 0 0 0 8px #f3e5f5', borderRadius: '12px' },
  { boxShadow: 'inset 0 0 0 4px #e91e63, inset 0 0 0 7px #ffd600', borderRadius: '12px' },
  { boxShadow: 'inset 0 0 0 5px #90caf9', borderRadius: '12px' },
  { boxShadow: 'inset 0 0 0 5px #5c6bc0, inset 0 0 0 8px #c5cae9', borderRadius: '12px' },
]

export default function Camera() {
  const videoRef = useRef(null)
  const snapRef = useRef(null)
  const stripRef = useRef(null)
  const streamRef = useRef(null)
  const cdRef = useRef(null)
  const [frameIdx, setFrameIdx] = useState(0)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [camReady, setCamReady] = useState(false)
  const [camError, setCamError] = useState(null)
  const [countdown, setCountdown] = useState(null)
  const [dlBusy, setDlBusy] = useState(false)

  const startCam = useCallback(async () => {
    setLoading(true); setCamReady(false); setCamError(null)
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('nosupport')
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'user' }, width: { ideal: 360 }, height: { ideal: 640 } },
        audio: false,
      })
      streamRef.current = s
      const v = videoRef.current
      if (!v) { setLoading(false); return }
      v.srcObject = s
      await new Promise(r => { v.onloadedmetadata = () => r(); setTimeout(r, 5000) })
      await v.play()
      setCamReady(true); setLoading(false)
    } catch (e) {
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError')
        setCamError('Kameranya di blokir 😢\nIzinin dulu yaa di pengaturan browser~ 💗')
      else if (e.message === 'nosupport')
        setCamError('Browser kamu gak support kamera 😢\nCoba pake HP atau Chrome yaa~')
      else setCamError('Kamera error nih 😢\nCoba refresh atau tekan tombol di bawah~')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    startCam()
    return () => {
      if (cdRef.current) { clearInterval(cdRef.current); cdRef.current = null }
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [startCam])

  const snap = useCallback(() => {
    const v = videoRef.current; const c = snapRef.current
    if (!v || !c) return
    const vw = v.videoWidth || 360; const vh = v.videoHeight || 640
    c.width = PW; c.height = PH
    const ctx = c.getContext('2d')
    ctx.translate(PW, 0); ctx.scale(-1, 1)
    let sx, sy, sw, sh
    if (vh / vw > PH / PW) {
      sh = vw * PH / PW; sw = vw; sx = 0; sy = (vh - sh) / 2
    } else {
      sw = vh * PW / PH; sh = vh; sx = (vw - sw) / 2; sy = 0
    }
    ctx.drawImage(v, sx, sy, sw, sh, 0, 0, PW, PH)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    drawFrame(ctx, frameIdx)
    const data = c.toDataURL('image/png')
    setPhotos(prev => prev.length < 4 ? [...prev, data] : prev)
  }, [frameIdx])

  const captureWithCountdown = useCallback(() => {
    if (photos.length >= 4 || cdRef.current !== null) return
    cdRef.current = 3; setCountdown(3)
    const timer = setInterval(() => {
      cdRef.current--
      if (cdRef.current <= 0) {
        clearInterval(timer); cdRef.current = null; setCountdown(null); snap()
      } else setCountdown(cdRef.current)
    }, 1000)
  }, [photos.length, snap])

  const reset = () => {
    setPhotos([]); setCountdown(null)
    if (cdRef.current) { clearInterval(cdRef.current); cdRef.current = null }
  }

  const downloadStrip = () => {
    if (photos.length < 4 || dlBusy) return
    setDlBusy(true)
    const c = stripRef.current; if (!c) { setDlBusy(false); return }
    const gap = 8, pd = 16
    const tw = PW * 2 + gap + pd * 2, th = PH * 2 + gap + pd * 2 + 36
    c.width = tw; c.height = th
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, tw, th)
    const bg = ctx.createLinearGradient(0, 0, tw, th)
    bg.addColorStop(0, '#fce4ec'); bg.addColorStop(1, '#f8bbd0')
    ctx.fillStyle = bg; ctx.beginPath(); ctx.rect(3, 3, tw - 6, th - 6); ctx.fill()
    let loaded = 0
    photos.forEach((src, i) => {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, pd + (i % 2) * (PW + gap), pd + Math.floor(i / 2) * (PH + gap), PW, PH)
        loaded++
        if (loaded === 4) {
          ctx.fillStyle = '#e91e63'
          ctx.font = '600 13px sans-serif'
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
          ctx.fillText(`💗 Zahwa — Happy Birthday! 💗 • ${frames[frameIdx].name}`, tw / 2, th - 6)
          try {
            const link = document.createElement('a')
            const name = `zahwa-${frames[frameIdx].name.split(' ')[0].toLowerCase()}-${new Date().toISOString().slice(0, 10)}`
            link.download = `${name}.png`; link.href = c.toDataURL('image/png')
            document.body.appendChild(link); link.click(); document.body.removeChild(link)
          } catch (e) { /* fallback */ }
          setDlBusy(false)
        }
      }
      img.onerror = () => { loaded++; if (loaded === 4) setDlBusy(false) }
      img.src = src
    })
  }

  const showCam = camReady && !camError
  const done = photos.length >= 4

  return (
    <div style={s.page}>
      <div style={s.rain}>
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} style={{
            position: 'absolute', left: `${(i * 3.5 + 3) % 100}%`, top: '-60px',
            fontSize: `${14 + (i % 7) * 5}px`, opacity: 0.7 + (i % 4) * 0.1,
            animation: `rf${i % 3} ${8 + (i % 3) * 2.5}s linear ${i * 0.22}s infinite`,
            pointerEvents: 'none', userSelect: 'none',
          }}>{['💗','✨','💖','🌸','💕','🌟','💘','🥰','💞','🫶','💓','🌷','💝','🩷'][i % 14]}</span>
        ))}
      </div>

      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.header}>
            <span style={{ fontSize: '20px' }}>📸</span>
            <h2 style={s.title}>Photo Booth</h2>
            <p style={s.sub}>Pilih tema, pose 4x, abadiin~ 💕</p>
          </div>

          <div style={{
            display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '10px',
            WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory',
          }}>
            {frames.map(f => (
              <button key={f.id} onClick={() => {
                if (!done) setFrameIdx(f.id)
              }} style={{
                flex: '0 0 auto', scrollSnapAlign: 'start',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                padding: '8px 10px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
                border: frameIdx === f.id ? `2px solid ${f.color}` : '1.5px solid rgba(233,30,99,0.1)',
                borderRadius: '12px', cursor: done ? 'default' : 'pointer',
                background: frameIdx === f.id ? `${f.color}15` : '#fff',
                color: frameIdx === f.id ? f.color : '#ad1457',
                fontFamily: 'Poppins, sans-serif', opacity: done ? 0.4 : 1,
              }}>
                <span style={{ fontSize: '18px' }}>{frames[f.id].name.split(' ')[1]}</span>
                <span>{f.name}</span>
              </button>
            ))}
          </div>

          <div style={{
            position: 'relative', borderRadius: '12px', overflow: 'hidden',
            background: '#000', marginBottom: '10px', aspectRatio: '9/16',
            maxHeight: '420px',
          }}>
            <video ref={videoRef} autoPlay playsInline muted style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover', transform: 'scaleX(-1)',
            }} />
            {showCam && !done && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: 'none', zIndex: 2, ...overlayStyles[frameIdx],
              }} />
            )}
            {countdown !== null && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.3)',
              }}>
                <span style={{
                  fontSize: '90px', fontWeight: 700, color: '#fff',
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  animation: 'cdPop 0.8s ease forwards',
                }}>{countdown}</span>
              </div>
            )}
            {loading && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '12px',
                background: 'rgba(0,0,0,0.55)',
              }}>
                <div style={{ width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'sp 0.7s linear infinite' }} />
                <p style={{ fontSize: '13px', color: '#fff', margin: 0 }}>Mengakses kamera...</p>
              </div>
            )}
            {camError && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '12px',
                background: 'rgba(0,0,0,0.55)',
              }}>
                <span style={{ fontSize: '36px' }}>😢</span>
                <p style={{ fontSize: '13px', color: '#fff', margin: 0, textAlign: 'center', whiteSpace: 'pre-line' }}>{camError}</p>
                <button onClick={startCam} style={{
                  padding: '8px 20px', fontSize: '13px', fontWeight: 600,
                  border: 'none', borderRadius: '10px', cursor: 'pointer',
                  background: '#e91e63', color: '#fff', fontFamily: 'Poppins, sans-serif',
                }}>🔄 Coba Lagi</button>
              </div>
            )}
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '10px',
            opacity: showCam ? 1 : 0.2, transition: 'opacity 0.3s',
          }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                aspectRatio: '9/16', borderRadius: '8px', overflow: 'hidden',
                background: photos[i] ? 'transparent' : 'rgba(233,30,99,0.03)',
                border: photos[i] ? 'none' : '1px solid rgba(233,30,99,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {photos[i] ? (
                  <img src={photos[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <span style={{ fontSize: i === photos.length ? '16px' : '24px', color: i === photos.length ? '#e91e63' : 'rgba(233,30,99,0.1)', fontWeight: 700 }}>
                    {i === photos.length ? '📸' : `${i + 1}`}
                  </span>
                )}
              </div>
            ))}
          </div>

          {showCam && !done && (
            <div style={{ animation: 'pop 0.35s ease' }}>
              <p style={{ fontSize: '13px', color: '#ad1457', opacity: 0.6, marginBottom: '8px' }}>
                {photos.length === 0 ? 'Siap-siap yaa~ 🥰' : `Sisa ${4 - photos.length} foto lagi! 💪`}
              </p>
              <button style={{
                padding: '13px 0', fontSize: '14px', fontWeight: 700, width: '100%',
                border: 'none', borderRadius: '14px', cursor: countdown !== null ? 'default' : 'pointer',
                background: countdown !== null ? '#ccc' : 'linear-gradient(135deg, #e91e63, #c2185b)',
                color: '#fff', fontFamily: 'Poppins, sans-serif', outline: 'none',
              }} onClick={captureWithCountdown} disabled={countdown !== null}>
                {countdown !== null ? `⏳ ${countdown}` : `📸 Foto ${photos.length + 1}`}
              </button>
            </div>
          )}

          {showCam && done && (
            <div style={{ animation: 'pop 0.5s ease' }}>
              <span style={{ fontSize: '36px', display: 'block' }}>🥳💗</span>
              <p style={{ fontSize: '14px', color: '#880e4f', lineHeight: 1.7, marginTop: '8px', marginBottom: '14px' }}>
                Yeay! 4 fotonya udah jadi~ 🎉
                <br />Download collage nya sekarang!
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button style={{
                  flex: 1, padding: '12px', fontSize: '14px', fontWeight: 600,
                  border: '2px solid #e57373', borderRadius: '14px', cursor: 'pointer',
                  background: '#fff', color: '#e53935', fontFamily: 'Poppins, sans-serif',
                }} onClick={reset}>🔄 Ulang</button>
                <button style={{
                  flex: 1, padding: '12px', fontSize: '14px', fontWeight: 700,
                  border: 'none', borderRadius: '14px', cursor: dlBusy ? 'default' : 'pointer',
                  background: dlBusy ? '#ccc' : 'linear-gradient(135deg, #e91e63, #c2185b)',
                  color: '#fff', fontFamily: 'Poppins, sans-serif',
                }} onClick={downloadStrip} disabled={dlBusy}>
                  {dlBusy ? '⏳...' : '💾 Download'}
                </button>
              </div>
            </div>
          )}

          <div style={{ fontSize: '10px', color: '#ad1457', opacity: 0.3, marginTop: '16px' }}>dibuat dengan ❤️ untuk Zahwa</div>
        </div>
      </div>

      <canvas ref={snapRef} style={{ display: 'none' }} />
      <canvas ref={stripRef} style={{ display: 'none' }} />

      <style>{`
        @keyframes rf0{0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}8%{opacity:1}20%{transform:translateY(20vh) translateX(8px) rotate(120deg)}50%{transform:translateY(50vh) translateX(-5px) rotate(240deg)}80%{transform:translateY(80vh) translateX(6px) rotate(360deg);opacity:0.8}100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(480deg);opacity:0}}
        @keyframes rf1{0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}8%{opacity:1}20%{transform:translateY(20vh) translateX(-6px) rotate(-90deg)}50%{transform:translateY(50vh) translateX(9px) rotate(-200deg)}80%{transform:translateY(80vh) translateX(-4px) rotate(-320deg);opacity:0.85}100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(-400deg);opacity:0}}
        @keyframes rf2{0%{transform:translateY(-60px) translateX(0) rotate(0deg);opacity:0}8%{opacity:1}20%{transform:translateY(20vh) translateX(10px) rotate(80deg)}50%{transform:translateY(50vh) translateX(-8px) rotate(180deg)}80%{transform:translateY(80vh) translateX(5px) rotate(280deg);opacity:0.85}100%{transform:translateY(calc(100vh+60px)) translateX(0) rotate(380deg);opacity:0}}
        @keyframes pop{0%{transform:scale(0.3) translateY(10px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}
        @keyframes sp{to{transform:rotate(360deg)}}
        @keyframes cdPop{0%{transform:scale(2);opacity:0}50%{transform:scale(1);opacity:1}100%{transform:scale(0.8);opacity:0}}
      `}</style>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(150deg, #fce4ec 0%, #f8bbd0 40%, #f48fb1 100%)', fontFamily: 'Poppins, sans-serif', position: 'relative', overflow: 'hidden' },
  rain: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' },
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', position: 'relative', zIndex: 1 },
  card: { background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)', borderRadius: '32px', padding: '22px 16px', width: '400px', maxWidth: '100%', textAlign: 'center', boxShadow: '0 24px 72px rgba(233,30,99,0.15)', animation: 'pop 0.5s ease' },
  header: { marginBottom: '14px' },
  title: { fontSize: '18px', fontWeight: 700, color: '#e91e63', marginTop: '4px', marginBottom: '4px' },
  sub: { fontSize: '12px', color: '#ad1457', opacity: 0.55 },
}
