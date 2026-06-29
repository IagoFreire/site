import { useAuth } from '../context/AuthContext';
import { useMatches } from '../hooks/useMatches';
import { useBets } from '../hooks/useBets';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { MatchCard } from '../components/MatchCard/MatchCard';
import { BadgeList } from '../components/Badges/BadgeList';
import { getEarnedBadges } from '../components/Badges/badges';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { BlurText } from '../components/ui/BlurText';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { profile } = useAuth();
  const { matches: upcoming, loading: matchesLoading } = useMatches('upcoming');
  const { getBetForMatch, submitBet, saving } = useBets();
  const { entries } = useLeaderboard();

  const rank = entries.find(e => e.id === profile?.id)?.rank;
  const nextMatches = upcoming.slice(0, 3);

  return (
    <div className="bolao-page">
      {/* Welcome */}
      <div className={styles.welcome}>
        <div className={styles.avatar}>
          {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <h1 className={styles.welcomeName}>
            <BlurText text={`Olá, ${profile?.display_name?.split(' ')[0] ?? ''}! 👋`} delayMs={22} />
          </h1>
          <p className={styles.welcomeSub}>Boa sorte no bolão!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bolao-stats-row">
        <div className="bolao-stat-card">
          <span className="bolao-stat-card__label">Pontos</span>
          <AnimatedCounter value={profile?.total_points ?? 0} className="bolao-stat-card__value" />
        </div>
        <div className="bolao-stat-card">
          <span className="bolao-stat-card__label">Posição</span>
          <span className="bolao-stat-card__value">{rank ? `#${rank}` : '–'}</span>
        </div>
        <div className="bolao-stat-card">
          <span className="bolao-stat-card__label">Sequência</span>
          <span className="bolao-stat-card__value">
            <AnimatedCounter value={profile?.streak ?? 0} />🔥
          </span>
        </div>
      </div>

      {/* Badges — só aparece se o usuário tiver ao menos uma conquista */}
      {profile && getEarnedBadges(profile.streak, profile.total_points).length > 0 && (
        <div className={styles.badges}>
          <p className="bolao-section-title">Conquistas</p>
          <BadgeList streak={profile.streak} totalPoints={profile.total_points} />
        </div>
      )}

      {/* Next matches */}
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
        <div className="bolao-card-list">
          {nextMatches.map((match, i) => (
            <div key={match.id} style={{ animationDelay: `${i * 0.08}s` }}>
              <MatchCard
                match={match}
                bet={getBetForMatch(match.id)}
                onSubmitBet={(home, away, penalties, winner) => submitBet(match.id, home, away, penalties, winner)}
                saving={saving === match.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
