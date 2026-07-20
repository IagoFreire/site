import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../bolao/lib/supabase';
import { useAuth } from '../../bolao/context/AuthContext';
import type { Stats } from '../types/bolaoBrasileiro.types';

const EMPTY_STATS: Omit<Stats, 'user_id' | 'updated_at'> = {
  total_points: 0,
  streak: 0,
  cold_streak: 0,
};

export function useMyStats() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Omit<Stats, 'user_id' | 'updated_at'>>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!profile) { setStats(EMPTY_STATS); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('brasileirao_stats')
      .select('total_points, streak, cold_streak')
      .eq('user_id', profile.id)
      .maybeSingle();
    setStats(data ?? EMPTY_STATS);
    setLoading(false);
  }, [profile]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
