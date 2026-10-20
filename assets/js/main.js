(function(){
  const cfg=window.LS_CONFIG||{};
  const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();
  const header=document.querySelector('.site-header'); const menu=document.querySelector('.menu-button');
  if(header&&menu){menu.addEventListener('click',()=>{const open=header.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('is-open');menu.setAttribute('aria-expanded','false');}));}
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.js-home').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,left:0,behavior:reduced?'auto':'smooth'});}));
  const reveals=document.querySelectorAll('.reveal');
  if(!reduced&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-in');io.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -5% 0px'});reveals.forEach(el=>io.observe(el));}else reveals.forEach(el=>el.classList.add('is-in'));

  const modal=document.getElementById('audience-modal'); const modalContent=document.getElementById('modal-content');
  let lastTrigger=null;
  function openModal(id,trigger){const tpl=document.getElementById(`tpl-${id}`);if(!tpl||!modal||!modalContent)return;lastTrigger=trigger;modalContent.replaceChildren(tpl.content.cloneNode(true));modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');requestAnimationFrame(()=>modal.classList.add('is-open'));const sheet=modal.querySelector('.micro-sheet');if(sheet)sheet.scrollTop=0;modalContent.querySelectorAll('.modal-link').forEach(a=>a.addEventListener('click',closeModal));setTimeout(()=>modal.querySelector('.micro-close')?.focus(),120);}
  function closeModal(){if(!modal)return;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');setTimeout(()=>{modal.hidden=true;modalContent.innerHTML='';lastTrigger?.focus();},180);}
  document.querySelectorAll('[data-audience]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.audience,btn)));
  document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden)closeModal();});

  const phone=document.querySelector('input[name="whatsapp"]');
  if(phone)phone.addEventListener('input',e=>{const d=e.target.value.replace(/\D/g,'').slice(0,11);e.target.value=d.length<=2?`(${d}`:d.length<=7?`(${d.slice(0,2)}) ${d.slice(2)}`:`(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;});
  const rawWhatsApp=(cfg.whatsappNumber||'').replace(/\D/g,'');
  function configureWhatsAppLink(el,message){if(!el)return;if(rawWhatsApp){el.href=`https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(message)}`;el.target='_blank';el.rel='noopener noreferrer';}else{el.href='#';el.addEventListener('click',e=>{e.preventDefault();alert('Configure o número do WhatsApp em assets/js/config.js.');});}}
  configureWhatsAppLink(document.getElementById('whatsapp-float'),'Olá! Gostaria de falar com a LinkSalute.');
  document.querySelectorAll('[data-whatsapp-message]').forEach(el=>configureWhatsAppLink(el,el.dataset.whatsappMessage||'Olá! Gostaria de falar com a LinkSalute.'));
  const form=document.getElementById('partner-form');
  if(form){form.addEventListener('submit',async e=>{e.preventDefault();const status=document.getElementById('form-status');if(!form.reportValidity())return;if(!cfg.formEndpoint){status.textContent='Formulário pronto para integração. Configure o endpoint em assets/js/config.js.';return;}const btn=form.querySelector('button[type="submit"]');try{btn.disabled=true;status.textContent='Enviando...';const r=await fetch(cfg.formEndpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!r.ok)throw new Error();location.href=cfg.successUrl||'obrigado.html';}catch(_){status.textContent='Não foi possível enviar agora. Tente novamente em instantes.';}finally{btn.disabled=false;}});}
})();
