import { useMatchStats } from '../../hooks/useMatchStats';
import './BetTempBar.css';

interface Props {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

export function BetTempBar({ matchId, homeTeam, awayTeam }: Props) {
  const stats = useMatchStats(matchId, true);

  if (!stats || stats.total === 0) return null;

  const homePct = Math.round((stats.home / stats.total) * 100);
  const drawPct = Math.round((stats.draw / stats.total) * 100);
  const awayPct = 100 - homePct - drawPct;

  return (
    <div className="btb">
      <div className="btb__labels">
        <span className="btb__label btb__label--home">
          <span className="btb__team">{homeTeam}</span>
          <span className="btb__pct">{homePct}%</span>
        </span>
        <span className="btb__title">{stats.total} apostas</span>
        <span className="btb__label btb__label--away">
          <span className="btb__pct">{awayPct}%</span>
          <span className="btb__team">{awayTeam}</span>
        </span>
      </div>

      <div className="btb__bar">
        {homePct > 0 && (
          <div className="btb__seg btb__seg--home" style={{ width: `${homePct}%` }} />
        )}
        {drawPct > 0 && (
          <div className="btb__seg btb__seg--draw" style={{ width: `${drawPct}%` }} />
        )}
        {awayPct > 0 && (
          <div className="btb__seg btb__seg--away" style={{ width: `${awayPct}%` }} />
        )}
      </div>

      {drawPct > 0 && (
        <div className="btb__draw-label">Empate {drawPct}%</div>
      )}
    </div>
  );
}
