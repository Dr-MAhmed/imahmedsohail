import { useEffect } from 'react';

/**
 * Skill-bar animation — fixes the original script.js "initSkillAnimation" bug.
 *
 * The original read `data-skill` from `.skill-progress`, but the attribute
 * lives on the parent `.skill-item`, so the bars never filled (width: null%).
 * This hook reads the attribute from the parent via closest('.skill-item')
 * and animates each bar to its percentage when it scrolls into view,
 * matching the behavior the original clearly intended.
 */
export function useSkillBars(ref) {
    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const bars = container.querySelectorAll('.skill-progress');
        const timers = [];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        // FIX: read data-skill from the parent .skill-item
                        const skillItem = bar.closest('.skill-item');
                        const width = (skillItem ? skillItem.getAttribute('data-skill') : '0') + '%';

                        bar.style.width = '0%';
                        const t = setTimeout(() => {
                            bar.style.width = width;
                        }, 300);
                        timers.push(t);

                        observer.unobserve(bar);
                    }
                });
            },
            { threshold: 0.3 }
        );

        bars.forEach((bar) => observer.observe(bar));

        return () => {
            observer.disconnect();
            timers.forEach(clearTimeout);
        };
    }, [ref]);
}
