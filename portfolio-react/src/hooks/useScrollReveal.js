import { useEffect } from 'react';

/**
 * Faithful port of script.js "initScrollReveal" (section 3).
 * Observes `.fade-in` / `.stagger-children` elements and adds `.visible`
 * when they enter the viewport.
 *
 * NOTE: In the original markup no element carries those classes, so this is
 * a no-op — replicated exactly to keep behavior identical.
 */
export function useScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.fade-in, .stagger-children').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);
}
