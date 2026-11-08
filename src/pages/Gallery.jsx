import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import GalleryGrid from '../components/GalleryGrid.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { galleryItems } from '../data/gallery.js';

const categories = [...new Set(galleryItems.map((photo) => photo.category))];

export default function Gallery({ hash }) {
  const params = new URLSearchParams(hash.split('?')[1]);
  const initialCategory = params.get('category');
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : null);
  const [initialPhoto, setInitialPhoto] = useState(params.get('photo'));
  function filter(value) { setInitialPhoto(null); setCategory(value); }
  const photos = category ? galleryItems.filter((photo) => photo.category === category) : galleryItems;
  return (
    <>
      <main className="inner-page gallery-page">
        <header className="inner-header site-shell">
          <div className="section-cap mono"><span>07 / GALLERY</span><a href="#home">BACK TO ACES <ArrowUpRight size={15} /></a></div>
          <div className="section-intro"><h1>In the frame<span>.</span></h1><p>Explore photos from ACES activities. Open any photo for its caption, credit, and original Facebook post.</p></div>
        </header>
        <div className="site-shell gallery-full">
          <div className="archive-note">
            <h2>Event archives</h2>
            {categories.length ? (
              <div className="segmented" role="group" aria-label="Gallery categories">
                <button type="button" aria-pressed={!category} onClick={() => filter(null)}>All photos</button>
                {categories.map((name) => <button type="button" key={name} aria-pressed={category === name} onClick={() => filter(name)}>{name}</button>)}
              </div>
            ) : <p>Approved ACES event photos will appear here when available.</p>}
          </div>
          <GalleryGrid key={category ?? 'all'} items={photos} variant="full" initialPhotoId={initialPhoto} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
