import './styles/global.css';

import CustomCursor from './components/CustomCursor';
import FluidBackground from './components/FluidBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

import { useScrollReveal } from './hooks/useScrollReveal';
import { useRoundedFavicon } from './hooks/useRoundedFavicon';

export default function App() {
  // Faithful port of script.js "initScrollReveal".
  // It observes `.fade-in` / `.stagger-children` elements — in the original
  // markup none exist, so this is a no-op, exactly like the original site.
  useScrollReveal();

  // Faithful port of script.js "makeFaviconRounded" — swaps in a rounded
  // canvas-generated favicon once the logo has loaded.
  useRoundedFavicon();

  return (
    <>
      {/* Custom cursor + cursor-dot (same elements as the original <body>) */}
      <CustomCursor />

      {/* Background effects: visible particle field + inert #smokey-cursor canvas
          (faithful to the original's actual runtime behavior) */}
      <FluidBackground />

      {/* Gradient orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
