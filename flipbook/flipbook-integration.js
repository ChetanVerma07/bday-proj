
/* BIRTHDAY-INTEGRATION (additions only, original code untouched):
   1) realistic page-curl turn (corner-peel on hover, drag to turn, click to turn, fold + spine shadows)
   2) closed cover page   3) reports "The End"   4) forwards wheel/vertical swipe to the parent   5) hands petals to the parent */
(function(){
function P(m){try{parent.postMessage(Object.assign({source:'birthday-flipbook'},m),'*')}catch(_){}}
addEventListener('wheel',function(e){P({type:'scroll',dy:e.deltaY})},{passive:true});
var sx,sy,ly;addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=ly=t.clientY},{passive:true});
addEventListener('touchmove',function(e){var t=e.touches[0];if(Math.abs(t.clientY-sy)>12&&Math.abs(t.clientY-sy)>Math.abs(t.clientX-sx))P({type:'scroll',dy:ly-t.clientY});ly=t.clientY},{passive:true});
if(parent!==window){var pe0=document.getElementById('petals');if(pe0)pe0.remove()}
var reduceM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- styles ---------- */
var st=document.createElement('style');st.textContent=`
#stage{position:relative}
#book{touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab;box-shadow:0 1px 0 #d9d2c3,0 3px 0 #ece6d9,0 5px 0 #d9d2c3,0 24px 50px #0007}
#book.grab{cursor:grabbing}
.sp{position:absolute;left:46%;width:8%;top:0;bottom:0;z-index:2;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(0,0,0,.12) 38%,rgba(0,0,0,.3) 50%,rgba(0,0,0,.12) 62%,transparent)}
#tl{position:absolute;inset:0;overflow:hidden;border-radius:8px;pointer-events:none;z-index:3}
#flw{position:absolute;left:0;top:0;width:100%;height:100%;transform-origin:0 0;filter:drop-shadow(0 0 7px rgba(0,0,0,.45));display:none}
.sh{position:absolute;inset:0;pointer-events:none}
#bar button{transition:transform .15s,box-shadow .15s}#bar button:hover{transform:translateY(-2px) scale(1.08);box-shadow:0 5px 12px #0005}#bar button:active{transform:scale(.94)}
#cv{position:absolute;left:25%;top:0;width:50%;aspect-ratio:.86;transform-origin:left center;transform-style:preserve-3d;cursor:pointer;z-index:5;container-type:inline-size;border-radius:4px 12px 12px 4px;background:repeating-linear-gradient(90deg,#c8102e 0 6%,#a50d26 6% 12%);box-shadow:0 18px 40px #0007;transition:left .65s cubic-bezier(.22,.7,.25,1),transform .9s cubic-bezier(.4,.1,.2,1);overflow:visible}
#cv .cvfront{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;backface-visibility:hidden;overflow:hidden;border-radius:4px 12px 12px 4px}
#cv .cvfront:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0006 0,transparent 10%,transparent 92%,#0003)}
#cv .cvback{position:absolute;inset:0;transform:rotateY(180deg);backface-visibility:hidden;overflow:hidden;border-radius:12px 4px 4px 12px}
#cv .cvbackpage{position:absolute;inset:0;container-type:inline-size;overflow:hidden}
#cv .rg{position:absolute;left:3.5%;width:6%;aspect-ratio:1;border-radius:50%;background:#2a0710;box-shadow:inset 0 0 0 2px #999}
#cv .lab{position:relative;width:70%;background:#fdfcf8;border-radius:6px;padding:7% 6% 8%;text-align:center;transform:rotate(-2deg);box-shadow:0 4px 12px #0005;color:#c8102e}
#endPrompt{position:absolute;left:50%;top:0;width:50%;aspect-ratio:.86;display:grid;place-items:center;padding:8%;color:#ffe5ea;text-align:center;font:700 clamp(16px,2.4vw,26px)/1.6 'Playfair Display',serif;letter-spacing:.08em;text-shadow:0 2px 12px #560d24;white-space:pre-line;opacity:0;animation:endPromptIn 1.4s cubic-bezier(.22,.7,.25,1) forwards;pointer-events:none}
@keyframes endPromptIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
#cv:hover{transform:rotateY(-12deg)}#cv:focus-visible{outline:3px solid #fff}`;
document.head.appendChild(st);

