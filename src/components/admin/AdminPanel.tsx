import { useRef, type ChangeEvent, type ReactNode } from 'react'
import {
  Globe,
  GripVertical,
  Link2,
  Phone,
  Plus,
  Trash2,
} from 'lucide-react'
import type { BusinessProfileApi } from '../../hooks/useBusinessProfile'
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

function SectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-6">
      <h2 className="mb-4 text-sm font-bold tracking-wide text-[#101820]">
        {title}
      </h2>
      {children}
    </section>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-[#6b6b6b]">
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-xl border border-black/10 bg-[#fafafa] px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition focus:border-[#FF5A0A]/50 focus:bg-white focus:ring-2 focus:ring-[#FF5A0A]/15'

interface AdminPanelProps {
  api: BusinessProfileApi
}

export function AdminPanel({ api }: AdminPanelProps) {
  const { profile, update, updateSocial, setLogo, addService, updateService, removeService, moveService } =
    api
  const fileRef = useRef<HTMLInputElement>(null)
  const dragIndex = useRef<number | null>(null)

  const onLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setLogo(reader.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <SectionCard title="Business Logo">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-[#f7f5f2]">
            <BrandMark src={profile.logoDataUrl} size={64} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLogo(null)}
                className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold text-[#555] transition hover:bg-black/[0.03]"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg bg-[#FF5A0A] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#e84f08]"
              >
                Change Logo
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onLogoChange}
              />
            </div>
            <p className="text-[11px] text-[#8a8a8a]">
              Recommended size: 512×512 px (PNG or JPG)
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Basic Information">
        <div className="grid gap-4">
          <div>
            <FieldLabel>Business Name</FieldLabel>
            <input
              className={inputClass}
              value={profile.businessName}
              onChange={(e) => update('businessName', e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Work Info</FieldLabel>
            <input
              className={inputClass}
              value={profile.workInfo}
              onChange={(e) => update('workInfo', e.target.value)}
              placeholder="e.g. Software Development Company"
            />
            <p className="mt-1.5 text-[11px] text-[#8a8a8a]">
              Shown under Work Info on the public page and in saved phone
              contacts (instead of the business name).
            </p>
          </div>
          <div>
            <FieldLabel>Tagline / Notes</FieldLabel>
            <input
              className={inputClass}
              value={profile.tagline}
              onChange={(e) => update('tagline', e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-[110px_1fr]">
            <div>
              <FieldLabel>Code</FieldLabel>
              <input
                className={inputClass}
                value={profile.phoneCountryCode}
                onChange={(e) => update('phoneCountryCode', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Phone Number</FieldLabel>
              <input
                className={inputClass}
                value={profile.phoneNumber}
                onChange={(e) => update('phoneNumber', e.target.value)}
                inputMode="tel"
              />
            </div>
          </div>
          <div>
            <FieldLabel>Website</FieldLabel>
            <input
              className={inputClass}
              value={profile.website}
              onChange={(e) => {
                update('website', e.target.value)
                updateSocial('website', e.target.value)
              }}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Social Links">
        <div className="grid gap-3">
          {(
            [
              { key: 'website' as const, label: 'Website', Icon: Globe },
              { key: 'instagram' as const, label: 'Instagram', Icon: InstagramGlyph },
              { key: 'whatsapp' as const, label: 'WhatsApp', Icon: WhatsAppGlyph },
              { key: 'call' as const, label: 'Call', Icon: Phone },
            ] as const
          ).map(({ key, label, Icon }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/8 bg-[#fafafa] text-[#FF5A0A]">
                <Icon className="h-4 w-4" />
              </span>
              <input
                className={inputClass}
                value={profile.socials[key]}
                onChange={(e) => updateSocial(key, e.target.value)}
                placeholder={label}
                aria-label={label}
              />
              <span className="hidden text-[#c0c0c0] sm:inline" aria-hidden>
                <Link2 className="h-4 w-4" />
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Services / Products">
        <div className="mb-3">
          <FieldLabel>Section Heading</FieldLabel>
          <input
            className={inputClass}
            value={profile.servicesHeading}
            onChange={(e) => update('servicesHeading', e.target.value)}
          />
        </div>
        <ul className="flex flex-col gap-2">
          {profile.services.map((service, index) => (
            <li
              key={service.id}
              draggable
              onDragStart={() => {
                dragIndex.current = index
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex.current === null || dragIndex.current === index) return
                moveService(dragIndex.current, index)
                dragIndex.current = null
              }}
              className="flex items-center gap-2 rounded-xl border border-black/8 bg-[#fafafa] px-2 py-1.5"
            >
              <button
                type="button"
                className="cursor-grab px-1 text-[#b0b0b0] active:cursor-grabbing"
                aria-label="Drag to reorder"
                tabIndex={-1}
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <input
                className="min-w-0 flex-1 border-0 bg-transparent px-1 py-1.5 text-sm outline-none"
                value={service.label}
                onChange={(e) => updateService(service.id, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeService(service.id)}
                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                aria-label={`Remove ${service.label}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={addService}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#FF5A0A]/40 px-3 py-2 text-xs font-semibold text-[#FF5A0A] transition hover:bg-[#FF5A0A]/5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </button>
      </SectionCard>

      <SectionCard title="Footer">
        <FieldLabel>Footer Slogan</FieldLabel>
        <input
          className={inputClass}
          value={profile.footerSlogan}
          onChange={(e) => update('footerSlogan', e.target.value)}
        />
      </SectionCard>
    </div>
  )
}
