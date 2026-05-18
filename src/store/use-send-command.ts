import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { sendCommand } from '../api/commands'
import type { Command, SendCommandResponse } from '../api/types'
import { useActiveConnection } from './connections'

export interface SendCommandVariables {
  instanceId: string
  command: Command
}

export function useSendCommand(): UseMutationResult<
  SendCommandResponse['data'],
  Error,
  SendCommandVariables
> {
  const connection = useActiveConnection()

  return useMutation<SendCommandResponse['data'], Error, SendCommandVariables>({
    mutationFn: async ({ instanceId, command }) => {
      if (!connection) {
        throw new Error('No active connection')
      }
      return sendCommand(connection, instanceId, command)
    },
  })
}