/* ---------- spreads (END becomes a normal spread so it can curl) ---------- */
var ENDC='<div class="a" style="inset:0;background:linear-gradient(#a5122b,#6e0a1c);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#e6c46a"><div style="position:absolute;inset:4%;border:2px dotted #e6c46a;border-radius:4px"></div><div style="font-size:30cqw">\u2740</div><div class="gv" style="font-size:24cqw;line-height:1">The End</div><div class="gv" style="font-size:9cqw;margin-top:8%">thank you for flipping \u2661</div></div>';
var BACKC='<div class="a" style="inset:0;background:repeating-linear-gradient(90deg,#c8102e 0 6%,#a50d26 6% 12%);display:flex;align-items:center;justify-content:center"><div style="position:absolute;inset:4%;border:2px dotted #e6c46a;border-radius:4px"></div><div style="width:13%;color:#e6c46a">'+heart+'</div></div>';
var NOTES='<div class="a" style="inset:0;background-color:#fffdf8;background-image:linear-gradient(transparent 95%,#d9b8bc 95%);background-size:100% 11%;padding:8% 9%;color:#8e1c35"><div class="an" style="font-size:8cqw;text-align:center;margin-bottom:8%">A LITTLE NOTE FOR YOU</div><div style="font:italic 3.8cqw/2.9 '+"'Playfair Display'"+',serif;color:#555">Write your final birthday wish here.</div></div>';
var S=spreads.slice(0,-1).concat([[NOTES,BACKC],[ENDC,'']]);
var last=S.length-1,ci=0,covered=true;

