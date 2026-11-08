    // Articoli Content
    const articles = {
      1: {
        category: 'Riflessione',
        title: 'Perché il dolore cronico non è "tutto nella testa", ma a volte ci passa anche da lì.',
        content: `<p>Molti pazienti arrivano in studio stanchi di sentirsi dire che il loro dolore "non ha una causa medica evidente". Questo finisce per farli sentire non ascoltati, o peggio, pazzi.</p><p>Il dolore cronico è reale quanto una frattura, ma risponde a logiche diverse. Il sistema nervoso diventa ipersensibile. È come un sistema d'allarme che continua a suonare anche dopo che l'incendio è stato spento da tempo.</p><p>Nel mio studio non cerchiamo di "spegnere" il dolore con la bacchetta magica, ma lavoriamo per ricalibrare quel sistema d'allarme, unendo tecniche manuali all'educazione sul dolore e all'esercizio.</p>`
      },
      2: {
        category: 'Domande frequenti',
        title: 'Ha senso prendere appuntamento? Rispondo onestamente.',
        content: `<p>Molte persone arrivano dopo aver aspettato a lungo.</p><p>Spesso mi dicono di aver provato a gestire il problema da sole, oppure di aver rimandato, sperando che passasse.</p><p>Durante la seduta, una parte importante del mio lavoro è spiegarti cosa sta succedendo. Dare un senso al sintomo, collegarlo alla tua storia, ai tuoi gesti quotidiani, a quello che stai vivendo.</p><p>E questo, molto spesso, cambia già qualcosa. Riduce la preoccupazione, alleggerisce quella sensazione di incertezza, aiuta a capire che il problema può essere affrontato.</p><p>Capita frequentemente che chi arriva mi dica: “forse avrei dovuto muovermi prima”, più per la frustrazione di non aver trovato soluzioni che per la gravità del dolore in sé.</p><p>Non si tratta di arrivare prima o dopo. Si tratta di iniziare a capire.</p>`
      },
      3: {
        category: 'Approccio',
        title: 'Cosa succede davvero nel primo appuntamento',
        content: `<p>La prima cosa che faremo è sederci e conoscerci.</p><p>Fin da subito sarai parte attiva della seduta. Non mi interessa solo capire che dolore hai, ma soprattutto come quel dolore entra nella tua vita.</p><p>Ti chiederò quando si presenta durante la giornata, in quali momenti è più intenso e quanto interferisce con ciò che fai ogni giorno: lavoro, studio, tempo libero.</p><p>Voglio comprendere cosa ti limita davvero, cosa hai dovuto modificare o evitare a causa del sintomo.</p><p>Allo stesso tempo, daremo spazio anche a un aspetto spesso trascurato: come ti fa sentire questo problema.</p><p>Portarsi dietro un dolore non è solo una questione fisica, ma anche emotiva. Spesso è un percorso bidirezionale.</p><p>Solo dopo passeremo alla valutazione fisica.</p><p>Perché un dolore non nasce mai per caso: può essere legato a posture scorrette, a vecchi infortuni o a periodi di particolare stress.</p><p>Il primo appuntamento serve a tracciare una mappa.</p><p>Il percorso che faremo insieme è il viaggio.</p>`
      }
    };

    // Modal e Archive
    const modal = document.getElementById('article-modal');
    const archiveModal = document.getElementById('archive-modal');
    const archiveList = document.getElementById('archive-list');
    const modalCat = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    window.openArticle = function (id) {
      const art = articles[id];
      if (!art) return;
      modalCat.textContent = art.category;
      modalTitle.textContent = art.title;
      modalContent.innerHTML = art.content;
      modal.classList.add('active');
      if (typeof window.lockScroll === 'function') window.lockScroll();
    };

    window.closeArticle = function () {
      modal.classList.remove('active');
      if (!archiveModal.classList.contains('active')) {
        if (typeof window.unlockScroll === 'function') window.unlockScroll();
      }
    };

    window.openArchive = function () {
      archiveList.innerHTML = '';
      const articleKeys = dbArticles.map(a => a.id); // Usa dbArticles per l'archivio
      articleKeys.forEach(id => {
        const art = dbArticles.find(a => a.id == id);
        if (!art) return;
        const card = document.createElement('div');
        card.className = 'storia-card';

        let imageHtml = `
          <div class="ph" style="height:140px; background:var(--bg3);"></div>
        `;
        if (art.image_url) {
          imageHtml = `<img src="${art.image_url}" alt="${art.title}" style="height:140px; width:100%; object-fit:cover;">`;
        }

        card.innerHTML = `
        <div class="storia-img">${imageHtml}</div>
        <div class="storia-body" style="padding:20px;">
          <span class="storia-pill">${art.category}</span>
          <div class="storia-title" style="font-size:1rem;">${art.title}</div>
          <div class="btn-ghost" style="margin-top:10px; font-size:0.8rem;">Leggi di più →</div>
        </div>
      `;
        card.onclick = () => { window.location.href = `articolo.html?id=${id}`; };
        archiveList.appendChild(card);
      });
      archiveModal.classList.add('active');
      if (typeof window.lockScroll === 'function') window.lockScroll();
    };

    // Update News Counts
    const updateNewsCounts = () => {
      const count = Object.keys(articles).length;
      const headerCount = document.getElementById('news-count-header');
      const archiveCount = document.getElementById('news-count-archive');
      if (headerCount) headerCount.textContent = `${count} NEWS`;
      if (archiveCount) archiveCount.textContent = count;
    };
    updateNewsCounts();

    window.closeArchive = function () {
      archiveModal.classList.remove('active');
      if (typeof window.unlockScroll === 'function') window.unlockScroll();
      document.querySelector('.archive-inner').scrollTop = 0;
      document.querySelector('.archive-inner').classList.remove('scrolled');
    };

    // Funzione per gestire l'effetto border sullo scroll dei modal
    window.handleModalScroll = function (el) {
      if (el.scrollTop > 10) {
        el.classList.add('scrolled');
      } else {
        el.classList.remove('scrolled');
      }
    };

    modal.addEventListener('click', (e) => { if (e.target === modal) closeArticle(); });
    archiveModal.addEventListener('click', (e) => { if (e.target === archiveModal) closeArchive(); });

    // --- SUPABASE & ADMIN LOGIC ---
    const SUPABASE_URL = 'https://yqevubcpaloxwjxvqchc.supabase.co';
    // Chiave pubblica (publishable): sicura da tenere nel sito, i permessi sono gestiti dal database
    const SUPABASE_KEY = 'sb_publishable_k1k4T-5GkQphLxlH-OJ2kw_qH2zqBd9';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Gestione Sessione
    async function checkSession() {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        fetchAllData();
      }
    }
    checkSession();

    // --- ADMIN ACCESS TRIGGER ---
    let clicks = 0;
    window.adminLoginTrigger = async function () {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        openAdminPanel();
      } else {
        document.getElementById('login-modal').classList.add('active');
        if (typeof window.lockScroll === 'function') window.lockScroll();
      }
    };

    window.closeLoginModal = function () {
      document.getElementById('login-modal').classList.remove('active');
      if (typeof window.unlockScroll === 'function') window.unlockScroll();
    };

    window.handleLogin = async function () {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const errorMsg = document.getElementById('login-error');

      errorMsg.style.display = 'none';

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        errorMsg.textContent = "Accesso negato. Controlla le credenziali.";
        errorMsg.style.display = 'block';
      } else {
        closeLoginModal();
        openAdminPanel();
        fetchAllData();
      }
    };

    let dbArticles = [];
    let dbSettings = {};

    async function fetchAllData() {
      await fetchArticles();
      await fetchSettings();
    }

    async function fetchArticles() {
      const { data, error } = await supabaseClient
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      const dbEntries = (!error && data) ? data : [];
      const fallbackEntries = Object.keys(articles).map(id => ({ id, ...articles[id] }));
      
      const dbTitles = dbEntries.map(a => a.title);
      const filteredFallbacks = fallbackEntries.filter(f => !dbTitles.includes(f.title));
      
      dbArticles = [...dbEntries, ...filteredFallbacks];
      
      renderArticles();
      if (typeof renderAdminList === 'function') renderAdminList();
      updateNewsCountsExternal();
    }

    async function fetchSettings() {
      const { data, error } = await supabaseClient
        .from('site_settings')
        .select('*');
      if (!error && data) {
        data.forEach(s => {
          let val = s.value;
          dbSettings[s.key] = val;
          const el = document.getElementById('dyn-' + s.key.replace(/_/g, '-'));
          if (el && typeof val === 'string') {
            // Pulizia: spazi e solo le virgolette che racchiudono l'intero testo.
            // (Prima venivano tolti TUTTI gli apostrofi: "c'è" diventava "cè".)
            let sanitizedVal = val.replace(/&nbsp;/g, ' ').trim()
              .replace(/^"([\s\S]*)"$/, '$1').trim();
            if (sanitizedVal.includes('CraFTA')) {
              sanitizedVal = sanitizedVal.replace(/CraFTA/g, '<a href="crafta.html" class="crafta-link">CraFTA</a>');
            }
            
            // Aggiorniamo SOLO se il testo è effettivamente cambiato (considerando lo stile del link)
            if (el.innerHTML.trim() !== sanitizedVal) {
              el.innerHTML = sanitizedVal;
              if (el.classList.contains('typewriter-text') && typeof window.initTypewriter === 'function') {
                const ponte = document.getElementById('ponte');
                const isVisible = ponte && ponte.getBoundingClientRect().top < window.innerHeight;
                window.initTypewriter(el, isVisible); 
              }
            }
          }
        });
      }
    }

    // Rimosso saveSettings manuale, si usa solo visual save

    // --- VISUAL EDIT MODE ---
    let isVisualEditMode = false;

    window.enterVisualEditMode = function () {
      isVisualEditMode = true;
      closeAdminPanel();
      document.getElementById('visual-edit-toolbar').classList.add('active');

      // Rendi editabili tutti i campi dinamici
      const targets = document.querySelectorAll('[id^="dyn-"]');
      targets.forEach(el => {
        el.contentEditable = "true";
        el.style.pointerEvents = "auto";
        // Disabilita i link interni per permettere l'editing senza navigare
        const links = el.querySelectorAll('a');
        links.forEach(l => l.style.pointerEvents = "none");
      });
    };

    window.exitVisualEditMode = function () {
      isVisualEditMode = false;
      document.getElementById('visual-edit-toolbar').classList.remove('active');
      const targets = document.querySelectorAll('[id^="dyn-"]');
      targets.forEach(el => {
        el.contentEditable = "false";
        el.style.pointerEvents = "";
        const links = el.querySelectorAll('a');
        links.forEach(l => l.style.pointerEvents = "");
      });
      fetchSettings(); // Ripristina i testi originali
    };

    window.saveVisualChanges = async function () {
      const targets = document.querySelectorAll('[id^="dyn-"]');
      const updates = [];

      targets.forEach(el => {
        const key = el.id.replace('dyn-', '').replace(/-/g, '_');
        updates.push({ key: key, value: el.innerHTML });
      });

      for (const u of updates) {
        const { error } = await supabaseClient.from('site_settings').upsert(u);
        if (error) { alert("Errore durante il salvataggio di: " + u.key); return; }
      }

      alert("Tutte le modifiche sono state pubblicate online!");
      exitVisualEditMode();
    };

    window.showAdminTab = function (tab) {
      document.getElementById('view-news').style.display = tab === 'news' ? 'block' : 'none';
      document.getElementById('view-settings').style.display = tab === 'settings' ? 'block' : 'none';
      document.getElementById('tab-news').style.opacity = tab === 'news' ? '1' : '0.5';
      document.getElementById('tab-settings').style.opacity = tab === 'settings' ? '1' : '0.5';
    };

    function renderArticles() {
      const container = document.getElementById('storie-container');
      if (container) {
        container.innerHTML = '';
        dbArticles.slice(0, 3).forEach(art => {
          const card = document.createElement('div');
          card.className = 'storia-card fade-up vis';
          card.onclick = () => { window.location.href = `articolo.html?id=${art.id}`; };

          let imageHtml = `
          <div class="ph" style="height:200px;">
            <span class="ph-label" style="font-family:var(--font-serif);font-style:italic;font-size:0.85rem;color:var(--text-mid);opacity:0.5;">[ ${art.category} ]</span>
          </div>
        `;

          if (art.image_url) {
            imageHtml = `<img src="${art.image_url}" alt="${art.title}" style="height:200px; width:100%; object-fit:cover;">`;
          }

          card.innerHTML = `
          <div class="storia-img">${imageHtml}</div>
          <div class="storia-body">
            <span class="storia-pill">${art.category}</span>
            <div class="storia-title">${art.title}</div>
            <p class="storia-excerpt">${art.excerpt || (art.content.replace(/<\/p>|<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 110) + '…')}</p>
            <div class="btn-ghost" style="margin-top:15px;">Leggi di più →</div>
          </div>
        `;
          container.appendChild(card);
        });
      }
    }

    window.openArticleDB = function (id) {
      const art = dbArticles.find(a => a.id == id);
      if (!art) return;
      document.getElementById('modal-category').textContent = art.category;
      document.getElementById('modal-title').textContent = art.title;

      // Gestione Immagine nel Modal
      const imgContainer = document.getElementById('modal-image-container');
      const imgEl = document.getElementById('modal-image');
      if (art.image_url) {
        imgEl.src = art.image_url;
        imgContainer.style.display = 'block';
      } else {
        imgContainer.style.display = 'none';
      }

      document.getElementById('modal-content').innerHTML = art.content;
      document.getElementById('article-modal').classList.add('active');
      if (typeof window.lockScroll === 'function') window.lockScroll();

    };

    function updateNewsCountsExternal() {
      const count = dbArticles.length;
      const headerCount = document.getElementById('news-count-header');
      const archiveCount = document.getElementById('news-count-archive');
      if (headerCount) headerCount.textContent = `${count} NEWS`;
      if (archiveCount) archiveCount.textContent = count;
    }

    // Admin Panel UI
    const adminPanel = document.getElementById('admin-panel');
    function openAdminPanel() {
      adminPanel.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (typeof lenis !== 'undefined') lenis.stop();
      renderAdminList();
    }

    window.closeAdminPanel = function () {
      adminPanel.classList.remove('active');
      document.body.style.overflow = '';
      if (typeof lenis !== 'undefined') lenis.start();
    };

    function renderAdminList() {
      const list = document.getElementById('admin-article-list');
      list.innerHTML = '<h3>Articoli Esistenti (Database + Backup)</h3>';
      dbArticles.forEach(art => {
        const isFallback = typeof art.id === 'string' || art.id < 100; // Esempio logico per backup
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.innerHTML = `
        <span>${art.title} ${isFallback ? '<small style="opacity:0.5; margin-left:10px;">(Backup)</small>' : ''}</span>
        <div>
          <span class="admin-btn-edit" onclick="editArticle(${art.id})">Modifica</span>
          ${!isFallback ? `<span class="admin-btn-delete" onclick="deleteArticle(${art.id})">Elimina</span>` : ''}
        </div>
      `;
        list.appendChild(item);
      });
    }

    window.addNewArticle = function () {
      document.getElementById('edit-id').value = '';
      document.getElementById('edit-title').value = '';
      document.getElementById('edit-category').value = '';
      document.getElementById('edit-excerpt').value = '';
      document.getElementById('edit-content').value = '';
      document.getElementById('edit-image').value = '';
      document.getElementById('btn-notify-email').style.display = 'none'; // Nascondi il tasto notifica per nuovo articolo
      const editor = document.getElementById('editor-view');
      editor.style.display = 'block';
      setTimeout(() => {
        editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    };

    window.editArticle = function (id) {
      const art = dbArticles.find(a => a.id == id);
      if (!art) return;
      document.getElementById('edit-id').value = art.id;
      document.getElementById('edit-title').value = art.title;
      document.getElementById('edit-category').value = art.category;
      document.getElementById('edit-excerpt').value = art.excerpt || '';
      document.getElementById('edit-content').value = art.content;
      document.getElementById('edit-image').value = art.image_url || '';
      document.getElementById('btn-notify-email').style.display = 'block'; // Mostra il tasto notifica solo in modifica
      const editor = document.getElementById('editor-view');
      editor.style.display = 'block';
      setTimeout(() => {
        editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    };

    window.saveArticle = async function () {
      const id = document.getElementById('edit-id').value;
      const articleData = {
        title: document.getElementById('edit-title').value,
        category: document.getElementById('edit-category').value,
        excerpt: document.getElementById('edit-excerpt').value,
        content: document.getElementById('edit-content').value,
        image_url: document.getElementById('edit-image').value
      };

      if (id && !isNaN(id)) {
        const { error } = await supabaseClient.from('articles').update(articleData).eq('id', id);
        if (error) alert("Errore nel salvataggio");
      } else {
        const { error } = await supabaseClient.from('articles').insert([articleData]);
        if (error) alert("Errore nell'inserimento");
      }

      document.getElementById('editor-view').style.display = 'none';
      fetchArticles();
    };

    window.deleteArticle = async function (id) {
      if (confirm("Sei sicuro di voler eliminare questo articolo?")) {
        const { error } = await supabaseClient.from('articles').delete().eq('id', id);
        if (error) alert("Errore");
        else {
          alert("Fatto!");
          fetchArticles();
        }
      }
    };

    // --- NEWSLETTER LOGIC ---
    const CALENDAR_URL = "https://calendar.app.google/roTDcAzyEayNB4Tg6";

    // Escape per mostrare testo inserito dagli utenti senza rischi
    const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    // Iscrive l'email alla newsletter. Ritorna 'ok', 'already' oppure 'error'.
    async function subscribeEmail(rawEmail) {
      const email = String(rawEmail || '').trim().toLowerCase();
      if (!isValidEmail(email)) return 'invalid';
      const { error } = await supabaseClient.from('subscribers').insert({ email });
      if (error && error.code !== '23505') { console.error(error); return 'error'; }
      if (error) return 'already';
      sendWelcomeEmail(email);
      return 'ok';
    }

    // Contatto Brevo + email di benvenuto (il contenuto è definito nella Edge Function)
    async function sendWelcomeEmail(targetEmail) {
      try {
        const { error } = await supabaseClient.functions.invoke('send-email', {
          body: { action: 'subscribe', email: targetEmail }
        });
        if (error) console.error("Welcome email error:", error);
      } catch (e) {
        console.error("Welcome email error:", e);
      }
    }

    window.showAdminTab = function(tab) {
      document.getElementById('view-news').style.display = tab === 'news' ? 'block' : 'none';
      document.getElementById('view-pazienti').style.display = tab === 'pazienti' ? 'block' : 'none';
      
      const newsTab = document.getElementById('tab-news');
      const pazTab = document.getElementById('tab-pazienti');
      
      if (tab === 'news') {
        newsTab.style.opacity = "1"; newsTab.style.color = "var(--accent)";
        pazTab.style.opacity = "0.6"; pazTab.style.color = "var(--text-mid)";
      } else {
        newsTab.style.opacity = "0.6"; newsTab.style.color = "var(--text-mid)";
        pazTab.style.opacity = "1"; pazTab.style.color = "var(--accent)";
        renderSubscribersList();
        renderCallList();
        loadVisitUrl();
      }
    };

    async function renderSubscribersList() {
      const container = document.getElementById('admin-subscribers-list');
      container.innerHTML = '<p style="font-size:0.9rem; opacity:0.5;">Caricamento rubrica...</p>';
      
      const { data, error } = await supabaseClient.from('subscribers').select('*').order('created_at', { ascending: false });
      
      if (error || !data) {
        container.innerHTML = '<p>Errore nel caricamento.</p>';
        return;
      }

      if (data.length === 0) {
        container.innerHTML = '<p style="font-size:0.9rem; opacity:0.5;">Nessun iscritto ancora.</p>';
        return;
      }

      let html = `
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead>
            <tr style="text-align:left; border-bottom:2px solid var(--line);">
              <th style="padding:10px;">Email</th>
              <th style="padding:10px;">Data Iscrizione</th>
              <th style="padding:10px;">Azione</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach(sub => {
        const date = new Date(sub.created_at).toLocaleDateString('it-IT');
        html += `
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px; font-weight:600;">${escapeHtml(sub.email)}</td>
            <td style="padding:10px; color:var(--text-mid);">${date}</td>
            <td style="padding:10px; white-space:nowrap;">
              <span class="js-call-sub" data-email="${escapeHtml(sub.email)}" style="color:var(--green-soft); cursor:pointer; font-weight:600; margin-right:14px;">✓ Chiamata fatta</span>
              <span class="js-del-sub" data-email="${escapeHtml(sub.email)}" style="color:#d9534f; cursor:pointer; font-weight:600;">Elimina</span>
            </td>
          </tr>
        `;
      });

      html += '</tbody></table>';
      container.innerHTML = html;
      container.querySelectorAll('.js-del-sub').forEach(el => {
        el.addEventListener('click', () => deleteSubscriber(el.dataset.email));
      });
      container.querySelectorAll('.js-call-sub').forEach(el => {
        el.addEventListener('click', () => markCallDone(el.dataset.email));
      });
    }

    window.deleteSubscriber = async function(email) {
      if (!confirm(`Vuoi rimuovere ${email} dalla lista?`)) return;
      const { error } = await supabaseClient.from('subscribers').delete().eq('email', email);
      if (!error) {
        alert("Paziente rimosso con successo.");
        renderSubscribersList();
      } else {
        alert("Errore durante l'eliminazione. Assicurati di aver configurato i permessi SQL (Policy delete).");
        console.error(error);
      }
    };

    window.handleCallOption = function(e) {
      if (e) e.stopPropagation();
      document.getElementById('booking-collect').classList.add('active');
    };

    // Chiudi la card se si clicca fuori
    window.addEventListener('click', function(e) {
      const collect = document.getElementById('booking-collect');
      const card = document.getElementById('option-call');
      
      if (collect && collect.classList.contains('active') && !card.contains(e.target)) {
        collect.classList.remove('active');
      }
    });

    window.directRedirect = function() {
      window.open(CALENDAR_URL, '_blank');
    };

    // --- VISITA IN STUDIO: si sblocca solo dopo che la chiamata è stata segnata come conclusa ---
    let visitUrl = null;

    window.handleVisitOption = function() {
      if (visitUrl) window.open(visitUrl, '_blank');
    };

    function setVisitMsg(text, ok) {
      const msg = document.getElementById('visit-gate-msg');
      if (!msg) return;
      msg.textContent = text;
      msg.classList.toggle('ok', !!ok);
    }

    function unlockVisit(url) {
      visitUrl = url;
      const card = document.getElementById('option-visit');
      const gate = document.getElementById('visit-gate');
      const btn = document.getElementById('visit-book-btn');
      if (card) card.classList.remove('locked');
      if (gate) gate.hidden = true;
      if (btn) btn.hidden = false;
    }

    window.checkVisitAccess = async function(silentEmail) {
      const input = document.getElementById('visit-email');
      const btn = document.getElementById('visit-check-btn');
      const email = String(silentEmail || input?.value || '').trim().toLowerCase();
      if (!isValidEmail(email)) { if (!silentEmail) setVisitMsg("Inserisci un'email valida."); return; }

      if (btn && !silentEmail) { btn.disabled = true; btn.textContent = '...'; }
      const { data, error } = await supabaseClient.rpc('check_visit_access', { p_email: email });
      if (btn && !silentEmail) { btn.disabled = false; btn.textContent = 'Verifica'; }

      if (error) { if (!silentEmail) setVisitMsg('Errore di connessione, riprova tra poco.'); return; }
      if (data === null) {
        try { localStorage.removeItem('visit_email'); } catch (e) {}
        if (!silentEmail) setVisitMsg("Per questa email non risulta ancora una chiamata conclusa. Prenota prima la chiamata conoscitiva: dopo la chiamata potrai prenotare la visita qui.");
        return;
      }
      try { localStorage.setItem('visit_email', email); } catch (e) {}
      if (data === '') {
        setVisitMsg("Chiamata confermata! Il calendario delle visite sarà disponibile a breve.", true);
        return;
      }
      unlockVisit(data);
    };

    window.subscribeAndRedirect = async function() {
      const email = document.getElementById('book-email').value;
      if (!isValidEmail(email.trim())) {
        alert("Inserisci un'email valida per proseguire o clicca su 'prosegui senza lasciarla'.");
        return;
      }
      // Apriamo subito il calendario (evita il blocco dei popup), l'iscrizione prosegue in background
      window.open(CALENDAR_URL, '_blank');
      subscribeEmail(email);
      // Precompiliamo l'email nella card della visita: si sbloccherà dopo la chiamata
      const visitInput = document.getElementById('visit-email');
      if (visitInput && !visitInput.value) visitInput.value = email.trim();
    };

    window.footerSubscribe = async function() {
      const el = document.getElementById('newsletter-input');
      const msg = document.getElementById('nl-msg');
      const res = await subscribeEmail(el.value);
      msg.textContent = {
        ok: "Grazie! Iscrizione riuscita.",
        already: "Sei già iscritto, grazie!",
        invalid: "Inserisci un'email valida.",
        error: "Errore, riprova tra poco."
      }[res];
      msg.style.opacity = "1";
      if (res === 'ok' || res === 'already') el.value = "";
      setTimeout(() => { msg.style.opacity = "0"; }, 3500);
    };

    window.storySubscribe = async function() {
      const el = document.getElementById('story-newsletter-input');
      const msg = document.getElementById('story-nl-msg');
      const res = await subscribeEmail(el.value);
      msg.textContent = {
        ok: "Iscrizione avvenuta con successo! Benvenuto.",
        already: "Sei già iscritto, grazie!",
        invalid: "Inserisci un'email valida.",
        error: "Errore, riprova tra poco."
      }[res];
      if (res === 'ok' || res === 'already') el.value = "";
      setTimeout(() => { msg.textContent = ""; }, 4000);
    };

    window.scrollToNewsletter = function() {
      const footer = document.querySelector('footer');
      if (footer) {
        // Se Lenis è attivo, lo usiamo per uno scroll perfetto
        if (typeof lenis !== 'undefined') {
          lenis.scrollTo(footer, {
            offset: -100,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          // Fallback se Lenis non è caricato
          footer.scrollIntoView({ behavior: 'smooth' });
        }

        setTimeout(() => {
          const input = document.getElementById('newsletter-input');
          if (input) {
            input.focus();
            input.parentElement.style.transition = "box-shadow 0.4s";
            input.parentElement.style.boxShadow = "0 0 0 4px var(--accent-soft)";
            setTimeout(() => { input.parentElement.style.boxShadow = ""; }, 3000);
          }
        }, 1200);
      }
    };

    window.sendNewsletterToAll = async function() {
      const title = document.getElementById('edit-title').value;
      const excerpt = document.getElementById('edit-excerpt').value;
      
      // Recupera iscritti dal DB
      const { data: subs, error } = await supabaseClient.from('subscribers').select('email');
      if (error || !subs || subs.length === 0) {
        alert("Nessun iscritto trovato a cui inviare l'email.");
        return;
      }

      if (!confirm(`Vuoi inviare una notifica email a ${subs.length} pazienti?`)) return;

      // Invia newsletter (via Edge Function: una email separata per ogni iscritto)
      try {
        const articleId = document.getElementById('edit-id').value || null;
        const { data, error: funcError } = await supabaseClient.functions.invoke('send-email', {
          body: { action: 'newsletter', title, excerpt, articleId }
        });

        if (!funcError) {
          alert(`Email inviate con successo a ${data?.sent ?? subs.length} pazienti!`);
        } else {
          alert("Errore nell'invio delle email tramite la funzione Supabase.");
          console.error(funcError);
        }
      } catch (e) {
        alert("Errore tecnico durante l'invio.");
        console.error(e);
      }
    };

    // --- ADMIN: chiamate concluse e link visita ---
    async function renderCallList() {
      const box = document.getElementById('admin-call-list');
      if (!box) return;
      const { data, error } = await supabaseClient.from('call_completed').select('*').order('completed_at', { ascending: false });
      if (error) { box.innerHTML = '<p class="admin-hint">Errore nel caricamento.</p>'; return; }
      if (!data.length) { box.innerHTML = '<p class="admin-hint">Nessuna chiamata segnata come conclusa.</p>'; return; }
      box.innerHTML = '<ul class="admin-call-list">' + data.map(c => `
        <li><span><strong>${escapeHtml(c.email)}</strong> <small>${new Date(c.completed_at).toLocaleDateString('it-IT')}</small></span>
        <span class="admin-btn-delete js-undo-call" data-email="${escapeHtml(c.email)}">Annulla</span></li>`).join('') + '</ul>';
      box.querySelectorAll('.js-undo-call').forEach(el => el.addEventListener('click', () => removeCallDone(el.dataset.email)));
    }

    window.markCallDone = async function(rawEmail) {
      const email = String(rawEmail || '').trim().toLowerCase();
      if (!isValidEmail(email)) { alert("Email non valida"); return; }
      const { error } = await supabaseClient.from('call_completed').upsert({ email, completed_at: new Date().toISOString() });
      if (error) { alert("Errore nel salvataggio"); console.error(error); return; }
      const input = document.getElementById('call-done-email');
      if (input) input.value = '';
      renderCallList();
    };

    async function removeCallDone(email) {
      if (!confirm(`Annullare la chiamata conclusa per ${email}? Non potrà più prenotare la visita dal sito.`)) return;
      const { error } = await supabaseClient.from('call_completed').delete().eq('email', email);
      if (error) { alert("Errore"); console.error(error); return; }
      renderCallList();
    }

    async function loadVisitUrl() {
      const input = document.getElementById('visit-url-input');
      if (!input) return;
      const { data } = await supabaseClient.from('private_settings').select('value').eq('key', 'visit_booking_url').maybeSingle();
      input.value = data?.value || '';
      document.getElementById('visit-url-msg').textContent = input.value ? '' : "⚠️ Link non ancora impostato: chi ha concluso la chiamata vedrà \"calendario disponibile a breve\".";
    }

    window.saveVisitUrl = async function() {
      const input = document.getElementById('visit-url-input');
      const msg = document.getElementById('visit-url-msg');
      const value = input.value.trim();
      if (value && !/^https:\/\//.test(value)) { msg.textContent = 'Il link deve iniziare con https://'; return; }
      const { error } = await supabaseClient.from('private_settings').upsert({ key: 'visit_booking_url', value });
      msg.textContent = error ? 'Errore nel salvataggio.' : 'Link salvato ✓';
    };

    // Carica tutto all'avvio
    fetchAllData();
    // Se il visitatore aveva già verificato la sua email, ricontrolla (lo sblocco dipende sempre dal database)
    try {
      const savedVisitEmail = localStorage.getItem('visit_email');
      localStorage.removeItem('has_contacted'); // vecchio sblocco non più usato
      if (savedVisitEmail) checkVisitAccess(savedVisitEmail);
    } catch (e) {}
    // Accesso admin rapido: aggiungi #admin all'indirizzo del sito
    if (location.hash === '#admin') setTimeout(() => adminLoginTrigger(), 300);
