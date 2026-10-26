import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hash) {
      const anchor = document.getElementById(hash.slice(1));
      if (anchor) {
        anchor.scrollIntoView({ block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 360);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button className="scroll-top" type="button" aria-label="回到頁面頂端" title="回到頁面頂端" onClick={handleScrollToTop}>
      <span aria-hidden="true">↑</span>
    </button>
  );
}
