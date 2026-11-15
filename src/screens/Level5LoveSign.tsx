import { useEffect } from 'react'
import Fireworks from '../components/Fireworks'
import PixelButton from '../components/PixelButton'
import { CONFIG } from '../config'
import { loveSound } from '../lib/sound'

type Props = { soundOn: boolean; onRestart: () => void }

// X = a lit pixel, . = dark. This draws the big heart in the sign.
const HEART = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...']

// Positions for 14 floating hearts. The % and numbers just spread them out.
const floaters = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 7 + 5) % 95,      // how far from the left, in %
  delay: (i * 0.9) % 6,        // seconds to wait before starting
  duration: 6 + (i % 5),       // seconds to float up
  size: 14 + (i % 4) * 6,      // heart size in px
}))

export default function Level5LoveSign({ soundOn, onRestart }: Props) {
  // Play the sparkle once when the screen appears
  useEffect(() => {
    if (soundOn) loveSound()
  }, [])

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-center bg-purple-950">
      <Fireworks />

      {/* aria-hidden: screen readers skip the decorative hearts */}
      {floaters.map((f, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="floaty"
          style={{
            left: `${f.left}%`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            fontSize: f.size,
          }}
        >
          💗
        </span>
      ))}

      <h2 className="text-sm text-yellow-200">{CONFIG.level5Title}</h2>

      {/* The neon sign: I [heart] YOU */}
      <div className="neon-box bg-[#120a24] p-6 flex items-center justify-center gap-4 flex-wrap">
        <span className="neon text-4xl">I</span>
        {/* The pixel heart: a 7-column grid with one square per X */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(7, 14px)',
            filter: 'drop-shadow(0 0 8px #ff3d7f)',
          }}
          aria-label="heart"
        >
          {HEART.flatMap((row, j) =>
            [...row].map((c, i) => (
              <div
                key={`${j}-${i}`}
                style={{ width: 14, height: 14, background: c === 'X' ? '#ff3d7f' : 'transparent' }}
              />
            )),
          )}
        </div>
        <span className="neon text-4xl">YOU</span>
      </div>

      <div className="bob text-6xl" aria-label="I love you hand sign">🤟</div>

      <div className="pixel-box bg-[#120a24] p-4 text-xs leading-loose max-w-md">
        {CONFIG.level5Message}
      </div>

      <PixelButton variant="lavender" onClick={onRestart}>PLAY AGAIN</PixelButton>
    </div>
  )
}