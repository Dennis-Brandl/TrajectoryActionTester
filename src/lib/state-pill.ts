import type { PillVariant } from '../components/Pill'

const SUCCESS_STATES = new Set(['COMPLETED'])
const ERROR_STATES = new Set(['ABORTED', 'ABORTING', 'STOPPING', 'CLEARING'])
const ACCENT_STATES = new Set([
  'EXECUTING',
  'IN_PROGRESS',
  'STARTING',
  'COMPLETING',
  'UNPAUSING',
  'UNHOLDING',
])
const NEUTRAL_STATES = new Set(['PAUSED', 'HELD', 'PAUSING', 'HOLDING', 'POSTED', 'RECEIVED'])

export function pillVariantForState(state: string | undefined | null): PillVariant {
  if (!state) return 'muted'
  if (SUCCESS_STATES.has(state)) return 'success'
  if (ERROR_STATES.has(state)) return 'error'
  if (ACCENT_STATES.has(state)) return 'accent'
  if (NEUTRAL_STATES.has(state)) return 'neutral'
  return 'muted'
}
