import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { Connection } from '../api/types'
import { loadLocalStorage, useLocalStoragePersist } from './use-local-storage-persist'

export const STORAGE_KEY = 'acT:connections:v1'

export interface ConnectionsState {
  connections: Connection[]
  activeConnectionId: string | null
}

export type ConnectionsAction =
  | { type: 'add'; connection: Connection }
  | { type: 'update'; id: string; patch: Partial<Omit<Connection, 'id' | 'createdAt'>> }
  | { type: 'delete'; id: string }
  | { type: 'select'; id: string | null }

const INITIAL_STATE: ConnectionsState = { connections: [], activeConnectionId: null }

export function connectionsReducer(state: ConnectionsState, action: ConnectionsAction): ConnectionsState {
  switch (action.type) {
    case 'add': {
      const list = [...state.connections, action.connection]
      return {
        connections: list,
        activeConnectionId: state.activeConnectionId ?? action.connection.id,
      }
    }
    case 'update': {
      return {
        ...state,
        connections: state.connections.map((c) =>
          c.id === action.id ? { ...c, ...action.patch } : c
        ),
      }
    }
    case 'delete': {
      const filtered = state.connections.filter((c) => c.id !== action.id)
      const nextActive =
        state.activeConnectionId === action.id
          ? (filtered[0]?.id ?? null)
          : state.activeConnectionId
      return { connections: filtered, activeConnectionId: nextActive }
    }
    case 'select': {
      return { ...state, activeConnectionId: action.id }
    }
    default: {
      // Exhaustiveness check: if a new ConnectionsAction variant is added
      // without a case above, TS will fail this assignment.
      const _exhaustive: never = action
      void _exhaustive
      return state
    }
  }
}

export interface ConnectionsApi {
  state: ConnectionsState
  addConnection: (fields: { url: string; name?: string; apiKey?: string }) => Connection
  updateConnection: (id: string, patch: Partial<Omit<Connection, 'id' | 'createdAt'>>) => void
  deleteConnection: (id: string) => void
  selectConnection: (id: string | null) => void
}

const ConnectionsContext = createContext<ConnectionsApi | null>(null)

export function ConnectionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    connectionsReducer,
    INITIAL_STATE,
    (initial) => loadLocalStorage(STORAGE_KEY, initial)
  )

  useLocalStoragePersist(STORAGE_KEY, state)

  const addConnection = useCallback<ConnectionsApi['addConnection']>((fields) => {
    const connection: Connection = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      url: fields.url,
      ...(fields.name !== undefined && { name: fields.name }),
      ...(fields.apiKey !== undefined && { apiKey: fields.apiKey }),
    }
    dispatch({ type: 'add', connection })
    return connection
  }, [])

  const updateConnection = useCallback<ConnectionsApi['updateConnection']>((id, patch) => {
    dispatch({ type: 'update', id, patch })
  }, [])

  const deleteConnection = useCallback<ConnectionsApi['deleteConnection']>((id) => {
    dispatch({ type: 'delete', id })
  }, [])

  const selectConnection = useCallback<ConnectionsApi['selectConnection']>((id) => {
    dispatch({ type: 'select', id })
  }, [])

  const value = useMemo<ConnectionsApi>(
    () => ({ state, addConnection, updateConnection, deleteConnection, selectConnection }),
    [state, addConnection, updateConnection, deleteConnection, selectConnection]
  )

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>
}

// Co-located with the provider above to keep all connections API surface in one module.
// Splitting into a separate file just to satisfy this lint rule would obscure the boundary.
// eslint-disable-next-line react-refresh/only-export-components
export function useConnections(): ConnectionsApi {
  const ctx = useContext(ConnectionsContext)
  if (!ctx) {
    throw new Error('useConnections must be used within a ConnectionsProvider')
  }
  return ctx
}

// Co-located with the provider above to keep all connections API surface in one module.
// Splitting into a separate file just to satisfy this lint rule would obscure the boundary.
// eslint-disable-next-line react-refresh/only-export-components
export function useActiveConnection(): Connection | null {
  const { state } = useConnections()
  return state.connections.find((c) => c.id === state.activeConnectionId) ?? null
}
