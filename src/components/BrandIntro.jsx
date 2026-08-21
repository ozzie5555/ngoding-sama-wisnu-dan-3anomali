import { useEffect, useState } from 'react'
import './BrandIntro.css'

export default function BrandIntro({ onComplete }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const leaveTimer = window.setTimeout(() => setLeaving(true), 900)
    const completeTimer = window.setTimeout(onComplete, 1450)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(completeTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [onComplete])

  return (
    <div className={'brand-intro' + (leaving ? ' is-leaving' : '')} role="status" aria-live="polite" aria-label="Membuka KEMBALI">
      <span className="brand-intro__glow brand-intro__glow--one" aria-hidden="true" />
      <span className="brand-intro__glow brand-intro__glow--two" aria-hidden="true" />
      <div className="brand-intro__content">
        <div className="brand-intro__mark">
          <span className="brand-intro__orbit" aria-hidden="true" />
          <img src="/logo.svg" alt="" />
        </div>
        <strong>KEMBALI</strong>
        <p>Barang kembali berguna. Bumi kembali lega.</p>
        <span className="brand-intro__progress" aria-hidden="true"><i /></span>
      </div>
    </div>
  )
}
