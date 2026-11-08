import { defineConfig, loadEnv } from 'vite';

const pagesBase = '/aces-website/';
const pagesUrl = 'https://nxth-null01.github.io/aces-website/';
const netlifyUrl = 'https://scst-aces.netlify.app/';
const productionPolicy = [
  "default-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://api.web3forms.com",
  "object-src 'self'",
  "frame-src 'none'",
  "worker-src 'self'",
].join('; ');

export default defineConfig(({ command, mode }) => {
  const { VITE_SITE_URL, VITE_WEB3FORMS_ACCESS_KEY } = loadEnv(mode, process.cwd(), ['VITE_SITE_URL', 'VITE_WEB3FORMS_ACCESS_KEY']);
  const pages = mode === 'pages';
  const siteUrl = new URL(VITE_SITE_URL || (pages ? pagesUrl : netlifyUrl));
  if (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash) {
    throw new Error('VITE_SITE_URL must be an HTTPS site URL without credentials, query parameters, or a fragment.');
  }
  siteUrl.pathname = siteUrl.pathname.replace(/\/+$/, '') + '/';

  return {
    base: pages ? pagesBase : '/',
    envPrefix: [],
    define: {
      'import.meta.env.VITE_WEB3FORMS_ACCESS_KEY': JSON.stringify(VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? ''),
    },
    plugins: [{
      name: 'aces-html-metadata',
      transformIndexHtml: {
        order: 'pre',
        handler() {
          const tags = [
            { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
            { tag: 'meta', attrs: { property: 'og:image', content: new URL('aces-social.jpg', siteUrl).href }, injectTo: 'head' },
          ];
          if (command === 'build') {
            tags.unshift({
              tag: 'meta',
              attrs: { 'http-equiv': 'Content-Security-Policy', content: productionPolicy },
              injectTo: 'head-prepend',
            });
          }
          return tags;
        },
      },
    }],
  };
});
