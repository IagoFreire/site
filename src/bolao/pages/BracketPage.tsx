import { useMemo, useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import { STAGE_LABELS } from '../lib/scoring';
import { formatMatchDate, formatMatchTime } from '../lib/dates';
import type { Match } from '../types/bolao.types';
import styles from './BracketPage.module.css';

/* ──────────────────────────────────────────
   GROUP STANDINGS
────────────────────────────────────────── */

interface TeamRow {
  name: string;
  P: number; W: number; D: number; L: number;
  GF: number; GA: number; GD: number; Pts: number;
}

function calcStandings(groupMatches: Match[]): TeamRow[] {
  const map = new Map<string, TeamRow>();

  const get = (n: string): TeamRow => {
    if (!map.has(n))
      map.set(n, { name: n, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 });
    return map.get(n)!;
  };

  // Register all teams even if no results yet
  for (const m of groupMatches) { get(m.home_team); get(m.away_team); }

  for (const m of groupMatches) {
    if (m.status !== 'finished' || m.home_score === null || m.away_score === null) continue;
    const h = get(m.home_team);
    const a = get(m.away_team);
    h.P++; a.P++;
    h.GF += m.home_score; h.GA += m.away_score;
    a.GF += m.away_score; a.GA += m.home_score;
    h.GD = h.GF - h.GA;   a.GD = a.GF - a.GA;
    if (m.home_score > m.away_score)       { h.W++; h.Pts += 3; a.L++; }
    else if (m.away_score > m.home_score)  { a.W++; a.Pts += 3; h.L++; }
    else                                    { h.D++;  h.Pts++;   a.D++; a.Pts++; }
  }

  return [...map.values()].sort(
    (a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.name.localeCompare(b.name)
  );
}

function GroupTable({ groupName, groupMatches }: { groupName: string; groupMatches: Match[] }) {
  const rows = calcStandings(groupMatches);
  return (
    <div className={styles.groupCard}>
      <div className={styles.groupCardHeader}>Grupo {groupName}</div>
      <table className={styles.groupTable}>
        <thead>
          <tr>
            <th className={`${styles.gtTh} ${styles.gtThTeam}`}>Time</th>
            <th className={styles.gtTh}>P</th>
            <th className={styles.gtTh}>V</th>
            <th className={styles.gtTh}>E</th>
            <th className={styles.gtTh}>D</th>
            <th className={styles.gtTh}>SG</th>
            <th className={`${styles.gtTh} ${styles.gtThPts}`}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t, i) => (
            <tr
              key={t.name}
              className={`${styles.gtTr}${i < 2 ? ` ${styles.gtTrQualify}` : ''}${i === 2 ? ` ${styles.gtTrPossible}` : ''}`}
            >
              <td className={`${styles.gtTd} ${styles.gtTdTeam}`}>
                <span className={styles.gtPos}>{i + 1}</span>
                <span className={styles.gtName}>{t.name}</span>
              </td>
              <td className={styles.gtTd}>{t.P}</td>
              <td className={styles.gtTd}>{t.W}</td>
              <td className={styles.gtTd}>{t.D}</td>
              <td className={styles.gtTd}>{t.L}</td>
              <td className={styles.gtTd}>{t.GD > 0 ? '+' : ''}{t.GD}</td>
              <td className={`${styles.gtTd} ${styles.gtTdPts}`}>{t.Pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupsView({ groups }: { groups: Map<string, Match[]> }) {
  if (groups.size === 0) {
    return (
      <div className="bolao-empty">
        <span className="bolao-empty__icon">⚽</span>
        <p className="bolao-empty__text">
          Nenhum jogo da fase de grupos cadastrado ainda.<br />
          Insira os jogos pelo painel Admin.
        </p>
      </div>
    );
  }
  return (
    <div className={styles.groupsGrid}>
      {[...groups.entries()].map(([g, ms]) => (
        <GroupTable key={g} groupName={g} groupMatches={ms} />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   KNOCKOUT BRACKET
────────────────────────────────────────── */

const KNOCKOUT_STAGES = [
  'round_of_32', 'round_of_16', 'quarter', 'semi', 'third_place', 'final',
] as const;
type KnockoutStage = typeof KNOCKOUT_STAGES[number];

function BracketCard({ match }: { match: Match }) {
  const finished = match.status === 'finished';
  const live = match.status === 'live';
  const homeWon = finished && match.home_score !== null && match.away_score !== null && match.home_score > match.away_score;
  const awayWon = finished && match.home_score !== null && match.away_score !== null && match.away_score > match.home_score;

  return (
    <div className={`${styles.bkCard}${live ? ` ${styles.bkCardLive}` : ''}`}>
      <div className={`${styles.bkCardTeam}${homeWon ? ` ${styles.bkCardTeamWinner}` : ''}${awayWon ? ` ${styles.bkCardTeamLoser}` : ''}`}>
        <span className={styles.bkCardName}>{match.home_team}</span>
        <span className={styles.bkCardScore}>{match.home_score ?? '–'}</span>
      </div>
      <div className={`${styles.bkCardTeam}${awayWon ? ` ${styles.bkCardTeamWinner}` : ''}${homeWon ? ` ${styles.bkCardTeamLoser}` : ''}`}>
        <span className={styles.bkCardName}>{match.away_team}</span>
        <span className={styles.bkCardScore}>{match.away_score ?? '–'}</span>
      </div>
      <div className={styles.bkCardFooter}>
        {live
          ? <span className={styles.bkCardLiveBadge}>● AO VIVO</span>
          : <span className={styles.bkCardDate}>{formatMatchDate(match.match_date)} · {formatMatchTime(match.match_date)}</span>
        }
      </div>
    </div>
  );
}

function BracketView({
  knockout,
  activeStages,
}: {
  knockout: Record<KnockoutStage, Match[]>;
  activeStages: KnockoutStage[];
}) {
  const [mobileStage, setMobileStage] = useState<KnockoutStage>(activeStages[0]);
  const tab = knockout[mobileStage]?.length > 0 ? mobileStage : activeStages[0];

  if (activeStages.length === 0) {
    return (
      <div className="bolao-empty">
        <span className="bolao-empty__icon">🏆</span>
        <p className="bolao-empty__text">O chaveamento será exibido após a fase de grupos.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: tab per stage */}
      <div className={styles.bkMobile}>
        <div className="bolao-tabs">
          {activeStages.map(s => (
            <button
              key={s}
              className={`bolao-tab${tab === s ? ' bolao-tab--active' : ''}`}
              onClick={() => setMobileStage(s)}
            >
              {STAGE_LABELS[s]}
            </button>
          ))}
        </div>
        <div className={styles.bkList}>
          {knockout[tab].map(m => <BracketCard key={m.id} match={m} />)}
        </div>
      </div>

      {/* Desktop: horizontal bracket */}
      <div className={styles.bkDesktop}>
        <p className={styles.pageHint}>← deslize para ver todo o chaveamento →</p>
        <div className={styles.bkScroll}>
          <div className={styles.bkGrid}>
            {activeStages.map((stage) => (
              <div key={stage} className={`${styles.bkCol}${stage === 'final' ? ` ${styles.bkColFinal}` : ''}`}>
                <div className={styles.bkColHeader}>{STAGE_LABELS[stage]}</div>
                <div className={styles.bkColBody}>
                  {knockout[stage].map((match, idx) => (
                    <div key={match.id} className={styles.bkSlot}>
                      <BracketCard match={match} />
                      {stage !== 'final' && idx % 2 === 0 && idx + 1 < knockout[stage].length && (
                        <div className={styles.bkConnector} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────── */

type PageTab = 'groups' | 'bracket';

export function BracketPage() {
  const { matches, loading } = useMatches('all');
  const [pageTab, setPageTab] = useState<PageTab>('groups');

  const groups = useMemo(() => {
    const byGroup = new Map<string, Match[]>();
    for (const m of matches.filter(m => m.stage === 'group')) {
      const g = m.group_name ?? '?';
      const arr = byGroup.get(g) ?? [];
      arr.push(m);
      byGroup.set(g, arr);
    }
    return new Map([...byGroup.entries()].sort());
  }, [matches]);

  const knockout = useMemo(() => {
    const r = {} as Record<KnockoutStage, Match[]>;
    for (const stage of KNOCKOUT_STAGES) {
      r[stage] = matches
        .filter(m => m.stage === stage)
        .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
    }
    return r;
  }, [matches]);

  const activeKnockout = KNOCKOUT_STAGES.filter(s => knockout[s].length > 0);
  const hasKnockout = activeKnockout.length > 0;

  if (loading) {
    return (
      <div className="bolao-page">
        <div className="bolao-loading-screen" style={{ minHeight: 300, background: 'transparent' }}>
          <div className="bolao-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Copa 2026</h1>
      </div>

      {/* Main tabs */}
      <div className="bolao-tabs" style={{ marginBottom: 20 }}>
        <button
          className={`bolao-tab${pageTab === 'groups' ? ' bolao-tab--active' : ''}`}
          onClick={() => setPageTab('groups')}
        >
          📊 Grupos
        </button>
        <button
          className={`bolao-tab${pageTab === 'bracket' ? ' bolao-tab--active' : ''}${!hasKnockout ? ' bolao-tab--disabled' : ''}`}
          onClick={() => hasKnockout && setPageTab('bracket')}
          disabled={!hasKnockout}
          title={!hasKnockout ? 'Disponível após a fase de grupos' : undefined}
        >
          🏆 Chave
        </button>
      </div>

      {pageTab === 'groups' && <GroupsView groups={groups} />}
      {pageTab === 'bracket' && (
        <BracketView knockout={knockout} activeStages={activeKnockout} />
      )}
    </div>
  );
}
