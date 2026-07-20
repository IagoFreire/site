import { useState } from 'react';
import { supabase } from '../../../bolao/lib/supabase';
import type { Match } from '../../types/bolaoBrasileiro.types';
import styles from './AdminResultForm.module.css';

interface Props {
  match: Match;
  onSave: () => void;
  onCancel: () => void;
}

export function AdminResultForm({ match, onSave, onCancel }: Props) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? 0);
  const [awayScore, setAwayScore] = useState(match.away_score ?? 0);
  const [loading, setLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const { error: err } = await supabase
      .from('brasileirao_matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'finished',
        updated_at: new Date().toISOString(),
      })
      .eq('id', match.id);

    if (err) { setError(err.message); setLoading(false); return; }

    setCalcLoading(true);
    const { error: rpcErr } = await supabase.rpc('calculate_brasileirao_match_points', { p_match_id: match.id });
    setCalcLoading(false);

    if (rpcErr) {
      setError(`Resultado salvo, mas erro ao calcular pontos: ${rpcErr.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSave();
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className={styles.form}>
        <h2 className={styles.formTitle}>Registrar Resultado</h2>

        <div className={styles.formTeams}>
          <div className={styles.scoreInputs}>
            <input
              type="number"
              min={0}
              max={99}
              value={homeScore}
              onChange={e => setHomeScore(Number(e.target.value))}
              className={styles.scoreInput}
            />
            <span className={styles.dash}>×</span>
            <input
              type="number"
              min={0}
              max={99}
              value={awayScore}
              onChange={e => setAwayScore(Number(e.target.value))}
              className={styles.scoreInput}
            />
          </div>
        </div>
        <div className={styles.teamNames}>
          <span>{match.home_team}</span>
          <span>{match.away_team}</span>
        </div>

        <p className={styles.note}>
          Ao salvar, os pontos de todos os apostadores serão calculados automaticamente.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={`${styles.formBtn} ${styles.formBtnCancel}`} onClick={onCancel}>Cancelar</button>
          <button className={`${styles.formBtn} ${styles.formBtnSave}`} onClick={handleSave} disabled={loading || calcLoading}>
            {calcLoading ? 'Calculando pontos...' : loading ? 'Salvando...' : 'Registrar Resultado'}
          </button>
        </div>
      </div>
    </div>
  );
}
