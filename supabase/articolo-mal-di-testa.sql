-- Nuovo articolo per la sezione "Pensieri & Storie"
-- (si può modificare o eliminare in qualsiasi momento dal pannello admin)
insert into public.articles (title, category, excerpt, content, image_url)
values (
  'Mal di testa e collo: quando il dolore parte da più in basso di quanto pensi',
  'Approfondimento',
  'Non tutti i mal di testa nascono nella testa. A volte la radice è nel collo, nella mandibola o nel modo in cui passiamo le giornate.',
  $art$<p>«Ho sempre mal di testa, ma gli esami sono tutti a posto.» È una frase che sento spesso, e capisco la frustrazione che c'è dietro.</p><p>Molte persone convivono per anni con un dolore che parte dalla nuca, sale dietro gli occhi o si ferma sulle tempie. Prendono qualcosa, aspettano che passi, e intanto imparano a organizzare le giornate intorno a quel fastidio.</p><p>Quello che spesso non viene detto è che non tutti i mal di testa nascono nella testa. Il collo, la mandibola e i muscoli delle spalle sono collegati in modo stretto: quando una di queste zone lavora male per tanto tempo, il dolore può presentarsi proprio lì, sopra, dove meno te lo aspetti.</p><p>Pensa a quante ore passiamo con lo sguardo rivolto in basso, verso un telefono o un computer. A quanto stringiamo i denti nei periodi di stress, spesso senza accorgercene. A come dormiamo, a come respiriamo quando siamo tesi.</p><p>Nel mio lavoro non parto dal sintomo, ma dalla tua storia. Ti chiederò quando compare il dolore, cosa lo peggiora, cosa lo allevia, cosa stai vivendo in questo periodo. Poi valuteremo insieme come si muovono il collo, le spalle e la mandibola.</p><p>Non sempre il problema è lì, ed è giusto dirlo. Ma quando lo è, lavorare su queste zone, con la terapia manuale e con qualche esercizio da portare nella tua quotidianità, può cambiare davvero il modo in cui vivi le tue giornate.</p><p>Se il mal di testa è diventato una presenza fissa, non serve abituarsi. Serve iniziare a capire da dove arriva.</p>$art$,
  null
);

select id, title, category, created_at from public.articles order by created_at desc;
