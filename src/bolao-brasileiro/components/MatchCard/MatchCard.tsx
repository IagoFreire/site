import { useState, useEffect } from 'react';
import { BetInput } from '../BetInput/BetInput';
import { BetTempBar } from '../BetTempBar/BetTempBar';
import { Countdown } from '../../../bolao/components/Countdown/Countdown';
import { ConfettiEffect } from '../../../bolao/components/ConfettiEffect';
import { SpotlightCard } from '../../../bolao/components/ui/SpotlightCard';
import { REASON_LABELS, roundLabel } from '../../lib/scoring';
import { formatMatchTime, isFuture } from '../../../bolao/lib/dates';
import type { Match, Bet } from '../../types/bolaoBrasileiro.types';
import styles from './MatchCard.module.css';

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

  useEffect(() => {
    if (bet) {
      setHomeScore(bet.home_score_bet);
      setAwayScore(bet.away_score_bet);
    }
  }, [bet?.id]);

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
    bet.points_earned === 0 ? styles.pointsZero :
    bet.points_earned >= 10 ? styles.pointsExact : styles.pointsPartial;

  const betDescription = `${bet?.home_score_bet ?? 0}–${bet?.away_score_bet ?? 0}`;

  const betResultReason = (() => {
    if (!bet || bet.points_earned === null) return 'Aguardando resultado';
    if (bet.points_earned === 0) return REASON_LABELS['wrong'];
    if (bet.home_score_bet === match.home_score && bet.away_score_bet === match.away_score) return REASON_LABELS['exact_score'];
    if (Math.sign(bet.home_score_bet - bet.away_score_bet) === 0) return REASON_LABELS['correct_draw'];
    return REASON_LABELS['correct_winner'];
  })();

  return (
    <SpotlightCard
      className={`${styles.matchCard} ${isLive ? styles.matchCardLive : ''} ${isFinished ? styles.matchCardFinished : ''}`}
      style={{ overflow: 'hidden' }}
    >
      <ConfettiEffect active={confetti} onDone={() => setConfetti(false)} />

      <div className={styles.matchCardHeader}>
        <span className={styles.matchCardStage}>{roundLabel(match.round_number)}</span>
        <div className={styles.matchCardMeta}>
          {isLive ? (
            <span className={styles.liveBadge}>🔴 AO VIVO</span>
          ) : (
            <span className={styles.matchCardTime}>{formatMatchTime(match.match_date)}</span>
          )}
        </div>
      </div>

      <div className={styles.matchCardTeams}>
        <div className={styles.teamBlock}>
          <span className={styles.teamName}>{match.home_team}</span>
        </div>

        <div className={styles.matchCardCenter}>
          {isFinished && match.home_score !== null ? (
            <div className={styles.finalScore}>
              <span>{match.home_score}</span>
              <span className={styles.finalScoreSep}>–</span>
              <span>{match.away_score}</span>
            </div>
          ) : isLive ? (
            <div className={`${styles.finalScore} ${styles.finalScoreLive}`}>
              <span>{match.home_score ?? 0}</span>
              <span className={styles.finalScoreSep}>–</span>
              <span>{match.away_score ?? 0}</span>
            </div>
          ) : (
            <span className={styles.matchCardVs}>VS</span>
          )}
        </div>

        <div className={styles.teamBlock}>
          <span className={styles.teamName}>{match.away_team}</span>
        </div>
      </div>

      {!canBet && (
        <BetTempBar
          matchId={match.id}
          homeTeam={match.home_team}
          awayTeam={match.away_team}
        />
      )}

      <div className={styles.matchCardBet}>
        {canBet ? (
          <>
            <Countdown matchDate={match.match_date} />
            <div className={styles.betSection}>
              <BetInput
                homeScore={homeScore}
                awayScore={awayScore}
                onChange={handleChange}
                disabled={saving}
              />
              <button
                className={`${styles.betSubmitBtn} ${submitted ? styles.betSubmitBtnDone : ''}`}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? '...' : submitted ? '✓ Salvo!' : bet ? 'Atualizar' : 'Apostar'}
              </button>
            </div>
            {error && <p className={styles.betError}>{error}</p>}
            {bet && !submitted && (
              <p className={styles.betCurrent}>Aposta atual: {betDescription}</p>
            )}
          </>
        ) : isFinished ? (
          <div className={styles.betResult}>
            {bet ? (
              <>
                <div className={`${styles.betResultPoints} ${pointsColor}`}>
                  <span className={styles.betResultPtsNum}>+{bet.points_earned ?? 0}</span>
                  <span className={styles.betResultPtsLabel}>pts</span>
                </div>
                <div className={styles.betResultInfo}>
                  <span className={styles.betResultReason}>{betResultReason}</span>
                  <span className={styles.betResultBet}>Aposta: {betDescription}</span>
                </div>
              </>
            ) : (
              <span className={styles.betResultNoBet}>Sem aposta</span>
            )}
          </div>
        ) : isLive ? (
          <div className={styles.betResult}>
            {bet ? (
              <span className={styles.betResultBet}>Sua aposta: {betDescription}</span>
            ) : (
              <span className={styles.betResultNoBet}>Sem aposta</span>
            )}
          </div>
        ) : (
          <div className={styles.betLocked}>
            <span className={styles.betLockedLabel}>🔒 Apostas encerradas</span>
            {bet && (
              <span className={styles.betLockedPick}>Sua aposta: {betDescription}</span>
            )}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
