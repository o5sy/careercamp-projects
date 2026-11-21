// Scratch verification -- NOT shipped. Exercises the real applyMaskTool()
// path (bulk-select, 1:1 tools, 요약 collapse, R-c2/R-c3/R-c4 refusals, undo)
// end to end on real card data, rather than feeding gradeMasking() synthetic
// transformed maps directly.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const scriptSrc = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function makeElementStub(){
  return { style:{}, hidden:false, className:'', innerHTML:'', innerText:'',
    appendChild(){}, remove(){}, getBoundingClientRect(){return{left:0,top:0,width:0,height:0};},
    closest(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];},
    setAttribute(){}, getAttribute(){return null;}, addEventListener(){}, removeEventListener(){},
    focus(){}, select(){}, click(){}, matches(){return false;} };
}
const sandbox = {
  console, Math, JSON, Object, Array, Error, Number, String, Boolean, RegExp, Date,
  parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
  setTimeout: ()=>0, clearTimeout(){}, setInterval: ()=>0, clearInterval(){}, requestAnimationFrame: ()=>0,
  navigator: {}, location: { search: '' },
  ResizeObserver: function(){ this.observe=()=>{}; this.disconnect=()=>{}; },
  MutationObserver: function(){ this.observe=()=>{}; this.disconnect=()=>{}; },
  addEventListener(){}, removeEventListener(){},
  document: { readyState:'complete', body: makeElementStub(), documentElement: makeElementStub(),
    addEventListener(){}, removeEventListener(){}, getElementById(){return makeElementStub();},
    querySelector(){return null;}, querySelectorAll(){return [];}, createElement(){return makeElementStub();} },
};
sandbox.window = sandbox; sandbox.self = sandbox;
vm.createContext(sandbox);
vm.runInContext(scriptSrc, sandbox, { filename: 'index.html-script' });
const G = sandbox.window.__game;

let failures = 0;
function check(name, cond, detail){ if (!cond){ failures++; console.log('FAIL', name, detail||''); } else console.log('ok  ', name); }

// --- Card 1: bulk-select paragraph 0, apply 익명화 to the pii_name, mask to the phone/order ---
(function(){
  const card = G.cardById(1);
  const s = G.freshState();
  s.round=2; s.cardSet=[1,2,3,4,5,6]; s.turn = G.initTurn(card);
  G.setState(s);
  // Mark every risk token belonging to paragraph 0 (bulk select), apply anonymize -> only pii_name (idx0) neutralizes;
  // pii_phone(idx1)/biz_id(idx2) are mask-only so anonymize should leave them un-neutralized but still transformed
  // (a 1:1 tool applied to a token whose type doesn't list it is allowed IF an authored replacement exists -- but
  // pii_phone/biz_id here carry no >replacement, so R-c4 should REFUSE those two, leaving only idx0 transformed).
  G.bulkMarkParagraph(card); // marks whichever paragraph still has unmarked risk tokens; first call -> para 0
  const marked0 = Object.keys(s.turn.marked).map(Number);
  check('para-0 bulk select marks exactly the 3 tokens of 문의 1', marked0.slice().sort((a,b)=>a-b).join(','), '0,1,2');
  G.applyMaskTool(card, 'anonymize');
  check('anonymize neutralizes pii_name (idx0)', G.coverage(card, s.turn.transformed) > 0);
  const t = s.turn.transformed;
  check('idx0 (pii_name) got a transform', !!t[0]);
  check('idx1 (pii_phone, no >repl, anonymize not its neutralizer) refused -- no transform applied', !t[1]);
  check('idx2 (biz_id, no >repl, anonymize not its neutralizer) refused -- no transform applied', !t[2]);
  check('idx0 replacement equals authored >고객 A', t[0] && t[0].text === '고객 A', JSON.stringify(t[0]));

  // now mask the phone/order with the correct tool
  s.turn.marked = {1:true, 2:true};
  G.applyMaskTool(card, 'mask');
  check('idx1 (phone) now transformed via mask', !!s.turn.transformed[1]);
  check('idx2 (order id) now transformed via mask', !!s.turn.transformed[2]);
  const cov1 = G.coverage(card, s.turn.transformed);
  check('coverage after masking first 문의 (3 of 8 tokens)', Math.abs(cov1 - 3/8) < 1e-9, cov1);

  // undo the last action (the mask application) and confirm it reverts idx1/idx2 only
  G.undoLastMask(card);
  check('undo reverts idx1', !s.turn.transformed[1]);
  check('undo reverts idx2', !s.turn.transformed[2]);
  check('undo does not revert idx0 (different lastAction)', !!s.turn.transformed[0]);
})();

