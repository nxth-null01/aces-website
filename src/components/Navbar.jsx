import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AcesLogo from './AcesLogo.jsx';
import { organization } from '../data/siteContent.js';

const THEME_STORAGE_KEY = 'aces-theme';
const MOBILE_NAV = '(max-width: 1023.98px)';
const navigationLinks = [
  ['About', 'about'],
  ['Workshops', 'workshops'],
  ['Activities', 'activities'],
  ['Organization', 'organization'],
  ['Gallery', 'gallery'],
  ['Resources', 'by-laws'],
  ['Contact', 'contact'],
];
const sectionIds = navigationLinks.map(([, target]) => target);

function getInitialTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export default function Navbar({ activeRoute = 'home' }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_NAV).matches);
  const [activeSection, setActiveSection] = useState(activeRoute);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const favicon = document.getElementById('aces-favicon');
    favicon.href = new URL(`aces-${theme}.ico`, favicon.href).href;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The selected theme still applies when persistent storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_NAV);
    const updateLayout = (event) => {
      setIsMobile(event.matches);
      setIsMenuOpen(false);
    };
    media.addEventListener('change', updateLayout);
    return () => media.removeEventListener('change', updateLayout);
  }, []);

  useEffect(() => {
    if (activeRoute !== 'home') {
      setActiveSection(activeRoute);
      return undefined;
    }

    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    let positions = [];
    let lastSection;
    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.3;
      let currentSection = 'home';

      for (const { id, top } of positions) {
        if (top <= marker) currentSection = id;
      }

      if (currentSection !== lastSection) {
        lastSection = currentSection;
        setActiveSection(currentSection);
      }
    };
    const measureSections = () => {
      positions = sections.map((section) => ({ id: section.id, top: section.getBoundingClientRect().top + window.scrollY })).sort((first, second) => first.top - second.top);
      updateActiveSection();
    };

    let frame;
    const scheduleUpdate = () => {
      if (frame !== undefined) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        updateActiveSection();
      });
    };
    const resizeObserver = new ResizeObserver(measureSections);
    resizeObserver.observe(document.querySelector('main'));
    sections.forEach((section) => resizeObserver.observe(section));
    measureSections();
    window.addEventListener('resize', measureSections, { passive: true });
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', measureSections);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [activeRoute]);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  const getHref = (target) => (target === 'organization' || target === 'gallery' ? `#/${target}` : `#${target}`);

  return (
    <nav className="aces-nav" aria-label="Primary navigation" onKeyDown={(event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
        event.currentTarget.querySelector('.navbar-toggler')?.focus();
      }
    }}>
      <div className="site-shell nav-shell">
        <a className="navbar-brand" href="#home" onClick={closeMenu} aria-label="ACES home">
          <AcesLogo className="nav-mark" />
          <span><strong>ACES<span className="brand-dot">.</span></strong><small className="mono">STUDENT ORGANIZATION</small></span>
        </a>
        <div className={`navbar-collapse${isMenuOpen ? ' show' : ''}`} id="aces-navigation" inert={isMobile && !isMenuOpen}>
          <div className="navbar-nav">
            {navigationLinks.map(([label, target]) => (
              <a
                key={target}
                className={`nav-link${activeSection === target ? ' is-active' : ''}`}
                aria-current={activeSection === target ? (activeRoute === target ? 'page' : 'location') : undefined}
                href={getHref(target)}
                onClick={() => {
                  setActiveSection(target);
                  closeMenu();
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="nav-utilities">
          <span className="nav-year mono">A.Y. {organization.academicYear}</span>
          <button
              className="icon-button theme-btn"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="theme-icon" size={17} aria-hidden="true" /> : <Moon className="theme-icon" size={17} aria-hidden="true" />}
          </button>
          <button className="icon-button navbar-toggler" type="button" aria-controls="aces-navigation" aria-expanded={isMenuOpen} aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setIsMenuOpen((isOpen) => !isOpen)}>
            {isMenuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <span className="scroll-progress" aria-hidden="true" />
    </nav>
  );
}
