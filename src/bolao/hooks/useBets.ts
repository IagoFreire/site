import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Bet } from '../types/bolao.types';

export function useBets() {
  const { profile } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchBets = useCallback(async () => {
    if (!profile) { setBets([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', profile.id);
    setBets(data ?? []);
    setLoading(false);
  }, [profile]);

  useEffect(() => { fetchBets(); }, [fetchBets]);

  const getBetForMatch = (matchId: string) =>
    bets.find(b => b.match_id === matchId) ?? null;

  const submitBet = async (
    matchId: string,
    homeScore: number,
    awayScore: number,
    betPenalties = false,
    penaltyWinnerBet: 'home' | 'away' | null = null,
  ): Promise<{ error: string | null }> => {
    if (!profile) return { error: 'Usuário não autenticado' };

    setSaving(matchId);
    const existing = getBetForMatch(matchId);
    let error: string | null = null;

    const payload = {
      home_score_bet: betPenalties ? 0 : homeScore,
      away_score_bet: betPenalties ? 0 : awayScore,
      bet_penalties: betPenalties,
      penalty_winner_bet: betPenalties ? penaltyWinnerBet : null,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { error: err } = await supabase
        .from('bets')
        .update(payload)
        .eq('id', existing.id);
      error = err?.message ?? null;
    } else {
      const { error: err } = await supabase.from('bets').insert({
        user_id: profile.id,
        match_id: matchId,
        ...payload,
      });
      error = err?.message ?? null;
    }

    if (!error) await fetchBets();
    setSaving(null);
    return { error };
  };

  return { bets, loading, saving, getBetForMatch, submitBet, refetch: fetchBets };
}
