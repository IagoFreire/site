import type { Experience, Skill, Project } from '../types';

export const experiences: Experience[] = [
  {
    company: 'Compass UOL',
    role: 'Fullstack Developer',
    period: 'Agosto 2023 - Presente',
    description: 'Participei do desenvolvimento de três produtos B2B em produção: uma plataforma de recrutamento com IA generativa (LLMs) para ranqueamento automatizado de candidatos, um player de áudio customizado e um sistema de gestão de contratos de investimentos de alto valor. Lidero decisões técnicas de arquitetura no frontend e realizo code review da equipe.',
    highlight: true,
    skills: ['React.js', 'TypeScript', 'Next.js', 'Node.js', 'REST API', 'Git']
  },
  {
    company: 'Cointimes',
    role: 'Frontend Developer',
    period: 'Maio 2022 - Agosto 2023',
    description: 'Construí e mantive a interface web completa da maior plataforma de notícias sobre criptomoedas do Brasil usando React e Next.js, com foco em SEO e performance. Integrei o frontend ao backend via GraphQL e REST, liderei a equipe frontend com code review e mentoria técnica, e contribuí com o app mobile em Flutter e uma extensão de navegador em TypeScript.',
    highlight: false,
    skills: ['React.js', 'Next.js', 'TypeScript', 'GraphQL', 'Flutter', 'SEO']
  },
  {
    company: 'Conexpay',
    role: 'Frontend Developer',
    period: 'Novembro 2019 - Novembro 2022',
    description: 'Responsável pelas aplicações web e mobile da empresa. Desenvolvi o app principal em React Native do zero, da coleta de requisitos à publicação nas lojas iOS e Android. Trabalhei no frontend web em ReactJS com deploy na AWS e contribuí para a arquitetura e estabilidade dos produtos.',
    highlight: false,
    skills: ['React.js', 'React Native', 'JavaScript', 'AWS', 'SQL', 'Git']
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
