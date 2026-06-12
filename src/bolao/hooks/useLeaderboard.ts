import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { LeaderboardEntry } from '../types/bolao.types';

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('total_points', { ascending: false })
      .order('streak', { ascending: false });

    const ranked = (data ?? []).map((p, i) => ({ ...p, rank: i + 1 }));
    setEntries(ranked);
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
