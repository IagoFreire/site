import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';
import { BolaoNavbar } from './components/BolaoNavbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { GamesPage } from './pages/GamesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { BracketPage } from './pages/BracketPage';
import { AdminPage } from './pages/AdminPage';
import './BolaoGlobal.css';

function BolaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BolaoNavbar />
      {children}
    </>
  );
}

export function BolaoRouter() {
  useEffect(() => {
    document.body.classList.add('bolao-body');

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const prevTheme = metaTheme?.getAttribute('content') ?? null;
    metaTheme?.setAttribute('content', '#051a0b');

    const prevTitle = document.title;
    document.title = 'Bolão Copa 2026 🇧🇷';

    const favicon = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
    const prevFavicon = favicon?.href ?? null;
    const emojiSvg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>`;
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
                <BolaoLayout>
                  <DashboardPage />
                </BolaoLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="games"
            element={
              <PrivateRoute>
                <BolaoLayout>
                  <GamesPage />
                </BolaoLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="leaderboard"
            element={
              <PrivateRoute>
                <BolaoLayout>
                  <LeaderboardPage />
                </BolaoLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="bracket"
            element={
              <PrivateRoute>
                <BolaoLayout>
                  <BracketPage />
                </BolaoLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="admin"
            element={
              <AdminRoute>
                <BolaoLayout>
                  <AdminPage />
                </BolaoLayout>
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/bolao" replace />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
