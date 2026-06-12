import { useMemo, useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import { STAGE_LABELS } from '../lib/scoring';
import { formatMatchDate, formatMatchTime } from '../lib/dates';
import type { Match } from '../types/bolao.types';
import './BracketPage.css';

const KNOCKOUT_STAGES = [
  'round_of_32',
  'round_of_16',
  'quarter',
  'semi',
  'third_place',
  'final',
] as const;

type KnockoutStage = typeof KNOCKOUT_STAGES[number];

/* ── Mini match card for the bracket ── */
function BracketCard({ match }: { match: Match }) {
  const finished = match.status === 'finished';
  const live = match.status === 'live';
  const homeWon =
    finished &&
    match.home_score !== null &&
    match.away_score !== null &&
    match.home_score > match.away_score;
  const awayWon =
    finished &&
    match.home_score !== null &&
    match.away_score !== null &&
    match.away_score > match.home_score;

  return (
    <div className={`bk-card${live ? ' bk-card--live' : ''}${match.status === 'finished' ? ' bk-card--done' : ''}`}>
      <div className={`bk-card__team${homeWon ? ' bk-card__team--winner' : ''}${awayWon ? ' bk-card__team--loser' : ''}`}>
        <span className="bk-card__name">{match.home_team}</span>
        <span className="bk-card__score">
          {match.home_score !== null ? match.home_score : '–'}
        </span>
      </div>
      <div className={`bk-card__team${awayWon ? ' bk-card__team--winner' : ''}${homeWon ? ' bk-card__team--loser' : ''}`}>
        <span className="bk-card__name">{match.away_team}</span>
        <span className="bk-card__score">
          {match.away_score !== null ? match.away_score : '–'}
        </span>
      </div>
      <div className="bk-card__footer">
        {live ? (
          <span className="bk-card__live">● AO VIVO</span>
        ) : (
          <span className="bk-card__date">
            {formatMatchDate(match.match_date)} · {formatMatchTime(match.match_date)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Mobile list view for a single stage ── */
function StageList({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return (
      <div className="bolao-empty" style={{ padding: '32px 0' }}>
        <span className="bolao-empty__icon">⏳</span>
        <p className="bolao-empty__text">Jogos desta fase ainda não foram definidos.</p>
      </div>
    );
  }
  return (
    <div className="bk-list">
      {matches.map(m => (
        <BracketCard key={m.id} match={m} />
      ))}
    </div>
  );
}

/* ── Main page ── */
export function BracketPage() {
  const { matches, loading } = useMatches('all');
  const [mobileTab, setMobileTab] = useState<KnockoutStage>('round_of_32');

  const knockout = useMemo(() => {
    const result = {} as Record<KnockoutStage, Match[]>;
    for (const stage of KNOCKOUT_STAGES) {
      result[stage] = matches
        .filter(m => m.stage === stage)
        .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
    }
    return result;
  }, [matches]);

  const activeStages = KNOCKOUT_STAGES.filter(s => knockout[s].length > 0);
  const hasKnockout = activeStages.length > 0;

  if (loading) {
    return (
      <div className="bolao-page">
        <div className="bolao-loading-screen" style={{ minHeight: 300, background: 'transparent' }}>
          <div className="bolao-spinner" />
        </div>
      </div>
    );
  }

  if (!hasKnockout) {
    return (
      <div className="bolao-page">
        <h1 className="bolao-page__title">🏆 Chaveamento</h1>
        <div className="bolao-empty">
          <span className="bolao-empty__icon" style={{ fontSize: '3rem' }}>🏆</span>
          <p className="bolao-empty__text">
            O chaveamento será exibido<br />após a fase de grupos.
          </p>
        </div>
      </div>
    );
  }

  /* Fallback: if mobileTab has no matches, pick first active */
  const currentMobileTab =
    knockout[mobileTab]?.length > 0 ? mobileTab : activeStages[0];

  return (
    <div className="bracket-page">
      <div className="bracket-page__header">
        <h1 className="bracket-page__title">🏆 Chaveamento</h1>
        <p className="bracket-page__hint">← deslize para ver todo o chaveamento →</p>
      </div>

      {/* ── Mobile: tab + list ── */}
      <div className="bk-mobile">
        <div className="bolao-tabs">
          {activeStages.map(stage => (
            <button
              key={stage}
              className={`bolao-tab${currentMobileTab === stage ? ' bolao-tab--active' : ''}`}
              onClick={() => setMobileTab(stage)}
            >
              {STAGE_LABELS[stage]}
            </button>
          ))}
        </div>
        <StageList matches={knockout[currentMobileTab]} />
      </div>

      {/* ── Desktop: horizontal bracket ── */}
      <div className="bk-desktop">
        <div className="bk-scroll">
          <div className="bk-grid">
            {activeStages.map((stage) => {
              const stageMatches = knockout[stage];
              const isFinalStage = stage === 'final';
              return (
                <div
                  key={stage}
                  className={`bk-col${isFinalStage ? ' bk-col--final' : ''}`}
                >
                  <div className="bk-col__header">{STAGE_LABELS[stage]}</div>
                  <div className="bk-col__body">
                    {stageMatches.map((match, idx) => (
                      <div key={match.id} className="bk-slot">
                        <BracketCard match={match} />
                        {/* connector bracket: pairs of two connect to next round */}
                        {!isFinalStage && idx % 2 === 0 && idx + 1 < stageMatches.length && (
                          <div className="bk-connector" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
