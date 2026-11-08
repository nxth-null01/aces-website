import { useRef, useState } from 'react';
import { workshops } from '../data/learning.js';
import LearningCard, { LearningFacts, Topics } from './LearningCard.jsx';
import Modal from './Modal.jsx';

export default function LearningSection() {
  const [selected, setSelected] = useState(null);
  const trigger = useRef(null);

  return (
    <section id="workshops" className="section-space learning-section">
      <div className="site-shell">
        <div className="section-cap mono" data-stamp><span>03 / LEARNING PROGRAMS</span><span>BUILD PRACTICAL SKILLS</span></div>
        <div className="section-intro">
          <h2>Workshops &amp;<br /> Learning Programs<span>.</span></h2>
          <p>Explore skills you can build with ACES. Each program shows its current status and how to take the next step.</p>
        </div>
        <div className="learning-grid">
          {workshops.map((record) => <LearningCard key={record.id} record={record} kind="Workshop" onDetails={(item, button) => {
            trigger.current = button;
            setSelected(item);
          }} />)}
        </div>
      </div>
      {selected && (
        <Modal className="record-modal learning-modal" morph label={selected.title} returnFocus={trigger.current} onClose={() => setSelected(null)}>
          <p className="eyebrow mono">WORKSHOP / {selected.difficulty}</p>
          <h2>{selected.title}<span>.</span></h2>
          <p>{selected.description}</p>
          <LearningFacts record={selected} />
          <h3>Key learning topics</h3>
          <Topics topics={selected.topics} />
          {selected.details && <p>{selected.details}</p>}
          {selected.status === 'proposed' && <p className="muted">Approval and scheduling are pending.</p>}
        </Modal>
      )}
    </section>
  );
}

