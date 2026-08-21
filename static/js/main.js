/* ==========================================================================
   BG GROUP · INTERACTION & UTILITIES SCRIPT
   Site-wide JavaScript
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky header state */
  const header = document.getElementById('siteHeader');
  const toTop = document.getElementById('toTop');
  
  window.addEventListener('scroll', () => {
    const s = window.scrollY > 30;
    if (header) header.classList.toggle('scrolled', s);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 300);
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* Mobile drawer menu */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.addEventListener('click', e => { if (e.target.tagName === 'A') burger.click(); });
  }

  /* Reveal on scroll */
  const rvElements = document.querySelectorAll('.rv, .rv-d1, .rv-d2, .rv-d3, .rv-d4');
  if (rvElements.length > 0) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });

    rvElements.forEach(el => io.observe(el));
  }

  /* DFT gauge needle sweep */
  const gc = document.getElementById('gaugeCard');
  if (gc) {
    new IntersectionObserver((es, o) => es.forEach(en => {
      if (en.isIntersecting) { gc.classList.add('in'); o.disconnect(); }
    }), { threshold: .5 }).observe(gc);
  }

  /* Set current copyright year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Before / After Slider interactions */
  const baContainers = document.querySelectorAll('.ba');
  baContainers.forEach(ba => {
    const range = ba.querySelector('.ba-range');
    if (range) {
      range.addEventListener('input', (e) => {
        ba.style.setProperty('--pos', e.target.value + '%');
      });
    }
  });

  /* Simple Category filter for Gallery & Blog pages if present */
  const filterBtns = document.querySelectorAll('.fbtn, .bfbtn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter') || this.getAttribute('data-cat');
      const targetGrid = document.querySelectorAll('.pcard, .bcard');

      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      targetGrid.forEach(card => {
        const cat = card.getAttribute('data-cat') || card.getAttribute('data-category');
        if (filter === 'all' || !filter || cat === filter) {
          card.classList.remove('hide');
          card.classList.add('shown');
        } else {
          card.classList.add('hide');
          card.classList.remove('shown');
        }
      });
    });
  });
});
