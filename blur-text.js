/**
 * Vanilla port of BlurText (motion/react) for static HTML sites.
 */
function parseWordSegments(element) {
  const highlightEl = element.querySelector('.highlight-text');
  const highlightWord = highlightEl?.textContent.trim();
  const fullText = element.textContent.replace(/\s+/g, ' ').trim();
  const words = fullText.split(' ').filter(Boolean);

  return words.map((word) => {
    const bare = word.replace(/^[,.\?!:;]+|[,.\?!:;]+$/g, '');
    const highlight = highlightWord
      ? bare === highlightWord || word === highlightWord
      : false;

    return { text: word, highlight };
  });
}

function initBlurText(element, options = {}) {
  if (!element) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const delay = Number(element.dataset.blurDelay ?? options.delay ?? 200);
  const direction = element.dataset.blurDirection ?? options.direction ?? 'top';
  const threshold = options.threshold ?? 0.1;
  const rootMargin = options.rootMargin ?? '0px';
  const stepDuration = options.stepDuration ?? 0.35;
  const onAnimationComplete = options.onAnimationComplete;

  const segments = parseWordSegments(element);
  if (!segments.length) return;

  element.classList.add('blur-text');
  element.innerHTML = '';

  const totalDuration = stepDuration * 2;
  const yFrom = direction === 'top' ? -50 : 50;
  const yMid = direction === 'top' ? 5 : -5;

  element.style.setProperty('--blur-y-from', `${yFrom}px`);
  element.style.setProperty('--blur-y-mid', `${yMid}px`);
  element.style.setProperty('--blur-duration', `${totalDuration}s`);

  segments.forEach((segment, index) => {
    const word = document.createElement('span');
    word.className = 'blur-text__word';
    word.textContent = segment.text;
    word.style.animationDelay = `${(index * delay) / 1000}s`;

    if (segment.highlight) {
      word.classList.add('highlight-text');
    }

    if (prefersReducedMotion) {
      word.classList.add('blur-text__word--instant');
    }

    element.appendChild(word);

    if (index < segments.length - 1) {
      element.appendChild(document.createTextNode('\u00A0'));
    }
  });

  const finish = () => {
    if (element.classList.contains('blur-text--done')) return;
    element.classList.add('blur-text--done');
    onAnimationComplete?.();
  };

  if (prefersReducedMotion) {
    finish();
    return;
  }

  const lastWord = element.querySelector('.blur-text__word:last-of-type');
  const lastDelay = ((segments.length - 1) * delay) / 1000;

  const startAnimation = () => {
    element.classList.add('blur-text--active');

    if (lastWord) {
      lastWord.addEventListener(
        'animationend',
        () => finish(),
        { once: true }
      );

      // Fallback if animationend doesn't fire
      window.setTimeout(finish, (lastDelay + totalDuration + 0.1) * 1000);
    } else {
      finish();
    }
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startAnimation();
        observer.disconnect();
      }
    },
    { threshold, rootMargin }
  );

  observer.observe(element);
}

window.initBlurText = initBlurText;
