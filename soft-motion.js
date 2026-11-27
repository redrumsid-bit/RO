/* B concept: content is visible without JS; animations enhance it only. */
(() => {
  'use strict';
  const body = document.body;
  const button = document.getElementById('motion-toggle');
  if (!button || typeof matchMedia !== 'function') return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const effects = new Map();
  let paused = false;
  try { paused = sessionStorage.getItem('ro-motion-paused') === 'true'; } catch {}
  const disabled = () => paused || preference.matches;
  function cancel() { effects.forEach(animation => animation.cancel()); effects.clear(); }
  function sync() {
    body.classList.toggle('motion-off', disabled());
    button.textContent = disabled() ? '움직임 켜기' : '움직임 끄기';
    button.setAttribute('aria-pressed', String(!disabled()));
    button.disabled = preference.matches;
    button.title = preference.matches ? '기기의 움직임 줄이기 설정을 따르고 있습니다.' : '';
    if (disabled()) cancel();
  }
  function animate(element, delay = 0, hero = false) {
    if (disabled() || typeof element.animate !== 'function' || element.contains(document.activeElement)) return;
    const animation = element.animate([
      {opacity: 0, transform: `translateY(${hero ? 38 : 25}px)`, filter: hero ? 'blur(5px)' : 'none'},
      {opacity: 1, transform: 'translateY(0)', filter: hero ? 'blur(0px)' : 'none'},
    ], {duration: hero ? 1100 : 850, delay, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'backwards'});
    effects.set(element, animation);
    animation.onfinish = () => effects.delete(element);
  }
  button.hidden = false;
  sync();
  body.classList.add('motion-ready');
  button.addEventListener('click', () => {
    paused = !paused;
    try { sessionStorage.setItem('ro-motion-paused', String(paused)); } catch {}
    sync();
  });
  preference.addEventListener('change', sync);
  document.addEventListener('focusin', event => {
    effects.forEach((animation, element) => {
      if (element.contains(event.target)) { animation.cancel(); effects.delete(element); }
    });
  });
  // Avoid replaying the entrance over content after a slow font download.
  const started = performance.now();
  Promise.resolve(document.fonts?.ready).then(() => {
    if (performance.now() - started > 1800 || scrollY > 100) return;
    document.querySelectorAll('.hero-copy .eyebrow,.hero-line,.hero-copy .lead,.hero-copy .actions,.hero-object')
      .forEach((element, index) => animate(element, index * 100, true));
  });
  if (typeof IntersectionObserver !== 'function') return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    animate(entry.target);
  }), {threshold: .15});
  document.querySelectorAll('.projects-intro,.project-gallery,.contact-heading,.contactgrid')
    .forEach(element => observer.observe(element));
})();
