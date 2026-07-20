import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../../bolao/context/AuthContext';
import { LeaderboardRow } from '../components/LeaderboardRow/LeaderboardRow';
import { UserBetsModal } from '../components/UserBetsModal/UserBetsModal';
import { ShinyText } from '../../bolao/components/ui/ShinyText';
import { BadgeList } from '../../bolao/components/Badges/BadgeList';
import { RulesModal } from '../components/RulesModal/RulesModal';
import type { LeaderboardEntry } from '../types/bolaoBrasileiro.types';
import styles from './LeaderboardPage.module.css';

const PODIUM_COLORS = {
  1: { ring: 'var(--wc-gold)', base: 'rgba(255,215,0,0.12)', border: 'rgba(255,215,0,0.4)', height: 60 },
  2: { ring: '#C0C0C0', base: 'rgba(192,192,192,0.07)', border: 'rgba(192,192,192,0.25)', height: 44 },
  3: { ring: '#CD7F32', base: 'rgba(205,127,50,0.07)', border: 'rgba(205,127,50,0.25)', height: 32 },
} as const;

export function LeaderboardPage() {
  const { entries, loading } = useLeaderboard();
  const { profile } = useAuth();
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [showRules, setShowRules] = useState(false);

  const top3 = entries.slice(0, Math.min(3, entries.length));
  const rest = entries.slice(3);
  const hasPodium = top3.length === 3;
  const podiumOrder = hasPodium ? [top3[1], top3[0], top3[2]] : null;

  return (
    <div className="bolao-page">
      <div className={styles.pageHeader}>
        <h1 className="bolao-page__title" style={{ margin: 0 }}><ShinyText text="Ranking" /></h1>
        <button className={styles.rulesBtn} onClick={() => setShowRules(true)} aria-label="Como funciona">
          ?
        </button>
      </div>

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
        <>
          {podiumOrder && (
            <div className={styles.podium}>
              {podiumOrder.map(entry => {
                const rank = entry.rank as 1 | 2 | 3;
                const color = PODIUM_COLORS[rank];
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div
                    key={entry.id}
                    className={`${styles.podiumItem} ${entry.id === profile?.id ? styles.podiumItemMe : ''}`}
                    onClick={() => setSelectedUser(entry)}
                  >
                    <div className={styles.podiumInfo}>
                      {rank === 1 && <span className={styles.podiumCrown}>👑</span>}
                      <div
                        className={styles.podiumAvatar}
                        style={{
                          width: rank === 1 ? 60 : 48,
                          height: rank === 1 ? 60 : 48,
                          fontSize: rank === 1 ? '1.4rem' : '1.1rem',
                          boxShadow: `0 0 ${rank === 1 ? 20 : 10}px ${color.ring}55`,
                          border: `2px solid ${color.ring}`,
                        }}
                      >
                        {entry.display_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className={styles.podiumName}>
                        {entry.display_name?.split(' ')[0]}
                      </span>
                      <span className={styles.podiumPts}>
                        <span className={styles.podiumPtsNum}>{entry.total_points}</span>
                        {' '}<span className={styles.podiumPtsLabel}>pts</span>
                      </span>
                      <div className={styles.podiumBadges}>
                        <BadgeList streak={entry.streak} totalPoints={entry.total_points} compact />
                        {entry.streak >= 2 && (
                          <span className={`${styles.podiumStreak} ${styles.podiumStreakHot}`}>🔥 {entry.streak}</span>
                        )}
                        {entry.streak < 2 && (entry.cold_streak ?? 0) >= 2 && (
                          <span className={`${styles.podiumStreak} ${styles.podiumStreakCold}`}>❄️ {entry.cold_streak}</span>
                        )}
                      </div>
                    </div>
                    <div
                      className={styles.podiumBase}
                      style={{
                        height: color.height,
                        background: color.base,
                        borderTopColor: color.border,
                      }}
                    >
                      <span>{medals[rank - 1]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.leaderboardList}>
            {(hasPodium ? rest : entries).map((entry, i) => (
              <LeaderboardRow
                key={entry.id}
                entry={entry}
                isCurrentUser={entry.id === profile?.id}
                index={i}
                onClick={() => setSelectedUser(entry)}
              />
            ))}
          </div>
        </>
      )}

      {entries.length > 0 && (
        <p className={styles.leaderboardUpdateNote}>
          🔄 Atualizado em tempo real · toque em um jogador para ver as apostas
        </p>
      )}

      {selectedUser && (
        <UserBetsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}
