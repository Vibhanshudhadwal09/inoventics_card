import { FlipHorizontal2, Minus, Plus, RefreshCw } from 'lucide-react'
import type { CardControlActions, CardControlState } from '../types'

interface CardControlsProps {
  state: CardControlState
  actions: CardControlActions
}

const btnBase =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A0A]/70'

const btnIdle =
  'border-white/15 bg-[#0a0e14]/75 text-white/80 hover:border-white/25 hover:bg-white/10 hover:text-white'

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
      </div>
    </div>
  )
}
