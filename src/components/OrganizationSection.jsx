import { ArrowUpRight } from 'lucide-react';
import AcesLogo from './AcesLogo.jsx';
import LeadershipBoard from './LeadershipBoard.jsx';

export default function OrganizationSection() {
  return (
    <section id="organization" className="section-space org-section">
      <div className="site-shell">
        <div className="section-cap mono" data-stamp><span className="section-brand"><AcesLogo /> 05 / ORGANIZATION</span><a href="#/organization">FULL DIRECTORY <ArrowUpRight size={15} /></a></div>
        <div className="section-intro"><h2>The people<br />behind ACES<span>.</span></h2><p>Explore how the faculty adviser, officers, and committees fit together.</p></div>
        <LeadershipBoard preview />
      </div>
    </section>
  );
}
