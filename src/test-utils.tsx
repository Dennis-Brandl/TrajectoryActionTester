import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { ConnectionsProvider } from './store/connections'
import { ActiveInstanceProvider } from './store/active-instance'

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  })
}

interface ProvidersProps {
  children: ReactNode
  queryClient?: QueryClient
}

export function AllProviders({ children, queryClient }: ProvidersProps) {
  const client = queryClient ?? createTestQueryClient()
  return (
    <QueryClientProvider client={client}>
      <ConnectionsProvider>
        <ActiveInstanceProvider>{children}</ActiveInstanceProvider>
      </ConnectionsProvider>
    </QueryClientProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient } = {}
): RenderResult & { queryClient: QueryClient } {
  const queryClient = options.queryClient ?? createTestQueryClient()
  const result = render(ui, {
    wrapper: ({ children }) => (
      <AllProviders queryClient={queryClient}>{children}</AllProviders>
    ),
    ...options,
  })
  return { ...result, queryClient }
}
