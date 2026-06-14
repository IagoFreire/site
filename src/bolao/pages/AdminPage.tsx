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
import './AdminPage.css';

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
        <div className="admin-tab-content">
          <div className="admin-tab-header">
            <p className="admin-tab-count">{matches.length} jogos cadastrados </p>
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
            <div className="admin-table-wrap">
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
                      <td className="admin-td-muted">{STAGE_LABELS[m.stage]}{m.group_name ? ` G${m.group_name}` : ''}</td>
                      <td className="admin-td-muted">{formatMatchDateTime(m.match_date)}</td>
                      <td><span className={`admin-status admin-status--${m.status}`}>{m.status}</span></td>
                      <td className="admin-td-muted">
                        {m.home_score !== null ? `${m.home_score}–${m.away_score}` : '–'}
                      </td>
                      <td>
                        <div className="admin-row-actions">
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
        <div className="admin-tab-content">
          <p className="admin-tab-count">
            {pendingResult.length} jogo(s) passados sem resultado registrado
          </p>

          {pendingResult.length === 0 && unresolved.length === 0 ? (
            <div className="bolao-empty">
              <span className="bolao-empty__icon">✅</span>
              <p className="bolao-empty__text">Todos os jogos têm resultado registrado.</p>
            </div>
          ) : (
            <div className="admin-result-list">
              {pendingResult.map(m => (
                <div key={m.id} className="admin-result-item">
                  <div className="admin-result-item__match">
                    <strong>{m.home_team}</strong> × {m.away_team}
                    <span className="admin-td-muted" style={{ marginLeft: 8 }}>
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
                <div key={m.id} className="admin-result-item">
                  <div className="admin-result-item__match">
                    <strong>{m.home_team}</strong> × {m.away_team}
                    <span className="admin-status admin-status--finished" style={{ marginLeft: 8 }}>finished</span>
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
        <div className="admin-tab-content">
          <p className="admin-tab-count">{entries.length} usuários cadastrados</p>
          {usersLoading ? (
            <div className="bolao-loading-screen" style={{ minHeight: 160, background: 'transparent' }}>
              <div className="bolao-spinner" />
            </div>
          ) : (
            <div className="admin-table-wrap">
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
                      <td className="admin-td-muted">#{u.rank}</td>
                      <td><strong>{u.display_name}</strong></td>
                      <td className="admin-td-muted admin-td-truncate" title={`@${u.username}`}>@{u.username}</td>
                      <td><strong style={{ color: 'var(--wc-gold)' }}>{u.total_points}</strong></td>
                      <td className="admin-td-muted">{u.streak} 🔥</td>
                      <td>
                        <span className={`admin-role-badge ${u.role === 'admin' ? 'admin-role-badge--admin' : ''}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
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
        <div className="admin-temp-pw-overlay" onClick={() => setTempPasswordInfo(null)}>
          <div className="admin-temp-pw-box" onClick={e => e.stopPropagation()}>
            <h3>Senha temporária</h3>
            <p>Compartilhe com <strong>{tempPasswordInfo.name}</strong>:</p>
            <div className="admin-temp-pw-value">{tempPasswordInfo.password}</div>
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
