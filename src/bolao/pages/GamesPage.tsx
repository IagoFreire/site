import { useState } from 'react';
import { MatchCard } from '../components/MatchCard/MatchCard';
import { useMatches, type MatchFilter } from '../hooks/useMatches';
import { useBets } from '../hooks/useBets';
import { groupMatchesByDate } from '../lib/dates';
import type { Match } from '../types/bolao.types';
import './GamesPage.css';

const TABS: { label: string; value: MatchFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Próximos', value: 'upcoming' },
  { label: 'Ao Vivo', value: 'live' },
  { label: 'Finalizados', value: 'finished' },
];

export function GamesPage() {
  const [filter, setFilter] = useState<MatchFilter>('all');
  const { matches, loading } = useMatches(filter);
  const { getBetForMatch, submitBet, saving } = useBets();

  const grouped = groupMatchesByDate(matches as { match_date: string }[]) as Map<string, Match[]>;

  return (
    <div className="bolao-page">
      <h1 className="bolao-page__title">Jogos</h1>

      <div className="bolao-tabs">
        {TABS.map(tab => (
          <button
            key={tab.value}
            className={`bolao-tab ${filter === tab.value ? 'bolao-tab--active' : ''}`}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bolao-loading-screen" style={{ minHeight: 240, background: 'transparent' }}>
          <div className="bolao-spinner" />
        </div>
      ) : matches.length === 0 ? (
        <div className="bolao-empty">
          <span className="bolao-empty__icon">⚽</span>
          <p className="bolao-empty__text">Nenhum jogo encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="games-groups">
          {Array.from(grouped.entries()).map(([date, dayMatches]) => (
            <div key={date} className="bolao-date-group">
              <div className="bolao-date-group__header">{date}</div>
              <div className="bolao-card-list">
                {dayMatches.map((match, i) => (
                  <div key={match.id} style={{ animationDelay: `${i * 0.06}s` }}>
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
