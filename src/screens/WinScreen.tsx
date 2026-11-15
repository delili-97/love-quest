import { useEffect } from 'react'
import Fireworks from '../components/Fireworks'
import PixelButton from '../components/PixelButton'
import { CONFIG } from '../config'
import { winSound } from '../lib/sound'

type Props = { soundOn: boolean; onNext: () => void }

export default function WinScreen({ soundOn, onNext }: Props) {
  // Play the victory jingle once when this screen appears
  useEffect(() => {
    if (soundOn) winSound()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-center bg-purple-950">
      <Fireworks />
      <h1 className="bob text-2xl text-pink-300">{CONFIG.winTitle}</h1>
      <h2 className="text-sm text-yellow-200">{CONFIG.winSubtitle}</h2>
      <PixelButton onClick={onNext}>{CONFIG.nextButton}</PixelButton>
    </div>
  )
}