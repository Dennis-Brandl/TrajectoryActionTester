import iconImg from '../../assets/ic_launcher_round.png'
import styles from './BrandingRow.module.css'

export function BrandingRow() {
  return (
    <div className={styles.row}>
      <img src={iconImg} alt="" className={styles.icon} />
      <span className={styles.title}>Trajectory Action Tester</span>
      <span className={styles.version}>v{__APP_VERSION__}</span>
    </div>
  )
}
