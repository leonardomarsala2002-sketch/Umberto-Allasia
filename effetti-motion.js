// Effetti in movimento: D (luce che segue il mouse), E (scorrimento), F (card 3D).
// Si attivano solo se su <html> c'è la classe corrispondente (fx-d, fx-e, fx-f).
// Tutte le card usano lo stesso comportamento (classi .fx-card / .fx-hover, vedi effetti.css).
(function () {
  const html = document.documentElement;
  // Tutti i riquadri del sito che devono reagire allo stesso modo
  const CARD_SEL = [
    '.step-card', '.storia-card', '.booking-option-card', '.pullquote',
    '.mini-card', '.hero-float-card', '.hero-float-card2', '.cta-box', '.fx-box'
  ].join(', ');
  const MAX_SHIFT_PX = 7;   // di quanto si "alza" un bordo inclinando: uguale per card piccole e grandi
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const on = (c) => html.classList.contains(c);

  let spot = null;
  function ensureSpot() {
    if (!spot) { spot = document.createElement('div'); spot.id = 'fx-spot'; document.body.appendChild(spot); }
  }
  function tagCards() {
    document.querySelectorAll(CARD_SEL).forEach(c => {
      if (c.classList.contains('fx-card')) return;
      if (c.closest('.admin-modal')) return; // niente effetti nel pannello admin
      c.classList.add('fx-card');
      if (getComputedStyle(c).position === 'static') c.classList.add('fx-rel');
    });
  }

  // --- Card: ingresso, movimento e uscita del mouse ---
  let current = null;
  function leave(card) {
    if (!card) return;
    card.classList.remove('fx-hover');
    card.style.removeProperty('--rx'); card.style.removeProperty('--ry');
  }
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    const card = e.target.closest ? e.target.closest('.fx-card') : null;
    if (card !== current) { leave(current); current = card; if (card && canHover) card.classList.add('fx-hover'); }
    if (!card || !canHover) return;
    const r = card.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    card.style.setProperty('--cx', (px * 100).toFixed(1) + '%');
    card.style.setProperty('--cy', (py * 100).toFixed(1) + '%');
    if (on('fx-f') && !reduceMotion) {
      // angolo calcolato sulla misura della card: lo spostamento visibile è lo stesso per tutte
      const maxY = Math.atan(MAX_SHIFT_PX / (r.width / 2)) * 180 / Math.PI;
      const maxX = Math.atan(MAX_SHIFT_PX / (r.height / 2)) * 180 / Math.PI;
      card.style.setProperty('--ry', ((px - 0.5) * 2 * maxY).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - py) * 2 * maxX).toFixed(2) + 'deg');
      card.style.setProperty('--shine', (130 - px * 160).toFixed(0) + '%');
    }
  }, { passive: true });
  document.addEventListener('mouseleave', () => { leave(current); current = null; });

  // --- D: alone che segue il mouse, solo sulle parti chiare (spento su footer e barra scura) ---
  let mx = innerWidth / 2, my = innerHeight / 2, sx = mx, sy = my;
  function updateSpotVisibility(e) {
    if (!spot) return;
    const overDark = e && e.target && e.target.closest && e.target.closest('footer, nav.nav-bg-dark, .admin-modal, #cookie-banner');
    spot.style.setProperty('--spot-o', overDark ? 0 : 1);
  }
  document.addEventListener('mouseover', updateSpotVisibility, { passive: true });
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget && spot) spot.style.setProperty('--spot-o', 0); }, { passive: true });

  // --- E: scorrimento (parallasse + ombre che cambiano con la posizione) ---
  function updateScroll() {
    const vh = innerHeight;
    document.querySelectorAll('.section, .ponte').forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = ((vh / 2) - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      s.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3));
    });
    const hero = document.getElementById('home');
    if (hero) hero.style.setProperty('--hero-p', Math.min(1, Math.max(0, scrollY / vh)).toFixed(3));
    document.querySelectorAll('.fx-card').forEach(c => {
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const t = Math.max(0, Math.min(1, (r.top + r.height / 2) / vh)); // luce dall'alto
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
    let pending = false;
    new MutationObserver(() => {
      if (pending) return; pending = true;
      requestAnimationFrame(() => { pending = false; tagCards(); ticking = true; });
    }).observe(document.body, { childList: true, subtree: true });
    ticking = true;
    requestAnimationFrame(loop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
