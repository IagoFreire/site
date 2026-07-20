-- Bolão Brasileirão — Returno 2026
-- Aditivo apenas: nenhuma tabela/RPC do Bolão Copa 2026 é alterada.
-- Reaproveita public.profiles (identidade/login/role) como usuários compartilhados.

-- ── Tabelas ──────────────────────────────────────────────────────────

create table public.brasileirao_matches (
  id            uuid primary key default gen_random_uuid(),
  external_id   text,
  home_team     text not null,
  away_team     text not null,
  round_number  integer not null check (round_number between 1 and 38),
  match_date    timestamptz not null,
  venue         text,
  home_score    integer,
  away_score    integer,
  status        text not null default 'scheduled' check (status in (
    'scheduled','live','finished','postponed'
  )),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table public.brasileirao_bets (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  match_id       uuid not null references public.brasileirao_matches(id) on delete cascade,
  home_score_bet integer not null check (home_score_bet between 0 and 30),
  away_score_bet integer not null check (away_score_bet between 0 and 30),
  points_earned  integer,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique (user_id, match_id)
);

create table public.brasileirao_point_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  match_id   uuid not null references public.brasileirao_matches(id) on delete cascade,
  bet_id     uuid not null references public.brasileirao_bets(id) on delete cascade,
  points     integer not null,
  reason     text not null check (reason in (
    'exact_score','correct_winner','correct_draw','wrong'
  )),
  created_at timestamptz default now()
);

-- Pontuação isolada por competição: não reaproveita profiles.total_points/streak
-- (que pertencem ao Bolão Copa 2026), para os dois rankings não se misturarem.
create table public.brasileirao_stats (
  user_id     uuid primary key references public.profiles(id) on delete cascade,
  total_points integer not null default 0,
  streak       integer not null default 0,
  cold_streak  integer not null default 0,
  updated_at   timestamptz default now()
);

create index brasileirao_bets_match_id_idx on public.brasileirao_bets(match_id);
create index brasileirao_point_logs_user_id_idx on public.brasileirao_point_logs(user_id);

-- ── View de apostas exatas (critério de desempate) ─────────────────

create view public.brasileirao_exact_bets_count as
select user_id, count(*) as exact_bets
from public.brasileirao_point_logs
where reason = 'exact_score'
group by user_id;

-- ── RPCs ─────────────────────────────────────────────────────────────

create or replace function public.calculate_brasileirao_match_points(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_home_score integer;
  v_away_score integer;
  v_real_winner integer;
  v_bet_winner integer;
  v_points integer;
  v_reason text;
  r record;
begin
  if not exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Only admins can calculate match points';
  end if;

  select home_score, away_score into v_home_score, v_away_score
  from public.brasileirao_matches
  where id = p_match_id;

  if v_home_score is null or v_away_score is null then
    raise exception 'Match % has no score registered', p_match_id;
  end if;

  v_real_winner := sign(v_home_score - v_away_score);

  for r in select * from public.brasileirao_bets where match_id = p_match_id loop
    v_bet_winner := sign(r.home_score_bet - r.away_score_bet);

    if r.home_score_bet = v_home_score and r.away_score_bet = v_away_score then
      v_points := 10;
      v_reason := 'exact_score';
    elsif v_bet_winner = v_real_winner then
      v_points := 5;
      v_reason := case when v_real_winner = 0 then 'correct_draw' else 'correct_winner' end;
    else
      v_points := 0;
      v_reason := 'wrong';
    end if;

    update public.brasileirao_bets
    set points_earned = v_points, updated_at = now()
    where id = r.id;

    insert into public.brasileirao_point_logs (user_id, match_id, bet_id, points, reason)
    values (r.user_id, p_match_id, r.id, v_points, v_reason);

    insert into public.brasileirao_stats (user_id, total_points, streak, cold_streak)
    values (
      r.user_id,
      v_points,
      case when v_points > 0 then 1 else 0 end,
      case when v_points = 0 then 1 else 0 end
    )
    on conflict (user_id) do update set
      total_points = brasileirao_stats.total_points + v_points,
      streak       = case when v_points > 0 then brasileirao_stats.streak + 1 else 0 end,
      cold_streak  = case when v_points = 0 then brasileirao_stats.cold_streak + 1 else 0 end,
      updated_at   = now();
  end loop;

  update public.brasileirao_matches
  set status = 'finished', updated_at = now()
  where id = p_match_id;
end;
$$;

create or replace function public.get_brasileirao_match_bet_stats(match_uuid uuid)
returns table (home bigint, draw bigint, away bigint, total bigint)
language sql
stable
as $$
  select
    count(*) filter (where home_score_bet > away_score_bet) as home,
    count(*) filter (where home_score_bet = away_score_bet) as draw,
    count(*) filter (where away_score_bet > home_score_bet) as away,
    count(*) as total
  from public.brasileirao_bets
  where match_id = match_uuid;
$$;

grant execute on function public.calculate_brasileirao_match_points(uuid) to authenticated;
grant execute on function public.get_brasileirao_match_bet_stats(uuid) to authenticated;

-- ── Row Level Security ──────────────────────────────────────────────

alter table public.brasileirao_matches enable row level security;
alter table public.brasileirao_bets enable row level security;
alter table public.brasileirao_point_logs enable row level security;
alter table public.brasileirao_stats enable row level security;

create policy "brasileirao_matches_read" on public.brasileirao_matches
  for select using (true);

create policy "brasileirao_matches_admin_write" on public.brasileirao_matches
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "brasileirao_bets_own" on public.brasileirao_bets
  for all using (auth.uid() = user_id);

create policy "brasileirao_logs_own" on public.brasileirao_point_logs
  for select using (auth.uid() = user_id);

create policy "brasileirao_stats_read" on public.brasileirao_stats
  for select using (true);
