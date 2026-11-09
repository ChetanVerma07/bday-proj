function toP3(){
  if(busy)return;busy=true;
  const ov=document.createElement('div');ov.id='ov';document.body.appendChild(ov);
  ov.animate([{opacity:0},{opacity:1}],{duration:reduce?10:900,fill:'forwards'}).finished.then(()=>{
    FRAME=document.querySelector('.frame');FRAME.remove();BITS=[...document.querySelectorAll('.bit')];BITS.forEach(b=>b.remove());stage='book';ui();
    document.documentElement.classList.add('p3');document.body.classList.add('p3');
    const s=document.createElement('section');s.id='fbs';s.setAttribute('aria-label','Interactive flipbook');
    s.innerHTML='<iframe title="The Memory Book: flipbook"></iframe>';document.body.appendChild(s);
    s.querySelector('iframe').src='flipbook/flipbook.html';scrap(true);
    window.addEventListener('message',e=>{
      const d=e.data;if(e.source!==s.querySelector('iframe').contentWindow||!d||d.source!=='birthday-flipbook')return;
      if(d.type==='scroll'){window.scrollBy({top:d.dy});return}
      if(d.type!=='end'||$('#down'))return;
      const b=document.createElement('button');b.id='down';b.textContent='⌄';b.setAttribute('aria-label','Scroll down to continue');
      b.onclick=()=>$('#scrap').scrollIntoView({behavior:reduce?'auto':'smooth'});s.appendChild(b)});
    ov.animate([{opacity:1},{opacity:0}],{duration:reduce?10:900,fill:'forwards'}).finished.then(()=>{ov.remove();busy=false});
  });
}
