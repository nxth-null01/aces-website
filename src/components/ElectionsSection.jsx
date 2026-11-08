import { ArrowDownRight, ArrowLeft, ArrowRight, Check, ClipboardCheck, FilePenLine, ListChecks, Mail, MailCheck, MapPin } from 'lucide-react';
import { useState } from 'react';
import { elections, office } from '../data/siteContent.js';

const icons = [ListChecks, ClipboardCheck, Mail, MailCheck, MapPin, FilePenLine];

export default function ElectionsSection() {
  const [index, setIndex] = useState(0);
  const step = elections.steps[index];
  const Icon = icons[index];

  return (
    <section id="elections" className="section-space elections-section">
      <div className="site-shell">
        <div className="section-cap mono" data-stamp><span>08 / STUDENT LEADERSHIP</span><span>PROPOSED PROCESS</span></div>
        <div className="section-intro"><h2>{elections.year} Elections<span>.</span></h2><p>Walk through the proposed Executive and Legislative application process. Dates, qualifications, and required documents await confirmation.</p></div>
        <div className="election-console">
          <ol className="election-steps" aria-label="Application steps">
            {elections.steps.map(({ title }, stepIndex) => <li key={title}><button type="button" aria-current={stepIndex === index ? 'step' : undefined} onClick={() => setIndex(stepIndex)}><span className="step-node mono">{stepIndex < index ? <Check size={16} /> : '0' + (stepIndex + 1)}</span><span>{title}</span></button></li>)}
          </ol>
          <div className="election-detail" key={index} aria-live="polite">
            <Icon className="step-art" size={142} strokeWidth={0.65} aria-hidden="true" />
            <p className="eyebrow mono">STEP 0{index + 1} / 0{elections.steps.length}</p>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {index === 2 && (office.email ? <a className="quiet-link" href={'mailto:' + office.email}>Official ACES email <Mail size={15} /></a> : <span className="status-tag mono">OFFICIAL EMAIL PENDING</span>)}
            {index === 4 && <a className="quiet-link" href="#contact">Find the ACES office <ArrowDownRight size={16} /></a>}
          </div>
          <div className="election-controls">
            <span className="mono">0{index + 1} / 0{elections.steps.length}</span>
            <div><button className="icon-button" type="button" aria-label="Previous election step" disabled={!index} onClick={() => setIndex(index - 1)}><ArrowLeft size={18} /></button><button className="icon-button" type="button" aria-label="Next election step" disabled={index === elections.steps.length - 1} onClick={() => setIndex(index + 1)}><ArrowRight size={18} /></button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
