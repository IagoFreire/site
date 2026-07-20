export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export interface Match {
  id: string;
  external_id: string | null;
  home_team: string;
  away_team: string;
  round_number: number;
  match_date: string;
  venue: string | null;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
}

export interface Bet {
  id: string;
  user_id: string;
  match_id: string;
  home_score_bet: number;
  away_score_bet: number;
  points_earned: number | null;
  created_at: string;
  updated_at: string;
}

export interface PointLog {
  id: string;
  user_id: string;
  match_id: string;
  bet_id: string;
  points: number;
  reason: BetReason;
  created_at: string;
}

export type BetReason = 'exact_score' | 'correct_winner' | 'correct_draw' | 'wrong';

export interface ScoringResult {
  points: number;
  reason: BetReason;
}

// Perfil (identidade compartilhada com o Bolão Copa 2026 via public.profiles)
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

// Estatísticas do returno — isoladas da Copa (public.brasileirao_stats)
export interface Stats {
  user_id: string;
  total_points: number;
  streak: number;
  cold_streak: number;
  updated_at: string;
}

export interface LeaderboardEntry extends Profile, Omit<Stats, 'user_id' | 'updated_at'> {
  rank: number;
  exact_bets: number;
}
