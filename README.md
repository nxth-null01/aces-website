# ACES Static Website

Modern responsive website for the Association of Computer Education Students.

## Run locally

```bash
npm ci
npm run dev
```

`npm run build` writes the static site to `dist/` with the GitHub Pages base path `/aces-website/`. Run `npm run preview` and open `/aces-website/` to test the production build. The development server uses `/`.

The default social preview URL is `https://nxth-null01.github.io/aces-website/`. Set `VITE_SITE_URL` to a different HTTPS site URL if social previews need to point elsewhere.

## GitHub Pages

1. In the repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
2. Open **Settings → Secrets and variables → Actions → Variables → New repository variable**. Set `VITE_WEB3FORMS_ACCESS_KEY` to the public access key for the ACES form. The deploy workflow stops if the variable is missing.
3. Push to `main` or open **Actions → Deploy ACES to GitHub Pages → Run workflow**. After deployment succeeds, visit [the Pages site](https://nxth-null01.github.io/aces-website/) over HTTPS. Organization and gallery URLs use fragments such as `#/organization` and `#/gallery`, which survive direct navigation and reloads.

The workflow installs from the lockfile and publishes only `dist/`. It pins each action by commit SHA and gives write access to Pages and the OIDC token only to the deploy job. Dependabot checks npm and GitHub Actions weekly. To review repository protections, open **Settings → Advanced Security** and check the dependency graph, Dependabot alerts, secret scanning, and push protection.

## Browser security and privacy

The production HTML sets a Content Security Policy and `strict-origin-when-cross-origin` referrer policy. Scripts and fonts load from the site, and the form sends data only to the Web3Forms HTTPS API. The policy permits inline styles for the existing animations and React layouts, HTTPS image sources for approved media, and same-origin embedded PDFs for officer credentials. The only environment value Vite exposes to client code is the public form identifier.

GitHub Pages does not provide repository-level configuration for custom HTTP response headers. To enforce `X-Content-Type-Options: nosniff`, HSTS, `Permissions-Policy`, or CSP `frame-ancestors` independently of GitHub's defaults, use a host or reverse proxy that lets you configure response headers. `frame-ancestors` cannot be enforced by an HTML meta policy.

The form notice lists the information sent to Web3Forms, explains its use, and gives ACES's Facebook contact. The site does not persist inquiries in browser storage. The public form identifier and honeypot alone do not prevent direct requests. [Web3Forms hCaptcha](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha) is available if configured in the site and enforced in the form dashboard. [Domain restrictions](https://docs.web3forms.com/getting-started/pro-features/restrict-to-domain) and [Turnstile](https://docs.web3forms.com/getting-started/pro-features/cloudflare-turnstile-captcha) require a supported paid plan. For Pages, the domain allowlist would use `nxth-null01.github.io`, without the repository path. No paid features are enabled by this project.

## Update ACES content

- `src/data/officers.js` holds the adviser, executive and legislative rosters, and committee teams. Add confirmed committee heads as `lead` and their members as `members`. Import an approved portrait and assign it to `photo` on the person's record.
- `src/data/siteContent.js` holds objectives, contact details, the election process, and activities. Event records have an `id`, `title`, `category`, `description`, and `status` (`pending`, `proposed`, `upcoming`, `open`, or `completed`). Add `date`, `venue`, and optional `details`, `image`, and `imageAlt` as those facts and photos are confirmed.
- `src/data/learning.js` holds proposed workshops and student participation guidance.
- `src/data/gallery.js` holds gallery images and captions. Place approved WebP originals and thumbnails in `public/images/gallery/` and supply descriptive alt text, a caption, photo credit, and original Facebook link. Add an ISO date and display label when an exact date is confirmed.
- Place the approved By-Laws PDF in `public/` and set `byLaws.downloadUrl` in `src/data/siteContent.js` to its public path.

The home, organization, and gallery pages are static and use hash navigation.

Obtain final ACES approval for the roster in `src/data/officers.js` before publishing the site. Set `rosterApprovalPending` to `false` once ACES approves the roster.

Confirm the About wording against the approved ACES organizational documents before publication. The About chapter currently marks the mission, vision, and objectives as awaiting confirmation.

## Contact form and Web3Forms

- **Local:** Vite reads `VITE_WEB3FORMS_ACCESS_KEY` from `.env.local`. The example file shows the variable name only. If setting up a new checkout, get the identifier for the authorized ACES form from the organization’s Web3Forms account. Restart Vite after changing it. The key is a public form identifier embedded in the frontend; do not add private credentials to any `VITE_` variable.
- **Deployment:** Set the repository Actions variable described above. If the account restricts submissions by domain, allow the production domain in Web3Forms. The destination inbox is configured in the Web3Forms account.
- **Verify delivery:** Submit one clearly marked test from the deployed form. Check the configured inbox, including spam or promotions, then inspect the Reply-To header and notification fields. An API success confirms acceptance, not inbox delivery.

The form sends `from_name: ACES Official Website` and `subject: [ACES CONTACT] Category — Subject`. The standard `email` field supplies the visitor’s Reply-To. The notification fields include the inquiry category, name, email, original subject, submission date and time in `Asia/Manila` (from the visitor’s clock), and plain-text message. Web3Forms controls the delivered layout.

### Branded incoming notification

Open [the email preview](./aces-email-preview.html) to see both the incoming design and the optional student confirmation. The reusable [incoming HTML template](./email/aces-inquiry-notification.html) uses tables and inline styles for email clients. The [offline renderer](./email/render-inquiry-notification.mjs) escapes every inserted value, permits only HTTPS logo URLs, and preserves message line breaks. It is not part of the website submission flow.

1. In the Web3Forms dashboard, open the ACES form’s notification settings and look for **Custom HTML Template**. The [plan comparison](https://web3forms.com/pricing#compare) lists custom HTML for Pro and Agency, separately from built-in email templates. If the setting is unavailable for the account, leave the default layout enabled and keep the HTML as a design asset.
2. If eligible, replace the logo placeholder with the absolute, publicly reachable HTTPS URL for `images/branding/aces-email-logo.jpg` on the deployed site. The header also includes the organization name as text so the sender is identifiable if images are blocked.
3. Map the template slots using the actual dashboard’s variable picker or syntax: category to `Inquiry Category`, sender to `name` and `email`, subject to `Inquiry Subject`, timestamp to `Submission Date and Time (Philippine Time)`, and message to `message`. The file’s placeholders are editorial. Use only escaped text variables; if safe escaping or message formatting cannot be verified in the dashboard, keep the default notification. Never put raw HTML in the form’s message field.
4. Save and test the delivered layout in Gmail desktop/mobile, Outlook, and Apple Mail before calling the custom template live. Test with a multiline message containing angle brackets. In-browser preview is not an email client test.

The [student autoresponder](https://docs.web3forms.com/getting-started/pro-features/autoresponder) is a separate paid feature and is not configured here. If enabled later, set its approved subject and intro in the dashboard and use the same public HTTPS logo URL.

## Program status and officer profiles

- Workshop and seminar records share the same action rules. Set `status: 'open'` only with an approved HTTPS `registrationUrl` and `registrationVerified: true`. Optional confirmed fields include `date`, `dateLabel`, `time`, `venue`, `platform`, `speaker`, and an `image` / `imageAlt`. Use `details` or an approved `recapUrl` for a completed recap. Add approved `recordingUrl` and `relatedGalleryIds` only when that content exists.
- Officer records accept `introduction`, `responsibilities`, `credentials`, `achievements`, and `contributions`. Publish these fields only with ACES approval. The directory falls back to generic role scopes if no individual responsibilities have been published. A credential accepts `{ id, title, issuer, issueDate, issueDateLabel, category, verificationUrl, certificate }`. A certificate accepts `{ src, kind: 'image' | 'pdf', thumbnail, alt, downloadAllowed }`. Add the download button only when downloads are explicitly authorized; any preview asset in a static site is inherently public.
