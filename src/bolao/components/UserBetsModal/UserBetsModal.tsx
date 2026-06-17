import { useEffect } from 'react';
import { useUserBets } from '../../hooks/useUserBets';
import { STAGE_LABELS } from '../../lib/scoring';
import { formatMatchDate } from '../../lib/dates';
import type { LeaderboardEntry } from '../../types/bolao.types';
import styles from './UserBetsModal.module.css';

interface Props {
  user: LeaderboardEntry;
  onClose: () => void;
}

export function UserBetsModal({ user, onClose }: Props) {
  const { bets, loading } = useUserBets(user.id);

  // Fechar com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Impede scroll do body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>{user.display_name?.[0]?.toUpperCase() ?? '?'}</div>
          <div className={styles.userInfo}>
            <span className={styles.name}>{user.display_name}</span>
            <span className={styles.meta}>#{user.rank} · {user.total_points} pts</span>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {/* Bets list */}
        <div className={styles.body}>
          {loading ? (
            <div className={styles.loading}>
              <div className="bolao-spinner" />
            </div>
          ) : bets.length === 0 ? (
            <div className={styles.empty}>
              <span>Nenhuma aposta visível ainda.</span>
              <small>Apostas são reveladas após o início de cada jogo.</small>
            </div>
          ) : (
            <div className={styles.list}>
              {bets.map(bet => {
                const m = bet.match;
                const finished = m.status === 'finished';
                const homeWon = finished && m.home_score !== null && m.away_score !== null && m.home_score > m.away_score;
                const awayWon = finished && m.home_score !== null && m.away_score !== null && m.away_score > m.home_score;

                const pointsColor =
                  bet.points_earned === null ? '' :
                  bet.points_earned === 0 ? styles.ptsZero :
                  bet.points_earned >= 10 ? styles.ptsExact : styles.ptsPartial;

                return (
                  <div key={bet.id} className={styles.bet}>
                    <div className={styles.betTop}>
                      <span className={styles.betStage}>
                        {STAGE_LABELS[m.stage] ?? m.stage}{m.group_name ? ` G${m.group_name}` : ''}
                      </span>
                      <span className={styles.betDate}>{formatMatchDate(m.match_date)}</span>
                    </div>

                    <div className={styles.betMatch}>
                      {/* Home */}
                      <span className={`${styles.team} ${homeWon ? styles.teamWinner : ''}`}>{m.home_team}</span>

                      {/* Score / VS */}
                      <div className={styles.betScores}>
                        {finished && m.home_score !== null ? (
                          <span className={styles.result}>{m.home_score}–{m.away_score}</span>
                        ) : (
                          <span className={styles.vs}>VS</span>
                        )}
                        <span className={styles.pick}>
                          {bet.home_score_bet}–{bet.away_score_bet}
                          {bet.is_wildcard && ' 🔥'}
                        </span>
                      </div>

                      {/* Away */}
                      <span className={`${styles.team} ${styles.teamAway} ${awayWon ? styles.teamWinner : ''}`}>{m.away_team}</span>
                    </div>

                    {finished && bet.points_earned !== null && (
                      <div className={`${styles.pts} ${pointsColor}`}>
                        +{bet.points_earned} pts
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
