import { useState } from 'react';
import { BetInput } from '../BetInput/BetInput';
import { Countdown } from '../Countdown/Countdown';
import { ConfettiEffect } from '../ConfettiEffect';
import { STAGE_LABELS, REASON_LABELS } from '../../lib/scoring';
import { formatMatchTime, isFuture } from '../../lib/dates';
import type { Match, Bet } from '../../types/bolao.types';
import './MatchCard.css';

interface Props {
  match: Match;
  bet: Bet | null;
  onSubmitBet: (homeScore: number, awayScore: number) => Promise<{ error: string | null }>;
  saving: boolean;
}

export function MatchCard({ match, bet, onSubmitBet, saving }: Props) {
  const canBet = isFuture(match.match_date) && match.status === 'scheduled';
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  const [homeScore, setHomeScore] = useState(bet?.home_score_bet ?? 0);
  const [awayScore, setAwayScore] = useState(bet?.away_score_bet ?? 0);
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (home: number, away: number) => {
    setHomeScore(home);
    setAwayScore(away);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setError(null);
    const { error: err } = await onSubmitBet(homeScore, awayScore);
    if (err) { setError(err); return; }
    setSubmitted(true);
    if (isFinished && bet?.points_earned && bet.points_earned >= 10) setConfetti(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const pointsColor =
    bet?.points_earned === null || bet?.points_earned === undefined ? '' :
    bet.points_earned === 0 ? 'points--zero' :
    bet.points_earned >= 10 ? 'points--exact' : 'points--partial';

  return (
    <div className={`match-card ${isLive ? 'match-card--live' : ''} ${isFinished ? 'match-card--finished' : ''}`}
      style={{ position: 'relative', overflow: 'hidden' }}>
      <ConfettiEffect active={confetti} onDone={() => setConfetti(false)} />

      {/* Header: stage + time */}
      <div className="match-card__header">
        <span className="match-card__stage">{STAGE_LABELS[match.stage] ?? match.stage}{match.group_name ? ` – Grupo ${match.group_name}` : ''}</span>
        <div className="match-card__meta">
          {isLive ? (
            <span className="live-badge">🔴 AO VIVO</span>
          ) : (
            <span className="match-card__time">{formatMatchTime(match.match_date)}</span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="match-card__teams">
        <span className="team-name team-name--home">{match.home_team}</span>

        <div className="match-card__center">
          {isFinished && match.home_score !== null ? (
            <div className="final-score">
              <span>{match.home_score}</span>
              <span className="final-score__sep">–</span>
              <span>{match.away_score}</span>
            </div>
          ) : isLive ? (
            <div className="final-score final-score--live">
              <span>{match.home_score ?? 0}</span>
              <span className="final-score__sep">–</span>
              <span>{match.away_score ?? 0}</span>
            </div>
          ) : (
            <span className="match-card__vs">VS</span>
          )}
        </div>

        <span className="team-name team-name--away">{match.away_team}</span>
      </div>

      {/* Bet section */}
      <div className="match-card__bet">
        {canBet ? (
          <>
            <Countdown matchDate={match.match_date} />
            <div className="bet-section">
              <BetInput
                homeScore={homeScore}
                awayScore={awayScore}
                onChange={handleChange}
                disabled={saving}
              />
              <button
                className={`bet-submit-btn ${submitted ? 'bet-submit-btn--done' : ''}`}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? '...' : submitted ? '✓ Salvo!' : bet ? 'Atualizar' : 'Apostar'}
              </button>
            </div>
            {error && <p className="bet-error">{error}</p>}
            {bet && !submitted && (
              <p className="bet-current">
                Aposta atual: {bet.home_score_bet} × {bet.away_score_bet}
                {bet.is_wildcard && ' 🔥'}
              </p>
            )}
          </>
        ) : isFinished ? (
          <div className="bet-result">
            {bet ? (
              <>
                <div className={`bet-result__points ${pointsColor}`}>
                  <span className="bet-result__pts-num">+{bet.points_earned ?? 0}</span>
                  <span className="bet-result__pts-label">pts</span>
                </div>
                <div className="bet-result__info">
                  <span className="bet-result__reason">
                    {bet.points_earned !== null ? REASON_LABELS[
                      bet.points_earned === 0 ? 'wrong' :
                      (bet.home_score_bet === match.home_score && bet.away_score_bet === match.away_score) ? 'exact_score' :
                      Math.sign(bet.home_score_bet - bet.away_score_bet) === 0 ? 'correct_draw' : 'correct_winner'
                    ] : 'Aguardando resultado'}
                  </span>
                  <span className="bet-result__bet">Aposta: {bet.home_score_bet}–{bet.away_score_bet}{bet.is_wildcard ? ' 🔥' : ''}</span>
                </div>
              </>
            ) : (
              <span className="bet-result__no-bet">Sem aposta</span>
            )}
          </div>
        ) : isLive ? (
          <div className="bet-result">
            {bet ? (
              <span className="bet-result__bet">Sua aposta: {bet.home_score_bet}–{bet.away_score_bet}{bet.is_wildcard ? ' 🔥' : ''}</span>
            ) : (
              <span className="bet-result__no-bet">Sem aposta</span>
            )}
          </div>
        ) : (
          <span className="match-card__locked">🔒 Apostas encerradas</span>
        )}
      </div>
    </div>
  );
}
