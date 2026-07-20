import { useAuth } from '../../bolao/context/AuthContext';
import { useMatches } from '../hooks/useMatches';
import { useBets } from '../hooks/useBets';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useMyStats } from '../hooks/useMyStats';
import { MatchCard } from '../components/MatchCard/MatchCard';
import { BadgeList } from '../../bolao/components/Badges/BadgeList';
import { getEarnedBadges } from '../../bolao/components/Badges/badges';
import { AnimatedCounter } from '../../bolao/components/ui/AnimatedCounter';
import { BlurText } from '../../bolao/components/ui/BlurText';
import { groupMatchesByDate } from '../../bolao/lib/dates';
import type { Match } from '../types/bolaoBrasileiro.types';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { profile } = useAuth();
  const { matches: upcoming, loading: matchesLoading } = useMatches('upcoming');
  const { getBetForMatch, submitBet, saving } = useBets();
  const { entries } = useLeaderboard();
  const { stats } = useMyStats();

  const rank = entries.find(e => e.id === profile?.id)?.rank;
  const nextMatches = upcoming.slice(0, 3);
  const groupedNextMatches = groupMatchesByDate(nextMatches as { match_date: string }[]) as Map<string, Match[]>;

  return (
    <div className="bolao-page">
      <div className={styles.welcome}>
        <div className={styles.avatar}>
          {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <h1 className={styles.welcomeName}>
            <BlurText text={`Olá, ${profile?.display_name?.split(' ')[0] ?? ''}! 👋`} delayMs={22} />
          </h1>
          <p className={styles.welcomeSub}>Boa sorte no returno!</p>
        </div>
      </div>

      <div className="bolao-stats-row">
        <div className="bolao-stat-card">
          <span className="bolao-stat-card__label">Pontos</span>
          <AnimatedCounter value={stats.total_points} className="bolao-stat-card__value" />
        </div>
        <div className="bolao-stat-card">
          <span className="bolao-stat-card__label">Posição</span>
          <span className="bolao-stat-card__value">{rank ? `#${rank}` : '–'}</span>
        </div>
        <div className="bolao-stat-card">
          <span className="bolao-stat-card__label">Sequência</span>
          <span className="bolao-stat-card__value">
            <AnimatedCounter value={stats.streak} />🔥
          </span>
        </div>
      </div>

      {getEarnedBadges(stats.streak, stats.total_points).length > 0 && (
        <div className={styles.badges}>
          <p className="bolao-section-title">Conquistas</p>
          <BadgeList streak={stats.streak} totalPoints={stats.total_points} />
        </div>
      )}

      <p className="bolao-section-title">Próximos Jogos</p>
      {matchesLoading ? (
        <div className="bolao-loading-screen" style={{ minHeight: 120, background: 'transparent' }}>
          <div className="bolao-spinner" />
        </div>
      ) : nextMatches.length === 0 ? (
        <div className="bolao-empty" style={{ padding: '24px' }}>
          <span className="bolao-empty__icon">✅</span>
          <p className="bolao-empty__text">Sem jogos agendados. Confira o ranking!</p>
        </div>
      ) : (
        <div>
          {Array.from(groupedNextMatches.entries()).map(([date, dayMatches]) => (
            <div key={date} className="bolao-date-group">
              <div className="bolao-date-group__header">{date}</div>
              <div className="bolao-card-list">
                {dayMatches.map((match, i) => (
                  <div key={match.id} style={{ animationDelay: `${i * 0.08}s` }}>
                    <MatchCard
                      match={match}
                      bet={getBetForMatch(match.id)}
                      onSubmitBet={(home, away) => submitBet(match.id, home, away)}
                      saving={saving === match.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
