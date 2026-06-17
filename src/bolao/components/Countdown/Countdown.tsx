import { useCountdown } from '../../hooks/useCountdown';
import styles from './Countdown.module.css';

interface Props {
  matchDate: string;
}

export function Countdown({ matchDate }: Props) {
  const { hours, minutes, seconds, total } = useCountdown(matchDate);

  if (total <= 0) return null;

  const urgent = hours === 0 && minutes < 60;

  return (
    <div className={`${styles.countdown} ${urgent ? styles.countdownUrgent : ''}`}>
      <span className={styles.countdownLabel}>Começa em</span>
      <div className={styles.countdownTime}>
        {hours > 0 && <><span className={styles.countdownUnit}>{String(hours).padStart(2, '0')}</span><span className={styles.countdownSep}>h</span></>}
        <span className={styles.countdownUnit}>{String(minutes).padStart(2, '0')}</span>
        <span className={styles.countdownSep}>m</span>
        <span className={styles.countdownUnit}>{String(seconds).padStart(2, '0')}</span>
        <span className={styles.countdownSep}>s</span>
      </div>
    </div>
  );
}
