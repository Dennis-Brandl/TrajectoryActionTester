import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import { ConnectionBar } from './ConnectionBar'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn())
})
afterEach(() => {
  localStorage.clear()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const okResponse = () =>
  new Response(JSON.stringify({ data: [], meta: { total: 0 } }), { status: 200 })

describe('ConnectionBar', () => {
  it('shows "No connection" label and grey dot when nothing is configured', () => {
    renderWithProviders(<ConnectionBar />)
    expect(screen.getByText(/no connection/i)).toBeInTheDocument()
    const dot = screen.getByTestId('connection-status-dot')
    expect(dot.className).toMatch(/disconnected|idle/i)
  })

  it('shows the app title in the bar', () => {
    renderWithProviders(<ConnectionBar />)
    expect(screen.getByText(/Trajectory Action Tester/i)).toBeInTheDocument()
  })

  it('opens the Add modal from the "+ Add connection" entry in the empty dropdown', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ConnectionBar />)
    await user.click(screen.getByTestId('connection-trigger'))
    await user.click(screen.getByRole('button', { name: /add connection/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('turns the dot green after a successful capabilities fetch', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(okResponse())
    const user = userEvent.setup()
    localStorage.setItem(
      'acT:connections:v1',
      JSON.stringify({
        connections: [
          { id: 'c1', url: 'http://localhost:3000', name: 'Local', createdAt: '2026-05-13T00:00:00Z' },
        ],
        activeConnectionId: 'c1',
      })
    )
    renderWithProviders(<ConnectionBar />)
    await waitFor(() => {
      expect(screen.getByTestId('connection-status-dot').className).toMatch(/connected/i)
    })
    expect(screen.getByText(/local/i)).toBeInTheDocument()
    void user // user not needed here but kept to demonstrate setup pattern
  })

  it('turns the dot red on a fetch failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'))
    localStorage.setItem(
      'acT:connections:v1',
      JSON.stringify({
        connections: [
          { id: 'c1', url: 'http://nope', createdAt: '2026-05-13T00:00:00Z' },
        ],
        activeConnectionId: 'c1',
      })
    )
    renderWithProviders(<ConnectionBar />)
    await waitFor(() => {
      expect(screen.getByTestId('connection-status-dot').className).toMatch(/disconnected/i)
    })
  })

  it('switches active connection when a dropdown row is clicked', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse())
    const user = userEvent.setup()
    localStorage.setItem(
      'acT:connections:v1',
      JSON.stringify({
        connections: [
          { id: 'c1', url: 'http://a', name: 'Alpha', createdAt: '2026-05-13T00:00:00Z' },
          { id: 'c2', url: 'http://b', name: 'Beta', createdAt: '2026-05-13T00:00:00Z' },
        ],
        activeConnectionId: 'c1',
      })
    )
    renderWithProviders(<ConnectionBar />)
    await user.click(screen.getByTestId('connection-trigger'))
    await user.click(screen.getByText('Beta'))
    // After selection the trigger label should now read Beta.
    expect(screen.getByTestId('connection-trigger')).toHaveTextContent(/beta/i)
  })

  it('deletes a connection from the dropdown', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse())
    const user = userEvent.setup()
    localStorage.setItem(
      'acT:connections:v1',
      JSON.stringify({
        connections: [
          { id: 'c1', url: 'http://a', name: 'Alpha', createdAt: '2026-05-13T00:00:00Z' },
          { id: 'c2', url: 'http://b', name: 'Beta', createdAt: '2026-05-13T00:00:00Z' },
        ],
        activeConnectionId: 'c1',
      })
    )
    renderWithProviders(<ConnectionBar />)
    await user.click(screen.getByTestId('connection-trigger'))
    const betaRow = screen.getByTestId('connection-row-c2')
    await user.click(betaRow.querySelector('[data-testid="delete-c2"]') as HTMLElement)
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })
})
