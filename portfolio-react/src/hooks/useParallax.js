import { useEffect } from 'react';

/**
 * Faithful port of script.js "initParallax" (section 7).
 * Translates the hero container and tilts the code window with the mouse.
 *
 * NOTE: exactly like the original, the code-window transform is overridden
 * by the `floatWindow` CSS animation — only the hero translate is visible.
 */
export function useParallax(heroRef, codeWindowRef) {
    useEffect(() => {
        const hero = heroRef.current;
        const codeWindow = codeWindowRef.current;
        if (!hero) return;

        const onMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            hero.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
            if (codeWindow) {
                codeWindow.style.transform = `perspective(1000px) rotateY(${x * -5}deg) rotateX(${y * 5}deg)`;
            }
        };

        document.addEventListener('mousemove', onMouseMove);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            hero.style.transform = '';
            if (codeWindow) codeWindow.style.transform = '';
        };
    }, [heroRef, codeWindowRef]);
}
