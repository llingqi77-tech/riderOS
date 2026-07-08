import { useCallback, useEffect, useRef, useState } from 'react'

type SpeechRecognitionCtor = new () => SpeechRecognition

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function useSpeechRecognition({
  lang = 'zh-CN',
  onResult,
}: {
  lang?: string
  onResult: (transcript: string) => void
}) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const onResultRef = useRef(onResult)

  onResultRef.current = onResult

  useEffect(() => {
    const Ctor = getSpeechRecognition()
    if (!Ctor) return

    setSupported(true)
    const recognition = new Ctor()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      if (transcript) onResultRef.current(transcript)
    }

    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
      recognitionRef.current = null
    }
  }, [lang])

  const toggle = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    if (listening) {
      recognition.stop()
      setListening(false)
      return
    }

    try {
      recognition.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }, [listening])

  const stop = useCallback(() => {
    recognitionRef.current?.abort()
    setListening(false)
  }, [])

  return { listening, supported, toggle, stop }
}
