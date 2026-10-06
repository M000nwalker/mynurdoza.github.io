/* ================================================================
   K.M. MYNURDOZA — PORTFOLIO JAVASCRIPT
================================================================ */

'use strict';

// ================================================================
// STAR FIELD CANVAS
// ================================================================
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let animFrame;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.003 + 0.001,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(ts * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 225, 255, ${a})`;
      ctx.fill();
    }
    animFrame = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();
  requestAnimationFrame(draw);
})();


// ================================================================
// NAVBAR
// ================================================================
(function initNav() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Scroll state
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click (mobile)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Active link highlight
  const sections = document.querySelectorAll('section[id]');

  function highlightNavLink() {
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 100;
      if (window.scrollY >= top) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
})();


// ================================================================
// HERO PHOTO FALLBACK
// ================================================================
(function initHeroPhoto() {
  const img = document.getElementById('hero-img');
  if (!img) return;
  img.addEventListener('error', () => {
    const wrap = document.getElementById('hero-photo-slot');
    if (wrap) wrap.classList.add('no-photo');
    img.style.display = 'none';
    const fallback = wrap && wrap.querySelector('.photo-fallback');
    if (fallback) fallback.style.display = 'flex';
  });
})();


// ================================================================
// ABOUT PHOTO FALLBACK
// ================================================================
(function initAboutPhoto() {
  const img = document.getElementById('about-img');
  if (!img) return;
  img.addEventListener('error', () => {
    const wrap = img.closest('.about-photo-wrap');
    if (wrap) wrap.style.display = 'none';
  });
})();


// ================================================================
// SCROLL REVEAL
// ================================================================
(function initReveal() {
  const targets = document.querySelectorAll(
    '.timeline-card, .skill-card, .achieve-card, .eca-card, .cert-card, .project-card, .about-photo-wrap, .about-text'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => io.observe(el));
})();






// ================================================================
// CONTACT FORM
// ================================================================
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = document.getElementById('contact-submit');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const action = form.getAttribute('action');
    if (action.includes('YOUR_FORM_ID')) {
      status.textContent = '⚠️ Please set up Formspree: replace YOUR_FORM_ID in index.html with your endpoint.';
      status.className = 'form-note error';
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (res.ok) {
        status.textContent = '✓ Message sent! I'll get back to you soon.';
        status.className = 'form-note success';
        form.reset();
      } else {
        throw new Error('Network error');
      }
    } catch {
      status.textContent = '✕ Something went wrong. Please email me directly.';
      status.className = 'form-note error';
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
  });
})();


// ================================================================
// FOOTER YEAR
// ================================================================
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


// ================================================================
// SMOOTH HOVER TILT for Cards (subtle)
// ================================================================
(function initTilt() {
  const cards = document.querySelectorAll('.achieve-card, .skill-card, .eca-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
})();
