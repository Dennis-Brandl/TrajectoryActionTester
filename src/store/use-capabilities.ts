import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { fetchCapabilities } from '../api/capabilities'
import type { CapabilitiesResponse } from '../api/types'
import { useActiveConnection } from './connections'

export function useCapabilities(): UseQueryResult<CapabilitiesResponse, Error> {
  const connection = useActiveConnection()
  return useQuery({
    queryKey: ['capabilities', connection?.id, connection?.url, connection?.apiKey],
    queryFn: () => {
      if (!connection) throw new Error('No active connection')
      return fetchCapabilities(connection)
    },
    enabled: connection !== null,
  })
}
