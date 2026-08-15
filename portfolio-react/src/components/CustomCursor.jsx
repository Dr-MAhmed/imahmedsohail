import { useEffect, useRef } from 'react';

/**
 * Faithful port of script.js section 2 (CURSOR) + the smoke particle trail.
 * Renders the exact same `.cursor` and `.cursor-dot` elements and spawns
 * `.cursor-smoke` divs on document mousemove, appended to <body>.
 */
export default function CustomCursor() {
    const cursorRef = useRef(null);
    const cursorDotRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;
        if (!cursor || !cursorDot) return;

        let lastX = 0;
        let lastY = 0;
        const smokeElements = [];

        function createSmokeParticle(x, y) {
            const smoke = document.createElement('div');
            smoke.className = 'cursor-smoke';

            // Random size between 8px and 20px
            const size = Math.random() * 12 + 8;
            smoke.style.width = size + 'px';
            smoke.style.height = size + 'px';
            smoke.style.left = x + 'px';
            smoke.style.top = y + 'px';

            // Random colors (cyan and magenta)
            const colors = [
                'rgba(0, 240, 255, 0.6)',  // cyan
                'rgba(255, 0, 170, 0.5)',  // magenta
                'rgba(168, 85, 247, 0.5)'  // violet
            ];
            smoke.style.background = colors[Math.floor(Math.random() * colors.length)];
            smoke.style.filter = `blur(${Math.random() * 2 + 1}px)`;

            // Random direction for drift
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 40 + 20;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 30;

            smoke.style.setProperty('--tx', tx + 'px');
            smoke.style.setProperty('--ty', ty + 'px');

            // Random animation duration
            const duration = Math.random() * 600 + 400;
            smoke.style.animation = `smokeRise ${duration}ms ease-out forwards`;

            document.body.appendChild(smoke);
            smokeElements.push(smoke);

            // Remove particle from DOM after animation
            setTimeout(() => {
                smoke.remove();
                const idx = smokeElements.indexOf(smoke);
                if (idx > -1) smokeElements.splice(idx, 1);
            }, duration);
        }

        function onMouseMove(e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';

            // Create smoke particles every 5px of movement
            const distance = Math.hypot(mouseX - lastX, mouseY - lastY);
            if (distance > 5) {
                createSmokeParticle(mouseX, mouseY);
                lastX = mouseX;
                lastY = mouseY;
            }
        }

        document.addEventListener('mousemove', onMouseMove);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            smokeElements.forEach((el) => el.remove());
        };
    }, []);

    return (
        <>
            <div className="cursor" ref={cursorRef}></div>
            <div className="cursor-dot" ref={cursorDotRef}></div>
        </>
    );
}
