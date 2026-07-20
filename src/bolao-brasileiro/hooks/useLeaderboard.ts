import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../bolao/lib/supabase';
import type { LeaderboardEntry } from '../types/bolaoBrasileiro.types';

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);

    const [{ data: profiles }, { data: statsRows }, { data: exactRows }] = await Promise.all([
      supabase.from('profiles').select('id, username, display_name, avatar_url, role, created_at'),
      supabase.from('brasileirao_stats').select('user_id, total_points, streak, cold_streak'),
      supabase.from('brasileirao_exact_bets_count').select('user_id, exact_bets')
        .then(res => ({ data: res.error ? [] : res.data })),
    ]);

    const statsByUser: Record<string, { total_points: number; streak: number; cold_streak: number }> = {};
    (statsRows ?? []).forEach(row => { statsByUser[row.user_id] = row; });

    const exactCounts: Record<string, number> = {};
    (exactRows ?? []).forEach(row => {
      if (row?.user_id) exactCounts[row.user_id] = row.exact_bets ?? 0;
    });

    const merged = (profiles ?? []).map(p => ({
      ...p,
      total_points: statsByUser[p.id]?.total_points ?? 0,
      streak: statsByUser[p.id]?.streak ?? 0,
      cold_streak: statsByUser[p.id]?.cold_streak ?? 0,
      exact_bets: exactCounts[p.id] ?? 0,
    }));

    const sorted = merged
      .sort((a, b) => {
        if (b.total_points !== a.total_points) return b.total_points - a.total_points;
        if (b.streak !== a.streak) return b.streak - a.streak;
        return b.exact_bets - a.exact_bets;
      })
      .map((p, i) => ({ ...p, rank: i + 1 }));

    setEntries(sorted);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  useEffect(() => {
    const channel = supabase
      .channel('brasileirao-leaderboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brasileirao_stats' }, fetchLeaderboard)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLeaderboard]);

  return { entries, loading, refetch: fetchLeaderboard };
}
