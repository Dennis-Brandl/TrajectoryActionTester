import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'md' | 'sm'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const className = [styles.button, styles[variant], styles[size]].join(' ')
  return (
    <button {...rest} type={type} className={className}>
      {children}
    </button>
  )
}
