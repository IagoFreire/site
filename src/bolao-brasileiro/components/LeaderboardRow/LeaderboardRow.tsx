import { BadgeList } from '../../../bolao/components/Badges/BadgeList';
import { SpotlightCard } from '../../../bolao/components/ui/SpotlightCard';
import type { LeaderboardEntry } from '../../types/bolaoBrasileiro.types';
import styles from './LeaderboardRow.module.css';

interface Props {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  index: number;
  onClick?: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function LeaderboardRow({ entry, isCurrentUser, index, onClick }: Props) {
  const medal = entry.rank <= 3 ? MEDALS[entry.rank - 1] : null;

  return (
    <SpotlightCard
      className={[
        styles.lbRow,
        isCurrentUser ? styles.lbRowMe : '',
        entry.rank === 1 ? styles.lbRowFirst : '',
        onClick ? styles.lbRowClickable : '',
      ].join(' ')}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onClick}
    >
      <div className={styles.lbRowRank}>
        {medal ? <span className={styles.lbRowMedal}>{medal}</span> : <span className={styles.lbRowNum}>#{entry.rank}</span>}
      </div>

      <div className={styles.lbRowAvatar}>
        {entry.rank === 1 && <span className={styles.lbRowCrown}>👑</span>}
        <div className={styles.lbAvatar}>{entry.display_name?.[0]?.toUpperCase() ?? '?'}</div>
      </div>

      <div className={styles.lbRowInfo}>
        <div className={styles.lbRowName}>
          {entry.display_name}
          {isCurrentUser && <span className={styles.lbRowYou}> (você)</span>}
        </div>
        <div className={styles.lbRowBadges}>
          <BadgeList streak={entry.streak} totalPoints={entry.total_points} compact />
          {entry.streak >= 2 && (
            <span className={`${styles.lbRowStreak} ${styles.lbRowStreakHot}`}>🔥 {entry.streak}</span>
          )}
          {entry.streak < 2 && (entry.cold_streak ?? 0) >= 2 && (
            <span className={`${styles.lbRowStreak} ${styles.lbRowStreakCold}`}>❄️ {entry.cold_streak}</span>
          )}
        </div>
      </div>

      <div className={styles.lbRowPoints}>
        <span className={styles.lbRowPts}>{entry.total_points}</span>
        <span className={styles.lbRowPtsLabel}>pts</span>
      </div>
    </SpotlightCard>
  );
}
