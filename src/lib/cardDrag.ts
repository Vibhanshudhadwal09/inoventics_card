/** Shared per-frame drag deltas between pointer bridge and the 3D card. */
export const cardDragState = {
  active: false,
  /** True while a two-finger pinch zoom is in progress */
  pinching: false,
  dx: 0,
  dy: 0,
}
