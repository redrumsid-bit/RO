/* Progressive enhancement: all content is visible before this script runs. */
(() => {
  'use strict';
  if (typeof matchMedia !== 'function' || typeof IntersectionObserver !== 'function') return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return;

  const targets = [...document.querySelectorAll([
    '.hero-copy > *', '.hero-object', '.pagehero > *',
    '.detailhero > h1', '.detailhero > .lead', '.detailhero > .metadata',
    '.service-heading', '.service-card', '.projectcard',
    '.content > .sectionhead', '.steps > article', '.processline > article',
    '.industrynames', '.contact-card', '.contactgrid > aside', '.contactsteps', '.cta',
  ].join(','))];
  const pending = new Set(targets);
  const delayClasses = ['motion-delay-0', 'motion-delay-1', 'motion-delay-2', 'motion-delay-3'];
  const clear = element => element.classList.remove('motion-enter', ...delayClasses);
  const observer = new IntersectionObserver(entries => {
    if (preference.matches) return;
    let order = 0;
    for (const {target, isIntersecting} of entries) {
      if (!isIntersecting || !pending.has(target)) continue;
      target.classList.add('motion-enter', delayClasses[Math.min(order++, 3)]);
      pending.delete(target);
      observer.unobserve(target);
    }
  }, {threshold: 0.08});
  targets.forEach(element => observer.observe(element));

  // Keyboard users should never wait for entrance effects to see focused controls.
  document.addEventListener('focusin', event => {
    for (const element of targets) {
      if (!element.contains(event.target)) continue;
      clear(element);
      pending.delete(element);
      observer.unobserve(element);
    }
  });
  preference.addEventListener('change', () => {
    if (!preference.matches) return;
    observer.disconnect();
    pending.clear();
    targets.forEach(clear);
  });
})();
