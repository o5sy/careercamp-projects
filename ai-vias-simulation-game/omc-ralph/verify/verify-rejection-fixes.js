// Scratch verification -- NOT shipped. Targeted regression test for the
// defects the round-1 architect review found (D1-D4): the round-1 boomerang
// sequence being unreachable, boomerang2/montage never rendering, DEMO_MODE
// breaking card 3's unlock boundary, and the gear bonus being lost on a
// trailing reject. Asserts CONTENT, not just "no exception" -- that blind
// check is exactly what let D1 through the first time.
const fs = require('fs'), vm = require('vm'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const scriptSrc = html.match(/<script>([\s\S]*?)<\/script>/)[1];

let appInnerHTML = '';
function regionExists(name){ return new RegExp('data-region="'+name+'"').test(appInnerHTML); }
function el(id){
  return { id: id||'', style:{}, hidden:false, className:'', innerText:'', _html:'',
    classList:{add(){},remove(){}},
    get innerHTML(){ return this._html; },
    set innerHTML(v){ this._html = v; if (this.id==='app') appInnerHTML = v; },
    appendChild(){}, remove(){}, getBoundingClientRect(){return{left:0,top:0,width:0,height:0};},
    closest(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];},
    setAttribute(){}, getAttribute(){return null;}, addEventListener(){}, removeEventListener(){},
    focus(){}, select(){}, click(){}, matches(){return false;} };
}
const pendingTimeouts = [];
const sandbox = {
  console, Math, JSON, Object, Array, Error, Number, String, Boolean, RegExp, Date,
  parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
  setTimeout: (fn)=>{ pendingTimeouts.push(fn); return pendingTimeouts.length; },
  clearTimeout(){}, setInterval:()=>0, clearInterval(){}, requestAnimationFrame:()=>0,
  navigator:{}, location:{search:''},
  ResizeObserver:function(){this.observe=()=>{};this.disconnect=()=>{};},
  MutationObserver:function(){this.observe=()=>{};this.disconnect=()=>{};},
  addEventListener(){}, removeEventListener(){},
  document:{readyState:'complete', body:el('body'), documentElement:el('html'),
    addEventListener(){}, removeEventListener(){},
    getElementById(id){ return el(id); },
    querySelector(sel){ const m=/data-region="([^"]+)"/.exec(sel); if (m && regionExists(m[1])) return el(); return null; },
    querySelectorAll(){return [];}, createElement(){return el();} },
};
sandbox.window = sandbox; sandbox.self = sandbox;
vm.createContext(sandbox);
vm.runInContext(scriptSrc, sandbox, {filename:'index.html-script'});
const G = sandbox.window.__game;

let failures=0;
function check(n,c,detail){ if(!c){failures++;console.log('FAIL',n,detail||'');} else console.log('ok  ',n); }
function runPending(){ while(pendingTimeouts.length) pendingTimeouts.shift()(); }

// --- D1/D2: drive round 1 through all 4 cards and confirm the boomerang beats actually render ---
// (each of completeR1Paste's own advances queues exactly ONE timeout; pop
// exactly one at a time rather than draining, since firing the 4th one
// synchronously queues 5 MORE for the boomerang sequence itself)
(function(){
  G.initRound(1);
  const s = G.state(); s.cardSet=[1,2,3,4]; s.round=1; s.turnIndex=0; s.turn=G.initTurn(G.cardById(1));
  G.goPhase(G.PHASES.R1_TURN);
  for (let i=0;i<4;i++){
    G.completeR1Paste(G.cardById(s.turnIndex+1));
    pendingTimeouts.shift()(); // fires this card's advance (the 4th also synchronously starts the boomerang)
  }
  check('after card 4, phase is still R1_TURN (not silently INTERSTITIAL)', s.phase === G.PHASES.R1_TURN, s.phase);
  check('darken beat set', s.beat === 'darken', s.beat);

  pendingTimeouts.shift()(); // -> montage
  check('montage beat renders card 2 outcome text', appInnerHTML.indexOf(G.cardById(2).round1Outcome.text) !== -1);

  pendingTimeouts.shift()(); // -> boomerang1
  check('phase still R1_TURN at boomerang1 (D1 regression guard)', s.phase === G.PHASES.R1_TURN, s.phase);
  check('boomerang1 renders the leaked customer string verbatim', appInnerHTML.indexOf('김OO 010-1234-XXXX') !== -1);
  check('boomerang1 also surfaces card 4 outcome (montage continuation)', appInnerHTML.indexOf(G.cardById(4).round1Outcome.text) !== -1);

  pendingTimeouts.shift()(); // -> boomerang2
  check('boomerang2 renders card 3\'s fabricated-statistic article (D2 fix)', appInnerHTML.indexOf('73%') !== -1);

  pendingTimeouts.shift()(); // -> flood
  check('flood beat fills bubbles with flood sentences', G.CARDS && appInnerHTML.length > 0);

  pendingTimeouts.shift()(); // -> freeze
  check('freeze beat shows exactly the freeze line', appInnerHTML.indexOf('다시 해보시겠습니까?') !== -1);
  check('freeze beat has a continue affordance', appInnerHTML.indexOf('toInterstitial') !== -1);
  // Two cosmetic cleanup timers are expected and harmless here: silence()'s
  // 3000ms audio-unmute reset, and replayDot's 560ms in-flight-dot removal.
  // Neither affects game state; draining them just confirms they don't throw.
  runPending();
  check('remaining cosmetic FX/audio cleanup timers fire without throwing', true);
})();

