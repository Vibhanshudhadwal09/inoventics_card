import {
  Contact,
  FlipHorizontal2,
  Minus,
  Phone,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { CONTACT, type CardControlActions, type CardControlState } from '../types'

interface CardControlsProps {
  state: CardControlState
  actions: CardControlActions
}

const btnBase =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]/70'

const btnIdle =
  'border-white/15 bg-[#0a0e14]/75 text-white/80 hover:border-white/25 hover:bg-white/10 hover:text-white'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function saveContactToDevice() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${CONTACT.company}`,
    `ORG:${CONTACT.company}`,
    `TEL;TYPE=CELL,VOICE:${CONTACT.phoneTel}`,
    `URL:${CONTACT.website}`,
    'END:VCARD',
  ].join('\n')

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'Inoventics.vcf'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function CardControls({ state, actions }: CardControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 z-20 flex items-start justify-end px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4">
      <div
        className="pointer-events-auto flex flex-col items-center gap-2"
        role="toolbar"
        aria-label="Card controls"
      >
        <button
          type="button"
          onClick={actions.flip}
          aria-label="Flip card"
          title="Flip card"
          className={`${btnBase} ${btnIdle} text-[#FF5A0A]`}
        >
          <FlipHorizontal2 className="h-[18px] w-[18px]" aria-hidden />
        </button>

        <button
          type="button"
          onClick={actions.toggleAutoRotate}
          aria-label={
            state.autoRotate ? 'Turn auto rotate off' : 'Turn auto rotate on'
          }
          aria-pressed={state.autoRotate}
          title="Auto-rotate"
          className={[
            btnBase,
            state.autoRotate
              ? 'border-[#FF5A0A]/70 bg-[#FF5A0A]/20 text-[#FF5A0A]'
              : btnIdle,
          ].join(' ')}
        >
          <RefreshCw className="h-[18px] w-[18px]" aria-hidden />
        </button>

        <button
          type="button"
          onClick={actions.zoomIn}
          aria-label="Zoom in"
          title="Zoom in"
          className={`${btnBase} ${btnIdle}`}
        >
          <Plus className="h-[18px] w-[18px]" aria-hidden />
        </button>

        <button
          type="button"
          onClick={actions.zoomOut}
          aria-label="Zoom out"
          title="Zoom out"
          className={`${btnBase} ${btnIdle}`}
        >
          <Minus className="h-[18px] w-[18px]" aria-hidden />
        </button>

        <span className="my-0.5 h-px w-6 bg-white/15" aria-hidden />

        <a
          href={CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="WhatsApp"
          className={`${btnBase} border-[#25D366]/40 bg-[#25D366]/15 text-[#25D366] hover:border-[#25D366]/70 hover:bg-[#25D366]/25`}
        >
          <WhatsAppIcon className="h-[18px] w-[18px]" />
        </a>

        <a
          href={CONTACT.telUrl}
          aria-label={`Call ${CONTACT.phoneDisplay}`}
          title="Call"
          className={`${btnBase} ${btnIdle} text-[#FF5A0A]`}
        >
          <Phone className="h-[18px] w-[18px]" aria-hidden />
        </a>

        <button
          type="button"
          onClick={saveContactToDevice}
          aria-label="Save contact to device"
          title="Save contact"
          className={`${btnBase} ${btnIdle}`}
        >
          <Contact className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </div>
    </div>
  )
}
