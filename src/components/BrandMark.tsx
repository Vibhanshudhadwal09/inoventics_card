interface BrandMarkProps {
  src?: string | null
  className?: string
  size?: number
}

/** Default Inoventics hexagon mark when no custom logo is uploaded. */
export function BrandMark({ src, className = '', size = 64 }: BrandMarkProps) {
  if (src) {
    return (
      <img
        src={src}
        alt="Business logo"
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden
      fill="none"
    >
      <path d="M18 12 L46 12 L54 32 L46 52 L18 52 L10 32 Z" fill="#101820" />
      <path d="M32 12 L46 12 L54 32 L46 52 L32 52 Z" fill="#FF5A0A" />
      <rect x="28" y="22" width="8" height="22" rx="1" fill="#101820" />
      <rect x="28" y="14" width="8" height="6" rx="1" fill="#FF5A0A" />
    </svg>
  )
}
