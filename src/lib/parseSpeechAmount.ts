const DIGITS: Record<string, number> = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
}

const UNITS: Record<string, number> = {
  十: 10,
  百: 100,
  千: 1000,
  万: 10000,
}

function parseChineseSegment(segment: string): number {
  let total = 0
  let current = 0

  for (const char of segment) {
    if (char in DIGITS) {
      current = DIGITS[char]
      continue
    }
    if (char in UNITS) {
      const unit = UNITS[char]
      if (unit === 10000) {
        total = (total + (current || 1)) * unit
        current = 0
      } else {
        total += (current || 1) * unit
        current = 0
      }
    }
  }

  return total + current
}

function expandColloquial(text: string): string {
  return text
    .replace(/千([一二三四五六七八九两])(?![十百千])/g, '千$1百')
    .replace(/百([一二三四五六七八九两])(?![十百千])/g, '百$1十')
}

function parseChineseNumber(text: string): number | null {
  const cleaned = expandColloquial(
    text.replace(/[元块奈拉钱毛分角,\s]/g, '').trim(),
  )
  if (!cleaned) return null

  const parts = cleaned.split('万')
  let total = 0

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part && i < parts.length - 1) {
      total *= 10000
      continue
    }
    const value = parseChineseSegment(part)
    if (i < parts.length - 1) {
      total += value * 10000
    } else {
      total += value
    }
  }

  return total > 0 ? total : null
}

/** Extract an expense amount from speech transcript (digits or Chinese numerals). */
export function parseSpeechAmount(transcript: string): number | null {
  const text = transcript.trim()
  if (!text) return null

  const digitMatch = text.replace(/[,，\s]/g, '').match(/(\d+(?:\.\d+)?)/)
  if (digitMatch) {
    const value = Math.round(parseFloat(digitMatch[1]))
    return value > 0 ? value : null
  }

  const chineseOnly = text.replace(/[^\u4e00-\u9fff]/g, '')
  if (chineseOnly) return parseChineseNumber(chineseOnly)

  return null
}