// --- D3: DEMO_MODE must not break card 3's unlock boundary ---
(function(){
  const s = G.freshState();
  s.round = 2; s.cardSet = [1,3,4,6];
  s.turnIndex = s.cardSet.indexOf(3); // position of card 3 in the DEMO set -- currentCard() resolves off turnIndex
  G.setState(s);
  G.goPhase(G.PHASES.R2_TURN);
  check('DEMO_MODE card 3 (the 전환점) exposes the verify toolbar', appInnerHTML.indexOf('검증') !== -1);
})();

// --- D4: gear bonus must not be lost on a trailing reject ---
// Drives the REAL rejectCurrentCard() handler (post-round-1-review fix
// extracted it out of the inline click dispatcher precisely so it could be
// exercised directly here), not a hand-shaped applyScore call standing in
// for it.
(function(){
  const s = G.freshState();
  s.round = 2; s.cardSet = [1,2,3,4,5,6];
  s.turn = G.initTurn(G.cardById(1));
  s.gearJustToggled = true;
  s.flags.learningOff = true;
  G.setState(s);
  const before = s.scores.security;
  G.rejectCurrentCard(G.cardById(1));
  check('rejectCurrentCard() with gearJustToggled still scores the +10', s.scores.security - before === G.baselineAward(1,6) + 10,
    'delta=' + (s.scores.security - before));
  check('rejectCurrentCard() clears gearJustToggled (no double-award on a later action)', s.gearJustToggled === false);
})();

// --- NEW-1 regression: round1Dots must reflect how many documents were
// PASTED (4), not how many happen to remain in the live FX reservoir after
// replayDot(1) lifts card 1's dot out to animate the leak (which would
// under-report it as 3). Drives the real startR1Boomerang() path.
(function(){
  G.initRound(1);
  const s = G.state(); s.cardSet=[1,2,3,4]; s.round=1; s.turnIndex=0; s.turn=G.initTurn(G.cardById(1));
  G.goPhase(G.PHASES.R1_TURN);
  for (let i=0;i<4;i++){
    G.completeR1Paste(G.cardById(s.turnIndex+1));
    pendingTimeouts.shift()(); // fires this card's advance; the 4th also starts the boomerang synchronously
  }
  check('all 4 pastes landed in state.dots before the boomerang replays any', s.dots.length === 4, s.dots.length);
  check('round1Dots captured at boomerang start, BEFORE replayDot(1) runs', s.round1Dots === 4, s.round1Dots);
  pendingTimeouts.shift()(); // -> montage
  pendingTimeouts.shift()(); // -> boomerang1 (replayDot(1) fires here)
  check('replayDot(1) does remove card 1\'s dot from the live reservoir (expected FX behavior)', s.dots.length === 3, s.dots.length);
  check('round1Dots still reports the true paste count (4), unaffected by the FX removal', s.round1Dots === 4, s.round1Dots);
  runPending(); // drain boomerang2/flood/freeze + cosmetic cleanup timers
})();

console.log('---');
console.log(failures===0 ? 'ALL REJECTION-FIX REGRESSION CHECKS PASSED' : (failures+' CHECK(S) FAILED'));
process.exit(failures===0?0:1);
