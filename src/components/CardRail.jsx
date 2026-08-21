import { Children, useLayoutEffect, useRef } from 'react'
import './CardRail.css'

export default function CardRail({ children, className = '', label, compact = false }) {
  const railRef = useRef(null)
  const itemKeys = Children.toArray(children).map((child) => child.key).join('|')

  useLayoutEffect(() => {
    railRef.current?.scrollTo({ left: 0 })
  }, [itemKeys])

  const move = (direction) => {
    const rail = railRef.current
    const card = rail?.firstElementChild
    if (!rail || !card) return

    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0
    const atStart = rail.scrollLeft <= 2
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2

    if (direction < 0 && atStart) rail.scrollTo({ left: rail.scrollWidth, behavior: 'smooth' })
    else if (direction > 0 && atEnd) rail.scrollTo({ left: 0, behavior: 'smooth' })
    else rail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' })
  }

  return (
    <div className={`card-rail-shell${compact ? ' card-rail-shell--compact' : ''}`}>
      <div ref={railRef} className={`card-rail ${className}`} aria-label={label}>
        {children}
      </div>
      <div className="card-rail-controls" aria-label={`Navigasi ${label}`}>
        <button type="button" onClick={() => move(-1)} aria-label={`${label} sebelumnya`}>
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" onClick={() => move(1)} aria-label={`${label} berikutnya`}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}
