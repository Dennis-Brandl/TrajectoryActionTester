import { useId, type InputHTMLAttributes } from 'react'
import styles from './TextInput.module.css'

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  helper?: string
  error?: string
}

export function TextInput({ label, helper, error, id, type = 'text', ...rest }: TextInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        {...rest}
        id={inputId}
        type={type}
        className={[styles.input, error ? styles.invalid : ''].join(' ').trim()}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error || helper ? `${inputId}-msg` : undefined}
      />
      {(error ?? helper) && (
        <p id={`${inputId}-msg`} className={error ? styles.error : styles.helper}>
          {error ?? helper}
        </p>
      )}
    </div>
  )
}
