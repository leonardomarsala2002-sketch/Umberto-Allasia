    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

    function pickSlot(btn) {
      document.querySelectorAll('.slot').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
    }

    window.addEventListener('scroll', () => {
      const nav = document.querySelector('nav');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      nav.style.padding = scrollTop > 40 ? '12px 48px' : '20px 48px';
      
      // Mappatura completa delle sezioni e dei loro colori
      const sections = ['home', 'ponte', 'approccio', 'percorso', 'come-lavoro', 'storie', 'recensioni', 'prenota'];
      const beige2 = ['ponte', 'percorso', 'storie']; // var(--bg2)
      const beige3 = ['recensioni']; // var(--bg3)
      let current = "home";

      sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop;
          // Cambia colore non appena l'header tocca l'area della sezione
          if (scrollTop >= (sectionTop - 40)) {
            current = id;
          }
        }
      });

      // Gestione colore Nav in base alla sezione toccata
      nav.classList.remove('nav-bg-white', 'nav-bg-beige2', 'nav-bg-beige3', 'nav-bg-dark');
      
      if (beige2.includes(current)) {
        nav.classList.add('nav-bg-beige2');
      } else if (beige3.includes(current)) {
        nav.classList.add('nav-bg-beige3');
      } else if (scrollTop + 100 >= document.body.offsetHeight - 400) {
        // Se l'header tocca il Footer (andando quasi a fine pagina)
        nav.classList.add('nav-bg-dark');
      } else {
        nav.classList.add('nav-bg-white');
      }

      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
          a.classList.add('active');
        }
      });
    });

    const cards = document.querySelectorAll('.hero-float-card, .hero-float-card2');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10.5;
        const rotateY = ((x - centerX) / centerX) * 10.5;

        card.style.transform = `perspective(400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.transition = 'transform 0.15s ease-out';
        card.style.animation = 'none';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(400px) rotateX(0deg) rotateY(0deg)`;
        card.style.transition = 'transform 0.4s ease';

        // Riattiva l'animazione di fluttuazione dopo il reset
        setTimeout(() => {
          card.style.animation = '';
        }, 400);
      });

      card.addEventListener('click', () => {
        if (card.classList.contains('hero-float-card2')) return; // Salta l'animazione per le recensioni

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const container = document.createElement('div');
        container.className = 'celebration-overlay';
        container.style.zIndex = '10001';
        document.body.appendChild(container);

        const emojis = ['🎉', '🎊', '🎂', '🥳'];
        for (let i = 0; i < 20; i++) {
          const el = document.createElement('div');
          el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          el.style.position = 'absolute';
          el.style.left = centerX + 'px';
          el.style.top = centerY + 'px';
          el.style.fontSize = (1 + Math.random()) + 'rem';
          el.style.userSelect = 'none';
          container.appendChild(el);

          const angle = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 120;
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist;

          el.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.2) rotate(${Math.random() * 360}deg)`, opacity: 0 }
          ], { duration: 1200, easing: 'cubic-bezier(0.1, 0.5, 0.5, 1)', fill: 'forwards' });
        }
        setTimeout(() => container.remove(), 1200);
      });
    });

    const triggerCelebration = () => {
      const overlay = document.createElement('div');
      overlay.className = 'celebration-overlay';
      document.body.appendChild(overlay);
      const colors = ['#B07D55', '#C9A07A', '#D4A843', '#7A9E87', '#F5EFE6'];
      const emojis = ['🎉', '🎊', '🎂', '🥳'];
      for (let i = 0; i < 120; i++) {
        const isEmoji = Math.random() > 0.8;
        const el = document.createElement('div');
        el.className = isEmoji ? 'popper' : 'confetti';
        if (isEmoji) { el.textContent = emojis[Math.floor(Math.random() * emojis.length)]; }
        else { el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; }
        const side = Math.floor(Math.random() * 4);
        let x, y;
        if (side === 0) { x = Math.random() * 100; y = -10; }
        else if (side === 1) { x = 110; y = Math.random() * 100; }
        else if (side === 2) { x = Math.random() * 100; y = 110; }
        else { x = -10; y = Math.random() * 100; }
        el.style.left = x + 'vw'; el.style.top = y + 'vh';
        overlay.appendChild(el);
        const destX = 30 + Math.random() * 40;
        const destY = 30 + Math.random() * 40;
        el.animate([
          { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${(destX - x)}vw, ${(destY - y)}vh) rotate(${720 + Math.random() * 1440}deg)`, opacity: 0 }
        ], { duration: 2500 + Math.random() * 1500, easing: 'cubic-bezier(0.1, 0.5, 0.5, 1)', fill: 'forwards' });
      }
      setTimeout(() => {
        overlay.style.transition = 'opacity 1s'; overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000);
      }, 3500);
    };

    const counterEl = document.querySelector('.mini-card-num');
    if (counterEl) {
      let accumulatedTime = 0;
      let lastTime = null;
      let isIntersecting = false;
      let animationStarted = false;

      const updateCount = (now) => {
        if (!lastTime) lastTime = now;
        const delta = now - lastTime;
        lastTime = now;

        // Se la pagina è nascosta o l'elemento non è nel mirino, non avanziamo il tempo del contatore
        if (document.hidden || !isIntersecting) {
            if (accumulatedTime < 2000) requestAnimationFrame(updateCount);
            return;
        }

        accumulatedTime += delta;
        const progress = Math.min(accumulatedTime / 2000, 1);
        const val = Math.floor(progress * (2 - progress) * 20); // easeOutQuad
        counterEl.textContent = val + (val === 20 ? '+' : '');

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          triggerCelebration();
        }
      };

      const countObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          isIntersecting = e.isIntersecting;
          if (isIntersecting && !animationStarted) {
            animationStarted = true;
            requestAnimationFrame(updateCount);
          }
        });
      }, { threshold: 0.1 }); // Soglia più bassa per una risposta più rapida
      countObs.observe(counterEl);
    }

    // Typewriter effect for Ponte
    window.initTypewriter = function(el, showImmediate = false) {
      if (!el) return;
      const htmlContent = el.innerHTML;
      el.innerHTML = '';
      
      // Creiamo un elemento temporaneo per processare il contenuto
      const temp = document.createElement('div');
      temp.innerHTML = htmlContent;
      
      [...temp.childNodes].forEach(node => {
        if (node.nodeType === 3) { // Testo
          const text = node.textContent;
          [...text].forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char' + (showImmediate ? ' visible' : '');
            if (char === ' ') span.innerHTML = '&nbsp;';
            el.appendChild(span);
          });
        } else if (node.nodeName === 'BR') { // Ritorno a capo
          el.appendChild(document.createElement('br'));
        }
      });
    };

    document.querySelectorAll('.typewriter-text').forEach(el => window.initTypewriter(el));

    window.typeText = async (el) => {
      if (!el) return;
      const chars = el.querySelectorAll('.char');
      for (let i = 0; i < chars.length; i++) {
        await new Promise(r => setTimeout(r, 25)); // Velocità di battuta
        chars[i].classList.add('visible');
      }
    };

    const ponteSection = document.querySelector('.ponte');
    const typeObserver = new IntersectionObserver(async entries => {
      if (entries[0].isIntersecting) {
        typeObserver.unobserve(ponteSection);
        const title = ponteSection.querySelector('.ponte-title');
        const sub = ponteSection.querySelector('.ponte-sub');

        await typeText(title);
        await new Promise(r => setTimeout(r, 500)); // Pausa tra le due frasi
        await typeText(sub);
      }
    }, { threshold: 0.3 });

    if (ponteSection) typeObserver.observe(ponteSection);

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinksUl = document.getElementById('nav-links');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinksUl.classList.toggle('active');
      });
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenuBtn.classList.remove('active');
          navLinksUl.classList.remove('active');
        });
      });
    }

    // PROGRESS BAR Logic
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      const bar = document.getElementById("progressBar");
      if (bar) bar.style.width = scrolled + "%";
    });

    // COOKIE BANNER Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const trustindexContainer = document.getElementById('trustindex-container');

    // Funzione per caricare script di terze parti (es. Trustindex per le recensioni)
    function loadThirdPartyScripts() {
      if (trustindexContainer && !document.getElementById('trustindex-script')) {
        trustindexContainer.innerHTML = ''; // Rimuove il messaggio di avviso
        const script = document.createElement('script');
        script.id = 'trustindex-script';
        script.defer = true;
        script.async = true;
        script.src = 'https://cdn.trustindex.io/loader.js?a6abdf067269292a4c867201a01';
        trustindexContainer.appendChild(script);
      }
    }

    window.addEventListener('click', (e) => {
        // 1. Intercettazione Recensioni Google (Trustindex)
        const readMoreBtn = e.target.closest('.ti-read-more-active');
        const reviewItem = e.target.closest('.ti-review-item');
        
        if (readMoreBtn && reviewItem) {
          e.preventDefault();
          e.stopPropagation();
          
          const name = reviewItem.querySelector('.ti-name')?.textContent?.trim() || "Paziente";
          
          // Pulizia profonda del testo: rimuoviamo link "leggi tutto" e testi di verifica Trustindex
          let contentClone = reviewItem.querySelector('.ti-review-content')?.cloneNode(true);
          if (contentClone) {
            // Rimuoviamo eventuali script o testi di sistema
            contentClone.querySelectorAll('.ti-read-more, .ti-read-more-active, span[style*="display: none"]').forEach(el => el.remove());
            // Se c'è il testo di verifica in fondo, lo cerchiamo e rimuoviamo (spesso è un testo libero o in un div specifico)
          }
          
          const fullText = contentClone?.innerHTML?.split('Trustindex verifica')[0]?.trim() || "";
          const avatarSrc = reviewItem.querySelector('.ti-profile-img img')?.src || "https://i.pravatar.cc/100?u=" + encodeURIComponent(name);
          const reviewDate = reviewItem.querySelector('.ti-date')?.textContent?.trim() || "Recensione recente";
          
          // Apriamo il nostro modal invece di quello di Trustindex
          modalCat.textContent = "Recensione Google";
          modalTitle.textContent = "Testimonianza";
          
          modalContent.innerHTML = `
            <div class="google-review-modal-style">
              <div class="gr-header">
                <img src="${avatarSrc}" class="gr-avatar" alt="${name}">
                <div class="gr-info">
                  <div class="gr-name"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}+recensione" target="_blank" class="gr-author-link">${name}</a> <span class="gr-g-badge">G</span></div>
                  <div class="gr-meta">
                    <span class="gr-stars">★★★★★</span>
                    <span class="gr-date">${reviewDate}</span>
                  </div>
                </div>
              </div>
              <div class="gr-body">
                "${fullText}"
              </div>
              <div class="gr-footer">
                <div class="gr-source-meta">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
                  Pubblicata originariamente su Google Maps
                </div>
              </div>
            </div>
          `;
          
          modal.classList.add('active');
          lockScroll();
          return;
        }

        // 2. Gestione generica dello scroll lock per altri popup (sicurezza)
        setTimeout(() => {
            const trustPopup = document.querySelector('.ti-widget-lightbox, .ti-v-fixed, .ti-modal.ti-show');
            const isTrustVisible = trustPopup && getComputedStyle(trustPopup).display !== 'none';
            const isOurModalVisible = document.querySelector('.article-modal.active') || 
                                     document.querySelector('.archive-modal.active') ||
                                     document.querySelector('.admin-modal.active');
            
            if (isTrustVisible || isOurModalVisible) {
                lockScroll();
            } else {
                unlockScroll();
            }
        }, 150);
    }, true); // Fase di cattura per anticipare i widget esterni

    // Verifica stato cookie al caricamento
    const cookieStatus = localStorage.getItem('cookiesAccepted');
    if (cookieStatus === 'true') {
      loadThirdPartyScripts();
    } else if (!cookieStatus) {
      if (cookieBanner) {
        setTimeout(() => {
          cookieBanner.classList.add('show');
        }, 1500); // Mostra il banner
      }
    }

    window.acceptCookies = function () {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
      loadThirdPartyScripts(); // Carica le recensioni ora che c'è il consenso
    };

    window.rejectCookies = function () {
      localStorage.setItem('cookiesAccepted', 'false');
      cookieBanner.classList.remove('show');
    };

    // --- GESTIONE AVANZATA SCROLL LOCK ---
    let scrollPos = 0;
    
    window.lockScroll = function() {
      if (document.body.classList.contains('modal-open')) return;
      scrollPos = window.scrollY;
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      document.body.style.top = `-${scrollPos}px`;
      if (typeof lenis !== 'undefined') lenis.stop();
    }

    window.unlockScroll = function() {
      if (!document.body.classList.contains('modal-open')) return;
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollPos);
      if (typeof lenis !== 'undefined') lenis.start();
    }

    // Monitoraggio continuo per popup di terze parti (Trustindex)
    setInterval(() => {
        const trustPopup = document.querySelector('.ti-widget-lightbox, .ti-v-fixed, .ti-modal.ti-show');
        const isTrustVisible = trustPopup && getComputedStyle(trustPopup).display !== 'none';
        
        const isOurModalVisible = document.querySelector('.article-modal.active') || 
                                 document.querySelector('.archive-modal.active') ||
                                 document.querySelector('.admin-modal.active');
        
        if (isTrustVisible || isOurModalVisible) {
            lockScroll();
            
            // Tentativo di mostrare solo la recensione corrente nel widget Trustindex
            if (isTrustVisible) {
                const reviews = document.querySelectorAll('.ti-widget-lightbox-review-container .ti-review-item');
                if (reviews.length > 1) {
                    // Se Trustindex mostra più recensioni, cerchiamo di focalizzare quella attiva
                    // Nota: Questo è un intervento sperimentale sul widget esterno
                    reviews.forEach(r => {
                        if (r.getBoundingClientRect().width === 0) return; // Salta se nascosto
                    });
                }
            }
        } else {
            unlockScroll();
        }
    }, 250);

