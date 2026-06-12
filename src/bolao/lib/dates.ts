export function isFuture(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}

export function isLive(_dateStr: string, status: string): boolean {
  return status === 'live';
}

export function formatMatchDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
}

export function formatMatchTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatMatchDateTime(dateStr: string): string {
  return `${formatMatchDate(dateStr)} às ${formatMatchTime(dateStr)}`;
}

export function groupMatchesByDate(matches: { match_date: string }[]): Map<string, typeof matches> {
  const groups = new Map<string, typeof matches>();
  for (const match of matches) {
    const key = new Date(match.match_date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
    const existing = groups.get(key) ?? [];
    existing.push(match);
    groups.set(key, existing);
  }
  return groups;
}

export function getTimeUntil(dateStr: string): { hours: number; minutes: number; seconds: number; total: number } {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  const total = Math.floor(diff / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { hours, minutes, seconds, total };
}
