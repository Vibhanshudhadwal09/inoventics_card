import { BusinessCardScene } from './components/BusinessCardScene'
import { CardControls } from './components/CardControls'
import { useCardControls } from './hooks/useCardControls'

export default function App() {
  const { state, actions, setZoom } = useCardControls()

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#ebe1d4]">
      <h1 className="sr-only">Inoventics Private Limited — 3D Business Card</h1>

      <BusinessCardScene
        state={state}
        actions={actions}
        onZoomChange={setZoom}
      />

      <CardControls state={state} actions={actions} />
    </div>
  )
}
