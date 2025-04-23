const API_BASE = 'https://script.google.com/macros/s/AKfycbyu9V9hIAGxII7voBTHDL8xnLaWEa60HCfH7Wzvr1_k4Ap280-Ve2KYp5dWMa-VO72X_g/exec';


// — HERO SECTION via JSONP —
function setupHero() {
    // 1) Define the callback
    window.handleConfig = cfg => {
      document.getElementById('hero').style.backgroundImage = `url(${cfg.heroImageUrl})`;
      document.getElementById('logo').src               = cfg.logoUrl;
      document.getElementById('title').textContent      = cfg.siteTitle;
      document.getElementById('subtitle').textContent   = cfg.siteSubtitle;
      delete window.handleConfig;
    };
    // 2) Inject the JSONP <script>
    const s = document.createElement('script');
    s.src = `${API_BASE}?section=Config&callback=handleConfig`;
    document.head.appendChild(s);
  }
  
  // — SOCIAL LINKS via JSONP —
  function setupSocials() {
    window.handleSocials = socials => {
        console.log('SOCIALS RAW:', socials);
      const container = document.getElementById('social-links');
      socials.forEach(s => {
        const a = document.createElement('a');
        a.href = s.url;
        a.innerHTML = `<img src="${s.iconUrl}" alt="${s.name}" width="24">`;
        container.appendChild(a);
      });
      delete window.handleSocials;
    };
    const s = document.createElement('script');
    s.src = `${API_BASE}?section=Socials&callback=handleSocials`;
    document.head.appendChild(s);
  }
  
  // — POSTS / UPDATES via JSONP —
  function setupPosts() {
    window.handlePosts = posts => {
        console.log('POSTS RAW:', posts);
      const container = document.getElementById('posts-container');
      posts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(p => {
          const div = document.createElement('div');
          div.className = 'post';
          div.innerHTML = `
            
            
            <p><span>${new Date(p.date).toLocaleDateString()} - </span>${p.body}</p>
            ${p.url ? `<a class="updates" href="${p.url}">${p.title}` : ''}
          `;
          container.appendChild(div);
        });
      delete window.handlePosts;
    };
    const s = document.createElement('script');
    s.src = `${API_BASE}?section=Posts&callback=handlePosts`;
    document.head.appendChild(s);
  }
  
  // Initialize everything
  document.addEventListener('DOMContentLoaded', () => {
    setupHero();
    setupSocials();
    setupPosts();
    // Your Instagram embed block can go into the HTML directly.
  });