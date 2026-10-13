const STEP = 10
export const SPEED_SAMPLE_MS = 1000
export const SPEED_SAMPLE_STEP = STEP

function noise(index: number, seed: number) {
  let value = Math.imul(index + seed, 0x45d9f3b)
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b)
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295
}

// Correlated samples with occasional bursts, rather than a repeating wave.
export function speedHistoryPaths(step: number, seed: number) {
  const points = Array.from({ length: 34 }, (_, i) => {
    const index = step + i - 1
    const sample =
      noise(index - 1, seed) * 0.2 +
      noise(index, seed) * 0.5 +
      noise(index + 1, seed) * 0.3
    const burst = noise(Math.floor(index / 5), seed + 97) > 0.72 ? 0.2 : 0
    return { x: (i - 1) * STEP, y: 88 - (0.15 + sample * 0.65 + burst) * 68 }
  })
  const first = points[0]
  let line = `M ${first.x} ${first.y}`
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1],
      point = points[i]
    line += ` Q ${previous.x} ${previous.y} ${(previous.x + point.x) / 2} ${(previous.y + point.y) / 2}`
  }
  const last = points[points.length - 1]
  line += ` L ${last.x} ${last.y}`
  return { line, fill: `${line} L ${last.x} 100 L ${first.x} 100 Z` }
}
