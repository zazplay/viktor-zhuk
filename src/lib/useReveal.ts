import { useEffect, useRef } from 'react';

let observer: IntersectionObserver | null = null;

/** One observer for the whole page; each element is revealed once and then forgotten. */
function sharedObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-revealed', '');
        observer?.unobserve(entry.target);
      }
    },
    // Reveal once the top of the element is a little way up from the bottom of the screen.
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  );
  return observer;
}

/**
 * Attach to an element marked `data-reveal`: it rises into place the first time it scrolls into
 * view. The styles live in global.css and are skipped for people who prefer reduced motion.
 */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = sharedObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return ref;
}
