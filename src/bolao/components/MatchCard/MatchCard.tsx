import { useState, useEffect } from 'react';
import { BetInput } from '../BetInput/BetInput';
import { Countdown } from '../Countdown/Countdown';
import { ConfettiEffect } from '../ConfettiEffect';
import { BetTempBar } from '../BetTempBar/BetTempBar';
import { SpotlightCard } from '../ui/SpotlightCard';
import { STAGE_LABELS, REASON_LABELS } from '../../lib/scoring';
import { formatMatchTime, isFuture } from '../../lib/dates';
import type { Match, Bet } from '../../types/bolao.types';
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

  // Sincroniza spinners quando a aposta carrega de forma assíncrona após o mount
  useEffect(() => {
    if (bet) {
      setHomeScore(bet.home_score_bet);
      setAwayScore(bet.away_score_bet);
    }
  }, [bet?.id]);
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
    bet.points_earned === 0 ? styles.pointsZero :
    bet.points_earned >= 10 ? styles.pointsExact : styles.pointsPartial;

  return (
    <SpotlightCard
      className={`${styles.matchCard} ${isLive ? styles.matchCardLive : ''} ${isFinished ? styles.matchCardFinished : ''}`}
      style={{ overflow: 'hidden' }}
    >
      <ConfettiEffect active={confetti} onDone={() => setConfetti(false)} />

      {/* Header: stage + time */}
      <div className={styles.matchCardHeader}>
        <span className={styles.matchCardStage}>{STAGE_LABELS[match.stage] ?? match.stage}{match.group_name ? ` – Grupo ${match.group_name}` : ''}</span>
        <div className={styles.matchCardMeta}>
          {isLive ? (
            <span className={styles.liveBadge}>🔴 AO VIVO</span>
          ) : (
            <span className={styles.matchCardTime}>{formatMatchTime(match.match_date)}</span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className={styles.matchCardTeams}>
        <span className={`${styles.teamName} ${styles.teamNameHome}`}>{match.home_team}</span>

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

        <span className={`${styles.teamName} ${styles.teamNameAway}`}>{match.away_team}</span>
      </div>

      {/* Temperatura das apostas — visível quando apostas encerradas/ao vivo/finalizado */}
      {!canBet && (
        <BetTempBar
          matchId={match.id}
          homeTeam={match.home_team}
          awayTeam={match.away_team}
        />
      )}

      {/* Bet section */}
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
              <p className={styles.betCurrent}>
                Aposta atual: {bet.home_score_bet} × {bet.away_score_bet}
              </p>
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
                  <span className={styles.betResultReason}>
                    {bet.points_earned !== null ? REASON_LABELS[
                      bet.points_earned === 0 ? 'wrong' :
                      (bet.home_score_bet === match.home_score && bet.away_score_bet === match.away_score) ? 'exact_score' :
                      Math.sign(bet.home_score_bet - bet.away_score_bet) === 0 ? 'correct_draw' : 'correct_winner'
                    ] : 'Aguardando resultado'}
                  </span>
                  <span className={styles.betResultBet}>Aposta: {bet.home_score_bet}–{bet.away_score_bet}</span>
                </div>
              </>
            ) : (
              <span className={styles.betResultNoBet}>Sem aposta</span>
            )}
          </div>
        ) : isLive ? (
          <div className={styles.betResult}>
            {bet ? (
              <span className={styles.betResultBet}>Sua aposta: {bet.home_score_bet}–{bet.away_score_bet}</span>
            ) : (
              <span className={styles.betResultNoBet}>Sem aposta</span>
            )}
          </div>
        ) : (
          /* Apostas encerradas — mostra aposta do usuário se tiver, read-only */
          <div className={styles.betLocked}>
            <span className={styles.betLockedLabel}>🔒 Apostas encerradas</span>
            {bet && (
              <span className={styles.betLockedPick}>
                Sua aposta: {bet.home_score_bet}–{bet.away_score_bet}
              </span>
            )}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
