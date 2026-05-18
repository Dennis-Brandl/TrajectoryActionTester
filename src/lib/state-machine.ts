import type { ActionVisibility, Command } from '../api/types'

/**
 * Source of truth (do not import — tester is standalone):
 * packages/engine/src/state-machine/transitions.ts:13-94
 * packages/engine/src/state-machine/states.ts:81-91 (ANY_ACTIVE_STATES)
 */

const ANY_ACTIVE_STATES = [
  'STARTING',
  'EXECUTING',
  'COMPLETING',
  'PAUSING',
  'PAUSED',
  'UNPAUSING',
  'HOLDING',
  'HELD',
  'UNHOLDING',
] as const

const OPAQUE_ACTIVE_STATES = ['POSTED', 'RECEIVED', 'IN_PROGRESS'] as const

export const OBSERVABLE_COMMANDS: readonly Command[] = [
  'PAUSE',
  'RESUME',
  'HOLD',
  'UNHOLD',
  'ABORT',
  'STOP',
  'CLEAR',
]

export const OPAQUE_COMMANDS: readonly Command[] = ['ABORT']

function buildObservableTable(): Map<string, Set<Command>> {
  const table = new Map<string, Set<Command>>()
  const add = (state: string, command: Command) => {
    let set = table.get(state)
    if (!set) {
      set = new Set()
      table.set(state, set)
    }
    set.add(command)
  }
  add('EXECUTING', 'PAUSE')
  add('PAUSED', 'RESUME')
  add('HELD', 'UNHOLD')
  add('ABORTED', 'CLEAR')
  for (const state of ANY_ACTIVE_STATES) {
    add(state, 'HOLD')
    add(state, 'ABORT')
    add(state, 'STOP')
  }
  return table
}

function buildOpaqueTable(): Map<string, Set<Command>> {
  const table = new Map<string, Set<Command>>()
  for (const state of OPAQUE_ACTIVE_STATES) {
    table.set(state, new Set<Command>(['ABORT']))
  }
  return table
}

const OBSERVABLE_TABLE = buildObservableTable()
const OPAQUE_TABLE = buildOpaqueTable()

export function isCommandValid(
  visibility: ActionVisibility,
  state: string,
  command: Command
): boolean {
  const table = visibility === 'observable' ? OBSERVABLE_TABLE : OPAQUE_TABLE
  return table.get(state)?.has(command) ?? false
}
