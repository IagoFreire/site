import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../context/AuthContext';
import { LeaderboardRow } from '../components/LeaderboardRow/LeaderboardRow';
import './LeaderboardPage.css';

export function LeaderboardPage() {
  const { entries, loading } = useLeaderboard();
  const { profile } = useAuth();

  return (
    <div className="bolao-page">
      <h1 className="bolao-page__title">Ranking</h1>

      {loading ? (
        <div className="bolao-loading-screen" style={{ minHeight: 240, background: 'transparent' }}>
          <div className="bolao-spinner" />
        </div>
      ) : entries.length === 0 ? (
        <div className="bolao-empty">
          <span className="bolao-empty__icon">🏆</span>
          <p className="bolao-empty__text">Nenhuma aposta registrada ainda.<br />Seja o primeiro a apostar!</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {entries.map((entry, i) => (
            <LeaderboardRow
              key={entry.id}
              entry={entry}
              isCurrentUser={entry.id === profile?.id}
              index={i}
            />
          ))}
        </div>
      )}

      {entries.length > 0 && (
        <p className="leaderboard-update-note">
          🔄 Atualizado em tempo real
        </p>
      )}
    </div>
  );
}
