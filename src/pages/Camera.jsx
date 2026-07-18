import { useState, useRef, useEffect, useCallback } from 'react'

const RATIOS = [
  { name: '⬜ 1:1', id: 'square', w: 360, h: 360, asp: '1/1' },
  { name: '📱 3:4', id: 'potret', w: 300, h: 400, asp: '3/4' },
  { name: '📲 9:16', id: 'phone', w: 270, h: 480, asp: '9/16' },
  { name: '🖼️ 4:3', id: 'landscape', w: 440, h: 330, asp: '4/3' },
]

const FRAMES = [
  { name: 'Love 💗', id: 0, color: '#e91e63' },
  { name: 'Crown 👑', id: 1, color: '#ff6f00' },
  { name: 'Star 🌟', id: 2, color: '#7c4dff' },
  { name: 'Polaroid 📸', id: 3, color: '#ad1457' },
  { name: 'Butterfly 🦋', id: 4, color: '#ce93d8' },
  { name: 'Rainbow 🌈', id: 5, color: '#d500f9' },
  { name: 'Cloud ☁️', id: 6, color: '#42a5f5' },
  { name: 'Moon 🌙', id: 7, color: '#5c6bc0' },
  { name: 'Ribbon 🎀', id: 8, color: '#c2185b' },
  { name: 'Neon 💜', id: 9, color: '#e040fb' },
  { name: 'Floral 🌸', id: 10, color: '#66bb6a' },
  { name: 'Candy 🍬', id: 11, color: '#ff80ab' },
  { name: 'Galaxy 🌌', id: 12, color: '#1a237e' },
]

/* ── helpers ── */
const P = (w, h, m = 1) => Math.min(w, h) * 0.03 * m

function corner(ctx, w, h, emoji, sz, off) {
  ctx.font = `${sz || P(w, h, 2.4)}px sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  const d = off || P(w, h, 1.8)
  ctx.fillText(emoji, d, d)
  ctx.fillText(emoji, w - d, d)
  ctx.fillText(emoji, d, h - d)
  ctx.fillText(emoji, w - d, h - d)
}

function scatter(ctx, w, h, emoji, n, radius, alpha = 0.3) {
  ctx.globalAlpha = alpha
  ctx.font = `${P(w, h, 1.5)}px sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  const r = radius || P(w, h, 2.5)
  const cx = w / 2, cy = h / 2
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.3
    ctx.fillText(emoji, cx + r * Math.cos(a), cy + r * Math.sin(a))
  }
  ctx.globalAlpha = 1
}

function edgeDeco(ctx, w, h, emoji, count, side, off) {
  ctx.font = `${P(w, h, 1.3)}px sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  const gap = (w - P(w, h, 3.6)) / (count + 1)
  const o = off || 0
  for (let i = 0; i < count; i++) {
    const x = P(w, h, 1.8) + gap * (i + 1)
    if (side === 'top' || !side) ctx.fillText(emoji, x, P(w, h, 1.8) + o)
    if (side === 'bottom' || !side) ctx.fillText(emoji, x, h - P(w, h, 1.8) - o)
  }
}

function edgeSide(ctx, w, h, emoji, count) {
  ctx.font = `${P(w, h, 1.3)}px sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  const gap = (h - P(w, h, 3.6)) / (count + 1)
  for (let i = 0; i < count; i++) {
    const y = P(w, h, 1.8) + gap * (i + 1)
    ctx.fillText(emoji, P(w, h, 1.8), y)
    ctx.fillText(emoji, w - P(w, h, 1.8), y)
  }
}

function label(ctx, w, h, text, pos, color) {
  ctx.font = `600 ${P(w, h, 1.5)}px sans-serif`
  ctx.fillStyle = color || '#e91e63'
  ctx.textAlign = 'center'; ctx.textBaseline = pos === 'top' ? 'top' : 'bottom'
  ctx.fillText(text, w / 2, pos === 'top' ? P(w, h, 0.5) : h - P(w, h, 0.5))
}

