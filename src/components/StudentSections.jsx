import { ArrowUpRight, Code2, GraduationCap, Handshake, UsersRound } from 'lucide-react';
import { focusAreas } from '../data/siteContent.js';
import { opportunities } from '../data/learning.js';

const focusIcons = [GraduationCap, Code2, UsersRound, Handshake];
const opportunityLinks = ['#activities', '#workshops', '#activities', '#workshops', '#/organization/committees', '#elections'];

export function FocusSection() {
  return (
    <section id="what-we-do" className="section-space focus-section">
      <div className="site-shell">
        <div className="section-cap mono" data-stamp><span>02 / OUR WORK</span><span>FOUR AREAS OF FOCUS</span></div>
        <div className="section-intro"><h2>What we do<span>.</span></h2><p>ACES connects classroom learning with student projects, organization work, and service.</p></div>
        <div className="focus-grid">
          {focusAreas.map(({ title, copy, number }, index) => {
            const Icon = focusIcons[index];
            return <article className="focus-panel" key={title}><span className="mono">{number} / ACES</span><Icon size={36} aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>;
          })}
        </div>
      </div>
    </section>
  );
}

export function OpportunitiesSection() {
  return (
    <section id="opportunities" className="section-space opportunities-section">
      <div className="site-shell">
        <div className="section-cap mono" data-stamp><span>06 / STUDENT OPPORTUNITIES</span><span>WAYS TO PARTICIPATE</span></div>
        <div className="section-intro"><h2>Find your<br /> place in ACES<span>.</span></h2><p>These are ways to explore involvement. Follow confirmed announcements for availability and instructions.</p></div>
        <ol className="opportunity-list">
          {opportunities.map(({ title, text }, index) => (
            <li key={title}><span className="mono">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><a className="icon-button" href={opportunityLinks[index]} aria-label={'Explore ' + title.toLowerCase()}><ArrowUpRight size={17} /></a></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
