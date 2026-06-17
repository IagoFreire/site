import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../context/AuthContext';
import { LeaderboardRow } from '../components/LeaderboardRow/LeaderboardRow';
import { UserBetsModal } from '../components/UserBetsModal/UserBetsModal';
import { ShinyText } from '../components/ui/ShinyText';
import type { LeaderboardEntry } from '../types/bolao.types';
import './LeaderboardPage.css';

export function LeaderboardPage() {
  const { entries, loading } = useLeaderboard();
  const { profile } = useAuth();
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);

  return (
    <div className="bolao-page">
      <h1 className="bolao-page__title"><ShinyText text="Ranking" /></h1>

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
              onClick={() => setSelectedUser(entry)}
            />
          ))}
        </div>
      )}

      {entries.length > 0 && (
        <p className="leaderboard-update-note">
          🔄 Atualizado em tempo real · toque em um jogador para ver as apostas
        </p>
      )}

      {selectedUser && (
        <UserBetsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
