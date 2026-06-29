import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getFlag, isEmojiFlag } from '../../lib/flags';
import type { Match } from '../../types/bolao.types';
import styles from './AdminResultForm.module.css';

interface Props {
  match: Match;
  onSave: () => void;
  onCancel: () => void;
}

export function AdminResultForm({ match, onSave, onCancel }: Props) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? 0);
  const [awayScore, setAwayScore] = useState(match.away_score ?? 0);
  const [wentToPenalties, setWentToPenalties] = useState(match.went_to_penalties ?? false);
  const [penaltyWinner, setPenaltyWinner] = useState<'home' | 'away' | null>(match.penalty_winner ?? null);
  const [loading, setLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (wentToPenalties && !penaltyWinner) {
      setError('Selecione qual time venceu nos pênaltis.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: err } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        went_to_penalties: wentToPenalties,
        penalty_winner: wentToPenalties ? penaltyWinner : null,
        status: 'finished',
        updated_at: new Date().toISOString(),
      })
      .eq('id', match.id);

    if (err) { setError(err.message); setLoading(false); return; }

    setCalcLoading(true);
    const { error: rpcErr } = await supabase.rpc('calculate_match_points', { p_match_id: match.id });
    setCalcLoading(false);

    if (rpcErr) {
      setError(`Resultado salvo, mas erro ao calcular pontos: ${rpcErr.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSave();
  };

  const homeFlag = getFlag(match.home_team, match.home_team_flag);
  const awayFlag = getFlag(match.away_team, match.away_team_flag);

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className={styles.form}>
        <h2 className={styles.formTitle}>Registrar Resultado</h2>

        <div className={styles.formTeams}>
          <span className={styles.formFlag}>
            {isEmojiFlag(homeFlag) ? homeFlag : <img src={homeFlag} alt={match.home_team} />}
          </span>
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
          <span className={styles.formFlag}>
            {isEmojiFlag(awayFlag) ? awayFlag : <img src={awayFlag} alt={match.away_team} />}
          </span>
        </div>
        <div className={styles.teamNames}>
          <span>{match.home_team}</span>
          <span>{match.away_team}</span>
        </div>

        {match.stage !== 'group' && (
          <div className={styles.penaltySection}>
            <label className={styles.penaltyToggleLabel}>
              <input
                type="checkbox"
                checked={wentToPenalties}
                onChange={e => {
                  setWentToPenalties(e.target.checked);
                  if (!e.target.checked) setPenaltyWinner(null);
                }}
                className={styles.penaltyCheckbox}
              />
              🥅 Jogo foi para pênaltis?
            </label>

            {wentToPenalties && (
              <div className={styles.penaltyWinnerPick}>
                <p className={styles.penaltyWinnerLabel}>Quem venceu nos pênaltis?</p>
                <div className={styles.penaltyWinnerBtns}>
                  <button
                    type="button"
                    className={`${styles.penaltyWinnerBtn}${penaltyWinner === 'home' ? ` ${styles.penaltyWinnerBtnActive}` : ''}`}
                    onClick={() => setPenaltyWinner('home')}
                  >
                    {match.home_team}
                  </button>
                  <button
                    type="button"
                    className={`${styles.penaltyWinnerBtn}${penaltyWinner === 'away' ? ` ${styles.penaltyWinnerBtnActive}` : ''}`}
                    onClick={() => setPenaltyWinner('away')}
                  >
                    {match.away_team}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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
