/* ---------- BACK NAVIGATION (every screen) ---------- */
let stage='unlock',envTok=0,FRAME=null,BITS=[];
const CFG={heading:"Happy Birthday",message:"Wishing you a day filled with love, laughter and happiness!"};
const $=s=>document.querySelector(s),card=$('#card');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep=ms=>new Promise(r=>setTimeout(r,reduce?10:ms));
['✿','✦','✦','✿','✦','✿'].forEach((g,i)=>{const s=document.createElement('span');s.className='bit';s.textContent=g;s.setAttribute('aria-hidden','true');s.style.left=[6,88,10,92,50,4][i]+'%';s.style.top=[10,8,72,60,3,40][i]+'%';s.style.animationDelay=i*.5+'s';document.body.appendChild(s)});
let busy=false;
async function transitionScreen(element,fn){
  if(reduce){fn();return}
  const rect=element.getBoundingClientRect(),snapshot=element.cloneNode(true);
  snapshot.setAttribute('aria-hidden','true');
  snapshot.inert=true;
  Object.assign(snapshot.style,{position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',margin:'0',zIndex:element.id==='p1'?'40':'30',pointerEvents:'none',transformOrigin:'center'});
  document.body.appendChild(snapshot);
  fn();
  const options={duration:560,easing:'ease',fill:'forwards'};
  const out=snapshot.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(-8px) scale(.99)'}],options);
  const incoming=element.animate([{opacity:0,transform:'translateY(8px) scale(.99)'},{opacity:1,transform:'translateY(0) scale(1)'}],options);
  await Promise.all([out.finished,incoming.finished]);
  out.cancel();
  snapshot.remove();
  incoming.cancel();
}
function go(fn){return transitionScreen(card,fn).finally(()=>{busy=false})}
async function goFromOverlay(fn){
  if(reduce){fn();p1.remove();return}
  const options={duration:420,easing:'cubic-bezier(.22,.7,.25,1)',fill:'forwards'};
  fn();
  const out=p1.animate([{opacity:1},{opacity:0}],options);
  const incoming=card.animate([{opacity:0,transform:'translateY(8px) scale(.99)'},{opacity:1,transform:'translateY(0) scale(1)'}],options);
  await Promise.all([out.finished,incoming.finished]);
  out.cancel();
  incoming.cancel();
  p1.remove();
}
const PREV={ask:'unlock',no:'ask',p1card:'ask',cake:'p1card',accept:'cake',choose:'accept',bouquet:'choose',box:'choose',env:'choose',letter:'choose',book:'letter'};
const gb=document.createElement('button');gb.id='gb';gb.textContent='← back';gb.setAttribute('aria-label','Go back');document.body.appendChild(gb);
function ui(){gb.style.display=(PREV[stage]&&stage!=='bouquet'&&stage!=='box')?'block':'none'}
function undoBook(){['#fbs','#scrap','#ov','#down'].forEach(q=>{const e=$(q);e&&e.remove()});document.documentElement.classList.remove('p3');document.body.classList.remove('p3');
  if(FRAME)document.body.insertBefore(FRAME,document.body.firstChild);BITS.forEach(b=>document.body.appendChild(b));scrollTo(0,0)}
function goBack(){
  const t=PREV[stage];if(!t||(busy&&stage!=='book'))return;const from=stage;
  if(from==='env')envTok++;
  if(from==='book'){busy=false;undoBook();card.style.opacity=1;sLetter();return}
  if(t==='p1card'){if(!p1.isConnected)document.body.appendChild(p1);busy=true;p1.style.opacity='';go1(sP1Card).finally(()=>{busy=false});return}
  if(['unlock','ask'].includes(t)){busy=true;go1(t==='unlock'?sUnlock:sAsk).finally(()=>{busy=false});return}
  busy=true;go(t==='cake'?sCake:t==='accept'?()=>sAccept(false):sChoose);
}
gb.onclick=goBack;
addEventListener('keydown',e=>{if(e.key==='Escape')goBack()});
/* petals fall over the whole experience */
if(!reduce){const gp=document.createElement('div');gp.id='gp';gp.setAttribute('aria-hidden','true');for(let i=0;i<28;i++){const q=document.createElement('i');q.className='gpt';const z=8+i%4*5;q.style.cssText=`left:${i*37%100}%;width:${z}px;height:${z}px;animation-duration:${9+i%6*2}s;animation-delay:-${i*.9}s`;gp.appendChild(q)}document.body.appendChild(gp)}