function ring(ctx, w, h, colors, thick) {
  const cx = w / 2, cy = h / 2
  const seg = (Math.PI * 2) / colors.length
  for (let i = 0; i < colors.length; i++) {
    ctx.strokeStyle = colors[i]; ctx.lineWidth = thick || P(w, h, 1.4)
    ctx.beginPath()
    ctx.arc(cx, cy, Math.min(w, h) / 2 - P(w, h, 0.6), i * seg - Math.PI / 2, (i + 1) * seg - Math.PI / 2)
    ctx.stroke()
  }
}

/* ── drawFrame ── */
function drawFrame(ctx, w, h, idx) {
  ctx.save()
  const c = (hex, alpha = 0.12) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${alpha})`

  if (idx === 0) {
    ctx.shadowColor = 'rgba(233,30,99,0.2)'; ctx.shadowBlur = 18
    ctx.strokeStyle = '#e91e63'; ctx.lineWidth = P(w, h, 2.6)
    ctx.strokeRect(P(w, h, 0.6), P(w, h, 0.6), w - P(w, h, 1.2), h - P(w, h, 1.2))
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#f48fb1'; ctx.lineWidth = P(w, h, 0.5)
    ctx.setLineDash([P(w, h, 0.8), P(w, h, 0.6)])
    ctx.strokeRect(P(w, h, 0.3), P(w, h, 0.3), w - P(w, h, 0.6), h - P(w, h, 0.6))
    ctx.setLineDash([])
    ctx.fillStyle = '#e91e63'
    corner(ctx, w, h, '💗', P(w, h, 2.6))
    edgeDeco(ctx, w, h, '💗', 6)
    edgeSide(ctx, w, h, '💗', 4)
    scatter(ctx, w, h, '💕', 6, P(w, h, 3), 0.3)
    label(ctx, w, h, '💗 Love You 💗', 'bottom', '#e91e63')
  } else if (idx === 1) {
    ctx.shadowColor = 'rgba(255,215,0,0.18)'; ctx.shadowBlur = 16
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = P(w, h, 2.4)
    ctx.strokeRect(P(w, h, 0.7), P(w, h, 0.7), w - P(w, h, 1.4), h - P(w, h, 1.4))
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#ff8f00'; ctx.lineWidth = P(w, h, 0.6)
    ctx.strokeRect(P(w, h, 0.3), P(w, h, 0.3), w - P(w, h, 0.6), h - P(w, h, 0.6))
    ctx.font = `${P(w, h, 3)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
    ctx.fillStyle = '#ffd700'
    ctx.fillText('👑', w / 2, P(w, h, 0.4))
    ctx.fillStyle = '#ff6f00'
    corner(ctx, w, h, '👑', P(w, h, 2.4))
    scatter(ctx, w, h, '✨', 8, P(w, h, 3.2), 0.35)
    label(ctx, w, h, '👑 Queen Zahwa 👑', 'bottom', '#ff6f00')
  } else if (idx === 2) {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#7c4dff'); g.addColorStop(1, '#e040fb')
    ctx.shadowColor = 'rgba(124,77,255,0.2)'; ctx.shadowBlur = 20
    ctx.strokeStyle = g; ctx.lineWidth = P(w, h, 2.4)
    ctx.strokeRect(P(w, h, 0.7), P(w, h, 0.7), w - P(w, h, 1.4), h - P(w, h, 1.4))
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#b388ff'; ctx.lineWidth = P(w, h, 0.4)
    ctx.strokeRect(P(w, h, 0.3), P(w, h, 0.3), w - P(w, h, 0.6), h - P(w, h, 0.6))
    ctx.fillStyle = '#7c4dff'
    corner(ctx, w, h, '⭐', P(w, h, 2.6))
    edgeDeco(ctx, w, h, '⭐', 5)
    scatter(ctx, w, h, '✨', 10, P(w, h, 3), 0.35)
    label(ctx, w, h, '✨🌟✨', 'bottom', '#7c4dff')
  } else if (idx === 3) {
    const bh = h * 0.18
    ctx.shadowColor = 'rgba(0,0,0,0.03)'; ctx.shadowBlur = 6
    ctx.strokeStyle = '#bdbdbd'; ctx.lineWidth = P(w, h, 0.5)
    ctx.strokeRect(P(w, h, 0.5), P(w, h, 0.5), w - P(w, h, 1), h - P(w, h, 0.5))
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(255,255,255,0.93)'
    ctx.fillRect(0, h - bh, w, bh)
    ctx.fillStyle = '#880e4f'
    ctx.font = `600 ${Math.min(bh * 0.24, P(w, h, 1.6))}px sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const d = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    ctx.fillText(`💗 Zahwa • ${d} 💗`, w / 2, h - bh / 2)
    ctx.fillStyle = '#ad1457'
    ctx.font = `${Math.min(bh * 0.32, P(w, h, 1.8))}px sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText('🌸', P(w, h, 1.2), h - bh / 2)
    ctx.textAlign = 'right'
    ctx.fillText('💗', w - P(w, h, 1.2), h - bh / 2)
  } else if (idx === 4) {
    ctx.shadowColor = 'rgba(206,147,216,0.18)'; ctx.shadowBlur = 18
    ctx.strokeStyle = '#ce93d8'; ctx.lineWidth = P(w, h, 2)
    ctx.setLineDash([P(w, h, 1.2), P(w, h, 0.8)])
    ctx.strokeRect(P(w, h, 0.8), P(w, h, 0.8), w - P(w, h, 1.6), h - P(w, h, 1.6))
    ctx.setLineDash([]); ctx.shadowBlur = 0
    ctx.strokeStyle = '#ab47bc'; ctx.lineWidth = P(w, h, 0.5)
    ctx.strokeRect(P(w, h, 0.3), P(w, h, 0.3), w - P(w, h, 0.6), h - P(w, h, 0.6))
    ctx.fillStyle = '#ce93d8'
    corner(ctx, w, h, '🦋', P(w, h, 2.6))
    scatter(ctx, w, h, '💜', 8, P(w, h, 3), 0.35)
    scatter(ctx, w, h, '🌸', 6, P(w, h, 1.8), 0.2)
    label(ctx, w, h, '🦋💗🦋', 'bottom', '#ab47bc')
  } else if (idx === 5) {
    const colors = ['#e91e63','#ff6f00','#ffd600','#00c853','#2979ff','#d500f9']
    const seg = (Math.PI / 2) / (colors.length - 1)
    const d = P(w, h, 2)
    for (let i = 0; i < colors.length; i++) {
      ctx.strokeStyle = colors[i]; ctx.lineWidth = P(w, h, 1.4)
      for (let [xo, yo, sa, sb] of [[d,d,Math.PI,0],[w-d,d,0,Math.PI/2],[d,h-d,Math.PI/2,Math.PI],[w-d,h-d,-Math.PI/2,0]]) {
        ctx.beginPath()
        ctx.arc(xo, yo, P(w, h, 3.2), sa + i * seg, sa + (i + 1) * seg)
        ctx.stroke()
      }
    }
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = P(w, h, 0.3)
    ctx.setLineDash([P(w, h, 0.5), P(w, h, 0.5)])
    ctx.strokeRect(P(w, h, 0.5), P(w, h, 0.5), w - P(w, h, 1), h - P(w, h, 1))
    ctx.setLineDash([])
    scatter(ctx, w, h, '🌈', 8, P(w, h, 3.2), 0.2)
    scatter(ctx, w, h, '⭐', 6, P(w, h, 2), 0.2)
    label(ctx, w, h, '🌈✨🌈', 'bottom', '#d500f9')
  } else if (idx === 6) {
    ctx.shadowColor = 'rgba(66,165,245,0.15)'; ctx.shadowBlur = 16
    ctx.strokeStyle = '#90caf9'; ctx.lineWidth = P(w, h, 2.4)
    ctx.strokeRect(P(w, h, 0.7), P(w, h, 0.7), w - P(w, h, 1.4), h - P(w, h, 1.4))
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#e3f2fd'; ctx.lineWidth = P(w, h, 1)
    ctx.setLineDash([P(w, h, 0.8), P(w, h, 0.6)])
    ctx.strokeRect(P(w, h, 0.2), P(w, h, 0.2), w - P(w, h, 0.4), h - P(w, h, 0.4))
    ctx.setLineDash([])
    ctx.fillStyle = '#42a5f5'
    corner(ctx, w, h, '☁️', P(w, h, 2.6))
    edgeDeco(ctx, w, h, '💙', 5)
    edgeSide(ctx, w, h, '💙', 3)
    label(ctx, w, h, '☁️💙☁️', 'bottom', '#42a5f5')
  } else if (idx === 7) {
    ctx.shadowColor = 'rgba(92,107,192,0.18)'; ctx.shadowBlur = 18
    ctx.strokeStyle = '#5c6bc0'; ctx.lineWidth = P(w, h, 2.4)
    ctx.strokeRect(P(w, h, 0.7), P(w, h, 0.7), w - P(w, h, 1.4), h - P(w, h, 1.4))
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#c5cae9'; ctx.lineWidth = P(w, h, 0.5)
    ctx.strokeRect(P(w, h, 0.3), P(w, h, 0.3), w - P(w, h, 0.6), h - P(w, h, 0.6))
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = P(w, h, 0.3)
    ctx.setLineDash([P(w, h, 0.6), P(w, h, 0.6)])
    ctx.strokeRect(P(w, h, 0.5), P(w, h, 0.5), w - P(w, h, 1), h - P(w, h, 1))
    ctx.setLineDash([])
    ctx.fillStyle = '#5c6bc0'
    corner(ctx, w, h, '🌙', P(w, h, 2.6))
    scatter(ctx, w, h, '⭐', 10, P(w, h, 3.2), 0.4)
    label(ctx, w, h, '🌙⭐🌙', 'bottom', '#5c6bc0')
  } else if (idx === 8) {
    ctx.shadowColor = 'rgba(194,24,91,0.18)'; ctx.shadowBlur = 18
    ctx.strokeStyle = '#c2185b'; ctx.lineWidth = P(w, h, 2.4)
    ctx.strokeRect(P(w, h, 0.7), P(w, h, 0.7), w - P(w, h, 1.4), h - P(w, h, 1.4))
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = P(w, h, 0.5); ctx.setLineDash([P(w, h, 0.6), P(w, h, 0.6)])
    ctx.strokeRect(P(w, h, 0.3), P(w, h, 0.3), w - P(w, h, 0.6), h - P(w, h, 0.6))
    ctx.setLineDash([])
    ctx.fillStyle = '#c2185b'
    corner(ctx, w, h, '🎀', P(w, h, 2.8))
    edgeDeco(ctx, w, h, '✨', 4)
    scatter(ctx, w, h, '💗', 6, P(w, h, 2.5), 0.25)
    label(ctx, w, h, '🎀💗🎀', 'bottom', '#c2185b')
  } else if (idx === 9) {
    ctx.shadowColor = 'rgba(224,64,251,0.3)'; ctx.shadowBlur = 28
    ctx.strokeStyle = '#e040fb'; ctx.lineWidth = P(w, h, 2.6)
    ctx.strokeRect(P(w, h, 0.7), P(w, h, 0.7), w - P(w, h, 1.4), h - P(w, h, 1.4))
    ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = P(w, h, 0.8)
    ctx.strokeRect(P(w, h, 0.4), P(w, h, 0.4), w - P(w, h, 0.8), h - P(w, h, 0.8))
    ctx.shadowBlur = 0
    ctx.fillStyle = '#e040fb'
    corner(ctx, w, h, '💜', P(w, h, 2.4))
    scatter(ctx, w, h, '✨', 8, P(w, h, 3.2), 0.3)
    label(ctx, w, h, '💜 Neon 💜', 'bottom', '#e040fb')
  } else if (idx === 10) {
    ctx.shadowColor = 'rgba(102,187,106,0.15)'; ctx.shadowBlur = 16
    ctx.strokeStyle = '#66bb6a'; ctx.lineWidth = P(w, h, 2.4)
    ctx.strokeRect(P(w, h, 0.7), P(w, h, 0.7), w - P(w, h, 1.4), h - P(w, h, 1.4))
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#a5d6a7'; ctx.lineWidth = P(w, h, 0.6)
    ctx.strokeRect(P(w, h, 0.3), P(w, h, 0.3), w - P(w, h, 0.6), h - P(w, h, 0.6))
    ctx.fillStyle = '#66bb6a'
    corner(ctx, w, h, '🌸', P(w, h, 2.6))
    edgeDeco(ctx, w, h, '🌷', 4)
    edgeSide(ctx, w, h, '🌹', 3)
    scatter(ctx, w, h, '🌸', 6, P(w, h, 2.8), 0.3)
    label(ctx, w, h, '🌸💐🌸', 'bottom', '#43a047')
  } else if (idx === 11) {
    const candyColors = ['#ff80ab','#ffd740','#40c4ff','#b2ff59','#ea80fc']
    const dotR = P(w, h, 0.6)
    for (let x = 0; x < w; x += P(w, h, 2)) {
      for (let side of ['top','bottom']) {
        const y = side === 'top' ? P(w, h, 0.8) : h - P(w, h, 0.8)
        ctx.beginPath(); ctx.arc(x, y, dotR, 0, Math.PI * 2)
        ctx.fillStyle = candyColors[Math.floor(x / P(w, h, 2)) % candyColors.length]
        ctx.fill()
      }
    }
    ctx.strokeStyle = '#f8bbd0'; ctx.lineWidth = P(w, h, 0.5)
    ctx.strokeRect(P(w, h, 0.4), P(w, h, 0.4), w - P(w, h, 0.8), h - P(w, h, 0.8))
    ctx.fillStyle = '#ff80ab'
    corner(ctx, w, h, '🍬', P(w, h, 2.4))
    scatter(ctx, w, h, '🍭', 6, P(w, h, 2.8), 0.3)
    scatter(ctx, w, h, '🍬', 6, P(w, h, 2), 0.2)
    label(ctx, w, h, '🍬 Sweet 🍬', 'bottom', '#ff80ab')
  } else {
    ctx.shadowColor = 'rgba(26,35,126,0.25)'; ctx.shadowBlur = 22
    ctx.strokeStyle = '#1a237e'; ctx.lineWidth = P(w, h, 2.4)
    ctx.strokeRect(P(w, h, 0.7), P(w, h, 0.7), w - P(w, h, 1.4), h - P(w, h, 1.4))
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#7c4dff'; ctx.lineWidth = P(w, h, 0.5)
    ctx.strokeRect(P(w, h, 0.3), P(w, h, 0.3), w - P(w, h, 0.6), h - P(w, h, 0.6))
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = P(w, h, 0.3); ctx.setLineDash([P(w, h, 0.4), P(w, h, 0.8)])
    ctx.strokeRect(P(w, h, 0.5), P(w, h, 0.5), w - P(w, h, 1), h - P(w, h, 1))
    ctx.setLineDash([])
    ctx.fillStyle = '#1a237e'
    corner(ctx, w, h, '🌌', P(w, h, 2.6))
    scatter(ctx, w, h, '⭐', 12, P(w, h, 3.2), 0.4)
    scatter(ctx, w, h, '✨', 8, P(w, h, 2), 0.3)
    label(ctx, w, h, '🌌💫🌌', 'bottom', '#5c6bc0')
  }
  ctx.restore()
}

