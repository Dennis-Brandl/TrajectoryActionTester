import splashImage from '../../assets/TrajectorActionTesterSplashScreen.png'
import styles from './WelcomeSplash.module.css'

interface WelcomeSplashProps {
  onContinue: () => void
}

export function WelcomeSplash({ onContinue }: WelcomeSplashProps) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <img
          src={splashImage}
          alt="Trajectory Workflow Action Tester"
          className={styles.splash}
        />
        <p className={styles.body}>Test Environment Actions</p>
        <button type="button" className={styles.continue} onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}
