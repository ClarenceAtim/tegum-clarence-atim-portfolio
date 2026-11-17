/* Blog posts — Tegum Clarence Atim's own tutorials, carried over from the
   previous portfolio (Nov 2026). Do not edit the post text here without
   checking it against the original. */
var POSTS = [
{
  id:"fastapi-docker", pub:"11 Nov 2026", cat:"Tutorials", tags:["FastAPI","Docker","Python","MLOps"], date:"Tutorial", mins:"8 min read",
  title:"How to Deploy a FastAPI ML Model with Docker in 7 Steps",
  excerpt:"The exact step-by-step I used to ship the Mobile Money fraud API — from a trained model on my laptop to a live API anyone can call.",
  body:"<p>This is the deployment path behind my live fraud detection API. If you have a trained model and a FastAPI app, you can be live in under an hour.</p><h2>What you need</h2><ul><li>Python 3.11+ and your trained model file</li><li>Docker installed and running</li><li>A GitHub account and a container hosting account</li><li>Your FastAPI app with <code>/health</code> and <code>/predict</code> endpoints</li></ul><h2>Steps</h2><ol><li><strong>Step 1 — Add a health endpoint.</strong> Add <code>GET /health</code> returning <code>{\"status\":\"ok\"}</code>. You should see it return 200 locally. Common mistake: skipping this — deploy platforms and Kubernetes probes need it.</li><li><strong>Step 2 — Pin your dependencies.</strong> Run <code>pip freeze &gt; requirements.txt</code>. You should see exact versions, not loose ranges.</li><li><strong>Step 3 — Write the Dockerfile.</strong> Start from <code>python:3.11-slim</code>, copy requirements, install, copy your app, and run uvicorn on port 8000.</li><li><strong>Step 4 — Build locally.</strong> Run <code>docker build -t fraud-api .</code> — you should see the image listed in <code>docker images</code>.</li><li><strong>Step 5 — Run and test the container.</strong> Run <code>docker run -p 8000:8000 fraud-api</code>, then open <code>localhost:8000/docs</code> and call <code>/predict</code> from the Swagger UI. If you see an error about the container name already being in use, that just means an old container is still there — remove it and run again.</li><li><strong>Step 6 — Push to GitHub.</strong> Commit the Dockerfile with your code. Your tests should run in CI on the push.</li><li><strong>Step 7 — Deploy it.</strong> Create a web service from the repo on your hosting platform, choose Docker, and wait for the first build. You should get a public URL for your API.</li></ol><h2>How to check it worked</h2><ul><li>Open your live API URL with <code>/docs</code> at the end — the Swagger page loads</li><li>Call <code>/health</code> — it returns ok</li><li>Send a sample transaction to <code>/predict</code> — you get a fraud score back</li></ul><h2>What I learned</h2><p>A model in a notebook helps nobody. The Docker step is what turned my fraud model into something a recruiter can actually click — and that live link is now the first thing on my LinkedIn Featured section.</p>"
},
{
  id:"cicd", pub:"10 Nov 2026", cat:"DevOps", tags:["CI/CD","DevOps","Docker","Python"], date:"Tutorial", mins:"7 min read",
  title:"How to Set Up GitHub Actions CI/CD for a Python Project, Step by Step",
  excerpt:"Build, test, then deploy only if green. The pipeline pattern I am adding to the fraud API so a failing push can never reach production.",
  body:"<p>Right now, many free deploy setups redeploy on every push — even if your tests fail. Proper CI/CD fixes that: deployment becomes a reward for green tests, not an accident of pushing.</p><h2>What you need</h2><ul><li>A Python project on GitHub with tests (pytest)</li><li>A <code>requirements.txt</code></li><li>10 minutes</li></ul><h2>Steps</h2><ol><li><strong>Step 1 — Create the workflow file.</strong> Add <code>.github/workflows/ci.yml</code> to your repo.</li><li><strong>Step 2 — Trigger on push and pull requests.</strong> Set <code>on: [push, pull_request]</code> so every change is checked.</li><li><strong>Step 3 — Set up Python.</strong> Use <code>actions/setup-python</code> with the same version you run locally.</li><li><strong>Step 4 — Install and test.</strong> Install requirements, then run <code>pytest</code>. You should see the job go green in the Actions tab.</li><li><strong>Step 5 — Build the Docker image.</strong> Add a build step after tests pass, so a broken image is caught in CI, not in production.</li><li><strong>Step 6 — Gate the deploy.</strong> Make the deploy job depend on the test job with <code>needs: test</code>. If tests fail, deployment never starts.</li></ol><h2>Troubleshooting</h2><ul><li><strong>Workflow never runs:</strong> check the file is under <code>.github/workflows/</code> and the YAML indentation is valid</li><li><strong>Tests pass locally, fail in CI:</strong> you probably forgot a dependency in <code>requirements.txt</code></li><li><strong>Deploy ran despite failing tests:</strong> the deploy job is missing <code>needs:</code></li></ul><h2>What I learned</h2><p>CI is not paperwork — it is the difference between &lsquo;I deployed a model&rsquo; and &lsquo;I run a reliable ML service&rsquo;. That difference is exactly what MLOps and DevOps recruiters screen for.</p>"
},
{
  id:"rag-bedrock", pub:"9 Nov 2026", cat:"AWS & Cloud", tags:["RAG","Generative AI","AWS","Python"], date:"Tutorial", mins:"9 min read",
  title:"How to Build a RAG App with Amazon Bedrock, Step by Step",
  excerpt:"Chunking, embeddings, retrieval and evaluation — the production RAG pattern, broken into steps you can follow and check at each stage.",
  body:"<p>RAG (retrieval-augmented generation) lets a language model answer from your documents instead of guessing. Here is the build order that works in production.</p><h2>What you need</h2><ul><li>An AWS account with Bedrock model access enabled</li><li>Your source documents (PDFs or text)</li><li>Python with boto3</li><li>A vector store — FAISS locally, or OpenSearch / Pinecone in production</li></ul><h2>Steps</h2><ol><li><strong>Step 1 — Load and clean your documents.</strong> Extract plain text and strip headers, footers and page numbers. Messy input means messy answers.</li><li><strong>Step 2 — Chunk the text.</strong> Split into overlapping chunks of roughly 500–1,000 characters. You should be able to read any single chunk and understand it on its own.</li><li><strong>Step 3 — Embed the chunks.</strong> Send each chunk to a Bedrock embedding model and store the vectors with their source text.</li><li><strong>Step 4 — Retrieve before you generate.</strong> Embed the user question the same way, and fetch the top 3–5 most similar chunks.</li><li><strong>Step 5 — Build the prompt.</strong> Put the retrieved chunks in the prompt as context, and instruct the model to answer only from that context and say so when the answer is not there.</li><li><strong>Step 6 — Evaluate.</strong> Keep 20 real questions with known answers. Check retrieval first (did the right chunk come back?), then the final answer.</li></ol><h2>Common mistakes</h2><ul><li>Chunks so large the model drowns in irrelevant text</li><li>No overlap between chunks, so answers split across a boundary get lost</li><li>Evaluating only the final answer, never the retrieval step</li></ul><h2>What I learned</h2><p>Most RAG failures are retrieval failures, not model failures. Fix the chunks and the search first — the model is usually fine.</p>"
},
{
  id:"fraud-model", pub:"8 Nov 2026", cat:"Machine Learning", tags:["Machine Learning","Python","MLOps","FastAPI"], date:"Project log", mins:"6 min read",
  title:"Training a Fraud Model When Only 0.116% of Your Data Is Fraud",
  excerpt:"116 fraud cases in 100,000 transactions. How I trained the Mobile Money model, why Precision 0.85 / Recall 0.47 is an honest result, and what I would improve next.",
  body:"<p>The PaySim dataset behind my fraud API starts with a hard truth: in the first 100,000 transactions, only 116 are fraud — 0.116%. A model that predicts &lsquo;not fraud&rsquo; for everything is 99.88% accurate and completely useless.</p><h2>What actually matters</h2><ul><li><strong>Precision 0.85</strong> — when the model flags fraud, it is right 85% of the time. False alarms stay low, so investigators trust it</li><li><strong>Recall 0.47</strong> — it catches about half of all fraud. Honest, not magic — and the number I most want to improve</li><li><strong>ROC-AUC 0.965</strong> — overall, the model ranks a fraud transaction above a normal one 96.5% of the time</li><li><strong>F1 0.60</strong> — the balance of the two</li></ul><h2>How I got there, step by step</h2><ol><li>Explored the imbalance first — counted fraud vs. normal before touching a model</li><li>Engineered features from transaction type, amounts and balance changes</li><li>Split train/test keeping the fraud ratio in both</li><li>Trained a RandomForest and read the confusion matrix, not just accuracy</li><li>Tuned the decision threshold by trading precision against recall deliberately</li></ol><h2>What is next</h2><ul><li>Try XGBoost and compare recall at the same precision</li><li>Add drift monitoring — fraud patterns change, models must be watched</li><li>Log live predictions from the API to build a feedback loop</li></ul><p>Full code and the live API are on the Projects section of this page.</p>"
},
{
  id:"cv-matcher-plan", pub:"11 Nov 2026", cat:"MLOps", tags:["MLOps","Machine Learning","FastAPI","Python"], date:"Build plan", mins:"5 min read",
  title:"Next Build: A CV-to-Job Matcher That Recruiters Can Actually Use",
  excerpt:"The plan for my next project — paste a CV and a job description, get a match score plus matched and missing skills. Built with embeddings, FastAPI and Docker.",
  body:"<p>My next project is a tool for the people on the other side of my own job search: recruiters. Paste in a CV and a job description, and get back a clear, explainable match.</p><h2>What it will do</h2><ul><li>Return a match score for the CV against the job description</li><li>List the skills that match — with evidence from the CV text</li><li>List the skills that are missing — so a candidate knows what to learn, not just that they scored low</li></ul><h2>Build steps</h2><ol><li>Parse both documents into clean text</li><li>Embed both with the same embedding model</li><li>Score overall similarity, then match skill-by-skill for the explanation</li><li>Serve it with FastAPI, containerise with Docker</li><li>Deploy it live, with tests in CI — the same proven path as the fraud API</li><li>Add it to LinkedIn Featured, this portfolio, and my CV</li></ol><h2>Why this project</h2><p>It proves three things at once: NLP and embeddings in practice, a product a non-technical user can understand in ten seconds, and the full MLOps loop — build, test, deploy, showcase — repeated a second time.</p>"
},
{
  id:"mlflow-monitoring", pub:"7 Nov 2026", cat:"MLOps", tags:["MLOps","Python","Docker","Machine Learning"], date:"Guide", mins:"6 min read",
  title:"How to Monitor an ML Model with MLflow, Step by Step",
  excerpt:"Tracking experiments is step one. Watching a live model for drift is where MLOps earns its name — here is the beginner-friendly path.",
  body:"<p>Deploying a model is the halfway point. After that you need to know two things: which experiment produced this model, and whether the live data still looks like the training data.</p><h2>What you need</h2><ul><li>A Python training script</li><li>MLflow installed (<code>pip install mlflow</code>)</li><li>A place to keep the tracking data — a local file is fine to start</li></ul><h2>Steps</h2><ol><li><strong>Step 1 — Start the tracking server.</strong> Run <code>mlflow ui</code> and open the local dashboard. You should see an empty experiment list.</li><li><strong>Step 2 — Log parameters.</strong> In your training script, log the settings that matter — model type, max depth, threshold.</li><li><strong>Step 3 — Log metrics.</strong> Log precision, recall and ROC-AUC for every run, so runs are comparable at a glance.</li><li><strong>Step 4 — Log the model itself.</strong> Save the trained model as an MLflow artifact, tagged with the data version it trained on.</li><li><strong>Step 5 — Register the best model.</strong> Promote the winning run to the model registry — that is the version your API should load.</li><li><strong>Step 6 — Watch for drift.</strong> Periodically compare live prediction inputs against training distributions. A shift in amounts or transaction types is your early warning to retrain.</li></ol><h2>What I learned</h2><p>Keep the MLflow database file out of your public repo — add it to <code>.gitignore</code>. Tracking belongs in your process, not in your Git history.</p>"
}
];

