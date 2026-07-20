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

    // theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const prevTheme = metaTheme?.getAttribute('content') ?? null;
    metaTheme?.setAttribute('content', '#051a0b');

    // page title
    const prevTitle = document.title;
    document.title = 'Bolão Brasileirão 2026 🏆';

    // favicon (aba do browser)
    const favicon = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
    const prevFavicon = favicon?.href ?? null;
    const emojiSvg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏆</text></svg>`;
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
    const S = 360; // 2× para retina
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d')!;

    // Fundo verde escuro
    const bgGrad = ctx.createLinearGradient(0, 0, S, S);
    bgGrad.addColorStop(0, '#0f3320');
    bgGrad.addColorStop(1, '#051a0b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, S, S);

    // --- Troféu desenhado com canvas shapes ---
    const cx = S / 2;
    const cupTop = 68;
    const cupBottom = 150;
    const cupHalfWidth = 78;

    const cupGrad = ctx.createLinearGradient(cx - cupHalfWidth, cupTop, cx + cupHalfWidth, cupBottom);
    cupGrad.addColorStop(0, '#FFDF00');
    cupGrad.addColorStop(1, '#C9960C');

    // Alças — desenhadas ANTES da taça: a metade interna do anel fica
    // coberta pelo preenchimento da taça, deixando só o "C" externo
    // encostado na lateral, sem precisar acertar ângulos de arco na mão.
    ctx.strokeStyle = '#FFDF00';
    ctx.lineWidth = 12;
    const handleR = 30;
    const handleY = cupTop + 36;
    ctx.beginPath();
    ctx.arc(cx - cupHalfWidth, handleY, handleR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + cupHalfWidth, handleY, handleR, 0, Math.PI * 2);
    ctx.stroke();

    // Taça (por cima das alças)
    ctx.beginPath();
    ctx.moveTo(cx - cupHalfWidth, cupTop);
    ctx.quadraticCurveTo(cx - cupHalfWidth - 14, cupTop + 60, cx - 26, cupBottom);
    ctx.lineTo(cx + 26, cupBottom);
    ctx.quadraticCurveTo(cx + cupHalfWidth + 14, cupTop + 60, cx + cupHalfWidth, cupTop);
    ctx.closePath();
    ctx.fillStyle = cupGrad;
    ctx.fill();

    // Haste
    ctx.fillStyle = '#FFDF00';
    ctx.fillRect(cx - 9, cupBottom, 18, 28);

    // Base
    ctx.beginPath();
    ctx.moveTo(cx - 46, cupBottom + 28);
    ctx.lineTo(cx + 46, cupBottom + 28);
    ctx.lineTo(cx + 34, cupBottom + 50);
    ctx.lineTo(cx - 34, cupBottom + 50);
    ctx.closePath();
    ctx.fillStyle = '#C9960C';
    ctx.fill();

    // "BOLÃO"
    ctx.font = '900 58px -apple-system, Arial Black, sans-serif';
    ctx.fillStyle = '#FFDF00';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('BOLÃO', S / 2, 310);

    // "RETURNO 2026"
    ctx.font = '600 26px -apple-system, Arial, sans-serif';
    ctx.fillStyle = '#5d8a6e';
    ctx.fillText('RETURNO 2026', S / 2, 348);

    touchIcon.href = canvas.toDataURL('image/png');

    // apple-mobile-web-app-title (texto embaixo do ícone no iOS)
    let appTitle = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]');
    const prevAppTitle = appTitle?.getAttribute('content') ?? null;
    if (!appTitle) {
      appTitle = document.createElement('meta');
      appTitle.name = 'apple-mobile-web-app-title';
      document.head.appendChild(appTitle);
    }
    appTitle.setAttribute('content', 'Bolão Brasileirão');

    // manifest (instalação Android/Chrome) — start_url próprio, não o /bolao global
    const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    const prevManifestHref = manifestLink?.getAttribute('href') ?? null;
    manifestLink?.setAttribute('href', '/manifest-brasileirao.webmanifest');

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
      if (manifestLink && prevManifestHref) manifestLink.setAttribute('href', prevManifestHref);
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
