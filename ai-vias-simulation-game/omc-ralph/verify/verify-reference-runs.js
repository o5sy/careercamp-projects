// Scratch verification -- NOT shipped. Drives applyScore/queueBoomerang/
// fireDueBoomerangs/flushPendingBoomerangs turn-by-turn through all 14 of
// AC-4.5's reference runs (section 2.6.5 of the approved plan) and checks
// the exact internal/displayed 업무/보안 totals the plan specifies.
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
  setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame: ()=>0,
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

const N = 6;
const cardIds = [1,2,3,4,5,6];
const tierB = { 3:true, 5:true, 6:true };

function runTurns(spec, gearOnLastApplicableTurn){
  const s = G.state();
  s.round = 2; s.cardSet = cardIds.slice();
  s.scores = { task:0, security:0 };
  s.turnsAwarded = {};
  s.pendingBoomerangs = [];
  var gearGiven = false;
  for (var i=0;i<N;i++){
    s.turnIndex = i;
    var t = spec[i];
    var cardId = cardIds[i];
    var giveGear = gearOnLastApplicableTurn && !gearGiven && i === N-1;
    if (giveGear) gearGiven = true;
    G.applyScore(t.outcome, { tools: t.tools||0, catches: t.catches||0, gearBonus: giveGear?1:0 }, i+1, N);
    if (tierB[cardId] && t.outcome !== 'reject' && (t.tools||0) === 0){
      G.queueBoomerang(cardId);
    }
    G.fireDueBoomerangs();
  }
  G.flushPendingBoomerangs();
  var taskInt = s.scores.task, secInt = s.scores.security;
  return { taskInt: taskInt, taskDisp: G.clampDisp(taskInt), secInt: secInt, secDisp: G.clampDisp(secInt) };
}

function T(outcome, tools, catches){ return { outcome:outcome, tools:tools||0, catches:catches||0 }; }

const runs = [
  { n:1, gear:false, spec:[T('reject'),T('reject'),T('reject'),T('reject'),T('reject'),T('reject')], expect:{taskInt:0,taskDisp:0,secInt:100,secDisp:100} },
  { n:2, gear:false, spec:[T('raw'),T('raw'),T('clean'),T('raw'),T('raw'),T('raw')], // c3 is clean via C1 even at 0 tools
    expect:{taskInt:90,taskDisp:90,secInt:-158,secDisp:0} },
  { n:3, gear:true, spec:[T('clean'),T('clean'),T('clean',1,1),T('clean'),T('clean',1,1),T('clean',1,1)],
    expect:{taskInt:96,taskDisp:96,secInt:125,secDisp:100} },
  { n:4, gear:true, spec:[T('clean'),T('clean'),T('clean',2,2),T('clean'),T('clean',2,2),T('clean',2,2)],
    expect:{taskInt:102,taskDisp:100,secInt:140,secDisp:100} },
  { n:5, gear:false, spec:[T('clean'),T('clean'),T('clean'),T('clean'),T('clean'),T('clean')],
    expect:{taskInt:90,taskDisp:90,secInt:25,secDisp:25} },
  { n:6, gear:false, spec:[T('partial'),T('partial'),T('clean',1,1),T('partial'),T('partial',1,1),T('partial',1,1)],
    expect:{taskInt:96,taskDisp:96,secInt:75,secDisp:75} },
  { n:7, gear:false, spec:[T('raw'),T('raw'),T('reject'),T('raw'),T('reject'),T('reject')],
    expect:{taskInt:45,taskDisp:45,secInt:-10,secDisp:0} },
  { n:8, gear:true, spec:[T('raw'),T('raw'),T('clean',2,2),T('reject'),T('raw',2,2),T('reject')],
    expect:{taskInt:68,taskDisp:68,secInt:21,secDisp:21} },
  { n:9, gear:true, spec:[T('reject'),T('raw'),T('clean',2,2),T('reject'),T('raw',2,2),T('raw',2,2)],
    expect:{taskInt:72,taskDisp:72,secInt:31,secDisp:31} },
  { n:10, gear:false, spec:[T('clean'),T('clean'),T('clean',1,0),T('clean'),T('clean',1,0),T('clean',1,0)],
    expect:{taskInt:81,taskDisp:81,secInt:100,secDisp:100} },
  { n:11, gear:false, spec:[T('raw'),T('raw'),T('reject'),T('reject'),T('reject'),T('reject')],
    expect:{taskInt:30,taskDisp:30,secInt:27,secDisp:27} },
  { n:12, gear:true, spec:[T('reject'),T('raw'),T('clean',2,2),T('reject'),T('raw',2,2),T('raw',2,2)],
    expect:{taskInt:72,taskDisp:72,secInt:31,secDisp:31} },
  { n:13, gear:false, spec:[T('raw'),T('raw'),T('clean'),T('raw'),T('raw'),T('raw')],
    expect:{taskInt:90,taskDisp:90,secInt:-158,secDisp:0} },
  { n:14, gear:true, spec:[T('reject'),T('raw'),T('clean',2,2),T('reject'),T('raw',2,2),T('clean',2,2)],
    expect:{taskInt:72,taskDisp:72,secInt:68,secDisp:68} },
];

let failures = 0;
runs.forEach(function(r){
  const got = runTurns(r.spec, r.gear);
  const ok = got.taskInt===r.expect.taskInt && got.taskDisp===r.expect.taskDisp && got.secInt===r.expect.secInt && got.secDisp===r.expect.secDisp;
  console.log((ok?'ok  ':'FAIL') + ' run ' + r.n, 'got', got, 'expect', r.expect);
  if (!ok) failures++;
});
console.log('---');
console.log(failures===0 ? 'ALL 14 REFERENCE RUNS PASSED' : (failures + ' RUN(S) FAILED'));
process.exit(failures===0?0:1);