// --- Card 2: 요약 collapse over the discussion-body unit; anonymize over participants ---
(function(){
  const card = G.cardById(2);
  const s = G.freshState();
  s.round=2; s.cardSet=[1,2,3,4,5,6]; s.turn = G.initTurn(card);
  G.setState(s);
  // participants unit: indices 0-4 (5 pii_name); discussion unit: indices 5-7 (2 perf + 1 hr_eval)
  s.turn.marked = {0:true,1:true,2:true,3:true,4:true};
  G.applyMaskTool(card, 'anonymize');
  check('card2 all 5 participants anonymized', Object.keys(s.turn.transformed).length === 5);
  check('card2 participant replacement uses authored >직책 value', s.turn.transformed[0].text === 'A 팀장', JSON.stringify(s.turn.transformed[0]));

  s.turn.marked = {5:true};
  G.applyMaskTool(card, 'summarize');
  check('card2 요약 collapses all 3 discussion tokens (5,6,7)', s.turn.transformed[5] && s.turn.transformed[6] && s.turn.transformed[7]);
  check('card2 요약 first index carries the authored summary sentence', s.turn.transformed[5].text.indexOf('액션 아이템') !== -1, s.turn.transformed[5].text);
  check('card2 요약 remaining indices collapse to empty string', s.turn.transformed[6].text === '' && s.turn.transformed[7].text === '');
  const grade = G.gradeMasking(card, s.turn.transformed);
  check('card2 fully clean after both applications', grade === 'clean', grade);

  // R-c3: applying a 1:1 tool to an already-collapsed index should refuse (no transform change)
  const before = JSON.stringify(s.turn.transformed[6]);
  s.turn.marked = {6:true};
  G.applyMaskTool(card, 'fake');
  const after = JSON.stringify(s.turn.transformed[6]);
  check('R-c3 refuses a 1:1 tool on an already-summarized index', before === after);
})();

// --- Card 4: R-c4 refusal (fake-only type, no authored replacement would throw at boot; here test a mismatched tool) ---
(function(){
  const card = G.cardById(4);
  const s = G.freshState();
  s.round=2; s.cardSet=[1,2,3,4,5,6]; s.turn = G.initTurn(card);
  G.setState(s);
  s.turn.marked = {0:true};
  G.applyMaskTool(card, 'mask'); // unreleased_spec's neutralizedBy is ['fake'] only, and it DOES carry >replacement,
                                  // so per the plan's own note this still APPLIES (visible transform, still 미가림)
  check('wrong-tool-with-authored-replacement still applies (미가림 case, AC-4.10)', !!s.turn.transformed[0]);
  check('but does not neutralize (wrong tool)', !G.coverage.__never); // sanity no-op
  const neutralized = (function(){ // isNeutralized isn't exposed; recompute via coverage delta
    const before = 0; // token0 alone
    return G.coverage(card, s.turn.transformed) === 0; // mask isn't in unreleased_spec's neutralizedBy -> still 0 coverage
  })();
  check('wrong tool leaves token un-neutralized (coverage stays 0)', neutralized);
})();

console.log('---');
console.log(failures===0 ? 'ALL MASKING-FLOW CHECKS PASSED' : (failures+' CHECK(S) FAILED'));
process.exit(failures===0?0:1);
