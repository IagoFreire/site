import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface MatchStats {
  home: number;
  draw: number;
  away: number;
  total: number;
}

export function useMatchStats(matchId: string, enabled: boolean) {
  const [stats, setStats] = useState<MatchStats | null>(null);

  useEffect(() => {
    if (!enabled) return;
    supabase
      .rpc('get_match_bet_stats', { match_uuid: matchId })
      .then(({ data }) => {
        if (data && (data as MatchStats).total > 0) {
          setStats(data as MatchStats);
        }
      });
  }, [matchId, enabled]);

  return stats;
}
