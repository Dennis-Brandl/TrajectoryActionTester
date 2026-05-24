import { useState } from 'react'
import { BrandingRow } from './features/branding/BrandingRow'
import { ConnectionBar } from './features/connection-bar/ConnectionBar'
import { InvokePanel } from './features/invoke-panel/InvokePanel'
import { InstancePanel } from './features/instance-panel/InstancePanel'
import { Sidebar } from './features/sidebar/Sidebar'
import { WelcomeSplash } from './features/welcome-splash/WelcomeSplash'
import { ActiveInstanceProvider, useActiveInstance } from './store/active-instance'
import { ConnectionsProvider } from './store/connections'
import styles from './App.module.css'

function MainView() {
  const { state } = useActiveInstance()
  if (state.selection?.type === 'action') return <InvokePanel />
  if (state.selection?.type === 'instance') return <InstancePanel />
  return (
    <p className={styles.placeholder}>
      Select an action or instance from the sidebar to begin.
    </p>
  )
}

const SPLASH_KEY = 'trajectory-acT-splash-dismissed'

export function App() {
  const [splashDismissed, setSplashDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SPLASH_KEY) === 'true'
    } catch {
      return false
    }
  })

  if (!splashDismissed) {
    return (
      <WelcomeSplash
        onContinue={() => {
          try {
            localStorage.setItem(SPLASH_KEY, 'true')
          } catch {
            // localStorage may throw in private browsing / quota — proceed anyway.
          }
          setSplashDismissed(true)
        }}
      />
    )
  }

  return (
    <ConnectionsProvider>
      <ActiveInstanceProvider>
        <div className={styles.shell}>
          <header className={styles.header} role="banner">
            <BrandingRow />
            <ConnectionBar />
          </header>
          <aside className={styles.sidebar}>
            <Sidebar />
          </aside>
          <main className={styles.main}>
            <MainView />
          </main>
          <aside className={styles.inspector} aria-label="Inspector">
            <p className={styles.placeholder}>Log inspector — coming in plan 4-05.</p>
          </aside>
        </div>
      </ActiveInstanceProvider>
    </ConnectionsProvider>
  )
}
