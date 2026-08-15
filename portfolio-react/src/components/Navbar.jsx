import { useActiveSection } from '../hooks/useActiveSection';

/**
 * Faithful port of the original <nav> markup and script.js "initNav".
 * The `active` class follows the section currently in view.
 *
 * NOTE: the `.nav-menu-btn` hamburger is rendered exactly as in the original
 * — it has no click handler, because the original JS never wired one up.
 */
const NAV_LINKS = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
    const active = useActiveSection('home');

    return (
        <nav className="nav">
            <div className="nav-logo">
                <img src="/assets/logo.png" alt="Logo" className="nav-logo-img" />
            </div>
            <div className="nav-links">
                {NAV_LINKS.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className={`nav-link${active === link.href.slice(1) ? ' active' : ''}`}
                        data-text={link.label}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
            <div className="nav-menu-btn">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
}
