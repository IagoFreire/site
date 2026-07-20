import { useState, useEffect } from 'react';
import { supabase } from '../../bolao/lib/supabase';
import type { Bet, Match } from '../types/bolaoBrasileiro.types';

export interface BetWithMatch extends Bet {
  match: Match;
}

export function useUserBets(userId: string | null) {
  const [bets, setBets] = useState<BetWithMatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) { setBets([]); return; }

    setLoading(true);
    supabase
      .from('brasileirao_bets')
      .select('*, match:brasileirao_matches(*)')
      .eq('user_id', userId)
      .then(({ data }) => {
        const now = new Date();
        const visible = ((data ?? []) as BetWithMatch[])
          .filter(b => {
            const m = b.match;
            return (
              m.status === 'finished' ||
              m.status === 'live' ||
              new Date(m.match_date) < now
            );
          })
          .sort((a, b) =>
            new Date(b.match.match_date).getTime() - new Date(a.match.match_date).getTime()
          );
        setBets(visible);
        setLoading(false);
      });
  }, [userId]);

  return { bets, loading };
}
