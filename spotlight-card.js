/**
 * Vanilla port of GlowCard (spotlight-card) for static HTML site.
 */
const SPOTLIGHT_SELECTOR = [
  '.card',
  '.project-card',
  '.hero__metric',
  '.hero__photo',
  '.about__approach',
  '.about__list li',
  '.step',
  '.why__columns',
  '.why__formula',
  '.badge',
  '.audience-list li',
  '.review-card',
  '.cta__box',
  '.contact-link',
  '.manifesto__quote',
  '.stack__note',
].join(', ');

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 120 },
  green: { base: 72, spread: 90 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const sizePresets = {
  sm: { size: 140, border: 1, radius: 4, bgOpacity: 0.1 },
  md: { size: 200, border: 2, radius: 12, bgOpacity: 0.14 },
  lg: { size: 280, border: 3, radius: 12, bgOpacity: 0.16 },
};

let spotlightPointerBound = false;

function getSpotlightConfig(el) {
  if (el.dataset.glowColor) {
    return { color: el.dataset.glowColor, size: el.dataset.glowSize || 'md' };
  }
  if (el.classList.contains('card--accent') || el.classList.contains('about__approach')) {
    return { color: 'orange', size: 'md' };
  }
  if (el.classList.contains('badge')) {
    return { color: 'purple', size: 'sm' };
  }
  if (el.matches('.hero__metric, .about__list li, .audience-list li')) {
    return { color: 'green', size: 'sm' };
  }
  if (el.matches('.cta__box, .hero__photo')) {
    return { color: 'green', size: 'lg' };
  }
  return { color: 'green', size: 'md' };
}

function applySpotlightVars(card, color, sizeKey) {
  const { base, spread } = glowColorMap[color] || glowColorMap.green;
  const preset = sizePresets[sizeKey] || sizePresets.md;

  card.style.setProperty('--base', String(base));
  card.style.setProperty('--spread', String(spread));
  card.style.setProperty('--radius', String(preset.radius));
  card.style.setProperty('--border', String(preset.border));
  card.style.setProperty('--size', String(preset.size));
  card.style.setProperty('--backdrop', 'rgba(255, 248, 235, 0.03)');
  card.style.setProperty('--saturation', '90');
  card.style.setProperty('--lightness', '62');
  card.style.setProperty('--bg-spot-opacity', String(preset.bgOpacity));
  card.style.setProperty('--border-spot-opacity', '0.85');
  card.style.setProperty('--border-light-opacity', '0.35');
}

function initSpotlightCards(selector = SPOTLIGHT_SELECTOR) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll(selector);

  if (!cards.length) return;

  cards.forEach((card) => {
    if (card.classList.contains('spotlight-card')) return;

    const { color, size } = getSpotlightConfig(card);

    card.classList.add('spotlight-card', `spotlight-card--${size}`);
    card.setAttribute('data-glow', '');
    applySpotlightVars(card, color, size);

    if (!card.querySelector(':scope > .spotlight-card__blur')) {
      const blur = document.createElement('span');
      blur.className = 'spotlight-card__blur';
      blur.setAttribute('data-glow', '');
      blur.setAttribute('aria-hidden', 'true');
      card.prepend(blur);
    }
  });

  if (prefersReducedMotion || spotlightPointerBound) return;

  const syncPointer = (e) => {
    const x = e.clientX.toFixed(2);
    const y = e.clientY.toFixed(2);
    const xp = (e.clientX / window.innerWidth).toFixed(2);
    const yp = (e.clientY / window.innerHeight).toFixed(2);

    document.querySelectorAll('.spotlight-card[data-glow]').forEach((card) => {
      card.style.setProperty('--x', x);
      card.style.setProperty('--y', y);
      card.style.setProperty('--xp', xp);
      card.style.setProperty('--yp', yp);
    });
  };

  document.addEventListener('pointermove', syncPointer, { passive: true });
  spotlightPointerBound = true;
}

window.initSpotlightCards = initSpotlightCards;
