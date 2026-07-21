/* ============================================================
   Victoria Tseng — Landing Page Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initTestimonialSlider();
  initContactForm();
});

/* --- Navigation --- */
function initNavigation() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const navAnchors = links.querySelectorAll('a:not(.btn)');

  // Scroll behavior — transparent to solid
  function handleNavScroll() {
    if (window.scrollY > 80) {
      nav.classList.remove('transparent');
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Initial check

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when link clicked
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on CTA click too
  const navCta = links.querySelector('.nav-cta a');
  if (navCta) {
    navCta.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // Active nav link highlighting
  const sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = links.querySelector(`a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = 'var(--mauve-light)';
        } else {
          link.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
}

/* --- Scroll Reveal (IntersectionObserver) --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: make everything visible
    revealElements.forEach(el => el.classList.add('visible'));
  }
}

/* --- Testimonial Slider --- */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.testimonials-dot');
  if (!track || dots.length === 0) return;

  let currentSlide = 0;
  const totalSlides = dots.length;
  let autoplayInterval;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
  }

  // Dot click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide, 10);
      goToSlide(slideIndex);
      resetAutoplay();
    });
  });

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Pause on hover
  const slider = document.getElementById('testimonialSlider');
  slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  slider.addEventListener('mouseleave', startAutoplay);

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(autoplayInterval);
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left — next
        goToSlide(Math.min(currentSlide + 1, totalSlides - 1));
      } else {
        // Swiped right — prev
        goToSlide(Math.max(currentSlide - 1, 0));
      }
    }

    startAutoplay();
  }, { passive: true });

  startAutoplay();
}

/* --- Contact Form Handling --- */
function initContactForm() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    // Add hidden input for subject if not present
    if (!form.querySelector('input[name="_subject"]')) {
      const subjectInput = document.createElement('input');
      subjectInput.type = 'hidden';
      subjectInput.name = '_subject';
      subjectInput.value = 'VictoriaTseng Website Inquiry';
      form.appendChild(subjectInput);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.pointerEvents = 'none';
      }

      // Collect form data
      const formData = new FormData(form);
      const dataObj = {
        _subject: 'VictoriaTseng Website Inquiry',
        _template: 'table',
        'Page Source': window.location.href,
        'Submitted At': new Date().toLocaleString()
      };

      formData.forEach((value, key) => {
        if (!key.startsWith('_')) {
          dataObj[key] = value;
        }
      });

      try {
        // Send email notification to victoria@grubbco.com
        await fetch('https://formsubmit.co/ajax/victoria@grubbco.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(dataObj)
        });
      } catch (err) {
        console.warn('FormSubmit network response:', err);
      }

      // Show user success message
      if (form.id === 'heroLeadForm' && document.querySelector('.hero-form-card')) {
        const formCard = document.querySelector('.hero-form-card');
        formCard.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 60px; height: 60px; background: #C8374B; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 0 25px rgba(200,55,75,0.5);">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style="color: white; font-size: 1.8rem; margin-bottom: 0.75rem; font-family: 'Cormorant Garamond', serif;">Strategy Consultation Requested!</h3>
            <p style="color: #E8CDD8; font-size: 0.95rem; line-height: 1.6;">
              Thank you! Your details have been submitted. Victoria Tseng will personally review your information and contact you shortly.
            </p>
          </div>
        `;
      } else if (submitBtn) {
        submitBtn.textContent = '✓ Inquiry Sent!';
        submitBtn.style.background = '#2D7D46';
        submitBtn.style.borderColor = '#2D7D46';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.pointerEvents = '';
        }, 4000);
      }
    });
  });
}

/* --- Parallax Effect on Hero (subtle) --- */
(function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg img');
  if (!heroBg) return;

  // Only apply on non-mobile for performance
  if (window.matchMedia('(min-width: 768px)').matches) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = document.querySelector('.hero').offsetHeight;

          if (scrollY <= heroHeight) {
            const parallaxAmount = scrollY * 0.35;
            heroBg.style.transform = `translateY(${parallaxAmount}px) scale(1.1)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial scale to prevent gap
    heroBg.style.transform = 'scale(1.1)';
  }
})();
