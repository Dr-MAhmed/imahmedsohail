import { useRef } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import { useCounters } from '../hooks/useCounters';
import { useParallax } from '../hooks/useParallax';

/**
 * Faithful port of the original #home hero section, including the typewriter
 * loop, the animated stat counters, and the mouse parallax.
 */
export default function Hero() {
    const typewriterRef = useRef(null);
    const heroRef = useRef(null);
    const codeWindowRef = useRef(null);

    useTypewriter(typewriterRef);
    useCounters();
    useParallax(heroRef, codeWindowRef);

    return (
        <section id="home" className="hero" ref={heroRef}>
            <div className="hero-content">
                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    <span>Available for work</span>
                </div>
                <h1 className="hero-title">
                    <span style={{ fontSize: '0.5em', display: 'block', color: 'var(--neon-cyan)', fontFamily: "'Space Mono', monospace", marginBottom: '20px' }}>Hi, my name is</span>
                    <span className="gradient-text">Muhammad Ahmed</span>
                </h1>
                <p className="hero-subtitle">
                    {'> '}<span id="typewriter" ref={typewriterRef}></span><span className="terminal-cursor">_</span>
                </p>
                <div className="hero-cta">
                    <a href="#projects" className="btn btn-primary">
                        <span>View Projects</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                    <a href="#contact" className="btn btn-outline">
                        <span>Get in Touch</span>
                    </a>
                </div>
                <div className="hero-stats">
                    <div className="stat">
                        <span className="stat-number" data-count="15">0</span>
                        <span className="stat-label">Projects</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number" data-count="3">0</span>
                        <span className="stat-label">Years Exp</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number" data-count="12">0</span>
                        <span className="stat-label">Technologies</span>
                    </div>
                </div>
            </div>
            <div className="hero-visual">
                <div className="code-window" ref={codeWindowRef}>
                    <div className="code-header">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                        <span className="code-title">portfolio.js</span>
                    </div>
                    <pre className="code-content"><code>
                        <span className="code-keyword">const</span>{' '}
                        <span className="code-var">developer</span>{' = {\n  '}
                        <span className="code-prop">name</span>{': '}
                        <span className="code-string">"Muhammad Ahmed"</span>{',\n  '}
                        <span className="code-prop">role</span>{': '}
                        <span className="code-string">"Full-Stack Developer"</span>{',\n  '}
                        <span className="code-prop">skills</span>{': ['}
                        <span className="code-string">"React"</span>{', '}
                        <span className="code-string">"Node.js"</span>{', '}
                        <span className="code-string">"Python"</span>{'],\n  '}
                        <span className="code-prop">passion</span>{': '}
                        <span className="code-string">"Building cool stuff"</span>{',\n  '}
                        <span className="code-method">create</span>{': () => '}
                        <span className="code-string">"Amazing things"</span>{'\n'}
                        {'};'}{'\n\n'}
                        <span className="code-keyword">while</span>{'(developer.'}
                        <span className="code-method">isCoding</span>{') {\n  '}
                        {'developer.'}
                        <span className="code-method">learn</span>{'();\n  '}
                        {'developer.'}
                        <span className="code-method">build</span>{'();\n  '}
                        {'developer.'}
                        <span className="code-method">grow</span>{'();\n'}
                        {'}'}
                    </code></pre>
                </div>
            </div>
            <div className="scroll-indicator">
                <span>Scroll to explore</span>
                <div className="scroll-arrow"></div>
            </div>
        </section>
    );
}
