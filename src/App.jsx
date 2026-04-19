import Message from './Message';

function App() {
  return (
    <div>
      <Message />
    </div>
  );
}

export default App;
import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const NAV_LINKS = ["How It Works", "Features", "Impact", "Get Started"];
 
const STATS = [
  { value: "8M+", label: "Tonnes of plastic enter oceans yearly" },
  { value: "71%", label: "Of Earth is covered by ocean" },
  { value: "2°C", label: "Ocean warming since pre-industrial era" },
];
 
const FEATURES = [
  {
    icon: "🌊",
    title: "Track Your Wave",
    desc: "Log your daily habits — transport, diet, energy, and plastic use — and watch your ocean impact ripple in real time.",
  },
  {
    icon: "🐋",
    title: "Sea Creatures React",
    desc: "Your footprint is reflected through the ocean's living creatures. Low impact? The whales sing. High impact? The coral bleaches.",
  },
  {
    icon: "🧭",
    title: "Chart Your Course",
    desc: "Get personalised tips ranked by impact. Small changes compound — we show you which ones move the needle most.",
  },
  {
    icon: "🪸",
    title: "Protect the Reef",
    desc: "Every reduction you make is mapped to real ocean conservation data. See the patch of reef your choices are protecting.",
  },
];
 
const STEPS = [
  { num: "01", title: "Answer a few questions", body: "Tell us about your lifestyle — it takes under two minutes." },
  { num: "02", title: "See your footprint", body: "We calculate your CO₂ output and ocean impact score." },
  { num: "03", title: "Dive deeper", body: "Explore your breakdown and discover what changes matter most." },
  { num: "04", title: "Make waves", body: "Track progress over time and share your ocean pledge." },
];
 
function AnimatedFish() {
  return (
    <div className="fish-school" aria-hidden="true">
      {[...Array(7)].map((_,i) => (
        <img
        key={i} 
        src="/phish.png"
        alt=""
        className={`fish fish--${i + 1}`}
        style={{ width: ["69px", "42.0px", "67px", "42.0px", "69px", "42.0px", "69px"][i] }}/>
      ))}
    </div>
  );
}
 
