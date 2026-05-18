import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../test-utils'
import { ConnectionModal } from './ConnectionModal'

describe('ConnectionModal — add mode', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => {
    localStorage.clear()
  })

  it('renders three fields in add mode', () => {
    renderWithProviders(<ConnectionModal open onClose={() => {}} />)
    expect(screen.getByLabelText(/server url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/api key/i)).toBeInTheDocument()
  })

  it('disables Save until URL is provided', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ConnectionModal open onClose={() => {}} />)
    const save = screen.getByRole('button', { name: /save/i })
    expect(save).toBeDisabled()
    await user.type(screen.getByLabelText(/server url/i), 'http://localhost:3000')
    expect(save).not.toBeDisabled()
  })

  it('shows a validation error for an unparseable URL', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ConnectionModal open onClose={() => {}} />)
    await user.type(screen.getByLabelText(/server url/i), 'not-a-url')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getByText(/must be a valid http\(s\) url/i)).toBeInTheDocument()
  })

  it('rejects ftp:// URLs', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ConnectionModal open onClose={() => {}} />)
    await user.type(screen.getByLabelText(/server url/i), 'ftp://example.com')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getByText(/must be a valid http\(s\) url/i)).toBeInTheDocument()
  })

  it('calls onClose after a successful add', async () => {
    const user = userEvent.setup()
    let closed = false
    renderWithProviders(<ConnectionModal open onClose={() => { closed = true }} />)
    await user.type(screen.getByLabelText(/server url/i), 'http://localhost:3000')
    await user.type(screen.getByLabelText(/name/i), 'Local dev')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(closed).toBe(true)
  })

  it('Cancel calls onClose without saving', async () => {
    const user = userEvent.setup()
    let closed = false
    renderWithProviders(<ConnectionModal open onClose={() => { closed = true }} />)
    await user.type(screen.getByLabelText(/server url/i), 'http://localhost:3000')
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(closed).toBe(true)
    expect(localStorage.getItem('acT:connections:v1')).toMatch(/"connections":\[\]/)
  })

  it('trims whitespace from the URL before persisting', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ConnectionModal open onClose={() => {}} />)
    await user.type(screen.getByLabelText(/server url/i), '  http://localhost:3000  ')
    await user.click(screen.getByRole('button', { name: /save/i }))
    const stored = JSON.parse(localStorage.getItem('acT:connections:v1') ?? 'null')
    expect(stored.connections[0].url).toBe('http://localhost:3000')
  })
})

describe('ConnectionModal — edit mode', () => {
  beforeEach(() => {
    localStorage.setItem(
      'acT:connections:v1',
      JSON.stringify({
        connections: [
          {
            id: 'conn-1',
            url: 'http://localhost:3000',
            name: 'Local dev',
            apiKey: 'sekret',
            createdAt: '2026-05-13T00:00:00Z',
          },
        ],
        activeConnectionId: 'conn-1',
      })
    )
  })
  afterEach(() => {
    localStorage.clear()
  })

  it('prefills the form with the existing connection', () => {
    renderWithProviders(<ConnectionModal open onClose={() => {}} editingId="conn-1" />)
    expect(screen.getByLabelText(/server url/i)).toHaveValue('http://localhost:3000')
    expect(screen.getByLabelText(/name/i)).toHaveValue('Local dev')
    expect(screen.getByLabelText(/api key/i)).toHaveValue('sekret')
  })

  it('updates the connection on save', async () => {
    const user = userEvent.setup()
    let closed = false
    renderWithProviders(
      <ConnectionModal open onClose={() => { closed = true }} editingId="conn-1" />
    )
    const nameInput = screen.getByLabelText(/name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Production')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(closed).toBe(true)
    const stored = JSON.parse(localStorage.getItem('acT:connections:v1') ?? 'null')
    expect(stored.connections[0].name).toBe('Production')
  })
})
