import { useState, useEffect } from 'react';
import { BetInput } from '../BetInput/BetInput';
import { Countdown } from '../Countdown/Countdown';
import { ConfettiEffect } from '../ConfettiEffect';
import { BetTempBar } from '../BetTempBar/BetTempBar';
import { SpotlightCard } from '../ui/SpotlightCard';
import { STAGE_LABELS, REASON_LABELS } from '../../lib/scoring';
import { formatMatchTime, isFuture } from '../../lib/dates';
import { getCountryCode } from '../../lib/flags';
import type { Match, Bet } from '../../types/bolao.types';
import styles from './MatchCard.module.css';

interface Props {
  match: Match;
  bet: Bet | null;
  onSubmitBet: (
    homeScore: number,
    awayScore: number,
    betPenalties: boolean,
    penaltyWinnerBet: 'home' | 'away' | null,
  ) => Promise<{ error: string | null }>;
  saving: boolean;
}

export function MatchCard({ match, bet, onSubmitBet, saving }: Props) {
  const canBet = isFuture(match.match_date) && match.status === 'scheduled';
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isKnockout = match.stage !== 'group';

  const [homeScore, setHomeScore] = useState(bet?.home_score_bet ?? 0);
  const [awayScore, setAwayScore] = useState(bet?.away_score_bet ?? 0);
  const [betPenalties, setBetPenalties] = useState(bet?.bet_penalties ?? false);
  const [penaltyWinnerBet, setPenaltyWinnerBet] = useState<'home' | 'away' | null>(bet?.penalty_winner_bet ?? null);
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDrawWarning, setShowDrawWarning] = useState(false);

  useEffect(() => {
    if (bet) {
      setHomeScore(bet.home_score_bet);
      setAwayScore(bet.away_score_bet);
      setBetPenalties(bet.bet_penalties ?? false);
      setPenaltyWinnerBet(bet.penalty_winner_bet ?? null);
    }
  }, [bet?.id]);

  const handleChange = (home: number, away: number) => {
    setHomeScore(home);
    setAwayScore(away);
    setSubmitted(false);
  };

  const handlePenaltyChange = (penalties: boolean, winner: 'home' | 'away' | null) => {
    setBetPenalties(penalties);
    setPenaltyWinnerBet(winner);
    setSubmitted(false);
  };

  const handleDrawConfirm = () => {
    setBetPenalties(true);
    setPenaltyWinnerBet(null);
    setShowDrawWarning(false);
  };

  const handleSubmit = async () => {
    if (isKnockout && !betPenalties && homeScore === awayScore) {
      setShowDrawWarning(true);
      return;
    }
    setError(null);
    const { error: err } = await onSubmitBet(homeScore, awayScore, betPenalties, penaltyWinnerBet);
    if (err) { setError(err); return; }
    setSubmitted(true);
    if (isFinished && bet?.points_earned && bet.points_earned >= 10) setConfetti(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const pointsColor =
    bet?.points_earned === null || bet?.points_earned === undefined ? '' :
    bet.points_earned === 0 ? styles.pointsZero :
    bet.points_earned >= 10 ? styles.pointsExact : styles.pointsPartial;

  const betDescription = bet?.bet_penalties
    ? `🥅 Pênaltis · ${bet.penalty_winner_bet === 'home' ? match.home_team : match.away_team}`
    : `${bet?.home_score_bet ?? 0}–${bet?.away_score_bet ?? 0}`;

  const betResultReason = (() => {
    if (!bet || bet.points_earned === null) return 'Aguardando resultado';
    if (bet.bet_penalties) {
      if (bet.points_earned === 0) return REASON_LABELS['wrong'];
      if (bet.penalty_winner_bet === match.penalty_winner) return REASON_LABELS['penalty_correct_winner'];
      return REASON_LABELS['penalty_correct'];
    }
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
        <span className={styles.matchCardStage}>{STAGE_LABELS[match.stage] ?? match.stage}{match.group_name ? ` – Grupo ${match.group_name}` : ''}</span>
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
          <span className={styles.teamCode}>{getCountryCode(match.home_team)}</span>
          <span className={styles.teamName}>{match.home_team}</span>
        </div>

        <div className={styles.matchCardCenter}>
          {isFinished && match.home_score !== null ? (
            <div className={styles.finalScore}>
              <span>{match.home_score}</span>
              <span className={styles.finalScoreSep}>–</span>
              <span>{match.away_score}</span>
              {match.went_to_penalties && (
                <span className={styles.penaltiesBadge}>🥅</span>
              )}
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
          <span className={styles.teamCode}>{getCountryCode(match.away_team)}</span>
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
                isKnockout={isKnockout}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                betPenalties={betPenalties}
                penaltyWinnerBet={penaltyWinnerBet}
                onPenaltyChange={handlePenaltyChange}
              />
              <button
                className={`${styles.betSubmitBtn} ${submitted ? styles.betSubmitBtnDone : ''}`}
                onClick={handleSubmit}
                disabled={saving || (betPenalties && !penaltyWinnerBet)}
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
      {showDrawWarning && (
        <div className={styles.drawOverlay} onClick={() => setShowDrawWarning(false)}>
          <div className={styles.drawModal} onClick={e => e.stopPropagation()}>
            <span className={styles.drawModalIcon}>🥅</span>
            <h3 className={styles.drawModalTitle}>Sem empates no mata-mata!</h3>
            <p className={styles.drawModalDesc}>
              Jogos eliminatórios não terminam empatados. Deseja apostar nos pênaltis em vez de um placar?
            </p>
            <div className={styles.drawModalActions}>
              <button
                className={styles.drawModalBtnCancel}
                onClick={() => setShowDrawWarning(false)}
              >
                Mudar placar
              </button>
              <button
                className={styles.drawModalBtnConfirm}
                onClick={handleDrawConfirm}
              >
                Apostar em pênaltis
              </button>
            </div>
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
