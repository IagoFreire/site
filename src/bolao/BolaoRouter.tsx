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

    // theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const prevTheme = metaTheme?.getAttribute('content') ?? null;
    metaTheme?.setAttribute('content', '#051a0b');

    // page title
    const prevTitle = document.title;
    document.title = 'Bolão Copa 2026 🇧🇷';

    // favicon (aba do browser)
    const favicon = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
    const prevFavicon = favicon?.href ?? null;
    const emojiSvg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>`;
    if (favicon) favicon.href = emojiSvg;

    // apple-touch-icon (ícone da tela inicial iOS) — gerado via canvas como PNG
    let touchIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    const prevTouchHref = touchIcon?.href ?? null;
    if (!touchIcon) {
      touchIcon = document.createElement('link');
      touchIcon.rel = 'apple-touch-icon';
      document.head.appendChild(touchIcon);
    }
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 180;
    const ctx = canvas.getContext('2d')!;
    // fundo verde escuro
    const grad = ctx.createLinearGradient(0, 0, 180, 180);
    grad.addColorStop(0, '#0f3320');
    grad.addColorStop(1, '#051a0b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 180, 180);
    // bola de futebol (emoji renderiza com fonte nativa do iOS)
    ctx.font = '96px Apple Color Emoji, Segoe UI Emoji, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('⚽', 90, 108);
    // "BOLÃO"
    ctx.font = '900 26px -apple-system, Arial, sans-serif';
    ctx.fillStyle = '#FFDF00';
    ctx.fillText('BOLÃO', 90, 148);
    // "COPA 2026"
    ctx.font = '600 15px -apple-system, Arial, sans-serif';
    ctx.fillStyle = '#5d8a6e';
    ctx.fillText('COPA 2026', 90, 168);
    touchIcon.href = canvas.toDataURL('image/png');

    // apple-mobile-web-app-title (texto embaixo do ícone no iOS)
    let appTitle = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]');
    const prevAppTitle = appTitle?.getAttribute('content') ?? null;
    if (!appTitle) {
      appTitle = document.createElement('meta');
      appTitle.name = 'apple-mobile-web-app-title';
      document.head.appendChild(appTitle);
    }
    appTitle.setAttribute('content', 'Bolão 2026');

    return () => {
      document.body.classList.remove('bolao-body');
      if (metaTheme) metaTheme.setAttribute('content', prevTheme ?? '#0f172a');
      document.title = prevTitle;
      if (favicon && prevFavicon) favicon.href = prevFavicon;
      if (touchIcon) {
        if (prevTouchHref) touchIcon.href = prevTouchHref;
        else touchIcon.remove();
      }
      if (appTitle) {
        if (prevAppTitle) appTitle.setAttribute('content', prevAppTitle);
        else appTitle.remove();
      }
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
