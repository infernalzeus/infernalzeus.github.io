/* Stack Graph — shared by index.html (#projects) and docs/stack-graph/.
   Boots only when #stackgraph is present and leaks nothing into page scope. */
(function(){
var root=document.getElementById('stackgraph');
if(!root)return;
function cssVar(n){return parseFloat(getComputedStyle(root).getPropertyValue(n))}
function sgTop(){return cssVar('--sg-top')||195}
function sgBottom(){return cssVar('--sg-bottom')||90}
var P=[
 {id:'agenthub',t:'AGENT HUB',cat:'systems',y:'Aug 2026 — Present',
  b:'Your most powerful PC tools, at your fingertips on any device.',
  caps:['Orchestration & Infra','LLM & Agents','Developer Tooling','Dashboards & UI'],
  links:[{label:'GITHUB',href:'https://github.com/infernalzeus/Agent-Hub',icon:'gh'},{label:'DOWNLOAD',href:'/Agent-Hub/'},{label:'OVERVIEW',href:'/#project/agent-hub'}]},
 {id:'alphaforge',t:'ALPHAFORGE',cat:'systems',y:'May 2026',
  b:'Executes trades on confidence scores from a financial LLM analyst team.',
  caps:['LLM & Agents','Orchestration & Infra','Simulation & Modelling','Dashboards & UI'],
  links:[{label:'GITHUB',href:'https://github.com/infernalzeus/AlphaForge',icon:'gh'},{label:'OVERVIEW',href:'/#project/alphaforge'}]},
 {id:'clipper',t:'MOVIE SHORTS CLIPPER',cat:'systems',y:'Jul 2026 — Present',
  b:'One shot edit pipeline turning long-form film into recap, narrative and composite content.',
  caps:['Media Generation','LLM & Agents','Developer Tooling'],
  links:[{label:'GITHUB',href:'https://github.com/infernalzeus/movie-shorts-clipper',icon:'gh'},{label:'OVERVIEW',href:'/#project/movie-shorts-clipper'}]},
 {id:'cadenza',t:'CADENZA',cat:'ml',y:'Jun 2026 — Present',
  b:'Bi-modal music generation: a generative model proposes, a classifier directs.',
  caps:['Media Generation','Machine Learning Models'],
  links:[{label:'GITHUB',href:'https://github.com/infernalzeus/Cadenza',icon:'gh'},{label:'OVERVIEW',href:'/#project/cadenza'}]},
 {id:'circadian',t:'CIRCADIAN HEALTH SYSTEMS',cat:'research',y:'Mar 2024 — Present · NHS / Univ. of Kent',
  b:'Compliance, compute and cohort generation from wearable monitoring data.',
  caps:['Data Pipelines','Research Instrumentation','Statistical Analysis','Dashboards & UI'],
  links:[{label:'OVERVIEW',href:'/#project/circadian-health-systems'}]},
 {id:'mri',t:'Portable MRI Simulation',cat:'research',y:'2026 · Kent mobile-MRI resourcing',
  b:'Multi-Travelling Salesman Problem for Bus allocation across Kent',
  caps:['Simulation & Modelling','Research Instrumentation','Data Pipelines','Dashboards & UI'],
  links:[{label:'OVERVIEW',href:'/#project/portable-mri-sim'}]},
 {id:'rlvr',t:'RL AGENT FOR VR ASSESSMENT',cat:'ml',y:'Aug 2021 — Aug 2022 · KCL IoPPN, CSI Lab',
  b:'Train reinforcement-learning agents to complete tasks in VR cognitive assessments.',
  caps:['Machine Learning Models','Research Instrumentation','Simulation & Modelling','Computer Vision'],
  links:[{label:'OVERVIEW',href:'/#project/rl-vr-agent'}]},
 {id:'bbox',t:'3D OBJECT DETECTION',cat:'ml',y:'Jan — May 2021',
  b:'3D Object Detection for On-Road Objects using Camera-LiDAR fusion',
  caps:['Computer Vision','Machine Learning Models'],
  links:[{label:'OVERVIEW',href:'/#project/3d-bounding-box'}]},
 {id:'bm25',t:'BM25 Search Engine',cat:'ml',y:'Mar — Apr 2023',
  b:'Okapi BM25 retrieval over 100k+ MIND news articles, served from Flask in Docker.',
  caps:['Information Retrieval','Machine Learning Models','Dashboards & UI'],
  links:[{label:'GITHUB',href:'https://github.com/infernalzeus/BM-IR-Search-Engine',icon:'gh'},{label:'OVERVIEW',href:'/#project/bm25-search'}]},
 {id:'notebooks',t:'Machine Learning Jupyter Notebooks',cat:'ml',y:'2021 — 2023',
  b:'Reference notebooks for classical ML, NLP (BERT and Word2Vec), and Autoencoders.',
  caps:['Machine Learning Models','Statistical Analysis'],
  links:[{label:'GITHUB',href:'https://github.com/infernalzeus/Jupyter-Notebooks',icon:'gh'},{label:'OVERVIEW',href:'/#project/ml-notebooks'}]},
 {id:'neon',t:'NEON WARFARE',cat:'game',y:'2026 — Present',
  b:'Lane-based auto-battler with a match-token economy and ghost-replay ladder.',
  caps:['Game Systems','Real-Time Multiplayer'],
  links:[{label:'LANDING PAGE',href:'https://infernalzeus.github.io/neon-warfare/'},{label:'OVERVIEW',href:'/#project/neon-warfare'}]},
 {id:'monopoly',t:'MONOPOLY MADNESS',cat:'game',y:'2026',
  b:'Real-time multiplayer Monopoly with live auctions, trades and rule modifiers.',
  caps:['Game Systems','Real-Time Multiplayer'],
  links:[{label:'GITHUB',href:'https://github.com/infernalzeus/Monopoly-Madness',icon:'gh'},{label:'PLAY',href:'https://monopoly-madness.vercel.app/'},{label:'OVERVIEW',href:'/#project/monopoly-madness'}]},
 {id:'sha256',t:'SHA256 VAULT',cat:'systems',y:'Jan 2025',
  b:'Layered local credential manager: config, interfaces, services and utilities.',
  caps:['Developer Tooling'],
  links:[{label:'GITHUB',href:'https://github.com/infernalzeus/SHA256-Encryptor',icon:'gh'},{label:'OVERVIEW',href:'/#project/sha256-vault'}]}
];
const $=s=>root.querySelector(s), stage=$('.stage'), list=$('.list'), caps=$('.caps'), svg=$('.wires');
const colors={systems:'#00e676',research:'#00e8ff',ml:'#a78bfa',game:'#f5c842'},groupNames={systems:'Systems',research:'Research',ml:'ML',game:'Game'};
let capGap=40,index=0,pivot=null,expanded=true,hover=null,capNodes=[],raf=0,drag=null,ignoreClick=false,lock=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const GH='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>';
const external=h=>/^https?:/i.test(h);
const atRoot=/(^\/|\/index\.html)$/i.test(location.pathname);
const hrefFor=h=>(atRoot&&h.slice(0,2)==='/#')?h.slice(1):h;
function actionsHTML(p){return (p.links||[]).map(l=>'<a class="action" href="'+hrefFor(l.href)+'"'+(external(l.href)?' target="_blank" rel="noopener"':'')+'>'+(l.icon==='gh'?GH:'')+'<span>'+l.label+'</span></a>').join('')}
// The card is a container, not a button: anchors may never be nested inside one.
// Focus lives on .focus-btn; the actions are its siblings.
const rows=P.map((p,i)=>{let a=document.createElement('article');a.className='project';a.dataset.sgProject=p.id;a.style.setProperty('--accent',colors[p.cat]);a.innerHTML='<button class="focus-btn" aria-expanded="false"><span class="title">'+p.t+'</span><span class="year">'+p.y+'</span><span class="body">'+p.b+'</span></button><div class="actions">'+actionsHTML(p)+'</div>';a.addEventListener('click',e=>{if(e.target.closest('a'))return;focusProject(i)});a.onpointerenter=()=>{hover={kind:'project',id:i};draw()};a.onpointerleave=()=>{hover=null;draw()};list.append(a);return a});
const actionsOf=r=>r.querySelector('.actions');
function setActionsFocusable(r,on){actionsOf(r).querySelectorAll('a').forEach(x=>{x.tabIndex=on?0:-1;if(on)x.removeAttribute('aria-hidden');else x.setAttribute('aria-hidden','true')})}
$('.mobile').innerHTML=P.map(p=>'<article class="lcard" style="--accent:'+colors[p.cat]+'">'+'<div class="lhead"><span class="ldomain">'+groupNames[p.cat]+'</span><span class="lyear">'+p.y+'</span></div>'+'<h2>'+p.t+'</h2><p>'+p.b+'</p>'+'<div class="ltags"><span class="ltag-label">Domain</span>'+p.caps.map(c=>'<span class="ltag">'+c+'</span>').join('')+'</div>'+'<div class="actions">'+actionsHTML(p)+'</div></article>').join('');
function membership(c,kind='stack'){return P.map((p,i)=>(kind==='group'?p.cat===c:p.caps.includes(c))?i:-1).filter(i=>i>=0)}
function linked(){return pivot?membership(pivot.id,pivot.kind):P.map((_,i)=>i)}
function clearSelection(){pivot=null;expanded=true;update(true)}
function selectNode(n){if(pivot&&pivot.id===n.c&&pivot.kind===n.kind){clearSelection();return}pivot={id:n.c,kind:n.kind};expanded=false;update(true)}
function buildCaps(){let previousNodes=new Map(capNodes.map(n=>[n.kind+':'+n.c,n.el]));let stack=pivot&&pivot.kind==='stack'?[pivot.id]:P[index].caps;capNodes=[...Object.keys(groupNames).map(c=>({c,kind:'group'})),...stack.map(c=>({c,kind:'stack'}))].map(n=>{let key=n.kind+':'+n.c,el=previousNodes.get(key)||document.createElement('button'),fresh=!previousNodes.has(key);previousNodes.delete(key);let selected=pivot&&pivot.id===n.c&&pivot.kind===n.kind;el.className='cap '+(n.kind==='group'?'group ':'')+(selected?'selected ':'')+(n.kind==='group'&&P[index].cat!==n.c&&!selected?'inactive':'');if(n.kind==='group')el.style.setProperty('--group-color',colors[n.c]);el.dataset.node=n.c;el.dataset.kind=n.kind;el.setAttribute('aria-pressed',String(!!selected));el.textContent=n.kind==='group'?groupNames[n.c]:n.c;el.onclick=()=>{if(!ignoreClick)selectNode(n)};el.onpointerenter=()=>{hover={kind:n.kind,id:n.c};draw()};el.onpointerleave=()=>{hover=null;draw()};caps.append(el);if(fresh&&!reduced.matches)el.animate([{opacity:0},{opacity:1}],{duration:450,easing:'ease-out'});return {...n,el,x:0,y:0}});previousNodes.forEach(el=>{el.style.pointerEvents='none';el.setAttribute('aria-hidden','true');el.tabIndex=-1;if(reduced.matches){el.remove();return}el.animate([{opacity:getComputedStyle(el).opacity},{opacity:0}],{duration:350,easing:'ease-out',fill:'forwards'}).finished.then(()=>el.remove())})}
function rowWidth(){if(innerWidth<=759)return Math.max(148,Math.min(176,stage.clientWidth-166));return innerWidth<=1000?290:340}
function listX(){return stage.clientWidth/2-rowWidth()/2}
// The labels used to sit at fixed percentages, so they drifted away from the
// columns they name. Derive them from where the columns actually ended up:
// left/right labels align to their node edge, PROJECTS centres over the cards.
function placeLabels(){
  var gl=$('.group-label'),pl=$('.project-label'),sl=$('.stack-label');
  if(!gl||!pl||!sl)return;
  var g=capNodes.filter(n=>n.kind==='group'),s=capNodes.filter(n=>n.kind==='stack');
  if(g.length)gl.style.left=Math.round(listX()-capGap-gl.offsetWidth)+'px';
  if(s.length)sl.style.left=Math.round(Math.min.apply(null,s.map(n=>n.x)))+'px';
  pl.style.left=Math.round(listX()+rowWidth()/2)+'px';
  pl.style.transform='translateX(-50%)';
}
function placeCaps(){
  let w=stage.clientWidth,h=stage.clientHeight;
  let groups=capNodes.filter(n=>n.kind==='group'),stacks=capNodes.filter(n=>n.kind==='stack');
  let widest=ns=>ns.reduce((m,n)=>Math.max(m,n.el.offsetWidth),0);
  // one gap for both sides, limited by whichever side has less room
  let room=Math.min(listX()-16-widest(groups), w-16-widest(stacks)-listX()-rowWidth());
  let gap=Math.max(innerWidth<=759?9:28,Math.min(innerWidth<=759?26:120,room));
  capGap=gap;
  for(let side of ['group','stack']){
    let ns=side==='group'?groups:stacks;
    let total=ns.reduce((t,n)=>t+n.el.offsetHeight,0)+32*(ns.length-1);
    let y=Math.max(sgTop()+20,(h-total)/2);
    ns.forEach(n=>{
      n.x=side==='group'?listX()-gap-n.el.offsetWidth:listX()+rowWidth()+gap;
      n.x=Math.max(12,Math.min(n.x,w-n.el.offsetWidth-12));
      n.y=y;n.el.style.left=n.x+'px';n.el.style.top=y+'px';
      y+=n.el.offsetHeight+32;
    });
  }
  placeLabels();
}
function update(animate=true){if(scrolling)stopWheel();clearTimeout(snapTimer);scrolling=false;cancelAnimationFrame(raf);hover=null;stage.classList.toggle('group-selection',pivot?.kind==='group');stage.style.setProperty('--selection-color',pivot?.kind==='group'?colors[pivot.id]:'#00e676');list.querySelectorAll('.outgoing-body').forEach(e=>e.remove());let outgoing=null;const previous=rows.find(r=>r.classList.contains('active'));if(animate&&!reduced.matches&&previous&&previous!==rows[index]){let body=previous.querySelector('.body');outgoing=body.cloneNode(true);outgoing.classList.add('outgoing-body');outgoing.style.cssText='position:absolute;left:20px;right:20px;top:'+body.offsetTop+'px;margin:0;visibility:visible;pointer-events:none';}let oldHeights=rows.map(r=>r.offsetHeight),oldTop=parseFloat(rows[0].style.top)||0;let ids=linked();rows.forEach((r,i)=>{let active=expanded&&i===index;r.classList.toggle('active',active);r.classList.toggle('match',!!pivot&&ids.includes(i));r.classList.toggle('unmatched',!!pivot&&!ids.includes(i));r.querySelector('.focus-btn').setAttribute('aria-expanded',String(active));r.style.height='auto';r.style.paddingTop=(active?24:10)+'px';r.style.paddingBottom=(active?24:10)+'px';r.querySelector('.body').style.display=active?'block':'none';actionsOf(r).style.cssText=active?'':'display:none';setActionsFocusable(r,active);r.querySelector('.year').style.display=pivot&&!active?'none':'block'});let heights=rows.map(r=>r.offsetHeight);if(outgoing){previous.append(outgoing);outgoing.animate([{opacity:1},{opacity:0}],{duration:240,easing:'ease-out',fill:'forwards'}).finished.then(()=>outgoing.remove())}if(animate&&!reduced.matches){let body=rows[index].querySelector('.body');body.getAnimations().forEach(a=>a.cancel());body.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,delay:100,fill:'backwards',easing:'ease-out'})}let ys=Array(P.length),gap=24;
if(pivot){let total=ids.reduce((s,i)=>s+heights[i],0)+gap*(ids.length-1),y=Math.max(sgTop()+10,(stage.clientHeight-total)/2);if(expanded){y=stage.clientHeight/2-heights[index]/2;for(let i of ids){if(i===index)break;y-=heights[i]+gap}}let top=y;ids.forEach(i=>{ys[i]=y;y+=heights[i]+gap});let rest=P.map((_,i)=>i).filter(i=>!ids.includes(i)),split=Math.ceil(rest.length/2),up=top-gap;rest.slice(0,split).reverse().forEach(i=>{up-=heights[i];ys[i]=up;up-=gap});rest.slice(split).forEach(i=>{ys[i]=y;y+=heights[i]+gap})}
else{let y=stage.clientHeight/2-heights[index]/2;for(let i=0;i<index;i++)y-=heights[i]+gap;rows.forEach((r,i)=>{ys[i]=y;y+=heights[i]+gap})}
rows.forEach((r,i)=>{r.style.width=rowWidth()+'px';r.style.left=listX()+'px';r.style.top=ys[i]+'px';r.style.height=heights[i]+'px'});buildCaps();placeCaps();$('#back').hidden=!pivot;$('#prev').disabled=index===0;$('#next').disabled=index===P.length-1;$('.status').innerHTML=pivot?'<strong>'+ids.length+' LINKED PROJECTS</strong> / '+(pivot.kind==='group'?groupNames[pivot.id]:pivot.id):P[index].t+' / '+groupNames[P[index].cat];if(animate&&!reduced.matches){let start=performance.now(),origin=ys[0];function frame(now){let t=Math.min(1,(now-start)/620),ease=1-Math.pow(1-t,3),y=oldTop+(origin-oldTop)*ease;rows.forEach((r,i)=>{let h=oldHeights[i]+(heights[i]-oldHeights[i])*ease;r.style.top=y+'px';r.style.height=h+'px';y+=h+gap});caps.style.transform='translateY('+((1-ease)*18)+'px)';draw();if(t<1)raf=requestAnimationFrame(frame);else caps.style.transform=''}raf=requestAnimationFrame(frame)}else{caps.style.transform='';draw()}}
// Clicking should feel like scrolling to the card, so it drives the same eased
// scene position the wheel and the finger do rather than its own animation.
let glideGuard=0;
function glideTo(i){
  i=Math.max(0,Math.min(P.length-1,i));
  // a hidden or backgrounded tab gets no animation frames, so never make the
  // navigation itself depend on one
  if(reduced.matches||pivot||document.hidden){index=i;expanded=true;update(!document.hidden);return}
  cancelAnimationFrame(raf);
  if(!scrolling)beginWheel();
  wheelInput=i;wheelTarget=i;wheelRemainder=0;wheelTime=performance.now();
  cancelAnimationFrame(wheelFrame);wheelFrame=requestAnimationFrame(wheelTick);
  clearTimeout(glideGuard);
  glideGuard=setTimeout(function(){
    if(scrolling&&wheelPosition!==wheelTarget){stopWheel();index=i;expanded=true;update(false)}
  },900);
}
function focusProject(i){if(pivot&&!linked().includes(i))pivot=null;expanded=true;glideTo(i)}
function draw(){let existing=new Map([...svg.children].map(p=>[p.dataset.key,p])),used=new Set();let sr=stage.getBoundingClientRect();capNodes.forEach(n=>{let cr=n.el.getBoundingClientRect();membership(n.c,n.kind).forEach(i=>{let r=rows[i].getBoundingClientRect(),left=n.kind==='group',x=(left?r.left:r.right)-sr.left,y=r.top+r.height/2-sr.top,cx=(left?cr.right:cr.left)-sr.left,cy=cr.top+cr.height/2-sr.top;let selected=pivot&&pivot.id===n.c&&pivot.kind===n.kind,live=selected||(!pivot&&i===index)||(pivot&&expanded&&i===index);let lit=hover&&(hover.kind==='project'?hover.id===i:hover.kind===n.kind&&hover.id===n.c);let key=n.kind+':'+n.c+':'+i;used.add(key);let path=existing.get(key)||document.createElementNS('http://www.w3.org/2000/svg','path');path.dataset.key=key;if(n.kind==='group')path.style.setProperty('--group-color',colors[n.c]);path.dataset.sgProject=P[i].id;path.dataset.node=n.c;path.dataset.kind=n.kind;path.setAttribute('class','wire'+(hover?(lit?' lit':' dim'):(live?' primary':'')));let bend=x+(cx-x)*.55;path.setAttribute('d',`M ${x} ${y} C ${bend} ${y}, ${bend} ${cy}, ${cx} ${cy}`);if(!path.parentNode)svg.append(path)})});existing.forEach((p,key)=>{if(!used.has(key))p.remove()})}
function step(dir){let next=index+dir;if(next<0||next>=P.length){if(pivot)clearSelection();return false}let selected=!!pivot;pivot=null;expanded=true;if(selected){index=next;update(false)}else{glideTo(next)}return true}
$('#prev').onclick=()=>step(-1);$('#next').onclick=()=>step(1);$('#back').onclick=clearSelection;stage.addEventListener('click',e=>{if(pivot&&!e.target.closest('button,a'))clearSelection()});
// A continuous eased scene position drives layout and card expansion together.
let snapTimer=null,scrolling=false,wheelPosition=0,wheelTarget=0,wheelInput=0,wheelFrame=0,wheelTime=0,wheelRemainder=0,sceneSizes=[];
function stopWheel(){cancelAnimationFrame(wheelFrame);wheelFrame=0;scrolling=false;rows.forEach(r=>{r.style.opacity='';r.querySelector('.title').style.fontSize='';r.querySelector('.body').style.opacity='';r.querySelector('.body').style.visibility='';r.querySelector('.body').style.transform='';actionsOf(r).style.cssText=''})}
function beginWheel(){cancelAnimationFrame(raf);wheelPosition=index;wheelTarget=index;wheelInput=index+wheelRemainder;scrolling=true;sceneSizes=rows.map(r=>{let body=r.querySelector('.body'),title=r.querySelector('.title'),act=actionsOf(r);body.getAnimations().forEach(a=>a.cancel());r.style.height='auto';r.style.paddingTop='10px';r.style.paddingBottom='10px';body.style.display='none';act.style.display='none';title.style.fontSize='12px';let small=r.offsetHeight;r.style.paddingTop='24px';r.style.paddingBottom='24px';body.style.display='block';act.style.display='flex';title.style.fontSize='17px';let large=r.offsetHeight;return {small,large}});list.querySelectorAll('.outgoing-body').forEach(e=>e.remove());wheelTime=performance.now()}
function wheelTick(now){let dt=Math.min(32,now-wheelTime);wheelTime=now;wheelPosition+=(wheelTarget-wheelPosition)*(tHeld?1:(1-Math.exp(-dt/145)));if(Math.abs(wheelPosition-wheelTarget)<.001)wheelPosition=wheelTarget;let nearest=Math.round(wheelPosition);if(index!==nearest){index=nearest;buildCaps();placeCaps();$('.status').textContent=P[index].t+' / '+groupNames[P[index].cat];$('#prev').disabled=index===0;$('#next').disabled=index===P.length-1}let heights=sceneSizes.map((s,i)=>{let weight=Math.max(0,1-Math.abs(i-wheelPosition));return s.small+(s.large-s.small)*weight}),tops=[],y=0;heights.forEach(h=>{tops.push(y);y+=h+24});let lo=Math.floor(wheelPosition),hi=Math.min(P.length-1,lo+1),fraction=wheelPosition-lo;let center=(tops[lo]+heights[lo]/2)*(1-fraction)+(tops[hi]+heights[hi]/2)*fraction;rows.forEach((r,i)=>{let weight=Math.max(0,1-Math.abs(i-wheelPosition)),body=r.querySelector('.body');r.classList.toggle('active',weight>.001);r.querySelector('.focus-btn').setAttribute('aria-expanded',String(i===nearest));r.style.top=(stage.clientHeight/2+tops[i]-center)+'px';r.style.height=heights[i]+'px';r.style.paddingTop=(10+14*weight)+'px';r.style.paddingBottom=(10+14*weight)+'px';r.style.opacity=.46+.54*weight;r.querySelector('.title').style.fontSize=(12+5*weight)+'px';body.style.display='block';body.style.visibility='visible';body.style.opacity=weight;body.style.transform='translateY('+((1-weight)*8)+'px)';let act=actionsOf(r);act.style.display='flex';act.style.opacity=weight;setActionsFocusable(r,weight>.99)});draw();if(wheelPosition!==wheelTarget)wheelFrame=requestAnimationFrame(wheelTick);else{stopWheel();update(false)}}
stage.addEventListener('wheel',e=>{if(innerWidth<760||e.ctrlKey||Math.abs(e.deltaY)<Math.abs(e.deltaX)||!e.deltaY)return;if(pivot)clearSelection();let delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?stage.clientHeight:1);let position=scrolling?wheelTarget:index;if((position===0&&delta<0)||(position===P.length-1&&delta>0))return;e.preventDefault();if(!scrolling)beginWheel();wheelInput=Math.max(0,Math.min(P.length-1,wheelInput+delta/100));wheelTarget=Math.round(wheelInput);wheelRemainder=wheelInput-wheelTarget;if(reduced.matches){index=wheelTarget;stopWheel();update(false);return}if(!wheelFrame){wheelTime=performance.now();wheelFrame=requestAnimationFrame(wheelTick)}},{passive:false});
document.addEventListener('keydown',e=>{if(stage.getBoundingClientRect().bottom<=0)return;if(e.key==='Escape'){if(pivot){e.preventDefault();clearSelection()}return}let next=({ArrowUp:index-1,PageUp:index-1,ArrowDown:index+1,PageDown:index+1,Home:0,End:P.length-1})[e.key];if(next===undefined||next<0||next>=P.length)return;e.preventDefault();let selected=!!pivot;pivot=null;expanded=true;if(selected){index=next;update(false)}else{glideTo(next)}});
// Touch takes the gesture and drives the same eased scene position the wheel
// does, so dragging moves the list with your finger instead of stepping once
// per swipe while the page scrolls underneath. The page is only released at
// the first and last project, so the section can never trap you.
let tY=null,tHeld=false;
stage.addEventListener('touchstart',e=>{
  if(e.target.closest('.cap')||e.target.closest('a')||e.target.closest('.controls')){tY=null;return}
  tY=e.touches[0].clientY;tHeld=false;
},{passive:true});
stage.addEventListener('touchmove',e=>{
  if(tY===null)return;
  let y=e.touches[0].clientY,dy=tY-y;tY=y;
  if(!dy)return;
  let at=scrolling?wheelTarget:index;
  if(!tHeld&&((at===0&&dy<0)||(at===P.length-1&&dy>0)))return;   // let the page take it
  tHeld=true;
  e.preventDefault();
  if(pivot)clearSelection();
  if(!scrolling)beginWheel();
  wheelInput=Math.max(0,Math.min(P.length-1,wheelInput+dy/(innerWidth<=759?54:78)));
  wheelTarget=wheelInput;              // follow the finger, do not snap mid-drag
  wheelRemainder=0;
  if(reduced.matches){index=Math.round(wheelTarget);stopWheel();update(false);return}
  wheelTime=performance.now();
  cancelAnimationFrame(wheelFrame);wheelFrame=requestAnimationFrame(wheelTick);
},{passive:false});
stage.addEventListener('touchend',()=>{let held=tHeld;tY=null;tHeld=false;
  if(held&&scrolling){wheelTarget=Math.max(0,Math.min(P.length-1,Math.round(wheelInput)));
    wheelInput=wheelTarget;wheelRemainder=0;wheelTime=performance.now();
    cancelAnimationFrame(wheelFrame);wheelFrame=requestAnimationFrame(wheelTick)}},{passive:true});
