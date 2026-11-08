import { ArrowUpRight, Plus, ScrollText } from 'lucide-react';
import { byLaws, office, organization } from '../data/siteContent.js';

const questions = [
  ['What is ACES?', organization.acronym + ' is the ' + organization.name + ', established in ' + organization.establishedYear + ' at ' + office.college + '.'],
  ['Who can participate in ACES activities?', 'Check each official activity announcement for eligibility and participation instructions. Requirements may vary by activity.'],
  ['Where is the ACES office?', 'The ACES office is on the second floor of Samson College of Science and Technology, adjacent to the Guidance Office.'],
  ['How can students learn about upcoming workshops?', 'Review the Workshops & Learning Programs section for proposed topics. Confirmed programs and dates will appear in official announcements.'],
  ['How can students participate in committees?', 'Explore the committee directory to learn what each team does. Ask the ACES office about any confirmed opportunities and requirements.'],
  ['Where can students find official announcements?', 'Follow the official ACES Facebook page for organization announcements.'],
  ['How can students learn about the next elections?', 'The Elections section outlines the proposed 2027 process. Follow official ACES announcements for approved requirements and dates.'],
];

export default function ResourcesSection() {
  return (
    <section id="by-laws" className="section-space governance-section">
      <div className="site-shell">
        <div className="section-cap mono" data-stamp><span>09 / RESOURCES</span><span>DOCUMENTS &amp; FAQ</span></div>
        <div className="section-intro"><h2>Resources<span>.</span></h2><p>Find answers to common student questions and look for the constitution and by-laws here when a public copy is available.</p></div>
        {byLaws.downloadUrl && <div className="resource-grid">
          <article className="resource-card">
            <ScrollText size={23} aria-hidden="true" />
            <h3>ACES Constitution &amp; By-Laws</h3>
            <p>Governing document for membership, leadership, and organizational responsibilities.</p>
            <a className="quiet-link" href={byLaws.downloadUrl} download>Download document <ArrowUpRight size={15} /></a>
          </article>
        </div>}
        <div id="faq" className="faq">
          <h3>Frequently asked questions</h3>
          {questions.map(([question, answer]) => (
            <details key={question}><summary>{question}<Plus size={17} aria-hidden="true" /></summary><p>{answer}</p></details>
          ))}
          {office.facebook && <a className="quiet-link" href={office.facebook}>Official announcements <ArrowUpRight size={15} /></a>}
        </div>
      </div>
    </section>
  );
}
