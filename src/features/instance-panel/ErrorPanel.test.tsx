import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorPanel } from './ErrorPanel'

describe('ErrorPanel', () => {
  it('renders nothing when all error fields are empty', () => {
    const { container } = render(
      <ErrorPanel terminalError={null} latestError={undefined} latestTraceback={undefined} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows terminalError as a labelled block when set', () => {
    render(
      <ErrorPanel
        terminalError="action timed out"
        latestError={undefined}
        latestTraceback={undefined}
      />
    )
    expect(screen.getByText(/terminal error/i)).toBeInTheDocument()
    expect(screen.getByText('action timed out')).toBeInTheDocument()
  })

  it('shows latest stderr message', () => {
    render(
      <ErrorPanel
        terminalError={null}
        latestError="NameError: x is not defined"
        latestTraceback={undefined}
      />
    )
    expect(screen.getByText(/latest error/i)).toBeInTheDocument()
    expect(screen.getByText('NameError: x is not defined')).toBeInTheDocument()
  })

  it('shows traceback when set', () => {
    render(
      <ErrorPanel
        terminalError={null}
        latestError={undefined}
        latestTraceback={'Traceback (most recent call last):\n  File "x.py"'}
      />
    )
    expect(screen.getAllByText(/traceback/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/File "x\.py"/)).toBeInTheDocument()
  })

  it('renders all three blocks together when all set', () => {
    render(
      <ErrorPanel
        terminalError="failed"
        latestError="boom"
        latestTraceback="Traceback (most recent call last):\nline 1"
      />
    )
    expect(screen.getByText(/terminal error/i)).toBeInTheDocument()
    expect(screen.getByText(/latest error/i)).toBeInTheDocument()
    expect(screen.getAllByText(/traceback/i).length).toBeGreaterThanOrEqual(1)
  })
})
