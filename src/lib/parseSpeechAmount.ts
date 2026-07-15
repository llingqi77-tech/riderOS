const ONES: Record<string, number> = {
  zero: 0,
  oh: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

const TEENS: Record<string, number> = {
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
}

const TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
}

const SCALES: Record<string, number> = {
  hundred: 100,
  thousand: 1000,
  million: 1_000_000,
}

function parseEnglishWords(text: string): number | null {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z\s-]/g, ' ')
    .replace(/-/g, ' ')
    .split(/\s+/)
    .filter((t) => t && t !== 'and')

  if (!tokens.length) return null

  let total = 0
  let current = 0
  let matched = false

  for (const token of tokens) {
    if (token in ONES) {
      current += ONES[token]
      matched = true
      continue
    }
    if (token in TEENS) {
      current += TEENS[token]
      matched = true
      continue
    }
    if (token in TENS) {
      current += TENS[token]
      matched = true
      continue
    }
    if (token in SCALES) {
      const scale = SCALES[token]
      current = (current || 1) * scale
      if (scale >= 1000) {
        total += current
        current = 0
      }
      matched = true
      continue
    }
  }

  if (!matched) return null
  const value = total + current
  return value > 0 ? value : null
}

/** Extract an expense amount from speech transcript (digits or English number words). */
export function parseSpeechAmount(transcript: string): number | null {
  const text = transcript.trim()
  if (!text) return null

  const digitMatch = text.replace(/[,\s]/g, '').match(/(\d+(?:\.\d+)?)/)
  if (digitMatch) {
    const value = Math.round(parseFloat(digitMatch[1]))
    return value > 0 ? value : null
  }

  return parseEnglishWords(text)
}
