/**
 * ============================================================================
 * SHIV COMPUTER — APPLE iOS 26 LIQUID GLASS TOUCH & REFRACTION ENGINE
 * ============================================================================
 *
 * Implements the authentic video-style liquid interactive effect:
 * 1. Exact pointer / touch coordinate tracking (iOS touch, Android touch, desktop pointer).
 * 2. 3D perspective surface flexing / indenting towards touch point.
 * 3. Expanding water-like refractive ripple rings with luminous cyan & specular white caustics.
 * 4. Glossy light-wave reflection sweep across the glass surface.
 * 5. Natural Apple spring-back physics on release (cubic-bezier(0.34, 1.56, 0.64, 1)).
 * 6. High-concurrency support for fast repeated taps with zero stuck elements.
 * 7. Non-blocking, preserves all existing click handlers and form submissions.
 * 8. Respects prefers-reduced-motion.
 */

let isInitialized = false;

// Elements that automatically receive the liquid touch effect
const INTERACTIVE_SELECTOR = [
  'button',
  'a[href]',
  '[role="button"]',
  '[role="radio"]',
  '.liquid-glass-btn',
  '.btn-glossy-primary',
  '.btn-glossy-secondary',
  '.glass-card',
  '.service-gloss-card',
  '.iphone-glass-card',
  '.liquid-touch-target',
  '[data-liquid-touch]',
].join(', ');

// Elements to exclude from liquid distortion (e.g. form inputs, textareas)
const EXCLUDED_SELECTOR = [
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
  '[data-no-liquid]',
].join(', ');

export function initLiquidTouchEngine(): () => void {
  if (typeof window === 'undefined' || isInitialized) {
    return () => {};
  }

  isInitialized = true;

  // Insert SVG filter for real optical refraction if not present
  if (!document.getElementById('shiv-liquid-svg-filter')) {
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.id = 'shiv-liquid-svg-filter';
    svg.setAttribute('style', 'position: absolute; width: 0; height: 0; pointer-events: none; opacity: 0; overflow: hidden;');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `
      <defs>
        <filter id="liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feBlend in="SourceGraphic" in2="displaced" mode="overlay" />
        </filter>
      </defs>
    `;
    document.body.appendChild(svg);
  }

  // Active tracking map for multi-touch or pointerdown
  const activeElements = new Map<number, HTMLElement>();

  const prefersReducedMotion = () => {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const handlePointerDown = (e: PointerEvent) => {
    // Only primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Check if target or any parent matches interactive elements
    const interactiveEl = target.closest(INTERACTIVE_SELECTOR) as HTMLElement | null;
    if (!interactiveEl) return;

    // Skip excluded elements
    if (target.closest(EXCLUDED_SELECTOR) || interactiveEl.matches(EXCLUDED_SELECTOR)) {
      return;
    }

    // Skip disabled buttons
    if (interactiveEl.hasAttribute('disabled') || interactiveEl.getAttribute('aria-disabled') === 'true') {
      return;
    }

    const rect = interactiveEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    activeElements.set(e.pointerId, interactiveEl);

    // Ensure relative positioning for ripple containment
    const computedPos = window.getComputedStyle(interactiveEl).position;
    if (computedPos === 'static') {
      interactiveEl.style.position = 'relative';
    }

    // Ensure overflow is hidden unless specifically instructed otherwise
    if (!interactiveEl.classList.contains('overflow-visible')) {
      interactiveEl.style.overflow = 'hidden';
    }

    // 1. PHYSICAL 3D FLEX / SURFACE DEFORMATION AROUND CONTACT POINT
    if (!prefersReducedMotion()) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const normX = (x - centerX) / (rect.width / 2);
      const normY = (y - centerY) / (rect.height / 2);

      // Tilt surface towards the finger point (soft flex indentation)
      const maxTilt = 4.5;
      const tiltX = -normY * maxTilt;
      const tiltY = normX * maxTilt;

      interactiveEl.style.setProperty('--liq-touch-x', `${x}px`);
      interactiveEl.style.setProperty('--liq-touch-y', `${y}px`);
      interactiveEl.style.setProperty('--liq-touch-x-pct', `${pctX}%`);
      interactiveEl.style.setProperty('--liq-touch-y-pct', `${pctY}%`);

      interactiveEl.style.transform = `perspective(600px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(0.975) translateZ(-3px)`;
      interactiveEl.style.transition = 'transform 0.09s cubic-bezier(0.2, 0.9, 0.3, 1)';
    }

    // 2. WATER RIPPLE CONTAINER & WAVE CREATION
    let rippleContainer = interactiveEl.querySelector('.liquid-ripple-container') as HTMLElement | null;
    if (!rippleContainer) {
      rippleContainer = document.createElement('span');
      rippleContainer.className = 'liquid-ripple-container';
      rippleContainer.setAttribute('aria-hidden', 'true');
      interactiveEl.appendChild(rippleContainer);
    }

    // Diameter based on element dimensions
    const maxDimension = Math.max(rect.width, rect.height);
    const rippleSize = Math.max(maxDimension * 2.2, 120);

    const ripple = document.createElement('span');
    ripple.className = 'liquid-touch-ripple';
    ripple.style.width = `${rippleSize}px`;
    ripple.style.height = `${rippleSize}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.marginLeft = `-${rippleSize / 2}px`;
    ripple.style.marginTop = `-${rippleSize / 2}px`;

    // 3. GLOSSY LIGHT REFLECTION SPECULAR WAVE
    const specularWave = document.createElement('span');
    specularWave.className = 'liquid-specular-wave';
    specularWave.style.left = `${pctX}%`;
    specularWave.style.top = `${pctY}%`;

    rippleContainer.appendChild(ripple);
    rippleContainer.appendChild(specularWave);

    // Clean up temporary ripples after animation finishes
    const cleanup = () => {
      ripple.remove();
      specularWave.remove();
      if (rippleContainer && rippleContainer.children.length === 0) {
        rippleContainer.remove();
      }
    };

    setTimeout(cleanup, 650);
  };

  const handlePointerRelease = (e: PointerEvent) => {
    const el = activeElements.get(e.pointerId);
    if (!el) return;

    activeElements.delete(e.pointerId);

    if (!prefersReducedMotion()) {
      // 4. NATURAL APPLE SPRING-BACK BOUNCE PHYSICS
      // cubic-bezier(0.34, 1.56, 0.64, 1) provides authentic liquid overshoot & spring recovery
      el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
      el.style.transition = 'transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)';

      setTimeout(() => {
        // Clear inline style so hover states / CSS classes behave normally
        if (!activeElements.has(e.pointerId)) {
          el.style.transform = '';
          el.style.transition = '';
        }
      }, 430);
    }
  };

  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
  window.addEventListener('pointerup', handlePointerRelease, { passive: true });
  window.addEventListener('pointercancel', handlePointerRelease, { passive: true });

  return () => {
    window.removeEventListener('pointerdown', handlePointerDown);
    window.removeEventListener('pointerup', handlePointerRelease);
    window.removeEventListener('pointercancel', handlePointerRelease);
    activeElements.clear();
    isInitialized = false;
  };
}
