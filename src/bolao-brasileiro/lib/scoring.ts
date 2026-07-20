import type { Bet, Match, ScoringResult } from '../types/bolaoBrasileiro.types';

type BetInput = Pick<Bet, 'home_score_bet' | 'away_score_bet'>;
type MatchInput = Pick<Match, 'home_score' | 'away_score'>;

export function calculatePoints(bet: BetInput, match: MatchInput): ScoringResult {
  if (match.home_score === null || match.away_score === null) {
    return { points: 0, reason: 'wrong' };
  }

  if (bet.home_score_bet === match.home_score && bet.away_score_bet === match.away_score) {
    return { points: 10, reason: 'exact_score' };
  }

  const betWinner = Math.sign(bet.home_score_bet - bet.away_score_bet);
  const realWinner = Math.sign(match.home_score - match.away_score);

  if (betWinner === realWinner) {
    const reason = realWinner === 0 ? 'correct_draw' : 'correct_winner';
    return { points: 5, reason };
  }

  return { points: 0, reason: 'wrong' };
}

export const REASON_LABELS: Record<string, string> = {
  exact_score: 'Placar Exato',
  correct_winner: 'Vencedor Certo',
  correct_draw: 'Empate Certo',
  wrong: 'Errou',
};

export function roundLabel(roundNumber: number): string {
  return `Rodada ${roundNumber}`;
}
