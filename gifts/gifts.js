const cake=lit=>`<svg viewBox="0 0 240 230" width="230" role="img" aria-label="Birthday cake with a candle"><ellipse cx="120" cy="214" rx="100" ry="10" opacity=".12"/><rect x="30" y="140" width="180" height="68" rx="14" fill="#A91620"/><rect x="55" y="92" width="130" height="56" rx="12" fill="#D92727"/><path d="M55 106q16 16 32 0t32 0 32 0 34 0v-14H55zM30 154q15 18 30 0t30 0 30 0 30 0 30 0v-14H30z" fill="#fff"/>${[70,120,170].map(x=>`<circle cx="${x}" cy="86" r="6" fill="#F4B7C1" stroke="#A91620" stroke-width="2"/>`).join('')}<rect x="114" y="52" width="12" height="40" rx="3" fill="#F4B7C1" stroke="#A91620" stroke-width="2"/><path d="M114 62l12 6M114 74l12 6" stroke="#fff" stroke-width="3"/>${lit?'<path id="flame" class="flame" d="M120 18c12 14 10 26 0 30-10-4-12-16 0-30z" fill="#FFB300" stroke="#EF3B35" stroke-width="3"/>':''}<g id="smoke"></g></svg>`;
const envB='<svg viewBox="0 0 220 150"><rect x="4" y="4" width="212" height="142" rx="10" fill="#A91620" stroke="#6d0d14" stroke-width="3"/></svg>';
const envF='<svg viewBox="0 0 220 150"><path d="M4 146L110 70l106 76z" fill="#8f1019"/><path d="M4 146h212v-4L110 74 4 142z" fill="#c21d28"/></svg>';
const envFl='<svg viewBox="0 0 220 150"><path d="M4 8q0-4 6-4h200q6 0 6 4L110 86z" fill="#FFFDF5" stroke="#6d0d14" stroke-width="3" stroke-linejoin="round"/><path d="M110 62c-14-12-26 2-14 14l14 12 14-12c12-12 0-26-14-14z" fill="#D92727" stroke="#6d0d14" stroke-width="2"/></svg>';
const bouquet='<svg viewBox="0 0 160 190">'+[[50,40,-14],[80,25,0],[110,40,14]].map(([x,y,r])=>`<g transform="rotate(${r} ${x} 120)"><path d="M${x} 120V${y+30}" stroke="#3b7d4a" stroke-width="4"/><path d="M${x-18} ${y+30}q-4-34 18-40 22 6 18 40z" fill="#fff" stroke="#A91620" stroke-width="3"/></g>`).join('')+'<path d="M30 100L80 190 130 100z" fill="#A91620" stroke="#6d0d14" stroke-width="3" stroke-linejoin="round"/><path d="M30 100l50 22 50-22" fill="#D92727" stroke="#6d0d14" stroke-width="3"/><path d="M68 128q12 8 24 0l8 22q-20 10-40 0z" fill="#EF3B35"/></svg>';
const box='<svg viewBox="0 0 160 170"><rect x="20" y="70" width="120" height="90" rx="8" fill="#A91620" stroke="#6d0d14" stroke-width="3"/><rect x="12" y="52" width="136" height="30" rx="8" fill="#D92727" stroke="#6d0d14" stroke-width="3"/><rect x="70" y="52" width="20" height="108" fill="#F7EDE2"/><path d="M80 52q-40-44-46-10t46 10zM80 52q40-44 46-10t-46 10z" fill="#FFFDF5" stroke="#6d0d14" stroke-width="3" stroke-linejoin="round"/><circle cx="80" cy="52" r="8" fill="#F7EDE2" stroke="#6d0d14" stroke-width="3"/></svg>';
const face=sad=>`<svg viewBox="0 0 200 200" width="190" role="img" aria-label="${sad?'Crying character':'Cute character holding a gift'}" class="pop"><g fill="#fff" stroke="#A91620" stroke-width="4"><circle cx="55" cy="45" r="22"/><circle cx="145" cy="45" r="22"/><circle cx="100" cy="105" r="70"/></g><g fill="#F4B7C1"><circle cx="55" cy="45" r="10"/><circle cx="145" cy="45" r="10"/><circle cx="68" cy="125" r="11" opacity=".8"/><circle cx="132" cy="125" r="11" opacity=".8"/></g>${sad?'<g stroke="#A91620" stroke-width="4" stroke-linecap="round" fill="none"><path d="M66 92l18 6M134 92l-18 6M70 100q8 8 16 0M114 100q8 8 16 0M84 138q16-16 32 0"/></g><path d="M78 106q-6 12 0 18q6-6 0-18zM122 106q-6 12 0 18q6-6 0-18z" fill="#6ec1ff"><animateTransform attributeName="transform" type="translate" values="0 0;0 24" dur="1.1s" repeatCount="indefinite"/></path>':'<circle cx="76" cy="98" r="7" fill="#A91620"/><circle cx="124" cy="98" r="7" fill="#A91620"/><path d="M84 120q16 18 32 0" fill="#D92727" stroke="#A91620" stroke-width="4"/><rect x="80" y="160" width="40" height="32" rx="4" fill="#D92727" stroke="#A91620" stroke-width="3"/><path d="M100 160v32M80 174h40" stroke="#fff" stroke-width="5"/>'}</svg>`;
const pill=(t,id)=>`<button class="pill" id="${id}">${t}</button>`;
const openedGifts=new Set();
let activeGift='',giftVisit=0,giftActionTimer;
const giftNames=['envelope','bouquet','box'];
const BOX_AUDIO_PATH='public/media/audios/audio-1.mp3',boxAudio=new Audio(BOX_AUDIO_PATH);
boxAudio.loop=true;
let boxAudioError='';
function syncBoxAudio(){
 const playing=!boxAudio.paused,player=$('.pl'),record=$('#vin'),button=$('#pp'),waveform=$('.waveform'),status=$('#audioStatus');
 if(player)player.classList.toggle('playing',playing);
 if(record)record.classList.toggle('paused',!playing&&!boxAudioError);
 if(button){button.textContent=playing?'❚❚':'▶';button.setAttribute('aria-label',playing?'Pause':'Play')}
 if(waveform)waveform.setAttribute('aria-label',playing?'Music playing':'Music paused');
 if(status)status.textContent=boxAudioError;
}
function reportBoxAudioError(error){
 boxAudioError=`Could not play ${BOX_AUDIO_PATH}. Check that the audio file exists and is a supported format.`;
 syncBoxAudio();
 console.error(boxAudioError,error)
}
function playBoxAudio(){
 return boxAudio.play().then(()=>{boxAudioError='';syncBoxAudio()}).catch(reportBoxAudioError)
}
function returnToGifts(){if(busy)return;busy=true;go(sChoose)}
function scheduleGiftAction(name,delay){
 const visit=++giftVisit;
 clearTimeout(giftActionTimer);
 giftActionTimer=setTimeout(()=>{
  if(visit!==giftVisit||activeGift!==name||stage!==(name==='envelope'?'letter':name))return;
  let action=$('#giftAction');
  if(!action){action=document.createElement('button');action.id='giftAction';action.className='pill gift-action';card.appendChild(action)}
  if(openedGifts.size===giftNames.length){action.textContent='OPEN THE BOOK';action.onclick=()=>{if(name==='box'){boxAudio.pause();syncBoxAudio()}toP3()}}
  else{action.textContent=name==='envelope'?'OPEN MORE':'GO BACK TO OTHER GIFTS';action.onclick=returnToGifts}
  action.classList.remove('arrive');
  action.offsetWidth;
  action.classList.add('arrive');
  action.addEventListener('animationend',()=>action.classList.remove('arrive'),{once:true});
 },reduce?10:delay)
}
function sCake(){stage='cake';ui();card.innerHTML=`<h1>Happy Birthday</h1><div class="sub">MAKE A WISH!!!</div><div id="cw" style="position:relative">${cake(true)}</div>${pill('BLOW THE CANDLE','blow')}`;
 $('#blow').onclick=async e=>{if(busy)return;busy=true;e.target.remove();const f=$('#flame');f.classList.remove('flame');f.classList.add('out');
  $('#smoke').innerHTML=[0,1,2].map(i=>`<path class="smoke" style="animation-delay:${i*.18}s" d="M${116+i*4} 48c-8-8 8-14 0-24" fill="none" stroke="#9a9a9a" stroke-width="3" stroke-linecap="round"/>`).join('');
  if(!reduce)for(let i=0;i<14;i++){const c=document.createElement('i');c.className='conf';c.style.background=['#D92727','#F4B7C1','#fff','#EF3B35'][i%4];c.style.setProperty('--x',Math.cos(i*.45)*110+'px');c.style.setProperty('--y',Math.sin(i*.9)*90-30+'px');$('#cw').appendChild(c)}
  await sleep(1800);card.insertAdjacentHTML('beforeend',pill('NEXT','next'));$('#next').onclick=()=>{if(busy)return;busy=true;go(sAccept)};busy=false}}
