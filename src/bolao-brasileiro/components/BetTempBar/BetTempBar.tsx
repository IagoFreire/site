import { useMatchStats } from '../../hooks/useMatchStats';
import styles from './BetTempBar.module.css';

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
    <div className={styles.btb}>
      <div className={styles.btbLabels}>
        <span className={`${styles.btbLabel} ${styles.btbLabelHome}`}>
          <span className={styles.btbTeam}>{homeTeam}</span>
          <span className={styles.btbPct}>{homePct}%</span>
        </span>
        <span className={styles.btbTitle}>{stats.total} apostas</span>
        <span className={`${styles.btbLabel} ${styles.btbLabelAway}`}>
          <span className={styles.btbPct}>{awayPct}%</span>
          <span className={styles.btbTeam}>{awayTeam}</span>
        </span>
      </div>

      <div className={styles.btbBar}>
        {homePct > 0 && (
          <div className={`${styles.btbSeg} ${styles.btbSegHome}`} style={{ width: `${homePct}%` }} />
        )}
        {drawPct > 0 && (
          <div className={`${styles.btbSeg} ${styles.btbSegDraw}`} style={{ width: `${drawPct}%` }} />
        )}
        {awayPct > 0 && (
          <div className={`${styles.btbSeg} ${styles.btbSegAway}`} style={{ width: `${awayPct}%` }} />
        )}
      </div>

      {drawPct > 0 && (
        <div className={styles.btbDrawLabel}>Empate {drawPct}%</div>
      )}
    </div>
  );
}
