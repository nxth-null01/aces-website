import { ArrowUpRight, CalendarDays, MapPin, Mic } from 'lucide-react';
import { contactHref, scrollToCurrentInquiry } from '../data/contact.js';
import { galleryItems } from '../data/gallery.js';
import TopicArt from './TopicArt.jsx';

function httpsUrl(url) {
  try { return new URL(url).protocol === 'https:' ? url : null; }
  catch { return null; }
}

function publication(record) {
  const registration = record.status === 'open' && record.registrationVerified === true && httpsUrl(record.registrationUrl);
  const status = record.status === 'open' && !registration ? 'upcoming' : record.status;
  return { status, registration };
}

export function LearningFacts({ record }) {
  const facts = [
    [CalendarDays, [record.dateLabel ?? record.date, record.time].filter(Boolean).join(' · '), 'Schedule'],
    [MapPin, record.venue ?? record.platform, 'Venue or platform'],
    [Mic, record.speaker, 'Resource speaker'],
  ];
  if (!facts.some(([, value]) => value)) return null;
  return <ul className="learning-facts">{facts.map(([Icon, value, label]) => value && (
    <li key={label}><Icon size={16} aria-hidden="true" /><span><span className="visually-hidden">{label}: </span>{value}</span></li>
  ))}</ul>;
}

export function Topics({ topics, limit }) {
  return <ul className="learning-topics">{topics.slice(0, limit ?? topics.length).map((topic) => <li key={topic}>{topic}</li>)}</ul>;
}

export default function LearningCard({ record, kind, onDetails }) {
  const { status, registration } = publication(record);
  const seminar = kind === 'Seminar';
  const title = seminar ? record.title : record.title + ' Workshop';
  const proposed = status === 'proposed' || status === 'pending' || !status;
  const completed = status === 'completed';
  const detailsText = 'View ' + kind + ' Details';
  const inquiry = contactHref('Seminars & Workshops', (proposed ? 'Interest in ' : 'Question about ') + title);
  const recap = completed && (httpsUrl(record.recapUrl) || (record.details ? true : false));
  const recording = completed && httpsUrl(record.recordingUrl);
  const photoId = completed && record.relatedGalleryIds?.find((id) => galleryItems.some((photo) => photo.id === id));
  const photos = photoId ? '#/gallery?' + new URLSearchParams({ photo: photoId }) : null;

  function detailsButton(label, primary = false) {
    return <button className={primary ? 'aces-action' : 'quiet-link'} type="button" aria-haspopup="dialog"
      aria-label={label + ': ' + record.title} onClick={(event) => onDetails(record, event.currentTarget)}>{label}{primary && <ArrowUpRight size={16} />}</button>;
  }

  return (
    <article className="program-card">
      <div className="program-visual">
        {record.image ? <img src={record.image} alt={record.imageAlt ?? ''} loading="lazy" decoding="async" /> : <TopicArt topic={record.icon} />}
        <span className="program-visual-label mono">ACES / {kind.toUpperCase()}</span>
      </div>
      <div className="program-body">
        <div className="program-meta">
          <span className="status-tag mono">{registration ? 'Registration open' : completed ? 'Completed' : proposed ? 'Proposed' : 'Upcoming'}</span>
          {record.difficulty && <span className="program-level">{record.difficulty}</span>}
        </div>
        <h3>{record.title}</h3>
        <p>{record.description}</p>
        <LearningFacts record={record} />
        {record.topics?.length > 0 && <Topics topics={record.topics} limit={4} />}
        <div className="program-actions">
          {registration ? <>
            <a className="aces-action" href={registration} target="_blank" rel="noopener noreferrer">{seminar ? 'Register for Seminar' : 'Register Now'} <ArrowUpRight size={16} /></a>
            {detailsButton('View Details')}
          </> : proposed ? <>
            <p>Expressing interest does not register you.</p>
            <a className="aces-action" href={inquiry} onClick={scrollToCurrentInquiry} aria-label={'Express Interest: ' + title}>Express Interest <ArrowUpRight size={16} /></a>
            {detailsButton('View Details')}
          </> : completed ? <>
            {recap && (typeof recap === 'string' ? <a className="aces-action" href={recap} target="_blank" rel="noopener noreferrer">View Event Recap <ArrowUpRight size={16} /></a> : detailsButton('View Event Recap', true))}
            {photos && <a className="quiet-link" href={photos}>View Photos <ArrowUpRight size={15} /></a>}
            {recording && <a className="quiet-link" href={recording} target="_blank" rel="noopener noreferrer">Watch Recording <ArrowUpRight size={15} /></a>}
          </> : <>
            <p>Registration is not open.</p>
            {detailsButton(detailsText, true)}
            <a className="quiet-link" href={inquiry} onClick={scrollToCurrentInquiry}>Ask About This {kind} <ArrowUpRight size={15} /></a>
          </>}
        </div>
      </div>
    </article>
  );
}

