/**
 * Cloudhouse Ultra-Lightweight Hero Smoke
 * Confined strictly to the hero container with automatic idle shutdown
 */
export function initSmokeCanvas(canvasId = 'smokeCanvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const hero = document.getElementById('hero');
  const ctx = canvas.getContext('2d', { alpha: true });
  
  let width = (canvas.width = hero ? hero.offsetWidth : window.innerWidth);
  let height = (canvas.height = hero ? hero.offsetHeight : window.innerHeight);

  const particles = [];
  const maxParticles = 24; // Ultra lightweight
  let isHeroVisible = true;
  let animId = null;

  let mouse = {
    x: width * 0.7,
    y: height * 0.5,
  };

  function resize() {
    if (!hero) return;
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  window.addEventListener('resize', resize, { passive: true });

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    if (particles.length < maxParticles && Math.random() < 0.4) {
      spawnSmokeParticle(mouse.x, mouse.y, (Math.random() - 0.5) * 0.4, -0.6);
    }
  }, { passive: true });

  class SmokeParticle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.radius = 20 + Math.random() * 20;
      this.maxRadius = this.radius * 2.8;
      this.vx = vx;
      this.vy = vy;
      this.alpha = 0.08 + Math.random() * 0.08;
      this.decay = 0.0012 + Math.random() * 0.001;
      this.isAmber = Math.random() < 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy -= 0.01;
      if (this.radius < this.maxRadius) this.radius += 0.4;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isAmber 
        ? `rgba(245, 158, 11, ${this.alpha * 0.8})` 
        : `rgba(220, 220, 235, ${this.alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  function spawnSmokeParticle(x, y, vx, vy) {
    particles.push(new SmokeParticle(x, y, vx, vy));
  }

  let ticker = 0;
  function loop() {
    if (!isHeroVisible) return;

    ctx.clearRect(0, 0, width, height);
    ticker++;

    if (ticker % 25 === 0 && particles.length < maxParticles) {
      const originX = width > 900 ? width * 0.72 : width * 0.5;
      const originY = height * 0.72;
      spawnSmokeParticle(originX, originY, (Math.random() - 0.5) * 0.4, -0.7);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0 || p.y < -50) {
        particles.splice(i, 1);
      }
    }

    animId = requestAnimationFrame(loop);
  }

  // Shut down completely when hero is scrolled past
  if (hero && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isHeroVisible = true;
          if (!animId) animId = requestAnimationFrame(loop);
        } else {
          isHeroVisible = false;
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
          ctx.clearRect(0, 0, width, height);
        }
      });
    }, { threshold: 0 });
    observer.observe(hero);
  } else {
    animId = requestAnimationFrame(loop);
  }
}
