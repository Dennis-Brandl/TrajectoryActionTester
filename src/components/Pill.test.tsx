import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Pill } from './Pill'

describe('Pill', () => {
  it('renders its children', () => {
    render(<Pill>observable</Pill>)
    expect(screen.getByText('observable')).toBeInTheDocument()
  })

  it('applies the neutral variant class by default', () => {
    render(<Pill>x</Pill>)
    expect(screen.getByText('x').className).toMatch(/neutral/)
  })

  it('applies the success variant class when variant=success', () => {
    render(<Pill variant="success">done</Pill>)
    expect(screen.getByText('done').className).toMatch(/success/)
  })

  it('applies the error variant class when variant=error', () => {
    render(<Pill variant="error">err</Pill>)
    expect(screen.getByText('err').className).toMatch(/error/)
  })
})
