import React from 'react'
import './DonationTracker.css'

export const TRACKER_STEPS = [
  { key: 'form', label: 'Form', index: 1 },
  { key: 'confirmation', label: 'Konfirmasi', index: 2 },
  { key: 'pickup', label: 'Pengambilan', index: 3 },
  { key: 'delivery', label: 'Pengiriman', index: 4 },
  { key: 'completed', label: 'Donasi Diterima', index: 5 },
]

export default function DonationTracker({
  currentStep = 1,
  status = 'delivery',
  customStepStatus = {},
  className = '',
}) {
  /**
   * Determine the visual state of a step:
   * - 'completed': Green/teal circle with checkmark
   * - 'active': Highlighted / pulsing
   * - 'warning': Yellow/orange with '!'
   * - 'error': Red with '✕'
   * - 'upcoming': Muted empty circle
   */
  const getStepState = (stepIndex) => {
    if (customStepStatus[stepIndex]) {
      return customStepStatus[stepIndex]
    }

    if (status === 'error' || status === 'cancelled') {
      if (stepIndex < currentStep) return 'completed'
      if (stepIndex === currentStep) return 'error'
      return 'upcoming'
    }

    if (status === 'warning') {
      if (stepIndex < currentStep) return 'completed'
      if (stepIndex === currentStep) return 'warning'
      return 'upcoming'
    }

    if (status === 'completed' || currentStep >= 5) {
      return 'completed'
    }

    if (stepIndex < currentStep) {
      return 'completed'
    } else if (stepIndex === currentStep) {
      return 'active'
    } else {
      return 'upcoming'
    }
  }

  // Calculate percentage for progress connector line
  const progressPercent = Math.min(100, Math.max(0, ((currentStep - 1) / (TRACKER_STEPS.length - 1)) * 100))

  return (
    <div className={`donation-tracker-wrapper ${className}`}>
      <div className="donation-tracker-line-bg">
        <div
          className={`donation-tracker-line-fill ${status === 'error' || status === 'cancelled' ? 'has-error' : ''}`}
          style={{ width: `${status === 'completed' ? 100 : progressPercent}%` }}
        />
      </div>

      <div className="donation-tracker-steps">
        {TRACKER_STEPS.map((step) => {
          const stepState = getStepState(step.index)
          return (
            <div
              key={step.key}
              className={`tracker-step-item state-${stepState}`}
              data-step={step.index}
            >
              <div className="tracker-step-dot-container">
                <div className={`tracker-step-dot ${stepState}`}>
                  {stepState === 'completed' && (
                    <svg viewBox="0 0 12 12" className="tracker-icon-check" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2.5 6 4.8 8.5 9.5 3.5" />
                    </svg>
                  )}
                  {stepState === 'error' && (
                    <span className="tracker-icon-symbol">✕</span>
                  )}
                  {stepState === 'warning' && (
                    <span className="tracker-icon-symbol">!</span>
                  )}
                  {stepState === 'active' && (
                    <span className="tracker-dot-inner" />
                  )}
                </div>
              </div>
              <span className={`tracker-step-label ${stepState === 'active' || stepState === 'completed' ? 'is-highlighted' : ''}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
