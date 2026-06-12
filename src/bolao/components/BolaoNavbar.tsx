import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './BolaoNavbar.css';

export function BolaoNavbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/bolao/login');
  };

  return (
    <>
      {/* Top bar (desktop) */}
      <header className="bolao-topbar">
        <div className="bolao-topbar__brand">
          <span className="bolao-topbar__ball">⚽</span>
          <span className="bolao-topbar__title">Bolão Copa 2026</span>
        </div>

        <nav className="bolao-topbar__nav">
          <NavLink to="/bolao" end className={({ isActive }) => `bolao-nav-link ${isActive ? 'bolao-nav-link--active' : ''}`}>
            Início
          </NavLink>
          <NavLink to="/bolao/games" className={({ isActive }) => `bolao-nav-link ${isActive ? 'bolao-nav-link--active' : ''}`}>
            Jogos
          </NavLink>
          <NavLink to="/bolao/bracket" className={({ isActive }) => `bolao-nav-link ${isActive ? 'bolao-nav-link--active' : ''}`}>
            Chave
          </NavLink>
          <NavLink to="/bolao/leaderboard" className={({ isActive }) => `bolao-nav-link ${isActive ? 'bolao-nav-link--active' : ''}`}>
            Ranking
          </NavLink>
          {profile?.role === 'admin' && (
            <NavLink to="/bolao/admin" className={({ isActive }) => `bolao-nav-link bolao-nav-link--admin ${isActive ? 'bolao-nav-link--active' : ''}`}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="bolao-topbar__user">
          <div className="bolao-avatar">{profile?.display_name?.[0]?.toUpperCase() ?? '?'}</div>
          <span className="bolao-topbar__username">{profile?.display_name}</span>
          <button className="bolao-signout-btn" onClick={handleSignOut} title="Sair">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Bottom tab bar (mobile) */}
      <nav className="bolao-bottomnav">
        <NavLink to="/bolao" end className={({ isActive }) => `bolao-tabnav-item ${isActive ? 'bolao-tabnav-item--active' : ''}`}>
          <span className="bolao-tabnav-icon">🏠</span>
          <span className="bolao-tabnav-label">Início</span>
        </NavLink>
        <NavLink to="/bolao/games" className={({ isActive }) => `bolao-tabnav-item ${isActive ? 'bolao-tabnav-item--active' : ''}`}>
          <span className="bolao-tabnav-icon">⚽</span>
          <span className="bolao-tabnav-label">Jogos</span>
        </NavLink>
        <NavLink to="/bolao/bracket" className={({ isActive }) => `bolao-tabnav-item ${isActive ? 'bolao-tabnav-item--active' : ''}`}>
          <span className="bolao-tabnav-icon">🎯</span>
          <span className="bolao-tabnav-label">Chave</span>
        </NavLink>
        <NavLink to="/bolao/leaderboard" className={({ isActive }) => `bolao-tabnav-item ${isActive ? 'bolao-tabnav-item--active' : ''}`}>
          <span className="bolao-tabnav-icon">🏆</span>
          <span className="bolao-tabnav-label">Ranking</span>
        </NavLink>
        {profile?.role === 'admin' && (
          <NavLink to="/bolao/admin" className={({ isActive }) => `bolao-tabnav-item ${isActive ? 'bolao-tabnav-item--active' : ''}`}>
            <span className="bolao-tabnav-icon">⚙️</span>
            <span className="bolao-tabnav-label">Admin</span>
          </NavLink>
        )}
        <button className="bolao-tabnav-item bolao-tabnav-item--signout" onClick={handleSignOut}>
          <LogOut size={20} className="bolao-tabnav-icon" />
          <span className="bolao-tabnav-label">Sair</span>
        </button>
      </nav>
    </>
  );
}
