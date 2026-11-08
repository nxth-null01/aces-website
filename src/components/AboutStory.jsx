import { ArrowDownRight, Braces, CircuitBoard, Eye, Flag } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import AcesLogo from './AcesLogo.jsx';
import { office, organization } from '../data/siteContent.js';

const chapters = [
  { id: 'aces-identity', label: 'Identity', title: 'We are ACES.', text: organization.introduction, icon: CircuitBoard },
  { id: 'mission-vision', label: 'Mission', title: organization.mission, icon: Flag },
  { id: 'aces-vision', label: 'Vision', title: organization.vision, icon: Eye },
  { id: 'aces-objectives', label: 'Objectives', title: 'A place to build with purpose.', icon: Braces },
];

const StoryChapters = memo(function StoryChapters() {
  return (
    <div className="story-chapters">
      {chapters.map(({ id, label, title, text, icon: Icon }, index) => (
        <article id={id} key={id} data-chapter={index}>
          <p className="eyebrow mono"><Icon size={17} /> 0{index + 1} / {label}</p>
          {index === 0 ? <h2>{title}</h2> : <h3>{title}</h3>}
          {text && <p>{text}</p>}
          {index === 0 && <>
            <p>{organization.background}</p>
            <dl className="about-facts">
              <div><dt>Established</dt><dd>{organization.establishedYear}</dd></div>
              <div><dt>Academic year</dt><dd>{organization.academicYear}</dd></div>
              <div><dt>School affiliation</dt><dd>{office.department}<br />{office.college}</dd></div>
            </dl>
            <p className="source-note">These are the proposed mission, vision, and objectives for ACES.</p>
          </>}
          {id === 'aces-objectives' && (
            <ul>
              {organization.objectives.map((objective, index) => (
                <li key={objective}>
                  <span className="mono">0{index + 1}</span>
                  <p>{objective}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
});

export default function AboutStory() {
  const [active, setActive] = useState(0);
  const story = useRef(null);

  useEffect(() => {
    let observer;
    const observe = () => {
      observer?.disconnect();
      const compact = matchMedia('(max-width: 767.98px)').matches;
      const top = Math.round(compact ? Math.min(150, window.innerHeight * 0.25) : window.innerHeight * 0.36);
      const bottom = Math.round(compact ? Math.max(0, window.innerHeight - top - 60) : window.innerHeight * 0.48);
      observer = new IntersectionObserver((entries) => {
        const incoming = entries.find((entry) => entry.isIntersecting);
        if (incoming) setActive(Number(incoming.target.dataset.chapter));
      }, { rootMargin: '-' + top + 'px 0px -' + bottom + 'px 0px' });
      story.current.querySelectorAll('[data-chapter]').forEach((chapter) => observer.observe(chapter));
    };
    observe();
    window.addEventListener('resize', observe, { passive: true });
    return () => { window.removeEventListener('resize', observe); observer.disconnect(); };
  }, []);

  return (
    <section id="about" className="story-section section-space" ref={story}>
      <div className="site-shell">
        <div className="section-cap mono" data-stamp><span>01 / ABOUT ACES</span><span>IDENTITY & PURPOSE</span></div>
        <div className="story-layout">
          <aside className="story-map" aria-label="About chapter navigation">
            <div className="story-map-top mono"><AcesLogo className="story-mark" label="Official ACES logo" /> ABOUT ACES <span>0{active + 1}</span></div>
            <div className="story-diagram" data-active={active} aria-hidden="true">
              <svg viewBox="0 0 360 216" fill="none">
                <path className="map-grid" d="M20 40h320M20 74h320M20 108h320M20 142h320M20 176h320M60 20v176M120 20v176M180 20v176M240 20v176M300 20v176" />
                <path className="map-path" d="M45 148h56l54-80h48l52 65h60" pathLength="100" />
                {[{x:45,y:148},{x:155,y:68},{x:255,y:133},{x:315,y:133}].map(({x,y},index) => <g key={index} className={active === index ? 'is-current' : ''}><circle cx={x} cy={y} r="16"/><circle cx={x} cy={y} r="4"/></g>)}
              </svg>
            </div>
            <nav className="story-jumps" aria-label="About chapters">
              {chapters.map((chapter, index) => <a href={'#' + chapter.id} key={chapter.id} aria-current={index === active ? 'location' : undefined}><span className="mono">0{index + 1}</span>{chapter.label}<ArrowDownRight size={15} /></a>)}
            </nav>
          </aside>
          <StoryChapters />
        </div>
      </div>
    </section>
  );
}
