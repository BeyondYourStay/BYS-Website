// instagram like button animation (about page)
(function () {
  const likeBtn = document.getElementById('igLikeBtn');
  if (!likeBtn) return;

  let isLiked = false;
  const heart = likeBtn.querySelector('.ig-heart-icon');
  const countSpan = likeBtn.querySelector('.ig-count');
  let likeCount = parseInt(countSpan.textContent);

  likeBtn.addEventListener('click', (e) => {
    isLiked = !isLiked; // toggle
    
    if (isLiked) {
      likeBtn.classList.add('liked');
      likeCount++;
      countSpan.textContent = likeCount;
      
      // create floating hearts
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const floatingHeart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          floatingHeart.setAttribute('viewBox', '0 0 24 24');
          floatingHeart.setAttribute('class', 'ig-floating-heart');
          floatingHeart.style.left = (likeBtn.offsetLeft + 14) + 'px';
          floatingHeart.style.top = (likeBtn.offsetTop + 14) + 'px';
          floatingHeart.innerHTML = '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>';
          likeBtn.closest('.ig-story-overlay').appendChild(floatingHeart);
          
          setTimeout(() => floatingHeart.remove(), 1500);
        }, i * 100);
      }
    } else {
      likeBtn.classList.remove('liked');
      likeCount--;
      countSpan.textContent = likeCount;
    }
  });
})();

// founder story video autoplay on scroll (about page)
(function () {
  const founderVideo = document.getElementById('founderVideo');
  if (!founderVideo) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        founderVideo.play();
      } else {
        founderVideo.pause();
        founderVideo.currentTime = 0;
      }
    });
  }, { threshold: 0.5 });

  observer.observe(founderVideo);
})();

// mobile hamburger menu: open/close the full-screen nav panel
(function () {
  const toggle = document.getElementById('navToggle');
  const menu = document.querySelector('header nav ul');
  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }
  
  function openMenu() {
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    document.body.classList.add('nav-open');
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) closeMenu(); else openMenu();
  });
  
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
})();

// (page transitions disabled for now)

// nav scroll state
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// language: NL (root) and EN (/en/...) are now separate static pages, not a
// client-side text swap. The header switcher is a plain link to the
// counterpart URL. We only remember an explicit choice (via that link, or
// the homepage banner below) so the banner doesn't reappear on a later visit.
function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}
function setLangCookie(value) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = 'bys_lang=' + value + ';max-age=' + oneYear + ';path=/';
}
document.querySelectorAll('.lang a[data-lang-switch]').forEach((a) => {
  a.addEventListener('click', () => setLangCookie(a.dataset.langSwitch));
});

// first-visit language banner (homepage only): offer English to browsers
// with an English language preference, without ever auto-redirecting
(function () {
  const banner = document.getElementById('langBanner');
  if (!banner) return;
  if (getCookie('bys_lang')) return;
  const prefersEnglish = (navigator.language || '').toLowerCase().startsWith('en');
  if (!prefersEnglish) return;
  banner.classList.add('visible');
  banner.querySelectorAll('[data-lang-switch]').forEach((a) => {
    a.addEventListener('click', () => setLangCookie(a.dataset.langSwitch));
  });
  const dismiss = banner.querySelector('[data-lang-dismiss]');
  if (dismiss) dismiss.addEventListener('click', () => {
    setLangCookie('nl');
    banner.classList.remove('visible');
  });
})();

// industry rail: click-and-drag horizontal scroll (mouse wheel is left alone,
// so the page always scrolls normally even when hovering the rail)
const rail = document.getElementById('rail');
if (rail) {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  rail.addEventListener('mousedown', (e) => {
    isDown = true;
    moved = false;
    startX = e.pageX;
    startScroll = rail.scrollLeft;
    rail.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    rail.style.cursor = '';
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    rail.scrollLeft = startScroll - dx;
  });
  // prevent the drag from also triggering a click on the panel underneath
  rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}

// animated counters
const counters = document.querySelectorAll('.counter-item .num');
if (counters.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const valEl = el.querySelector('.val');
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        valEl.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));
}

// marquees (client logos, testimonials): only start the scroll animation once
// fonts and images have fully loaded, so the track's width can't shift mid-animation
// and cause a visible jump/snap.
(function () {
  const tracks = document.querySelectorAll('.marquee-track, .t-marquee-track');
  if (!tracks.length) return;

  const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();

  tracks.forEach((track) => {
    const imgs = Array.from(track.querySelectorAll('img'));
    const imgsReady = imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });
    Promise.all([fontsReady, ...imgsReady]).then(() => {
      track.classList.add('is-ready');
    });
  });
})();

