import { useEffect } from 'react';

/**
 * Faithful port of script.js "animateCounters" (section 3).
 * Animates every [data-count] element from 0 up to its target value.
 * Runs once on mount, exactly like the original site.
 */
export function useCounters() {
    useEffect(() => {
        const intervals = [];

        document.querySelectorAll('[data-count]').forEach((el) => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            let current = 0;
            const step = Math.ceil(target / 60);

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current;
            }, 30);
            intervals.push(timer);
        });

        return () => intervals.forEach(clearInterval);
    }, []);
}
