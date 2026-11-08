import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import AcesLogo from '../components/AcesLogo.jsx';
import CommitteeCard from '../components/CommitteeCard.jsx';
import LeadershipBoard from '../components/LeadershipBoard.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { organizationGroups, rosterApprovalPending } from '../data/officers.js';

export default function Organization() {
  return (
    <>
      <main className="inner-page directory-page">
        <header className="inner-header site-shell">
          <div className="section-cap mono"><span className="section-brand"><AcesLogo /> 05 / ORGANIZATION</span><a href="#home">BACK TO ACES <ArrowUpRight size={15} /></a></div>
          <div className="section-intro">
            <h1>The ACES<br />directory<span>.</span></h1>
            <div><p>Explore the leadership hierarchy and meet the teams that do the work.</p><a className="quiet-link" href="#/organization/committees">Jump to committees <ArrowDownRight size={16} /></a></div>
          </div>
        </header>
        <section className="site-shell directory-roster" aria-label="Leadership hierarchy">
          <LeadershipBoard />
        </section>
        <section id="committee-directory" className="site-shell section-space committees-directory">
          <div className="section-cap mono" data-stamp><span className="section-brand"><AcesLogo /> 05.02 / COMMITTEES</span><span>TEAM INDEX</span></div>
          <div className="section-intro"><h2>Meet the teams<span>.</span></h2>{rosterApprovalPending && <p>Assignments are drawn from earlier ACES records and await final approval before publication.</p>}</div>
          <div className="committee-grid">
            {organizationGroups.map((committee, index) => <CommitteeCard key={committee.id} committee={committee} index={index} />)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
