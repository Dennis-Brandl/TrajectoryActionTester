import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { installMockEventSource, restoreEventSource } from './lib/test-event-source'

// Install MockEventSource globally for all tests. To opt out in a specific describe
// block, call restoreEventSource() in beforeEach and installMockEventSource() in
// afterEach — see test-event-source.test.ts install/restore suite.
installMockEventSource()
afterEach(() => {
  restoreEventSource()
  installMockEventSource()
})
