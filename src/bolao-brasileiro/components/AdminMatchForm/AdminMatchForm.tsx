import { useState } from 'react';
import { supabase } from '../../../bolao/lib/supabase';
import type { Match } from '../../types/bolaoBrasileiro.types';
import styles from './AdminMatchForm.module.css';

interface Props {
  match?: Match | null;
  onSave: () => void;
  onCancel: () => void;
}

function toLocalDatetimeInput(isoStr: string): string {
  const d = new Date(isoStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminMatchForm({ match, onSave, onCancel }: Props) {
  const [homeTeam, setHomeTeam] = useState(match?.home_team ?? '');
  const [awayTeam, setAwayTeam] = useState(match?.away_team ?? '');
  const [roundNumber, setRoundNumber] = useState(String(match?.round_number ?? 20));
  const [matchDate, setMatchDate] = useState(match ? toLocalDatetimeInput(match.match_date) : '');
  const [venue, setVenue] = useState(match?.venue ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedRound = parseInt(roundNumber, 10);
    if (!homeTeam || !awayTeam || !matchDate || !parsedRound || parsedRound < 1 || parsedRound > 38) {
      setError('Preencha todos os campos obrigatórios (rodada entre 1 e 38).');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      home_team: homeTeam.trim(),
      away_team: awayTeam.trim(),
      round_number: parsedRound,
      match_date: new Date(matchDate).toISOString(),
      venue: venue.trim() || null,
      status: 'scheduled' as const,
    };

    let err;
    if (match) {
      ({ error: err } = await supabase.from('brasileirao_matches').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', match.id));
    } else {
      ({ error: err } = await supabase.from('brasileirao_matches').insert(payload));
    }

    setLoading(false);
    if (err) { setError(err.message); return; }
    onSave();
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCancel()}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>{match ? 'Editar Jogo' : 'Novo Jogo'}</h2>

        <div className={styles.formGrid}>
          <label className={styles.formField}>
            <span>Time da Casa *</span>
            <input value={homeTeam} onChange={e => setHomeTeam(e.target.value)} placeholder="Flamengo" required />
          </label>
          <label className={styles.formField}>
            <span>Time Visitante *</span>
            <input value={awayTeam} onChange={e => setAwayTeam(e.target.value)} placeholder="Palmeiras" required />
          </label>
          <label className={styles.formField}>
            <span>Rodada (20–38) *</span>
            <input
              type="number"
              min={1}
              max={38}
              value={roundNumber}
              onChange={e => setRoundNumber(e.target.value)}
              required
            />
          </label>
          <label className={styles.formField}>
            <span>Data e Hora *</span>
            <input type="datetime-local" value={matchDate} onChange={e => setMatchDate(e.target.value)} required />
          </label>
          <label className={styles.formField}>
            <span>Estádio</span>
            <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="Maracanã" />
          </label>
        </div>

        <p className={styles.formNote}>
          Pontuação: placar exato 10 pts · vencedor/empate certo 5 pts · errou 0 pts.
        </p>

        {error && <p className={styles.formError}>{error}</p>}

        <div className={styles.formActions}>
          <button type="button" className={`${styles.formBtn} ${styles.formBtnCancel}`} onClick={onCancel}>Cancelar</button>
          <button type="submit" className={`${styles.formBtn} ${styles.formBtnSave}`} disabled={loading}>
            {loading ? 'Salvando...' : match ? 'Salvar Alterações' : 'Criar Jogo'}
          </button>
        </div>
      </form>
    </div>
  );
}
