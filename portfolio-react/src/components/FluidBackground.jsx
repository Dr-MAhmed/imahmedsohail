import { useEffect, useRef } from 'react';

/**
 * Background effects — ported to match the ACTUAL behavior of the original site.
 *
 * IMPORTANT FINDING about the original cursor-trail.js:
 *   The file calls `resizeCanvas()` (which calls `initFramebuffers()`, which
 *   reads `ext.halfFloatTexType`) BEFORE `const { gl, ext }` is declared.
 *   Because a freshly created <canvas> is 300x150 while `clientWidth` is the
 *   full viewport, the size guard always fires, so `ext` is always accessed
 *   while still in its temporal dead zone. The script throws a ReferenceError
 *   on every page load — the WebGL fluid simulation NEVER rendered, and the
 *   `#particles` canvas was NEVER hidden (the hide call sits after the crash).
 *
 * Consequences for the real site (replicated here exactly):
 *   1. The visible background is the cyan/magenta particle field (#particles).
 *   2. The `#smokey-cursor` canvas exists in the DOM but is inert/invisible
 *      (an empty, transparent canvas at z-index 1).
 *
 * The `#smokey-cursor` element is rendered below for exact DOM parity; the
 * fluid code itself is intentionally omitted. If you ever want the fluid
 * effect, the shader code is preserved in the original cursor-trail.js.
 */
export default function FluidBackground() {
    const fluidRef = useRef(null);
    const particlesRef = useRef(null);

    useEffect(() => {
        const particlesCanvas = particlesRef.current;
        if (!particlesCanvas) return;

        // ---- PARTICLE CANVAS (ported verbatim from script.js section 1) ----
        // The original particle field is visible and runs continuously.
        const pCtx = particlesCanvas.getContext('2d');
        let particles = [];
        let mouseX = 0, mouseY = 0;
        let rafId = null;

        const resizeCanvas = () => {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * particlesCanvas.width;
                this.y = Math.random() * particlesCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.hue = Math.random() > 0.5 ? 180 : 300; // cyan or magenta
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x -= dx * force * 0.01;
                    this.y -= dy * force * 0.01;
                }

                // Wrap around
                if (this.x < 0) this.x = particlesCanvas.width;
                if (this.x > particlesCanvas.width) this.x = 0;
                if (this.y < 0) this.y = particlesCanvas.height;
                if (this.y > particlesCanvas.height) this.y = 0;
            }

            draw() {
                pCtx.beginPath();
                pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                pCtx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
                pCtx.fill();
            }
        }

        function initParticles() {
            const count = Math.min(80, Math.floor((particlesCanvas.width * particlesCanvas.height) / 12000));
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            rafId = requestAnimationFrame(animateParticles);
        }

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const onResize = () => {
            resizeCanvas();
            initParticles();
        };

        resizeCanvas();
        initParticles();
        animateParticles();

        document.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onResize);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            document.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <>
            {/* Inert #smokey-cursor canvas — present for DOM parity, does nothing
                (the original's WebGL fluid never rendered, see note above) */}
            <canvas
                ref={fluidRef}
                id="smokey-cursor"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />
            {/* Visible particle field — the actual background of the original */}
            <canvas ref={particlesRef} id="particles" />
        </>
    );
}
