const fs = require('fs'), vm = require('vm'), path = require('path');
const pendingTimeouts = [];
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const scriptSrc = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function el(){ return { style:{},hidden:false,className:'',innerHTML:'',innerText:'',classList:{add(){},remove(){}},
  appendChild(){},remove(){},getBoundingClientRect(){return{left:0,top:0,width:0,height:0};},
  closest(){return null;},querySelector(){return null;},querySelectorAll(){return [];},
  setAttribute(){},getAttribute(){return null;},addEventListener(){},removeEventListener(){},
  focus(){},select(){},click(){},matches(){return false;} }; }
const sandbox = { console, Math, JSON, Object, Array, Error, Number, String, Boolean, RegExp, Date,
  parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
  setTimeout: (fn)=>{ pendingTimeouts.push(fn); return pendingTimeouts.length; }, clearTimeout(){}, setInterval:()=>0, clearInterval(){}, requestAnimationFrame:()=>0,
  navigator:{}, location:{search:''},
  ResizeObserver:function(){this.observe=()=>{};this.disconnect=()=>{};},
  MutationObserver:function(){this.observe=()=>{};this.disconnect=()=>{};},
  addEventListener(){}, removeEventListener(){},
  document:{readyState:'complete',body:el(),documentElement:el(),addEventListener(){},removeEventListener(){},
    getElementById(){return el();},querySelector(){return null;},querySelectorAll(){return [];},createElement(){return el();}} };
sandbox.window = sandbox; sandbox.self = sandbox;
vm.createContext(sandbox);
vm.runInContext(scriptSrc, sandbox, {filename:'index.html-script'});
const G = sandbox.window.__game;
let failures=0;
function check(n,c){ if(!c){failures++;console.log('FAIL',n);} else console.log('ok  ',n); }

G.initRound(1);
const s = G.state(); s.cardSet=[1,2,3,4]; s.round=1; s.turnIndex=0; s.turn=G.initTurn(G.cardById(1));
check('turn starts with dragAttempted=false, fallbackRevealed=false', !s.turn.dragAttempted && !s.turn.fallbackRevealed);
G.revealFallback();
check('revealFallback sets fallbackRevealed=true', s.turn.fallbackRevealed===true);
const dotsBefore = s.dots.length;
G.completeR1Paste(G.cardById(1));
check('completeR1Paste marks turn sent and adds a dot (before the deferred advance fires)', s.turn.sent===true && s.dots.length===dotsBefore+1);
check('advance is deferred, not immediate', s.turnIndex===0);
while (pendingTimeouts.length) pendingTimeouts.shift()();
check('after the deferred callback fires, turn advances to card 2', s.turnIndex===1 && s.turn.cardId===2);

console.log('---');
console.log(failures===0?'R1 DRAG/FALLBACK CHECKS PASSED':(failures+' FAILED'));
process.exit(failures===0?0:1);
