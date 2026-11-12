/* Native horizontal scrolling provides touch gestures without taking over page scroll. */
(() => {
  'use strict';
  const track = document.getElementById('project-track');
  if (!track) return;
  const slides = [...track.querySelectorAll('.project-scene')];
  const selectors = [...document.querySelectorAll('[data-project-slide]')];
  const previous = document.getElementById('project-previous');
  const next = document.getElementById('project-next');
  const status = document.getElementById('project-status');
  const controls = document.querySelector('.carousel-controls');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let destination = null;
  let frame = false;
  let settleTimer;
  const offset = index => slides[index].offsetLeft - slides[0].offsetLeft;
  function paint(index) {
    active = index;
    slides.forEach((slide, n) => { slide.inert = n !== index; });
    selectors.forEach((button, n) => button.setAttribute('aria-pressed', String(n === index)));
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    const label = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (status.textContent !== label) status.textContent = label;
  }
  function sync() {
    frame = false;
    let nearest = 0;
    slides.forEach((_, index) => {
      if (Math.abs(track.scrollLeft - offset(index)) < Math.abs(track.scrollLeft - offset(nearest))) nearest = index;
    });
    paint(nearest);
  }
  function go(index, instant = false) {
    destination = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({left: offset(destination), behavior: instant || reduced.matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => go((destination ?? active) - 1));
  next.addEventListener('click', () => go((destination ?? active) + 1));
  selectors.forEach((button, index) => button.addEventListener('click', () => go(index)));
  track.addEventListener('keydown', event => {
    if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey) return;
    const keys = {ArrowLeft:(destination ?? active) - 1, ArrowRight:(destination ?? active) + 1, Home:0, End:slides.length - 1};
    if (!(event.key in keys)) return;
    event.preventDefault();
    go(keys[event.key]);
  });
  track.addEventListener('pointerdown', () => { destination = null; }, {passive:true});
  track.addEventListener('scroll', () => {
    if (!frame) { frame = true; requestAnimationFrame(sync); }
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => { destination = null; sync(); }, 160);
  }, {passive:true});
  function followHash() {
    const match = /^#project-([1-4])$/.exec(location.hash);
    if (match) go(Number(match[1]) - 1, true);
  }
  addEventListener('hashchange', followHash);
  addEventListener('resize', () => { go(destination ?? active, true); sync(); });
  reduced.addEventListener('change', () => { if (reduced.matches) go(destination ?? active, true); });
  controls.hidden = false;
  document.querySelector('.project-index').hidden = false;
  paint(0);
  followHash();
  sync();
})();
