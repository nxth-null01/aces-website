export const inquiryCategories = [
  'General Inquiry',
  'Membership',
  'Seminars & Workshops',
  'Events & Activities',
  'Partnerships & Collaborations',
  'Other',
];

export const contactLimits = { name: 100, email: 254, subject: 120, message: 3000 };

// Keep bookmarked links from the earlier category list working.
const legacyCategories = new Map([
  ['ACES Membership', 'Membership'],
  ['Seminars', 'Seminars & Workshops'],
  ['Workshops', 'Seminars & Workshops'],
  ['Activities and Events', 'Events & Activities'],
  ['Collaboration', 'Partnerships & Collaborations'],
  ['Committee Participation', 'Membership'],
  ['Leadership and Elections', 'General Inquiry'],
  ['Suggestions and Feedback', 'Other'],
]);

export function contactHref(category, subject) {
  return '#contact?' + new URLSearchParams({ category, subject });
}

export function readContactPrefill(hash) {
  if (!hash.startsWith('#contact?')) return null;
  const params = new URLSearchParams(hash.slice('#contact?'.length));
  const rawCategory = params.get('category');
  const category = legacyCategories.get(rawCategory) ?? rawCategory;
  const subject = (params.get('subject') ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, contactLimits.subject);
  return inquiryCategories.includes(category) ? { category, subject } : null;
}

export function scrollToCurrentInquiry(event) {
  if (event.currentTarget.hash !== window.location.hash || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  requestAnimationFrame(() => {
    document.getElementById('contact')?.scrollIntoView({ block: 'start' });
    document.getElementById('contact-subject')?.focus({ preventScroll: true });
  });
}

