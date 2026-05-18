import type { ReactNode } from 'react'
import styles from './Pill.module.css'

export type PillVariant = 'neutral' | 'accent' | 'success' | 'error' | 'muted'

export interface PillProps {
  variant?: PillVariant
  children: ReactNode
}

export function Pill({ variant = 'neutral', children }: PillProps) {
  return <span className={[styles.pill, styles[variant]].join(' ')}>{children}</span>
}
