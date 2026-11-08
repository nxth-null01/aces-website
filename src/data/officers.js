export const facultyAdviser = { role: 'Faculty Adviser', name: 'Criselda L. Anday' };
const multimediaDirector = { role: 'Director for Multimedia', name: 'Shemeah N. Mostaza', tier: 'executive' };

// Earlier organizational records. Obtain ACES approval before public deployment.
export const rosterApprovalPending = true;

export const executiveBoard = [
  { role: 'President', name: 'Jaira Mae B. Basmayor', tier: 'president' },
  { role: 'Vice President Internal', name: 'Mikaela S. Reyes', tier: 'vice-president' },
  { role: 'Vice President External', name: 'Charisse Lei G. Chiong', tier: 'vice-president' },
  { role: 'Secretary', name: 'Jessie A. Salonga', tier: 'executive' },
  { role: 'Treasurer', name: 'Angela Judy V. Juliata', tier: 'executive' },
  { role: 'Auditor', name: 'Nathaniel G. Simbajon', tier: 'executive' },
  { role: 'PRO Internal', name: 'Valerie P. Butac', tier: 'executive' },
  { role: 'PRO External', name: 'John Mark P. Oclares', tier: 'executive' },
  multimediaDirector,
];

export const legislativeOfficers = [];

export const yearRepresentatives = [
  { role: '1st Year Representative', name: 'Rhian Joy Bidaure', note: 'Identity pending final confirmation.' },
  { role: '2nd Year Representative', name: 'Angel M. Rellata' },
  { role: '3rd Year Representative', name: 'Chloie C. Macabenta' },
  { role: '4th Year Representative', name: 'Roma D. San Andres' },
];

// Retained for ACES review. Confirm these earlier records before adding them to the directory.
export const previousYearLevelRepresentatives = [
  { role: '4th Year Representative', name: 'San Andres, Roma' },
  { role: '3rd Year Representative', name: 'Macabenta, Chloie C.' },
  { role: '2nd Year Representative', name: 'Rellata, Angel' },
  { role: '1st Year Representative', name: 'Isaac, Rhian Joy' },
];

export const organizationGroups = [
  {
    id: 'multimedia',
    name: 'Multimedia',
    icon: 'clapperboard',
    description: 'Creative documentation, publication, and visual communication for ACES.',
    lead: multimediaDirector,
  },
  {
    id: 'photography',
    name: 'Photography',
    parent: 'Multimedia',
    icon: 'camera',
    description: 'Documents ACES activities through event photography.',
    lead: { role: 'Head', name: 'Andrea Germino' },
    members: [{ role: 'Member', name: 'Ejil Zhin S. Marinas' }],
  },
  {
    id: 'writing',
    name: 'Writing',
    parent: 'Multimedia',
    icon: 'pen-tool',
    description: 'Supports written communication for ACES activities.',
    lead: { role: 'Head', name: 'Charisse Jane L. Lucinda' },
  },
  {
    id: 'graphics-design',
    name: 'Graphics Design',
    parent: 'Multimedia',
    icon: 'palette',
    description: 'Leads visual communication and design for ACES.',
    lead: { role: 'Head', name: 'Sheryl Lyn May S. Hamto' },
    members: [{ role: 'Member', name: 'Kristof James E. Coy-Yao' }],
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: 'code',
    description: 'Technology-related activities and technical operations for ACES.',
    lead: { role: 'Head', name: 'Jorgel Ezekiel A. Remegio' },
    members: [{ role: 'Assistant', name: 'Aj Rey E. Nicolas' }],
  },
  {
    id: 'academics',
    name: 'Academics',
    icon: 'graduation-cap',
    description: 'Academic development and student learning initiatives.',
    lead: { role: 'Head', name: 'Ysabelle Nhicole Yangco' },
    members: [
      { role: 'Assistant', name: 'Roxan L. Bornales' },
      { role: 'Assistant', name: 'Luis Arwin L. Domino' },
    ],
  },
  {
    id: 'community-outreach',
    name: 'Community Outreach',
    icon: 'heart-handshake',
    description: 'Service and community engagement initiatives.',
    lead: { role: 'Head', name: 'Irish Jade M. Marcos' },
    members: [
      { role: 'Assistant', name: 'Mary Magdalene Valenzuela' },
      { role: 'Assistant', name: 'Julianna Nicole Velasco' },
    ],
  },
  {
    id: 'program',
    name: 'Program',
    icon: 'calendar',
    description: 'Plans programs and coordinates event schedules.',
    pending: true,
  },
  {
    id: 'public-relations',
    name: 'Public Relations',
    icon: 'megaphone',
    description: 'Coordinates public announcements and communication with students.',
    pending: true,
  },
];

// General role scopes, not biographies or a record of personal accomplishments.
// Override with approved responsibilities on individual officer records when available.
export const officerRoleResponsibilities = {
  'Faculty Adviser': ['Advise ACES officers on organization activities and school procedures.'],
  President: ['Lead the executive board and coordinate the organization’s work.'],
  'Vice President Internal': ['Coordinate work among ACES members and internal teams.'],
  'Vice President External': ['Coordinate ACES work with external groups and partners.'],
  Secretary: ['Maintain organizational records and document meetings.'],
  Treasurer: ['Maintain financial records and track organizational funds.'],
  Auditor: ['Review organizational financial records.'],
  'PRO Internal': ['Coordinate announcements and communication within ACES.'],
  'PRO External': ['Coordinate public announcements and communication outside ACES.'],
  'Director for Multimedia': ['Coordinate documentation, publication, and visual communication.'],
};
