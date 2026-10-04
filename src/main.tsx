import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupDesktopZoomPrevention } from './lib/preventDesktopZoom';

// Initialize desktop browser zoom prevention (Ctrl+Wheel, Ctrl++, Ctrl+-, Ctrl+0, trackpad pinch)
setupDesktopZoomPrevention();

// Prevent multi-finger pinch-to-zoom on mobile devices while maintaining standard single-finger scrolling
if (typeof window !== 'undefined') {
  document.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  document.addEventListener('gesturestart', (e: Event) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', (e: Event) => e.preventDefault(), { passive: false });
  document.addEventListener('gestureend', (e: Event) => e.preventDefault(), { passive: false });

  // ── Water Ripple System ─────────────────────────────────────────────────────
  // Creates a CSS-animated aqua ripple from the exact click/touch position
  // on all interactive elements (buttons, glass cards, service cards).
  document.addEventListener('pointerdown', (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    const host = target.closest<HTMLElement>(
      'button, [role="button"], .glass-card, .iphone-glass-card, .service-gloss-card, .btn-glossy-primary, .btn-glossy-secondary'
    );
    if (!host) return;

    // Make sure host can clip the ripple
    const prevPos = host.style.position;
    const prevOverflow = host.style.overflow;
    if (!prevPos || prevPos === 'static') host.style.position = 'relative';
    host.style.overflow = 'hidden';

    const rect = host.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'water-ripple-effect';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top  = `${e.clientY - rect.top}px`;
    host.appendChild(ripple);

    // Clean up after animation (650ms matches CSS)
    setTimeout(() => {
      ripple.remove();
      // Restore original styles only if we set them
      if (!prevPos || prevPos === 'static') host.style.position = prevPos;
      host.style.overflow = prevOverflow;
    }, 700);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
