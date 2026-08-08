/* ============================================
   PORTFOLIO SCRIPTS
   ============================================ */

(function () {
    'use strict';

    // ==========================================
    // 1. PARTICLES
    // ==========================================
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
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
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    // ==========================================
    // 2. CURSOR
    // ==========================================
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');

    if (cursor && cursorDot) {
        // Create cursor on mouse move
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = (e.clientX - 10) + 'px';
            cursor.style.top = (e.clientY - 10) + 'px';
            cursorDot.style.left = (e.clientX - 3) + 'px';
            cursorDot.style.top = (e.clientY - 3) + 'px';
        });

        // Hide default cursor
        document.body.style.cursor = 'none';
    } else {
        console.warn('Cursor elements not found');
    }

    // ==========================================
    // 3. SCROLL ANIMATIONS
    // ==========================================

    // Counter animation
    function animateCounters() {
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.getAttribute('data-count'));
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
        });
    }

    // Scroll reveal for elements
    function initScrollReveal() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.fade-in, .stagger-children').forEach(el => {
            observer.observe(el);
        });
    }

    // ==========================================
    // 4. NAVIGATION
    // ==========================================
    function initNav() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        // Active nav link on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ==========================================
    // 5. PROJECT FILTER
    // ==========================================
    function initProjectFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Note: Filtering is now handled in projects.js
                // This function just manages the active state of filter buttons
            });
        });
    }

    // ==========================================
    // 6. CONTACT FORM
    // ==========================================
    function initContactForm() {
        const form = document.getElementById('contact-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            if (!name || !email) {
                form.style.borderColor = '#ff5f57';
                return;
            }

            // Show success state
            const btn = form.querySelector('.btn-submit');
            const originalText = btn.innerHTML;

            btn.innerHTML = `<span>Message Sent!</span>`;
            btn.style.background = 'linear-gradient(135deg, #22c55e, #00f0ff)';
            btn.disabled = true;

            // Reset after 3 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    // ==========================================
    // 7. MOUSE PARALLAX ON HERO
    // ==========================================
    function initParallax() {
        const hero = document.querySelector('.hero');
        const codeWindow = document.querySelector('.code-window');

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            hero.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
            codeWindow.style.transform = `perspective(1000px) rotateY(${x * -5}deg) rotateX(${y * 5}deg)`;
        });
    }

    // ==========================================
    // 8. SKILLS ANIMATION
    // ==========================================
    function initSkillAnimation() {
        const skillBars = document.querySelectorAll('.skill-progress');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const width = bar.getAttribute('data-skill') + '%';
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 300);
                        observer.unobserve(bar);
                    }
                });
            },
            { threshold: 0.3 }
        );

        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // ==========================================
    // 8a. TYPEWRITER EFFECT
    // ==========================================
    function initTypewriter() {
        const words = [
            "Full-Stack Developer.",
            "Building robust backend pipelines.",
            "Crafting pixel-perfect frontend experiences.",
            "Exploring web interfaces and animations.",
            "Turning complex ideas into simple code."
        ];
        let i = 0;
        let timer;

        function typingEffect() {
            let word = words[i].split("");
            const loopTyping = () => {
                if (word.length > 0) {
                    document.getElementById('typewriter').innerHTML += word.shift();
                } else {
                    setTimeout(deletingEffect, 2000);
                    return false;
                }
                timer = setTimeout(loopTyping, 80);
            };
            loopTyping();
        }

        function deletingEffect() {
            let word = words[i].split("");
            const loopDeleting = () => {
                if (word.length > 0) {
                    word.pop();
                    document.getElementById('typewriter').innerHTML = word.join("");
                } else {
                    if (words.length > (i + 1)) {
                        i++;
                    } else {
                        i = 0;
                    }
                    setTimeout(typingEffect, 500);
                    return false;
                }
                timer = setTimeout(loopDeleting, 40);
            };
            loopDeleting();
        }

        typingEffect();
    }

    // ==========================================
    // 9. INIT
    // ==========================================
    function init() {
        resizeCanvas();
        initParticles();
        animateParticles();
        animateCounters();
        initScrollReveal();
        initNav();
        initProjectFilter();
        initContactForm();
        initParallax();
        initSkillAnimation();
        initTypewriter();

        // Handle resize
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        // Re-observe elements on scroll
        window.addEventListener('scroll', () => {
            initScrollReveal();
        });

        console.log('Portfolio loaded ✓');
    }

    // ==========================================
    // 10. KEYBOARD ACCESSIBILITY
    // ==========================================
    document.addEventListener('keydown', (e) => {
        // Escape to close mobile menu (if implemented)
        if (e.key === 'Escape') {
            console.log('Escape pressed');
        }
    });

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
