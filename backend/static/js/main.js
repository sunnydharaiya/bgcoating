/* ==========================================================================
   BG GROUP · INTERACTION & UTILITIES SCRIPT
   Site-wide JavaScript
   ========================================================================== */
(function() {
  function initApp() {
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
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const drawerClose = document.getElementById('drawerClose');

    function setDrawerOpen(open) {
      if (!drawer) return;
      drawer.classList.toggle('open', open);
      if (burger) {
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      if (drawerBackdrop) {
        drawerBackdrop.classList.toggle('show', open);
      }
      document.body.style.overflow = open ? 'hidden' : '';
    }

    window.__setDrawerOpen = setDrawerOpen;

    if (burger && drawer) {
      burger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = drawer.classList.contains('open');
        setDrawerOpen(!isOpen);
      });

      if (drawerClose) {
        drawerClose.addEventListener('click', (e) => {
          e.preventDefault();
          setDrawerOpen(false);
        });
      }

      if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', () => setDrawerOpen(false));
      }

      drawer.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
          setDrawerOpen(false);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
          setDrawerOpen(false);
        }
      });
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

    /* Counter animation for elements with [data-count] */
    const counterElements = document.querySelectorAll('[data-count]:not([data-done="1"])');
    if (counterElements.length > 0) {
      const cIo = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            const el = en.target;
            cIo.unobserve(el);
            el.setAttribute('data-done', '1');
            const raw = el.getAttribute('data-count');
            const target = parseInt(raw, 10);
            if (isNaN(target)) return;
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = Math.min(1600, Math.max(600, target > 1000 ? 1200 : target * 12));
            const start = performance.now();
            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              const val = Math.floor(ease * target);
              el.textContent = val.toLocaleString() + suffix;
              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                el.textContent = target.toLocaleString() + suffix;
              }
            }
            requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.15 });
      counterElements.forEach(el => cIo.observe(el));
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

    /* Before / After Slider interactions (pointer drag + touch + keyboard) */
    const baContainers = document.querySelectorAll('.ba');
    baContainers.forEach(ba => {
      const handle = ba.querySelector('.ba-handle');
      let isDragging = false;

      function updatePosition(clientX) {
        const rect = ba.getBoundingClientRect();
        if (rect.width <= 0) return;
        const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.round((offsetX / rect.width) * 100);
        ba.style.setProperty('--pos', percent + '%');
        if (handle) {
          handle.setAttribute('aria-valuenow', percent);
        }
      }

      ba.addEventListener('pointerdown', (e) => {
        isDragging = true;
        ba.classList.add('dragging');
        ba.setPointerCapture(e.pointerId);
        updatePosition(e.clientX);
      });

      ba.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        updatePosition(e.clientX);
      });

      function stopDragging(e) {
        if (!isDragging) return;
        isDragging = false;
        ba.classList.remove('dragging');
        try {
          ba.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }

      ba.addEventListener('pointerup', stopDragging);
      ba.addEventListener('pointercancel', stopDragging);

      // Keyboard arrow control for accessibility
      if (handle) {
        handle.addEventListener('keydown', (e) => {
          let currentPos = parseFloat(getComputedStyle(ba).getPropertyValue('--pos')) || 50;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            const newPos = Math.max(0, currentPos - 5);
            ba.style.setProperty('--pos', newPos + '%');
            handle.setAttribute('aria-valuenow', newPos);
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            const newPos = Math.min(100, currentPos + 5);
            ba.style.setProperty('--pos', newPos + '%');
            handle.setAttribute('aria-valuenow', newPos);
          }
        });
      }

      // Fallback for range inputs if present
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

    /* Visitor duration & stay time tracking via periodic heartbeat & beacon */
    (function initDurationTracker() {
      let visitHash = document.querySelector('meta[name="visit-hash"]')?.getAttribute('content');
      if (!visitHash) {
        const match = document.cookie.match(/(?:^|;\s*)bg_visit_hash=([^;]+)/);
        if (match) visitHash = decodeURIComponent(match[1]);
      }
      if (!visitHash) {
        visitHash = 'vh_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        try {
          document.cookie = 'bg_visit_hash=' + encodeURIComponent(visitHash) + '; path=/; max-age=86400; SameSite=Lax';
        } catch (e) {}
      }

      const startTime = Date.now();
      let lastReportedSec = 0;

      function sendDuration(isFinal) {
        const elapsedSec = Math.round((Date.now() - startTime) / 1000);
        if (elapsedSec <= lastReportedSec && !isFinal) return;
        lastReportedSec = elapsedSec;

        const payload = JSON.stringify({
          visit_hash: visitHash,
          duration: elapsedSec,
          page_url: window.location.pathname
        });

        const endpoint = '/api/v1/visitors/duration/';

        if (isFinal && navigator.sendBeacon) {
          try {
            const blob = new Blob([payload], { type: 'application/json' });
            navigator.sendBeacon(endpoint, blob);
            return;
          } catch (e) {}
        }

        try {
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: Boolean(isFinal)
          }).catch(() => {});
        } catch (e) {}
      }

      // Heartbeat every 15 seconds
      setInterval(() => {
        sendDuration(false);
      }, 15000);

      // On visibility change to hidden or page unload
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          sendDuration(true);
        }
      });

      window.addEventListener('pagehide', () => sendDuration(true));
      window.addEventListener('beforeunload', () => sendDuration(true));
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
