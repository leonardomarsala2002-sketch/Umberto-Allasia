-- =====================================================================
-- SBLOCCO "VISITA IN STUDIO" SOLO DOPO LA CHIAMATA CONOSCITIVA
-- Da eseguire una volta in Supabase → SQL Editor (si può rieseguire).
--
-- Come funziona:
--  * L'amministratore, dopo aver fatto la chiamata, segna l'email del
--    paziente come "chiamata conclusa" dal pannello admin.
--  * Sul sito il paziente inserisce la sua email nella card "Visita in
--    studio": se la chiamata risulta conclusa riceve il link per prenotare.
--  * Il link della visita non è scritto nel sito: lo restituisce solo il
--    database, e solo a chi ha concluso la chiamata.
-- =====================================================================

-- Pazienti che hanno concluso la chiamata (separati dalla newsletter)
create table if not exists public.call_completed (
  email text primary key,
  completed_at timestamptz not null default now(),
  note text
);
alter table public.call_completed enable row level security;

-- Impostazioni private (non leggibili dal pubblico)
create table if not exists public.private_settings (
  key text primary key,
  value text
);
alter table public.private_settings enable row level security;
insert into public.private_settings (key, value) values ('visit_booking_url', '')
  on conflict (key) do nothing;

-- Regole: solo gli amministratori leggono e modificano
drop policy if exists "admin call_completed" on public.call_completed;
create policy "admin call_completed" on public.call_completed
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin private_settings" on public.private_settings;
create policy "admin private_settings" on public.private_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Funzione pubblica: dato un'email, restituisce il link della visita
-- solo se la chiamata risulta conclusa.
--   null  -> chiamata non (ancora) conclusa
--   ''    -> chiamata conclusa ma link non ancora configurato
--   'https://...' -> link per prenotare la visita
create or replace function public.check_visit_access(p_email text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when exists (
      select 1 from public.call_completed
      where email = lower(trim(coalesce(p_email, '')))
    )
    then coalesce((select value from public.private_settings where key = 'visit_booking_url'), '')
    else null
  end;
$$;

revoke all on function public.check_visit_access(text) from public;
grant execute on function public.check_visit_access(text) to anon, authenticated;

select 'ok' as stato;
