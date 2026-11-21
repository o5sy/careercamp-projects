// Scratch verification -- NOT shipped. Round-3 architect review found that
// the round-1 review's NEW-1 fix was correct in placement (capture before
// replayDot) but the previous harness's zero-size getBoundingClientRect stub
// forced flyDot's instant-settle fallback, HIDING a second timing race
// (NEW-2): completeR1Paste's own advance timer (400ms) fires BEFORE the 4th
// dot's flyDot animation settles (560ms), so sampling state.dots.length at
// that point was always one short in a real browser. The actual fix
// (round1Dots as a counter incremented at paste time, independent of the FX
// reservoir entirely) needs a harness that honours REAL timeout delays with
// REAL animation timing to prove it -- this file provides a virtual clock
// and non-zero layout rects so flyDot takes its animated path, not the
// fallback.
const fs = require('fs'), vm = require('vm'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const scriptSrc = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// --- virtual clock: a priority queue of {fireAt, fn}, fired in time order ---
let clockNow = 0;
const queue = [];
function vClockSetTimeout(fn, delay){
  const id = queue.length;
  queue.push({ fireAt: clockNow + (delay||0), fn, id, cancelled:false });
  return id;
}
function vClockClearTimeout(id){ const e = queue.find(q=>q.id===id); if (e) e.cancelled = true; }
function advanceTo(t){
  clockNow = t;
  // fire everything due, in fireAt order; re-check the queue each pass since
  // firing one callback may schedule new ones that are also due by t.
  let fired = true;
  while (fired){
    fired = false;
    queue.sort((a,b)=>a.fireAt-b.fireAt);
    for (const e of queue){
      if (!e.cancelled && !e.done && e.fireAt <= clockNow){
        e.done = true; fired = true;
        e.fn();
      }
    }
  }
}

let appInnerHTML = '';
function regionExists(name){ return new RegExp('data-region="'+name+'"').test(appInnerHTML); }
// non-zero rects so flyDot/replayDot take their ANIMATED branch, not the
// instant-settle fallback -- this is the change that exposes NEW-2's class.
function el(id){
  return { id: id||'', style:{}, hidden:false, className:'', innerText:'', _html:'',
    classList:{add(){},remove(){}},
    get innerHTML(){ return this._html; },
    set innerHTML(v){ this._html = v; if (this.id==='app') appInnerHTML = v; },
    appendChild(){}, remove(){},
    getBoundingClientRect(){ return { left:10, top:10, width:100, height:20 }; },
    closest(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];},
    setAttribute(){}, getAttribute(){return null;}, addEventListener(){}, removeEventListener(){},
    focus(){}, select(){}, click(){}, matches(){return false;} };
}
const sandbox = {
  console, Math, JSON, Object, Array, Error, Number, String, Boolean, RegExp, Date,
  parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
  setTimeout: vClockSetTimeout, clearTimeout: vClockClearTimeout,
  setInterval: ()=>0, clearInterval(){}, requestAnimationFrame: (fn)=>{ fn(); return 0; },
  navigator:{}, location:{search:''},
  ResizeObserver:function(){this.observe=()=>{};this.disconnect=()=>{};},
  MutationObserver:function(){this.observe=()=>{};this.disconnect=()=>{};},
  addEventListener(){}, removeEventListener(){},
  document:{readyState:'complete', body:el('body'), documentElement:el('html'),
    addEventListener(){}, removeEventListener(){},
    getElementById(id){ return el(id); },
    // every [data-region=...] selector resolves once that region has been
    // rendered at least once -- matches the real browser's DOM more closely
    // than "always null", which is what let the doc/anchor/bubble lookups
    // silently no-op in earlier harnesses.
    querySelector(sel){ const m=/data-region="([^"]+)"/.exec(sel); if (m && regionExists(m[1])) return el(); return null; },
    querySelectorAll(){return [];}, createElement(){return el();} },
};
sandbox.window = sandbox; sandbox.self = sandbox;
vm.createContext(sandbox);
vm.runInContext(scriptSrc, sandbox, {filename:'index.html-script'});
const G = sandbox.window.__game;

let failures = 0;
function check(n,c,detail){ if(!c){failures++;console.log('FAIL',n,detail!==undefined?detail:'');} else console.log('ok  ',n); }

G.initRound(1);
const s = G.state(); s.cardSet=[1,2,3,4]; s.round=1; s.turnIndex=0; s.turn=G.initTurn(G.cardById(1));
G.goPhase(G.PHASES.R1_TURN);

// Paste all 4 cards, each via the real completeR1Paste path, spacing the
// pastes 1000ms apart on the virtual clock (comfortably clear of flyDot's
// 560ms settle and completeR1Paste's own 400ms advance, so each card fully
// resolves -- including its dot's animated flight -- before the next starts).
for (let i=0;i<4;i++){
  G.completeR1Paste(G.cardById(s.turnIndex+1));
  advanceTo(clockNow + 1000);
}
check('all 4 dots have landed in state.dots (animated flyDot path, non-zero rects)', s.dots.length === 4, s.dots.length);
check('round1Dots reflects the true paste count immediately after the 4th paste, before the boomerang even starts', s.round1Dots === 4, s.round1Dots);

// Now step through the boomerang sequence on the SAME virtual clock, at its
// real ms offsets (700/1900/3400/4700/5900), rather than firing every queued
// timeout back-to-back -- this is what actually exercises the 400ms-vs-560ms
// race the round-3 review found.
advanceTo(clockNow + 699); // just short of the 700ms montage timeout
check('darken beat reached (boomerang started synchronously, montage not yet due)', s.beat === 'darken', s.beat);
advanceTo(clockNow + 1201); // -> past +1900ms total from boomerang start: montage already passed, boomerang1 due
check('boomerang1 reached; round1Dots still 4 after replayDot(1) has fired', s.round1Dots === 4, s.round1Dots);
check('replayDot(1) removed exactly one dot from the live reservoir (expected FX behavior)', s.dots.length === 3, s.dots.length);
advanceTo(clockNow + 5000); // drain the rest (boomerang2/flood/freeze + cosmetic cleanup timers)
check('round1Dots is STILL 4 at the end of the full sequence', s.round1Dots === 4, s.round1Dots);
check('freeze line rendered', appInnerHTML.indexOf('다시 해보시겠습니까?') !== -1);

// --- NEW-3 regression: the round-1 double-advance race the review flagged.
// With the fix, the "continue"/nextTurn affordance must simply not exist in
// dragMode -- round 1 always advances automatically via completeR1Paste's
// own timer, so there is nothing for a stray click to race against.
(function(){
  const s2 = G.freshState();
  s2.round = 1; s2.cardSet = [1,2,3,4]; s2.turnIndex = 0; s2.turn = G.initTurn(G.cardById(1));
  s2.turn.sent = true; // simulate "just pasted, feedback showing, about to auto-advance"
  G.setState(s2);
  G.goPhase(G.PHASES.R1_TURN);
  check('no nextTurn affordance is rendered in round 1 (dragMode) even once sent -- nothing to race against', appInnerHTML.indexOf('data-act="nextTurn"') === -1);
})();

console.log('---');
console.log(failures===0 ? 'R1 TIMING-RACE (NEW-2/NEW-3) CHECKS PASSED' : (failures+' CHECK(S) FAILED'));
process.exit(failures===0?0:1);
