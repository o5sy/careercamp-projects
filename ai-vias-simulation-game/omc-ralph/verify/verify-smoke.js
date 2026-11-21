// Scratch smoke test -- NOT shipped. Drives the actual goPhase()/render()/
// doSend()/advanceTurn() functions through a full round-1 -> interstitial ->
// round-2 -> ending playthrough, to catch runtime errors in the render
// string-building code that the pure-logic harnesses don't exercise.
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const scriptSrc = html.match(/<script>([\s\S]*?)<\/script>/)[1];

let appInnerHTML = '';
function regionExists(name){ return new RegExp('data-region="'+name+'"').test(appInnerHTML); }
function makeElementStub(id){
  const el = {
    id: id||'', style:{}, hidden:false, className:'', innerText:'', _html:'',
    get innerHTML(){ return this._html; },
    set innerHTML(v){ this._html = v; if (this.id==='app') appInnerHTML = v; },
    appendChild(){}, remove(){}, getBoundingClientRect(){return{left:0,top:0,width:0,height:0};},
    closest(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];},
    setAttribute(){}, getAttribute(){return null;}, addEventListener(){}, removeEventListener(){},
    focus(){}, select(){}, click(){}, matches(){return false;} };
  return el;
}
const sandbox = {
  console, Math, JSON, Object, Array, Error, Number, String, Boolean, RegExp, Date,
  parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
  setTimeout: ()=>0, clearTimeout(){}, setInterval: ()=>0, clearInterval(){}, requestAnimationFrame: ()=>0,
  navigator: {}, location: { search: '' },
  ResizeObserver: function(){ this.observe=()=>{}; this.disconnect=()=>{}; },
  MutationObserver: function(){ this.observe=()=>{}; this.disconnect=()=>{}; },
  addEventListener(){}, removeEventListener(){},
  document: {
    readyState:'complete', body: makeElementStub('body'), documentElement: makeElementStub('html'),
    addEventListener(){}, removeEventListener(){},
    getElementById(id){ return makeElementStub(id); },
    querySelector(sel){
      const m = /data-region="([^"]+)"/.exec(sel);
      if (m && regionExists(m[1])) return makeElementStub();
      return null;
    },
    querySelectorAll(){return [];}, createElement(){return makeElementStub();} },
};
sandbox.window = sandbox; sandbox.self = sandbox;
vm.createContext(sandbox);
vm.runInContext(scriptSrc, sandbox, { filename: 'index.html-script' });
const G = sandbox.window.__game;

let failures = 0;
function step(label, fn){
  try { fn(); console.log('ok  ', label, '(html len='+appInnerHTML.length+')'); }
  catch(e){ failures++; console.log('FAIL', label, '->', e.message); console.log(e.stack.split('\n').slice(0,4).join('\n')); }
}

step('TITLE renders after boot', () => {
  if (appInnerHTML.length < 10) throw new Error('empty app html');
});

step('goPhase(R1_TURN) + render for all 4 round-1 cards', () => {
  G.initRound(1);
  const s = G.state(); s.cardSet=[1,2,3,4]; s.round=1; s.turnIndex=0; s.turn=G.initTurn(G.cardById(1));
  G.goPhase(G.PHASES.R1_TURN);
  for (let i=0;i<4;i++){
    const s2 = G.state();
    s2.turn.sent = true;
    G.render();
    s2.turnIndex = i+1;
    if (i<3){ s2.turn = G.initTurn(G.cardById(i+2)); G.render(); }
  }
});

step('goPhase through R1 boomerang beats', () => {
  ['darken','boomerang1','boomerang2','flood','freeze'].forEach(beat => {
    G.goPhase(G.PHASES.R1_TURN, beat);
  });
});

step('goPhase(INTERSTITIAL)', () => {
  G.goPhase(G.PHASES.INTERSTITIAL);
});

step('goPhase(R2_TURN) through all 6 cards, sending each', () => {
  G.initRound(2);
  const s = G.state(); s.cardSet=[1,2,3,4,5,6]; s.round=2;
  G.goPhase(G.PHASES.R2_TURN);
  for (let i=0;i<6;i++){
    const s2 = G.state();
    s2.turnIndex = i;
    s2.turn = G.initTurn(G.cardById(s2.cardSet[i]));
    G.render();
    G.doSend();
    G.render();
  }
});

step('goPhase(ENDING_RESULT / ENDING_CARD / ENDING_PROMPT)', () => {
  G.goPhase(G.PHASES.ENDING_RESULT);
  G.goPhase(G.PHASES.ENDING_CARD);
  G.goPhase(G.PHASES.ENDING_PROMPT);
});

step('DEMO_MODE (?demo=1) boots and reaches TITLE', () => {
  // re-run the whole script in a fresh sandbox with demo=1 to check that path too
  const sandbox2 = Object.assign({}, sandbox);
  sandbox2.location = { search: '?demo=1&debug=1' };
  let appHtml2 = '';
  function stub2(id){
    const el = makeElementStub(id);
    const origSetter = Object.getOwnPropertyDescriptor(el,'innerHTML') || {};
    return el;
  }
  sandbox2.document = Object.assign({}, sandbox.document, {
    getElementById(id){ const e = makeElementStub(id); return e; }
  });
  vm.createContext(sandbox2);
  vm.runInContext(scriptSrc, sandbox2, { filename: 'index.html-script-demo' });
  const G2 = sandbox2.window.__game;
  const audit = G2.auditCardSet(G2.state().cardSet);
  if (!audit.pass) throw new Error('DEMO_MODE audit failed: ' + JSON.stringify(audit.clauses));
  if (G2.state().cardSet.join(',') !== '1,3,4,6') throw new Error('DEMO_MODE cardSet wrong: '+G2.state().cardSet.join(','));
});

console.log('---');
console.log(failures===0 ? 'SMOKE TEST PASSED: full playthrough rendered with no exceptions' : (failures+' FAILURE(S)'));
process.exit(failures===0?0:1);
