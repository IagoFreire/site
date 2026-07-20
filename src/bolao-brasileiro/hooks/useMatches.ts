import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../bolao/lib/supabase';
import type { Match } from '../types/bolaoBrasileiro.types';

export type MatchFilter = 'all' | 'upcoming' | 'finished' | 'live';

export function useMatches(filter: MatchFilter = 'all') {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('brasileirao_matches')
      .select('*')
      .order('match_date', { ascending: true });

    if (filter === 'upcoming') query = query.eq('status', 'scheduled');
    else if (filter === 'finished') query = query.eq('status', 'finished');
    else if (filter === 'live') query = query.eq('status', 'live');

    const { data, error: err } = await query;
    if (err) setError(err.message);
    else setMatches(data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  useEffect(() => {
    const channel = supabase
      .channel('brasileirao-matches-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brasileirao_matches' }, fetchMatches)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchMatches]);

  return { matches, loading, error, refetch: fetchMatches };
}
