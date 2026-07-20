-- Seed de jogos do returno do Brasileirão 2026 (rodadas 20-38)
-- Gerado via Gemini a partir do schema de public.brasileirao_matches.
--
-- STATUS: INCOMPLETO. Só cobre as rodadas 20 e 38 (exemplos de início/fim).
-- Faltam as rodadas 21 a 37. Horários e estádios são provisórios (TBD),
-- não confirmados pela CBF — revisar antes de rodar em produção.
--
-- Rodar depois da migration 20260720120000_brasileirao_returno.sql.

INSERT INTO public.brasileirao_matches 
  (home_team, away_team, round_number, match_date, venue) 
VALUES
  /* =========================================
     RODADA 20 
     ========================================= */
  ('Athletico-PR', 'Internacional', 20, '2026-07-25T18:30:00-03:00', 'Ligga Arena'),
  ('Santos', 'Chapecoense', 20, '2026-07-25T18:30:00-03:00', 'Vila Belmiro'),
  ('Vasco da Gama', 'Mirassol', 20, '2026-07-25T20:30:00-03:00', 'São Januário'),
  ('Bahia', 'Corinthians', 20, '2026-07-26T16:00:00-03:00', 'Arena Fonte Nova'),
  ('Cruzeiro', 'Botafogo', 20, '2026-07-26T16:00:00-03:00', 'Mineirão'),
  ('Grêmio', 'Fluminense', 20, '2026-07-26T18:30:00-03:00', 'Arena do Grêmio'),
  ('Red Bull Bragantino', 'Coritiba', 20, '2026-07-26T18:30:00-03:00', 'Nabi Abi Chedid'),
  ('Flamengo', 'São Paulo', 20, '2026-07-26T18:30:00-03:00', 'Maracanã'),
  ('Palmeiras', 'Atlético-MG', 20, '2026-07-26T19:30:00-03:00', 'Allianz Parque'),
  ('Remo', 'Vitória', 20, '2026-07-26T19:30:00-03:00', 'Mangueirão'),

  /* =========================================
     RODADA 21
     ========================================= */
  ('Chapecoense', 'Vasco da Gama', 21, '2026-07-29T19:30:00-03:00', 'Arena Condá'),
  ('Atlético-MG', 'Red Bull Bragantino', 21, '2026-07-29T19:30:00-03:00', 'Arena MRV'),
  ('São Paulo', 'Santos', 21, '2026-07-29T19:30:00-03:00', 'MorumBIS'),
  ('Botafogo', 'Grêmio', 21, '2026-07-29T19:30:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Internacional', 'Flamengo', 21, '2026-07-29T21:30:00-03:00', 'Beira-Rio'),
  ('Mirassol', 'Remo', 21, '2026-07-29T21:30:00-03:00', 'Estádio Municipal José Maria de Campos Maia'),
  ('Vitória', 'Palmeiras', 21, '2026-07-29T21:30:00-03:00', 'Barradão'),
  ('Fluminense', 'Bahia', 21, '2026-07-29T21:30:00-03:00', 'Maracanã'),
  ('Corinthians', 'Athletico-PR', 21, '2026-07-30T19:30:00-03:00', 'Neo Química Arena'),
  ('Coritiba', 'Cruzeiro', 21, '2026-07-30T21:30:00-03:00', 'Couto Pereira'),

  /* =========================================
     RODADA 22
     ========================================= */
  ('Grêmio', 'São Paulo', 22, '2026-08-08T16:00:00-03:00', 'Arena do Grêmio'),
  ('Remo', 'Atlético-MG', 22, '2026-08-08T18:30:00-03:00', 'Mangueirão'),
  ('Coritiba', 'Chapecoense', 22, '2026-08-08T20:30:00-03:00', 'Couto Pereira'),
  ('Botafogo', 'Fluminense', 22, '2026-08-08T21:00:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Cruzeiro', 'Mirassol', 22, '2026-08-09T11:00:00-03:00', 'Mineirão'),
  ('Bahia', 'Vasco da Gama', 22, '2026-08-09T16:00:00-03:00', 'Arena Fonte Nova'),
  ('Palmeiras', 'Internacional', 22, '2026-08-09T16:00:00-03:00', 'Allianz Parque'),
  ('Santos', 'Athletico-PR', 22, '2026-08-09T18:30:00-03:00', 'Vila Belmiro'),
  ('Flamengo', 'Vitória', 22, '2026-08-09T18:30:00-03:00', 'Maracanã'),
  ('Red Bull Bragantino', 'Corinthians', 22, '2026-08-09T18:30:00-03:00', 'Nabi Abi Chedid'),

  /* =========================================
     RODADA 23 /* TBD - Horários Provisórios */
     ========================================= */
  ('São Paulo', 'Coritiba', 23, '2026-08-15T16:00:00-03:00', 'MorumBIS'),
  ('Athletico-PR', 'Flamengo', 23, '2026-08-15T18:30:00-03:00', 'Ligga Arena'),
  ('Vasco da Gama', 'Red Bull Bragantino', 23, '2026-08-15T21:00:00-03:00', 'São Januário'),
  ('Fluminense', 'Remo', 23, '2026-08-16T11:00:00-03:00', 'Maracanã'),
  ('Mirassol', 'Bahia', 23, '2026-08-16T16:00:00-03:00', 'Estádio Municipal José Maria de Campos Maia'),
  ('Vitória', 'Santos', 23, '2026-08-16T16:00:00-03:00', 'Barradão'),
  ('Internacional', 'Grêmio', 23, '2026-08-16T18:30:00-03:00', 'Beira-Rio'),
  ('Atlético-MG', 'Cruzeiro', 23, '2026-08-16T18:30:00-03:00', 'Arena MRV'),
  ('Corinthians', 'Botafogo', 23, '2026-08-16T20:00:00-03:00', 'Neo Química Arena'),
  ('Chapecoense', 'Palmeiras', 23, '2026-08-17T20:00:00-03:00', 'Arena Condá'),

  /* =========================================
     RODADA 24 /* TBD */
     ========================================= */
  ('Palmeiras', 'Vasco da Gama', 24, '2026-08-22T16:00:00-03:00', 'Allianz Parque'),
  ('Cruzeiro', 'Athletico-PR', 24, '2026-08-22T18:30:00-03:00', 'Mineirão'),
  ('Red Bull Bragantino', 'Grêmio', 24, '2026-08-22T21:00:00-03:00', 'Nabi Abi Chedid'),
  ('Botafogo', 'Mirassol', 24, '2026-08-23T11:00:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Flamengo', 'Corinthians', 24, '2026-08-23T16:00:00-03:00', 'Maracanã'),
  ('Bahia', 'Atlético-MG', 24, '2026-08-23T16:00:00-03:00', 'Arena Fonte Nova'),
  ('Coritiba', 'Internacional', 24, '2026-08-23T18:30:00-03:00', 'Couto Pereira'),
  ('Santos', 'São Paulo', 24, '2026-08-23T18:30:00-03:00', 'Vila Belmiro'),
  ('Remo', 'Chapecoense', 24, '2026-08-23T20:00:00-03:00', 'Mangueirão'),
  ('Fluminense', 'Vitória', 24, '2026-08-24T20:00:00-03:00', 'Maracanã'),

  /* =========================================
     RODADA 25 /* TBD */
     ========================================= */
  ('São Paulo', 'Remo', 25, '2026-08-29T16:00:00-03:00', 'MorumBIS'),
  ('Vasco da Gama', 'Coritiba', 25, '2026-08-29T18:30:00-03:00', 'São Januário'),
  ('Athletico-PR', 'Red Bull Bragantino', 25, '2026-08-29T21:00:00-03:00', 'Ligga Arena'),
  ('Mirassol', 'Flamengo', 25, '2026-08-30T11:00:00-03:00', 'Estádio Municipal José Maria de Campos Maia'),
  ('Corinthians', 'Palmeiras', 25, '2026-08-30T16:00:00-03:00', 'Neo Química Arena'),
  ('Grêmio', 'Bahia', 25, '2026-08-30T16:00:00-03:00', 'Arena do Grêmio'),
  ('Internacional', 'Botafogo', 25, '2026-08-30T18:30:00-03:00', 'Beira-Rio'),
  ('Atlético-MG', 'Santos', 25, '2026-08-30T18:30:00-03:00', 'Arena MRV'),
  ('Vitória', 'Cruzeiro', 25, '2026-08-30T20:00:00-03:00', 'Barradão'),
  ('Chapecoense', 'Fluminense', 25, '2026-08-31T20:00:00-03:00', 'Arena Condá'),

  /* =========================================
     RODADA 26 /* TBD */
     ========================================= */
  ('Palmeiras', 'São Paulo', 26, '2026-09-12T16:00:00-03:00', 'Allianz Parque'),
  ('Flamengo', 'Atlético-MG', 26, '2026-09-12T18:30:00-03:00', 'Maracanã'),
  ('Red Bull Bragantino', 'Vitória', 26, '2026-09-12T21:00:00-03:00', 'Nabi Abi Chedid'),
  ('Botafogo', 'Vasco da Gama', 26, '2026-09-13T11:00:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Santos', 'Internacional', 26, '2026-09-13T16:00:00-03:00', 'Vila Belmiro'),
  ('Bahia', 'Mirassol', 26, '2026-09-13T16:00:00-03:00', 'Arena Fonte Nova'),
  ('Fluminense', 'Athletico-PR', 26, '2026-09-13T18:30:00-03:00', 'Maracanã'),
  ('Cruzeiro', 'Chapecoense', 26, '2026-09-13T18:30:00-03:00', 'Mineirão'),
  ('Coritiba', 'Corinthians', 26, '2026-09-13T20:00:00-03:00', 'Couto Pereira'),
  ('Remo', 'Grêmio', 26, '2026-09-14T20:00:00-03:00', 'Mangueirão'),

  /* =========================================
     RODADA 27 /* TBD */
     ========================================= */
  ('São Paulo', 'Fluminense', 27, '2026-09-19T16:00:00-03:00', 'MorumBIS'),
  ('Vasco da Gama', 'Flamengo', 27, '2026-09-19T18:30:00-03:00', 'São Januário'),
  ('Athletico-PR', 'Bahia', 27, '2026-09-19T21:00:00-03:00', 'Ligga Arena'),
  ('Mirassol', 'Palmeiras', 27, '2026-09-20T11:00:00-03:00', 'Estádio Municipal José Maria de Campos Maia'),
  ('Corinthians', 'Cruzeiro', 27, '2026-09-20T16:00:00-03:00', 'Neo Química Arena'),
  ('Internacional', 'Red Bull Bragantino', 27, '2026-09-20T16:00:00-03:00', 'Beira-Rio'),
  ('Atlético-MG', 'Botafogo', 27, '2026-09-20T18:30:00-03:00', 'Arena MRV'),
  ('Grêmio', 'Coritiba', 27, '2026-09-20T18:30:00-03:00', 'Arena do Grêmio'),
  ('Vitória', 'Chapecoense', 27, '2026-09-20T20:00:00-03:00', 'Barradão'),
  ('Santos', 'Remo', 27, '2026-09-21T20:00:00-03:00', 'Vila Belmiro'),

  /* =========================================
     RODADA 28 /* TBD */
     ========================================= */
  ('Palmeiras', 'Grêmio', 28, '2026-09-26T16:00:00-03:00', 'Allianz Parque'),
  ('Flamengo', 'Santos', 28, '2026-09-26T18:30:00-03:00', 'Maracanã'),
  ('Red Bull Bragantino', 'São Paulo', 28, '2026-09-26T21:00:00-03:00', 'Nabi Abi Chedid'),
  ('Chapecoense', 'Athletico-PR', 28, '2026-09-27T11:00:00-03:00', 'Arena Condá'),
  ('Botafogo', 'Bahia', 28, '2026-09-27T16:00:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Cruzeiro', 'Vasco da Gama', 28, '2026-09-27T16:00:00-03:00', 'Mineirão'),
  ('Fluminense', 'Atlético-MG', 28, '2026-09-27T18:30:00-03:00', 'Maracanã'),
  ('Coritiba', 'Mirassol', 28, '2026-09-27T18:30:00-03:00', 'Couto Pereira'),
  ('Remo', 'Corinthians', 28, '2026-09-27T20:00:00-03:00', 'Mangueirão'),
  ('Vitória', 'Internacional', 28, '2026-09-28T20:00:00-03:00', 'Barradão'),

  /* =========================================
     RODADA 29 /* TBD */
     ========================================= */
  ('São Paulo', 'Botafogo', 29, '2026-10-03T16:00:00-03:00', 'MorumBIS'),
  ('Vasco da Gama', 'Fluminense', 29, '2026-10-03T18:30:00-03:00', 'São Januário'),
  ('Athletico-PR', 'Remo', 29, '2026-10-03T21:00:00-03:00', 'Ligga Arena'),
  ('Mirassol', 'Red Bull Bragantino', 29, '2026-10-04T11:00:00-03:00', 'Estádio Municipal José Maria de Campos Maia'),
  ('Corinthians', 'Vitória', 29, '2026-10-04T16:00:00-03:00', 'Neo Química Arena'),
  ('Internacional', 'Chapecoense', 29, '2026-10-04T16:00:00-03:00', 'Beira-Rio'),
  ('Atlético-MG', 'Coritiba', 29, '2026-10-04T18:30:00-03:00', 'Arena MRV'),
  ('Bahia', 'Flamengo', 29, '2026-10-04T18:30:00-03:00', 'Arena Fonte Nova'),
  ('Santos', 'Cruzeiro', 29, '2026-10-04T20:00:00-03:00', 'Vila Belmiro'),
  ('Grêmio', 'Palmeiras', 29, '2026-10-05T20:00:00-03:00', 'Arena do Grêmio'),

  /* =========================================
     RODADA 30 /* TBD */
     ========================================= */
  ('Palmeiras', 'Santos', 30, '2026-10-10T16:00:00-03:00', 'Allianz Parque'),
  ('Flamengo', 'Grêmio', 30, '2026-10-10T18:30:00-03:00', 'Maracanã'),
  ('Red Bull Bragantino', 'Bahia', 30, '2026-10-10T21:00:00-03:00', 'Nabi Abi Chedid'),
  ('Chapecoense', 'Mirassol', 30, '2026-10-11T11:00:00-03:00', 'Arena Condá'),
  ('Botafogo', 'Athletico-PR', 30, '2026-10-11T16:00:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Cruzeiro', 'São Paulo', 30, '2026-10-11T16:00:00-03:00', 'Mineirão'),
  ('Fluminense', 'Corinthians', 30, '2026-10-11T18:30:00-03:00', 'Maracanã'),
  ('Coritiba', 'Atlético-MG', 30, '2026-10-11T18:30:00-03:00', 'Couto Pereira'),
  ('Remo', 'Internacional', 30, '2026-10-11T20:00:00-03:00', 'Mangueirão'),
  ('Vitória', 'Vasco da Gama', 30, '2026-10-12T20:00:00-03:00', 'Barradão'),

  /* =========================================
     RODADA 31 /* TBD */
     ========================================= */
  ('São Paulo', 'Vasco da Gama', 31, '2026-10-17T16:00:00-03:00', 'MorumBIS'),
  ('Athletico-PR', 'Palmeiras', 31, '2026-10-17T18:30:00-03:00', 'Ligga Arena'),
  ('Bahia', 'Cruzeiro', 31, '2026-10-17T21:00:00-03:00', 'Arena Fonte Nova'),
  ('Mirassol', 'Corinthians', 31, '2026-10-18T11:00:00-03:00', 'Estádio Municipal José Maria de Campos Maia'),
  ('Internacional', 'Fluminense', 31, '2026-10-18T16:00:00-03:00', 'Beira-Rio'),
  ('Atlético-MG', 'Vitória', 31, '2026-10-18T16:00:00-03:00', 'Arena MRV'),
  ('Grêmio', 'Chapecoense', 31, '2026-10-18T18:30:00-03:00', 'Arena do Grêmio'),
  ('Santos', 'Coritiba', 31, '2026-10-18T18:30:00-03:00', 'Vila Belmiro'),
  ('Botafogo', 'Remo', 31, '2026-10-18T20:00:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Flamengo', 'Red Bull Bragantino', 31, '2026-10-19T20:00:00-03:00', 'Maracanã'),

  /* =========================================
     RODADA 32 /* TBD */
     ========================================= */
  ('Palmeiras', 'Bahia', 32, '2026-10-24T16:00:00-03:00', 'Allianz Parque'),
  ('Corinthians', 'Internacional', 32, '2026-10-24T18:30:00-03:00', 'Neo Química Arena'),
  ('Red Bull Bragantino', 'Botafogo', 32, '2026-10-24T21:00:00-03:00', 'Nabi Abi Chedid'),
  ('Chapecoense', 'São Paulo', 32, '2026-10-25T11:00:00-03:00', 'Arena Condá'),
  ('Vasco da Gama', 'Santos', 32, '2026-10-25T16:00:00-03:00', 'São Januário'),
  ('Cruzeiro', 'Grêmio', 32, '2026-10-25T16:00:00-03:00', 'Mineirão'),
  ('Fluminense', 'Flamengo', 32, '2026-10-25T18:30:00-03:00', 'Maracanã'),
  ('Coritiba', 'Athletico-PR', 32, '2026-10-25T18:30:00-03:00', 'Couto Pereira'),
  ('Remo', 'Atlético-MG', 32, '2026-10-25T20:00:00-03:00', 'Mangueirão'),
  ('Vitória', 'Mirassol', 32, '2026-10-26T20:00:00-03:00', 'Barradão'),

  /* =========================================
     RODADA 33 /* TBD */
     ========================================= */
  ('Bahia', 'São Paulo', 33, '2026-10-28T19:30:00-03:00', 'Arena Fonte Nova'),
  ('Athletico-PR', 'Vitória', 33, '2026-10-28T19:30:00-03:00', 'Ligga Arena'),
  ('Mirassol', 'Internacional', 33, '2026-10-28T21:30:00-03:00', 'Estádio Municipal José Maria de Campos Maia'),
  ('Atlético-MG', 'Chapecoense', 33, '2026-10-28T21:30:00-03:00', 'Arena MRV'),
  ('Grêmio', 'Vasco da Gama', 33, '2026-10-28T21:30:00-03:00', 'Arena do Grêmio'),
  ('Santos', 'Red Bull Bragantino', 33, '2026-10-29T19:30:00-03:00', 'Vila Belmiro'),
  ('Botafogo', 'Corinthians', 33, '2026-10-29T19:30:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Flamengo', 'Coritiba', 33, '2026-10-29T21:30:00-03:00', 'Maracanã'),
  ('Cruzeiro', 'Remo', 33, '2026-10-29T21:30:00-03:00', 'Mineirão'),
  ('Fluminense', 'Palmeiras', 33, '2026-10-29T21:30:00-03:00', 'Maracanã'),

  /* =========================================
     RODADA 34 /* TBD */
     ========================================= */
  ('São Paulo', 'Corinthians', 34, '2026-11-04T19:30:00-03:00', 'MorumBIS'),
  ('Palmeiras', 'Botafogo', 34, '2026-11-04T19:30:00-03:00', 'Allianz Parque'),
  ('Vasco da Gama', 'Atlético-MG', 34, '2026-11-04T21:30:00-03:00', 'São Januário'),
  ('Internacional', 'Bahia', 34, '2026-11-04T21:30:00-03:00', 'Beira-Rio'),
  ('Coritiba', 'Fluminense', 34, '2026-11-04T21:30:00-03:00', 'Couto Pereira'),
  ('Chapecoense', 'Cruzeiro', 34, '2026-11-05T19:30:00-03:00', 'Arena Condá'),
  ('Red Bull Bragantino', 'Mirassol', 34, '2026-11-05T19:30:00-03:00', 'Nabi Abi Chedid'),
  ('Remo', 'Flamengo', 34, '2026-11-05T21:30:00-03:00', 'Mangueirão'),
  ('Vitória', 'Grêmio', 34, '2026-11-05T21:30:00-03:00', 'Barradão'),
  ('Athletico-PR', 'Santos', 34, '2026-11-05T21:30:00-03:00', 'Ligga Arena'),

  /* =========================================
     RODADA 35 /* TBD */
     ========================================= */
  ('São Paulo', 'Fluminense', 35, '2026-11-18T19:30:00-03:00', 'MorumBIS'),
  ('Flamengo', 'Palmeiras', 35, '2026-11-18T19:30:00-03:00', 'Maracanã'),
  ('Corinthians', 'Vasco da Gama', 35, '2026-11-18T21:30:00-03:00', 'Neo Química Arena'),
  ('Atlético-MG', 'Internacional', 35, '2026-11-18T21:30:00-03:00', 'Arena MRV'),
  ('Grêmio', 'Remo', 35, '2026-11-18T21:30:00-03:00', 'Arena do Grêmio'),
  ('Bahia', 'Vitória', 35, '2026-11-19T19:30:00-03:00', 'Arena Fonte Nova'),
  ('Mirassol', 'Athletico-PR', 35, '2026-11-19T19:30:00-03:00', 'Estádio Municipal José Maria de Campos Maia'),
  ('Botafogo', 'Coritiba', 35, '2026-11-19T21:30:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Cruzeiro', 'Red Bull Bragantino', 35, '2026-11-19T21:30:00-03:00', 'Mineirão'),
  ('Santos', 'Chapecoense', 35, '2026-11-19T21:30:00-03:00', 'Vila Belmiro'),

  /* =========================================
     RODADA 36 /* TBD */
     ========================================= */
  ('Botafogo', 'São Paulo', 36, '2026-11-21T16:00:00-03:00', 'Estádio Olímpico Nilton Santos'),
  ('Palmeiras', 'Cruzeiro', 36, '2026-11-21T18:30:00-03:00', 'Allianz Parque'),
  ('Vasco da Gama', 'Bahia', 36, '2026-11-21T21:00:00-03:00', 'São Januário'),
  ('Chapecoense', 'Flamengo', 36, '2026-11-22T11:00:00-03:00', 'Arena Condá'),
  ('Internacional', 'Santos', 36, '2026-11-22T16:00:00-03:00', 'Beira-Rio'),
  ('Coritiba', 'Grêmio', 36, '2026-11-22T16:00:00-03:00', 'Couto Pereira'),
  ('Athletico-PR', 'Atlético-MG', 36, '2026-11-22T18:30:00-03:00', 'Ligga Arena'),
  ('Vitória', 'Corinthians', 36, '2026-11-22T18:30:00-03:00', 'Barradão'),
  ('Fluminense', 'Mirassol', 36, '2026-11-22T20:00:00-03:00', 'Maracanã'),
  ('Red Bull Bragantino', 'Remo', 36, '2026-11-23T20:00:00-03:00', 'Nabi Abi Chedid'),

  /* =========================================
     RODADA 37 /* TBD */
     ========================================= */
  ('São Paulo', 'Remo', 37, '2026-11-28T16:00:00-03:00', 'MorumBIS'),
  ('Vasco da Gama', 'Palmeiras', 37, '2026-11-28T18:30:00-03:00', 'São Januário'),
  ('Corinthians', 'Red Bull Bragantino', 37, '2026-11-28T21:00:00-03:00', 'Neo Química Arena'),
  ('Mirassol', 'Grêmio', 37, '2026-11-29T11:00:00-03:00', 'Estádio Municipal José Maria de Campos Maia'),
  ('Flamengo', 'Internacional', 37, '2026-11-29T16:00:00-03:00', 'Maracanã'),
  ('Atlético-MG', 'Bahia', 37, '2026-11-29T16:00:00-03:00', 'Arena MRV'),
  ('Santos', 'Vitória', 37, '2026-11-29T18:30:00-03:00', 'Vila Belmiro'),
  ('Cruzeiro', 'Coritiba', 37, '2026-11-29T18:30:00-03:00', 'Mineirão'),
  ('Chapecoense', 'Botafogo', 37, '2026-11-29T20:00:00-03:00', 'Arena Condá'),
  ('Fluminense', 'Athletico-PR', 37, '2026-11-30T20:00:00-03:00', 'Maracanã'),

  /* =========================================
     RODADA 38 
     ========================================= */
  ('Athletico-PR', 'São Paulo', 38, '2026-12-02T21:30:00-03:00', 'Ligga Arena'),
  ('Flamengo', 'Chapecoense', 38, '2026-12-02T21:30:00-03:00', 'Maracanã'),
  ('Vasco da Gama', 'Vitória', 38, '2026-12-02T21:30:00-03:00', 'São Januário'),
  ('Santos', 'Botafogo', 38, '2026-12-02T21:30:00-03:00', 'Vila Belmiro'),
  ('Palmeiras', 'Coritiba', 38, '2026-12-02T21:30:00-03:00', 'Allianz Parque'),
  ('Red Bull Bragantino', 'Fluminense', 38, '2026-12-02T21:30:00-03:00', 'Nabi Abi Chedid'),
  ('Cruzeiro', 'Internacional', 38, '2026-12-02T21:30:00-03:00', 'Mineirão'),
  ('Grêmio', 'Mirassol', 38, '2026-12-02T21:30:00-03:00', 'Arena do Grêmio'),
  ('Remo', 'Corinthians', 38, '2026-12-02T21:30:00-03:00', 'Mangueirão'),
  ('Bahia', 'Atlético-MG', 38, '2026-12-02T21:30:00-03:00', 'Arena Fonte Nova');