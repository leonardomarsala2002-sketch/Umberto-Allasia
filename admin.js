    // Articoli Content
    const articles = {
      1: {
        category: 'Riflessione',
        title: 'Perché il dolore cronico non è "tutto nella testa" — ma a volte ci passa anche da lì.',
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
      },
      4: {
        category: 'Postura',
        title: 'La postura perfetta non esiste. Ecco cosa conta davvero.',
        content: `<p>Siamo cresciuti con l'idea che esista una "posizione giusta" per stare seduti o in piedi. La ricerca scientifica moderna ci dice invece che la postura migliore è... la prossima.</p><p>Il corpo umano è fatto per muoversi. Il dolore non nasce da una schiena curva, ma dal mantenere la stessa posizione (anche quella "dritta") per troppo tempo. L'immobilità è il vero nemico, non la gobba.</p><p>Invece di sforzarti di stare dritto come un soldato, impara ad ascoltare quando il tuo corpo ti chiede di cambiare posizione.</p>`
      },
      5: {
        category: 'Benessere',
        title: 'Il respiro: il primo strumento di cura a tua disposizione.',
        content: `<p>Semplice, gratuito, immediato. Eppure quasi nessuno respira bene. Spesso usiamo solo la parte alta del torace, mantenendo i muscoli del collo in tensione costante.</p><p>La respirazione diaframmatica non serve solo a rilassarsi: è un massaggio viscerale e un segnale biochimico che diciamo al nostro sistema nervoso che siamo al sicuro. Questo abbassa istantaneamente la soglia del dolore.</p><p>Dedico sempre una parte delle mie sedute al respiro, perché è l'unico strumento che il paziente può portarsi a casa e usare ovunque, in ogni momento.</p>`
      },
      6: {
        category: 'Sport',
        title: 'Sport e infortuni: quando fermarsi e quando continuare.',
        content: `<p>Il binomio "ho dolore = devo stare fermo" è uno dei miti più difficili da sfatare. In realtà, il movimento guidato è spesso la cura migliore per un infortunio.</p><p>Il segreto sta nel trovare il "carico ottimale": quel livello di attività che non peggiora il sintomo ma permette al tessuto di rigenerarsi e rinforzarsi. Fermarsi completamente, spesso, indebolisce il corpo e allunga i tempi di recupero.</p><p>Il mio lavoro con gli sportivi è capire fin dove possiamo spingerci oggi per essere più forti domani, senza mai forzare i tempi biologici della guarigione.</p>`
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
        if (!art) return; // Aggiunto controllo per articoli non trovati
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
          <div class="btn-ghost" style="margin-top:10px; font-size:0.8rem;">Leggi di più ?</div>
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
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZXZ1YmNwYWxveHdqeHZxY2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzczMDYsImV4cCI6MjA4OTMxMzMwNn0.26eD-teceo9UVlXUFycP9DCBO77ZmN92ljnTlWtt4jQ';
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

      if (!error && data && data.length > 0) {
        dbArticles = data;
        renderArticles();
        if (typeof renderAdminList === 'function') renderAdminList();
        updateNewsCountsExternal();
      } else {
        dbArticles = Object.keys(articles).map(id => ({ id, ...articles[id] }));
        renderArticles();
        if (typeof renderAdminList === 'function') renderAdminList();
      }
    }

    async function fetchSettings() {
      const { data, error } = await supabaseClient
        .from('site_settings')
        .select('*');
      if (!error && data) {
        data.forEach(s => {
          dbSettings[s.key] = s.value;
          const el = document.getElementById('dyn-' + s.key.replace(/_/g, '-'));
          if (el) el.innerHTML = s.value;
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
            <p class="storia-excerpt">${art.excerpt || (art.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...')}</p>
            <div class="btn-ghost" style="margin-top:15px;">Leggi di più ?</div>
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
      list.innerHTML = '<h3>Articoli Esistenti</h3>';
      dbArticles.forEach(art => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.innerHTML = `
        <span>${art.title}</span>
        <div>
          <span class="admin-btn-edit" onclick="editArticle(${art.id})">Modifica</span>
          <span class="admin-btn-delete" onclick="deleteArticle(${art.id})">Elimina</span>
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

      if (id) {
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
        if (error) alert("Errore nell'eliminazione");
        fetchArticles();
      }
    };

    // --- NEWSLETTER LOGIC ---
    const CALENDAR_URL = "https://calendar.app.google/roTDcAzyEayNB4Tg6";

    async function sendWelcomeEmail(targetEmail) {
      // Sincronizza il contatto con Brevo CRM (via Edge Function)
      try {
        await supabaseClient.functions.invoke('send-email', {
          body: { action: 'subscribe', email: targetEmail }
        });
      } catch(e) { console.error("Brevo sync error", e); }

      // Invia la mail di benvenuto (via Edge Function)
      try {
        await supabaseClient.functions.invoke('send-email', {
          body: {
            action: 'send',
            to: [targetEmail],
            subject: "Benvenuto! Grazie per esserti iscritto",
            htmlContent: `
              <div style="background-color: #FEFCF9; padding: 40px 20px; font-family: 'Helvetica', Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(176,125,85,0.1); border: 1px solid #E2D8CC;">
                  <div style="background: #FBF7F2; padding: 40px; text-align: center; border-bottom: 1px solid #E2D8CC;">
                    <div style="font-size: 24px; color: #2C2420; font-weight: bold; letter-spacing: 1px;">IL <span style="font-style: italic; color: #B07D55;">FISIOTERAPISTA</span></div>
                  </div>
                  <div style="padding: 40px;">
                    <h2 style="color: #2C2420; font-size: 22px; margin-bottom: 20px; font-weight: 500;">Benvenuto nel mio spazio digitale</h2>
                    <p style="color: #6B5E55; line-height: 1.7; font-size: 16px; margin-bottom: 20px;">Ciao! Ti ringrazio per aver scelto di rimanere in contatto.</p>
                    <p style="color: #6B5E55; line-height: 1.7; font-size: 16px; margin-bottom: 30px;">Da oggi riceverai direttamente via email i miei consigli sulla salute, le storie di chi ha ritrovato il movimento e le ultime news dallo studio di San Marino.</p>
                    <div style="padding-top: 20px; border-top: 1px solid #F5EFE6;">
                      <p style="color: #6B5E55; line-height: 1.7; font-size: 16px; margin-bottom: 5px;">A presto,</p>
                      <p style="color: #B07D55; font-size: 18px; font-weight: bold; margin: 0;">Umberto Allasia</p>
                    </div>
                  </div>
                  <div style="background: #2C2420; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #EDE4D8; margin: 0; opacity: 0.8;">San Marino — Str. Ca' Vagnetto, 3</p>
                  </div>
                </div>
              </div>
            `
          }
        });
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
            <td style="padding:10px; font-weight:600;">${sub.email}</td>
            <td style="padding:10px; color:var(--text-mid);">${date}</td>
            <td style="padding:10px;"><span onclick="deleteSubscriber('${sub.email}')" style="color:#d9534f; cursor:pointer; font-weight:600;">Elimina</span></td>
          </tr>
        `;
      });

      html += '</tbody></table>';
      container.innerHTML = html;
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

    window.showEmailCollect = function() {
      document.getElementById('main-book-btn').style.display = 'none';
      document.getElementById('booking-collect').style.display = 'block';
    };

    window.directRedirect = function() {
      window.open(CALENDAR_URL, '_blank');
    };

    window.subscribeAndRedirect = async function() {
      const email = document.getElementById('book-email').value;
      if (email && email.includes('@')) {
        const { error } = await supabaseClient.from('subscribers').upsert({ email: email });
        if (!error) {
          console.log("Subscribed:", email);
          sendWelcomeEmail(email); // Invia email di benvenuto
        }
      }
      window.open(CALENDAR_URL, '_blank');
    };

    window.footerSubscribe = async function() {
      const el = document.getElementById('newsletter-input');
      const msg = document.getElementById('nl-msg');
      const email = el.value.trim();
      if (!email || !email.includes('@')) return;

      const { error } = await supabaseClient.from('subscribers').upsert({ email: email });
      if (!error) {
        msg.textContent = "Grazie! Iscrizione riuscita.";
        msg.style.opacity = "1";
        el.value = "";
        sendWelcomeEmail(email); // Invia email di benvenuto
        setTimeout(() => { msg.style.opacity = "0"; }, 3000);
      } else {
        msg.textContent = "Errore o già iscritto.";
        msg.style.opacity = "1";
      }
    };

    window.storySubscribe = async function() {
      const el = document.getElementById('story-newsletter-input');
      const msg = document.getElementById('story-nl-msg');
      const email = el.value.trim();
      if (!email || !email.includes('@')) return;

      const { error } = await supabaseClient.from('subscribers').upsert({ email: email });
      if (!error) {
        msg.textContent = "Iscrizione avvenuta con successo! Benvenuto.";
        el.value = "";
        sendWelcomeEmail(email);
        setTimeout(() => { msg.textContent = ""; }, 4000);
      } else {
        msg.textContent = "Sei già iscritto o c'è un errore.";
      }
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

      const emails = subs.map(s => s.email);
      
      // Invia newsletter (via Edge Function)
      try {
        const { data, error: funcError } = await supabaseClient.functions.invoke('send-email', {
          body: {
            action: 'send',
            to: emails,
            subject: "Nuova storia pubblicata: " + title,
            htmlContent: `
              <div style="background-color: #FEFCF9; padding: 40px 20px; font-family: 'Helvetica', Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(176,125,85,0.1); border: 1px solid #E2D8CC;">
                  <div style="background: #FBF7F2; padding: 40px; text-align: center; border-bottom: 1px solid #E2D8CC;">
                    <div style="font-size: 14px; color: #B07D55; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Nuova Storia</div>
                    <h1 style="color: #2C2420; font-size: 28px; margin: 0; font-weight: 500;">${title}</h1>
                  </div>
                  <div style="padding: 40px;">
                    <p style="color: #6B5E55; line-height: 1.8; font-size: 17px; margin-bottom: 30px;">${excerpt}</p>
                    <a href="https://umberto-allasia.vercel.app/" style="display: inline-block; background: #B07D55; color: #ffffff; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(176,125,85,0.3);">Continua a leggere sul sito</a>
                    <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #F5EFE6;">
                      <p style="color: #6B5E55; line-height: 1.7; font-size: 15px; margin: 0;">Un caro saluto,</p>
                      <p style="color: #B07D55; font-size: 17px; font-weight: bold; margin: 5px 0 0 0;">Umberto Allasia</p>
                    </div>
                  </div>
                  <div style="background: #FBF7F2; padding: 20px; text-align: center; border-top: 1px solid #E2D8CC;">
                    <p style="font-size: 11px; color: #A8998F; margin: 0;">Ricevi questa comunicazione perché sei iscritto alla newsletter di ilfisioterapista.sm</p>
                  </div>
                </div>
              </div>
            `
          }
        });

        if (!funcError) {
          alert("Email inviate con successo a tutti i pazienti!");
        } else {
          alert("Errore nell'invio delle email tramite la funzione Supabase.");
          console.error(funcError);
        }
      } catch (e) {
        alert("Errore tecnico durante l'invio.");
        console.error(e);
      }
    };

    // Carica tutto all'avvio
    fetchAllData();
