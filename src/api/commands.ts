import type { Command, Connection, SendCommandResponse } from './types'
import { ApiError } from './types'

export async function sendCommand(
  connection: Connection,
  instanceId: string,
  command: Command
): Promise<SendCommandResponse['data']> {
  const baseUrl = connection.url.replace(/\/+$/, '')
  const url = `${baseUrl}/trajectory/v1/instances/${instanceId}/command`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (connection.apiKey) {
    headers.Authorization = `Bearer ${connection.apiKey}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ command }),
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new ApiError(response.status, response.statusText, body)
  }
  const parsed = (await response.json()) as SendCommandResponse
  return parsed.data
}