/* Render the post grid (blog page). */
function renderBlog(filter){
  var grid=document.getElementById('blogGrid');
  if(!grid) return;
  grid.innerHTML='';
  POSTS.filter(function(p){return filter==='all'||p.cat===filter;}).forEach(function(p){
    var a=document.createElement('a');
    a.className='post';
    a.href='#'+p.id;
    a.setAttribute('data-post',p.id);
    a.innerHTML='<span class="cat">'+p.cat+'</span><h3>'+p.title+'</h3><p>'+p.excerpt+'</p><div class="tagrow" style="margin-bottom:12px">'+p.tags.map(function(t){return '<span class="tag">'+t+'</span>';}).join('')+'</div><footer><span>'+p.pub+' · '+p.date+'</span><span>'+p.mins+' →</span></footer>';
    grid.appendChild(a);
  });
  if(!grid.children.length){ grid.innerHTML='<p style="color:var(--muted)">No posts in this category yet.</p>'; }
}

function openPost(id){
  var p=null;
  POSTS.forEach(function(x){if(x.id===id)p=x;});
  if(!p)return false;
  document.getElementById('readerBody').innerHTML=
    '<span class="cat">'+p.cat+'</span>'+
    '<h1>'+p.title+'</h1>'+
    '<p class="meta-line">By Tegum Clarence Atim · Published '+p.pub+' · '+p.date+' · '+p.mins+' · Tags: '+p.tags.join(', ')+'</p>'+
    p.body+
    '<h2>Discuss this post</h2><p>The short version of posts like this goes on LinkedIn daily. <a href="https://www.linkedin.com/in/tegum-clarence-atim" target="_blank" rel="noopener">Join the discussion on LinkedIn ↗</a></p>';
  var r=document.getElementById('reader');
  r.classList.add('open'); r.scrollTop=0; document.body.style.overflow='hidden';
  return true;
}
function closePost(){
  var r=document.getElementById('reader');
  if(r) r.classList.remove('open');
  document.body.style.overflow='';
  if(location.hash){ history.replaceState(null,'',location.pathname); }
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closePost();});

/* Blog page wiring: filters, card clicks, deep links like /blog#fastapi-docker. */
(function(){
  if(!document.getElementById('blogGrid')) return;
  renderBlog('all');
  var filters=document.getElementById('blogFilters');
  if(filters){
    filters.addEventListener('click',function(e){
      if(e.target.tagName!=='BUTTON')return;
      this.querySelectorAll('.chip-btn').forEach(function(c){c.classList.remove('active')});
      e.target.classList.add('active');
      renderBlog(e.target.getAttribute('data-bfilter'));
    });
  }
  document.getElementById('blogGrid').addEventListener('click',function(e){
    var card=e.target.closest('[data-post]');
    if(!card) return;
    e.preventDefault();
    var id=card.getAttribute('data-post');
    if(openPost(id)){ history.replaceState(null,'','#'+id); }
  });
  window.addEventListener('hashchange',function(){
    var id=location.hash.replace('#','');
    if(id && !openPost(id)) closePost();
    if(!id) closePost();
  });
  if(location.hash){
    var id=location.hash.replace('#','');
    openPost(id);
  }
})();
