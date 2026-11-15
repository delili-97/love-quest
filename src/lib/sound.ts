// One shared audio engine, created on first use
let ctx: AudioContext | null = null

function getCtx() {
  ctx = ctx ?? new AudioContext()
  if (ctx.state === 'suspended') ctx.resume() // browsers pause audio until the user taps
  return ctx
}

// Plays one beep. freq = pitch, duration = seconds, delay = wait before playing,
// type = wave shape, vol = loudness (0 to 1)
export function beep(freq: number, duration = 0.1, delay = 0, type: OscillatorType = 'square', vol = 0.06) {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  const start = c.currentTime + delay
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration) // fade out
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(start)
  osc.stop(start + duration)
}

export function heartSound() {
  beep(660, 0.08)
  beep(880, 0.12, 0.08)
}

export function winSound() {
  ;[523, 659, 784, 1047, 784, 1047].forEach((f, i) => beep(f, 0.15, i * 0.12))
}

export function nopeSound() {
  beep(200, 0.12)
}

export function clickSound() {
  beep(440, 0.06)
}

// A rising sparkle for the love sign
export function loveSound() {
  ;[784, 988, 1175, 1568, 1319, 1568, 2093].forEach((f, i) => beep(f, 0.2, i * 0.1, 'triangle', 0.05))
}

// ---- Background music ----
// A 16-note loop. Each number is a pitch in Hz.
const MELODY = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587]
let musicTimer: number | undefined
let step = 0

export function startMusic() {
  if (musicTimer !== undefined) return // already playing
  musicTimer = window.setInterval(() => {
    // soft triangle wave so it stays in the background
    beep(MELODY[step % MELODY.length], 0.2, 0, 'triangle', 0.025)
    step++
  }, 240) // one note every 240 ms
}

export function stopMusic() {
  if (musicTimer !== undefined) {
    window.clearInterval(musicTimer)
    musicTimer = undefined
  }
}