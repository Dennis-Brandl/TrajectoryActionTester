import { useCallback, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ActionTree } from './ActionTree'
import { ConnectionList } from './ConnectionList'
import { InstanceList } from './InstanceList'
import { EnvirXUploader } from '../upload/EnvirXUploader'
import { useActiveConnection } from '../../store/connections'
import styles from './Sidebar.module.css'

interface SectionProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

function Section({ title, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.caret} aria-hidden>
          {open ? '▾' : '▸'}
        </span>
        <span className={styles.title}>{title}</span>
      </button>
      {open && <div className={styles.body}>{children}</div>}
    </section>
  )
}

export function Sidebar() {
  const connection = useActiveConnection()
  const queryClient = useQueryClient()

  const handleUploaded = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['capabilities'] })
  }, [queryClient])

  return (
    <nav className={styles.sidebar} aria-label="Sidebar">
      <Section title="Connections">
        <ConnectionList />
      </Section>
      {connection && (
        <Section title="Upload" defaultOpen={false}>
          <EnvirXUploader serverUri={connection.url} onUploaded={handleUploaded} />
        </Section>
      )}
      <Section title="Actions">
        <ActionTree />
      </Section>
      <Section title="Instances">
        <InstanceList />
      </Section>
    </nav>
  )
}
