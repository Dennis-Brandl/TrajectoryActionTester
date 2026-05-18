import { Pill } from '../../components/Pill'
import { pillVariantForState } from '../../lib/state-pill'
import { useActiveConnection } from '../../store/connections'
import { useActiveInstance, useTrackedInstances } from '../../store/active-instance'
import styles from './InstanceList.module.css'

export function InstanceList() {
  const connection = useActiveConnection()
  const tracked = useTrackedInstances(connection?.id)
  const { state, selectInstance } = useActiveInstance()

  if (!connection) {
    return <p className={styles.message}>No active connection.</p>
  }
  if (tracked.length === 0) {
    return <p className={styles.message}>No instances yet. Invoke an action to start.</p>
  }

  return (
    <ul className={styles.list}>
      {tracked.map((t) => {
        const isActive =
          state.selection?.type === 'instance' && state.selection.instance_id === t.instance_id
        const stateLabel = t.last_known_state ?? '—'
        return (
          <li key={t.instance_id}>
            <button
              type="button"
              data-testid={`instance-row-${t.instance_id}`}
              className={[styles.row, isActive ? styles.rowActive : ''].join(' ').trim()}
              onClick={() => selectInstance(t.instance_id)}
            >
              <span className={styles.id}>{t.instance_id.slice(0, 8)}</span>
              <Pill variant={pillVariantForState(t.last_known_state)}>{stateLabel}</Pill>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
