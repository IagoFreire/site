# Portfolio — React Bits + Content Update

**Date:** 2026-06-17  
**Scope:** Melhorias pontuais no site de portfólio existente — manter tema indigo/roxo escuro, adicionar React Bits em seções estratégicas, atualizar conteúdo com base no currículo.

---

## Context

O portfólio atual (`src/`) é um single-page app com CSS puro e animações via `@keyframes`. Funciona bem mas não usa bibliotecas de animação modernas. O currículo tem informações mais ricas do que o site exibe: projetos mais relevantes não estão listados, algumas skills faltam, e as descrições de experiência são mais enxutas do que o real.

---

## Arquitetura

Nenhuma mudança estrutural — mantém pages → sections → components → data. Mudanças são:
1. Instalação do React Bits via CLI (`npx reactbits@latest add <component>`) — gera arquivos em `src/components/ui/`
2. Substituição pontual de elementos CSS por componentes React Bits nas seções abaixo
3. Atualização de conteúdo em `src/data/data.ts`

---

## Seção 1 — Hero (`src/sections/Hero.tsx`)

| Elemento | Hoje | Novo |
|---|---|---|
| Fundo | 3 `div` com `border-radius` + `filter:blur` CSS | `Aurora` (React Bits) — gradiente animado em ondas |
| Nome "Iago Freire" | `slideUp` CSS + gradiente | `BlurText` — aparece de um blur suave, palavra por palavra |
| Subtítulo | Texto estático | `RotatingText` — rotaciona entre: "Frontend Developer", "React Specialist", "TypeScript Engineer" |
| Badge "Disponível" | Estilo CSS simples | `ShinyText` — shimmer animado percorre o texto |
| Stats | Números estáticos | `CountUp` — contagem animada ao entrar na viewport |
| Stat "anos" | "5+" | **"6+"** (Nov/2019 → Jun/2026 = 6,5 anos) |

**Componentes React Bits a instalar:** `Aurora`, `BlurText`, `RotatingText`, `ShinyText`, `CountUp`

---

## Seção 2 — SectionHeader (`src/components/SectionHeader.tsx`)

O texto principal dos títulos de seção (Experiência, Habilidades, Projetos, Contato, Sobre) ganha `ShinyText` — brilho sutil que percorre o texto uma vez ao entrar na viewport. Fonte, cor e layout não mudam.

**Componente React Bits:** `ShinyText` (já instalado para o Hero)

---

## Seção 3 — Projetos (`src/sections/Projects.tsx` + `src/components/ProjectCard.tsx`)

### Visual
`ProjectCard` usa `SpotlightCard` do React Bits como wrapper — spotlight de luz segue o mouse, sem mudar o layout interno.

**Componente React Bits a instalar:** `SpotlightCard`

### Conteúdo — substituição completa dos 5 projetos atuais por 3 projetos reais:

| # | Projeto | Stack | GitHub | Live |
|---|---|---|---|---|
| 1 | Bolão Copa 2026 | React, TypeScript, Supabase | `IagoFreire/site` (pasta `/src/bolao`) | — |
| 2 | TCG Pocket Decks | TypeScript, Gemini AI, Vite | `IagoFreire/TCG-Pocket-Decks` | pocket-decks-pink.vercel.app (sem link — DB inativo) |
| 3 | Sistema de Eventos | TypeScript, React, Supabase, Mercado Pago | `IagoFreire/eventos` | — |

Nenhum card exibe link de live demo (bancos de dados inativos). Todos linkam para o GitHub.

---

## Seção 4 — Skills (`src/sections/Skills.tsx` + `src/data/data.ts`)

Adicionar 5 skills que estão no currículo mas não no site:

| Skill | Emoji | Progresso |
|---|---|---|
| Node.js | 🟢 | 75% |
| GraphQL | 🔺 | 75% |
| HTML5 & CSS3 | 🎨 | 90% |
| SQL | 🗄️ | 70% |
| API Rest | 🔌 | 80% |

Layout e estilo dos cards permanecem iguais — só adicionar entradas em `data.ts`.

---

## Seção 5 — Conteúdo (`src/data/data.ts`)

### Experiências — descrições enriquecidas:

**Compass UOL (ago/2023 - presente):**
Desenvolvi uma plataforma de recrutamento com LLMs para ranqueamento automatizado de candidatos e um player de áudio para monitoramento. Atuei no frontend de painéis administrativos, liderando decisões técnicas de arquitetura e novas features. Como Fullstack, sustentei um produto de gerenciamento de contratos de investimentos milionários e corrigi bugs críticos.

**Cointimes (mai/2022 - ago/2023):**
Implementei a interface web completa da plataforma principal usando ReactJS e Next.js com foco em SEO. Integrei a interface ao backend via GraphQL e REST. Liderei e fiz code review da equipe frontend. Contribuí com decisões técnicas para o app mobile e com implementações em Flutter e extensão de navegador em TypeScript.

**Conexpay (nov/2019 - nov/2022):**
Responsável pelo desenvolvimento front-end das principais aplicações web e mobile. Criei o aplicativo principal da empresa em React Native do zero, conduzindo todo o processo — coleta de requisitos, implementação em ReactJS e React Native, deploy na AWS e publicação nas lojas de aplicativos.

---

## Instalação React Bits

```bash
# Instalar cada componente via CLI (copia source para src/components/ui/)
npx reactbits@latest add Aurora
npx reactbits@latest add BlurText
npx reactbits@latest add RotatingText
npx reactbits@latest add ShinyText
npx reactbits@latest add CountUp
npx reactbits@latest add SpotlightCard
```

---

## Verificação

1. `npm run dev` — confirmar que nenhum componente quebra
2. Hero: aurora animada visível no fundo, nome entra com blur, subtítulo rotaciona, badge tem shimmer, stats contam ao scroll
3. SectionHeader: shimmer visível ao rolar até cada seção
4. Projetos: spotlight de luz segue o mouse nos cards; 3 projetos corretos aparecem com links GitHub
5. Skills: 13 skills total (8 originais + 5 novas) com barras animadas
6. Experiências: descrições ricas nas 3 empresas; "6+" no hero stat
7. Responsividade: testar em mobile (768px) — Aurora e RotatingText devem funcionar sem quebrar layout
