import { useEffect } from 'react';

/**
 * Scroll-linked skill-bar animation.
 *
 * Each `.skill-progress` bar fills toward its `data-skill` target (read from
 * the parent `.skill-item`, fixing the original script.js bug) in direct
 * proportion to how far it has scrolled through the viewport:
 *   - 0% when the bar enters at the bottom edge of the screen
 *   - target% when it reaches the top edge of the screen
 *
 * Scrolling back up reverses it, so the bars track your scroll position.
 * A short 0.15s transition (inline, overriding the CSS 1s one) keeps the
 * fill smooth without lag behind the scroll.
 */
export function useSkillBars(ref) {
    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const bars = Array.from(container.querySelectorAll('.skill-progress'));

        const getTarget = (bar) => {
            const item = bar.closest('.skill-item');
            const val = item ? parseInt(item.getAttribute('data-skill'), 10) : 0;
            return Number.isFinite(val) ? val : 0;
        };

        const targets = bars.map(getTarget);

        bars.forEach((bar) => {
            bar.style.transition = 'width 0.15s ease-out';
        });

        let rafId = null;

        const update = () => {
            rafId = null;
            const vh = window.innerHeight;

            bars.forEach((bar, i) => {
                const rect = bar.getBoundingClientRect();
                // 0 when the bar's top is at the bottom edge of the viewport,
                // 1 when it reaches the top edge.
                let progress = 1 - rect.top / vh;
                if (progress < 0) progress = 0;
                if (progress > 1) progress = 1;

                bar.style.width = `${(targets[i] * progress).toFixed(1)}%`;
            });
        };

        const schedule = () => {
            if (rafId === null) {
                rafId = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);

        return () => {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [ref]);
}
