import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Modal from './Modal.jsx';

function GalleryLightbox({ items, view, onClose, onMove, returnFocus }) {
  const item = items[view.index];
  const touchStart = useRef(null);
  const hasMultiplePhotos = items.length > 1;

  return (
    <Modal
      className="gallery-lightbox"
      label="photo viewer"
      onClose={onClose}
      returnFocus={returnFocus}
      onKeyDown={(event) => {
        if (hasMultiplePhotos && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
          event.preventDefault();
          onMove(event.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
    >
      <figure className="lightbox-figure">
        <div className="lightbox-stage"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
          }}
          onTouchCancel={() => { touchStart.current = null; }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!hasMultiplePhotos || !start || event.touches.length) return;
            const touch = event.changedTouches[0];
            const distance = touch.clientX - start.x;
            if (Math.abs(distance) > 50 && Math.abs(distance) > Math.abs(touch.clientY - start.y) * 1.4) onMove(distance < 0 ? 1 : -1);
          }}
        >
          <img key={item.id} data-direction={view.direction < 0 ? 'backward' : 'forward'} src={item.image} alt={item.alt} decoding="async" />
        </div>
        <figcaption>
          <div className="lightbox-caption">
            <p className="lightbox-category mono">{item.category}</p>
            <h2>{item.title}</h2>
            <p className="lightbox-meta">
              {item.date && <><time dateTime={item.date}>{item.dateLabel ?? item.date}</time><span aria-hidden="true"> · </span></>}
              <span>Photo {view.index + 1} / {items.length}</span>
            </p>
            {item.description && <p className="lightbox-description">{item.description}</p>}
            {item.credit && <p className="lightbox-credit">{item.credit}</p>}
            {item.sourceUrl && <a className="lightbox-source" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Original Facebook post <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div>
          <div className="lightbox-nav" role="group" aria-label="Photo navigation">
            <button className="lightbox-control" type="button" onClick={() => onMove(-1)} disabled={!hasMultiplePhotos} aria-label="Previous photo"><ArrowLeft size={20} aria-hidden="true" /></button>
            <button className="lightbox-control" type="button" onClick={() => onMove(1)} disabled={!hasMultiplePhotos} aria-label="Next photo"><ArrowRight size={20} aria-hidden="true" /></button>
          </div>
        </figcaption>
      </figure>
      <p className="visually-hidden" role="status">Photo {view.index + 1} of {items.length}. {item.alt}</p>
    </Modal>
  );
}

export default function GalleryGrid({ items, variant = 'preview', initialPhotoId }) {
  const [view, setView] = useState(null);
  const trigger = useRef(null);
  const reducedMotion = useReducedMotion();
  const grid = useRef(null);
  const appliedPhoto = useRef(false);

  useEffect(() => {
    if (appliedPhoto.current || !initialPhotoId) return;
    const index = items.findIndex(({ id }) => id === initialPhotoId);
    if (index < 0) return;
    appliedPhoto.current = true;
    trigger.current = grid.current?.querySelectorAll('button')[index];
    setView({ index, direction: 1 });
  }, [items, initialPhotoId]);

  function move(direction) {
    setView(({ index }) => ({ index: (index + direction + items.length) % items.length, direction }));
  }

  return (
    <>
      <div ref={grid} className={`gallery-grid gallery-grid--${variant}`}>
        {items.map((item, index) => (
          <motion.article className="gallery-tile" key={item.id}
            initial={reducedMotion ? false : { opacity: 0.6, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: reducedMotion ? 0 : 0.38, delay: reducedMotion ? 0 : (index % 3) * 0.045 }}
          >
            <button type="button" onClick={(event) => {
              trigger.current = event.currentTarget;
              setView({ index, direction: 1 });
            }} aria-haspopup="dialog" aria-label={`Open ${item.title} photo: ${item.alt}`}>
              <span className="gallery-thumb"><img className="gallery-image" src={item.thumbnail ?? item.image} alt={item.alt} loading="lazy" decoding="async" /></span>
              <span className="gallery-caption">
                <span className="gallery-meta">
                  <strong>{item.title}</strong>
                  <em>{item.category}</em>
                </span>
                <ArrowUpRight size={19} aria-hidden="true" />
              </span>
            </button>
          </motion.article>
        ))}
      </div>
      {view && <GalleryLightbox items={items} view={view} onClose={() => setView(null)} onMove={move} returnFocus={trigger.current} />}
    </>
  );
}
