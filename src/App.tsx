import { useEffect, useState } from 'react'
import StartScreen from './screens/StartScreen'
import Level1Hearts from './screens/Level1Hearts'
import Level2Question from './screens/Level2Question'
import WinScreen from './screens/WinScreen'
import Level3Schedule from './screens/Level3Schedule'
import Level4Victory from './screens/Level4Victory'
import Level5LoveSign from './screens/Level5LoveSign'
import { saveResponse } from './lib/saveResponse'
import { startMusic, stopMusic } from './lib/sound'
import type { DateResponse } from './types'

type Screen = 'start' | 'level1' | 'level2' | 'win' | 'level3' | 'level4' | 'level5'

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [soundOn, setSoundOn] = useState(true)
  const [response, setResponse] = useState<DateResponse | null>(null)

  // Music plays only when sound is on and the game has started.
  // Browsers block audio until the player taps, and START GAME is that tap.
  useEffect(() => {
    if (soundOn && screen !== 'start') startMusic()
    else stopMusic()
    return () => stopMusic() // stop when the app closes
  }, [soundOn, screen])

  if (screen === 'start')
    return (
      <StartScreen
        onStart={() => setScreen('level1')}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn(!soundOn)}
      />
    )

  if (screen === 'level1')
    return <Level1Hearts soundOn={soundOn} onComplete={() => setScreen('level2')} />

  if (screen === 'level2')
    return <Level2Question soundOn={soundOn} onAccept={() => setScreen('win')} />

  if (screen === 'win')
    return <WinScreen soundOn={soundOn} onNext={() => setScreen('level3')} />

  if (screen === 'level3')
    return (
      <Level3Schedule
        soundOn={soundOn}
        onSubmit={async (r) => {
          await saveResponse(r) // if this throws, Level 3 shows the error and stays
          setResponse(r)
          setScreen('level4')
        }}
      />
    )

  if (screen === 'level4')
    return response && <Level4Victory response={response} onNext={() => setScreen('level5')} />

  return (
    <Level5LoveSign
      soundOn={soundOn}
      onRestart={() => {
        setResponse(null)
        setScreen('start')
      }}
    />
  )
}