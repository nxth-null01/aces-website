import { ArrowUpRight, CalendarClock } from 'lucide-react';
import { useRef, useState } from 'react';
import { contactHref, scrollToCurrentInquiry } from '../data/contact.js';
import { activityCategories, events } from '../data/siteContent.js';
import ActivityCarousel from './ActivityCarousel.jsx';
import LearningCard, { LearningFacts } from './LearningCard.jsx';
import Modal from './Modal.jsx';

const filters = [['all', 'All events'], ['upcoming', 'Planned'], ['completed', 'Completed']];
const statusLabels = { upcoming: 'Planned', completed: 'Completed', pending: 'Status pending', proposed: 'Proposed', open: 'Upcoming' };

function categoryName(record) {
  return record.category === 'seminar' ? 'Seminar' : activityCategories.find(({ id }) => id === record.category)?.name;
}

export default function ActivitiesSection() {
  const [status, setStatus] = useState('all');
  const [detail, setDetail] = useState(null);
  const trigger = useRef(null);
  const records = status === 'all' ? events : events.filter((event) => event.status === status || (status === 'upcoming' && event.status === 'open'));
  const related = detail && !detail.status ? events.filter(({ category }) => category === detail.id) : [];

  function open(item, button) {
    trigger.current = button;
    setDetail(item);
  }

  function followCategory(event, category) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    if (category.id === 'seminar') setStatus('all');
    setDetail(null);

    if (window.location.hash !== category.href) {
      window.location.hash = category.href;
    } else {
      requestAnimationFrame(() => document.getElementById(category.href.slice(1))?.scrollIntoView());
    }
  }

  return (
    <section id="activities" className="section-space activities-section">
      <div className="site-shell">
        <div className="section-cap mono" data-stamp><span>04 / ACTIVITY LOG</span><span>SEMINARS &amp; EVENTS</span></div>
        <div className="section-intro"><h2>Seminars &amp;<br /> Events<span>.</span></h2><p>Find recorded and planned ACES activities. Confirmed schedules and venues will appear with each record.</p></div>
        <div id="seminars" className="activity-controls">
          <div className="segmented" role="group" aria-label="Activity status">
            {filters.map(([value, label]) => <button key={value} type="button" aria-pressed={status === value} onClick={() => setStatus(value)}>{label}</button>)}
          </div>
          <span className="mono activity-status" role="status">{records.length} {records.length === 1 ? 'RECORD' : 'RECORDS'}</span>
        </div>
        {records.length ? (
          <div className="event-grid" key={status}>
            {records.map((event) => event.category === 'seminar'
              ? <LearningCard key={event.id} record={event} kind="Seminar" onDetails={open} />
              : <article className="event-card" key={event.id}>
                {event.image && <img src={event.image} alt={event.imageAlt ?? event.title} loading="lazy" decoding="async" />}
                <div className="event-meta"><CalendarClock size={20} aria-hidden="true" /><span className="mono">{categoryName(event)}</span><span className="status-tag mono">{statusLabels[event.status]}</span></div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <LearningFacts record={event} />
                <button type="button" className="quiet-link" aria-haspopup="dialog" aria-label={'View details for ' + event.title} onClick={(e) => open(event, e.currentTarget)}>View Details <ArrowUpRight size={16} /></button>
              </article>)}
          </div>
        ) : <p className="archive-note" role="status">No activity records match this filter.</p>}
        <ActivityCarousel categories={activityCategories} onOpen={open} suspended={Boolean(detail)} />
      </div>
      {detail && (
        <Modal className="record-modal" morph label={detail.title ?? detail.name} returnFocus={trigger.current} onClose={() => setDetail(null)}>
          <p className="eyebrow mono">{detail.status ? categoryName(detail) + ' / ' + statusLabels[detail.status] : 'ACES ACTIVITIES'}</p>
          <h2>{detail.title ?? detail.name}<span>.</span></h2>
          {detail.image && <img className="activity-detail-image" src={detail.image} alt={detail.imageAlt ?? detail.title} decoding="async" />}
          <LearningFacts record={detail} />
          <p>{detail.description}</p>
          {detail.details && <p>{detail.details}</p>}
          {!detail.status && (
            <>
              {related.map((event) => <div key={event.id} className="category-record"><h3>{event.title}</h3><p>{event.details ?? event.description}</p></div>)}
              {detail.id === 'outreach' && <p><a className="quiet-link" href={contactHref('Events & Activities', 'Question about outreach')} onClick={(event) => { scrollToCurrentInquiry(event); setDetail(null); }}>Ask about outreach <ArrowUpRight size={16} /></a></p>}
              {detail.href
                ? <a className="aces-action" href={detail.href} onClick={(event) => followCategory(event, detail)}>{detail.cta} <ArrowUpRight size={16} /></a>
                : <a className="aces-action" href={contactHref('Events & Activities', 'Question about ' + detail.name)} onClick={(event) => { scrollToCurrentInquiry(event); setDetail(null); }}>Ask ACES <ArrowUpRight size={16} /></a>}
            </>
          )}
        </Modal>
      )}
    </section>
  );
}

