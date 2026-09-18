import { SLIDES } from '../data/slidesData.js';

/**
 * Presentador de diapositivas escénicas para la charla de Fórum UPB.
 * Maneja la capa visual de textos, imágenes de fondo con baja opacidad,
 * logos de marca persistentes y navegación.
 */
export function createSlidePresenter({ onSlideChange }) {
  let currentIndex = 0;
  let isTransitioning = false;

  // 0. CONTENEDOR DE IMAGEN DE FONDO CON BAJA OPACIDAD PERSISTENTE
  const bgBackdrop = document.createElement('div');
  bgBackdrop.className = 'slide-bg-backdrop';
  bgBackdrop.innerHTML = `
    <img class="bg-backdrop-img" src="" alt="" aria-hidden="true" />
    <div class="bg-backdrop-overlay" aria-hidden="true"></div>
  `;
  document.body.appendChild(bgBackdrop);
  const bgImg = bgBackdrop.querySelector('.bg-backdrop-img');

  // Root container for presentation
  const overlay = document.createElement('div');
  overlay.className = 'presentation-overlay';

  // 1. BRAND LOCKUP PERSISTENTE (Fórum UPB + 90 Años)
  const brandLockup = document.createElement('header');
  brandLockup.className = 'brand-lockup';
  brandLockup.innerHTML = `
    <div class="brand-logos">
      <img src="./assets/brand-forum.png" alt="Centro de Eventos Fórum UPB" class="logo-forum" />
      <span class="brand-separator" aria-hidden="true"></span>
      <img src="./assets/brand-90.png" alt="UPB 90 Años" class="logo-90" />
    </div>
    <div class="brand-meta">
      <span class="meta-tag">Fórum UPB</span>
      <span class="meta-dot">·</span>
      <span class="meta-sub">Relevo Generacional</span>
    </div>
  `;
  overlay.appendChild(brandLockup);

  // 2. STAGE SLIDE CONTAINER
  const stage = document.createElement('main');
  stage.className = 'slide-stage';

  const contentBox = document.createElement('div');
  contentBox.className = 'slide-content-box';
  stage.appendChild(contentBox);
  overlay.appendChild(stage);

  // 3. NAVIGATION CONTROLS BAR (PERSISTENTE)
  const navDock = document.createElement('nav');
  navDock.className = 'navigation-dock';
  navDock.innerHTML = `
    <div class="nav-controls">
      <button class="nav-btn btn-prev" aria-label="Diapositiva anterior" title="Flecha izquierda">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Anterior</span>
      </button>

      <div class="nav-tracker">
        <div class="tracker-counter">
          <span class="current-num">01</span>
          <span class="counter-divider">/</span>
          <span class="total-num">${String(SLIDES.length).padStart(2, '0')}</span>
        </div>
        <div class="tracker-dots" id="tracker-dots"></div>
      </div>

      <button class="nav-btn btn-next" aria-label="Siguiente diapositiva" title="Flecha derecha o Espacio">
        <span>Siguiente</span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <div class="nav-hint">
      <kbd>←</kbd> <kbd>→</kbd> <kbd>Espacio</kbd> Navegar &nbsp;·&nbsp; <kbd>F</kbd> Pantalla completa &nbsp;·&nbsp; <kbd>R</kbd> Reiniciar
    </div>
  `;
  overlay.appendChild(navDock);

  document.body.appendChild(overlay);

  // Populate progress dots
  const dotsContainer = navDock.querySelector('#tracker-dots');
  SLIDES.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `tracker-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const btnPrev = navDock.querySelector('.btn-prev');
  const btnNext = navDock.querySelector('.btn-next');
  const currentNumEl = navDock.querySelector('.current-num');

  btnPrev.addEventListener('click', () => prev());
  btnNext.addEventListener('click', () => next());

  function renderSlideContent(slide) {
    // Manejo de la imagen de fondo con baja opacidad
    if (slide.image) {
      bgImg.src = slide.image;
      bgImg.classList.add('visible');
    } else {
      bgImg.classList.remove('visible');
    }

    // Tarjetas interactivas de QR (exclusivas de la diapositiva final de cierre)
    let qrsHtml = '';
    if (slide.qrs && slide.qrs.length > 0) {
      qrsHtml = `
        <div class="slide-qr-group">
          ${slide.qrs.map(qr => `
            <div class="qr-card">
              <img src="${qr.src}" alt="${qr.label}" class="qr-img" />
              <span class="qr-label">${qr.label}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    contentBox.className = `slide-content-box layout-${slide.layout} entering`;
    contentBox.innerHTML = `
      <div class="slide-text-col">
        <span class="slide-kicker">${slide.kicker}</span>
        <h1 class="slide-title">${slide.title}</h1>
        ${slide.subtitle ? `<p class="slide-subtitle">${slide.subtitle}</p>` : ''}
        ${qrsHtml}
      </div>
    `;

    requestAnimationFrame(() => {
      contentBox.classList.remove('entering');
    });
  }

  function updateTrackerUI(index) {
    currentNumEl.textContent = String(index + 1).padStart(2, '0');
    btnPrev.disabled = index === 0;
    btnNext.querySelector('span').textContent = index === SLIDES.length - 1 ? 'Reiniciar' : 'Siguiente';

    const dots = dotsContainer.querySelectorAll('.tracker-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.classList.toggle('passed', i < index);
    });
  }

  function goTo(targetIndex) {
    if (targetIndex < 0 || targetIndex >= SLIDES.length || isTransitioning) return;
    if (targetIndex === currentIndex && contentBox.children.length > 0) return;

    isTransitioning = true;
    const prevIndex = currentIndex;
    const prevSlide = SLIDES[prevIndex];
    const nextSlide = SLIDES[targetIndex];

    contentBox.classList.add('leaving');

    setTimeout(() => {
      currentIndex = targetIndex;
      renderSlideContent(nextSlide);
      updateTrackerUI(currentIndex);
      onSlideChange?.(nextSlide, prevSlide, currentIndex);
      isTransitioning = false;
    }, 280);
  }

  function next() {
    if (currentIndex < SLIDES.length - 1) {
      goTo(currentIndex + 1);
    } else {
      goTo(0);
    }
  }

  function prev() {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'ArrowRight' || e.code === 'Space') {
      e.preventDefault();
      next();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.code === 'KeyR') {
      e.preventDefault();
      goTo(0);
    } else if (e.code === 'KeyF') {
      e.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  });

  // Touch gesture support (swipe left / right)
  let touchStartX = 0;
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) next();
        else prev();
      }
    }
  }, { passive: true });

  // Initial render
  renderSlideContent(SLIDES[0]);
  updateTrackerUI(0);
  onSlideChange?.(SLIDES[0], null, 0);

  return {
    getCurrentIndex: () => currentIndex,
    getSlide: (i) => SLIDES[i],
    next,
    prev,
    goTo,
    setLabMode: (isLab) => {
      overlay.style.display = isLab ? 'none' : 'flex';
      bgBackdrop.style.display = isLab ? 'none' : 'flex';
    }
  };
}
