import { useEffect, useRef } from 'react'

export default function Fireworks() {
  const ref = useRef<HTMLCanvasElement>(null) // points at the <canvas>

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth   // make the canvas fill the window
    canvas.height = window.innerHeight

    // One particle = one little square flying outward
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string }
    let particles: Particle[] = []
    const endTime = Date.now() + 3500 // stop making new bursts after 3.5 seconds
    let lastBurst = 0
    let frameId = 0
    const colors = ['#ff5fa2', '#ffd86b', '#b8a1ff', '#fff1dc']

    function tick() {
      // Every 350ms, launch a new burst at a random spot
      if (Date.now() < endTime && Date.now() - lastBurst > 350) {
        lastBurst = Date.now()
        const cx = 60 + Math.random() * (canvas.width - 120)
        const cy = 60 + Math.random() * canvas.height * 0.5
        for (let i = 0; i < 24; i++) {
          const angle = (i / 24) * Math.PI * 2 // spread 24 particles in a circle
          const speed = 2 + Math.random() * 3
          particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed, // horizontal speed
            vy: Math.sin(angle) * speed, // vertical speed
            life: 60,                    // lasts 60 frames
            color: colors[i % colors.length],
          })
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height) // wipe the last frame
      particles = particles.filter((p) => p.life-- > 0) // drop dead particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.06 // gravity pulls particles down
        ctx.fillStyle = p.color
        // Snap to a 4px grid so it looks pixelated
        ctx.fillRect(Math.round(p.x / 4) * 4, Math.round(p.y / 4) * 4, 6, 6)
      })

      // Keep going until time is up AND every particle has faded
      if (Date.now() < endTime || particles.length) frameId = requestAnimationFrame(tick)
    }
    tick()

    return () => cancelAnimationFrame(frameId) // cleanup when leaving the screen
  }, [])

  // fixed + pointer-events-none = covers the screen but doesn't block clicks
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-50" />
}