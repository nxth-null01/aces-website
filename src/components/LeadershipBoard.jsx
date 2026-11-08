import { ArrowUpRight, ChevronDown, GitBranch, MoveRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { executiveBoard, facultyAdviser, legislativeOfficers, rosterApprovalPending, yearRepresentatives } from '../data/officers.js';
import { organization } from '../data/siteContent.js';
import OfficerProfile, { initials } from './OfficerProfile.jsx';


const groups = [
  { title: 'Faculty adviser', members: [facultyAdviser] },
  { title: 'Executive officers', members: executiveBoard, description: 'President, vice presidents, and executive roles' },
  { title: 'Year representatives', members: yearRepresentatives, description: 'Representation by year level' },
  { title: 'Legislative officers', members: legislativeOfficers },
];

export default function LeadershipBoard({ preview = false }) {
  const [member, setMember] = useState(executiveBoard[0]);
  const [profileOpen, setProfileOpen] = useState(false);
  const trigger = useRef(null);
  const displayedGroups = preview
    ? [groups[0], { ...groups[1], members: executiveBoard.slice(0, 3) }]
    : groups;

  return (
    <div className="roster-explorer" aria-label="ACES leadership explorer">
      <div className="roster-index">
        <div className="roster-index-head mono"><GitBranch size={16} /> ORGANIZATION TREE</div>
        {displayedGroups.map((group) => (
          <details className="roster-branch" key={group.title} open>
            <summary className="mono">{group.title}<ChevronDown size={14} /></summary>
            {group.description && <p>{group.description}</p>}
            {group.members.length ? group.members.map((person) => (
              <button type="button" key={person.role + person.name} aria-pressed={person === member} onClick={() => setMember(person)}>
                <span>{person.role}</span><MoveRight size={16} />
              </button>
            )) : <p>Positions and names awaiting confirmation.</p>}
          </details>
        ))}
        {preview && <a className="quiet-link roster-all" href="#/organization">View the full directory <ArrowUpRight size={16} /></a>}
      </div>
      <div className="profile-stage" aria-live="polite">
        <div className="profile-grid" aria-hidden="true" />
        <div className="profile-top mono"><span>ACES / OFFICER RECORD</span><span>{organization.academicYear}</span></div>
        <div className="profile-record" key={member.name}>
          {member.photo ? <img className="profile-monogram profile-photo" src={member.photo} alt="" /> : <div className="profile-monogram" aria-hidden="true">{initials(member.name)}</div>}
          <p className="eyebrow mono">{member.role}</p>
          <h3>{member.name}</h3>
          {member.note && <p className="profile-provenance">{member.note}</p>}
          <button className="quiet-link profile-link" ref={trigger} type="button" aria-haspopup="dialog" onClick={() => setProfileOpen(true)}>View officer profile <ArrowUpRight size={15} /></button>
        </div>
        {rosterApprovalPending && <div className="profile-note mono"><i /> FINAL ROSTER APPROVAL PENDING</div>}
      </div>
      {profileOpen && (
        <OfficerProfile member={member} group={groups.find((group) => group.members.includes(member))?.title} returnFocus={trigger.current} onClose={() => setProfileOpen(false)} />
      )}
    </div>
  );
}
