/**
 * Cloudhouse High-Fidelity Motion & Micro-Interaction Engine
 * 1. Masked Line Text Reveals (Headings & Subtitles)
 * 2. Animated Number Counters on Scroll
 * 3. Animated Flavor Meter Fill Progress
 * 4. Hairline Border Draw-in Triggers
 * 5. 3D Magnetic Tilt & Spec Glare Physics
 */

export function initScrollStack() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const progressText = document.getElementById('activeSectionName');
  const progressBar = document.getElementById('scrollProgressBar');
  const heroStage = document.querySelector('.frameless-hardware-stage');
  const heroShisha = document.getElementById('heroShishaVisual');

  // 1. Text & Element Motion Observer (Clip-path, Masked Line & Fade Reveals)
  const motionTargets = document.querySelectorAll(`
    .line-mask-reveal, 
    .text-slide-reveal, 
    .body-slide-reveal, 
    .badge-wipe-reveal, 
    .scale-card-reveal,
    .border-draw-cell,
    .flavor-card-interactive
  `);

  if ('IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');

          // Cascade is-active to child reveals inside this container
          const childReveals = entry.target.querySelectorAll(
            '.line-mask-reveal, .text-slide-reveal, .body-slide-reveal, .badge-wipe-reveal, .scale-card-reveal'
          );
          childReveals.forEach(child => child.classList.add('is-active'));

          // Trigger Meter Bars inside this target if present
          const meterFills = entry.target.querySelectorAll('.meter-fill, .bar-fill');
          meterFills.forEach(bar => {
            const targetWidth = bar.dataset.fill || bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = targetWidth;
            }, 120);
          });

          // Trigger Animated Number Counters for all counters inside this target
          const counters = entry.target.querySelectorAll('.count-up-val');
          counters.forEach(counter => {
            if (!counter.dataset.counted) {
              counter.dataset.counted = 'true';
              animateCounter(counter);
            }
          });
          if (entry.target.classList.contains('count-up-val') && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCounter(entry.target);
          }

          motionObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    motionTargets.forEach(el => motionObserver.observe(el));

    // Immediately trigger any counters already marked is-active on initial load (e.g. in hero)
    setTimeout(() => {
      document.querySelectorAll('.is-active .count-up-val').forEach(counter => {
        if (!counter.dataset.counted) {
          counter.dataset.counted = 'true';
          animateCounter(counter);
        }
      });
    }, 250);

    // Active Section Tracker
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && progressText) {
          const s = entry.target;
          const title = s.dataset.sectionTitle || s.id.toUpperCase();
          const num = s.dataset.sectionNum || '';
          progressText.textContent = `${num} ${title}`;
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(s => sectionObserver.observe(s));
  } else {
    motionTargets.forEach(el => el.classList.add('is-active'));
  }

  // 2. Animated Number Counter Helper
  function animateCounter(el) {
    const end = parseFloat(el.dataset.target) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals, 10) || 0;
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Apple-like easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = (ease * end).toFixed(decimals);
      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${end.toFixed(decimals)}${suffix}`;
      }
    }
    requestAnimationFrame(update);
  }

  // 3. Subtle 3D Magnetic Tilt on Hero Hardware Subject
  if (heroStage && heroShisha && window.innerWidth > 900) {
    let tiltX = 0, tiltY = 0;
    let targetX = 0, targetY = 0;

    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 14; // Max 14deg tilt
      targetY = -y * 14;
    }, { passive: true });

    heroStage.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    function tiltLoop() {
      tiltX += (targetX - tiltX) * 0.08;
      tiltY += (targetY - tiltY) * 0.08;
      heroShisha.style.transform = `perspective(1000px) rotateY(${tiltX.toFixed(2)}deg) rotateX(${tiltY.toFixed(2)}deg)`;
      requestAnimationFrame(tiltLoop);
    }
    tiltLoop();
  }

  // 4. Interactive Card Spotlight Glare on Hover
  const glareCards = document.querySelectorAll('.interactive-glare-card');
  glareCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glare-x', `${x}px`);
      card.style.setProperty('--glare-y', `${y}px`);
    }, { passive: true });
  });

  // 5. Scroll Progress Bar
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
