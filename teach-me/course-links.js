/* One context request; explicit stable associations, never filename guesses. */
(async()=>{
 const base='/igcseeconomics/teach-me/';
 const response=await fetch(base+'api.php?action=context',{credentials:'same-origin',cache:'no-store'});
 if(!response.ok)return;
 const context=await response.json(),ready=new Set(context.explanationTypes||[]);
 function attach(root){
  for(const group of root.querySelectorAll('[data-teach-type][data-question-id]')){
   if(group.dataset.mediaAttached)return;group.dataset.mediaAttached='true';
   if(!ready.has(group.dataset.teachType))continue;
   const link=document.createElement('a');link.className='button secondary self-explanation';
   link.href=base+'?'+new URLSearchParams({type:group.dataset.teachType,question:group.dataset.questionId,watch:'explanation'});
   link.textContent='Self-Explanatory';group.append(link);
  }
 }
 attach(document);
 new MutationObserver(()=>attach(document)).observe(document.body,{childList:true,subtree:true});
 if(['teacher','admin'].includes(context.role)){
  const nav=document.querySelector('.staff-nav');if(nav)nav.hidden=false;
 }
})().catch(()=>{});

// Student progress for teachers (where each student is). Never changes the page.
(function(){if(window.olvProgress||document.querySelector('script[data-olv-progress]'))return;var s=document.createElement('script');s.src='/igcseeconomics/assets/progress.js?v=c9d8561a08';s.defer=true;s.setAttribute('data-olv-progress','');document.head.appendChild(s);})();

// Bottom-left shortcut to the must-learn formulas and key facts (same idea as the Chemistry course).
(function(){if(document.querySelector('.kf-dock')||/\/key-facts\.html$/.test(location.pathname))return;var a=document.createElement('a');a.className='kf-dock';a.href='/igcseeconomics/key-facts.html';a.textContent='Formulas & key facts';a.style.cssText='position:fixed;left:28px;bottom:25px;z-index:850;display:flex;align-items:center;border-radius:50px;background:#3B465A;color:#fff;padding:13px 21px;box-shadow:0 5px 24px #172b4d33;font:500 13px/1.2 Poppins,system-ui,sans-serif;text-decoration:none';if(innerWidth<600)a.style.cssText+=';left:16px;bottom:16px;padding:12px 15px';var s=document.createElement('style');s.textContent='@media print{.kf-dock{display:none!important}}.kf-dock:hover{background:#e4464f!important}.kf-dock:focus-visible{outline:3px solid #e4464f;outline-offset:3px}';document.head.appendChild(s);document.body.appendChild(a);})();

// Ask AI was removed. Browsers may still hold an older cached page pen that draws the button, so remove it here too.
(function(){function strip(){var h=document.getElementById('olevels-page-pencil'),r=h&&h.shadowRoot;if(r)r.querySelectorAll('.ask-ai,[data-action="ask-ai"]').forEach(function(b){b.remove();});}strip();window.addEventListener('load',strip);setTimeout(strip,1500);})();
