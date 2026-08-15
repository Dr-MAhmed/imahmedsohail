import { useRef, useState } from 'react';

/**
 * Faithful port of the original #contact section + script.js "initContactForm".
 *
 * On submit:
 * - if name or email is empty, `form.style.borderColor` is set to red
 *   (the form has no border in the CSS, so this is invisible — same as
 *   the original).
 * - otherwise the button briefly shows "Message Sent!" with a green gradient,
 *   is disabled for 3 seconds, then the form resets.
 */
export default function Contact() {
    const formRef = useRef(null);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = formRef.current;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        if (!name || !email) {
            form.style.borderColor = '#ff5f57';
            return;
        }

        // Show success state
        setIsSent(true);

        // Reset after 3 seconds
        setTimeout(() => {
            setIsSent(false);
            form.reset();
        }, 3000);
    };

    return (
        <section id="contact" className="contact">
            <div className="section-header">
                <span className="section-tag">04</span>
                <h2 className="section-title">Let's Connect</h2>
            </div>
            <div className="contact-content">
                <div className="contact-info">
                    <h3 className="contact-heading">Have a project in mind?</h3>
                    <p className="contact-text">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Let's build something amazing together.
                    </p>
                    <div className="contact-links">
                        <a href="mailto:hello@example.com" className="contact-link">
                            <span className="link-icon">📧</span>
                            <span className="link-text">hello@example.com</span>
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="contact-link">
                            <span className="link-icon">💻</span>
                            <span className="link-text">github.com/imahmedsohail</span>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-link">
                            <span className="link-icon">💼</span>
                            <span className="link-text">linkedin.com/in/imahmedsohail</span>
                        </a>
                    </div>
                </div>
                <div className="contact-form-wrapper">
                    <form className="contact-form" id="contact-form" ref={formRef} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" id="name" name="name" required />
                            <label htmlFor="name">Your Name</label>
                            <span className="focus-border"></span>
                        </div>
                        <div className="form-group">
                            <input type="email" id="email" name="email" required />
                            <label htmlFor="email">Your Email</label>
                            <span className="focus-border"></span>
                        </div>
                        <div className="form-group">
                            <textarea id="message" name="message" rows="4" required></textarea>
                            <label htmlFor="message">Your Message</label>
                            <span className="focus-border"></span>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-submit"
                            style={isSent ? { background: 'linear-gradient(135deg, #22c55e, #00f0ff)' } : undefined}
                            disabled={isSent}
                        >
                            {isSent ? (
                                <span>Message Sent!</span>
                            ) : (
                                <>
                                    <span>Send Message</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
