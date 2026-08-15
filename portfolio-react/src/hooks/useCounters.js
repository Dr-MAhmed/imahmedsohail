import { useEffect } from 'react';

/**
 * Animated counters for the hero stats (Projects 15+, Years Exp 3+,
 * Technologies 12+).
 *
 * Upgraded from the original script.js "animateCounters":
 *   - Triggers when the element scrolls into view (IntersectionObserver),
 *     instead of blindly running on page load.
 *   - Counts 0 → target with an easeOutCubic curve over ~1.6s, so the
 *     animation is smooth and clearly visible.
 *   - The trailing "+" is already rendered by CSS (`.stat-number::after`).
 */
export function useCounters() {
    useEffect(() => {
        const elements = document.querySelectorAll('[data-count]');
        if (!elements.length) return;

        const DURATION = 1600;

        function animate(el) {
            const target = parseInt(el.getAttribute('data-count'), 10) || 0;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / DURATION, 1);
                // easeOutCubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            }
            requestAnimationFrame(tick);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}
