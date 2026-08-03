function initials(name){return name.slice(0,2).toUpperCase()}

function badgeHtml(status){
  return status.map(s=>{
    const cls = s.toLowerCase()==="confirmed" ? "confirmed" : "";
    return `<span class="badge ${cls}">${s}</span>`;
  }).join("");
}

function cardHtml(a){
  return `
  <div class="card">
    <div class="card-top">
      <div class="card-badges">${badgeHtml(a.status)}</div>
      <div class="heat">🔥 ${a.heat}°</div>
    </div>
    <div class="card-proj">
      <div class="proj-logo">${initials(a.name)}</div>
      <div>
        <b>${a.name}</b>
        <small>${a.chain} · ${a.difficulty}</small>
      </div>
    </div>
    <div class="card-desc">${a.desc}</div>
    <div class="card-meta">
      <div>Reward<br><b>${a.reward}</b></div>
      <div>Time<br><b>${a.time}</b></div>
    </div>
    <div class="card-footer">
      <a href="project.html?slug=${a.slug}" class="btn btn-primary btn-sm">View Guide</a>
      <div class="card-actions">
        <div class="icon-sm" title="Bookmark">☆</div>
        <div class="icon-sm" title="Share">↗</div>
      </div>
    </div>
  </div>`;
}

function renderList(id, items){
  const el = document.getElementById(id);
  if(!el) return;
  el.innerHTML = items.map(cardHtml).join("");
}

function renderTicker(){
  const track = document.getElementById("tickerTrack");
  if(!track) return;
  const items = TICKER.map(t=>`
    <div class="ticker-item">
      <span class="sym">${t.sym}</span>
      <span>${t.price}</span>
      <span class="${t.up?'up':'down'}">${t.chg}</span>
    </div>`).join("");
  track.innerHTML = items + items; // duplicate for seamless loop
}

function renderCategories(){
  const el = document.getElementById("catGrid");
  if(!el) return;
  el.innerHTML = CATEGORIES.map(c=>`
    <a class="cat-card" href="index.html#latest">
      <div class="ic">${c.icon}</div>
      <b>${c.name}</b>
      <span>${c.count} airdrops</span>
    </a>`).join("");
}

function renderBlog(){
  const el = document.getElementById("blogGrid");
  if(!el) return;
  el.innerHTML = BLOG_POSTS.map(p=>`
    <div class="blog-card">
      <div class="blog-thumb"></div>
      <div class="blog-body">
        <span class="blog-tag">${p.tag}</span>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="blog-meta"><span>${p.date}</span><span>${p.read} read</span></div>
      </div>
    </div>`).join("");
}

function renderFaq(){
  const el = document.getElementById("faqList");
  if(!el) return;
  el.innerHTML = FAQS.map((f,i)=>`
    <div class="faq-item">
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">
        ${f.q}
        <span class="chev">⌄</span>
      </div>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>`).join("");
}

function setupFilters(){
  const chips = document.querySelectorAll(".chip");
  chips.forEach(chip=>{
    chip.addEventListener("click", ()=>{
      chips.forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      let items = AIRDROPS;
      if(filter && filter!=="all"){
        items = AIRDROPS.filter(a=>
          a.status.map(s=>s.toLowerCase()).includes(filter) ||
          a.difficulty.toLowerCase()===filter
        );
      }
      renderList("latestGrid", items);
    });
  });
}

function setupNewsletter(){
  document.querySelectorAll(".newsletter form").forEach(form=>{
    form.addEventListener("submit", e=>{
      e.preventDefault();
      const input = form.querySelector("input");
      if(input.value){
        input.value = "";
        input.placeholder = "Thanks, you're subscribed!";
      }
    });
  });
}

function setupBurger(){
  const burger = document.getElementById("burger");
  const nav = document.querySelector("nav.main-nav");
  if(!burger || !nav) return;
  burger.addEventListener("click", ()=>{
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    nav.style.position = "absolute";
    nav.style.top = "64px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.flexDirection = "column";
    nav.style.background = "var(--bg-alt)";
    nav.style.padding = "12px 20px";
    nav.style.borderBottom = "1px solid var(--border)";
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderTicker();
  renderList("latestGrid", AIRDROPS.slice(0,8));
  renderList("hotGrid", [...AIRDROPS].sort((a,b)=>b.heat-a.heat).slice(0,8));
  renderList("confirmedGrid", AIRDROPS.filter(a=>a.status.includes("Confirmed")));
  renderCategories();
  renderBlog();
  renderFaq();
  setupFilters();
  setupNewsletter();
});
