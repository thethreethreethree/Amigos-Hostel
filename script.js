/* ============================================================
   AMIGOS HOSTEL EL NIDO  |  script.js
   ============================================================ */

(function () {
  'use strict';

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on page load


  /* ===== MOBILE HAMBURGER MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on any nav link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }


  /* ===== SCROLL REVEAL (Intersection Observer) ===== */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all without animation
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ===== SMOOTH SCROLL for anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.getBoundingClientRect().height : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveNav() {
    if (!sections.length || !navLinkEls.length) return;
    const scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinkEls.forEach(function (link) {
          link.style.opacity = link.getAttribute('href') === '#' + id ? '1' : '';
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });


  /* ===== HERO PARALLAX (subtle) ===== */
  const heroBg = document.querySelector('.hero-bg');
  function handleParallax() {
    if (!heroBg) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = 'scale(1.07) translateY(' + (scrolled * 0.18) + 'px)';
    }
  }
  window.addEventListener('scroll', handleParallax, { passive: true });


  /* ===== BOOKING FORM HANDLING ===== */
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    // Set min date for check-in to today
    const today = new Date().toISOString().split('T')[0];
    const checkinInput  = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    if (checkinInput)  { checkinInput.min  = today; checkinInput.value = today; }
    if (checkoutInput) { checkoutInput.min = today; }

    // Ensure checkout is after checkin
    if (checkinInput && checkoutInput) {
      checkinInput.addEventListener('change', function () {
        checkoutInput.min = this.value;
        if (checkoutInput.value && checkoutInput.value <= this.value) {
          const next = new Date(this.value);
          next.setDate(next.getDate() + 1);
          checkoutInput.value = next.toISOString().split('T')[0];
        }
      });

      // Pre-fill tomorrow as checkout
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      checkoutInput.value = tomorrow.toISOString().split('T')[0];
      checkoutInput.min   = tomorrow.toISOString().split('T')[0];
    }

    // Night count display
    function updateNightCount() {
      if (!checkinInput || !checkoutInput) return;
      const inDate  = new Date(checkinInput.value);
      const outDate = new Date(checkoutInput.value);
      const diff    = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
      const nightEl = document.getElementById('nightCount');
      if (nightEl && diff > 0) {
        nightEl.textContent = diff + (diff === 1 ? ' night' : ' nights');
      }
    }
    if (checkinInput)  checkinInput.addEventListener('change', updateNightCount);
    if (checkoutInput) checkoutInput.addEventListener('change', updateNightCount);
    updateNightCount();

    // Form submission
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('.btn-submit');
      const original  = submitBtn.textContent;

      // Basic validation
      const required = this.querySelectorAll('[required]');
      let valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
          field.addEventListener('input', function () {
            this.style.borderColor = '';
          }, { once: true });
        }
      });

      if (!valid) {
        const firstErr = this.querySelector('[required]:invalid, [style*="c0392b"]');
        if (firstErr) firstErr.focus();
        return;
      }

      // Simulate sending
      submitBtn.textContent = 'Sending Request...';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.textContent = '✓ Request Sent!';
        submitBtn.style.background = '#2E7D32';

        const successMsg = document.getElementById('formSuccess');
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        setTimeout(function () {
          submitBtn.textContent = original;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          bookingForm.reset();
          if (checkinInput)  checkinInput.value  = today;
          if (checkoutInput) checkoutInput.value = tomorrow.toISOString().split('T')[0];
          updateNightCount();
          if (successMsg) successMsg.style.display = 'none';
        }, 4500);
      }, 1400);
    });
  }


  /* ===== GALLERY LIGHTBOX (minimal) ===== */
  const galleryItems = document.querySelectorAll('.g-item');

  galleryItems.forEach(function (item) {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') this.click();
    });
  });


  /* ===== CURRENT YEAR IN FOOTER ===== */
  const yearEls = document.querySelectorAll('.js-year');
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });


  /* ===== ROOM CARD PRICE HIGHLIGHT ===== */
  const roomCards = document.querySelectorAll('.room-card');
  roomCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      this.querySelector('.btn-room').style.transform = 'translateY(-1px)';
    });
    card.addEventListener('mouseleave', function () {
      this.querySelector('.btn-room').style.transform = '';
    });
  });

})();
