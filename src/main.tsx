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
if (window.location.pathname.startsWith('/bolao-brasileiro')) {
  document
    .querySelector<HTMLLinkElement>('link[rel="manifest"]')
    ?.setAttribute('href', '/manifest-brasileirao.webmanifest');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
