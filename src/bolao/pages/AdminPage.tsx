import { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../context/AuthContext';
import { AdminMatchForm } from '../components/AdminMatchForm/AdminMatchForm';
import { AdminResultForm } from '../components/AdminResultForm/AdminResultForm';
import { supabase } from '../lib/supabase';
import { formatMatchDateTime } from '../lib/dates';
import { STAGE_LABELS } from '../lib/scoring';
import type { Match } from '../types/bolao.types';
import styles from './AdminPage.module.css';

type Tab = 'matches' | 'results' | 'users';

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('matches');
  const { profile } = useAuth();
  const { matches, loading: matchesLoading, refetch: refetchMatches } = useMatches('all');
  const { entries, loading: usersLoading, refetch: refetchLeaderboard } = useLeaderboard();

  const [editMatch, setEditMatch] = useState<Match | null | undefined>(undefined);
  const [resultMatch, setResultMatch] = useState<Match | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [tempPasswordInfo, setTempPasswordInfo] = useState<{ name: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const pendingResult = matches.filter(m => m.status !== 'finished' && new Date(m.match_date) < new Date());
  const unresolved = matches.filter(m => m.status === 'finished' && m.home_score === null);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este jogo?')) return;
    setDeleteId(id);
    await supabase.from('matches').delete().eq('id', id);
    setDeleteId(null);
    refetchMatches();
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    refetchLeaderboard();
  };

  const handleDeleteUser = async (userId: string, displayName: string) => {
    if (userId === profile?.id) { alert('Você não pode excluir sua própria conta.'); return; }
    if (!confirm(`Excluir "${displayName}" permanentemente?\nTodas as apostas serão removidas.`)) return;
    setDeletingUserId(userId);
    const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId });
    setDeletingUserId(null);
    if (error) { alert('Erro ao excluir: ' + error.message); return; }
    refetchLeaderboard();
  };

  const handleResetPassword = async (userId: string, displayName: string) => {
    if (!confirm(`Resetar senha de "${displayName}" para uma senha temporária?`)) return;
    const tempPassword = 'Bolao' + Math.floor(1000 + Math.random() * 9000);
    setResettingUserId(userId);
    const { error } = await supabase.rpc('admin_reset_user_password', {
      target_user_id: userId,
      new_password: tempPassword,
    });
    setResettingUserId(null);
    if (error) { alert('Erro ao resetar senha: ' + error.message); return; }
    setCopied(false);
    setTempPasswordInfo({ name: displayName, password: tempPassword });
  };

  const handleCopyPassword = () => {
    if (!tempPasswordInfo) return;
    navigator.clipboard.writeText(tempPasswordInfo.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bolao-page bolao-page--wide">
      <h1 className="bolao-page__title">⚙️ Painel Admin</h1>

      <div className="bolao-tabs">
        {([
          ['matches', '⚽ Jogos'],
          ['results', '📋 Resultados'],
          ['users',   '👥 Usuários'],
        ] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            className={`bolao-tab ${tab === t ? 'bolao-tab--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Jogos ── */}
      {tab === 'matches' && (
        <div className={styles.tabContent}>
          <div className={styles.tabHeader}>
            <p className={styles.tabCount}>{matches.length} jogos cadastrados </p>
            <button className="bolao-btn bolao-btn--primary bolao-btn--sm" onClick={() => setEditMatch(null)}>
              + Novo Jogo
            </button>
          </div>

          {matchesLoading ? (
            <div className="bolao-loading-screen" style={{ minHeight: 160, background: 'transparent' }}>
              <div className="bolao-spinner" />
            </div>
          ) : matches.length === 0 ? (
            <div className="bolao-empty">
              <span className="bolao-empty__icon">⚽</span>
              <p className="bolao-empty__text">Nenhum jogo cadastrado ainda.<br />Clique em "+ Novo Jogo" para começar.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className="bolao-admin-table">
                <thead>
                  <tr>
                    <th>Jogo</th>
                    <th>Fase</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Placar</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map(m => (
                    <tr key={m.id}>
                      <td><strong>{m.home_team}</strong> × {m.away_team}</td>
                      <td className={styles.tdMuted}>{STAGE_LABELS[m.stage]}{m.group_name ? ` G${m.group_name}` : ''}</td>
                      <td className={styles.tdMuted}>{formatMatchDateTime(m.match_date)}</td>
                      <td><span className={`${styles.status} ${styles[`status${m.status.charAt(0).toUpperCase() + m.status.slice(1)}` as keyof typeof styles]}`}>{m.status}</span></td>
                      <td className={styles.tdMuted}>
                        {m.home_score !== null ? `${m.home_score}–${m.away_score}` : '–'}
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <button className="bolao-btn bolao-btn--ghost bolao-btn--sm" onClick={() => setEditMatch(m)}>
                            Editar
                          </button>
                          <button
                            className="bolao-btn bolao-btn--danger bolao-btn--sm"
                            onClick={() => handleDelete(m.id)}
                            disabled={deleteId === m.id}
                          >
                            {deleteId === m.id ? '...' : 'Excluir'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Resultados ── */}
      {tab === 'results' && (
        <div className={styles.tabContent}>
          <p className={styles.tabCount}>
            {pendingResult.length} jogo(s) passados sem resultado registrado
          </p>

          {pendingResult.length === 0 && unresolved.length === 0 ? (
            <div className="bolao-empty">
              <span className="bolao-empty__icon">✅</span>
              <p className="bolao-empty__text">Todos os jogos têm resultado registrado.</p>
            </div>
          ) : (
            <div className={styles.resultList}>
              {pendingResult.map(m => (
                <div key={m.id} className={styles.resultItem}>
                  <div className={styles.resultItemMatch}>
                    <strong>{m.home_team}</strong> × {m.away_team}
                    <span className={styles.tdMuted} style={{ marginLeft: 8 }}>
                      {formatMatchDateTime(m.match_date)}
                    </span>
                  </div>
                  <button
                    className="bolao-btn bolao-btn--primary bolao-btn--sm"
                    onClick={() => setResultMatch(m)}
                  >
                    Registrar Resultado
                  </button>
                </div>
              ))}

              {unresolved.map(m => (
                <div key={m.id} className={styles.resultItem}>
                  <div className={styles.resultItemMatch}>
                    <strong>{m.home_team}</strong> × {m.away_team}
                    <span className={`${styles.status} ${styles.statusFinished}`} style={{ marginLeft: 8 }}>finished</span>
                  </div>
                  <button className="bolao-btn bolao-btn--ghost bolao-btn--sm" onClick={() => setResultMatch(m)}>
                    Atualizar Resultado
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Usuários ── */}
      {tab === 'users' && (
        <div className={styles.tabContent}>
          <p className={styles.tabCount}>{entries.length} usuários cadastrados</p>
          {usersLoading ? (
            <div className="bolao-loading-screen" style={{ minHeight: 160, background: 'transparent' }}>
              <div className="bolao-spinner" />
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className="bolao-admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Usuário</th>
                    <th>Pontos</th>
                    <th>Streak</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(u => (
                    <tr key={u.id}>
                      <td className={styles.tdMuted}>#{u.rank}</td>
                      <td><strong>{u.display_name}</strong></td>
                      <td className={`${styles.tdMuted} ${styles.tdTruncate}`} title={`@${u.username}`}>@{u.username}</td>
                      <td><strong style={{ color: 'var(--wc-gold)' }}>{u.total_points}</strong></td>
                      <td className={styles.tdMuted}>{u.streak} 🔥</td>
                      <td>
                        <span className={`${styles.roleBadge} ${u.role === 'admin' ? styles.roleBadgeAdmin : ''}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <button
                            className="bolao-btn bolao-btn--ghost bolao-btn--sm"
                            onClick={() => handleRoleToggle(u.id, u.role)}
                            disabled={u.id === profile?.id}
                          >
                            {u.role === 'admin' ? '→ user' : '→ admin'}
                          </button>
                          <button
                            className="bolao-btn bolao-btn--ghost bolao-btn--sm"
                            onClick={() => handleResetPassword(u.id, u.display_name)}
                            disabled={resettingUserId === u.id || u.id === profile?.id}
                          >
                            {resettingUserId === u.id ? '...' : '🔑 Senha'}
                          </button>
                          <button
                            className="bolao-btn bolao-btn--danger bolao-btn--sm"
                            onClick={() => handleDeleteUser(u.id, u.display_name)}
                            disabled={deletingUserId === u.id || u.id === profile?.id}
                          >
                            {deletingUserId === u.id ? '...' : 'Excluir'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {editMatch !== undefined && (
        <AdminMatchForm
          match={editMatch}
          onSave={() => { setEditMatch(undefined); refetchMatches(); }}
          onCancel={() => setEditMatch(undefined)}
        />
      )}

      {resultMatch && (
        <AdminResultForm
          match={resultMatch}
          onSave={() => { setResultMatch(null); refetchMatches(); refetchLeaderboard(); }}
          onCancel={() => setResultMatch(null)}
        />
      )}

      {/* Modal senha temporária */}
      {tempPasswordInfo && (
        <div className={styles.tempPwOverlay} onClick={() => setTempPasswordInfo(null)}>
          <div className={styles.tempPwBox} onClick={e => e.stopPropagation()}>
            <h3>Senha temporária</h3>
            <p>Compartilhe com <strong>{tempPasswordInfo.name}</strong>:</p>
            <div className={styles.tempPwValue}>{tempPasswordInfo.password}</div>
            <button className="bolao-btn bolao-btn--primary" onClick={handleCopyPassword}>
              {copied ? '✓ Copiado!' : 'Copiar senha'}
            </button>
            <button className="bolao-btn bolao-btn--ghost" onClick={() => setTempPasswordInfo(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
