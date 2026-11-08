export const organization = {
  name: 'Association of Computer Education Students',
  acronym: 'ACES',
  establishedYear: 2026,
  academicYear: '2026–2027',
  summary: 'A student-led organization committed to technology, academic development, creativity, leadership, and community.',
  introduction: 'The Association of Computer Education Students (ACES) is a student-led organization under the College of Information Technology at Samson College of Science and Technology. It promotes academic development, technological creativity, leadership, collaboration, and meaningful student participation.',
  background: 'As a new organization, ACES gives students a place to learn with peers, take part in campus activities, and build confidence in technology and leadership.',
  mission: 'Empower students through technology and collaboration.',
  vision: 'Build a connected, creative, and future-ready student community.',
  objectives: [
    'Support student learning, growth, and academic collaboration.',
    'Build, learn, and explore technology through practical activities.',
    'Tell the ACES story through design, photography, and creative media.',
    'Use our skills to create meaningful impact beyond the classroom.',
  ],
};

export const office = {
  college: 'Samson College of Science and Technology',
  department: 'College of Information Technology',
  location: 'Second Floor, adjacent to the Guidance Office',
  email: null,
  facebook: 'https://www.facebook.com/scstACES',
};

export const byLaws = { downloadUrl: null };

export const elections = {
  year: 2027,
  steps: [
    { title: 'Review guidelines', description: 'Review the election guidelines once ACES releases the approved process.' },
    { title: 'Check eligibility', description: 'Confirm that you meet the approved requirements for the position. Qualifications await confirmation.' },
    { title: 'Email Application', description: 'Submit your application through the official ACES email once the address is confirmed.' },
    { title: 'Confirmation Email', description: 'Wait for confirmation and instructions from authorized ACES officers.' },
    { title: 'Office Visit', description: 'Visit the ACES office after receiving instructions from the organization.' },
    { title: 'Document Signing', description: 'Sign the required documents at the ACES office. The document list awaits confirmation.' },
  ],
};

export const focusAreas = [
  {
    number: '01',
    title: 'Academic development',
    copy: 'Share knowledge, practice classroom concepts, and explore skill-building activities with other students.',
  },
  {
    number: '02',
    title: 'Technology and Innovation',
    copy: 'Explore programming, digital creativity, and emerging tools through practical applications of IT knowledge.',
  },
  {
    number: '03',
    title: 'Leadership Development',
    copy: 'Practice teamwork, communication, and organizational management through committee and officer responsibilities.',
  },
  {
    number: '04',
    title: 'Community Engagement',
    copy: 'Connect with other students and contribute to service, collaboration, and outreach initiatives.',
  },
];

export const activityCategories = [
  {
    id: 'workshops', name: 'Workshops', icon: 'code', cta: 'Explore Workshops', href: '#workshops',
    description: 'Developing practical technical skills through hands-on sessions, collaborative learning, and real-world applications.',
  },
  {
    id: 'assembly', name: 'General Assembly', icon: 'users', cta: 'Explore Activities',
    description: 'Connecting ACES members through organizational discussions, updates, and shared goals.',
  },
  {
    id: 'sportsfest', name: 'Sportsfest', icon: 'trophy', cta: 'View Sports Activities', href: '#/gallery?category=Sports+Activities',
    description: 'Building teamwork, sportsmanship, and meaningful connections through student participation.',
  },
  {
    id: 'seminar', name: 'Seminars', icon: 'brain', cta: 'Explore Seminars', href: '#seminars',
    description: 'Expanding knowledge through discussions on technology, innovation, and professional development.',
  },
  {
    id: 'competitions', name: 'Student Competitions', icon: 'award', cta: 'Explore Competitions',
    description: 'Encouraging students to challenge their abilities, strengthen technical knowledge, and develop confidence.',
  },
  {
    id: 'outreach', name: 'Community Engagement', icon: 'heart-handshake', cta: 'Explore Activities', href: '#opportunities',
    description: 'Encouraging collaboration, participation, and stronger connections within the student community.',
  },
];

// Add approved records with id, title, category, status, date, and optional details.
export const events = [
  {
    id: 'general-assembly-2026', title: 'General Assembly and Oath-Taking Ceremony 2026', category: 'assembly', status: 'pending',
    description: 'A student organization gathering centered on organizational introductions, leadership, and official activities.',
    details: 'The event record identifies the assembly and oath-taking ceremony. Its exact date, venue, and completion status await confirmation.',
  },
  {
    id: 'ai-seminar', icon: 'brain', title: 'Artificial Intelligence Seminar', category: 'seminar', status: 'upcoming',
    description: 'A planned educational seminar on AI concepts, applications, and developments.',
    details: 'The AI and data mining seminars were planned as separate morning and afternoon sessions. The assignment of sessions, date, venue, and speakers await confirmation.',
  },
  {
    id: 'data-mining-seminar', icon: 'mining', title: 'Data Mining Seminar', category: 'seminar', status: 'upcoming',
    description: 'A planned introduction to data mining concepts and practical applications.',
    details: 'The AI and data mining seminars were planned as separate morning and afternoon sessions. The assignment of sessions, date, venue, and speakers await confirmation.',
  },
];
