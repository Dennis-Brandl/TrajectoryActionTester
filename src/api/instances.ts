import type { Connection, Instance, InstanceResponse } from './types'
import { ApiError } from './types'

export async function fetchInstance(connection: Connection, instanceId: string): Promise<Instance> {
  const baseUrl = connection.url.replace(/\/+$/, '')
  const url = `${baseUrl}/trajectory/v1/instances/${instanceId}`

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (connection.apiKey) {
    headers.Authorization = `Bearer ${connection.apiKey}`
  }

  const response = await fetch(url, { headers })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new ApiError(response.status, response.statusText, body)
  }
  const parsed = (await response.json()) as InstanceResponse
  return parsed.data
}
