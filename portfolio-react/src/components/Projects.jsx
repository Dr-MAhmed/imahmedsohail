import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { projects } from '../data/projects';

const INITIAL_DISPLAY_COUNT = 3;

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Full Stack', value: 'fullstack' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
];

/**
 * Faithful port of projects.js + script.js section 5.
 *
 * - Initially only the first 3 project cards are rendered.
 * - "View All" reveals the rest with the exact same staggered
 *   fade/slide animation (opacity 0 -> 1, translateY 30px -> 0, 100ms apart).
 * - "Show Less" removes them with the exact same animation
 *   (opacity 1 -> 0, translateY -20px, 50ms apart, removed after 300ms).
 * - The filter buttons toggle their `active` class only — the original JS
 *   never actually filtered the grid, so neither does this.
 */
export default function Projects() {
    const [displayed, setDisplayed] = useState(projects.slice(0, INITIAL_DISPLAY_COUNT));
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const gridRef = useRef(null);

    // Entry animation: new cards start hidden, then transition in one by one.
    useLayoutEffect(() => {
        if (!isExpanded) return;
        const cards = gridRef.current.querySelectorAll('.project-card');
        const timers = [];

        cards.forEach((card, index) => {
            if (index < INITIAL_DISPLAY_COUNT) return;
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            const t = setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
            timers.push(t);
        });

        return () => timers.forEach(clearTimeout);
    }, [isExpanded]);

    const handleViewAll = () => {
        if (!isExpanded) {
            setDisplayed(projects);
            setIsExpanded(true);
        } else {
            setDisplayed(projects); // keep extras mounted while they animate out
            setIsExpanded(false);
        }
    };

    // Exit animation: mark the extra cards for removal, animate them out,
    // then drop them from the DOM (mirrors projects.js "Show Less").
    useEffect(() => {
        if (isExpanded) return; // only runs during the hiding phase
        if (displayed.length <= INITIAL_DISPLAY_COUNT) return;

        const cards = gridRef.current.querySelectorAll('.project-card');
        const timers = [];

        for (let index = INITIAL_DISPLAY_COUNT; index < displayed.length; index++) {
            const card = cards[index];
            const rel = index - INITIAL_DISPLAY_COUNT;
            const t = setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';

                const t2 = setTimeout(() => {
                    setDisplayed(projects.slice(0, INITIAL_DISPLAY_COUNT));
                }, 300);
                timers.push(t2);
            }, rel * 50);
            timers.push(t);
        }

        return () => timers.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded]);

    return (
        <section id="projects" className="projects">
            <div className="section-header">
                <span className="section-tag">02</span>
                <h2 className="section-title">Featured Work</h2>
            </div>
            <div className="projects-filter">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        className={`filter-btn${activeFilter === filter.value ? ' active' : ''}`}
                        data-filter={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
            <div className="projects-grid" id="projects-grid" ref={gridRef}>
                {displayed.map((project, index) => (
                    <div className="project-card" key={index}>
                        <div className="project-image">
                            {project.image ? (
                                <img src={project.image} alt={project.title} className="project-thumb" loading="lazy" />
                            ) : (
                                <span style={{ fontSize: '64px' }}>{project.icon}</span>
                            )}
                        </div>
                        <div className="project-content">
                            <span className="project-category">{project.category}</span>
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-desc">{project.description}</p>
                            <div className="project-tech">
                                {project.tech.map((tech) => (
                                    <span className="tech-tag" key={tech}>{tech}</span>
                                ))}
                            </div>
                            <div className="project-links">
                                {project.github && (
                                <a href={project.github} target="_blank" rel="noreferrer" className="project-link">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    <span>GitHub</span>
                                </a>
                                )}
                                <a href={project.demo} target="_blank" rel="noreferrer" className="project-link">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9V3" />
                                    </svg>
                                    <span>Live Demo</span>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="projects-cta">
                <button className="btn btn-primary" id="view-all-projects" onClick={handleViewAll}>
                    <span>{isExpanded ? 'Show Less' : 'View All Projects'}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d={isExpanded ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
                    </svg>
                </button>
            </div>
        </section>
    );
}
