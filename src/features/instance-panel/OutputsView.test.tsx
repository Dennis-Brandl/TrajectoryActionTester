import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OutputsView } from './OutputsView'

describe('OutputsView', () => {
  it('shows empty message when outputs is empty', () => {
    render(<OutputsView outputs={{}} />)
    expect(screen.getByText(/no outputs yet/i)).toBeInTheDocument()
  })

  it('renders one row per output key', () => {
    render(<OutputsView outputs={{ status: '0', detail: 'ok' }} />)
    expect(screen.getByText('status')).toBeInTheDocument()
    expect(screen.getByText('detail')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('ok')).toBeInTheDocument()
  })

  it('renders keys in alphabetical order', () => {
    render(<OutputsView outputs={{ zeta: 'z', alpha: 'a', mu: 'm' }} />)
    const keys = screen.getAllByTestId('output-key').map((el) => el.textContent)
    expect(keys).toEqual(['alpha', 'mu', 'zeta'])
  })

  it('renders empty-string values without collapsing the row', () => {
    render(<OutputsView outputs={{ status: '' }} />)
    expect(screen.getByText('status')).toBeInTheDocument()
    // The value cell should be present even when value is empty
    expect(screen.getByTestId('output-value-status')).toBeInTheDocument()
  })
})
