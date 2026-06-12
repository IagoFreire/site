import { useCountdown } from '../../hooks/useCountdown';
import './Countdown.css';

interface Props {
  matchDate: string;
}

export function Countdown({ matchDate }: Props) {
  const { hours, minutes, seconds, total } = useCountdown(matchDate);

  if (total <= 0) return null;

  const urgent = hours === 0 && minutes < 60;

  return (
    <div className={`countdown ${urgent ? 'countdown--urgent' : ''}`}>
      <span className="countdown__label">Começa em</span>
      <div className="countdown__time">
        {hours > 0 && <><span className="countdown__unit">{String(hours).padStart(2, '0')}</span><span className="countdown__sep">h</span></>}
        <span className="countdown__unit">{String(minutes).padStart(2, '0')}</span>
        <span className="countdown__sep">m</span>
        <span className="countdown__unit">{String(seconds).padStart(2, '0')}</span>
        <span className="countdown__sep">s</span>
      </div>
    </div>
  );
}
