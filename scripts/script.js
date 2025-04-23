const API_BASE = 'https://script.google.com/macros/s/AKfycbz1covTzylHfsKN3V7d9HldUQQzdldd8Po79hxeedz3RoLqmjy9MUavdr_isthbxIWwHA/exec';


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

  /* — ACTIONS LINKS via JSONP —
  function setupActions() {
    window.handleActions = actions => {
        console.log('ACTIONS RAW:', actions);
      const container = document.getElementById('actions-links');
      actions.forEach(d => {
        const a = document.createElement('a');
        a.href        = d.content || d.url;  // whichever field you meant
        a.textContent = d.name;
        a.classList.add('action-btn');
        a.style.backgroundColor= d.buttonColor;
        container.appendChild(a);
      });
      delete window.handleActions;
    };
    const d = document.createElement('script');
    d.src = `${API_BASE}?section=Actions&callback=handleActions`;
    document.head.appendChild(d);
  }*/
    function setupActions() {
        window.handleActions = actions => {
            const container = document.getElementById('actions-links');
            const modal     = document.getElementById('action-modal');
            const titleEl   = document.getElementById('modal-title');
            const bodyEl    = document.getElementById('modal-body');
            const closeBtn  = document.getElementById('modal-close');
            
            actions.forEach(act => {
            // create the link element
            const a = document.createElement('a');
            a.classList.add('action-btn');
            a.style.backgroundColor= act.buttonColor;
        
            if (act.type === 'link') {
                // a normal external link
                a.href = act.url;
                a.textContent = act.name;
                a.setAttribute('target', '_blank');
            }
            else if (act.type === 'modal') {
                // open the modal on click
                a.href = '#';
                a.textContent = act.name;
                a.addEventListener('click', e => {
                e.preventDefault();
                titleEl.textContent = act.name;
                bodyEl.textContent  = act.content || '';
                modal.showModal();
                });
            }
            else {
                // fallback: just show the name
                a.href = '#';
                a.textContent = act.name;
            }
        
            container.appendChild(a);
            });
        
            // only need to wire this once:
            closeBtn.addEventListener('click', () => modal.close());
        
            delete window.handleActions;
        };
        
        const script = document.createElement('script');
        script.src = `${API_BASE}?section=Actions&callback=handleActions`;
        document.head.appendChild(script);
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
    setupActions();
    setupPosts();
    // Your Instagram embed block can go into the HTML directly.
  });