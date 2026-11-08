import { Hand, Minus, Move, Plus, Radio, RotateCcw } from 'lucide-react';
import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AcesLogo from './AcesLogo.jsx';
import { coreModes } from './coreModes.js';
import useMediaQuery from './useMediaQuery.js';

const CoreScene = lazy(() => import('./CoreScene.jsx'));

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function CoreAnnotations({ overlay, mode, select, live }) {
  return (
    <div className="core-annotations" ref={overlay} data-live={live || undefined}>
      <svg className="core-connectors" aria-hidden="true">
        {coreModes.map(({ code }, index) => (
          <g key={code} data-connector={index}>
            <path className="core-wire" pathLength="1" />
            <path className="core-wire core-wire-branch" pathLength="1" />
            <circle className="core-endpoint" r="3" />
            <circle className="core-secondary" r="3.5" />
          </g>
        ))}
      </svg>
      {coreModes.map(({ title, category, description, code }, index) => (
        <div key={code} className="core-annotation" data-annotation={index}>
          <button type="button" className="core-hotspot" aria-label={'Focus ' + title}
            aria-pressed={mode === index} onClick={() => select(index)}><span /></button>
          <div className="core-callout" aria-hidden="true">
            <span className="core-code mono">{code}</span>
            <strong>{title}</strong>
            <span className="core-category">{category}</span>
            <p>{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CoreViewer({ layer }) {
  const [view, setView] = useState({ index: 0, reset: true });
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(() => !document.hidden);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [touchEnabled, setTouchEnabled] = useState(false);
  const coarse = useMediaQuery('(pointer: coarse)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const viewport = useRef(null);
  const overlay = useRef(null);
  const command = useRef(null);
  const attempted = useRef(false);
  const mode = view.index;
  const active = coreModes[mode];
  const live = ready && !failed;
  const markReady = useCallback(() => setReady(true), []);
  const markFailed = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (!entry.isIntersecting || attempted.current) return;
      attempted.current = true;
      try {
        const context = document.createElement('canvas').getContext('webgl2');
        if (context) {
          context.getExtension('WEBGL_lose_context')?.loseContext();
          setStarted(true);
        } else markFailed();
      } catch {
        markFailed();
      }
    });
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, [markFailed]);

  useEffect(() => {
    const update = () => setForeground(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  function select(index) {
    setView({ index, reset: false });
  }

  function reset() {
    setView({ index: 0, reset: true });
  }

  function sendCommand(action) {
    command.current = action;
    viewport.current.dispatchEvent(new Event('aces:camera'));
  }

  function handleKey(event) {
    const action = {
      ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
      '+': 'near', '=': 'near', '-': 'far',
    }[event.key];
    if (!live || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Home') {
      event.preventDefault();
      reset();
    } else if (action) {
      event.preventDefault();
      sendCommand(action);
    }
  }

  return (
    <section className="core-stage" data-mode={mode} aria-labelledby="core-title">
      <div className="core-top mono">
        <span id="core-title"><Radio size={14} /> THE ACES CORE</span>
      </div>
      <div className="core-viewport" ref={viewport} role="group"
        aria-label="ACES processor model. Use arrow keys to orbit, plus or minus to zoom, and Home to reset."
        tabIndex={live ? 0 : undefined} onKeyDown={handleKey}
        data-touch={coarse ? (touchEnabled ? 'rotate' : 'scroll') : undefined}>
        {!live && <div className="core-fallback">
          <AcesLogo label="Official ACES logo" />
          <p>{failed ? 'The ACES Core couldn’t load on this device.' : 'Loading the ACES Core…'}</p>
        </div>}
      </div>
      {layer && started && !failed && createPortal(
        <>
          <div className="core-canvas">
            <SceneBoundary onFailure={markFailed}>
              <Suspense fallback={null}>
                <CoreScene view={view} visible={visible && foreground} reduced={reduced}
                  coarse={coarse} touchEnabled={touchEnabled} command={command} viewport={viewport} overlay={overlay}
                  onReady={markReady} onFailure={markFailed} />
              </Suspense>
            </SceneBoundary>
          </div>
          <CoreAnnotations overlay={overlay} mode={mode} select={select} live={visible && foreground} />
        </>, layer)}
      <div className="core-toolbar">
        <span className="mono"><Move size={13} /> {live ? (coarse ? (touchEnabled ? 'DRAG TO ROTATE' : 'TOUCH CONTROLS') : 'DRAG OR USE ARROW KEYS') : 'ACES CORE'}</span>
        {live && <div className="core-tools">
          {coarse && <button type="button" className="icon-button core-touch" aria-pressed={touchEnabled} onClick={() => setTouchEnabled((value) => !value)}><Hand size={15} /> {touchEnabled ? 'Done rotating' : 'Enable rotation'}</button>}
          <button type="button" className="icon-button" aria-label="Zoom in" onClick={() => sendCommand('near')}><Plus size={15} /></button>
          <button type="button" className="icon-button" aria-label="Zoom out" onClick={() => sendCommand('far')}><Minus size={15} /></button>
          <button type="button" className="icon-button" aria-label="Reset 3D view" onClick={reset}><RotateCcw size={15} /></button>
        </div>}
      </div>
      <div className="core-control">
        <div className="core-modes" role="group" aria-label="Explore the ACES core">
          {coreModes.map(({ button }, index) => (
            <button key={button} type="button" aria-pressed={mode === index} onClick={() => select(index)}>{button}</button>
          ))}
        </div>
        <div className={'core-mode-copy' + (live ? ' visually-hidden' : '')} aria-live="polite">
          <p className="core-mode-label mono"><i /> {active.title} / {active.category}</p>
          <p>{active.description}</p>
        </div>
      </div>
    </section>
  );
}

