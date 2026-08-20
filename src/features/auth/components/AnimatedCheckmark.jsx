export default function AnimatedCheckmark({ className = '' }) {
  return (
    <span className={'animated-checkmark ' + className} role="img" aria-label="Berhasil">
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <circle className="animated-checkmark__ring" cx="48" cy="48" r="38" />
        <path className="animated-checkmark__tick" d="M29 49.5 42 62l25-29" />
      </svg>
    </span>
  );
}
