import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

// Troca o manifest PWA (usado pelo Android/Chrome para "instalar app") o mais
// cedo possível, antes do React montar — o manifest padrão gerado pelo
// vite-plugin-pwa (vite.config.ts) aponta pra /bolao. Sem isso, o navegador
// pode avaliar a instalabilidade da página com o manifest errado antes que o
// useEffect do BolaoBrasileiroRouter tivesse chance de trocar.
//
// Casos client-side (navegação dentro do app, sem reload): cai aqui.
// Caso "entry point" (atalho instalado / Add to Home Screen): abre direto em
// bolao-brasileiro.html, que já vem com o manifest certo desde o HTML puro
// (iOS Safari não confia em trocas de manifest via JS — só o Chrome faz isso
// direito). Nesse caso normalizamos a URL pra /bolao-brasileiro logo abaixo,
// pra o React Router já montar no path limpo.
if (window.location.pathname.startsWith('/bolao-brasileiro')) {
  document
    .querySelector<HTMLLinkElement>('link[rel="manifest"]')
    ?.setAttribute('href', '/manifest-brasileirao.webmanifest');
}

if (window.location.pathname === '/bolao-brasileiro.html') {
  window.history.replaceState(null, '', '/bolao-brasileiro' + window.location.search);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
