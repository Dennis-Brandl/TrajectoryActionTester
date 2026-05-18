import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { App } from './App'
import { renderWithProviders } from './test-utils'

describe('App shell', () => {
  it('renders the three-pane shell landmarks', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /sidebar/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: /inspector/i })).toBeInTheDocument()
  })

  it('shows the Connections sidebar section', () => {
    renderWithProviders(<App />)
    expect(
      screen.getByRole('button', { name: /connections/i, expanded: true })
    ).toBeInTheDocument()
  })

  it('shows the Actions sidebar section', () => {
    renderWithProviders(<App />)
    expect(
      screen.getByRole('button', { name: /^actions$/i, expanded: true })
    ).toBeInTheDocument()
  })

  it('shows the Instances sidebar section', () => {
    renderWithProviders(<App />)
    expect(
      screen.getByRole('button', { name: /^instances$/i, expanded: true })
    ).toBeInTheDocument()
  })

  it('main pane defaults to the idle placeholder', () => {
    renderWithProviders(<App />)
    expect(
      screen.getByText(/select an action or instance from the sidebar/i)
    ).toBeInTheDocument()
  })
})
