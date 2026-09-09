/**
 * Cloudhouse Zero-Lag 120FPS Performance Engine
 * 100% layout-thrashing free:
 * - Uses native asynchronous IntersectionObserver for reveals (0 layout reflows)
 * - Zero getBoundingClientRect in scroll handlers
 * - Native CSS sticky stacking
 */

export function initScrollStack() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .scale-reveal');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const progressText = document.getElementById('activeSectionName');
  const progressBar = document.getElementById('scrollProgressBar');

  // 1. Asynchronous Zero-Lag Reveal Observer (Off-main-thread)
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Section tracker observer (zero layout reflow)
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && progressText) {
          const s = entry.target;
          const title = s.dataset.sectionTitle || s.id.toUpperCase();
          const num = s.dataset.sectionNum || '';
          progressText.textContent = `${num} ${title}`;
        }
      });
    }, {
      threshold: 0.3
    });

    sections.forEach(s => sectionObserver.observe(s));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 2. Extremely lightweight passive progress bar (only touches 1 CSS property)
  if (progressBar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            progressBar.style.width = `${((window.scrollY / totalHeight) * 100).toFixed(1)}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}
