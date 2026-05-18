import styles from './ErrorPanel.module.css'

export interface ErrorPanelProps {
  terminalError: string | null
  latestError: string | undefined
  latestTraceback: string | undefined
}

export function ErrorPanel({ terminalError, latestError, latestTraceback }: ErrorPanelProps) {
  if (!terminalError && !latestError && !latestTraceback) {
    return null
  }

  return (
    <section className={styles.panel} aria-label="Errors">
      {terminalError && (
        <div className={styles.block}>
          <h3 className={styles.heading}>Terminal error</h3>
          <pre className={styles.body}>{terminalError}</pre>
        </div>
      )}
      {latestError && (
        <div className={styles.block}>
          <h3 className={styles.heading}>Latest error</h3>
          <pre className={styles.body}>{latestError}</pre>
        </div>
      )}
      {latestTraceback && (
        <div className={styles.block}>
          <h3 className={styles.heading}>Traceback</h3>
          <pre className={styles.body}>{latestTraceback}</pre>
        </div>
      )}
    </section>
  )
}
