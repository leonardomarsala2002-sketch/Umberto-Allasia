-- =====================================================================
-- ARTICOLI: data di pubblicazione + stato dell'avviso email
-- =====================================================================

-- 1) Nuove colonne
alter table public.articles add column if not exists published_at timestamptz not null default now();
alter table public.articles add column if not exists notified_at timestamptz;
update public.articles set published_at = created_at where published_at > created_at;

-- 2) I 3 articoli che prima erano scritti nel codice entrano nel database con la loro data.
--    notified_at valorizzato: sono già "vecchi", non devono far partire email.
insert into public.articles (title, category, excerpt, content, image_url, published_at, notified_at)
select * from (values
  ('Perché il dolore cronico non è "tutto nella testa", ma a volte ci passa anche da lì.',
   'Riflessione', null,
   $a$<p>Molti pazienti arrivano in studio stanchi di sentirsi dire che il loro dolore "non ha una causa medica evidente". Questo finisce per farli sentire non ascoltati, o peggio, pazzi.</p><p>Il dolore cronico è reale quanto una frattura, ma risponde a logiche diverse. Il sistema nervoso diventa ipersensibile. È come un sistema d'allarme che continua a suonare anche dopo che l'incendio è stato spento da tempo.</p><p>Nel mio studio non cerchiamo di "spegnere" il dolore con la bacchetta magica, ma lavoriamo per ricalibrare quel sistema d'allarme, unendo tecniche manuali all'educazione sul dolore e all'esercizio.</p>$a$,
   null, timestamptz '2026-05-26 09:00+02', timestamptz '2026-05-26 09:00+02'),
  ('Ha senso prendere appuntamento? Rispondo onestamente.',
   'Domande frequenti', null,
   $a$<p>Molte persone arrivano dopo aver aspettato a lungo.</p><p>Spesso mi dicono di aver provato a gestire il problema da sole, oppure di aver rimandato, sperando che passasse.</p><p>Durante la seduta, una parte importante del mio lavoro è spiegarti cosa sta succedendo. Dare un senso al sintomo, collegarlo alla tua storia, ai tuoi gesti quotidiani, a quello che stai vivendo.</p><p>E questo, molto spesso, cambia già qualcosa. Riduce la preoccupazione, alleggerisce quella sensazione di incertezza, aiuta a capire che il problema può essere affrontato.</p><p>Capita frequentemente che chi arriva mi dica: “forse avrei dovuto muovermi prima”, più per la frustrazione di non aver trovato soluzioni che per la gravità del dolore in sé.</p><p>Non si tratta di arrivare prima o dopo. Si tratta di iniziare a capire.</p>$a$,
   null, timestamptz '2026-04-21 09:00+02', timestamptz '2026-04-21 09:00+02'),
  ('Cosa succede davvero nel primo appuntamento',
   'Approccio', null,
   $a$<p>La prima cosa che faremo è sederci e conoscerci.</p><p>Fin da subito sarai parte attiva della seduta. Non mi interessa solo capire che dolore hai, ma soprattutto come quel dolore entra nella tua vita.</p><p>Ti chiederò quando si presenta durante la giornata, in quali momenti è più intenso e quanto interferisce con ciò che fai ogni giorno: lavoro, studio, tempo libero.</p><p>Voglio comprendere cosa ti limita davvero, cosa hai dovuto modificare o evitare a causa del sintomo.</p><p>Allo stesso tempo, daremo spazio anche a un aspetto spesso trascurato: come ti fa sentire questo problema.</p><p>Portarsi dietro un dolore non è solo una questione fisica, ma anche emotiva. Spesso è un percorso bidirezionale.</p><p>Solo dopo passeremo alla valutazione fisica. Perché un dolore non nasce mai per caso: può essere legato a posture scorrette, a vecchi infortuni o a periodi di particolare stress.</p><p>Il primo appuntamento serve a tracciare una mappa. Il percorso che faremo insieme è il viaggio.</p>$a$,
   null, timestamptz '2026-03-24 09:00+01', timestamptz '2026-03-24 09:00+01')
) as v(title, category, excerpt, content, image_url, published_at, notified_at)
where not exists (select 1 from public.articles a where a.title = v.title);

select id, title, published_at, notified_at from public.articles order by published_at desc;
