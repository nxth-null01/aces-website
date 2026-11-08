import { X } from 'lucide-react';
import { useAnimate } from 'motion/react-mini';
import { useLayoutEffect, useRef } from 'react';

export default function Modal({ label, onClose, returnFocus, className = '', onKeyDown, morph = false, children }) {
  const [scope, animate] = useAnimate();
  const closeButton = useRef(null);
  const closing = useRef(false);
  const outsidePointer = useRef(false);

  useLayoutEffect(() => {
    const dialog = scope.current;
    const trigger = returnFocus ?? document.activeElement;
    dialog.showModal();
    closeButton.current.focus({ preventScroll: true });
    let entrance;
    if (morph && trigger instanceof HTMLElement && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const panel = closeButton.current.parentElement;
      const from = trigger.getBoundingClientRect();
      const to = panel.getBoundingClientRect();
      const dx = from.left + from.width / 2 - to.left - to.width / 2;
      const dy = from.top + from.height / 2 - to.top - to.height / 2;
      const scale = Math.max(0.25, Math.min(1, from.width / to.width, from.height / to.height));
      entrance = animate(panel, { transform: ['translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')', 'none'] }, { duration: 0.52, ease: [0.22, 1, 0.36, 1] });
    }

    return () => {
      entrance?.cancel();
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [animate, morph, returnFocus, scope]);

  async function close() {
    if (closing.current) return;
    closing.current = true;
    const dialog = scope.current;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const panel = dialog.querySelector('.lightbox-figure') ?? dialog.querySelector('.modal-content-panel');
      const opacity = getComputedStyle(dialog).opacity;
      const transform = getComputedStyle(panel).transform;
      dialog.dataset.closing = '';
      const transition = { duration: 0.22, ease: [0.4, 0, 0.8, 0.2] };
      try {
        await Promise.all([
          animate(dialog, { opacity: [opacity, 0] }, transition),
          animate(panel, { transform: [transform, 'translateY(8px) scale(0.98)'] }, transition),
        ]);
      } finally {
        if (dialog.isConnected) onClose();
      }
    } else {
      onClose();
    }
  }

  function handleKeyDown(event) {
    if (event.target.closest('dialog') !== event.currentTarget) return;
    if (event.key === 'Tab') {
      const controls = [...event.currentTarget.querySelectorAll('button:not([disabled]), a[href], [tabindex]')]
        .filter((node) => node.tabIndex >= 0 && node.getClientRects().length && node.closest('dialog') === event.currentTarget);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey ? document.activeElement === first : document.activeElement === last) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
    if (!closing.current) onKeyDown?.(event);
  }

  return (
    <dialog
      ref={scope}
      className={`aces-modal ${className}`}
      aria-label={label}
      onCancel={(event) => { if (event.target !== event.currentTarget) return; event.preventDefault(); void close(); }}
      onKeyDown={handleKeyDown}
      onClickCapture={(event) => {
        if (closing.current && event.target.closest('dialog') === event.currentTarget) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onPointerDown={(event) => { outsidePointer.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (outsidePointer.current && event.target === event.currentTarget) void close();
      }}
    >
      <div className="modal-content-panel">
        <button ref={closeButton} className="modal-close" type="button" onClick={close} aria-label={`Close ${label}`}>
          <X size={21} aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
