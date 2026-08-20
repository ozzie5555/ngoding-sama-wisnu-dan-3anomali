import { useEffect, useRef } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export default function TurnstileWidget({ onVerify, onExpire, onError }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const callbacksRef = useRef({ onVerify, onExpire, onError })
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  useEffect(() => {
    callbacksRef.current = { onVerify, onExpire, onError }
  }, [onError, onExpire, onVerify])

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      callbacksRef.current.onError?.('Turnstile site key is missing')
      return undefined
    }

    let cancelled = false
    const renderWidget = () => {
      if (cancelled || !window.turnstile || !containerRef.current || widgetIdRef.current !== null) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: 'login',
        callback: (token) => callbacksRef.current.onVerify?.(token),
        'expired-callback': () => callbacksRef.current.onExpire?.(),
        'error-callback': (error) => callbacksRef.current.onError?.(error),
      })
    }

    const existingScript = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (window.turnstile) renderWidget()
    else if (existingScript) existingScript.addEventListener('load', renderWidget, { once: true })
    else {
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      script.defer = true
      script.addEventListener('load', renderWidget, { once: true })
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
      widgetIdRef.current = null
    }
  }, [siteKey])

  return <div ref={containerRef} className="turnstile-widget" aria-label="Verifikasi keamanan" />
}
