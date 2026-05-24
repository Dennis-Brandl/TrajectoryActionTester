import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'
import { installMockEventSource, restoreEventSource } from './lib/test-event-source'

// Install MockEventSource globally for all tests. To opt out in a specific describe
// block, call restoreEventSource() in beforeEach and installMockEventSource() in
// afterEach — see test-event-source.test.ts install/restore suite.
installMockEventSource()
afterEach(() => {
  restoreEventSource()
  installMockEventSource()
})

// Skip the welcome splash by default in every test so suites that render <App />
// see the main shell. The splash itself is exercised in its own test file by
// clearing this key first.
beforeEach(() => {
  localStorage.setItem('trajectory-acT-splash-dismissed', 'true')
})
