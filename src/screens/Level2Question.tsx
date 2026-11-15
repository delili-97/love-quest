import { useEffect, useRef, useState } from 'react'
import PixelButton from '../components/PixelButton'
import { CONFIG } from '../config'
import { nopeSound, winSound } from '../lib/sound'

type Props = {
  soundOn: boolean
  onAccept: () => void // called when YES is clicked
}

// Pixel pictures: each letter is a color (see "colors"), "." is empty
const GIRL = [
  '....hhhh....', '...hhhhhh...', '..hffffffh..', '..hfefefh...',
  '..hffffffh..', '...ffmmf....', '..bbbbbbbb..', '..bbbbbbbb..',
  '..fbbbbbbf..', '...bbbbbb...', '...bb..bb...', '...kk..kk...',
]
const HEART = ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...']
const colors: Record<string, string> = {
  h: '#6b2a8f', f: '#ffe0c2', e: '#2a1650', m: '#ff5fa2',
  b: '#ff9ecb', k: '#2a1650', r: '#ff3d7f',
}

export default function Level2Question({ soundOn, onAccept }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)     // the whole screen: NO must stay inside
  const yesRef = useRef<HTMLDivElement>(null)     // wraps the YES button
  const noRef = useRef<HTMLButtonElement>(null)   // the NO button
  const girlRef = useRef<HTMLCanvasElement>(null) // the girl drawing
  const dodges = useRef(0)                        // how many times NO has dodged
  const [showQuestion, setShowQuestion] = useState(false)
  const [message, setMessage] = useState(CONFIG.intro)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null) // NO position

  // Draw the pixel girl once
  useEffect(() => {
    const ctx = girlRef.current!.getContext('2d')!
    const draw = (rows: string[], x: number, y: number) =>
      rows.forEach((row, j) =>
        [...row].forEach((c, i) => {
          if (colors[c]) {
            ctx.fillStyle = colors[c]
            ctx.fillRect(x + i, y + j, 1, 1)
          }
        }),
      )
    draw(GIRL, 2, 1)
    draw(HEART, 8, 9) // the heart she is holding
    if (soundOn) winSound()
  }, [])

  // After 1.8 seconds, reveal the question and the buttons
  useEffect(() => {
    const t = window.setTimeout(() => setShowQuestion(true), 1800)
    return () => window.clearTimeout(t)
  }, [])

  // Once the NO button is on screen, give it a starting spot
  useEffect(() => {
    if (showQuestion) placeNo(true)
  }, [showQuestion])

  // Pick a new spot for NO, always inside the screen and away from YES
  function placeNo(first: boolean) {
    const box = boxRef.current!.getBoundingClientRect()
    const yes = yesRef.current!.getBoundingClientRect()
    const no = noRef.current!
    const maxX = box.width - no.offsetWidth - 8
    const maxY = box.height - no.offsetHeight - 8
    const yl = yes.left - box.left, yr = yes.right - box.left
    const yt = yes.top - box.top, yb = yes.bottom - box.top
    let x = 0, y = 0
    for (let tries = 0; tries < 30; tries++) {
      x = first ? maxX * 0.6 : 8 + Math.random() * (maxX - 8)
      y = first ? yb + 30 : 8 + Math.random() * (maxY - 8)
      const overlaps =
        x < yr + 10 && x + no.offsetWidth > yl - 10 &&
        y < yb + 10 && y + no.offsetHeight > yt - 10
      if (!overlaps) break
    }
    setPos({ x: Math.max(0, x), y: Math.max(0, y) })
  }

  // Runs when the player hovers, taps or clicks NO
  function dodge(e: React.SyntheticEvent) {
    e.preventDefault()
    if (soundOn) nopeSound()
    setMessage(CONFIG.noMessages[dodges.current++ % CONFIG.noMessages.length])
    placeNo(false)
  }

  return (
    <div
      ref={boxRef}
      className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center gap-5 p-4 text-center bg-purple-950"
    >
      <h2 className="text-lg text-yellow-200">LEVEL COMPLETED!</h2>
      <div className="text-xs text-violet-300">YOU HAVE UNLOCKED A SECRET MESSAGE.</div>

      <canvas
        ref={girlRef}
        width={16}
        height={16}
        className="w-24 h-24 bob"
        style={{ imageRendering: 'pixelated' }}
      />

      <div className="pixel-box bg-[#120a24] p-4 text-xs leading-loose max-w-md">{message}</div>

      {showQuestion && (
        <>
          <h2 className="text-base text-pink-300">{CONFIG.question}</h2>
          <div ref={yesRef}>
            <PixelButton onClick={onAccept}>{CONFIG.yesText}</PixelButton>
          </div>
          <button
            ref={noRef}
            onPointerEnter={dodge}
            onPointerDown={dodge}
            onClick={dodge}
            className={`absolute z-10 bg-violet-300 text-violet-950 text-xs px-4 py-3 touch-none ${pos ? '' : 'invisible'}`}
            style={{
              left: pos?.x ?? 0,
              top: pos?.y ?? 0,
              transition: 'left 0.25s steps(5), top 0.25s steps(5)',
            }}
          >
            {CONFIG.noText}
          </button>
        </>
      )}
    </div>
  )
}