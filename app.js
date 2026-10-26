const items=[{id:'llaves',name:'Llaves',path:'<circle cx="13" cy="13" r="8"/><circle cx="13" cy="13" r="2"/><path d="m19 19 13 13m-4-4 4-4m-8 0 4-4"/>'},{id:'cartera',name:'Cartera',path:'<rect x="5" y="9" width="31" height="25" rx="4"/><path d="M6 14h29m-4 6h6v8h-8a4 4 0 0 1 0-8h2"/><circle cx="30" cy="24" r="1"/>'},{id:'audifonos',name:'Audífonos',path:'<rect x="7" y="16" width="28" height="21" rx="8"/><path d="M7 24h28M13 12V7a3 3 0 0 1 6 0v8m5 0V7a3 3 0 0 1 6 0v5"/><circle cx="21" cy="30" r="1"/>'},{id:'credencial',name:'Credencial',path:'<rect x="7" y="8" width="28" height="29" rx="3"/><path d="M17 8V4h8v4M23 19h7m-7 5h7M12 31h18"/><circle cx="16" cy="19" r="3"/><path d="M12 26v-1a4 4 0 0 1 8 0v1"/>'}];
const required={trabajo:new Set(['llaves','cartera','credencial']),clases:new Set(['llaves','audifonos','credencial']),salida:new Set(['llaves','cartera','audifonos'])};
let routine='trabajo',present=new Set(['llaves','cartera','audifonos','credencial']),reviewed=false;
const statusBox=document.querySelector('#status');
function render(){document.querySelector('#objects').innerHTML=items.map(i=>`<button class="object ${present.has(i.id)?'':'absent'}" data-item="${i.id}" aria-pressed="${present.has(i.id)}" aria-label="${i.name}: ${present.has(i.id)?'en la charola. Toca para retirar':'fuera de la charola. Toca para colocar'}"><span class="badge">${present.has(i.id)?'✓':'＋'}</span><svg viewBox="0 0 42 42" aria-hidden="true">${i.path}</svg><span class="object-name">${i.name}</span><span class="object-state">${present.has(i.id)?'En la charola':'Fuera de la charola'}</span></button>`).join('');document.querySelector('#requirements').innerHTML=items.map(i=>`<label><input type="checkbox" data-required="${i.id}" ${required[routine].has(i.id)?'checked':''}>${i.name}</label>`).join('');}
function review(sound=false){const missing=items.filter(i=>required[routine].has(i.id)&&!present.has(i.id));statusBox.className='status '+(missing.length?'warning':'success');statusBox.innerHTML=`<span class="status-icon">${missing.length?'!':'✓'}</span><div><strong>${missing.length?'Antes de salir…':'¡Todo listo para salir!'}</strong><p>${missing.length?'Te falta: '+missing.map(i=>i.name.toLowerCase()).join(', ')+'.':required[routine].size?'Tienes todos los esenciales de esta rutina.':'No hay esenciales seleccionados en esta rutina.'}</p></div>`;if(sound&&document.querySelector('#sound').checked)beep(missing.length>0);}
function beep(warning){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const now=ctx.currentTime;[0,.18].forEach((delay,n)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.frequency.value=warning?440:660+n*220;gain.gain.setValueAtTime(0,now+delay);gain.gain.linearRampToValueAtTime(.09,now+delay+.01);gain.gain.exponentialRampToValueAtTime(.001,now+delay+.15);osc.start(now+delay);osc.stop(now+delay+.16);});setTimeout(()=>ctx.close(),650);}catch{}}
document.querySelector('#objects').addEventListener('click',e=>{const b=e.target.closest('[data-item]');if(!b)return;const id=b.dataset.item;present.has(id)?present.delete(id):present.add(id);render();document.querySelector(`[data-item="${id}"]`).focus();if(reviewed)review();});
document.querySelectorAll('[data-routine]').forEach(b=>b.addEventListener('click',()=>{routine=b.dataset.routine;document.querySelectorAll('[data-routine]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b?'true':'false');});render();if(reviewed)review();}));
document.querySelector('#check').addEventListener('click',()=>{reviewed=true;review(true);});
document.querySelector('#customize-toggle').addEventListener('click',e=>{const b=e.currentTarget,open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));document.querySelector('#custom-options').hidden=!open;b.querySelector('span').textContent=open?'−':'＋';});
document.querySelector('#requirements').addEventListener('change',e=>{const id=e.target.dataset.required;if(!id)return;e.target.checked?required[routine].add(id):required[routine].delete(id);if(reviewed)review();});render();

// Animación de entrada: el contenido sigue visible si no hay soporte.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.documentElement.classList.add('motion-ready');
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

// Al elegir una sección, cierra el menú de Bootstrap en pantallas pequeñas.
document.querySelectorAll('#navigation a').forEach(link => {
  link.addEventListener('click', () => {
    const navigation = document.querySelector('#navigation');
    if (navigation.classList.contains('show') && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(navigation).hide();
    }
  });
});
