interface LogoProps {
  className?: string
  showWordmark?: boolean
}

export function Logo({ className = '', showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="h-8 w-8 shrink-0"
        aria-hidden="true"
        fill="none"
      >
        <path d="M18 12 L46 12 L54 32 L46 52 L18 52 L10 32 Z" fill="#101820" />
        <path d="M32 12 L46 12 L54 32 L46 52 L32 52 Z" fill="#FF5A0A" />
        <rect x="28" y="22" width="8" height="22" rx="1" fill="#101820" />
        <rect x="28" y="14" width="8" height="6" rx="1" fill="#FF5A0A" />
      </svg>
      {showWordmark && (
        <span className="text-sm font-bold tracking-[0.14em] text-white sm:text-[15px]">
          INOVENTICS
        </span>
      )}
    </div>
  )
}
