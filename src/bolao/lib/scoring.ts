import type { Bet, Match, ScoringResult } from '../types/bolao.types';

type BetInput = Pick<Bet, 'home_score_bet' | 'away_score_bet' | 'is_wildcard'>;
type MatchInput = Pick<Match, 'home_score' | 'away_score' | 'points_multiplier'>;

export function calculatePoints(bet: BetInput, match: MatchInput): ScoringResult {
  if (match.home_score === null || match.away_score === null) {
    return { points: 0, reason: 'wrong' };
  }

  const multiplier = match.points_multiplier ?? 1;

  if (bet.home_score_bet === match.home_score && bet.away_score_bet === match.away_score) {
    const base = 10 * multiplier;
    return { points: bet.is_wildcard ? base * 2 : base, reason: 'exact_score' };
  }

  const betWinner = Math.sign(bet.home_score_bet - bet.away_score_bet);
  const realWinner = Math.sign(match.home_score - match.away_score);

  if (betWinner === realWinner) {
    const base = 5 * multiplier;
    const reason = realWinner === 0 ? 'correct_draw' : 'correct_winner';
    return { points: bet.is_wildcard ? base * 2 : base, reason };
  }

  return { points: 0, reason: 'wrong' };
}

export const STAGE_LABELS: Record<string, string> = {
  group: 'Fase de Grupos',
  round_of_32: 'Rodada de 32',
  round_of_16: 'Oitavas de Final',
  quarter: 'Quartas de Final',
  semi: 'Semifinal',
  third_place: '3º Lugar',
  final: 'Final',
};

export const REASON_LABELS: Record<string, string> = {
  exact_score: 'Placar Exato',
  correct_winner: 'Vencedor Certo',
  correct_draw: 'Empate Certo',
  wrong: 'Errou',
};
