import { useEffect } from 'react';
import { useUserBets } from '../../hooks/useUserBets';
import { STAGE_LABELS } from '../../lib/scoring';
import { formatMatchDate } from '../../lib/dates';
import type { LeaderboardEntry } from '../../types/bolao.types';
import './UserBetsModal.css';

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
    <div className="ubm-overlay" onClick={onClose}>
      <div className="ubm-sheet" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ubm-header">
          <div className="ubm-avatar">{user.display_name?.[0]?.toUpperCase() ?? '?'}</div>
          <div className="ubm-user-info">
            <span className="ubm-name">{user.display_name}</span>
            <span className="ubm-meta">#{user.rank} · {user.total_points} pts</span>
          </div>
          <button className="ubm-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {/* Bets list */}
        <div className="ubm-body">
          {loading ? (
            <div className="ubm-loading">
              <div className="bolao-spinner" />
            </div>
          ) : bets.length === 0 ? (
            <div className="ubm-empty">
              <span>Nenhuma aposta visível ainda.</span>
              <small>Apostas são reveladas após o início de cada jogo.</small>
            </div>
          ) : (
            <div className="ubm-list">
              {bets.map(bet => {
                const m = bet.match;
                const finished = m.status === 'finished';
                const homeWon = finished && m.home_score !== null && m.away_score !== null && m.home_score > m.away_score;
                const awayWon = finished && m.home_score !== null && m.away_score !== null && m.away_score > m.home_score;

                const pointsColor =
                  bet.points_earned === null ? '' :
                  bet.points_earned === 0 ? 'ubm-pts--zero' :
                  bet.points_earned >= 10 ? 'ubm-pts--exact' : 'ubm-pts--partial';

                return (
                  <div key={bet.id} className="ubm-bet">
                    <div className="ubm-bet__top">
                      <span className="ubm-bet__stage">
                        {STAGE_LABELS[m.stage] ?? m.stage}{m.group_name ? ` G${m.group_name}` : ''}
                      </span>
                      <span className="ubm-bet__date">{formatMatchDate(m.match_date)}</span>
                    </div>

                    <div className="ubm-bet__match">
                      {/* Home */}
                      <span className={`ubm-team ${homeWon ? 'ubm-team--winner' : ''}`}>{m.home_team}</span>

                      {/* Score / VS */}
                      <div className="ubm-bet__scores">
                        {finished && m.home_score !== null ? (
                          <span className="ubm-result">{m.home_score}–{m.away_score}</span>
                        ) : (
                          <span className="ubm-vs">VS</span>
                        )}
                        <span className="ubm-pick">
                          {bet.home_score_bet}–{bet.away_score_bet}
                          {bet.is_wildcard && ' 🔥'}
                        </span>
                      </div>

                      {/* Away */}
                      <span className={`ubm-team ubm-team--away ${awayWon ? 'ubm-team--winner' : ''}`}>{m.away_team}</span>
                    </div>

                    {finished && bet.points_earned !== null && (
                      <div className={`ubm-pts ${pointsColor}`}>
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