stage.addEventListener('touchcancel',()=>{tY=null;tHeld=false;if(scrolling){stopWheel();update(false)}},{passive:true});

// view toggle: the graph, or the same projects as a plain list
(function(){
  let btn=$('#viewmode');if(!btn)return;
  function paint(){
    let list=root.classList.contains('listmode');
    btn.textContent=list?'GRAPH':'LIST';
    btn.setAttribute('aria-pressed',String(list));
    btn.title=list?'Switch to the interactive graph':'Switch to a plain list';
    ['#prev','#next'].forEach(s=>{let b=$(s);if(b)b.hidden=list});
  }
  btn.addEventListener('click',()=>{
    root.classList.toggle('listmode');
    if(!root.classList.contains('listmode')){update(false)}
    paint();
  });
  paint();
})();
caps.addEventListener('pointerdown',e=>{let el=e.target.closest('.cap');if(!el||el.classList.contains('selected'))return;let n=capNodes.find(n=>n.el===el);drag={n,px:e.clientX,py:e.clientY,x:n.x,y:n.y};ignoreClick=false;el.setPointerCapture(e.pointerId)});
caps.addEventListener('pointermove',e=>{if(!drag)return;let n=drag.n,dx=e.clientX-drag.px,dy=e.clientY-drag.py;if(Math.abs(dx)+Math.abs(dy)>4)ignoreClick=true;let left=n.kind==='group',min=left?20:listX()+rowWidth()+32,max=left?listX()-n.el.offsetWidth-32:stage.clientWidth-n.el.offsetWidth-20,x=Math.max(min,Math.min(max,drag.x+dx)),y=Math.max(sgTop()+10,Math.min(stage.clientHeight-n.el.offsetHeight-sgBottom(),drag.y+dy));let collision=capNodes.some(o=>o!==n&&x<o.x+o.el.offsetWidth+20&&x+n.el.offsetWidth+20>o.x&&y<o.y+o.el.offsetHeight+20&&y+n.el.offsetHeight+20>o.y);if(!collision){n.x=x;n.y=y;n.el.style.left=x+'px';n.el.style.top=y+'px';draw()}});
function release(){drag=null;setTimeout(()=>ignoreClick=false,0)}caps.addEventListener('pointerup',release);caps.addEventListener('pointercancel',release);
window.addEventListener('resize',()=>update(false));document.fonts.ready.then(()=>update(false));update(false);
})();
