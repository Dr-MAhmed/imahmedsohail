/**
 * Faithful port of the original #about section, including the tech-orbit.
 * The orbit items keep their exact inline `--i` custom property which the
 * CSS uses to position them around the rings.
 */
export default function About() {
    return (
        <section id="about" className="about">
            <div className="section-header">
                <span className="section-tag">01</span>
                <h2 className="section-title">About Me</h2>
            </div>
            <div className="about-content">
                <div className="about-text">
                    <p className="about-intro">
                        I'm a full-stack developer who loves turning ideas into reality through code. With expertise spanning front-end finesse to back-end robustness, I create digital solutions that make an impact.
                    </p>
                    <p className="about-detail">
                        My journey started with curiosity about how websites work, and evolved into a passion for building seamless user experiences. I specialize in the MERN stack but I'm always exploring new technologies and methodologies.
                    </p>
                    <p className="about-detail">
                        When I'm not coding, you'll find me exploring new tech, contributing to open source, or diving into the latest frameworks. I believe in writing clean, maintainable code and building products that solve real problems.
                    </p>
                </div>
                <div className="about-visual">
                    <div className="tech-orbit">
                        <div className="orbit-center">
                            <span>MA</span>
                        </div>
                        <div className="orbit-ring ring-1">
                            <div className="orbit-item" style={{ '--i': '0' }}>⚛️</div>
                            <div className="orbit-item" style={{ '--i': '1' }}>🟢</div>
                            <div className="orbit-item" style={{ '--i': '2' }}>🐍</div>
                            <div className="orbit-item" style={{ '--i': '3' }}>🐳</div>
                        </div>
                        <div className="orbit-ring ring-2">
                            <div className="orbit-item" style={{ '--i': '0' }}>🔷</div>
                            <div className="orbit-item" style={{ '--i': '1' }}>🍃</div>
                            <div className="orbit-item" style={{ '--i': '2' }}>☁️</div>
                            <div className="orbit-item" style={{ '--i': '3' }}>📘</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
