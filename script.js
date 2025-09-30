 <!-- Minimal JS -->
  <script>
  // Mobile nav toggle + close-on-link (lean)
  document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('primaryMenu');
    if (!navToggle || !menu) return;
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      menu.style.display = open ? 'none' : 'flex';
    });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a') && getComputedStyle(navToggle).display !== 'none') {
        navToggle.setAttribute('aria-expanded', 'false');
        menu.style.display = 'none';
      }
    });
  });

  // Services carousel — minimal 5-card recycler (no rebuild, no timers)
  (function(){
    const wrap  = document.querySelector('#services .carousel-wrap');
    const track = document.getElementById('servicesCarousel');
    if (!wrap || !track) return;

    const cards = track.querySelectorAll('.card');
    if (cards.length !== 5) console.warn('[carousel] expected 5 cards, found', cards.length);

    const prev = wrap.querySelector('.car-btn.prev');
    const next = wrap.querySelector('.car-btn.next');
    if (!prev || !next) return;

    track.style.willChange = 'transform';
    track.style.transform  = 'translateX(0)';

    const getGap = () => {
      const cs = getComputedStyle(track);
      const g = parseFloat(cs.columnGap || cs.gap || '0');
      return Number.isFinite(g) ? g : 16;
    };
    const step = () => {
      const first = track.querySelector('.card');
      if (!first) return 1;
      const w = Math.round(first.getBoundingClientRect().width) || first.offsetWidth || 1;
      return Math.max(1, w + Math.round(getGap()));
    };

    let busy = false;
    const move = (dir) => {
      if (busy) return; busy = true;
      const s = step();
      if (dir > 0) { // next
        track.style.transition = 'transform 320ms ease';
        track.style.transform  = `translateX(-${s}px)`;
        track.addEventListener('transitionend', function onEnd(){
          track.removeEventListener('transitionend', onEnd);
          track.style.transition = 'none';
          track.appendChild(track.firstElementChild);
          track.style.transform  = 'translateX(0)';
          void track.offsetHeight;
          busy = false;
        }, { once:true });
      } else { // prev
        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform  = `translateX(-${s}px)`;
        void track.offsetHeight;
        track.style.transition = 'transform 320ms ease';
        track.style.transform  = 'translateX(0)';
        track.addEventListener('transitionend', function onEnd(){
          track.removeEventListener('transitionend', onEnd);
          track.style.transition = 'none';
          busy = false;
        }, { once:true });
      }
    };

    next.addEventListener('click', () => move(1));
    prev.addEventListener('click', () => move(-1));
  })();
  </script>