import { Settings } from 'lucide-react'
import { BrandMark } from '../BrandMark'

/** Fixed Inoventics product branding — not tied to the uploaded business logo. */
export function AdminSidebar() {
  return (
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-black/5 bg-white lg:flex">
      <div className="flex items-center gap-2.5 border-b border-black/5 px-5 py-5">
        <BrandMark size={32} />
        <span className="text-sm font-extrabold tracking-[0.12em] text-[#101820]">
          INOVENTICS
        </span>
      </div>

      <div className="mt-auto border-t border-black/5 p-5">
        <div className="flex items-start gap-3 rounded-2xl bg-[#f7f5f2] p-3.5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF5A0A]/10 text-[#FF5A0A]">
            <Settings className="h-4 w-4" aria-hidden />
          </span>
          <p className="text-xs leading-relaxed text-[#5c5c5c]">
            Your brand. Your way. Edit here, then open the public website at{' '}
            <span className="font-semibold text-[#FF5A0A]">/</span> to view the
            full page.
          </p>
        </div>
      </div>
    </aside>
  )
}
