import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { LeaderboardEntry } from '../types/bolao.types';

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);

    const [{ data: profiles }, { data: exactRows }] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('exact_bets_count').select('user_id, exact_bets')
        .then(res => ({ data: res.error ? [] : res.data })),
    ]);

    const exactCounts: Record<string, number> = {};
    (exactRows ?? []).forEach(row => {
      if (row?.user_id) exactCounts[row.user_id] = row.exact_bets ?? 0;
    });

    const sorted = (profiles ?? [])
      .sort((a, b) => {
        if (b.total_points !== a.total_points) return b.total_points - a.total_points;
        if (b.streak !== a.streak) return b.streak - a.streak;
        return (exactCounts[b.id] ?? 0) - (exactCounts[a.id] ?? 0);
      })
      .map((p, i) => ({ ...p, rank: i + 1, exact_bets: exactCounts[p.id] ?? 0 }));

    setEntries(sorted);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, fetchLeaderboard)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLeaderboard]);

  return { entries, loading, refetch: fetchLeaderboard };
}
