function siteHeader(active){
  const links = [
    ["index.html","Home"],
    ["latest.html","Latest"],
    ["hot.html","Hot"],
    ["confirmed.html","Confirmed"],
    ["potential.html","Potential"],
    ["categories.html","Categories"],
    ["blog.html","Blog"],
    ["guides.html","Guides"],
    ["faq.html","FAQ"],
  ];
  const nav = links.map(([href,label])=>
    `<a href="${href}" class="${active===href?'active':''}">${label}</a>`
  ).join("");
  return `
  <header>
    <div class="wrap header-inner">
      <a class="logo" href="index.html"><span class="dot"></span>CryptoDrop</a>
      <nav class="main-nav">${nav}</nav>
      <div class="header-actions">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="headerSearch" placeholder="Search airdrops..." onkeydown="if(event.key==='Enter'){location.href='search.html?q='+encodeURIComponent(this.value)}">
        </div>
        <a class="icon-btn" href="index.html#faq" title="Notifications">🔔</a>
        <div class="icon-btn burger" id="burger" title="Menu">☰</div>
      </div>
    </div>
  </header>`;
}

function siteFooter(){
  return `
  <footer>
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="index.html"><span class="dot"></span>CryptoDrop</a>
          <p>Free crypto airdrop aggregator. We don't run the listed airdrops — always do your own research before connecting a wallet.</p>
          <div class="social-row">
            <div class="icon-btn">X</div>
            <div class="icon-btn">TG</div>
            <div class="icon-btn">DC</div>
          </div>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="latest.html">Latest Airdrops</a></li>
            <li><a href="hot.html">Hot Airdrops</a></li>
            <li><a href="confirmed.html">Confirmed Airdrops</a></li>
            <li><a href="potential.html">Potential Airdrops</a></li>
            <li><a href="categories.html">Categories</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="guides.html">Guides</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="search.html">Search</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="contact.html">Submit Airdrop</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="privacy.html">Privacy</a></li>
            <li><a href="terms.html">Terms</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 CryptoDrop. Not financial advice.</span>
        <span>Built for research &amp; educational purposes.</span>
      </div>
    </div>
  </footer>`;
}

function mountLayout(active){
  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if(h) h.outerHTML = siteHeader(active);
  if(f) f.outerHTML = siteFooter();
  setupBurgerGlobal();
}

function setupBurgerGlobal(){
  const burger = document.getElementById("burger");
  const nav = document.querySelector("nav.main-nav");
  if(!burger || !nav) return;
  burger.addEventListener("click", ()=>{
    const isOpen = nav.style.display === "flex";
    nav.style.display = isOpen ? "none" : "flex";
    nav.style.position = "absolute";
    nav.style.top = "64px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.flexDirection = "column";
    nav.style.background = "var(--bg-alt)";
    nav.style.padding = "12px 20px";
    nav.style.borderBottom = "1px solid var(--border)";
    nav.style.zIndex = "50";
  });
}
