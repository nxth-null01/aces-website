import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { coreModes } from './coreModes.js';

export default function useCoreProjection(overlay, anchors, branches, bounds) {
  const elements = useRef(null);
  const point = useMemo(() => new Vector3(), []);

  function project(node, camera, box) {
    if (!node) return null;
    node.getWorldPosition(point).project(camera);
    return { x: (point.x + 1) * box.width / 2, y: (1 - point.y) * box.height / 2, z: point.z };
  }

  return (camera, active) => {
    const box = bounds.current;
    const root = overlay.current;
    if (!box || !root) return;
    if (elements.current?.root !== root) {
      elements.current = {
        root,
        items: coreModes.map((_, index) => {
          const item = root.querySelector('[data-annotation="' + index + '"]');
          const wire = root.querySelector('[data-connector="' + index + '"]');
          return {
            item, wire, button: item.querySelector('button'), panel: item.querySelector('.core-callout'),
            main: wire.querySelector('.core-wire'), branch: wire.querySelector('.core-wire-branch'),
            endpoint: wire.querySelector('.core-endpoint'), dot: wire.querySelector('.core-secondary'), x: NaN, y: NaN, path: '', secondary: '',
          };
        }),
      };
      // Panels have fixed layout sizes, so cache the measurements outside the frame loop.
      for (const item of elements.current.items) {
        item.width = item.panel.offsetWidth;
        item.height = item.panel.offsetHeight;
        item.version = box;
      }
    }


    function within(p) {
      return p && p.z > -1 && p.z < 1
        && p.x > box.left + 13 && p.x < box.right - 13 && p.y > box.top + 13 && p.y < box.bottom - 13;
    }

    elements.current.items.forEach((item, index) => {
      const p = project(anchors.current[index], camera, box);
      const visible = within(p);
      item.item.toggleAttribute('data-visible', Boolean(visible));
      // Keep keyboard focus available if an orbit briefly takes a selected point out of frame.
      const show = Boolean(visible && active === index);
      item.item.toggleAttribute('data-shown', show);
      item.wire.toggleAttribute('data-shown', show);

      if (!visible) return;
      if (!Number.isFinite(item.x) || Math.abs(p.x - item.x) + Math.abs(p.y - item.y) > .25) {
        item.x = p.x;
        item.y = p.y;
        item.button.style.transform = 'translate3d(' + (p.x - 17).toFixed(1) + 'px,' + (p.y - 17).toFixed(1) + 'px,0)';
      }

      if (!show) return;
      if (item.version !== box) {
        item.width = item.panel.offsetWidth;
        item.height = item.panel.offsetHeight;
        item.version = box;
      }
      const w = item.width;
      const h = item.height;
      const left = Math.max(box.left + 4, box.right - w - 4);
      const top = coreModes[index].panel === 'bottom'
        ? Math.max(box.top + 4, box.bottom - h - 4) : box.top + 4;
      const endY = top + Math.min(31, h / 2);
      // Keep the endpoint just outside the panel border so it remains visible.
      const endX = left - 3;
      const slope = Math.min(28, Math.max(12, Math.abs(p.y - endY) * .64));
      const elbowX = endX + (p.x < endX ? -slope : slope);
      const path = 'M' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ' L' + elbowX.toFixed(1) + ',' + endY.toFixed(1) + ' H' + endX.toFixed(1);
      if (item.path !== path) {
        item.path = path;
        item.main.setAttribute('d', path);
      }
      if (item.left !== left || item.top !== top) {
        item.left = left;
        item.top = top;
        item.panel.style.transform = 'translate3d(' + left + 'px,' + top + 'px,0)';
      }
      const endpointX = endX.toFixed(1);
      if (item.endpoint.getAttribute('cx') !== endpointX || item.endpoint.getAttribute('cy') !== endY.toFixed(1)) {
        item.endpoint.setAttribute('cx', endpointX);
        item.endpoint.setAttribute('cy', endY.toFixed(1));
      }
      const secondary = project(branches.current[index], camera, box);
      const hasBranch = within(secondary);
      item.dot.toggleAttribute('data-point', Boolean(hasBranch));
      if (hasBranch) {
        item.dot.setAttribute('cx', secondary.x.toFixed(1));
        item.dot.setAttribute('cy', secondary.y.toFixed(1));
      }
      const spur = hasBranch ? 'M' + secondary.x.toFixed(1) + ',' + secondary.y.toFixed(1) +
        ' L' + ((p.x + secondary.x) / 2).toFixed(1) + ',' + p.y.toFixed(1) + ' H' + p.x.toFixed(1) : '';
      if (item.secondary !== spur) {
        item.secondary = spur;
        item.branch.setAttribute('d', spur);
      }
    });
  };
}

