import { getEarnedBadges } from './badges';
import './Badges.css';

interface Props {
  streak: number;
  totalPoints: number;
  compact?: boolean;
}

export function BadgeList({ streak, totalPoints, compact }: Props) {
  const earned = getEarnedBadges(streak, totalPoints);
  if (earned.length === 0) return null;

  return (
    <div className={`badge-list ${compact ? 'badge-list--compact' : ''}`}>
      {earned.map(badge => (
        <div key={badge.id} className="badge" title={`${badge.label}: ${badge.description}`}>
          <span className="badge__icon">{badge.icon}</span>
          {!compact && <span className="badge__label">{badge.label}</span>}
        </div>
      ))}
    </div>
  );
}