function sAccept(sad=false){stage='accept';ui();card.innerHTML=`<h1>${sad?'WHY DID YOU CLICK NO!':'PLEASE ACCEPT THE GIFT'}</h1>${face(sad)}${sad?pill('TRY AGAIN','again'):'<div class="row">'+pill('YES','yes')+pill('NO','no')+'</div>'}`;
 if(sad)$('#again').onclick=()=>{if(busy)return;busy=true;go(sAccept)};else{$('#yes').onclick=()=>{if(busy)return;busy=true;go(sChoose)};$('#no').onclick=()=>{if(busy)return;busy=true;go(()=>sAccept(true))}}}
function sChoose(){if(stage==='box'){boxAudio.pause();boxAudioError=''}stage='choose';ui();activeGift='';giftVisit++;clearTimeout(giftActionTimer);card.innerHTML=`<h1>Choose Your Gifts</h1><div class="gifts"><button class="gift" id="g-env" data-gift="envelope" aria-label="Open the envelope"><div class="env" style="width:150px;height:100px;filter:none">${envB}<div class="fr">${envF}</div><div class="flap">${envFl}</div></div></button><button class="gift" id="g-flw" data-gift="bouquet" aria-label="Flower bouquet">${bouquet}</button><button class="gift" id="g-box" data-gift="box" aria-label="Gift box">${box}</button></div>`;
 requestAnimationFrame(()=>card.querySelectorAll('[data-gift]').forEach(button=>{if(openedGifts.has(button.dataset.gift)){button.classList.add('opened');button.disabled=true}}));
 $('#g-env').onclick=()=>{if(busy)return;activeGift='envelope';busy=true;go(sEnv)};$('#g-flw').onclick=()=>{if(busy)return;activeGift='bouquet';openedGifts.add('bouquet');busy=true;go(sBouquet)};$('#g-box').onclick=()=>{if(busy)return;activeGift='box';busy=true;boxAudioError='';playBoxAudio();go(sBox)}}
