import { useEffect, useLayoutEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import useSiteMotion from './components/useSiteMotion.js';
import Gallery from './pages/Gallery.jsx';
import Home from './pages/Home.jsx';
import Organization from './pages/Organization.jsx';

const routes = {
  '#/organization': 'organization',
  '#/organization/committees': 'organization',
  '#/gallery': 'gallery',
};

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const route = routes[hash.split('?')[0]] ?? 'home';
  const scope = useSiteMotion(route);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useLayoutEffect(() => {
    if (route !== 'home') {
      if (hash === '#/organization/committees') {
        const frame = requestAnimationFrame(() => document.getElementById('committee-directory')?.scrollIntoView({ block: 'start' }));
        return () => cancelAnimationFrame(frame);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      return undefined;
    }

    const sectionId = hash.slice(1).split('?')[0] || 'home';

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hash, route]);

  return (
    <div ref={scope}>
      <Navbar activeRoute={route} />
      {route === 'organization' && <Organization />}
      {route === 'gallery' && <Gallery key={hash} hash={hash} />}
      {route === 'home' && <Home hash={hash} />}
    </div>
  );
}
