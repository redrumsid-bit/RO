/* Native anchors handle navigation/history even without JavaScript. */
(() => {
  'use strict';
  const sectionIds = ['home', 'projects', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const links = [...document.querySelectorAll('.site-header nav a')];
  const header = document.querySelector('.site-header');
  if (!sections.length || !header) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let effects = [];
  let scheduled = false;
  let current = '';
  const clamp = value => Math.max(0, Math.min(1, value));

  function buildEffects() {
    effects.forEach(({animation}) => animation.cancel());
    effects = [];
    if (preference.matches) return;
    const mobile = innerWidth <= 900;
    function add(element, container, frames, home = false) {
      if (!element || !container || typeof element.animate !== 'function') return;
      const animation = element.animate(frames, {duration: 1000, fill: 'both', easing: 'linear'});
      animation.pause();
      animation.currentTime = 0;
      effects.push({animation, container, home});
    }
    add(document.querySelector('.hero-object'), sections[0], [
      {transform:'translateY(0) rotate(0deg)'},
      {transform:`translateY(${mobile ? -24 : -85}px) rotate(${mobile ? 0 : -2}deg)`},
    ], true);
    add(document.querySelector('.contact-watermark'), document.getElementById('contact'), [
      {transform:'translateY(50px)'}, {transform:'translateY(-50px)'},
    ]);
  }

  function render() {
    scheduled = false;
    const headerHeight = header.getBoundingClientRect().height;
    const guide = headerHeight + Math.min(innerHeight * .25, 210);
    let active = sections[0].id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= guide) active = section.id;
    });
    if (active !== current) {
      links.forEach(link => {
        if (link.getAttribute('href') === `#${active}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      current = active;
    }
    effects.forEach(({animation, container, home}) => {
      const rect = container.getBoundingClientRect();
      const progress = home
        ? clamp((headerHeight - rect.top) / Math.max(1, rect.height))
        : clamp((innerHeight - rect.top) / Math.max(1, innerHeight + rect.height));
      animation.currentTime = progress * 1000;
    });
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(render);
  }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', () => {buildEffects(); schedule();});
  addEventListener('pageshow', schedule);
  addEventListener('hashchange', schedule);
  preference.addEventListener('change', () => {buildEffects(); schedule();});
  buildEffects();
  render();
})();
