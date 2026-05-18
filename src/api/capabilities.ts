import type { CapabilitiesResponse, Connection } from './types'
import { ApiError } from './types'

export async function fetchCapabilities(connection: Connection): Promise<CapabilitiesResponse> {
  const baseUrl = connection.url.replace(/\/+$/, '')
  const url = `${baseUrl}/trajectory/v1/capabilities`

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (connection.apiKey) {
    headers.Authorization = `Bearer ${connection.apiKey}`
  }

  const response = await fetch(url, { headers })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new ApiError(response.status, response.statusText, body)
  }
  return (await response.json()) as CapabilitiesResponse
}
