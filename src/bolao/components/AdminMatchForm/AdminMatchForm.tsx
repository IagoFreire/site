import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { STAGE_LABELS } from '../../lib/scoring';
import type { Match, MatchStage } from '../../types/bolao.types';
import './AdminMatchForm.css';

interface Props {
  match?: Match | null;
  onSave: () => void;
  onCancel: () => void;
}

const STAGES: MatchStage[] = ['group', 'round_of_16', 'quarter', 'semi', 'final'];
const MULTIPLIERS: Record<MatchStage, number> = {
  group: 1,
  round_of_16: 2,
  quarter: 2,
  semi: 3,
  final: 3,
};

function toLocalDatetimeInput(isoStr: string): string {
  const d = new Date(isoStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminMatchForm({ match, onSave, onCancel }: Props) {
  const [homeTeam, setHomeTeam] = useState(match?.home_team ?? '');
  const [awayTeam, setAwayTeam] = useState(match?.away_team ?? '');
  const [stage, setStage] = useState<MatchStage>(match?.stage ?? 'group');
  const [groupName, setGroupName] = useState(match?.group_name ?? '');
  const [matchDate, setMatchDate] = useState(match ? toLocalDatetimeInput(match.match_date) : '');
  const [venue, setVenue] = useState(match?.venue ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // auto-set multiplier when stage changes
  }, [stage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !matchDate) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      home_team: homeTeam.trim(),
      away_team: awayTeam.trim(),
      stage,
      group_name: stage === 'group' ? groupName.toUpperCase().trim() || null : null,
      match_date: new Date(matchDate).toISOString(),
      venue: venue.trim() || null,
      points_multiplier: MULTIPLIERS[stage],
      status: 'scheduled' as const,
    };

    let err;
    if (match) {
      ({ error: err } = await supabase.from('matches').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', match.id));
    } else {
      ({ error: err } = await supabase.from('matches').insert(payload));
    }

    setLoading(false);
    if (err) { setError(err.message); return; }
    onSave();
  };

  return (
    <div className="admin-form-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-form__title">{match ? 'Editar Jogo' : 'Novo Jogo'}</h2>

        <div className="admin-form__grid">
          <label className="admin-form__field">
            <span>Time da Casa *</span>
            <input value={homeTeam} onChange={e => setHomeTeam(e.target.value)} placeholder="Brasil" required />
          </label>
          <label className="admin-form__field">
            <span>Time Visitante *</span>
            <input value={awayTeam} onChange={e => setAwayTeam(e.target.value)} placeholder="Argentina" required />
          </label>
          <label className="admin-form__field">
            <span>Fase *</span>
            <select value={stage} onChange={e => setStage(e.target.value as MatchStage)}>
              {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
            </select>
          </label>
          {stage === 'group' && (
            <label className="admin-form__field">
              <span>Grupo (A–L)</span>
              <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="A" maxLength={1} />
            </label>
          )}
          <label className="admin-form__field">
            <span>Data e Hora *</span>
            <input type="datetime-local" value={matchDate} onChange={e => setMatchDate(e.target.value)} required />
          </label>
          <label className="admin-form__field">
            <span>Estádio</span>
            <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="MetLife Stadium" />
          </label>
        </div>

        <p className="admin-form__multiplier">
          Multiplicador de pontos: <strong>{MULTIPLIERS[stage]}×</strong>
          {' '}(Exato: {10 * MULTIPLIERS[stage]} pts / Vencedor: {5 * MULTIPLIERS[stage]} pts)
        </p>

        {error && <p className="admin-form__error">{error}</p>}

        <div className="admin-form__actions">
          <button type="button" className="admin-form__btn admin-form__btn--cancel" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="admin-form__btn admin-form__btn--save" disabled={loading}>
            {loading ? 'Salvando...' : match ? 'Salvar Alterações' : 'Criar Jogo'}
          </button>
        </div>
      </form>
    </div>
  );
}
