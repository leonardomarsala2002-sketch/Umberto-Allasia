-- =====================================================================
-- SICUREZZA DATABASE — Il Fisioterapista (progetto Supabase "Umberto Allasia")
-- Da incollare UNA volta in: Supabase → SQL Editor → New query → Run
-- Si può rieseguire senza problemi.
--
-- Cosa fa:
--  * Testi del sito (site_settings) e articoli: tutti li leggono,
--    solo gli amministratori li modificano.
--  * Iscritti newsletter: chiunque può iscriversi, solo gli
--    amministratori vedono o cancellano la lista.
--  * Amministratori = gli utenti che esistono già oggi in Authentication.
-- =====================================================================

-- 1) Tabella amministratori (inizialmente: tutti gli utenti già registrati)
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
insert into public.admins (email)
  select lower(email) from auth.users where email is not null
  on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 2) Rimuove tutte le regole di accesso esistenti sulle tre tabelle
do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('site_settings', 'articles', 'subscribers')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

alter table public.site_settings enable row level security;
alter table public.articles      enable row level security;
alter table public.subscribers   enable row level security;

-- 3) Testi del sito
create policy "lettura pubblica" on public.site_settings
  for select using (true);
create policy "modifica admin" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 4) Articoli
create policy "lettura pubblica" on public.articles
  for select using (true);
create policy "modifica admin" on public.articles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5) Iscritti newsletter
create policy "iscrizione pubblica" on public.subscribers
  for insert to anon, authenticated
  with check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' and length(email) <= 254);
create policy "lettura admin" on public.subscribers
  for select to authenticated using (public.is_admin());
create policy "cancellazione admin" on public.subscribers
  for delete to authenticated using (public.is_admin());

-- 6) Controllo finale: elenco amministratori
select email as amministratori from public.admins;
