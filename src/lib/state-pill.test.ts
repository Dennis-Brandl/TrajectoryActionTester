import { describe, it, expect } from 'vitest'
import { pillVariantForState } from './state-pill'

describe('pillVariantForState', () => {
  it.each(['COMPLETED'])('success for terminal-success state %s', (state) => {
    expect(pillVariantForState(state)).toBe('success')
  })

  it.each(['ABORTED', 'ABORTING', 'STOPPING', 'CLEARING'])(
    'error for terminal-error / cancel state %s',
    (state) => {
      expect(pillVariantForState(state)).toBe('error')
    }
  )

  it.each(['EXECUTING', 'IN_PROGRESS', 'STARTING', 'COMPLETING', 'UNPAUSING', 'UNHOLDING'])(
    'accent for active progressive state %s',
    (state) => {
      expect(pillVariantForState(state)).toBe('accent')
    }
  )

  it.each(['PAUSED', 'HELD', 'PAUSING', 'HOLDING'])(
    'neutral for paused/held lifecycle state %s',
    (state) => {
      expect(pillVariantForState(state)).toBe('neutral')
    }
  )

  it.each(['POSTED', 'RECEIVED'])('neutral for opaque pre-progress state %s', (state) => {
    expect(pillVariantForState(state)).toBe('neutral')
  })

  it('muted for undefined / unknown state', () => {
    expect(pillVariantForState(undefined)).toBe('muted')
    expect(pillVariantForState('UNKNOWN_STATE')).toBe('muted')
    expect(pillVariantForState('')).toBe('muted')
  })
})
