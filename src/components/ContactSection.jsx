import { ArrowUpRight, CircleCheck, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { contactLimits, inquiryCategories, readContactPrefill } from '../data/contact.js';
import { office, organization } from '../data/siteContent.js';
import AcesLogo from './AcesLogo.jsx';

const endpoint = 'https://api.web3forms.com/submit';
const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
const configured = Boolean(accessKey && accessKey !== 'your_web3forms_access_key_here');
const empty = { name: '', email: '', category: '', subject: '', message: '' };
const manilaTime = new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'medium' });
const feedback = {
  api: 'The form service did not confirm your message. Your draft is still here. Try sending again in a moment, or contact ACES on Facebook.',
  network: 'We couldn’t reach the form service. Check your connection, then try sending again. Your draft is still here.',
  timeout: 'The form service took too long to respond. Your draft is still here. If you’re unsure whether it went through, contact ACES on Facebook.',
};

function Field({ name, label, type = 'text', autoComplete, draft, errors, change }) {
  const id = 'contact-' + name;
  const hint = name === 'message' ? 'contact-message-hint' : null;
  const props = {
    id, name, required: true, value: draft[name], onChange: change,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': [hint, errors[name] && id + '-error'].filter(Boolean).join(' ') || undefined,
  };
  return (
    <div className={'contact-field' + (['category', 'subject', 'message'].includes(name) ? ' contact-field-wide' : '')}>
      <label htmlFor={id}>{label}</label>
      {name === 'category'
        ? <select {...props}><option value="">Choose a category</option>{inquiryCategories.map((option) => <option key={option}>{option}</option>)}</select>
        : name === 'message'
          ? <textarea {...props} rows={5} maxLength={contactLimits.message} />
          : <input {...props} type={type} autoComplete={autoComplete} maxLength={contactLimits[name]} />}
      {hint && <p className="contact-field-hint" id={hint}>Up to 3,000 characters.</p>}
      {errors[name] && <p className="contact-field-error" id={id + '-error'}>{errors[name]}</p>}
    </div>
  );
}

