import { useState } from 'react'
import StartScreen from './screens/StartScreen'
import Level1Hearts from './screens/Level1Hearts'
import Level2Question from './screens/Level2Question'
import WinScreen from './screens/WinScreen'
import Level3Schedule from './screens/Level3Schedule'
import Level4Victory from './screens/Level4Victory'
import type { DateResponse } from './types'
import { saveResponse } from './lib/saveResponse'

type Screen = 'start' | 'level1' | 'level2' | 'win' | 'level3' | 'level4'

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [soundOn, setSoundOn] = useState(true)
  const [response, setResponse] = useState<DateResponse | null>(null)

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
          await saveResponse(r) // if this throws, Level 3 shows an error and stays put
          setResponse(r)
          setScreen('level4')
        }}
      />
    )

  return (
    response && (
      <Level4Victory
        response={response}
        onRestart={() => {
          setResponse(null)
          setScreen('start')
        }}
      />
    )
  )
}