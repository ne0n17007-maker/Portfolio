const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach((el) => revealObserver.observe(el));

const heroTitle = document.querySelector('.hero__title.blur-text');
const heroLine = document.querySelector('.hero__line');
const heroAfterTitle = document.querySelectorAll('.hero__after-title');

if (heroTitle && typeof initBlurText === 'function') {
  initBlurText(heroTitle, {
    delay: 200,
    direction: 'top',
    stepDuration: 0.35,
    onAnimationComplete: () => {
      heroLine?.classList.add('is-drawn');
      heroAfterTitle.forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * 100);
      });
    },
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const progressBar = document.querySelector('.scroll-progress__bar');

function updateScrollProgress() {
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const navSections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (navSections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );

  navSections.forEach((section) => navObserver.observe(section));
}

if (typeof initButtonAnimations === 'function') {
  initButtonAnimations('.btn--magnetic');
}

if (typeof initSpotlightCards === 'function') {
  initSpotlightCards();
}
