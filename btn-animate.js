/**
 * Button animations — magnetic hover + click ripple (vanilla JS).
 */
function initButtonAnimations(selector = '.btn--magnetic') {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const buttons = document.querySelectorAll(selector);

  if (prefersReducedMotion) return;

  buttons.forEach((btn) => {
    let rect = null;
    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const update = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      btn.style.setProperty('--btn-mx', `${currentX.toFixed(2)}px`);
      btn.style.setProperty('--btn-my', `${currentY.toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
      }
    };

    const scheduleUpdate = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    btn.addEventListener('mouseenter', () => {
      rect = btn.getBoundingClientRect();
    });

    btn.addEventListener('mousemove', (e) => {
      if (!rect) rect = btn.getBoundingClientRect();

      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      targetX = x * 0.22;
      targetY = y * 0.22;
      scheduleUpdate();
    });

    btn.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      scheduleUpdate();
      rect = null;
    });

    btn.addEventListener('click', (e) => {
      const bounds = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn__ripple';

      const size = Math.max(bounds.width, bounds.height) * 2;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - bounds.left - size / 2}px`;
      ripple.style.top = `${e.clientY - bounds.top - size / 2}px`;

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });
}

window.initButtonAnimations = initButtonAnimations;
