import { useState } from 'react'
import PixelButton from '../components/PixelButton'
import { CONFIG } from '../config'

type Props = {
  onStart: () => void
  soundOn: boolean
  onToggleSound: () => void
}

export default function StartScreen({ onStart, soundOn, onToggleSound }: Props) {
  const [showHow, setShowHow] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 p-4 text-center bg-purple-950">
      <div className="bob text-6xl">💗</div>
      <h1 className="text-3xl text-pink-300">{CONFIG.title}</h1>
      <h2 className="text-lg text-yellow-200">{CONFIG.subtitle}</h2>

      <div className="pixel-box bg-[#120a24] p-4 text-xs leading-loose">
        <div>PLAYER 1: {CONFIG.playerName}</div>
        <div className="text-violet-300">{CONFIG.mission}</div>
      </div>

      <div className="blink text-yellow-200 text-xs">PRESS START</div>

      <div>
        <PixelButton onClick={onStart}>START GAME</PixelButton>
        <PixelButton variant="lavender" onClick={() => setShowHow(!showHow)}>
          HOW TO PLAY
        </PixelButton>
      </div>

      <PixelButton variant="lavender" onClick={onToggleSound}>
        SOUND: {soundOn ? 'ON' : 'OFF'}
      </PixelButton>

      {showHow && (
        <div className="pixel-box bg-[#120a24] p-4 text-xs leading-loose max-w-md">
          {CONFIG.howToPlay}
        </div>
      )}
    </div>
  )
}