import styles from './OutputsView.module.css'

export interface OutputsViewProps {
  outputs: Record<string, string>
}

export function OutputsView({ outputs }: OutputsViewProps) {
  const keys = Object.keys(outputs).sort()

  if (keys.length === 0) {
    return <p className={styles.empty}>No outputs yet.</p>
  }

  return (
    <dl className={styles.list}>
      {keys.map((key) => (
        <div className={styles.row} key={key}>
          <dt className={styles.key} data-testid="output-key">
            {key}
          </dt>
          <dd className={styles.value} data-testid={`output-value-${key}`}>
            {outputs[key]}
          </dd>
        </div>
      ))}
    </dl>
  )
}
