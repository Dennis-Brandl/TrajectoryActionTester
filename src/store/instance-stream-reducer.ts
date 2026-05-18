import type {
  Instance,
  InstanceLiveState,
  SseEventWire,
  StateEntry,
} from '../api/types'

const TERMINAL_STATES = new Set(['COMPLETED', 'ABORTED'])

function durationMs(from: string, to: string): number {
  return new Date(to).getTime() - new Date(from).getTime()
}

export function initialStateFromInstance(instance: Instance): InstanceLiveState {
  const history: StateEntry[] = []
  if (instance.state.previous) {
    const previousEnteredAt =
      instance.started_at ?? instance.created_at ?? instance.state.entered_at
    history.push({
      state: instance.state.previous,
      entered_at: previousEnteredAt,
      duration_ms: durationMs(previousEnteredAt, instance.state.entered_at),
    })
  }
  history.push({
    state: instance.state.current,
    entered_at: instance.state.entered_at,
  })

  const outputs: Record<string, string> = {}
  for (const out of instance.outputs) {
    outputs[out.key] = out.value
  }

  return {
    instance_id: instance.instance_id,
    visibility: instance.visibility,
    current_state: instance.state.current,
    state_history: history,
    outputs,
    terminal_error: instance.error,
    terminal: TERMINAL_STATES.has(instance.state.current),
    last_event_id: -1,
  }
}

export function instanceStreamReducer(
  state: InstanceLiveState,
  event: SseEventWire
): InstanceLiveState {
  if (event.id <= state.last_event_id) return state

  switch (event.type) {
    case 'state_change': {
      const finalizedHistory = state.state_history.map((entry, idx) =>
        idx === state.state_history.length - 1
          ? { ...entry, duration_ms: durationMs(entry.entered_at, event.data.timestamp) }
          : entry
      )
      return {
        ...state,
        current_state: event.data.state,
        state_history: [
          ...finalizedHistory,
          { state: event.data.state, entered_at: event.data.timestamp },
        ],
        terminal: TERMINAL_STATES.has(event.data.state),
        last_event_id: event.id,
      }
    }

    case 'output': {
      const merged = { ...state.outputs }
      for (const out of event.data.outputs) {
        merged[out.key] = out.value
      }
      return { ...state, outputs: merged, last_event_id: event.id }
    }

    case 'log': {
      if (event.data.stream !== 'stderr') {
        return { ...state, last_event_id: event.id }
      }
      const message = event.data.message
      const traceback = message.includes('Traceback (most recent call last)')
        ? message
        : state.latest_traceback
      return {
        ...state,
        latest_error: message,
        ...(traceback !== undefined ? { latest_traceback: traceback } : {}),
        last_event_id: event.id,
      }
    }

    case 'heartbeat':
      return { ...state, last_event_id: event.id }

    default: {
      const _exhaustive: never = event
      void _exhaustive
      return state
    }
  }
}
