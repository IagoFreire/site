import { BadgeList } from '../Badges/BadgeList';
import { SpotlightCard } from '../ui/SpotlightCard';
import type { LeaderboardEntry } from '../../types/bolao.types';
import './LeaderboardRow.css';

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
      className={`lb-row ${isCurrentUser ? 'lb-row--me' : ''} ${entry.rank === 1 ? 'lb-row--first' : ''}${onClick ? ' lb-row--clickable' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onClick}
    >
      <div className="lb-row__rank">
        {medal ? <span className="lb-row__medal">{medal}</span> : <span className="lb-row__num">#{entry.rank}</span>}
      </div>

      <div className="lb-row__avatar">
        {entry.rank === 1 && <span className="lb-row__crown">👑</span>}
        <div className="lb-avatar">{entry.display_name?.[0]?.toUpperCase() ?? '?'}</div>
      </div>

      <div className="lb-row__info">
        <div className="lb-row__name">
          {entry.display_name}
          {isCurrentUser && <span className="lb-row__you"> (você)</span>}
        </div>
        <div className="lb-row__badges">
          <BadgeList streak={entry.streak} totalPoints={entry.total_points} compact />
          {entry.streak >= 2 && (
            <span className="lb-row__streak lb-row__streak--hot">🔥 {entry.streak}</span>
          )}
          {entry.streak < 2 && (entry.cold_streak ?? 0) >= 2 && (
            <span className="lb-row__streak lb-row__streak--cold">❄️ {entry.cold_streak}</span>
          )}
        </div>
      </div>

      <div className="lb-row__points">
        <span className="lb-row__pts">{entry.total_points}</span>
        <span className="lb-row__pts-label">pts</span>
      </div>
    </SpotlightCard>
  );
}
