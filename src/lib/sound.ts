// "let" makes a variable that can change. It starts empty (null).
// The audio engine is created once and reused.
let ctx: AudioContext | null = null

// Plays one beep. "export" lets other files import this function.
// freq = pitch in Hz, duration = seconds, delay = wait before playing
export function beep(freq: number, duration = 0.1, delay = 0) {
  ctx = ctx ?? new AudioContext()      // create the engine if it doesn't exist yet
  const osc = ctx.createOscillator()   // the thing that makes the tone
  const gain = ctx.createGain()        // a volume knob
  const start = ctx.currentTime + delay // exact moment to start
  osc.type = 'square'                  // square wave = classic 8-bit sound
  osc.frequency.value = freq           // set the pitch
  gain.gain.setValueAtTime(0.06, start) // start quiet (0.06 = 6% volume)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration) // fade out
  osc.connect(gain)                    // tone -> volume knob
  gain.connect(ctx.destination)        // volume knob -> speakers
  osc.start(start)                     // begin the tone
  osc.stop(start + duration)           // end it
}

// Two quick beeps, the second one higher: the "collect a heart" sound
export function heartSound() {
  beep(660, 0.08)
  beep(880, 0.12, 0.08)
}
// A rising victory jingle. forEach loops over each note; i is the note's
// position (0, 1, 2...), so each note starts 0.12 seconds after the last.
export function winSound() {
  ;[523, 659, 784, 1047, 784, 1047].forEach((f, i) => beep(f, 0.15, i * 0.12))
}

// A low "bonk" for when the NO button dodges
export function nopeSound() {
  beep(200, 0.12)
}
// A tiny tick for button presses
export function clickSound() {
  beep(440, 0.06)
}