// short-form video clips inside case modals: click to play/pause,
// pause any other clip that's already playing
(function () {
  const clips = document.querySelectorAll('.case-video');
  if (!clips.length) return;

  clips.forEach((clip) => {
    const video = clip.querySelector('video');
    if (!video) return;

    clip.addEventListener('click', () => {
      if (video.paused) {
        document.querySelectorAll('.case-video video').forEach((v) => {
          if (v !== video) { v.pause(); v.closest('.case-video').classList.remove('is-playing'); }
        });
        video.play();
        clip.classList.add('is-playing');
      } else {
        video.pause();
        clip.classList.remove('is-playing');
      }
    });

    video.addEventListener('ended', () => clip.classList.remove('is-playing'));
  });

  // stop any playing clip when its modal closes
  document.querySelectorAll('.case-modal-close, .case-modal-overlay').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el.classList.contains('case-modal-overlay') && e.target !== el) return;
      document.querySelectorAll('.case-video video').forEach((v) => {
        v.pause();
        v.currentTime = 0;
        v.closest('.case-video').classList.remove('is-playing');
      });
    });
  });
})();

(function () {
  if (!document.getElementById('heroWord')) return;

  const words = {
    en: [
      'hotel', 'wine bar', 'campsite', 'museum', 'spa',
      'boutique hotel', 'boat tour', 'bistro', 'glamping site', 'escape room',
      'sauna', 'resort', 'walking tour', 'brewery', 'holiday park',
      'theme park', 'wellness retreat', 'bed & breakfast', 'day trip', 'restaurant'
    ],
    nl: [
      'hotel', 'wijnbar', 'camping', 'museum', 'spa',
      'boutique hotel', 'boottocht', 'bistro', 'glampingsite', 'escape room',
      'sauna', 'resort', 'stadswandeling', 'brouwerij', 'vakantiepark',
      'pretpark', 'wellnessretraite', 'bed & breakfast', 'dagtocht', 'restaurant'
    ]
  };

  let lang = document.documentElement.lang === 'nl' ? 'nl' : 'en';
  let i = 0;

  function render() {
    const el = document.getElementById('heroWord');
    if (el) el.textContent = words[lang][i];
  }

  function tick() {
    const el = document.getElementById('heroWord');
    if (!el) return;
    el.classList.add('is-out');
    setTimeout(() => {
      i = (i + 1) % words[lang].length;
      render();
      const elAfter = document.getElementById('heroWord');
      if (elAfter) elAfter.classList.remove('is-out');
    }, 420);
  }

  render();
  setInterval(tick, 2600);
})();

// case detail modal (Cases / Portfolio page)
const caseOverlay = document.getElementById('caseModalOverlay');
if (caseOverlay) {
  const caseClose = document.getElementById('caseModalClose');
  const caseCards = document.querySelectorAll('[data-modal]');

  function openCaseModal(id) {
    document.querySelectorAll('.case-modal').forEach(m => m.classList.remove('active'));
    const modal = document.getElementById('modal-' + id);
    if (!modal) return;
    modal.classList.add('active');
    caseOverlay.classList.add('active');
    caseOverlay.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeCaseModal() {
    caseOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  caseCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => openCaseModal(card.dataset.modal));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCaseModal(card.dataset.modal); }
    });
  });

  if (caseClose) caseClose.addEventListener('click', closeCaseModal);
  caseOverlay.addEventListener('click', (e) => { if (e.target === caseOverlay) closeCaseModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCaseModal(); });

  // open the matching modal automatically when the page is loaded with a #<id> hash
  const initialModalId = location.hash.slice(1);
  if (initialModalId && document.getElementById('modal-' + initialModalId)) {
    openCaseModal(initialModalId);
  }
} else {
  // homepage case cards: link straight through to the matching case on /cases/
  const homeCaseCards = document.querySelectorAll('.case[data-modal]');
  if (homeCaseCards.length) {
    const casesPath = document.documentElement.lang === 'nl' ? '/cases/' : '/en/cases/';
    homeCaseCards.forEach(card => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      const goToCase = () => { window.location.href = casesPath + '#' + card.dataset.modal; };
      card.addEventListener('click', goToCase);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToCase(); }
      });
    });
  }
}

// Contact Form AJAX Handler - No redirect, stays on page


document.querySelectorAll('.footer-compass-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const wrap = btn.closest('.fn-form-wrap');
    const input = wrap.querySelector('input[type="email"]');
    if (!input.value || !input.value.includes('@')) {
      input.focus();
      return;
    }
    
    // Send to Formspree
    const formData = new FormData();
    formData.append('email', input.value);
    
    try {
      await fetch('https://formspree.io/f/maewnrqv', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      console.error('Email send failed:', e);
    }
    
    // Show success message
    const note = wrap.querySelector('.footer-compass-note');
    note.classList.add('visible');
    input.value = '';
  });
});

// Force video audio on any user interaction
document.addEventListener('click', () => {
  const video = document.getElementById('founderVideo');
  if (video && video.muted) {
    video.muted = false;
    video.play();
  }
}, { once: true });
