const shapes = {
  code: <><rect x="54" y="18" width="212" height="100" rx="8"/><path d="M54 39h212m-139 21-17 13 17 13m66-26 17 13-17 13m-24-32-18 38M66 29h4m7 0h4m7 0h4"/></>,
  layout: <><rect x="53" y="21" width="147" height="95" rx="6"/><path d="M53 42h147m-128 17h38v39H72zm51 2h58m-58 13h42m-42 14h24"/><rect x="190" y="45" width="65" height="84" rx="7" fill="#101010"/><path d="M201 59h43m-43 13h43v24h-43zm0 36h31"/></>,
  database: <><ellipse cx="134" cy="34" rx="60" ry="15"/><path d="M74 34v63c0 20 120 20 120 0V34M74 55c0 20 120 20 120 0M74 76c0 20 120 20 120 0m0-33h31v25m-31 23h40v20"/><rect x="213" y="68" width="37" height="13" rx="2"/><circle cx="234" cy="116" r="5"/></>,
  shield: <><path d="M160 15c15 12 31 17 50 20v30c0 28-23 47-50 58-27-11-50-30-50-58V35c19-3 35-8 50-20Z"/><rect x="144" y="62" width="32" height="23" rx="4"/><path d="M151 62v-7a9 9 0 0 1 18 0v7m-9 8v7m-50-25H74l-18-15m54 41H80l-21 20m151-46h36l18-15m-54 41h30l21 20"/><circle cx="52" cy="34" r="4"/><circle cx="55" cy="101" r="4"/><circle cx="268" cy="34" r="4"/><circle cx="265" cy="101" r="4"/></>,
  brain: <><path d="M80 32l78 24-78 48 78-24-78-48m78 24 82-24-82 48 82 24-82-48M80 68l78-12 82 12-82 12Z"/>{[[80,32],[80,68],[80,104],[158,56],[158,80],[240,32],[240,68],[240,104]].map(([x,y]) => <circle key={x + ':' + y} cx={x} cy={y} r="7" fill="#101010"/>)}</>,
  network: <><path d="M160 54v33m-83 13V71h166v29"/><rect x="129" y="23" width="62" height="31" rx="5"/><path d="M140 39h8m10 0h8m10 0h5"/>{[77,160,243].map((x) => <g key={x}><rect x={x-21} y="88" width="42" height="25" rx="3" fill="#101010"/><path d={`M${x} 113v9m-11 0h22`}/></g>)}</>,
  branch: <><path d="M111 33v75m0-15c9-34 72-12 93-49"/><circle cx="111" cy="28" r="9" fill="#101010"/><circle cx="111" cy="112" r="9" fill="#101010"/><circle cx="208" cy="34" r="9" fill="#101010"/><path d="M138 28h40m-40 84h78"/></>,
  briefcase: <><rect x="83" y="44" width="154" height="74" rx="8"/><path d="M129 44V25h62v19M83 76h154"/><rect x="149" y="68" width="22" height="17" rx="3" fill="#101010"/></>,
  mining: <><path d="M71 105h178M85 105V73h25v32m19 0V53h25v52m19 0V66h25v39m19 0V38h25v67M97 52l44-24 44 12 47-25"/><circle cx="141" cy="28" r="4"/><circle cx="185" cy="40" r="4"/></>,
  users: <><circle cx="160" cy="40" r="20"/><circle cx="94" cy="58" r="15"/><circle cx="226" cy="58" r="15"/><path d="M118 112v-10a42 31 0 0 1 84 0v10m-137 0v-9a29 21 0 0 1 47-17m143 26v-9a29 21 0 0 0-47-17"/></>,
  'heart-handshake': <><path d="M160 106 97 54c-28-26 14-61 41-34l22 20 22-20c27-27 69 8 41 34Z"/><path d="m114 68 27-24 22 17 13-12 33 22m-82 10 13-12m2 25 13-12m3 22 12-11"/></>,
  award: <><circle cx="160" cy="53" r="33"/><path d="m137 77-19 42 24-8 11 14 10-36m20-12 19 42-24-8-11 14-10-36m-10-36 8 8 17-18"/></>,
};

export default function TopicArt({ topic, className = '' }) {
  return <div className={'topic-art ' + className} aria-hidden="true"><svg viewBox="0 0 320 140" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{shapes[topic]}</svg></div>;
}

