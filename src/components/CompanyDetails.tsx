import { Globe, Phone } from 'lucide-react'
import { SERVICES } from '../types'

export function CompanyDetails() {
  return (
    <section
      id="services"
      className="relative border-t border-white/5 bg-[#0c1016]"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 max-w-xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#FF5A0A] uppercase">
            About
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Inoventics Private Limited
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
            Innovate · Build · Transform — Custom Software. Real Business Impact.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div id="contact">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-white/40 uppercase">
              Our Services
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {SERVICES.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5A0A]"
                    aria-hidden
                  />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
            <h3 className="text-xs font-semibold tracking-[0.18em] text-white/40 uppercase">
              Contact
            </h3>
            <a
              href="tel:+918278985815"
              className="flex items-center gap-3 text-sm text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]/50 rounded-md"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5A0A]/15 text-[#FF5A0A]">
                <Phone className="h-3.5 w-3.5" aria-hidden />
              </span>
              +91 8278985815
            </a>
            <a
              href="https://www.inoventics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]/50 rounded-md"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5A0A]/15 text-[#FF5A0A]">
                <Globe className="h-3.5 w-3.5" aria-hidden />
              </span>
              www.inoventics.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