/* ---------- geometry ---------- */
function clip(poly,M,n,side){var out=[];for(var i=0;i<poly.length;i++){var a=poly[i],b=poly[(i+1)%poly.length];
  var da=side*((a[0]-M[0])*n[0]+(a[1]-M[1])*n[1]),db=side*((b[0]-M[0])*n[0]+(b[1]-M[1])*n[1]);
  if(da>=0)out.push(a);if((da>=0)!==(db>=0)){var t=da/(da-db);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}return out}
function reflect(n,M){var k=n[0]*M[0]+n[1]*M[1];return [1-2*n[0]*n[0],-2*n[0]*n[1],-2*n[0]*n[1],1-2*n[1]*n[1],2*k*n[0],2*k*n[1]]}
function grad(u,M,pw,ph,stops){var mx=M[0]-pw,my=M[1],L=Math.abs(pw*u[0])+Math.abs(ph*u[1]);
  var t0=((mx-pw/2)*u[0]+(my-ph/2)*u[1])/L+.5,ang=Math.atan2(u[0],-u[1])*180/Math.PI;
  return 'linear-gradient('+ang+'deg,'+stops.map(function(s){return s[1]+' '+((t0+s[0]/L)*100)+'%'}).join(',')+')'}
window.__geo={clip:clip,reflect:reflect};

/* ---------- static drawing ---------- */
function pg(h,side){return '<div class="half '+side+'">'+h+'</div>'}
function setStatic(l,r){bk.className='';bk.innerHTML=pg(S[l][0],'L')+pg(S[r][1],'R')+'<i class="sp"></i><div id="tl"></div>'}
function label(){lb.textContent=covered?'Cover':(ci===last?'The End':'Page '+(ci*2+1)+'\u2013'+(ci*2+2))}
function idle(){setStatic(ci,ci);label()}

/* ---------- page turn ---------- */
var turn=null,raf=0,start=null;
function begin(dir,cy){
  if(turn||covered)return false;var n0=ci+dir;if(n0<0||n0>last)return false;
  var W=bk.clientWidth,H=bk.clientHeight,next=dir>0;
  setStatic(next?ci:ci-1,next?ci+1:ci);
  var tl=bk.querySelector('#tl');if(!next)tl.style.transform='scaleX(-1)';
  var rem=next?S[ci][1]:'<div style="position:absolute;inset:0;transform:scaleX(-1)">'+S[ci][0]+'</div>';
  var back=next?S[ci+1][0]:S[ci-1][1];
  tl.innerHTML='<div class="half R" id="rem">'+rem+'<i class="sh"></i></div><div id="flw"><div class="half R" id="fl"><div style="position:absolute;inset:0;transform:scaleX(-1)">'+back+'</div><i class="sh"></i></div></div>';
  turn={dir:dir,cy:cy,W:W,H:H,P:[W,cy],target:[W,cy],mode:'hover',rem:tl.querySelector('#rem'),flw:tl.querySelector('#flw'),fl:tl.querySelector('#fl')};
  turn.remSh=turn.rem.querySelector('.sh');turn.flSh=turn.fl.querySelector('.sh');
  loop();return true}
function clampP(p,t){var W=t.W,S0=[W/2,t.cy],r=W/2,vx=p[0]-S0[0],vy=p[1]-S0[1],d=Math.hypot(vx,vy);
  if(d>r){vx*=r/d;vy*=r/d}return [S0[0]+vx,Math.min(t.H*1.05,Math.max(-t.H*.05,S0[1]+vy))]}
function render(t){
  var W=t.W,H=t.H,w=W/2,C=[W,t.cy],P=t.P,dx=P[0]-C[0],dy=P[1]-C[1],len=Math.hypot(dx,dy);
  if(len<1.5){t.rem.style.clipPath='none';t.flw.style.display='none';t.remSh.style.background='none';return}
  var n=[dx/len,dy/len],M=[(C[0]+P[0])/2,(C[1]+P[1])/2],rect=[[w,0],[W,0],[W,H],[w,H]];
  function path(poly){return poly.length<3?'polygon(0 0,0 0,0 0)':'polygon('+poly.map(function(p){return (p[0]-w)+'px '+p[1]+'px'}).join(',')+')'}
  t.rem.style.clipPath=path(clip(rect,M,n,1));
  t.flw.style.display='block';t.flw.style.transform='matrix('+reflect(n,M).join(',')+')';
  t.fl.style.clipPath=path(clip(rect,M,n,-1));
  t.remSh.style.background=grad(n,M,w,H,[[0,'rgba(0,0,0,.30)'],[48,'rgba(0,0,0,0)']]);
  t.flSh.style.background=grad([-n[0],-n[1]],M,w,H,[[0,'rgba(0,0,0,.38)'],[22,'rgba(255,255,255,.16)'],[95,'rgba(0,0,0,0)']]);
}
function loop(){if(!raf)raf=requestAnimationFrame(tick)}
function tick(now){raf=0;var t=turn;if(!t)return;
  if(t.mode==='anim'){
    var u=Math.min(1,(now-t.t0)/t.dur),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
    var x=t.from[0]+(t.to[0]-t.from[0])*e,y=t.from[1]+(t.to[1]-t.from[1])*e;
    if(t.complete)y+=(t.cy===0?1:-1)*Math.sin(Math.PI*e)*t.H*.2;
    t.P=clampP([x,y],t);render(t);if(u>=1){finish(t);return}
  }else{
    var k=t.mode==='drag'?.5:.22;t.P=[t.P[0]+(t.target[0]-t.P[0])*k,t.P[1]+(t.target[1]-t.P[1])*k];render(t);
    if(t.mode==='hover'&&t.target[0]===t.W&&Math.hypot(t.P[0]-t.W,t.P[1]-t.cy)<1.5){kill();return}
  }
  loop()}
function kill(){if(raf)cancelAnimationFrame(raf);raf=0;turn=null;idle()}
function endBook(){bk.querySelector('.half.R').style.display='none';bk.querySelector('.sp').style.display='none';bk.style.boxShadow='none';setTimeout(function(){var prompt=document.createElement('div');prompt.id='endPrompt';prompt.textContent="IT'S NOT OVER YET, MY LOVE\nKEEP SCROLLING";document.getElementById('stage').appendChild(prompt)},2000);P({type:'end'})}
function finish(t){if(raf)cancelAnimationFrame(raf);raf=0;turn=null;if(t.complete){ci+=t.dir}idle();if(t.complete&&ci===last)endBook()}
function animate(complete){var t=turn;t.mode='anim';t.complete=complete;t.from=t.P.slice();t.to=complete?[0,t.cy]:[t.W,t.cy];t.t0=performance.now();
  t.dur=reduceM?1:(complete?760:420);loop()}

/* ---------- pointer: hover peel, drag, click ---------- */
function pos(e){var r=bk.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top,r.width,r.height]}
function world(x,y,W,dir){return dir>0?[x,y]:[W-x,y]}
function corner(x,y,W,H){var zs=Math.min(.2*W,.42*H),best=null;
  [[1,W],[-1,0]].forEach(function(s){[0,H].forEach(function(cy){var d=Math.hypot(x-s[1],y-cy);if(d<zs&&(!best||d<best.d))best={dir:s[0],cy:cy,d:d,zs:zs}})});
  if(best&&((best.dir>0&&ci>=last)||(best.dir<0&&ci<=0)))return null;return best}
bk.addEventListener('pointermove',function(e){
  if(covered||(turn&&turn.mode==='anim'))return;var p=pos(e),W=p[2],H=p[3];
  if(start){var dd=Math.hypot(p[0]-start.x,p[1]-start.y);
    if(!start.moved&&dd>6){start.moved=true;bk.classList.add('grab');
      if(turn&&turn.dir!==start.dir)kill();if(!turn&&!begin(start.dir,start.cy)){start=null;return}turn.mode='drag'}
    if(start.moved&&turn)turn.target=clampP(world(p[0],p[1],W,start.dir),turn);return}
  if(e.pointerType==='touch')return;
  var c=corner(p[0],p[1],W,H);
  if(c){if(!turn)begin(c.dir,c.cy);
    if(turn&&turn.mode==='hover'&&turn.dir===c.dir&&turn.cy===c.cy){var a=(1-c.d/c.zs)*c.zs*.62+8,s=turn.cy===turn.H?-1:1,m=Math.hypot(1,.85);
      turn.target=[turn.W-a/m,turn.cy+s*a*.85/m]}else if(turn&&turn.mode==='hover')turn.target=[turn.W,turn.cy]}
  else if(turn&&turn.mode==='hover')turn.target=[turn.W,turn.cy]});
