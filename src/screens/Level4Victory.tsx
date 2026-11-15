  import { useEffect } from 'react'
import Fireworks from '../components/Fireworks'
import PixelButton from '../components/PixelButton'
import { CONFIG } from '../config'
import type { DateResponse } from '../types'

type Props = { response: DateResponse; onNext: () => void }

export default function Level4Victory({ response, onNext }: Props) {
  // Turn "2026-12-05" into "Saturday, December 5, 2026"
  const [y, mo, d] = response.date.split('-').map(Number)
  const prettyDate = new Date(y, mo - 1, d).toLocaleDateString('en', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  // The summary rows: a label on the left, his answer on the right
  const rows: [string, string][] = [
    [CONFIG.labels.date, prettyDate],
    [CONFIG.labels.time, response.time],
    [CONFIG.labels.availability, response.availability],
    [CONFIG.labels.activity, response.activity],
    ['YOUR MESSAGE', response.message || '(no message)'],
  ]

  useEffect(() => {
    window.scrollTo(0, 0) // start at the top of the page
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center gap-5 p-4 text-center bg-purple-950 max-w-xl mx-auto">
      <Fireworks />
      <h1 className="text-xl text-pink-300">{CONFIG.level4Title}</h1>
      <h2 className="text-sm text-yellow-200">{CONFIG.level4Subtitle}</h2>

      <div className="pixel-box bg-[#120a24] p-4 w-full text-left text-[10px] leading-loose">
        {/* .map turns each row into a label and a value */}
        {rows.map(([label, value]) => (
          <div key={label} className="mb-2">
            <div className="text-pink-300">{label}</div>
            <div className="break-words">{value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-sm text-yellow-200">{CONFIG.finalMessage}</h2>
            <PixelButton onClick={onNext}>{CONFIG.level4NextButton}</PixelButton>
    </div>
  )
}