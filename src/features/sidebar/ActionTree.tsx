import { useMemo } from 'react'
import { Pill } from '../../components/Pill'
import { useActiveInstance } from '../../store/active-instance'
import { useCapabilities } from '../../store/use-capabilities'
import { useActiveConnection } from '../../store/connections'
import type { ActionCapability } from '../../api/types'
import styles from './ActionTree.module.css'

function groupByVisibility(actions: ActionCapability[]): {
  observable: ActionCapability[]
  opaque: ActionCapability[]
} {
  const observable: ActionCapability[] = []
  const opaque: ActionCapability[] = []
  for (const a of actions) {
    if (a.visibility === 'observable') observable.push(a)
    else opaque.push(a)
  }
  return { observable, opaque }
}

export function ActionTree() {
  const connection = useActiveConnection()
  const capabilities = useCapabilities()
  const { state, selectAction } = useActiveInstance()

  const grouped = useMemo(
    () => groupByVisibility(capabilities.data?.data ?? []),
    [capabilities.data]
  )

  if (!connection) {
    return <p className={styles.message}>No active connection.</p>
  }
  if (capabilities.isPending && capabilities.fetchStatus === 'fetching') {
    return <p className={styles.message}>Loading actions…</p>
  }
  if (capabilities.isError) {
    return <p className={styles.error}>Failed to load actions.</p>
  }
  if ((capabilities.data?.data.length ?? 0) === 0) {
    return <p className={styles.message}>No actions on this container.</p>
  }

  const renderRow = (a: ActionCapability) => {
    const isActive =
      state.selection?.type === 'action' && state.selection.action_oid === a.action_oid
    return (
      <li key={a.action_oid}>
        <button
          type="button"
          data-testid={`action-row-${a.action_oid}`}
          className={[styles.row, isActive ? styles.rowActive : ''].join(' ').trim()}
          onClick={() => selectAction(a.action_oid)}
        >
          <span className={styles.label}>{a.local_id}</span>
          <Pill variant={a.visibility === 'observable' ? 'accent' : 'muted'}>{a.visibility}</Pill>
        </button>
      </li>
    )
  }

  return (
    <div className={styles.tree}>
      {grouped.observable.length > 0 && (
        <div className={styles.group}>
          <h4 className={styles.groupHeader}>Observable</h4>
          <ul className={styles.list}>{grouped.observable.map(renderRow)}</ul>
        </div>
      )}
      {grouped.opaque.length > 0 && (
        <div className={styles.group}>
          <h4 className={styles.groupHeader}>Opaque</h4>
          <ul className={styles.list}>{grouped.opaque.map(renderRow)}</ul>
        </div>
      )}
    </div>
  )
}
