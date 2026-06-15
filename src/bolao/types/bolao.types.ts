export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  total_points: number;
  streak: number;
  cold_streak: number;
  created_at: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';
export type MatchStage = 'group' | 'round_of_32' | 'round_of_16' | 'quarter' | 'semi' | 'third_place' | 'final';

export interface Match {
  id: string;
  external_id: string | null;
  home_team: string;
  away_team: string;
  home_team_flag: string | null;
  away_team_flag: string | null;
  stage: MatchStage;
  group_name: string | null;
  match_date: string;
  venue: string | null;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  points_multiplier: number;
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
  is_wildcard: boolean;
  created_at: string;
  updated_at: string;
}

export interface PointLog {
  id: string;
  user_id: string;
  match_id: string;
  bet_id: string;
  points: number;
  reason: 'exact_score' | 'correct_winner' | 'correct_draw' | 'wrong';
  created_at: string;
}

export interface LeaderboardEntry extends Profile {
  rank: number;
}

export type BetReason = 'exact_score' | 'correct_winner' | 'correct_draw' | 'wrong';

export interface ScoringResult {
  points: number;
  reason: BetReason;
}
