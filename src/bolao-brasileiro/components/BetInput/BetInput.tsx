import styles from './BetInput.module.css';

interface Props {
  homeScore: number;
  awayScore: number;
  onChange: (home: number, away: number) => void;
  disabled?: boolean;
}

export function BetInput({ homeScore, awayScore, onChange, disabled }: Props) {
  const inc = (val: number) => Math.min(val + 1, 30);
  const dec = (val: number) => Math.max(val - 1, 0);

  return (
    <div className={styles.betInputWrapper}>
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
