import { ArrowUpRight, CalendarDays, Camera, Clapperboard, Code2, GraduationCap, HeartHandshake, Megaphone, Palette, PenTool, UsersRound } from 'lucide-react';
import { useRef, useState } from 'react';
import AcesLogo from './AcesLogo.jsx';
import MemberCard from './MemberCard.jsx';
import Modal from './Modal.jsx';

const icons = {
  calendar: CalendarDays,
  camera: Camera,
  clapperboard: Clapperboard,
  code: Code2,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  megaphone: Megaphone,
  palette: Palette,
  'pen-tool': PenTool,
  'users-round': UsersRound,
};

function TeamDetails({ team }) {
  return (
    <section className="committee-unit">
      <div className="committee-lead">
        <p className="detail-label">Committee Head</p>
        {team.lead ? <MemberCard member={team.lead} variant="lead" /> : <p className="muted">Head pending confirmation.</p>}
      </div>
      <div className="committee-members">
        <p className="detail-label">Committee Members</p>
        {team.members?.length ? (
          <div className="committee-members-grid">
            {team.members.map((member) => <MemberCard key={member.name} member={member} variant="compact" />)}
          </div>
        ) : <p className="muted">Awaiting official roster.</p>}
      </div>
    </section>
  );
}

export default function CommitteeCard({ committee, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const trigger = useRef(null);
  const Icon = icons[committee.icon] ?? UsersRound;
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="committee-tile">
      <button
        ref={trigger}
        className="committee-row-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-label={`View Team for ${committee.name}`}
        onClick={() => setIsOpen(true)}
      >
        <span className="committee-row-number mono">TEAM / {number} <ArrowUpRight size={16} /></span>
        <span className="committee-row-icon"><Icon size={35} strokeWidth={1.35} aria-hidden="true" /></span>
        <span className="committee-row-content">
          <strong>{committee.name}</strong>
          <small>{committee.pending ? 'Proposed team · ' : ''}{committee.description}</small>
          <small className="committee-row-lead"><span>{committee.lead?.role ?? 'Head'}</span> {committee.lead?.name ?? 'Pending confirmation'}</small>
        </span>
        <span className="committee-row-action">View Team <ArrowUpRight size={18} aria-hidden="true" /></span>
      </button>

      {isOpen && (
        <Modal morph className="committee-modal" label={`${committee.name} team`} onClose={() => setIsOpen(false)} returnFocus={trigger.current}>
          <header className="committee-modal-heading">
            <p className="section-index section-brand"><AcesLogo /> Organization / {number}</p>
            <h2>{committee.name}<span className="brand-dot">.</span></h2>
            <p className="muted">{committee.description}</p>
          </header>
          <TeamDetails team={committee} />
        </Modal>
      )}
    </article>
  );
}
