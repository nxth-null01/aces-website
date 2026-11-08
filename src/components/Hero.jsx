import { ArrowDown, ArrowDownRight, ArrowUpRight, Crosshair } from 'lucide-react';
import { useRef, useState } from 'react';
import CoreViewer from './CoreViewer.jsx';
import { organization } from '../data/siteContent.js';

export default function Hero() {
  const [sceneLayer, setSceneLayer] = useState(null);
  const preference = useRef(matchMedia('(prefers-reduced-motion: reduce)'));

  function moveButton(event) {
    if (event.pointerType !== 'mouse' || preference.current.matches) return;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    button.style.setProperty('--pull-x', (event.clientX - rect.left - rect.width / 2) * 0.11 + 'px');
    button.style.setProperty('--pull-y', (event.clientY - rect.top - rect.height / 2) * 0.19 + 'px');
  }

  function resetButton(event) {
    event.currentTarget.style.removeProperty('--pull-x');
    event.currentTarget.style.removeProperty('--pull-y');
  }

  return (
    <section id="home" className="signal-hero">
      <div className="hero-plane" aria-hidden="true" />
      <div className="site-shell hero-shell">
        <div className="hero-coordinate mono">
          <span><Crosshair size={13} /> {organization.acronym} / EST. {organization.establishedYear}</span>
          <span>ACADEMIC YEAR {organization.academicYear} <i /></span>
        </div>
        <div className="hero-body">
          <div className="hero-copy">
            <div className="hero-kicker mono" data-hero-detail><span /> ASSOCIATION OF</div>
            <h1 aria-label={organization.name}>
              {['COMPUTER', 'EDUCATION', 'STUDENTS'].map((line, index) => (
                <span className="hero-line" key={line}><span>{line}{index === 2 && <b>.</b>}</span></span>
              ))}
            </h1>
            <p data-hero-detail>For students who learn by building, creating, and leading together.</p>
            <div className="hero-actions" data-hero-detail>
              <a className="signal-button magnet" href="#about" onPointerMove={moveButton} onPointerLeave={resetButton}>
                <span>Explore ACES <ArrowDownRight size={18} /></span>
              </a>
              <a className="quiet-link hero-directory" href="#/organization">Meet the Team <ArrowUpRight size={15} /></a>
            </div>
          </div>
          <CoreViewer layer={sceneLayer} />
        </div>
        <div className="hero-footer mono">
          <a href="#about"><ArrowDown size={14} /> SCROLL TO EXPLORE</a>
          <span>COLLEGE OF INFORMATION TECHNOLOGY</span>
        </div>
      </div>
      <div className="hero-scene-layer" ref={setSceneLayer} />
    </section>
  );
}
