import { Logo } from './Logo'

const NAV = [
  { href: '#overview', label: 'Overview' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
] as const

export function Header() {
  return (
    <header className="relative z-20 border-b border-white/5 bg-[#0a0e14]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <a href="#overview" className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e14] rounded-sm">
          <Logo />
          <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
          <span className="hidden text-xs font-medium tracking-wide text-white/45 sm:inline">
            Private Limited
          </span>
        </a>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium tracking-wide text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]/50 sm:px-3 sm:text-[13px]"
            >
              {item.label}
            </a>
          ))}
          <span
            className="ml-1 hidden h-1.5 w-1.5 rounded-full bg-[#FF5A0A] sm:inline-block"
            aria-hidden
          />
        </nav>
      </div>
    </header>
  )
}
