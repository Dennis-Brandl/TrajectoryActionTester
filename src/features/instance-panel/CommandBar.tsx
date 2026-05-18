import { Button } from '../../components/Button'
import type { ActionVisibility, Command } from '../../api/types'
import { isCommandValid } from '../../lib/state-machine'
import { useSendCommand } from '../../store/use-send-command'
import styles from './CommandBar.module.css'

export interface CommandBarProps {
  instanceId: string
  visibility: ActionVisibility
  currentState: string
  supportedCommands: readonly Command[]
}

export function CommandBar({
  instanceId,
  visibility,
  currentState,
  supportedCommands,
}: CommandBarProps) {
  const sendCmd = useSendCommand()

  const handleClick = (command: Command) => () => {
    sendCmd.mutate({ instanceId, command })
  }

  return (
    <div className={styles.bar}>
      <div className={styles.buttons}>
        {supportedCommands.map((command) => {
          const valid = isCommandValid(visibility, currentState, command)
          return (
            <Button
              key={command}
              type="button"
              variant={command === 'ABORT' || command === 'STOP' ? 'danger' : 'secondary'}
              disabled={!valid || sendCmd.isPending}
              onClick={handleClick(command)}
            >
              {command}
            </Button>
          )
        })}
      </div>
      {sendCmd.isError && (
        <p className={styles.error} role="alert">
          Command failed: {sendCmd.error?.message ?? 'unknown error'}
        </p>
      )}
    </div>
  )
}
