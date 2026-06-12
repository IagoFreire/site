import { useState, useEffect } from 'react';
import { getTimeUntil } from '../lib/dates';

export function useCountdown(dateStr: string) {
  const [remaining, setRemaining] = useState(getTimeUntil(dateStr));

  useEffect(() => {
    if (remaining.total <= 0) return;
    const id = setInterval(() => {
      const next = getTimeUntil(dateStr);
      setRemaining(next);
      if (next.total <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [dateStr, remaining.total]);

  return remaining;
}
