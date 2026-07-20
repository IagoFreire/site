import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../bolao/context/AuthContext';
import styles from './BolaoBrasileiroNavbar.module.css';

export function BolaoBrasileiroNavbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/bolao-brasileiro/login');
  };

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <span className={styles.topbarBall}>🏆</span>
          <span className={styles.topbarTitle}>Bolão Brasileirão 2026</span>
        </div>

        <nav className={styles.topbarNav}>
          <NavLink to="/bolao-brasileiro" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            Início
          </NavLink>
          <NavLink to="/bolao-brasileiro/games" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            Jogos
          </NavLink>
          <NavLink to="/bolao-brasileiro/leaderboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            Ranking
          </NavLink>
          {profile?.role === 'admin' && (
            <NavLink to="/bolao-brasileiro/admin" className={({ isActive }) => `${styles.navLink} ${styles.navLinkAdmin} ${isActive ? styles.navLinkActive : ''}`}>
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

      <nav className={styles.bottomnav}>
        <NavLink to="/bolao-brasileiro" end className={({ isActive }) => `${styles.tabnavItem} ${isActive ? styles.tabnavItemActive : ''}`}>
          <span className={styles.tabnavIcon}>🏠</span>
          <span className={styles.tabnavLabel}>Início</span>
        </NavLink>
        <NavLink to="/bolao-brasileiro/games" className={({ isActive }) => `${styles.tabnavItem} ${isActive ? styles.tabnavItemActive : ''}`}>
          <span className={styles.tabnavIcon}>⚽</span>
          <span className={styles.tabnavLabel}>Jogos</span>
        </NavLink>
        <NavLink to="/bolao-brasileiro/leaderboard" className={({ isActive }) => `${styles.tabnavItem} ${isActive ? styles.tabnavItemActive : ''}`}>
          <span className={styles.tabnavIcon}>🏆</span>
          <span className={styles.tabnavLabel}>Ranking</span>
        </NavLink>
        {profile?.role === 'admin' && (
          <NavLink to="/bolao-brasileiro/admin" className={({ isActive }) => `${styles.tabnavItem} ${isActive ? styles.tabnavItemActive : ''}`}>
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
