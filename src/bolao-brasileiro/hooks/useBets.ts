import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../bolao/lib/supabase';
import { useAuth } from '../../bolao/context/AuthContext';
import type { Bet } from '../types/bolaoBrasileiro.types';

export function useBets() {
  const { profile } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchBets = useCallback(async () => {
    if (!profile) { setBets([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('brasileirao_bets')
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
  ): Promise<{ error: string | null }> => {
    if (!profile) return { error: 'Usuário não autenticado' };

    setSaving(matchId);
    const existing = getBetForMatch(matchId);
    let error: string | null = null;

    const payload = {
      home_score_bet: homeScore,
      away_score_bet: awayScore,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { error: err } = await supabase
        .from('brasileirao_bets')
        .update(payload)
        .eq('id', existing.id);
      error = err?.message ?? null;
    } else {
      const { error: err } = await supabase.from('brasileirao_bets').insert({
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
