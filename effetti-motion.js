// Effetti in movimento: D (luce che segue il mouse), E (scorrimento), F (card 3D).
// Si attivano solo se su <html> c'è la classe corrispondente (fx-d, fx-e, fx-f).
(function () {
  const html = document.documentElement;
  const CARD_SEL = '.step-card, .storia-card, .booking-option-card, .pullquote, .mini-card, .map-wrap';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const on = (c) => html.classList.contains(c);

  let spot = null;
  function ensureSpot() {
    if (!spot) { spot = document.createElement('div'); spot.id = 'fx-spot'; document.body.appendChild(spot); }
  }
  function tagCards() { document.querySelectorAll(CARD_SEL).forEach(c => c.classList.add('fx-card')); }

  // --- D: luce che segue il mouse (con inerzia morbida) ---
  let mx = innerWidth / 2, my = innerHeight / 2, sx = mx, sy = my, spotVisible = false;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!spotVisible) { spotVisible = true; spot && spot.style.setProperty('--spot-o', 1); }
    const card = e.target.closest && e.target.closest(CARD_SEL);
    if (!card) return;
    card.classList.add('fx-card');
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    if (on('fx-d')) { card.style.setProperty('--cx', (px * 100) + '%'); card.style.setProperty('--cy', (py * 100) + '%'); }
    if (on('fx-f') && canHover && !reduceMotion) {
      card.classList.add('fx-tilting');
      card.style.setProperty('--rx', ((0.5 - py) * 4).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((px - 0.5) * 5).toFixed(2) + 'deg');
      card.style.setProperty('--shine', (130 - px * 160) + '%');
    }
  }, { passive: true });
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) { spotVisible = false; spot && spot.style.setProperty('--spot-o', 0); }
    const card = e.target.closest && e.target.closest(CARD_SEL);
    if (card && !card.contains(e.relatedTarget)) {
      card.classList.remove('fx-tilting');
      card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
    }
  }, { passive: true });

  // --- E: scorrimento (parallasse + ombre che cambiano con la posizione) ---
  function updateScroll() {
    const vh = innerHeight;
    document.querySelectorAll('.section, .ponte').forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      // -1 quando la sezione entra dal basso, +1 quando esce in alto
      const p = ((vh / 2) - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      s.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3));
    });
    const hero = document.getElementById('home');
    if (hero) hero.style.setProperty('--hero-p', Math.min(1, Math.max(0, scrollY / vh)).toFixed(3));
    document.querySelectorAll('.fx-card').forEach(c => {
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      // luce dall'alto: più la card scende nello schermo, più l'ombra si allunga
      const t = Math.max(0, Math.min(1, (r.top + r.height / 2) / vh));
      c.style.setProperty('--sh', t.toFixed(3));
    });
  }

  let ticking = false;
  function loop() {
    if (on('fx-d') && canHover) {
      ensureSpot();
      sx += (mx - sx) * 0.12; sy += (my - sy) * 0.12;
      spot.style.setProperty('--mx', sx.toFixed(1) + 'px');
      spot.style.setProperty('--my', sy.toFixed(1) + 'px');
    }
    if (on('fx-e') && !reduceMotion && ticking) { updateScroll(); ticking = false; }
    requestAnimationFrame(loop);
  }
  const onScroll = () => { ticking = true; };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  function init() {
    tagCards();
    // Le card degli articoli arrivano dal database dopo il caricamento
    new MutationObserver(() => { tagCards(); ticking = true; })
      .observe(document.body, { childList: true, subtree: true });
    ticking = true;
    requestAnimationFrame(loop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
