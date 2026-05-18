import { useConnections } from '../../store/connections'
import styles from './ConnectionList.module.css'

export function ConnectionList() {
  const { state, selectConnection } = useConnections()

  if (state.connections.length === 0) {
    return <p className={styles.empty}>No connections yet. Add one from the top bar.</p>
  }

  return (
    <ul className={styles.list}>
      {state.connections.map((c) => {
        const isActive = c.id === state.activeConnectionId
        const label = c.name?.trim() ? c.name : c.url
        return (
          <li key={c.id}>
            <button
              type="button"
              data-testid={`sidebar-conn-${c.id}`}
              className={[styles.row, isActive ? styles.rowActive : ''].join(' ').trim()}
              onClick={() => selectConnection(c.id)}
            >
              <span className={styles.label}>{label}</span>
              <span className={styles.url}>{c.url}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
