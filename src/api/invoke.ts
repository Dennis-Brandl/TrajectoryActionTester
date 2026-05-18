import type { Connection, InvokeRequestBody, InvokeResponse } from './types'
import { ApiError } from './types'

export async function invokeAction(
  connection: Connection,
  actionOid: string,
  body: InvokeRequestBody
): Promise<InvokeResponse['data']> {
  const baseUrl = connection.url.replace(/\/+$/, '')
  const url = `${baseUrl}/trajectory/v1/actions/${actionOid}/invoke`

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
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const responseBody = await response.text().catch(() => '')
    throw new ApiError(response.status, response.statusText, responseBody)
  }
  const parsed = (await response.json()) as InvokeResponse
  return parsed.data
}
