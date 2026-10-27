import { useEffect } from 'react';

export function useReveal(key: string) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = !('IntersectionObserver' in window) || reducedMotion.matches ? null : new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px 30px 0px' },
    );

    const observe = (node: HTMLElement) => {
      if (node.classList.contains('is-visible')) return;
      if (observer) observer.observe(node);
      else node.classList.add('is-visible');
    };

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observe);
    const mutations = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches('[data-reveal]')) observe(node);
        node.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observe);
      }));
    });
    mutations.observe(document.querySelector('#main') ?? document.body, { childList: true, subtree: true });
    return () => {
      observer?.disconnect();
      mutations.disconnect();
    };
  }, [key]);
}
