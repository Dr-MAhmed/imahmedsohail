import { useEffect, useState } from 'react';

/**
 * Faithful port of script.js "initNav" (section 4).
 * Tracks which section is currently in view and returns its id, so the
 * Navbar can apply the `active` class to the matching link.
 */
export function useActiveSection(initial = 'home') {
    const [active, setActive] = useState(initial);

    useEffect(() => {
        const sections = document.querySelectorAll('section');

        const onScroll = () => {
            let current = '';
            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            setActive(current);
        };

        window.addEventListener('scroll', onScroll);
        onScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return active;
}
