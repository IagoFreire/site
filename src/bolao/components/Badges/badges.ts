export interface BadgeDef {
  id: string;
  icon: string;
  label: string;
  description: string;
  condition: (streak: number, totalPoints: number) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: 'streak_3',
    icon: '🔥',
    label: 'Em Chamas',
    description: '3 acertos seguidos',
    condition: (streak) => streak >= 3,
  },
  {
    id: 'streak_5',
    icon: '⚡',
    label: 'Relâmpago',
    description: '5 acertos seguidos',
    condition: (streak) => streak >= 5,
  },
  {
    id: 'streak_10',
    icon: '🦅',
    label: 'Olho de Águia',
    description: '10 acertos seguidos',
    condition: (streak) => streak >= 10,
  },
  {
    id: 'points_50',
    icon: '⭐',
    label: 'Craque',
    description: '50 pontos',
    condition: (_s, pts) => pts >= 50,
  },
  {
    id: 'points_150',
    icon: '🏆',
    label: 'Campeão',
    description: '150 pontos',
    condition: (_s, pts) => pts >= 150,
  },
  {
    id: 'points_300',
    icon: '👑',
    label: 'Lenda',
    description: '300 pontos',
    condition: (_s, pts) => pts >= 300,
  },
];

export function getEarnedBadges(streak: number, totalPoints: number): BadgeDef[] {
  return BADGES.filter(b => b.condition(streak, totalPoints));
}
