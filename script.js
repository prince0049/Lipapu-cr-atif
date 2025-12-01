// script.js
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    const links = document.querySelectorAll('.main-nav a');
  
    // Toggle menu mobile
    navToggle?.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  
    // Smooth scroll + fermeture du menu au clic
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            nav.classList.remove('open');
          }
        }
      });
    });
  
    // IntersectionObserver: reveal au scroll
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = document.querySelectorAll('.reveal');
    if (!prefersReduced && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const el = entry.target;
          if (entry.isIntersecting) {
            const delay = parseFloat(el.getAttribute('data-delay') || '0');
            el.style.transitionDelay = `${delay}s`;
            el.classList.add('reveal-visible');
            io.unobserve(el);
          }
        });
      }, { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('reveal-visible'));
    }
  
    // Parallax doux sur le fond du hero
    const heroBg = document.querySelector('.animated-bg');
    let rafId = null;
    const onMouseMove = (e) => {
      if (!heroBg) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const { innerWidth: w, innerHeight: h } = window;
        const x = (e.clientX / w - 0.5) * 4;  // -2 à +2
        const y = (e.clientY / h - 0.5) * 4;
        heroBg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        rafId = null;
      });
    };
    window.addEventListener('mousemove', onMouseMove);
  
    // Tilt léger sur les cartes (services)
    const tiltEls = document.querySelectorAll('.tilt');
    const maxTilt = 8; // degrés
    tiltEls.forEach(card => {
      let bounds = card.getBoundingClientRect();
      const updateBounds = () => { bounds = card.getBoundingClientRect(); };
      window.addEventListener('resize', updateBounds);
  
      card.addEventListener('mousemove', (e) => {
        const cx = e.clientX - bounds.left;
        const cy = e.clientY - bounds.top;
        const rx = ((cy / bounds.height) - 0.5) * -maxTilt;
        const ry = ((cx / bounds.width) - 0.5) * maxTilt;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    });
  
    // Lien actif selon section visible
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if ('IntersectionObserver' in window) {
      const options = { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0.2 };
      const activeIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          const link = document.querySelector(`.main-nav a[href="#${id}"]`);
          if (link) {
            if (entry.isIntersecting) {
              document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
              link.classList.add('active');
            }
          }
        });
      }, options);
      sections.forEach(section => activeIo.observe(section));
    }
  });
  