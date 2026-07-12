/* ==========================================================================
   Lenson Consulting — Interaktionen
   Header-Zustand, mobiles Menü, Scroll-Reveals, Portfolio-Modal, Kontaktformular
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Aktuelles Jahr im Footer ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header: Zustand beim Scrollen ---- */
  const header = document.getElementById('siteHeader');
  const setHeaderState = () => {
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  /* ---- Mobiles Menü ---- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menü öffnen');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ---- Scroll-Reveal-Animationen ---- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Portfolio-Modal ---- */
  const projectData = {
    bella: {
      tag: 'Italienisches Restaurant · Elegant, mediterran',
      title: 'Trattoria Bella',
      desc: 'Eine warme, bildstarke Website mit Fokus auf Küche und Atmosphäre. Klare Speisekarten-Struktur und ein Reservierungsbutton direkt im Blickfeld sorgen dafür, dass Gäste schnell den nächsten Schritt gehen.',
      swatch: 'linear-gradient(155deg, #7A3C3A, #3F1C1E 78%)'
    },
    see: {
      tag: 'Traditionelles deutsches Restaurant · Hochwertig, regional',
      title: 'Gasthaus am See',
      desc: 'Ruhige, regionale Bildsprache mit Schwerpunkt auf Herkunft der Zutaten und der Lage direkt am Wasser. Öffnungszeiten, Anfahrt und Reservierung sind auf einen Blick erreichbar.',
      swatch: 'linear-gradient(155deg, #4A5A4C, #223028 78%)'
    },
    noir: {
      tag: 'Modernes Café · Minimalistisch, urban',
      title: 'Café Noir',
      desc: 'Reduziertes, typografisch geführtes Design für ein urbanes Café. Wenige, gezielte Elemente lenken die Aufmerksamkeit auf Angebot und Ambiente statt auf die Website selbst.',
      swatch: 'linear-gradient(155deg, #2C2A28, #080706 78%)'
    }
  };

  const modal = document.getElementById('projectModal');
  const modalThumb = document.getElementById('modalThumb');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  let lastFocused = null;

  const openModal = (key) => {
    const data = projectData[key];
    if (!data) return;
    modalThumb.style.background = data.swatch;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  };

  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('.project-open').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.project));
  });

  modal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  /* ---- Kontaktformular ---- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      formNote.textContent = 'Bitte füllen Sie Name, Restaurant und E-Mail aus.';
      contactForm.reportValidity();
      return;
    }

    const name = document.getElementById('name').value.trim();
    const restaurant = document.getElementById('restaurant').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent(`Website-Analyse für ${restaurant}`);
    const body = encodeURIComponent(
      `Name: ${name}\nRestaurant: ${restaurant}\nE-Mail: ${email}\n\nNachricht:\n${message || '(keine weiteren Angaben)'}`
    );

    window.location.href = `mailto:kontakt@lensonconsulting.de?subject=${subject}&body=${body}`;
    formNote.textContent = 'Ihr E-Mail-Programm öffnet sich mit den ausgefüllten Angaben.';
  });

});
