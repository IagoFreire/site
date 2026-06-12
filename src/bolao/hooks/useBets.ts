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
    isWildcard = false
  ): Promise<{ error: string | null }> => {
    if (!profile) return { error: 'Usuário não autenticado' };

    setSaving(matchId);
    const existing = getBetForMatch(matchId);

    let error: string | null = null;

    if (existing) {
      const { error: err } = await supabase
        .from('bets')
        .update({
          home_score_bet: homeScore,
          away_score_bet: awayScore,
          is_wildcard: isWildcard,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      error = err?.message ?? null;
    } else {
      const { error: err } = await supabase.from('bets').insert({
        user_id: profile.id,
        match_id: matchId,
        home_score_bet: homeScore,
        away_score_bet: awayScore,
        is_wildcard: isWildcard,
      });
      error = err?.message ?? null;
    }

    if (!error) await fetchBets();
    setSaving(null);
    return { error };
  };

  const toggleWildcard = async (matchId: string): Promise<{ error: string | null }> => {
    const existing = getBetForMatch(matchId);
    if (!existing) return { error: 'Aposta não encontrada' };
    return submitBet(matchId, existing.home_score_bet, existing.away_score_bet, !existing.is_wildcard);
  };

  return { bets, loading, saving, getBetForMatch, submitBet, toggleWildcard, refetch: fetchBets };
}
