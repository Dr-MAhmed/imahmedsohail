/**
 * Faithful port of the original #skills section.
 *
 * NOTE: the skill bars are intentionally left at their default `width: 0`.
 * The original script.js tried to read `data-skill` from `.skill-progress`
 * elements, but the attribute lives on the parent `.skill-item`, so the bars
 * never filled in the original site. Per the "replicate exactly" decision,
 * that behavior is preserved here.
 */

const SKILL_CATEGORIES = [
    {
        icon: '🎨',
        title: 'Frontend',
        skills: [
            { name: 'React / Next.js', percent: '95' },
            { name: 'TypeScript', percent: '90' },
            { name: 'Tailwind CSS', percent: '88' },
        ],
    },
    {
        icon: '⚙️',
        title: 'Backend & AI',
        skills: [
            { name: 'Node.js / Express', percent: '92' },
            { name: 'AI Integration (LLMs)', percent: '85' },
            { name: 'n8n Workflow Automation', percent: '87' },
        ],
    },
    {
        icon: '🗄️',
        title: 'Database',
        skills: [
            { name: 'MongoDB', percent: '90' },
            { name: 'PostgreSQL', percent: '85' },
            { name: 'Redis', percent: '80' },
        ],
    },
    {
        icon: '🚀',
        title: 'DevOps',
        skills: [
            { name: 'CI/CD Pipelines', percent: '90' },
            { name: 'Docker', percent: '88' },
            { name: 'AWS', percent: '82' },
        ],
    },
];

export default function Skills() {
    return (
        <section id="skills" className="skills">
            <div className="section-header">
                <span className="section-tag">03</span>
                <h2 className="section-title">Skills & Tools</h2>
            </div>
            <div className="skills-container">
                {SKILL_CATEGORIES.map((category) => (
                    <div className="skill-category" key={category.title}>
                        <h3 className="category-title">
                            <span className="category-icon">{category.icon}</span>
                            {category.title}
                        </h3>
                        <div className="skill-items">
                            {category.skills.map((skill) => (
                                <div className="skill-item" data-skill={skill.percent} key={skill.name}>
                                    <div className="skill-info">
                                        <span className="skill-name">{skill.name}</span>
                                        <span className="skill-percent">{skill.percent}%</span>
                                    </div>
                                    <div className="skill-bar">
                                        <div className="skill-progress"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
