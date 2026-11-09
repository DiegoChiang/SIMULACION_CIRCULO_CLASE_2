(() => {
  'use strict';

  const slides = [...document.querySelectorAll('.slide')];
  const progressBar = document.getElementById('progressBar');
  const currentSlideLabel = document.getElementById('currentSlide');
  const totalSlidesLabel = document.getElementById('totalSlides');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const overviewButton = document.getElementById('overviewButton');
  const helpButton = document.getElementById('helpButton');
  const overviewDialog = document.getElementById('overviewDialog');
  const helpDialog = document.getElementById('helpDialog');
  const overviewGrid = document.getElementById('overviewGrid');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let touchStartX = 0;
  let loopTimer = null;

  const pad = value => String(value).padStart(2, '0');
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function stopLoopAnimation() {
    if (loopTimer) window.clearInterval(loopTimer);
    loopTimer = null;
  }

  function startLoopAnimation(slide) {
    stopLoopAnimation();
    const steps = [...slide.querySelectorAll('.loop-step')];
    if (!steps.length || reducedMotion) return;
    let active = 0;
    loopTimer = window.setInterval(() => {
      steps[active].classList.remove('is-current');
      active = (active + 1) % steps.length;
      steps[active].classList.add('is-current');
    }, 1250);
  }

  function updateOverviewState() {
    overviewGrid.querySelectorAll('.overview-item').forEach((item, index) => {
      item.classList.toggle('is-current', index === current);
    });
  }

  function goTo(index, options = {}) {
    const target = clamp(index, 0, slides.length - 1);
    if (target === current && !options.force) return;
    stopLoopAnimation();

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === target);
      slide.classList.toggle('was-active', slideIndex < target);
      slide.setAttribute('aria-hidden', slideIndex === target ? 'false' : 'true');
    });

    current = target;
    progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
    currentSlideLabel.textContent = pad(current + 1);
    prevButton.disabled = current === 0;
    nextButton.disabled = current === slides.length - 1;
    document.title = `${slides[current].dataset.title} | OptQuest para Arena`;
    history.replaceState(null, '', `#slide-${current + 1}`);
    updateOverviewState();
    startLoopAnimation(slides[current]);
  }

  function buildOverview() {
    slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'overview-item';
      button.innerHTML = `<span>${pad(index + 1)}</span><strong>${slide.dataset.title}</strong>`;
      button.addEventListener('click', () => {
        overviewDialog.close();
        goTo(index, { force: true });
      });
      overviewGrid.appendChild(button);
    });
  }

  function openDialog(dialog) {
    if (!dialog.open) dialog.showModal();
  }

  prevButton.addEventListener('click', () => goTo(current - 1));
  nextButton.addEventListener('click', () => goTo(current + 1));
  overviewButton.addEventListener('click', () => openDialog(overviewDialog));
  helpButton.addEventListener('click', () => openDialog(helpDialog));

  document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => document.getElementById(button.dataset.close)?.close());
  });

  document.addEventListener('keydown', event => {
    const dialogOpen = document.querySelector('dialog[open]');
    if (dialogOpen && event.key !== 'Escape') return;

    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(slides.length - 1);
    } else if (event.key.toLowerCase() === 'o') {
      event.preventDefault();
      openDialog(overviewDialog);
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    } else if (event.key === '?') {
      event.preventDefault();
      openDialog(helpDialog);
    }
  });

  document.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', event => {
    if (document.querySelector('dialog[open]')) return;
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) < 55) return;
    goTo(distance < 0 ? current + 1 : current - 1);
  }, { passive: true });

  totalSlidesLabel.textContent = pad(slides.length);
  buildOverview();
  window.addEventListener('hashchange', () => {
    const match = window.location.hash.match(/slide-(\d+)/);
    if (match) goTo(Number(match[1]) - 1, { force: true });
  });

  const hashMatch = window.location.hash.match(/slide-(\d+)/);
  const initial = hashMatch ? Number(hashMatch[1]) - 1 : 0;
  current = -1;
  goTo(initial, { force: true });
})();
