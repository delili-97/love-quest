import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { heartSound } from '../lib/sound'

type Props = {
  soundOn: boolean
  onComplete: () => void // called when all hearts are collected
}
type Dir = 'up' | 'down' | 'left' | 'right'

// X = a colored pixel, . = empty
const HEART = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...']

export default function Level1Hearts({ soundOn, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const keys = useRef({ up: false, down: false, left: false, right: false })
  const soundRef = useRef(soundOn)
  const [collected, setCollected] = useState(0)
  const [message, setMessage] = useState(`Collect all ${CONFIG.heartsNeeded} hearts!`)

  useEffect(() => {
    soundRef.current = soundOn
  }, [soundOn])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const player = { x: 150, y: 90 }
    let hearts = Array.from({ length: CONFIG.heartsNeeded }, () => ({
      x: 20 + Math.random() * 270,
      y: 20 + Math.random() * 120,
      t: Math.random() * 6,
    }))
    let got = 0
    let frameId = 0
    let timer: number | undefined

    const keyMap: Record<string, Dir> = {
      ArrowUp: 'up', w: 'up', W: 'up',
      ArrowDown: 'down', s: 'down', S: 'down',
      ArrowLeft: 'left', a: 'left', A: 'left',
      ArrowRight: 'right', d: 'right', D: 'right',
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const dir = keyMap[e.key]
      if (dir) {
        keys.current[dir] = true
        e.preventDefault()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const dir = keyMap[e.key]
      if (dir) keys.current[dir] = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    function drawMap(rows: string[], color: string, x: number, y: number, s: number) {
      ctx.fillStyle = color
      rows.forEach((row, j) =>
        [...row].forEach((c, i) => {
          if (c === 'X') ctx.fillRect(x + i * s, y + j * s, s, s)
        }),
      )
    }

    function loop() {
      const k = keys.current
      player.x += (Number(k.right) - Number(k.left)) * 2
      player.y += (Number(k.down) - Number(k.up)) * 2
      player.x = Math.max(0, Math.min(308, player.x))
      player.y = Math.max(0, Math.min(188, player.y))

      // Sky and grass
      ctx.fillStyle = '#2a1a55'
      ctx.fillRect(0, 0, 320, 200)
      ctx.fillStyle = '#3b6b4a'
      ctx.fillRect(0, 160, 320, 40)
      for (let i = 0; i < 14; i++) {
        ctx.fillStyle = i % 2 ? '#ff9ecb' : '#fff1dc'
        ctx.fillRect(i * 24 + 6, 170 + ((i * 7) % 20), 4, 4)
      }

      // Hearts bob up and down
      hearts.forEach((h) => {
        h.t += 0.08
        drawMap(HEART, '#ff3d7f', h.x, h.y + Math.sin(h.t) * 4, 2)
      })

      // Player: hair, face, eyes, body, legs
      ctx.fillStyle = '#3b2470'
      ctx.fillRect(player.x + 2, player.y, 8, 3)
      ctx.fillStyle = '#ffe0c2'
      ctx.fillRect(player.x + 2, player.y + 3, 8, 4)
      ctx.fillStyle = '#2a1650'
      ctx.fillRect(player.x + 4, player.y + 4, 1, 1)
      ctx.fillRect(player.x + 7, player.y + 4, 1, 1)
      ctx.fillStyle = '#7fb2ff'
      ctx.fillRect(player.x + 2, player.y + 7, 8, 4)
      ctx.fillStyle = '#2a1650'
      ctx.fillRect(player.x + 3, player.y + 11, 2, 1)
      ctx.fillRect(player.x + 7, player.y + 11, 2, 1)

      // Keep only the hearts the player is not touching
      hearts = hearts.filter((h) => {
        const touching =
          Math.abs(h.x + 7 - (player.x + 6)) < 12 &&
          Math.abs(h.y + 6 - (player.y + 6)) < 12
        if (touching) {
          got += 1
          setCollected(got)
          setMessage(CONFIG.collectMessages[Math.min(got - 1, CONFIG.collectMessages.length - 1)])
          if (soundRef.current) heartSound()
        }
        return !touching
      })

      if (hearts.length === 0) {
        timer = window.setTimeout(onComplete, 800)
        return
      }
      frameId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  // One on-screen touch button
  const pad = (dir: Dir, label: string) => (
    <button
      className="w-14 h-14 bg-violet-300 text-violet-950 text-lg active:bg-pink-300 touch-none select-none"
      onPointerDown={(e) => { e.preventDefault(); keys.current[dir] = true }}
      onPointerUp={() => (keys.current[dir] = false)}
      onPointerLeave={() => (keys.current[dir] = false)}
      onPointerCancel={() => (keys.current[dir] = false)}
      aria-label={dir}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-4 bg-purple-950 text-center">
      <h2 className="text-sm text-yellow-200">LEVEL 1: COLLECT THE HEARTS</h2>
      <div className="text-xs">♥ {collected} / {CONFIG.heartsNeeded}</div>
      <canvas
        ref={canvasRef}
        width={320}
        height={200}
        className="w-full max-w-[640px] border-4 border-violet-300"
        style={{ imageRendering: 'pixelated', aspectRatio: '8 / 5', touchAction: 'none' }}
      />
      <div className="min-h-6 text-xs text-yellow-200">{message}</div>
      <div className="grid grid-cols-3 gap-2">
        <span />
        {pad('up', '▲')}
        <span />
        {pad('left', '◀')}
        {pad('down', '▼')}
        {pad('right', '▶')}
      </div>
    </div>
  )
}