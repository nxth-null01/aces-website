function getInitials(name) {
  return name
    .replace(',', '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

export default function MemberCard({ member, variant = 'standard' }) {
  return (
    <article className={`member-card member-card--${variant}`}>
      {member.photo
        ? <img className="member-monogram member-photo" src={member.photo} alt="" loading="lazy" />
        : <span className="member-monogram" aria-hidden="true">{getInitials(member.name)}</span>}
      <div>
        <p className="member-role">{member.role}</p>
        <h3>{member.name}</h3>
      </div>
    </article>
  );
}
