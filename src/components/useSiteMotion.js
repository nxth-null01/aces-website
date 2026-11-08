import { inView, scroll, stagger } from 'motion';
import { useAnimate } from 'motion/react-mini';
import { useLayoutEffect } from 'react';

const curve = [0.22, 1, 0.36, 1];

export default function useSiteMotion(route) {
  const [scope, animate] = useAnimate();
  useLayoutEffect(() => {
    const root = scope.current;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup;

    function start() {
      const jobs = [];
      const play = (targets, frames, timing) => {
        const job = animate(targets, frames, timing);
        jobs.push(job);
        return job;
      };
      let stopProgress;
      if (!CSS.supports('animation-timeline', 'scroll()')) {
        const progress = play(root.querySelector('.scroll-progress'), { transform: ['scaleX(0)', 'scaleX(1)'] }, { ease: 'linear' });
        stopProgress = scroll(progress);
      }
      const hero = root.querySelector('.signal-hero');
      let stopAmbient;
      if (hero) {
        play(hero.querySelectorAll('.hero-line > span'), { translate: ['0 110%', '0 0'] }, { duration: 0.86, delay: stagger(0.09), ease: curve });
        play(hero.querySelectorAll('[data-hero-detail]'), { opacity: [0, 1], translate: ['0 11px', '0 0'] }, { duration: 0.57, delay: stagger(0.07, { startDelay: 0.24 }), ease: curve });
        stopAmbient = inView(hero, () => {
          hero.dataset.live = '';
          return () => { delete hero.dataset.live; };
        });
      }
      const stamps = root.querySelectorAll('[data-stamp]');
      const stopStamps = inView(stamps, (element) => { element.dataset.visible = ''; }, { amount: 0.28 });
      return () => {
        stopProgress?.();
        stopAmbient?.();
        stopStamps();
        if (hero) delete hero.dataset.live;
        stamps.forEach((element) => { delete element.dataset.visible; });
        jobs.forEach((job) => job.cancel());
      };
    }

    function sync() {
      cleanup?.();
      cleanup = preference.matches ? undefined : start();
    }
    sync();
    preference.addEventListener('change', sync);
    return () => { preference.removeEventListener('change', sync); cleanup?.(); };
  }, [animate, route, scope]);
  return scope;
}