function WaveDivider({ flip }) {
  return (
    <div className={`wave-divider${flip ? " wave-divider--flip" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </div>
  );
}
 
function StatCounter({ value, label }) {
  const [displayed, setDisplayed] = useState("0");
  const ref = useRef(null);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplayed(value);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
 
  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-value">{displayed}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
 
export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
  return (
    <div className="sf-root">
      {/* NAV */}
      <nav className={`sf-nav${scrolled ? " sf-nav--scrolled" : ""}`}>
        <a href="#" className="sf-logo">
          <span className="sf-logo-icon">🌊</span>
          <span className="sf-logo-text">seafoot</span>
        </a>
        <ul className={`sf-nav-links${menuOpen ? " sf-nav-links--open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <a href="#" onClick={() => setMenuOpen(false)}>{l}</a>
            </li>
          ))}
          <li>
            <a href="#" className="sf-nav-cta" onClick={() => setMenuOpen(false)}>
              Calculate Now
            </a>
          </li>
        </ul>
        <button
          className="sf-hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>
 
      {/* HERO */}
      <section className="sf-hero">
        <div className="sf-hero-bg">
          <div className="sf-hero-gradient" />
          <AnimatedFish />
          <div className="bubble-field" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <span key={i} className={`bubble bubble--${i + 1}`} />
            ))}
          </div>
        </div>
 
        <div className="sf-hero-content">
          <p className="sf-hero-eyebrow">Your ocean. Your responsibility.</p>
          <h1 className="sf-hero-headline">
            Know your<br />
            <em>sea footprint.</em>
          </h1>
          <p className="sf-hero-body">
            Seafoot translates your everyday choices into ocean impact — then helps you chart a course toward cleaner seas.
          </p>
          <div className="sf-hero-actions">
            <a href="#" className="sf-btn sf-btn--primary">
              Dive into Calculating
            </a>
          </div>
        </div>
 
        <div className="sf-hero-scroll-hint" aria-hidden="true">
          <span className="scroll-line" />
          <span className="scroll-dot" />
        </div>
      </section>
 
      <WaveDivider />
 
      {/* STATS */}
      <section className="sf-stats">
        <div className="sf-container">
          <p className="sf-section-label">Why it matters</p>
          <h2 className="sf-section-title">The ocean is telling us something.</h2>
          <div className="sf-stats-grid">
            {STATS.map((s) => (
              <StatCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>
 
      <WaveDivider flip />
 
      {/* FEATURES */}
      <section className="sf-features">
        <div className="sf-container">
          <p className="sf-section-label">Features</p>
          <h2 className="sf-section-title">Built for the ocean. <em>Made for you.</em></h2>
          <div className="sf-features-grid">
            {FEATURES.map((f, i) => (
              <div className="sf-feature-card" key={f.title} style={{ "--delay": `${i * 0.1}s` }}>
                <span className="sf-feature-icon">{f.icon}</span>
                <h3 className="sf-feature-title">{f.title}</h3>
                <p className="sf-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <WaveDivider />
 
      {/* HOW IT WORKS */}
      <section className="sf-how">
        <div className="sf-container">
          <p className="sf-section-label">How it works</p>
          <h2 className="sf-section-title">Four steps to clearer waters.</h2>
          <div className="sf-steps">
            {STEPS.map((s) => (
              <div className="sf-step" key={s.num}>
                <span className="sf-step-num">{s.num}</span>
                <div>
                  <h3 className="sf-step-title">{s.title}</h3>
                  <p className="sf-step-body">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <WaveDivider flip />
 
      {/* CREATURES SECTION */}
      <section className="sf-creatures">
        <div className="sf-container sf-creatures-inner">
          <div className="sf-creatures-text">
            <p className="sf-section-label">Ocean health meter</p>
            <h2 className="sf-section-title">How are the seas today?</h2>
            <p className="sf-creatures-body">
              Seafoot's living dashboard uses real biodiversity data to show you the state of the ocean through its residents. Better choices = happier creatures.
            </p>
            <a href="#" className="sf-btn sf-btn--primary sf-btn--sm">See Your Dashboard</a>
          </div>
          <div className="sf-creatures-visual">
            <div className="creature-stack">
              {[
                { e: "🐳", scale: 1.1, x: "10%", y: "5%", delay: "0s" },
                { e: "🐠", scale: 0.8, x: "70%", y: "20%", delay: "0.3s" },
                { e: "🦑", scale: 0.9, x: "5%", y: "55%", delay: "0.6s" },
                { e: "🐡", scale: 0.7, x: "55%", y: "60%", delay: "0.9s" },
                { e: "🪸", scale: 1.0, x: "80%", y: "70%", delay: "1.2s" },
                { e: "🐚", scale: 0.6, x: "30%", y: "80%", delay: "1.5s" },
              ].map((c, i) => (
                <span
                  key={i}
                  className="creature-float"
                  style={{ left: c.x, top: c.y, fontSize: `${c.scale * 3}rem`, animationDelay: c.delay }}
                  aria-hidden="true"
                >
                  {c.e}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      <WaveDivider />
 
      {/* CTA */}
      <section className="sf-cta">
        <div className="sf-container sf-cta-inner">
          <span className="sf-cta-glyph" aria-hidden="true">🌊</span>
          <h2 className="sf-cta-title">Your ocean journey starts with one step.</h2>
          <p className="sf-cta-body">
            Join thousands making waves for cleaner, healthier seas. Free forever.
          </p>
          <a href="#" className="sf-btn sf-btn--white">
            Calculate My Sea Footprint
          </a>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer className="sf-footer">
        <div className="sf-container sf-footer-inner">
          <div className="sf-footer-brand">
            <span className="sf-logo-icon">🌊</span>
            <span className="sf-logo-text">seafoot</span>
            <p className="sf-footer-tagline">Measuring steps. Protecting seas.</p>
          </div>
          <div className="sf-footer-links">
            {["About", "Privacy", "Contact", "Press"].map((l) => (
              <a key={l} href="#">{l}</a>
            ))}
          </div>
          <p className="sf-footer-copy">Made with 💙 for the ocean.</p>
        </div>
      </footer>
    </div>
  );
}
