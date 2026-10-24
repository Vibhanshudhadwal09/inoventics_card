export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080b10]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left">
        <p className="text-xs tracking-wide text-white/40">
          Inoventics Private Limited · Innovate · Build · Transform
        </p>
        <a
          href="https://www.inoventics.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium tracking-wide text-[#FF5A0A]/90 transition-colors hover:text-[#FF5A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]/50 rounded-sm"
        >
          www.inoventics.com
        </a>
      </div>
    </footer>
  )
}
