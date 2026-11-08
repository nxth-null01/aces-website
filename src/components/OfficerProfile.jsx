import { ArrowLeft, ArrowRight, ArrowUpRight, Download, FileBadge, Minus, Plus } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { officerRoleResponsibilities, rosterApprovalPending } from '../data/officers.js';
import { organization } from '../data/siteContent.js';
import AcesLogo from './AcesLogo.jsx';
import Modal from './Modal.jsx';

export function initials(name) {
  return name.split(' ').filter((part) => part.length > 2).slice(0, 2).map((part) => part[0]).join('');
}

function CredentialMetadata({ credential }) {
  return <dl className="credential-meta">
    {credential.issuer && <div><dt>Issuer</dt><dd>{credential.issuer}</dd></div>}
    {credential.issueDate && <div><dt>Issued</dt><dd><time dateTime={credential.issueDate}>{credential.issueDateLabel ?? credential.issueDate}</time></dd></div>}
    {credential.category && <div><dt>Category</dt><dd>{credential.category}</dd></div>}
  </dl>;
}

function CertificateViewer({ credentials, index, move, close, trigger }) {
  const credential = credentials[index];
  const asset = credential.certificate;
  const [zoom, setZoom] = useState(1);
  const hasMultiple = credentials.length > 1;

  function navigate(direction) {
    setZoom(1);
    move(direction);
  }

  return (
    <Modal label="Certificate preview" className="certificate-modal" returnFocus={trigger} onClose={close} onKeyDown={(event) => {
      if (hasMultiple && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        navigate(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
      <p className="eyebrow mono">ACES / VERIFIED CREDENTIAL</p>
      <h2>{credential.title}</h2>
      <CredentialMetadata credential={credential} />
      <div className="certificate-stage">
        {asset.kind === 'pdf'
          ? <object data={asset.src} type="application/pdf" aria-label={credential.title} tabIndex={-1}><p>Inline PDF preview is unavailable. Open the PDF below.</p></object>
          : <img src={asset.src} alt={asset.alt ?? credential.title + ' certificate'} style={{ width: zoom * 100 + '%' }} />}
      </div>
      <div className="certificate-actions">
        {asset.kind !== 'pdf' && <div role="group" aria-label="Certificate zoom">
          <button className="icon-button" type="button" onClick={() => setZoom((z) => Math.max(1, z - .25))} disabled={zoom === 1} aria-label="Zoom out"><Minus size={18} /></button>
          <output>{zoom * 100}%</output>
          <button className="icon-button" type="button" onClick={() => setZoom((z) => Math.min(3, z + .25))} disabled={zoom === 3} aria-label="Zoom in"><Plus size={18} /></button>
        </div>}
        {asset.kind === 'pdf' && <a className="quiet-link" href={asset.src} target="_blank" rel="noopener noreferrer">Open PDF <ArrowUpRight size={16} /></a>}
        {asset.downloadAllowed === true && <a className="quiet-link" href={asset.src} download>Download <Download size={16} /></a>}
        {hasMultiple && <div role="group" aria-label="Certificate navigation">
          <button className="icon-button" type="button" aria-label="Previous certificate" onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
          <output aria-live="polite">{index + 1} / {credentials.length}</output>
          <button className="icon-button" type="button" aria-label="Next certificate" onClick={() => navigate(1)}><ArrowRight size={18} /></button>
        </div>}
      </div>
    </Modal>
  );
}

export default function OfficerProfile({ member, group, onClose, returnFocus }) {
  const id = useId();
  const [active, setActive] = useState('Overview');
  const [certificate, setCertificate] = useState(null);
  const tabList = useRef(null);
  const trigger = useRef(null);
  const credentials = member.credentials ?? [];
  const certificates = credentials.filter(({ certificate }) => certificate?.src);
  const responsibilities = member.responsibilities ?? officerRoleResponsibilities[member.role]
    ?? (member.role.endsWith('Year Representative') ? ['Represent students in their year level in ACES discussions.'] : []);
  const tabs = ['Overview', ...(responsibilities.length ? ['Responsibilities'] : []), 'Credentials',
    ...(member.achievements?.length ? ['Achievements'] : []), ...(member.contributions?.length ? ['Contributions'] : [])];

  function navigate(event, index) {
    const target = { ArrowLeft: (index - 1 + tabs.length) % tabs.length, ArrowRight: (index + 1) % tabs.length,
      Home: 0, End: tabs.length - 1 }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    setActive(tabs[target]);
    tabList.current.children[target].focus();
  }

  return (
    <Modal className="record-modal officer-modal" morph label={member.name} returnFocus={returnFocus} onClose={onClose}>
      <header className="officer-heading">
        {member.photo ? <img className="profile-monogram profile-photo" src={member.photo} alt={member.name} />
          : <span className="profile-monogram" aria-hidden="true">{initials(member.name)}</span>}
        <div><div className="section-brand"><AcesLogo /><p className="eyebrow mono">ACES / OFFICER RECORD</p></div>
          <h2>{member.name}</h2><p>{member.role} · AY {organization.academicYear}</p></div>
      </header>
      <div className="profile-tabs" role="tablist" aria-label="Officer profile sections" ref={tabList}>
        {tabs.map((tab, index) => <button key={tab} id={id + '-' + tab} role="tab" aria-selected={active === tab}
          aria-controls={id + '-panel-' + tab} tabIndex={active === tab ? 0 : -1} type="button"
          onClick={() => setActive(tab)} onKeyDown={(event) => navigate(event, index)}>{tab}</button>)}
      </div>
      {tabs.map((tab) => <div key={tab} className="profile-tab-content" id={id + '-panel-' + tab} role="tabpanel"
        aria-labelledby={id + '-' + tab} tabIndex={active === tab ? 0 : -1} hidden={active !== tab}>
        {active === tab && <>
          {tab === 'Overview' && <>
            <p>{member.introduction ?? (member.name + ' is listed as ' + member.role + ' in the ACES directory.')}</p>
            <p className="muted">{group} · {organization.name}</p>
            {member.note && <p>{member.note}</p>}
            {rosterApprovalPending && <p className="muted">Final roster approval is pending.</p>}
          </>}
          {tab === 'Responsibilities' && <><p className="muted">Scope of this position</p><ul>{responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></>}
          {tab === 'Credentials' && (credentials.length ? <div className="credential-grid">
            {credentials.map((item) => <article className="credential-card" key={item.id}>
              {item.certificate?.src && <button className="credential-preview" type="button" aria-haspopup="dialog" aria-label={'Preview ' + item.title}
                onClick={(event) => { trigger.current = event.currentTarget; setCertificate(certificates.indexOf(item)); }}>
                {item.certificate.thumbnail || item.certificate.kind !== 'pdf' ? <img src={item.certificate.thumbnail ?? item.certificate.src} alt="" loading="lazy" decoding="async" /> : <FileBadge size={28} />}
                <span>Preview certificate</span>
              </button>}
              <h3>{item.title}</h3><CredentialMetadata credential={item} />
              {item.verificationUrl && <a className="quiet-link" href={item.verificationUrl} target="_blank" rel="noopener noreferrer">Verify credential <ArrowUpRight size={15} /></a>}
            </article>)}
          </div> : <p className="profile-empty"><FileBadge size={23} aria-hidden="true" /> No verified credentials have been published for this profile yet.</p>)}
          {tab === 'Achievements' && <ul>{member.achievements.map((item) => <li key={item}>{item}</li>)}</ul>}
          {tab === 'Contributions' && <ul>{member.contributions.map((item) => <li key={item}>{item}</li>)}</ul>}
        </>}
      </div>)}
      {certificate !== null && <CertificateViewer credentials={certificates} index={certificate}
        trigger={trigger.current} close={() => setCertificate(null)}
        move={(direction) => setCertificate((index) => (index + direction + certificates.length) % certificates.length)} />}
    </Modal>
  );
}

