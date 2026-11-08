import { ArrowUpRight, Award, Code2, GraduationCap, HeartHandshake, Trophy, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { galleryItems } from '../data/gallery.js';
import TopicArt from './TopicArt.jsx';
import useMediaQuery from './useMediaQuery.js';

const icons = { code: Code2, users: Users, trophy: Trophy, brain: GraduationCap, 'heart-handshake': HeartHandshake, award: Award };
const sportPhoto = galleryItems.find(({ id }) => id === 'aces-presidents-sportfest-2026-04');
const pixelsPerSecond = 34;

export default function ActivityCarousel({ categories, onOpen, suspended = false }) {
  const region = useRef(null);
  const track = useRef(null);
  const firstRepeat = useRef(null);
  const hovered = useRef(false);
  const pressed = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(() => !document.hidden);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const repeating = categories.length > 1 && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(region.current);
    const visibility = () => setForeground(!document.hidden);
    const rail = track.current;
    function cancel() {
      pressed.current = null;
      drag.current = null;
      delete rail.dataset.dragging;
    }
    function release(event) {
      if (event.pointerId === pressed.current) cancel();
    }
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', cancel);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', cancel);
    };
  }, []);

  useEffect(() => {
    if (!repeating || !visible || !foreground || suspended) return undefined;

    const rail = track.current;
    const carousel = region.current;
    let period = 0;
    let position = rail.scrollLeft;
    let applied = position;
    let resumeAt = 0;
    let previousTime;
    let frame;

    function measure() {
      if (!firstRepeat.current || !rail.firstElementChild) return;
      period = firstRepeat.current.getBoundingClientRect().left - rail.firstElementChild.getBoundingClientRect().left;
      applied = rail.scrollLeft;
      position = applied;
    }

    function move(time) {
      const elapsed = time - (previousTime ?? time);
      previousTime = time;
      // Keep the fractional position for even pacing on displays that round scrollLeft.
      // Native swiping and keyboard focus can change the rail's position independently.
      if (rail.scrollLeft !== applied) {
        applied = rail.scrollLeft;
        position = applied;
        resumeAt = time + 180;
      }
      if (period > 0 && !hovered.current && pressed.current === null &&
          !carousel.contains(document.activeElement) && time >= resumeAt) {
        // At exactly one sequence width, both copies show the same pixels and spacing.
        position = (position + elapsed * pixelsPerSecond / 1000) % period;
        rail.scrollLeft = position;
        applied = rail.scrollLeft;
      }
      frame = requestAnimationFrame(move);
    }

    const resize = new ResizeObserver(measure);
    resize.observe(rail);
    resize.observe(rail.firstElementChild);
    measure();
    frame = requestAnimationFrame(move);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [repeating, visible, foreground, suspended, categories]);

  function start(event) {
    if (!event.isPrimary || event.button !== 0) return;
    pressed.current = event.pointerId;
    suppressClick.current = false;
    if (event.pointerType === 'mouse') {
      drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
    }
  }

  function dragWithMouse(event) {
    if (!drag.current || event.pointerId !== pressed.current || !(event.buttons & 1)) return;
    const rail = event.currentTarget;
    const distance = event.clientX - drag.current.x;
    if (!suppressClick.current) {
      if (Math.abs(distance) < 7) return;
      suppressClick.current = true;
      rail.dataset.dragging = '';
      rail.setPointerCapture(event.pointerId);
    }
    rail.scrollLeft = drag.current.left - distance;
  }

  return (
    <section className="activity-carousel" ref={region} aria-labelledby="activity-carousel-title"
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') hovered.current = true; }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') hovered.current = false; }}>
      <h3 id="activity-carousel-title">Browse Activity Categories</h3>
      <div id="activity-track" className="activity-track" ref={track} tabIndex={0} aria-label="Activity categories"
        onPointerDown={start} onPointerMove={dragWithMouse}
        onClickCapture={(event) => {
          if (suppressClick.current && event.detail) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}>
        {Array.from({ length: repeating ? 2 : 1 }, (_, copy) => categories.map((item, index) => {
          const Icon = icons[item.icon];
          const photo = item.id === 'sportsfest' ? sportPhoto : null;
          const detail = item.dateLabel ?? item.date ?? photo?.title;
          return (
            <button className="activity-card" key={copy + ':' + item.id} type="button" aria-haspopup="dialog"
              ref={copy && index === 0 ? firstRepeat : undefined}
              tabIndex={copy ? -1 : undefined} aria-hidden={copy ? true : undefined}
              onMouseDown={(event) => { if (event.button === 0) event.preventDefault(); }}
              onClick={(event) => onOpen(item, copy ? track.current : event.currentTarget)}>
              {photo
                ? <img className="activity-image" src={photo.thumbnail} alt="" loading="lazy" decoding="async" draggable={false} />
                : <TopicArt topic={item.icon} className="activity-image" />}
              <span className="activity-card-icon"><Icon size={23} aria-hidden="true" /></span>
              <span className="activity-card-content">
                <strong>{item.name}</strong>
                <span>{item.description}</span>
                {detail && <span className="activity-card-detail mono">{detail}</span>}
                <span className="activity-cta">{item.cta} <ArrowUpRight size={17} aria-hidden="true" /></span>
              </span>
            </button>
          );
        }))}
      </div>
    </section>
  );
}

