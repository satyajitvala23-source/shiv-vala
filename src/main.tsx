import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupDesktopZoomPrevention } from './lib/preventDesktopZoom';
import { initLiquidTouchEngine } from './lib/liquidTouch';

// Initialize desktop browser zoom prevention (Ctrl+Wheel, Ctrl++, Ctrl+-, Ctrl+0, trackpad pinch)
setupDesktopZoomPrevention();

// Initialize Apple iOS 26 Liquid Glass Touch & Refraction Physics Engine
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

  // Start liquid touch engine
  initLiquidTouchEngine();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

