import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getFlag, isEmojiFlag } from '../../lib/flags';
import type { Match } from '../../types/bolao.types';
import './AdminResultForm.css';

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
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'finished',
        updated_at: new Date().toISOString(),
      })
      .eq('id', match.id);

    if (err) { setError(err.message); setLoading(false); return; }

    // Calculate points via DB RPC
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
    <div className="result-form-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="result-form">
        <h2 className="result-form__title">Registrar Resultado</h2>

        <div className="result-form__teams">
          <span className="result-form__flag">
            {isEmojiFlag(homeFlag) ? homeFlag : <img src={homeFlag} alt={match.home_team} />}
          </span>
          <div className="result-form__score-inputs">
            <input
              type="number"
              min={0}
              max={99}
              value={homeScore}
              onChange={e => setHomeScore(Number(e.target.value))}
              className="result-form__score-input"
            />
            <span className="result-form__dash">×</span>
            <input
              type="number"
              min={0}
              max={99}
              value={awayScore}
              onChange={e => setAwayScore(Number(e.target.value))}
              className="result-form__score-input"
            />
          </div>
          <span className="result-form__flag">
            {isEmojiFlag(awayFlag) ? awayFlag : <img src={awayFlag} alt={match.away_team} />}
          </span>
        </div>
        <div className="result-form__team-names">
          <span>{match.home_team}</span>
          <span>{match.away_team}</span>
        </div>

        <p className="result-form__note">
          Ao salvar, os pontos de todos os apostadores serão calculados automaticamente.
        </p>

        {error && <p className="result-form__error">{error}</p>}

        <div className="result-form__actions">
          <button className="admin-form__btn admin-form__btn--cancel" onClick={onCancel}>Cancelar</button>
          <button className="admin-form__btn admin-form__btn--save" onClick={handleSave} disabled={loading || calcLoading}>
            {calcLoading ? 'Calculando pontos...' : loading ? 'Salvando...' : 'Registrar Resultado'}
          </button>
        </div>
      </div>
    </div>
  );
}
