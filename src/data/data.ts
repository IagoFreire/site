import type { Experience, Skill, Project } from '../types';

export const experiences: Experience[] = [
  {
    company: 'Compass UOL',
    role: 'Frontend Developer',
    period: 'Agosto 2023 - Presente',
    description: 'Desenvolvi uma plataforma de recrutamento com LLMs para ranqueamento automatizado de candidatos e um player de áudio para monitoramento. Atuei no frontend de painéis administrativos, liderando decisões técnicas de arquitetura e novas features. Como Fullstack, sustentei um produto de gerenciamento de contratos de investimentos milionários e corrigi bugs críticos.',
    highlight: true
  },
  {
    company: 'Cointimes',
    role: 'Frontend Developer',
    period: 'Maio 2022 - Agosto 2023',
    description: 'Implementei a interface web completa da plataforma principal usando ReactJS e Next.js com foco em SEO. Integrei ao backend via GraphQL e REST. Liderei e fiz code review da equipe frontend, participei das decisões técnicas para o app mobile e contribuí com implementações em Flutter e extensão de navegador em TypeScript.',
    highlight: false
  },
  {
    company: 'Conexpay',
    role: 'Frontend Developer',
    period: 'Novembro 2019 - Novembro 2022',
    description: 'Responsável pelo desenvolvimento front-end das principais aplicações web e mobile. Criei o aplicativo principal em React Native do zero, conduzindo todo o processo — coleta de requisitos, implementação em ReactJS e React Native, deployment na AWS e publicação nas lojas de aplicativos.',
    highlight: false
  }
];

export const skills: Skill[] = [
  { name: 'React.js', level: 95, icon: '⚛️' },
  { name: 'React Native', level: 90, icon: '📱' },
  { name: 'TypeScript', level: 90, icon: '💙' },
  { name: 'JavaScript', level: 95, icon: '⚡' },
  { name: 'Next.js', level: 85, icon: '▲' },
  { name: 'HTML5 & CSS3', level: 90, icon: '🎨' },
  { name: 'API Rest', level: 80, icon: '🔌' },
  { name: 'Node.js', level: 75, icon: '🟢' },
  { name: 'GraphQL', level: 75, icon: '🔺' },
  { name: 'Flutter', level: 70, icon: '🎯' },
  { name: 'SQL', level: 70, icon: '🗄️' },
  { name: 'Git', level: 90, icon: '🔀' },
  { name: 'AWS', level: 75, icon: '☁️' }
];

export const projects: Project[] = [
  {
    name: 'Bolão Copa 2026',
    description: 'App completo de bolão para a Copa do Mundo 2026. Palpites em jogos, ranking entre participantes e painel de resultados em tempo real.',
    tech: ['React', 'TypeScript', 'Supabase'],
    github: 'https://github.com/IagoFreire/site'
  },
  {
    name: 'TCG Pocket Decks',
    description: 'Sistema de sugestão de decks para Pokémon TCG Pocket usando IA. Recebe entrada do usuário e gera recomendações via Gemini API.',
    tech: ['TypeScript', 'Gemini AI', 'Vite'],
    github: 'https://github.com/IagoFreire/TCG-Pocket-Decks'
  },
  {
    name: 'Sistema de Eventos',
    description: 'Plataforma de inscrição para eventos com fluxo de pagamento completo via Mercado Pago (PIX e cartão). Gerencia inscritos, gera QR Code e emite ingressos digitais.',
    tech: ['TypeScript', 'React', 'Supabase', 'Mercado Pago'],
    github: 'https://github.com/IagoFreire/eventos'
  }
];
