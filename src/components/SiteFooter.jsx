import { ArrowUpRight } from 'lucide-react';
import AcesLogo from './AcesLogo.jsx';
import { office, organization } from '../data/siteContent.js';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-top">
          <a href="#home" className="footer-brand" aria-label="ACES home"><AcesLogo className="footer-mark" /><span>ACES<b className="brand-dot">.</b></span></a>
          <div><p>{organization.name}<br />{office.department}<br />{office.college}</p><span className="mono">EST. {organization.establishedYear} · A.Y. {organization.academicYear}</span></div>
          <nav aria-label="Footer navigation">
            <a href="#/organization">Organization <ArrowUpRight size={14} /></a><a href="#/gallery">Gallery <ArrowUpRight size={14} /></a>
            <a href="#by-laws">By-Laws <ArrowUpRight size={14} /></a><a href="#elections">2027 Elections <ArrowUpRight size={14} /></a>
          </nav>
        </div>
        <div className="footer-base mono"><span>© {organization.establishedYear} {organization.acronym}</span><a href="#contact">CONTACT ACES <ArrowUpRight size={13} /></a></div>
      </div>
    </footer>
  );
}
