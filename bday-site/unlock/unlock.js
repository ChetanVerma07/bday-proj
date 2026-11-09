/* ---------- PHASE 1: unlock → surprise? → birthday card (config: P1) ---------- */
const P1={passcode:'1234',photo:null,avatar:null};   // set passcode / photo urls here
const PINK='#E0678A',CREAM='#FBF7EC',DK='#4a0a17';
const p1av=(src)=>src?`<img src="${src}" alt="Photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;border:3px solid ${DK}">`:`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#9c1238" stroke="${DK}" stroke-width="3"/><circle cx="50" cy="38" r="15" fill="${CREAM}"/><path d="M20 82c3-16 17-22 30-22s27 6 30 22a47 47 0 0 1-60 0z" fill="${CREAM}"/></svg>`;
const p1cat=(hat,w)=>`<svg viewBox="0 -16 100 116" width="${w}" role="img" aria-label="Cute cat"><g stroke="${DK}" stroke-width="3" stroke-linejoin="round"><path d="M20 44L24 12 48 30z" fill="#fff"/><path d="M80 44L76 12 52 30z" fill="#fff"/><ellipse cx="50" cy="58" rx="35" ry="31" fill="#fff"/></g><path d="M26 22l2 10 8-5zM74 22l-2 10-8-5z" fill="#F4B7C1"/><circle cx="38" cy="58" r="3" fill="${DK}"/><circle cx="62" cy="58" r="3" fill="${DK}"/><circle cx="30" cy="66" r="5" fill="#F4B7C1" opacity=".8"/><circle cx="70" cy="66" r="5" fill="#F4B7C1" opacity=".8"/><path d="M45 67q5 5 10 0" fill="none" stroke="${DK}" stroke-width="2.5" stroke-linecap="round"/>${hat?`<path d="M36 30L50 -8 64 30z" fill="#8EC5F0" stroke="${DK}" stroke-width="3" stroke-linejoin="round"/><circle cx="50" cy="-9" r="4" fill="#FFC93C" stroke="${DK}" stroke-width="2"/><polygon points="50,6 52,12 58,12 53,16 55,22 50,18 45,22 47,16 42,12 48,12" fill="#FFC93C"/>`:''}</svg>`;
const p1ghost=(m)=>`<svg viewBox="0 0 100 110" width="86" role="img" aria-label="${m=='a'?'Angry':'Sad'} character"><path d="M16 100V50a34 34 0 0 1 68 0v50l-11-9-11 9-12-9-12 9-11-9z" fill="${m=='a'?'#FFA24A':'#fff'}" stroke="${DK}" stroke-width="3.5" stroke-linejoin="round"/>${m=='a'?`<path d="M30 40l16 8M70 40l-16 8" stroke="${DK}" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="54" r="3.5" fill="${DK}"/><circle cx="62" cy="54" r="3.5" fill="${DK}"/><path d="M38 76q12-12 24 0" fill="none" stroke="${DK}" stroke-width="4" stroke-linecap="round"/>`:`<path d="M30 46l14-5M70 46l-14-5" stroke="${DK}" stroke-width="3.5" stroke-linecap="round"/><circle cx="38" cy="56" r="3.5" fill="${DK}"/><circle cx="62" cy="56" r="3.5" fill="${DK}"/><path d="M42 74q8-6 16 0" fill="none" stroke="${DK}" stroke-width="3.5" stroke-linecap="round"/>`}</svg>`;
const p1=document.createElement('div');p1.id='p1';document.body.appendChild(p1);
let p1clean=()=>{};
const p1set=(cls,html)=>{p1clean();p1clean=()=>{};p1.className=cls;p1.innerHTML=html};
const go1=fn=>transitionScreen(p1,fn);
function sUnlock(){stage='unlock';ui();
  p1set('stripes',`<h1 class="an">UNLOCK</h1><div class="gvs">for surprise</div><div class="r1"><div class="stamp" style="--c:${PINK};width:150px;height:150px;padding:8px">${p1av(P1.avatar)}</div>${p1cat(true,56)}<div class="stamp kp" id="kp" style="--c:${CREAM}"><b>Enter passcode:</b><div class="bx" id="bx"><i></i><i></i><i></i><i></i></div><div class="kg">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-k="${n}" aria-label="${n}">${n}</button>`).join('')}<button data-k="b" aria-label="Backspace">⌫</button><button data-k="0" aria-label="0">0</button><button data-k="e" aria-label="Enter">↵</button></div></div></div>`);
  let code='';const bx=[...p1.querySelectorAll('#bx i')],draw=()=>bx.forEach((b,i)=>b.textContent=i<code.length?'●':'');
  const press=k=>{if(busy)return;
    if(k==='b')code=code.slice(0,-1);
    else if(k==='e'){if(code===P1.passcode){busy=true;go1(sAsk).finally(()=>{busy=false})}else{if(!reduce)$('#kp').animate([{transform:'translateX(0)'},{transform:'translateX(-10px)'},{transform:'translateX(10px)'},{transform:'translateX(-6px)'},{transform:'translateX(0)'}],{duration:350});code=''}}
    else if(code.length<4)code+=k;draw()};
  p1.querySelectorAll('.kg button').forEach(b=>b.onclick=()=>press(b.dataset.k));
  const kh=e=>{if(/^\d$/.test(e.key))press(e.key);else if(e.key==='Backspace')press('b');else if(e.key==='Enter')press('e')};
  addEventListener('keydown',kh);p1clean=()=>removeEventListener('keydown',kh);
}
function sAsk(){stage='ask';ui();
  p1set('dark',`<div style="position:relative"><div class="cattop">${p1cat(false,62)}</div><div class="stamp ask" style="--c:${CREAM}">I have little surprise for you.<br>Wanna see it?</div></div><div class="r1"><button class="pl1" id="y">YES</button><button class="pl1" id="n">NO</button></div>`);
  $('#y').onclick=()=>{if(busy)return;busy=true;go1(sP1Card).finally(()=>{busy=false})};
  $('#n').onclick=()=>{if(busy)return;busy=true;go1(sNo).finally(()=>{busy=false})};
}
function sNo(){stage='no';ui();
  p1set('dark',`<h1 class="an" style="font-size:clamp(32px,7vw,52px)">HOW DARE YOU CLICK NO!</h1><div class="r1" style="gap:24px">${p1ghost('a')}${p1ghost('s')}</div><button class="pl1" id="t">TRY AGAIN</button>`);
  $('#t').onclick=()=>{if(busy)return;busy=true;go1(sAsk).finally(()=>{busy=false})};
}
function sP1Card(){stage='p1card';ui();
  const L=(w,c)=>[...w].map((ch,i)=>`<span style="color:${c[i%c.length]};display:inline-block;transform:rotate(${i%2?3:-3}deg)">${ch}</span>`).join('');
  const cols=['#E83A5C','#F8A23A','#3FA9F5','#9B5DE5','#2BB673'];
  const bun='<svg viewBox="0 0 200 36" width="100%" aria-hidden="true"><path d="M2 4Q100 14 198 4" fill="none" stroke="#5e0b1f" stroke-width="2"/>'+Array.from({length:10},(_,i)=>`<path d="M${8+i*19} 7l9 24 9-24z" fill="${i%2?'#F178A5':'#D0213F'}" stroke="#5e0b1f" stroke-width="1.4" stroke-linejoin="round"/>`).join('')+'</svg>';
  const bal='<svg viewBox="0 0 60 120" width="100%" aria-hidden="true"><path d="M20 40Q30 90 28 118M38 46Q34 90 28 118M28 56Q24 90 28 118" fill="none" stroke="#5e0b1f" stroke-width="1.5"/><ellipse cx="18" cy="26" rx="13" ry="16" fill="#D0213F" stroke="#5e0b1f" stroke-width="2"/><ellipse cx="42" cy="34" rx="13" ry="16" fill="#8EC5F0" stroke="#5e0b1f" stroke-width="2"/><ellipse cx="22" cy="54" rx="13" ry="16" fill="#FFC93C" stroke="#5e0b1f" stroke-width="2"/></svg>';
  const disco='<svg viewBox="0 0 50 70" width="100%" aria-hidden="true"><path d="M25 0v16" stroke="#5e0b1f" stroke-width="2"/><circle cx="25" cy="40" r="22" fill="#DADDF0" stroke="#5e0b1f" stroke-width="2.5"/><path d="M5 34h40M5 46h40M25 18v44M14 22q10 18 0 36M36 22q-10 18 0 36" fill="none" stroke="#9aa0c0" stroke-width="1.4"/></svg>';
  const hat='<svg viewBox="0 0 50 60" width="100%" aria-hidden="true"><path d="M6 56L28 6l16 50z" fill="#F178A5" stroke="#5e0b1f" stroke-width="2.5" stroke-linejoin="round"/><path d="M12 42l30 4M17 30l22 4" stroke="#fff" stroke-width="4"/><circle cx="28" cy="5" r="4.5" fill="#FFC93C" stroke="#5e0b1f" stroke-width="2"/></svg>';
  const star='<svg viewBox="0 0 100 100" width="100%" aria-hidden="true"><polygon points="50,6 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36" fill="#FFC93C" stroke="#5e0b1f" stroke-width="5" stroke-linejoin="round"/></svg>';
  const it=(st,d,h)=>`<div class="it" style="${st};animation-delay:${d}s">${h}</div>`;
  p1set('stripes',`<div class="stamp pc" id="pc" style="--c:${CREAM}">${it('left:6%;right:6%;top:3%',.2,bun)}
    ${it(`left:22%;top:17%;width:52%;aspect-ratio:1;transform:rotate(-3deg);background:#7c1230;border:3px solid #fff;outline:2px solid #5e0b1f;border-radius:6px;overflow:hidden;padding:6%`,.5,p1av(P1.photo))}
    ${it('left:64%;top:7%;width:16%;transform:rotate(12deg)',.8,hat)}${it('left:2%;top:40%;width:17%',1,bal)}${it('right:5%;top:25%;width:14%',1.2,disco)}
    ${it('left:19%;top:47%;width:8%',1.4,star)}${it('right:9%;top:62%;width:9%',1.5,star)}
    ${it('left:16%;right:16%;top:58%',1.6,`<div class="hb">${L('HAPPY',cols)}<br>${L('BIRTHDAY!',cols)}</div>`)}
    ${it('left:36%;bottom:5%;width:28%',1.9,p1cat(true,'100%'))}</div>`);
  setTimeout(()=>{const pc=$('#pc');if(!pc)return;const b=document.createElement('button');b.className='nt';b.textContent='next';b.setAttribute('aria-label','Next');
    b.onclick=()=>{if(busy)return;busy=true;goFromOverlay(()=>sCake()).finally(()=>{p1clean();busy=false})};pc.appendChild(b)},reduce?50:2600);
}
