import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AllProviders, createTestQueryClient } from '../test-utils'
import { ApiError } from '../api/types'
import { useSendCommand } from './use-send-command'
import type { Connection } from '../api/types'

const connection: Connection = {
  id: 'conn-1',
  url: 'http://localhost:3000',
  createdAt: '2026-05-14T00:00:00Z',
}

// Seed localStorage so useActiveConnection() returns `connection`.
// Matches the format written by ConnectionsProvider / use-local-storage-persist.
function seedActiveConnection() {
  localStorage.setItem(
    'acT:connections:v1',
    JSON.stringify({
      connections: [connection],
      activeConnectionId: connection.id,
    })
  )
}

function setupWithActiveConnection() {
  seedActiveConnection()
  const client = createTestQueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <AllProviders queryClient={client}>{children}</AllProviders>
  )
}

describe('useSendCommand', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    localStorage.clear()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('starts in idle state', () => {
    const { result } = renderHook(() => useSendCommand(), { wrapper: setupWithActiveConnection() })
    expect(result.current.status).toBe('idle')
    expect(result.current.isPending).toBe(false)
  })

  it('on mutate, calls sendCommand against the active connection', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: { instance_id: 'inst-1', command: 'PAUSE', accepted: true },
          meta: {},
        }),
        { status: 200 }
      )
    )

    const { result } = renderHook(() => useSendCommand(), { wrapper: setupWithActiveConnection() })

    act(() => {
      result.current.mutate({ instanceId: 'inst-1', command: 'PAUSE' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({ instance_id: 'inst-1', command: 'PAUSE', accepted: true })
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/trajectory/v1/instances/inst-1/command',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('surfaces ApiError on failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { code: 'INVALID_COMMAND' } }), {
        status: 422,
        statusText: 'Unprocessable Entity',
      })
    )

    const { result } = renderHook(() => useSendCommand(), { wrapper: setupWithActiveConnection() })

    act(() => {
      result.current.mutate({ instanceId: 'inst-1', command: 'PAUSE' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(ApiError)
  })

  it('rejects when no active connection', async () => {
    const client = createTestQueryClient()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AllProviders queryClient={client}>{children}</AllProviders>
    )
    const { result } = renderHook(() => useSendCommand(), { wrapper })

    act(() => {
      result.current.mutate({ instanceId: 'inst-1', command: 'PAUSE' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toMatch(/no active connection/i)
  })
})
