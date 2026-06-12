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
    const prev = metaTheme?.getAttribute('content') ?? null;
    metaTheme?.setAttribute('content', '#051a0b');

    return () => {
      document.body.classList.remove('bolao-body');
      if (metaTheme) metaTheme.setAttribute('content', prev ?? '#0f172a');
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
