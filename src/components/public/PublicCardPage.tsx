import { Globe, Phone, UserRoundPlus } from 'lucide-react'
import type { BusinessProfile } from '../../types'
import { downloadVCard } from '../../lib/vcard'
import { BrandMark } from '../BrandMark'

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

interface PublicCardPageProps {
  profile: BusinessProfile
}

export function PublicCardPage({ profile }: PublicCardPageProps) {
  const actions = [
    {
      key: 'website',
      label: 'Website',
      href: profile.socials.website || profile.website,
      Icon: Globe,
    },
    {
      key: 'instagram',
      label: 'Instagram',
      href: profile.socials.instagram,
      Icon: InstagramGlyph,
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      href: profile.socials.whatsapp,
      Icon: WhatsAppGlyph,
    },
    {
      key: 'call',
      label: 'Call',
      href:
        profile.socials.call ||
        `tel:${profile.phoneCountryCode}${profile.phoneNumber}`.replace(
          /\s+/g,
          '',
        ),
      Icon: Phone,
    },
  ] as const

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#f7f5f2]">
      {/* Soft brand atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,90,10,0.12), transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 100%, rgba(16,24,32,0.06), transparent 50%),
            linear-gradient(180deg, #fffdfb 0%, #f4f2ef 55%, #ebe7e2 100%)
          `,
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-5 py-10 sm:max-w-xl sm:px-8 sm:py-14">
        <header className="mb-8 flex flex-col items-center text-center">
          <BrandMark src={profile.logoDataUrl} size={96} className="mb-5" />
          <h1 className="text-2xl font-extrabold tracking-tight text-[#101820] sm:text-3xl">
            {profile.businessName || 'Business Name'}
          </h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-[#6b6b6b] sm:text-base">
            {profile.tagline || 'Your tagline'}
          </p>
        </header>

        <div className="mb-6 grid grid-cols-4 gap-3 sm:gap-4">
          {actions.map(({ key, label, href, Icon }) => (
            <a
              key={key}
              href={href || '#'}
              target={key === 'call' ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2"
              onClick={(e) => {
                if (!href) e.preventDefault()
              }}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#FF5A0A]/40 bg-white text-[#FF5A0A] shadow-sm transition hover:border-[#FF5A0A] hover:bg-[#FF5A0A]/5 sm:h-16 sm:w-16">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <span className="text-[11px] font-semibold text-[#555] sm:text-xs">
                {label}
              </span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => downloadVCard(profile)}
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A0A] px-4 py-4 text-sm font-bold text-white shadow-[0_10px_28px_-10px_rgba(255,90,10,0.75)] transition hover:bg-[#e84f08] active:scale-[0.99] sm:text-base"
        >
          <UserRoundPlus className="h-5 w-5" aria-hidden />
          Save Contact
        </button>

        <section className="mb-8 rounded-3xl border border-black/5 bg-white p-5 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.2)] sm:p-6">
          <h2 className="mb-4 text-sm font-bold tracking-wide text-[#101820] sm:text-base">
            {profile.servicesHeading || 'Our Services'}
          </h2>
          <ul className="space-y-3">
            {profile.services.length === 0 ? (
              <li className="text-sm text-[#999]">No services listed</li>
            ) : (
              profile.services.map((s) => (
                <li
                  key={s.id}
                  className="flex items-start gap-3 text-sm text-[#333] sm:text-[15px]"
                >
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#FF5A0A]"
                    aria-hidden
                  />
                  <span>{s.label}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <footer className="relative mt-auto overflow-hidden rounded-2xl bg-white/60 px-6 py-8 text-center">
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-14 w-14 rounded-tr-[2.5rem] bg-[#FF5A0A]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-0 bottom-0 h-10 w-20 rounded-tl-[2rem] bg-[#101820]"
            aria-hidden
          />
          <p className="relative z-[1] text-sm font-semibold tracking-wide text-[#5a5a5a]">
            {profile.footerSlogan}
          </p>
        </footer>
      </div>
    </div>
  )
}