const overlayStyles = [
  { boxShadow: 'inset 0 0 0 5px #e91e63, inset 0 0 0 8px #f48fb1', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 4px #ffd700, inset 0 0 0 7px #ffe082', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 4px #7c4dff, inset 0 0 0 7px rgba(124,77,255,0.12)', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 6px #fff, 0 0 0 1px #e0e0e0', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 5px #ce93d8, inset 0 0 0 8px #f3e5f5', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 4px #e91e63, inset 0 0 0 7px #ffd600', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 5px #90caf9', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 5px #5c6bc0, inset 0 0 0 8px #c5cae9', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 5px #c2185b, inset 0 0 0 8px #ffe082', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 5px #e040fb, 0 0 20px rgba(224,64,251,0.3)', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 5px #66bb6a, inset 0 0 0 8px #c8e6c9', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 5px #ff80ab, 0 0 12px rgba(255,128,171,0.25)', borderRadius: '10px' },
  { boxShadow: 'inset 0 0 0 5px #1a237e, inset 0 0 0 8px rgba(26,35,126,0.12)', borderRadius: '10px' },
]

export default function Camera() {
  const videoRef = useRef(null)
  const snapRef = useRef(null)
  const stripRef = useRef(null)
  const streamRef = useRef(null)
  const cdRef = useRef(null)
  const [ratioIdx, setRatioIdx] = useState(2)
  const [frameIdx, setFrameIdx] = useState(0)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [camReady, setCamReady] = useState(false)
  const [camError, setCamError] = useState(null)
  const [countdown, setCountdown] = useState(null)
  const [dlBusy, setDlBusy] = useState(false)
  const [decorOn, setDecorOn] = useState(true)

  const rat = RATIOS[ratioIdx]
  const PW = rat.w, PH = rat.h

  const startCam = useCallback(async () => {
    setLoading(true); setCamReady(false); setCamError(null)
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('nosupport')
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'user' }, width: { ideal: 480 }, height: { ideal: 640 } },
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
    const vw = v.videoWidth || 480; const vh = v.videoHeight || 640
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
    drawFrame(ctx, PW, PH, frameIdx)
    const data = c.toDataURL('image/png')
    setPhotos(prev => prev.length < 4 ? [...prev, data] : prev)
  }, [ratioIdx, frameIdx])

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

  const reset = useCallback(() => {
    setPhotos([]); setCountdown(null)
    if (cdRef.current) { clearInterval(cdRef.current); cdRef.current = null }
  }, [])

  const collageThemes = [
    { name: 'Love 💗', emoji: '💗', color: '#e91e63', bg0: '#fce4ec', bg1: '#f8bbd0' },
    { name: 'Flower 🌸', emoji: '🌸', color: '#66bb6a', bg0: '#e8f5e9', bg1: '#c8e6c9' },
    { name: 'Star ⭐', emoji: '⭐', color: '#7c4dff', bg0: '#ede7f6', bg1: '#d1c4e9' },
    { name: 'Ribbon 🎀', emoji: '🎀', color: '#c2185b', bg0: '#fce4ec', bg1: '#f8bbd0' },
    { name: 'Candy 🍬', emoji: '🍬', color: '#ff80ab', bg0: '#fff3e0', bg1: '#ffe0b2' },
    { name: 'Rainbow 🌈', emoji: '🌈', color: '#d500f9', bg0: '#f3e5f5', bg1: '#e1bee7' },
    { name: 'Crown 👑', emoji: '👑', color: '#ff6f00', bg0: '#fff8e1', bg1: '#ffe082' },
    { name: 'Moon 🌙', emoji: '🌙', color: '#5c6bc0', bg0: '#e8eaf6', bg1: '#c5cae9' },
    { name: 'Butterfly 🦋', emoji: '🦋', color: '#ce93d8', bg0: '#f3e5f5', bg1: '#e1bee7' },
  ]

  const downloadStrip = () => {
    if (photos.length < 4 || dlBusy) return
    setDlBusy(true)
    const c = stripRef.current
    if (!c) { setDlBusy(false); return }
    const themeIdx = Math.floor(Math.random() * collageThemes.length)
    const theme = collageThemes[themeIdx]
    const gap = 8, pd = 16
    const tw = PW * 2 + gap + pd * 2, th = PH * 2 + gap + pd * 2 + 44
    c.width = tw; c.height = th
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, tw, th)
    const bg = ctx.createLinearGradient(0, 0, tw, th)
    bg.addColorStop(0, theme.bg0); bg.addColorStop(1, theme.bg1)
    ctx.fillStyle = bg; ctx.beginPath(); ctx.rect(3, 3, tw - 6, th - 6); ctx.fill()
    const dlDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    const finalize = () => {
      const t = collageThemes[themeIdx]; const cx = tw / 2, cy = th / 2; const p = Math.min(tw, th) * 0.035
      if (decorOn) {
        ctx.save()
        ctx.shadowColor = `${t.color}20`; ctx.shadowBlur = 14
        ctx.strokeStyle = t.color; ctx.lineWidth = p * 2.4
        ctx.strokeRect(p * 0.6, p * 0.6, tw - p * 1.2, th - p * 1.2)
        ctx.shadowBlur = 0
        ctx.strokeStyle = t.color + '40'; ctx.lineWidth = p * 0.5
        ctx.setLineDash([p * 0.8, p * 0.6]); ctx.strokeRect(p * 0.3, p * 0.3, tw - p * 0.6, th - p * 0.6)
        ctx.setLineDash([])
        ctx.font = `${p * 2}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        const d = p * 1.8; ctx.fillText(t.emoji, d, d); ctx.fillText(t.emoji, tw - d, d); ctx.fillText(t.emoji, d, th - d); ctx.fillText(t.emoji, tw - d, th - d)
        const scat = [t.emoji, '💕', '✨', '🌸', '💖', '🌟']; ctx.globalAlpha = 0.2
        ctx.font = `${p * 1.5}px sans-serif`; const r = Math.min(tw, th) * 0.38
        for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + themeIdx * 0.5; ctx.fillText(scat[(i + themeIdx) % scat.length], cx + r * Math.cos(a), cy + r * Math.sin(a)) }
        ctx.globalAlpha = 0.15; ctx.font = `${p * 1.2}px sans-serif`
        for (let i = 0; i < 4; i++) { ctx.fillText(t.emoji, cx - PW / 4 + i * (PW / 3), pd + PH / 2); ctx.fillText(t.emoji, cx - PW / 4 + i * (PW / 3), pd + PH * 1.5 + gap + 20) }
        ctx.globalAlpha = 1; ctx.restore()
      }
      ctx.shadowColor = 'rgba(0,0,0,0.08)'; ctx.shadowBlur = 4
      ctx.fillStyle = '#c2185b'; ctx.font = '700 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
      ctx.fillText(`💗 Zahwa — Happy Birthday! 💗`, cx, th - 28)
      ctx.shadowBlur = 0
      ctx.font = '600 11px sans-serif'; ctx.fillStyle = '#880e4f'
      ctx.fillText(`${FRAMES[frameIdx].name} • ${rat.name}${decorOn ? ` • ${t.name}` : ''} • ${dlDate}`, cx, th - 10)
      try {
        const link = document.createElement('a')
        const name = `zahwa-${FRAMES[frameIdx].name.split(' ')[0].toLowerCase()}-${new Date().toISOString().slice(0, 10)}`
        link.download = `${name}.png`; link.href = c.toDataURL('image/png')
        document.body.appendChild(link); link.click(); document.body.removeChild(link)
      } catch (e) { /* fallback */ }
      setDlBusy(false)
    }

    let loaded = 0, done = false
    const tryFinalize = () => { if (!done && loaded >= 4) { done = true; finalize() } }
    const timer = setTimeout(() => { if (!done) { done = true; setDlBusy(false) } }, 4000)
    photos.forEach((src, i) => {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, pd + (i % 2) * (PW + gap), pd + Math.floor(i / 2) * (PH + gap), PW, PH)
        loaded++; tryFinalize()
      }
      img.onerror = () => { loaded++; tryFinalize() }
      img.src = src
    })
  }

  const showCam = camReady && !camError
  const done = photos.length >= 4

  return (
    <div style={s.page}>
      <div style={s.rain}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{
            position: 'absolute', left: `${(i * 8 + 4) % 100}%`, top: '-60px',
            fontSize: `${18 + (i % 4) * 6}px`, opacity: 0.75 + (i % 3) * 0.08,
            animation: `rf${i % 3} ${10 + (i % 3) * 3}s linear ${i * 0.3}s infinite`,
            pointerEvents: 'none', userSelect: 'none', willChange: 'transform',
          }}>{['💗','✨','💖','🌸','💕','🌟','💘','🥰','💞','🫶','💓','🌷'][i]}</span>
        ))}
      </div>

      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.header}>
            <span style={{ fontSize: '20px' }}>📸</span>
            <h2 style={s.title}>Photo Booth</h2>
            <p style={s.sub}>Pilih rasio & tema, pose 4x, abadiin~ 💕</p>
          </div>

          <div style={s.selRow}>
            {RATIOS.map((r, i) => (
              <button key={r.id} onClick={() => { if (!done) setRatioIdx(i); reset() }}
                style={{
                  ...s.selBtn,
                  border: ratioIdx === i ? `2px solid ${FRAMES[frameIdx].color}` : '1.5px solid rgba(233,30,99,0.1)',
                  background: ratioIdx === i ? `${FRAMES[frameIdx].color}15` : '#fff',
                  color: ratioIdx === i ? FRAMES[frameIdx].color : '#ad1457',
                  opacity: done ? 0.4 : 1, cursor: done ? 'default' : 'pointer',
                }}>
                {r.name}
              </button>
            ))}
          </div>

          <div style={s.selRow}>
            {FRAMES.map(f => (
              <button key={f.id} onClick={() => { if (!done) setFrameIdx(f.id) }} style={{
                ...s.selBtn, flex: '0 0 auto', scrollSnapAlign: 'start',
                border: frameIdx === f.id ? `2px solid ${f.color}` : '1.5px solid rgba(233,30,99,0.1)',
                background: frameIdx === f.id ? `${f.color}15` : '#fff',
                color: frameIdx === f.id ? f.color : '#ad1457',
                opacity: done ? 0.4 : 1, cursor: done ? 'default' : 'pointer',
              }}>
                <span style={{ fontSize: '16px' }}>{f.name.split(' ')[1]}</span>
                <span style={{ fontSize: '10px' }}>{f.name}</span>
              </button>
            ))}
          </div>

          <div style={{
            position: 'relative', borderRadius: '10px', overflow: 'hidden',
            background: '#000', marginBottom: '10px',
            maxHeight: '480px', width: '100%',
          }}>
            <video ref={videoRef} autoPlay playsInline muted style={{
              display: 'block', width: '100%', height: 'auto',
              objectFit: 'contain', transform: 'scaleX(-1)',
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
                aspectRatio: rat.asp, borderRadius: '8px', overflow: 'hidden',
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
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginBottom: '12px', fontSize: '12px', color: '#880e4f',
              }}>
                <span>Hiasan</span>
                <button onClick={() => setDecorOn(!decorOn)} style={{
                  width: '42px', height: '22px', borderRadius: '11px', border: 'none',
                  cursor: 'pointer', position: 'relative', transition: '0.25s',
                  background: decorOn ? '#e91e63' : '#bbb',
                }}>
                  <span style={{
                    position: 'absolute', top: '2px', width: '18px', height: '18px',
                    borderRadius: '50%', background: '#fff', transition: '0.25s',
                    left: decorOn ? '22px' : '2px',
                  }} />
                </button>
                <span>{decorOn ? 'Nyala' : 'Mati'}</span>
              </div>
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
  selRow: { display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '10px', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' },
  selBtn: { flex: '0 0 auto', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '8px 10px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', borderRadius: '12px', fontFamily: 'Poppins, sans-serif' },
}
