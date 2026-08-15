import { useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';

/**
 * Faithful port of the original <nav> markup and script.js "initNav".
 * The `active` class follows the section currently in view.
 *
 * Mobile: the original hamburger (`.nav-menu-btn`) had no click handler, so
 * nav links stayed hidden on phones. Now it toggles an `.open` class that
 * slides the links down under the navbar. Clicking a link closes the menu.
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
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="nav">
            <div className="nav-logo">
                <img src="/assets/logo.png" alt="Logo" className="nav-logo-img" />
            </div>
            <div className={`nav-links${menuOpen ? ' open' : ''}`}>
                {NAV_LINKS.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className={`nav-link${active === link.href.slice(1) ? ' active' : ''}`}
                        data-text={link.label}
                        onClick={closeMenu}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
            <div
                className={`nav-menu-btn${menuOpen ? ' active' : ''}`}
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle navigation menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
}
