import './BetInput.css';

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
    <div className="bet-input">
      <ScoreSpinner
        value={homeScore}
        onInc={() => onChange(inc(homeScore), awayScore)}
        onDec={() => onChange(dec(homeScore), awayScore)}
        disabled={disabled}
      />
      <span className="bet-input__sep">×</span>
      <ScoreSpinner
        value={awayScore}
        onInc={() => onChange(homeScore, inc(awayScore))}
        onDec={() => onChange(homeScore, dec(awayScore))}
        disabled={disabled}
      />
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
    <div className="score-spinner">
      <button
        className="score-spinner__btn score-spinner__btn--inc"
        onClick={onInc}
        disabled={disabled}
        aria-label="Aumentar"
        type="button"
      >
        +
      </button>
      <span className="score-spinner__value">{value}</span>
      <button
        className="score-spinner__btn score-spinner__btn--dec"
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
