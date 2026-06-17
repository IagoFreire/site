import { getEarnedBadges } from './badges';
import styles from './Badges.module.css';

interface Props {
  streak: number;
  totalPoints: number;
  compact?: boolean;
}

export function BadgeList({ streak, totalPoints, compact }: Props) {
  const earned = getEarnedBadges(streak, totalPoints);
  if (earned.length === 0) return null;

  return (
    <div className={`${styles.badgeList} ${compact ? styles.badgeListCompact : ''}`}>
      {earned.map(badge => (
        <div key={badge.id} className={styles.badge} title={`${badge.label}: ${badge.description}`}>
          <span className={styles.badgeIcon}>{badge.icon}</span>
          {!compact && <span className={styles.badgeLabel}>{badge.label}</span>}
        </div>
      ))}
    </div>
  );
}