bk.addEventListener('pointerleave',function(){if(turn&&turn.mode==='hover')turn.target=[turn.W,turn.cy]});
bk.addEventListener('pointerdown',function(e){
  if(covered||(turn&&turn.mode==='anim'))return;var p=pos(e),W=p[2],H=p[3],dir=p[0]>W/2?1:-1;
  if((dir>0&&ci>=last)||(dir<0&&ci<=0))return;
  start={x:p[0],y:p[1],dir:dir,cy:p[1]<H/2?0:H,moved:false};
  if(turn&&turn.mode==='hover'&&turn.dir===dir){start.cy=turn.cy}
  try{bk.setPointerCapture(e.pointerId)}catch(_){}});
function up(){if(!start)return;var s=start;start=null;bk.classList.remove('grab');
  if(!s.moved){if(turn&&turn.dir!==s.dir)kill();if(!turn&&!begin(s.dir,s.cy))return;animate(true);return}
  if(!turn)return;animate(turn.P[0]<turn.W*.64)}
addEventListener('pointerup',up);addEventListener('pointercancel',function(){if(start){start=null;bk.classList.remove('grab');if(turn)animate(false)}});
bk.addEventListener('dragstart',function(e){e.preventDefault()});

/* ---------- cover ---------- */
var COVER={num:'10',line1:'things I love',line2:'about you.',hint:'tap to open \u203a'};
var cv=document.createElement('div');cv.id='cv';cv.tabIndex=0;cv.setAttribute('role','button');cv.setAttribute('aria-label','Open the book: '+COVER.num+' '+COVER.line1+' '+COVER.line2);
cv.innerHTML=`<div class="cvfront"><i class="rg" style="top:18%"></i><i class="rg" style="top:48%"></i><i class="rg" style="top:78%"></i><div class="lab"><div style="font:400 34cqw/1 Anton,Impact,sans-serif">${COVER.num}</div><div style="font:italic 800 8.5cqw/1.2 Playfair Display,serif;color:#222">${COVER.line1}</div><div style="font:400 17cqw/1.1 Great Vibes,cursive">${COVER.line2}</div><div style="width:13cqw;margin:5% auto 0"><svg viewBox="0 0 24 24" width="100%"><path d="M12 21C5 15 2 11 2 7.5A5 5 0 0 1 12 6a5 5 0 0 1 10 1.5C22 11 19 15 12 21z" fill="#c8102e"/></svg></div></div><div style="position:absolute;bottom:4%;left:0;right:0;text-align:center;color:#ffe5ea;font:3.6cqw Special Elite,monospace">${COVER.hint}</div></div><div class="cvback"><div class="cvbackpage">${S[0][0]}</div></div>`;
document.getElementById('stage').appendChild(cv);
bk.style.visibility='hidden';idle();
function openCover(){if(!covered)return;covered=false;cv.style.pointerEvents='none';cv.style.left='50%';setTimeout(function(){bk.style.visibility='visible';bk.animate([{opacity:0},{opacity:1}],{duration:700,easing:'ease'});cv.style.transform='rotateY(-180deg)';cv.addEventListener('transitionend',function turned(e){if(e.propertyName==='transform'){if(cv.style.transform==='rotateY(-180deg)')bk.style.zIndex='6';cv.removeEventListener('transitionend',turned)}});label()},820)}
function closeCover(){covered=true;bk.style.zIndex='';cv.style.zIndex='5';cv.style.pointerEvents='auto';cv.style.opacity='1';cv.style.transform='none';setTimeout(function(){if(covered)bk.style.visibility='hidden'},500);label()}
cv.onclick=openCover;cv.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openCover()}};

/* ---------- buttons / keyboard (the original handlers call mv) ---------- */
mv=function(d){
  if(covered){if(d>0)openCover();return}
  if(turn&&turn.mode==='anim')return;if(turn)kill();
  if(ci===0&&d<0){closeCover();return}
  var n=ci+d;if(n<0||n>last)return;
  if(reduceM){ci=n;idle();if(ci===last)endBook();return}
  if(begin(d,bk.clientHeight))animate(true)};
})();
