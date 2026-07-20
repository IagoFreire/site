import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../bolao/context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';
import { BolaoBrasileiroNavbar } from './components/BolaoBrasileiroNavbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { GamesPage } from './pages/GamesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AdminPage } from './pages/AdminPage';
import '../bolao/BolaoGlobal.css';

function BolaoBrasileiroLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BolaoBrasileiroNavbar />
      {children}
    </>
  );
}

export function BolaoBrasileiroRouter() {
  useEffect(() => {
    document.body.classList.add('bolao-body');

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const prevTheme = metaTheme?.getAttribute('content') ?? null;
    metaTheme?.setAttribute('content', '#051a0b');

    const prevTitle = document.title;
    document.title = 'Bolão Brasileirão 2026 🏆';

    const favicon = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
    const prevFavicon = favicon?.href ?? null;
    const emojiSvg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏆</text></svg>`;
    if (favicon) favicon.href = emojiSvg;

    return () => {
      document.body.classList.remove('bolao-body');
      if (metaTheme) metaTheme.setAttribute('content', prevTheme ?? '#0f172a');
      document.title = prevTitle;
      if (favicon && prevFavicon) favicon.href = prevFavicon;
    };
  }, []);

  return (
    <div className="bolao-app">
      <AuthProvider>
        <Routes>
          <Route path="login" element={<LoginPage />} />

          <Route
            path=""
            element={
              <PrivateRoute>
                <BolaoBrasileiroLayout>
                  <DashboardPage />
                </BolaoBrasileiroLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="games"
            element={
              <PrivateRoute>
                <BolaoBrasileiroLayout>
                  <GamesPage />
                </BolaoBrasileiroLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="leaderboard"
            element={
              <PrivateRoute>
                <BolaoBrasileiroLayout>
                  <LeaderboardPage />
                </BolaoBrasileiroLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="admin"
            element={
              <AdminRoute>
                <BolaoBrasileiroLayout>
                  <AdminPage />
                </BolaoBrasileiroLayout>
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/bolao-brasileiro" replace />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
