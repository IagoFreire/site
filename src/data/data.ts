import type { Experience, Skill, Project } from '../types';

export const experiences: Experience[] = [
  {
    company: 'Compass UOL',
    role: 'Frontend Developer',
    period: 'Agosto 2023 - Presente',
    description: 'Atuei no time frontend do painel admin desenvolvendo features chaves de um novo produto da empresa. Também atuei como desenvolvedor fullstack apoiando o time no desenvolvimento de features e resoluções de bugs em um produto chamado "escrow" que gerência financeiramente contratos de milhões de reais.',
    highlight: true
  },
  {
    company: 'Cointimes',
    role: 'Frontend Developer',
    period: 'Maio 2022 - Agosto 2023',
    description: 'Implementei a interface web completa da plataforma principal utilizando ReactJS com Next.js, focado em SEO. Liderei, treinei e fiz code review da equipe frontend. Participei das decisões técnicas para o aplicativo mobile contribuindo com Flutter e extensão de navegador em TypeScript.',
    highlight: false
  },
  {
    company: 'Conexpay',
    role: 'Frontend Developer',
    period: 'Novembro 2019 - Novembro 2022',
    description: 'Responsável pelo desenvolvimento front-end das principais aplicações web e mobile. Criei o aplicativo principal em React Native do zero, desde requisitos até implementação, deployment na AWS e disponibilização nas lojas.',
    highlight: false
  }
];

export const skills: Skill[] = [
  { name: 'React.js', level: 95, icon: '⚛️' },
  { name: 'React Native', level: 90, icon: '📱' },
  { name: 'TypeScript', level: 90, icon: '💙' },
  { name: 'JavaScript', level: 95, icon: '⚡' },
  { name: 'Next.js', level: 85, icon: '▲' },
  { name: 'Flutter', level: 70, icon: '🎯' },
  { name: 'Git', level: 90, icon: '🔀' },
  { name: 'AWS', level: 75, icon: '☁️' }
];

export const projects: Project[] = [
  {
    name: 'OmniStack9-Aircnc',
    description: 'Clone do Airbnb desenvolvido durante a Semana OmniStack da Rocketseat. Aplicação completa com backend Node.js e frontend React.',
    tech: ['JavaScript', 'React', 'Node.js'],
    github: 'https://github.com/IagoFreire/OmniStack9-Aircnc',
    stars: 1
  },
  {
    name: 'OmniStack8-Tindev',
    description: 'Clone do Tinder para desenvolvedores. Projeto desenvolvido durante a Semana OmniStack com integração à API do GitHub.',
    tech: ['JavaScript', 'React', 'Node.js'],
    github: 'https://github.com/IagoFreire/OmniStack8-Tindev'
  },
  {
    name: 'Bootcamp GoStack - Desafios',
    description: 'Série de desafios do Bootcamp GoStack da Rocketseat, focados em React, React Native e Node.js.',
    tech: ['JavaScript', 'React', 'Node.js'],
    github: 'https://github.com/IagoFreire/BootcampGostack-Desafio01'
  },
  {
    name: 'Cifra de César',
    description: 'Aplicação de criptografia usando Cifra de César com ReactJS no frontend e Node.js no backend.',
    tech: ['JavaScript', 'React', 'Node.js'],
    github: 'https://github.com/IagoFreire/CifraDeCezar'
  },
  {
    name: 'Caesar Cipher',
    description: 'Implementação da cifra de César desenvolvida com HTML, CSS e JavaScript puro.',
    tech: ['CSS', 'JavaScript', 'HTML'],
    github: 'https://github.com/IagoFreire/CaesarCipher'
  }
];
