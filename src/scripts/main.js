import { initSmokeCanvas } from './smoke-canvas.js';
import { initScrollStack } from './scroll-stack.js';
import { initTenderEstimator } from './estimator.js';
import { initAmbientAudio } from './ambient-audio.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Interactive Smoke Canvas
  initSmokeCanvas('smokeCanvas');

  // 2. Initialize Overlapping Card Stack Scroll Physics
  initScrollStack();

  // 3. Initialize Live Tender Estimator
  initTenderEstimator();

  // 4. Initialize Procedural Ambient Soundscape
  initAmbientAudio();

  // 5. Navbar Scrolled State
  const nav = document.querySelector('.swiss-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 6. Flavor Lab Filter Chips
  const filterChips = document.querySelectorAll('.chip-btn');
  const flavorCards = document.querySelectorAll('.flavor-card-minimal');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;
      flavorCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Clean Swiss Standards Accordion
  const accordionItems = document.querySelectorAll('.clean-accordion-item');
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.clean-accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        accordionItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // 8. VIP Reservation Modal Controls
  const modal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // 9. Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending Booking Request...';
      submitBtn.disabled = true;

      setTimeout(() => {
        bookingForm.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(16, 185, 129, 0.12); border: 1.5px solid #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; color: #10b981; font-size: 1.5rem;">✓</div>
            <h3 style="font-size: 1.45rem; font-weight: 700; margin-bottom: 10px; color: #ffffff;">Booking Request Received!</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; max-width: 420px; margin: 0 auto;">Thank you! Founder Jatin Yadav will contact you directly on your phone or WhatsApp (<strong style="color: #25D366;">+91 96257 48696</strong>) shortly to confirm details and lock your party date.</p>
          </div>
        `;
      }, 700);
    });
  }
});
