/**
 * LoadingDots - Reusable dot loader matching Reference Design (Page 8)
 * @param {string} size - 'normal' | 'mini' | 'sm'
 * @param {string} color - optional color override
 */
export default function LoadingDots({ size = 'normal', color = '#3FBEC7', className = '' }) {
  const isMini = size === 'mini' || size === 'sm';
  const dimension = isMini ? 24 : 36;
  const dotRadius = isMini ? 2 : 3;
  const centerRadius = isMini ? 8 : 12;

  // 8 circular dots positioned in a circle with staggered opacity/animation
  const dots = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div
      className={`auth-loading-dots-container ${isMini ? 'mini' : ''} ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      role="status"
      aria-label="Memuat..."
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="auth-loading-spinner-svg"
      >
        {dots.map((idx) => {
          const angle = (idx * 45 * Math.PI) / 180;
          const cx = dimension / 2 + centerRadius * Math.sin(angle);
          const cy = dimension / 2 - centerRadius * Math.cos(angle);
          const opacity = (idx + 1) / dots.length;

          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={dotRadius}
              fill={color}
              opacity={opacity}
              style={{
                animation: 'authDotFade 0.8s infinite linear',
                animationDelay: `${(idx * 0.1).toFixed(2)}s`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
