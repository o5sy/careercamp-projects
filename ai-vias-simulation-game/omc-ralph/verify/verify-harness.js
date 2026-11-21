// Scratch verification harness -- NOT shipped, NOT referenced by index.html.
// Extracts the game's <script> content and runs it in a minimal stubbed
// environment so the pure scoring/grading logic can be exercised with real
// node execution and checked against the plan's AC-4.5 reference table.
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: could not extract <script> content'); process.exit(1); }
const scriptSrc = m[1];

function makeElementStub(){
  const el = {
    _children: [],
    style: {},
    hidden: false,
    className: '',
    innerHTML: '',
    innerText: '',
    appendChild(c){ this._children.push(c); },
    remove(){},
    getBoundingClientRect(){ return { left:0, top:0, width:0, height:0 }; },
    closest(){ return null; },
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    setAttribute(){}, getAttribute(){ return null; },
    addEventListener(){}, removeEventListener(){},
    focus(){}, select(){}, click(){},
    matches(){ return false; },
  };
  return el;
}

const sandbox = {
  console,
  Math, JSON, Object, Array, Error, Number, String, Boolean, RegExp, Date,
  parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
  setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame: (fn)=>{ return 0; },
  navigator: { clipboard: undefined, share: undefined },
  location: { search: '?debug=1' },
  ResizeObserver: function(cb){ this.observe=()=>{}; this.disconnect=()=>{}; },
  MutationObserver: function(cb){ this.observe=()=>{}; this.disconnect=()=>{}; },
  addEventListener(){}, removeEventListener(){},
  document: {
    readyState: 'complete',
    body: makeElementStub(),
    documentElement: makeElementStub(),
    addEventListener(){},
    removeEventListener(){},
    getElementById(id){ return makeElementStub(); },
    querySelector(sel){ return null; },
    querySelectorAll(sel){ return []; },
    createElement(tag){ return makeElementStub(); },
  },
};
sandbox.window = sandbox;
sandbox.self = sandbox;

vm.createContext(sandbox);
try {
  vm.runInContext(scriptSrc, sandbox, { filename: 'index.html-script' });
} catch (e) {
  console.error('FAIL: script threw during boot:', e.message);
  console.error(e.stack);
  process.exit(1);
}

const G = sandbox.window.__game;
if (!G) { console.error('FAIL: window.__game not populated (boot did not complete)'); process.exit(1); }

let failures = 0;
function check(name, actual, expected){
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok){ failures++; console.log('FAIL', name, 'got', actual, 'expected', expected); }
  else console.log('ok  ', name, '=', actual);
}

// --- baselineAward sums ---
[4,5,6].forEach(N => {
  let sum = 0;
  for (let k=1;k<=N;k++) sum += G.baselineAward(k,N);
  check('baselineAward sum N='+N, sum, 100);
});
check('baselineAward(k,6) sequence', [1,2,3,4,5,6].map(k=>G.baselineAward(k,6)), [17,16,17,17,16,17]);

// --- auditCardSet frontiers ---
const auditFull = G.auditCardSet([1,2,3,4,5,6]);
check('clause B max (N=6)', auditFull.clauses.B.max, 31);
check('clause B2 max (N=6)', auditFull.clauses.B2.max, 68);
check('clause C omissible (N=6)', auditFull.clauses.C.omissible, []);
check('clause D missing (N=6, full set)', auditFull.clauses.D.missing, []);
check('clause F pass (N=6)', auditFull.clauses.F.pass, true);
check('clause A pass (N=6)', auditFull.clauses.A.pass, true);

const auditDemo = G.auditCardSet([1,3,4,6]);
check('clause B max (N=4 demo)', auditDemo.clauses.B.max, 40);
check('clause B2 max (N=4 demo)', auditDemo.clauses.B2.max, 85);
check('clause D exempt (N=4 demo, no card 5)', auditDemo.clauses.D.exempt, true);

// --- extra: risk-key sizes match F1e pinned table, and the coverage boundary walk (AC-5.3b) ---
const expectedR = {1:8, 2:8, 3:0, 4:8, 5:9, 6:8};
Object.keys(expectedR).forEach(id => {
  const c = G.CARDS.find(x => x.id === Number(id));
  const ok = c._riskKeySize===expectedR[id];
  if (!ok) failures++;
  console.log((ok?'ok  ':'FAIL') + ' card '+id+' riskKeySize', c._riskKeySize, 'expected', expectedR[id]);
});

// AC-5.3b walk on card 1 (R=8): mask 1..8 tokens, confirm raw,raw,raw,raw,raw,partial,partial,clean
const card1 = G.CARDS.find(c => c.id===1);
const walkExpected = ['raw','raw','raw','raw','raw','partial','partial','clean'];
for (let n=1;n<=8;n++){
  const transformed = {};
  for (let i=0;i<n;i++) transformed[i] = { text:'X', tool:'mask' }; // any neutralizing tool suffices for this walk
  // use the risk types' actual neutralizer for correctness (card1 tokens 0-2 pii_name/anonymize,3-5 pii_phone/mask,6-7 biz_id/mask)
  const properTransformed = {};
  for (let i=0;i<n;i++){
    const tok = card1._risk[i];
    const tool = tok.type === 'pii_name' ? 'anonymize' : 'mask';
    properTransformed[i] = { text: tok.replacement || 'X', tool: tool };
  }
  const grade = G.gradeMasking(card1, properTransformed);
  const ok = grade === walkExpected[n-1];
  if (!ok) failures++;
  console.log((ok?'ok  ':'FAIL') + ' card1 mask '+n+'/8 -> '+grade+' expected '+walkExpected[n-1]);
}

console.log('---');
console.log(failures === 0 ? 'ALL CHECKS PASSED' : (failures + ' CHECK(S) FAILED'));
process.exit(failures === 0 ? 0 : 1);
