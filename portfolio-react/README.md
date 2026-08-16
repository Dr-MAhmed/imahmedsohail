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
    ├── data/projects.js       project records (21 total) as an ES module
    ├── hooks/
    │   ├── useTypewriter.js   hero typing loop
    │   ├── useCounters.js     hero stat counters
    │   ├── useActiveSection.js nav active-link on scroll
    │   ├── useScrollReveal.js IntersectionObserver (no-op, like the original)
    │   ├── useParallax.js     hero mouse parallax
    │   └── useRoundedFavicon.js rounded favicon generator
    └── components/
        ├── FluidBackground.jsx floating particle field background
        ├── lightswind/smokey-cursor.jsx  WebGL fluid smoke trail (mouse move)
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
2. **Hero stat counters animate.** Projects **15+**, Years Exp **3+**,
   Technologies **12+** count up from 0 with a smooth ease-out curve when the
   hero stats scroll into view (the "+" is added by CSS).
3. ~~Mobile hamburger does nothing~~ — **Fixed.** The original never wired a
   click handler to `.nav-menu-btn`, so nav links were unreachable on phones.
   The hamburger now opens a slide-down menu (with the classic → X animation)
   on ≤768px, and clicking a link closes it.
4. **Filter buttons don't filter.** They only toggle the `active` class;
   projects.js never implemented grid filtering. Preserved.
5. **Project grid starts with 3 cards.** "View All Projects" reveals the rest
   with the same staggered fade/slide animation; "Show Less" removes them the
   same way. Preserved.
6. **Default cursor + fluid smoke trail.** The browser's default cursor is
   used everywhere (no custom cursor). The **WebGL fluid simulation** from
   `src/components/lightswind/smokey-cursor.jsx` runs as a full-screen
   overlay — colorful smoke trails the mouse. The overlay is
   `pointer-events: none`, so it never blocks clicks and never hides the
   cursor. The floating particle field still runs behind it.
7. **Scroll-reveal classes are unused.** No element in the markup carries
   `.fade-in`/`.stagger-children`, so the reveal observer is a no-op.
8. **Contact form is a simulation.** Submitting with name + email shows a
   green "Message Sent!" button for 3 seconds, then resets. No message is sent.
9. **Code-window parallax is overridden** by the `floatWindow` CSS animation;
   only the hero's subtle translate moves. Preserved.
10. **Fonts** are Space Grotesk + Space Mono (as loaded by the original
   `index.html`). The SPEC.md references different fonts, but the running site
   used these.

## Mobile responsiveness

The site is responsive across phones, tablets, and desktop:

- **≤768px** — stacked single-column layout, working hamburger menu with a
  slide-down panel, smaller section padding, and the tech-orbit + code window
  sized to fit.
- **≤480px (small phones)** — tighter spacing, full-width buttons, smaller
  hero title/stats/orbit, and reduced typography so nothing overflows or gets
  cut off.
- Horizontal overflow is prevented on the hero visual, code window, and
  tech-orbit; `overflow-x: hidden` on the body is a safety net.

## SmokeyCursor component

The fluid effect is `src/components/lightswind/smokey-cursor.jsx` — implemented
from the provided lightswind source, adapted for this JSX/Vite project
(TS types stripped, Tailwind classes → inline styles). Import it with the `@`
alias:

```jsx
import SmokeyCursor from '@/components/lightswind/smokey-cursor';

// Basic usage — full-screen overlay
<SmokeyCursor />

// Custom simulation quality
<SmokeyCursor simulationResolution={256} dyeResolution={1024} enableShading />

// High quality desktop experience
<SmokeyCursor
  simulationResolution={256}
  dyeResolution={2048}
  densityDissipation={2}
  curl={5}
  splatForce={8000}
/>

// Intense fire-like effect
<SmokeyCursor
  curl={10}
  splatForce={12000}
  densityDissipation={1.5}
  colorUpdateSpeed={20}
  backgroundColor={{ r: 0.8, g: 0.1, b: 0 }}
/>

// Subtle ambient effect
<SmokeyCursor
  splatRadius={0.1}
  splatForce={3000}
  densityDissipation={8}
  velocityDissipation={5}
  colorUpdateSpeed={5}
/>
```

Props: `simulationResolution`, `dyeResolution`, `captureResolution`,
`densityDissipation`, `velocityDissipation`, `pressure`, `pressureIterations`,
`curl`, `splatRadius`, `splatForce`, `enableShading`, `colorUpdateSpeed`,
`backgroundColor`, `transparent`, `className`, `disabled`, `intensity`,
`followMouse`, `autoColors`.

## Not ported

- `fluid-cursor.js` — an alternate WebGL fluid effect that `index.html` never
  loaded (the original site didn't use it).
- `mockup.html` — a separate design mockup, not part of the running site.
