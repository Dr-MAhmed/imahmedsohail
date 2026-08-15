# Muhammad Ahmed — Portfolio (React)

A pixel-faithful React conversion of the original static portfolio
(`index.html` + `styles.css` + `script.js` + `projects.js` + `cursor-trail.js`).

Built with **Vite + React 18**. The visual design, colors, fonts, spacing,
animations, markup, and behavior are unchanged from the original.

---

## ⚠️ Before you run it — one manual step

The Claude sandbox could not copy binary files, so the logo has not been copied yet.
Do this once:

```bash
# Windows (Command Prompt)
copy "C:\Users\Muhammad Ahmed\Desktop\imahmedsohail\logo.png" "C:\Users\Muhammad Ahmed\Desktop\imahmedsohail\portfolio-react\public\assets\logo.png"

# Windows (PowerShell)
Copy-Item "C:\Users\Muhammad Ahmed\Desktop\imahmedsohail\logo.png" "C:\Users\Muhammad Ahmed\Desktop\imahmedsohail\portfolio-react\public\assets\logo.png"

# macOS / Linux
cp ~/Desktop/imahmedsohail/logo.png ~/Desktop/imahmedsohail/portfolio-react/public/assets/logo.png
```

The app will still start without it, but the navbar logo and favicon will be missing.

---

## Run locally

```bash
cd portfolio-react
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Production build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

---

## Project structure

```
portfolio-react/
├── index.html                 Vite entry — same <head> fonts/title/favicon
├── package.json
├── vite.config.js
├── public/
│   └── assets/logo.png        ← copy your logo here (see above)
└── src/
    ├── main.jsx               React root (StrictMode intentionally omitted)
    ├── App.jsx                assembles all sections
    ├── styles/global.css      the original styles.css, copied verbatim
    ├── data/projects.js       the 15 project records as an ES module
    ├── hooks/
    │   ├── useTypewriter.js   hero typing loop
    │   ├── useCounters.js     hero stat counters
    │   ├── useActiveSection.js nav active-link on scroll
    │   ├── useScrollReveal.js IntersectionObserver (no-op, like the original)
    │   ├── useParallax.js     hero mouse parallax
    │   └── useRoundedFavicon.js rounded favicon generator
    └── components/
        ├── FluidBackground.jsx floating particle field background
        ├── Navbar.jsx  Hero.jsx  About.jsx
        ├── Projects.jsx  Skills.jsx  Contact.jsx  Footer.jsx
```

---

## Behavior notes (faithful ports, including the original's quirks)

The conversion intentionally preserves the original site's actual behavior,
including its bugs. Nothing was "improved" or redesigned.

1. ~~Skill bars never fill~~ — **Fixed + upgraded.** The original read
   `data-skill` from the wrong element (`.skill-progress` instead of its
   parent `.skill-item`), so the bars stayed empty. The React version reads
   from the parent and fills each bar in **sync with scroll position** — 0%
   when it enters the viewport, up to its target percentage when it reaches
   the top of the screen, reversing smoothly when you scroll back up.
2. **Mobile hamburger does nothing.** The original never wired a click handler
   to `.nav-menu-btn`, so nav links stay hidden on ≤768px. Preserved.
3. **Filter buttons don't filter.** They only toggle the `active` class;
   projects.js never implemented grid filtering. Preserved.
4. **Project grid starts with 3 cards.** "View All Projects" reveals the rest
   with the same staggered fade/slide animation; "Show Less" removes them the
   same way. Preserved.
5. **Default cursor restored.** The custom arrow cursor, smoke trail, and
   WebGL fluid simulation were removed — the browser's default cursor is used
   everywhere. (The unused `CustomCursor.jsx` and
   `lightswind/smokey-cursor.jsx` files are still on disk but no longer
   imported, so they are not part of the build.)
6. **Scroll-reveal classes are unused.** No element in the markup carries
   `.fade-in`/`.stagger-children`, so the reveal observer is a no-op.
7. **Contact form is a simulation.** Submitting with name + email shows a
   green "Message Sent!" button for 3 seconds, then resets. No message is sent.
8. **Code-window parallax is overridden** by the `floatWindow` CSS animation;
   only the hero's subtle translate moves. Preserved.
9. **Fonts** are Space Grotesk + Space Mono (as loaded by the original
   `index.html`). The SPEC.md references different fonts, but the running site
   used these.

## Not ported

- `fluid-cursor.js` — an alternate WebGL fluid effect that `index.html` never
  loaded (the original site didn't use it).
- `mockup.html` — a separate design mockup, not part of the running site.
