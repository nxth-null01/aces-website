import { readFile } from 'node:fs/promises';

const template = await readFile(new URL('./aces-inquiry-notification.html', import.meta.url), 'utf8');
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (text) => String(text ?? '').replace(/[&<>"']/g, (character) => entities[character]);

// For local previews or an approved renderer. The website sends plain text to Web3Forms.
export function renderInquiryNotification(inquiry, logoUrl) {
  const logo = new URL(logoUrl);
  if (logo.protocol !== 'https:' || logo.username || logo.password) throw new Error('Provide a public HTTPS logo URL.');
  const fields = {
    ACES_LOGO_HTTPS_URL: escape(logo.href),
    INQUIRY_CATEGORY: escape(inquiry.category),
    SENDER_NAME: escape(inquiry.name),
    SENDER_EMAIL: escape(inquiry.email),
    INQUIRY_SUBJECT: escape(inquiry.subject),
    SUBMITTED_PHILIPPINE_TIME: escape(inquiry.submittedAt),
    MESSAGE_LINES: escape(inquiry.message).replace(/\r\n|\r|\n/g, '<br>'),
  };
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (token, field) => fields[field] ?? token);
}