async function sEnv(){const tk=++envTok;stage='env';ui();card.innerHTML=`<div class="stage"><div class="env" id="env">${envB}<div class="ltr" id="ltr"></div><div class="fr">${envF}</div><div class="flap" id="flap">${envFl}</div></div></div>`;
 const o={fill:'forwards',easing:'ease-in-out'},d=reduce?10:1;
 await $('#env').animate([{transform:'none'},{transform:'translateY(40px) scale(1.7)'}],{...o,duration:900*d}).finished;if(tk!==envTok)return;
 await $('#flap').animate([{transform:'rotateX(0)'},{transform:'rotateX(180deg)'}],{...o,duration:800*d}).finished;if(tk!==envTok)return;
 $('#flap').style.zIndex=1;
 await $('#ltr').animate([{transform:'none'},{transform:'translateY(-150px) scale(1.08)'}],{...o,duration:900*d}).finished;if(tk!==envTok)return;
 await sleep(350);if(tk!==envTok)return;go(sLetter)}
function sLetter(){stage='letter';ui();openedGifts.add('envelope');const H='<path d="M150 190c-20-16-34 0-18 16l18 14 18-14c16-16 2-32-18-16z" fill="#D92727"/>';
card.innerHTML=`<div class="env2"><svg class="back" viewBox="0 0 300 230"><path d="M12 104L150 8l138 96z" fill="#E6D4BD"/><rect x="12" y="100" width="276" height="124" rx="8" fill="#F1E3D0"/></svg>
<article class="note"><h2>${CFG.heading}</h2><p>${CFG.message}</p></article>
<svg class="front" viewBox="0 0 300 230"><path d="M12 100L150 172 12 224z" fill="#FBF3E6" stroke="#E0CDB4"/><path d="M288 100L150 172 288 224z" fill="#FBF3E6" stroke="#E0CDB4"/><path d="M12 224L150 150l138 74z" fill="#FFFDF5" stroke="#E0CDB4"/><path d="M150 176c-12-10-22 0-12 11l12 9 12-9c10-11 0-21-12-11z" fill="#D92727"/></svg>
<span class="hrt" style="left:6%;bottom:6%;font-size:18px">♥</span><span class="hrt" style="right:8%;bottom:14%;font-size:13px;animation-delay:.8s">♥</span><span class="hrt" style="right:20%;bottom:3%;font-size:10px;animation-delay:1.4s">♥</span></div>`;scheduleGiftAction('envelope',1800)}
const INK='#2a1214';
const sweet=`<svg viewBox="0 0 120 140" width="140" role="img" aria-label="Doodle character with heart sunglasses"><path d="M42 98q18-8 36 0v26q-18 7-36 0z" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="60" cy="58" rx="46" ry="40" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="40" cy="58" rx="17" ry="13" fill="#1b0b0d"/><ellipse cx="80" cy="58" rx="17" ry="13" fill="#1b0b0d"/><path d="M56 56h8" stroke="#1b0b0d" stroke-width="3"/><path transform="translate(40 58) scale(1.1)" d="M0 6C-9-2-7-9 0-5 7-9 9-2 0 6z" fill="#F4B7C1"/><path transform="translate(80 58) scale(1.1)" d="M0 6C-9-2-7-9 0-5 7-9 9-2 0 6z" fill="#F4B7C1"/><circle cx="24" cy="76" r="6" fill="#F4B7C1" opacity=".8"/><circle cx="96" cy="76" r="6" fill="#F4B7C1" opacity=".8"/><path d="M53 80q7 6 14 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></svg>`;
const hug=`<svg viewBox="0 0 120 140" width="96" role="img" aria-label="Doodle character with open arms">${['M36 92L6 82','M84 92l30-10'].map(d=>`<path d="${d}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`).join('')}<path d="M30 132c-8-58 0-96 30-96s38 38 30 96z" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="50" cy="68" r="3.5" fill="${INK}"/><circle cx="70" cy="68" r="3.5" fill="${INK}"/><path d="M52 80q8 7 16 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></svg>`;
function sBouquet(){stage='bouquet';ui();card.innerHTML=`<div class="sc2"><div style="display:flex;flex-direction:column;align-items:center;gap:8px"><p class="note2">flowers for my sweetheart! <span style="color:#D92727">♥</span></p>${sweet}<div class="row" style="gap:8px"><span class="lbl" style="transform:rotate(-3deg)">my favorite person</span><span class="lbl" style="transform:rotate(2deg)">I’m your #1 fan</span></div></div><div class="bq" style="width:min(60vw,250px)">${bouquet}</div></div>`;scheduleGiftAction('bouquet',2000)}
function sBox(){stage='box';ui();card.innerHTML=`<h1 style="align-self:flex-start;margin-top:30px;padding-left:4px">happy birthday</h1><div class="row" style="gap:24px;width:100%"><div><div class="vin${boxAudio.paused?' paused':''}" id="vin"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="58" fill="#120607"/><circle cx="60" cy="60" r="48" fill="none" stroke="#3a1a1c"/><circle cx="60" cy="60" r="40" fill="none" stroke="#3a1a1c"/><circle cx="60" cy="60" r="32" fill="none" stroke="#3a1a1c"/><circle cx="60" cy="60" r="20" fill="#F4B7C1"/><path d="M60 72C46 62 48 52 54 52c4 0 6 3 6 5 0-2 2-5 6-5 6 0 8 10-6 20z" fill="#D92727"/></svg><p>and suddenly all the love songs were about you</p></div><div class="pl${boxAudio.paused?'':' playing'}"><i></i><span><b>Your song title</b>Artist name<small id="audioStatus" role="status">${boxAudioError}</small></span><div class="waveform" aria-label="${boxAudio.paused?'Music paused':'Music playing'}">${Array.from({length:9},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><button id="pp" aria-label="${boxAudio.paused?'Play':'Pause'}">${boxAudio.paused?'▶':'❚❚'}</button></div></div><div class="fcw"><button class="fcb" id="fc" aria-label="OPEN"><span class="f"><svg viewBox="0 0 100 90" width="112" aria-hidden="true"><path d="M50 84C8 54 4 24 26 14c14-6 24 6 24 12 0-6 10-18 24-12 22 10 18 40-24 70z" fill="#fff" stroke="#F4B7C1" stroke-width="3" stroke-dasharray="4 3"/><text x="50" y="52" text-anchor="middle" font-size="16" font-weight="800" fill="#D92727" font-family="Poppins,sans-serif">OPEN</text></svg></span><span class="bkf">I LOVE YOU${hug}Sooooo much ♥</span></button></div></div>`;
 syncBoxAudio();scheduleGiftAction('box',2000);$('#fc').onclick=e=>{const flipped=e.currentTarget.classList.toggle('flip');if(flipped){openedGifts.add('box');scheduleGiftAction('box',2000)}};
 $('#pp').onclick=()=>{if(boxAudio.paused)playBoxAudio();else{boxAudio.pause();boxAudioError='';syncBoxAudio()}}}
