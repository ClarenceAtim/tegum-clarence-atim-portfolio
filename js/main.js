/* Shared portfolio JS: mobile menu, animated stats, toast, email copy, CV download. */

/* Mobile menu */
(function(){
  var btn=document.getElementById('menuBtn');
  var nav=document.getElementById('navLinks');
  if(!btn||!nav) return;
  btn.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
  nav.addEventListener('click',function(e){
    if(e.target.tagName==='A') nav.classList.remove('open');
  });
})();

/* Animated stats: count up when visible. Respects reduced motion. */
(function(){
  var stats=document.querySelectorAll('[data-count]');
  if(!stats.length) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate(el){
    var target=parseInt(el.getAttribute('data-count'),10);
    var suffix=el.getAttribute('data-suffix')||'';
    if(reduce){ el.textContent=target+suffix; return; }
    var start=null,dur=1200;
    function step(ts){
      if(!start) start=ts;
      var p=Math.min((ts-start)/dur,1);
      el.textContent=Math.round(target*(1-Math.pow(1-p,3)))+suffix;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if(!('IntersectionObserver' in window)){ stats.forEach(animate); return; }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ animate(en.target); io.unobserve(en.target); }
    });
  },{threshold:.4});
  stats.forEach(function(el){ io.observe(el); });
})();

function showToast(msg){
  var t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg; t.classList.add('show');
  setTimeout(function(){t.classList.remove('show')},2200);
}
function copyEmail(btn){
  var email='tegumclarence@gmail.com';
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(email).then(function(){showToast('Email copied: '+email);},function(){showToast(email);});
  } else { showToast(email); }
}
function downloadCV(){
  var cv=[
"TEGUM CLARENCE ATIM",
"Data Scientist | Machine Learning & Generative AI on AWS | MLOps | DevOps",
"Douala, Cameroon | Open to remote and international roles (no sponsorship required)",
"LinkedIn: https://www.linkedin.com/in/tegum-clarence-atim",
"GitHub: https://github.com/ClarenceAtim",
"Email (jobs): tegumclarence@gmail.com",
"",
"SUMMARY",
"Data Scientist with 5+ years across machine learning, generative AI and cloud engineering on AWS",
"(SageMaker, Bedrock, EC2). Builds and deploys ML systems end to end: model training, FastAPI services,",
"Docker, CI/CD and MLOps monitoring. 4+ years of DevOps: Docker, Kubernetes, Terraform, GitHub Actions.",
"Cofounder & Technical Lead at SIDEKOM (websites, automation, SEO).",
"",
"TOP SKILLS",
"Machine Learning, Generative AI, MLOps, DevOps, Python (LinkedIn Top 5) | AWS, CI/CD, Docker,",
"Kubernetes, Terraform, FastAPI, RAG, Amazon Bedrock, SageMaker, MLflow, Data Analysis, Statistics, NLP",
"",
"FLAGSHIP PROJECT — MOBILE MONEY FRAUD DETECTION API (LIVE)",
"Live API: https://momo-fraud-detection-2wt5.onrender.com/docs",
"GitHub: https://github.com/ClarenceAtim/Momo-Fraud-detection",
"RandomForest on PaySim (100,000 transactions, 0.116% fraud). Precision 0.85, Recall 0.47, F1 0.60,",
"ROC-AUC 0.965. FastAPI + Docker, tests in CI (GitHub Actions) on every push.",
"",
"NEXT PROJECTS",
"- CV-to-Job-Description Matcher (embeddings, FastAPI, Docker) — in build",
"- DevOps pipeline upgrade for the fraud API: gated deploys, Docker Compose, Kubernetes, Terraform",
"",
"EXPERIENCE",
"- Data Scientist, Security AI — America Cyber Squad: ML & GenAI on AWS, vulnerability prioritisation, RAG on Bedrock",
"- Cofounder & Technical Lead — SIDEKOM: client/business websites, automation, technical SEO (sidekom.com)",
"- Background: Cloud, DevOps & Web Engineering (AWS, Linux, Docker, EC2)",
"",
"Note: For job applications, a tailored version of this CV is prepared for each role."
  ].join("\n");
  var blob=new Blob([cv],{type:'text/plain'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='Tegum-Clarence-Atim-CV.txt';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){URL.revokeObjectURL(a.href)},2000);
  showToast('CV downloaded');
}
