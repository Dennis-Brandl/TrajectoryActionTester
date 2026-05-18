import { useId, useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { TextInput } from '../../components/TextInput'
import { useConnections } from '../../store/connections'
import styles from './ConnectionModal.module.css'

export interface ConnectionModalProps {
  open: boolean
  onClose: () => void
  editingId?: string
}

function validateUrl(value: string): string | undefined {
  if (!value.trim()) return 'URL is required'
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'URL must be a valid http(s) URL'
    }
  } catch {
    return 'URL must be a valid http(s) URL'
  }
  return undefined
}

export function ConnectionModal({ open, onClose, editingId }: ConnectionModalProps) {
  const { state, addConnection, updateConnection } = useConnections()
  const existing = editingId ? state.connections.find((c) => c.id === editingId) : null

  const [url, setUrl] = useState(existing?.url ?? '')
  const [name, setName] = useState(existing?.name ?? '')
  const [apiKey, setApiKey] = useState(existing?.apiKey ?? '')
  const [submitted, setSubmitted] = useState(false)

  const urlError = submitted ? validateUrl(url) : undefined
  const isAddMode = !existing
  const titleId = useId()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const error = validateUrl(url)
    if (error) return
    const trimmedUrl = url.trim()
    const trimmedName = name.trim()
    const trimmedKey = apiKey.trim()
    if (existing) {
      updateConnection(existing.id, {
        url: trimmedUrl,
        name: trimmedName || undefined,
        apiKey: trimmedKey || undefined,
      })
    } else {
      addConnection({
        url: trimmedUrl,
        ...(trimmedName ? { name: trimmedName } : {}),
        ...(trimmedKey ? { apiKey: trimmedKey } : {}),
      })
    }
    onClose()
  }

  const saveDisabled = url.trim().length === 0

  return (
    <Modal open={open} onClose={onClose} titleId={titleId}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 id={titleId} className={styles.title}>
          {isAddMode ? 'Add connection' : 'Edit connection'}
        </h2>
        <TextInput
          label="Server URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://localhost:3000"
          helper="Base URL of the Trajectory Action Container REST endpoint."
          {...(urlError ? { error: urlError } : {})}
          autoFocus
        />
        <TextInput
          label="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Local dev"
        />
        <TextInput
          label="API key (optional)"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          helper="Sent as 'Authorization: Bearer <key>' if provided."
        />
        <div className={styles.actions}>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saveDisabled}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  )
}
