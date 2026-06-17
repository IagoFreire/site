import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './BolaoNavbar.module.css';

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
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <span className={styles.topbarBall}>⚽</span>
          <span className={styles.topbarTitle}>Bolão Copa 2026</span>
        </div>

        <nav className={styles.topbarNav}>
          <NavLink to="/bolao" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            Início
          </NavLink>
          <NavLink to="/bolao/games" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            Jogos
          </NavLink>
          <NavLink to="/bolao/bracket" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            Chave
          </NavLink>
          <NavLink to="/bolao/leaderboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            Ranking
          </NavLink>
          {profile?.role === 'admin' && (
            <NavLink to="/bolao/admin" className={({ isActive }) => `${styles.navLink} ${styles.navLinkAdmin} ${isActive ? styles.navLinkActive : ''}`}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className={styles.topbarUser}>
          <div className={styles.avatar}>{profile?.display_name?.[0]?.toUpperCase() ?? '?'}</div>
          <span className={styles.topbarUsername}>{profile?.display_name}</span>
          <button className={styles.signoutBtn} onClick={handleSignOut} title="Sair">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Bottom tab bar (mobile) */}
      <nav className={styles.bottomnav}>
        <NavLink to="/bolao" end className={({ isActive }) => `${styles.tabnavItem} ${isActive ? styles.tabnavItemActive : ''}`}>
          <span className={styles.tabnavIcon}>🏠</span>
          <span className={styles.tabnavLabel}>Início</span>
        </NavLink>
        <NavLink to="/bolao/games" className={({ isActive }) => `${styles.tabnavItem} ${isActive ? styles.tabnavItemActive : ''}`}>
          <span className={styles.tabnavIcon}>⚽</span>
          <span className={styles.tabnavLabel}>Jogos</span>
        </NavLink>
        <NavLink to="/bolao/bracket" className={({ isActive }) => `${styles.tabnavItem} ${isActive ? styles.tabnavItemActive : ''}`}>
          <span className={styles.tabnavIcon}>🎯</span>
          <span className={styles.tabnavLabel}>Chave</span>
        </NavLink>
        <NavLink to="/bolao/leaderboard" className={({ isActive }) => `${styles.tabnavItem} ${isActive ? styles.tabnavItemActive : ''}`}>
          <span className={styles.tabnavIcon}>🏆</span>
          <span className={styles.tabnavLabel}>Ranking</span>
        </NavLink>
        {profile?.role === 'admin' && (
          <NavLink to="/bolao/admin" className={({ isActive }) => `${styles.tabnavItem} ${isActive ? styles.tabnavItemActive : ''}`}>
            <span className={styles.tabnavIcon}>⚙️</span>
            <span className={styles.tabnavLabel}>Admin</span>
          </NavLink>
        )}
        <button className={`${styles.tabnavItem} ${styles.tabnavItemSignout}`} onClick={handleSignOut}>
          <LogOut size={20} className={styles.tabnavIcon} />
          <span className={styles.tabnavLabel}>Sair</span>
        </button>
      </nav>
    </>
  );
}
