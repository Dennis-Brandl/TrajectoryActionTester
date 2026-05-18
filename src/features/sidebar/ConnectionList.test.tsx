import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import { ConnectionList } from './ConnectionList'

beforeEach(() => {
  localStorage.clear()
})
afterEach(() => {
  localStorage.clear()
})

describe('ConnectionList', () => {
  it('shows a placeholder when no connections exist', () => {
    renderWithProviders(<ConnectionList />)
    expect(screen.getByText(/no connections yet/i)).toBeInTheDocument()
  })

  it('renders one row per saved connection', () => {
    localStorage.setItem(
      'acT:connections:v1',
      JSON.stringify({
        connections: [
          { id: 'a', url: 'http://a', name: 'Alpha', createdAt: '2026-05-13T00:00:00Z' },
          { id: 'b', url: 'http://b', name: 'Beta', createdAt: '2026-05-13T00:00:00Z' },
        ],
        activeConnectionId: 'a',
      })
    )
    renderWithProviders(<ConnectionList />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('highlights the active row', () => {
    localStorage.setItem(
      'acT:connections:v1',
      JSON.stringify({
        connections: [
          { id: 'a', url: 'http://a', name: 'Alpha', createdAt: '2026-05-13T00:00:00Z' },
          { id: 'b', url: 'http://b', name: 'Beta', createdAt: '2026-05-13T00:00:00Z' },
        ],
        activeConnectionId: 'b',
      })
    )
    renderWithProviders(<ConnectionList />)
    const betaRow = screen.getByTestId('sidebar-conn-b')
    expect(betaRow.className).toMatch(/active/i)
  })

  it('selects a connection on click', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      'acT:connections:v1',
      JSON.stringify({
        connections: [
          { id: 'a', url: 'http://a', name: 'Alpha', createdAt: '2026-05-13T00:00:00Z' },
          { id: 'b', url: 'http://b', name: 'Beta', createdAt: '2026-05-13T00:00:00Z' },
        ],
        activeConnectionId: 'a',
      })
    )
    renderWithProviders(<ConnectionList />)
    await user.click(screen.getByText('Beta'))
    const betaRow = screen.getByTestId('sidebar-conn-b')
    expect(betaRow.className).toMatch(/active/i)
  })
})