export default function ContactSection({ hash }) {
  const [draft, setDraft] = useState(() => ({ ...empty, ...readContactPrefill(hash) }));
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const [state, setState] = useState('idle');
  const form = useRef(null);
  const lock = useRef(false);
  const success = useRef(null);
  const request = useRef(null);
  const focusField = useRef(null);
  const focusError = useRef(null);

  useEffect(() => () => request.current?.abort(), []);

  useEffect(() => {
    const prefill = readContactPrefill(hash);
    if (!prefill || lock.current) return;
    focusField.current = 'subject';
    setDraft((current) => ({ ...current, ...prefill }));
    setErrors(({ category, subject, ...rest }) => rest);
    setFailure(null);
    setState('idle');
  }, [hash]);

  useLayoutEffect(() => {
    if (focusError.current) {
      form.current?.elements[focusError.current]?.focus();
      focusError.current = null;
    }
  }, [errors]);

  useEffect(() => {
    if (state === 'success') success.current?.focus();
    if (state === 'idle' && focusField.current) {
      form.current?.elements[focusField.current]?.focus({ preventScroll: true });
      focusField.current = null;
    }
  }, [state, hash]);

  function change(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!configured || lock.current) return;

    const { name, email, category, subject, message } = Object.fromEntries(
      Object.entries(draft).map(([field, value]) => [field, value.trim()]),
    );
    const invalid = {};
    if (!name) invalid.name = 'Enter your full name.';
    if (!email || form.current.elements.email.validity.typeMismatch) invalid.email = 'Enter a valid email address.';
    if (!inquiryCategories.includes(category)) invalid.category = 'Choose an inquiry category.';
    if (!subject) invalid.subject = 'Enter a subject.';
    if (!message) invalid.message = 'Enter your message.';
    for (const [field, limit] of Object.entries(contactLimits)) {
      if (draft[field].length > limit) invalid[field] = 'Use ' + limit.toLocaleString('en-PH') + ' characters or fewer.';
    }
    setErrors(invalid);
    setFailure(null);
    if (Object.keys(invalid).length) {
      focusError.current = Object.keys(invalid)[0];
      return;
    }

    const botcheck = form.current.elements.botcheck.checked;
    if (botcheck) { setFailure('api'); return; }

    const payload = {
      access_key: accessKey,
      from_name: 'ACES Official Website',
      subject: '[ACES CONTACT] ' + category + ' — ' + subject.replace(/[\u0000-\u001f\u007f]/g, ' '),
      'Inquiry Category': category,
      name,
      email,
      'Inquiry Subject': subject,
      'Submission Date and Time (Philippine Time)': manilaTime.format(new Date()) + ' (UTC+08:00)',
      message,
      botcheck,
    };
    lock.current = true;
    setState('sending');
    const controller = new AbortController();
    request.current = controller;
    const timeout = setTimeout(() => controller.abort('timeout'), 20000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit',
        cache: 'no-store',
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (controller.signal.reason === 'timeout') {
        setFailure('timeout');
        setState('idle');
      } else if (!controller.signal.aborted) {
        if (response.ok && result?.success === true) {
          setDraft(empty);
          setState('success');
        } else {
          setFailure('api');
          setState('idle');
        }
      }
    } catch {
      if (!controller.signal.aborted || controller.signal.reason === 'timeout') {
        setFailure(controller.signal.reason === 'timeout' ? 'timeout' : 'network');
        setState('idle');
      }
    } finally {
      clearTimeout(timeout);
      request.current = null;
      lock.current = false;
    }
  }

  const fieldProps = { draft, errors, change };
  const sending = state === 'sending';

  return (
    <section id="contact" className="section-space contact-section" aria-labelledby="contact-heading">
      <div className="site-shell contact-layout">
        <div className="contact-intro">
          <div className="contact-brand">
            <AcesLogo label="ACES logo" />
            <div><p className="eyebrow mono">CONTACT / ACES</p><p>{organization.name}</p></div>
          </div>
          <h2 id="contact-heading">Let’s connect<span>.</span></h2>
          <p>Ask about membership, student activities, seminars, or workshops. If you’d like to collaborate with ACES, tell us what you have in mind.</p>
          <dl className="contact-record">
            <div><dt><MapPin size={18} /> ACES office</dt><dd>{office.department}<br />{office.college}<br />{office.location}</dd></div>
            {office.email && <div><dt><Mail size={18} /> Email</dt><dd><a href={'mailto:' + office.email}>{office.email}</a></dd></div>}
            {office.facebook && <div><dt><MessageCircle size={18} /> Facebook</dt><dd><a className="quiet-link" href={office.facebook} target="_blank" rel="noopener noreferrer">Official ACES page <ArrowUpRight size={15} /></a></dd></div>}
          </dl>
        </div>
        <div className="contact-panel">
          {state === 'success' ? (
            <div className="contact-success">
              <CircleCheck className="contact-check" size={48} aria-hidden="true" />
              <h3 ref={success} tabIndex={-1}>Message Sent Successfully!</h3>
              <p>Thank you for contacting ACES. Our team will review your inquiry and get back to you as soon as possible.</p>
              <button className="aces-action" type="button" onClick={() => { focusField.current = 'name'; setState('idle'); }}>Compose another inquiry <ArrowUpRight size={16} /></button>
            </div>
          ) : (
            <form ref={form} method="post" onSubmit={submit} noValidate aria-labelledby="contact-form-title" aria-busy={sending}>
              <p className="contact-form-label eyebrow mono"><span className="aces-marker" aria-hidden="true" /> NEW INQUIRY</p>
              <h3 id="contact-form-title">Send a message</h3>
              <p className="contact-note">All fields are required.</p>
              <fieldset disabled={sending}>
                <div className="contact-fields">
                  <Field name="name" label="Full Name" autoComplete="name" {...fieldProps} />
                  <Field name="email" label="Email Address" type="email" autoComplete="email" {...fieldProps} />
                  <Field name="category" label="Inquiry Category" {...fieldProps} />
                  <Field name="subject" label="Subject" {...fieldProps} />
                  <Field name="message" label="Message" {...fieldProps} />
                </div>
                <input type="checkbox" name="botcheck" hidden tabIndex={-1} autoComplete="off" />
                <p className="contact-privacy" id="contact-privacy">
                  <strong>Privacy notice.</strong> Web3Forms processes your name, email address, inquiry category, subject,
                  message, and submission time and forwards them to ACES so we can respond. For questions about your
                  information, contact ACES through its <a href={office.facebook}>official Facebook page</a>.
                </p>
                {!configured && <p className="contact-feedback">Online submissions aren’t available yet. Please contact ACES through the official Facebook page.</p>}
                {failure && <p className="contact-feedback" role="alert">{feedback[failure]}</p>}
                <button className="aces-action" type="submit" aria-describedby="contact-privacy" disabled={!configured || sending}>{sending ? 'Sending message…' : 'Send Message'} <Send size={16} aria-hidden="true" /></button>
              </fieldset>
            </form>
          )}
          <p className="visually-hidden" role="status">{sending ? 'Sending your message.' : ''}</p>
        </div>
      </div>
    </section>
  );
}

