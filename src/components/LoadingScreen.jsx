export default function LoadingScreen({ message = 'Menyiapkan pengalaman donasimu...' }) {
  return (
    <div className="app-loading-screen" role="status" aria-live="polite" aria-label={message}>
      <div className="app-loading-content">
        <span className="app-loading-mark"><img src="/logo.svg" alt="" /></span>
        <strong>KEMBALI</strong>
        <p>{message}</p>
        <span className="app-loading-progress" aria-hidden="true"><i /></span>
      </div>
    </div>
  )
}
