import styles from './BetInput.module.css';

interface Props {
  homeScore: number;
  awayScore: number;
  onChange: (home: number, away: number) => void;
  disabled?: boolean;
  isKnockout?: boolean;
  homeTeam?: string;
  awayTeam?: string;
  betPenalties?: boolean;
  penaltyWinnerBet?: 'home' | 'away' | null;
  onPenaltyChange?: (betPenalties: boolean, penaltyWinnerBet: 'home' | 'away' | null) => void;
}

export function BetInput({
  homeScore,
  awayScore,
  onChange,
  disabled,
  isKnockout,
  homeTeam,
  awayTeam,
  betPenalties,
  penaltyWinnerBet,
  onPenaltyChange,
}: Props) {
  const inc = (val: number) => Math.min(val + 1, 30);
  const dec = (val: number) => Math.max(val - 1, 0);

  const togglePenaltyMode = () => {
    if (!onPenaltyChange) return;
    onPenaltyChange(!betPenalties, betPenalties ? null : penaltyWinnerBet ?? null);
  };

  const selectPenaltyWinner = (side: 'home' | 'away') => {
    if (!onPenaltyChange) return;
    onPenaltyChange(true, side);
  };

  return (
    <div className={styles.betInputWrapper}>
      {!betPenalties && (
        <div className={styles.betInput}>
          <ScoreSpinner
            value={homeScore}
            onInc={() => onChange(inc(homeScore), awayScore)}
            onDec={() => onChange(dec(homeScore), awayScore)}
            disabled={disabled}
          />
          <span className={styles.betInputSep}>×</span>
          <ScoreSpinner
            value={awayScore}
            onInc={() => onChange(homeScore, inc(awayScore))}
            onDec={() => onChange(homeScore, dec(awayScore))}
            disabled={disabled}
          />
        </div>
      )}

      {betPenalties && (
        <div className={styles.penaltyPick}>
          <p className={styles.penaltyPickLabel}>Quem ganha nos pênaltis?</p>
          <div className={styles.penaltyBtns}>
            <button
              type="button"
              disabled={disabled}
              className={`${styles.penaltyBtn}${penaltyWinnerBet === 'home' ? ` ${styles.penaltyBtnActive}` : ''}`}
              onClick={() => selectPenaltyWinner('home')}
            >
              {homeTeam ?? 'Time A'}
            </button>
            <button
              type="button"
              disabled={disabled}
              className={`${styles.penaltyBtn}${penaltyWinnerBet === 'away' ? ` ${styles.penaltyBtnActive}` : ''}`}
              onClick={() => selectPenaltyWinner('away')}
            >
              {awayTeam ?? 'Time B'}
            </button>
          </div>
        </div>
      )}

      {isKnockout && onPenaltyChange && (
        <button
          type="button"
          disabled={disabled}
          className={`${styles.penaltyToggle}${betPenalties ? ` ${styles.penaltyToggleActive}` : ''}`}
          onClick={togglePenaltyMode}
        >
          🥅 {betPenalties ? 'Voltar para placar' : 'Apostar em pênaltis'}
        </button>
      )}
    </div>
  );
}

function ScoreSpinner({
  value,
  onInc,
  onDec,
  disabled,
}: {
  value: number;
  onInc: () => void;
  onDec: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={styles.scoreSpinner}>
      <button
        className={`${styles.scoreSpinnerBtn} ${styles.scoreSpinnerBtnInc}`}
        onClick={onInc}
        disabled={disabled}
        aria-label="Aumentar"
        type="button"
      >
        +
      </button>
      <span key={value} className={styles.scoreSpinnerValue}>{value}</span>
      <button
        className={`${styles.scoreSpinnerBtn} ${styles.scoreSpinnerBtnDec}`}
        onClick={onDec}
        disabled={disabled || value === 0}
        aria-label="Diminuir"
        type="button"
      >
        −
      </button>
    </div>
  );
}
