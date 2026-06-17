# ⚽ Bolão Copa 2026

Sistema de bolão para a Copa do Mundo de 2026 (EUA · Canadá · México), embutido como módulo dentro do portfólio pessoal. Permite que participantes cadastrem palpites para cada jogo, acumulem pontos e disputem o ranking em tempo real.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Banco de Dados](#banco-de-dados)
- [Sistema de Pontuação](#sistema-de-pontuação)
- [Arquitetura do Frontend](#arquitetura-do-frontend)
- [Páginas e Funcionalidades](#páginas-e-funcionalidades)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Como Rodar Localmente](#como-rodar-localmente)

---

## Visão Geral

O Bolão é acessado em `/bolao` dentro do portfólio. Ao entrar nessa rota, o sistema troca dinamicamente o título da aba, o favicon e o tema visual (verde escuro) para imersão total na experiência do bolão.

Os usuários criam contas, fazem palpites nos placares de cada partida e acompanham a tabela de grupos, o chaveamento eliminatório e o ranking de pontos — tudo atualizado em **tempo real** via Supabase Realtime.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite 7 |
| Roteamento | React Router DOM v7 |
| Backend / BaaS | [Supabase](https://supabase.com) (PostgreSQL + Auth + Realtime) |
| Ícones | Lucide React |
| Estilo | CSS Vanilla (BEM-like) |

> O projeto **não possui backend próprio para o bolão** — toda a lógica de dados é gerenciada diretamente pelo Supabase via cliente JS no navegador.

---

## Banco de Dados

O banco roda no Supabase (PostgreSQL). Abaixo estão as tabelas principais:

### `profiles`
Estende o `auth.users` do Supabase com dados públicos do participante.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` | FK para `auth.users.id` |
| `username` | `text` | Nome de usuário único (sem espaços) |
| `display_name` | `text` | Nome de exibição |
| `avatar_url` | `text` | URL do avatar (opcional) |
| `role` | `text` | `'user'` ou `'admin'` |
| `total_points` | `int` | Pontuação acumulada |
| `streak` | `int` | Sequência de acertos consecutivos |
| `cold_streak` | `int` | Sequência de erros consecutivos |
| `created_at` | `timestamptz` | Data de cadastro |

### `matches`
Partidas da copa cadastradas pelo admin.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` | PK |
| `external_id` | `text` | ID externo (opcional, para integração futura) |
| `home_team` | `text` | Time mandante |
| `away_team` | `text` | Time visitante |
| `home_team_flag` | `text` | URL/emoji da bandeira (opcional) |
| `away_team_flag` | `text` | URL/emoji da bandeira (opcional) |
| `stage` | `text` | Fase: `group`, `round_of_32`, `round_of_16`, `quarter`, `semi`, `third_place`, `final` |
| `group_name` | `text` | Letra do grupo (apenas fase de grupos) |
| `match_date` | `timestamptz` | Data e hora do jogo |
| `venue` | `text` | Estádio/cidade (opcional) |
| `home_score` | `int` | Gols do mandante (null antes do resultado) |
| `away_score` | `int` | Gols do visitante (null antes do resultado) |
| `status` | `text` | `scheduled`, `live`, `finished`, `postponed` |
| `points_multiplier` | `float` | Multiplicador de pontos (padrão `1`, fases finais podem ter `2`) |
| `created_at` | `timestamptz` | — |
| `updated_at` | `timestamptz` | — |

### `bets`
Palpites dos usuários para cada partida.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK para `profiles.id` |
| `match_id` | `uuid` | FK para `matches.id` |
| `home_score_bet` | `int` | Palpite para gols do mandante |
| `away_score_bet` | `int` | Palpite para gols do visitante |
| `points_earned` | `int` | Pontos calculados após resultado (null enquanto o jogo não acabou) |
| `is_wildcard` | `bool` | Se `true`, os pontos desse palpite são **dobrados** |
| `created_at` | `timestamptz` | — |
| `updated_at` | `timestamptz` | — |

### `point_logs`
Histórico detalhado de pontuação por aposta.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK para `profiles.id` |
| `match_id` | `uuid` | FK para `matches.id` |
| `bet_id` | `uuid` | FK para `bets.id` |
| `points` | `int` | Pontos atribuídos |
| `reason` | `text` | `exact_score`, `correct_winner`, `correct_draw` ou `wrong` |
| `created_at` | `timestamptz` | — |

### Funções RPC (PostgreSQL)
O admin usa duas funções serverless chamadas via `supabase.rpc()`:

| Função | Descrição |
|---|---|
| `admin_delete_user(target_user_id)` | Deleta um usuário e todas as suas apostas |
| `admin_reset_user_password(target_user_id, new_password)` | Redefine a senha de um usuário para uma senha temporária |

---

## Sistema de Pontuação

A lógica de pontuação está em [`src/bolao/lib/scoring.ts`](./lib/scoring.ts):

| Resultado | Pontos base | Com Wildcard |
|---|---|---|
| **Placar exato** (ex: 2×1 chutado e 2×1 no jogo) | **10 pts** | **20 pts** |
| **Vencedor certo** (ex: chutou vitória do Brasil, Brasil venceu) | **5 pts** | **10 pts** |
| **Empate certo** (chutou empate e foi empate) | **5 pts** | **10 pts** |
| **Errou** | **0 pts** | **0 pts** |

O multiplicador de pontos (`points_multiplier`) da partida é aplicado antes do wildcard:

```
pontos_finais = base_pts × points_multiplier × (2 se wildcard)
```

Exemplo: placar exato numa final com `points_multiplier = 2` e wildcard ativo = **40 pontos**.

---

## Arquitetura do Frontend

```
src/bolao/
├── BolaoRouter.tsx       # Roteador raiz do módulo + side effects de tema
├── BolaoGlobal.css       # Design system do bolão (variáveis, utilitários)
│
├── context/
│   └── AuthContext.tsx   # Sessão Supabase + perfil do usuário logado
│
├── hooks/
│   ├── useBets.ts        # CRUD de apostas do usuário logado
│   ├── useMatches.ts     # Lista de partidas com filtro + Realtime
│   ├── useLeaderboard.ts # Ranking de usuários com Realtime
│   ├── useUserBets.ts    # Apostas de qualquer usuário (para modal)
│   ├── useMatchStats.ts  # Estatísticas de um jogo específico
│   └── useCountdown.ts   # Contagem regressiva até o início do jogo
│
├── lib/
│   ├── supabase.ts       # Instância do cliente Supabase
│   ├── scoring.ts        # Função calculatePoints + labels de fase/motivo
│   ├── dates.ts          # Formatação de datas + agrupamento por dia
│   └── flags.ts          # Mapeamento de times para bandeiras/emojis
│
├── types/
│   └── bolao.types.ts    # Interfaces TypeScript (Profile, Match, Bet, etc.)
│
├── pages/
│   ├── LoginPage.tsx     # Login e cadastro com auto-login
│   ├── DashboardPage.tsx # Painel pessoal: stats, badges, próximos jogos
│   ├── GamesPage.tsx     # Todos os jogos com filtros e palpites
│   ├── LeaderboardPage.tsx # Ranking com modal de apostas por usuário
│   ├── BracketPage.tsx   # Tabela de grupos + Chaveamento eliminatório
│   └── AdminPage.tsx     # Painel de admin (jogos, resultados, usuários)
│
└── components/
    ├── BolaoNavbar.tsx       # Barra de navegação
    ├── PrivateRoute.tsx      # Guard de rota (requer login)
    ├── AdminRoute.tsx        # Guard de rota (requer role=admin)
    ├── MatchCard/            # Card de partida com input de palpite
    ├── BetInput/             # Input numérico de placar
    ├── BetTempBar/           # Barra de confirmação do palpite
    ├── Countdown/            # Cronômetro regressivo
    ├── LeaderboardRow/       # Linha do ranking
    ├── UserBetsModal/        # Modal com apostas de um usuário
    ├── Badges/               # Sistema de conquistas/badges
    ├── AdminMatchForm/       # Formulário de criação/edição de jogo
    ├── AdminResultForm/      # Formulário de registro de resultado
    └── ConfettiEffect.tsx    # Efeito de confete no placar exato
```

### Realtime
Dois canais Supabase escutam mudanças no banco e atualizam a UI automaticamente:

- **`matches-realtime`** → qualquer alteração na tabela `matches` atualiza a lista de jogos
- **`leaderboard-realtime`** → atualizações na tabela `profiles` atualizam o ranking

---

## Páginas e Funcionalidades

### 🔐 Login / Cadastro (`/bolao/login`)
- Login com e-mail e senha via Supabase Auth
- Cadastro com nome de exibição, @username, e-mail e senha
- Auto-login após cadastro bem-sucedido

### 🏠 Dashboard (`/bolao`)
- Boas-vindas com nome do usuário
- Cards de stats: pontuação total, posição no ranking e sequência de acertos 🔥
- Sistema de **badges/conquistas** baseado em streak e pontuação
- Lista dos 3 próximos jogos com input de palpite direto

### ⚽ Jogos (`/bolao/games`)
- Todos os jogos organizados por data
- Filtros: Todos / Próximos / Ao Vivo / Finalizados
- `MatchCard` com estado visual diferente por status (`scheduled`, `live`, `finished`)
- Palpites podem ser feitos/editados até o início do jogo

### 🏆 Ranking (`/bolao/leaderboard`)
- Tabela de todos os participantes ordenada por pontos e streak
- Atualizada em **tempo real** via Supabase Realtime
- Ao clicar num participante abre modal com suas apostas visíveis (apenas jogos já iniciados/encerrados)

### 📊 Copa (`/bolao/bracket`)
- **Aba Grupos**: tabela de classificação calculada localmente com P, V, E, D, SG e Pts. Top 2 de cada grupo destacados com cor de classificação
- **Aba Chave**: chaveamento visual eliminatório (Oitavas → Quartas → Semi → 3º Lugar → Final). Mobile: navegação por abas. Desktop: scroll horizontal estilo bracket real

### ⚙️ Admin (`/bolao/admin`) — *apenas role `admin`*
| Aba | Funcionalidades |
|---|---|
| **Jogos** | Criar, editar e excluir partidas |
| **Resultados** | Registrar placar de jogos passados sem resultado |
| **Usuários** | Ver todos os participantes, alternar role user↔admin, resetar senha (gera senha temporária copiável), excluir usuário |

---

## Configuração do Ambiente

1. **Crie o projeto no Supabase** em [supabase.com](https://supabase.com)

2. **Crie o arquivo `.env.local`** na raiz do projeto (copie de `.env.local.example`):

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Crie as tabelas** no SQL Editor do Supabase conforme o schema descrito em [Banco de Dados](#banco-de-dados)

4. **Configure as Row Level Security (RLS)** policies sugeridas:
   - `profiles`: leitura pública, escrita apenas pelo próprio usuário
   - `matches`: leitura pública, escrita apenas por `admin`
   - `bets`: leitura pública (para ranking), escrita apenas pelo dono

5. **Crie as funções RPC** `admin_delete_user` e `admin_reset_user_password` usando `SECURITY DEFINER` para que o admin possa operar em outros usuários

---

## Como Rodar Localmente

### Frontend (Vite + React)

```bash
# Instalar dependências
npm install

# Criar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Iniciar servidor de desenvolvimento
npm run dev
```

O app ficará disponível em `http://localhost:5173`. O bolão é acessado em `/bolao`.

### Build de Produção

```bash
npm run build
```

---

> **Nota:** O diretório `server/` contém um backend separado de gerenciamento de servidor Hytale (não relacionado ao bolão). Ele expõe uma API REST + WebSocket na porta `3001` para controlar o processo do servidor de jogo.
