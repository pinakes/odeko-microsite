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

      setupHours(cfg);
    };
    // 2) Inject the JSONP <script>
    const s = document.createElement('script');
    s.src = `${API_BASE}?section=Config&callback=handleConfig`;
    document.head.appendChild(s);
  }
  function setupHours(cfg) {
    const now = new Date();
    // get full day name in café's timezone (NY):
    const todayName = now.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'America/New_York'
    });
    const hoursStr = cfg[todayName];    // e.g. "8:00am - 7:00pm"
    const outEl   = document.getElementById('hours-status');
    if (!hoursStr) {
      outEl.textContent = '';
      return;
    }
  
    const [openStr, closeStr] = hoursStr.split(' - ');
    const openTime  = parseHour(openStr, now);
    const closeTime = parseHour(closeStr, now);
  
    const fmt = t => t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
    if (now >= openTime && now <= closeTime) {
      outEl.textContent = `Open – closes at ${fmt(closeTime)}`;
    }
    else if (now < openTime) {
      outEl.textContent = `Closed – opens at ${fmt(openTime)}`;
    }
    else {
      outEl.textContent = `Closed for today`;
    }
  }
  
  /**  
   * Parse "h:mmam" / "ham" / "h:mmpm" into a Date on the same day as baseDate  
   */
  function parseHour(str, baseDate) {
    const m = str.match(/(\d+):?(\d+)?\s*(am|pm)/i);
    if (!m) return new Date(baseDate);
    let h = parseInt(m[1], 10);
    const min = m[2] ? parseInt(m[2], 10) : 0;
    const period = m[3].toLowerCase();
    if (h === 12) h = (period === 'am' ? 0 : 12);
    else if (period === 'pm') h += 12;
  
    const d = new Date(baseDate);
    d.setHours(h, min, 0, 0);
    return d;
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
  // — ACTIONS LINKS via JSONP —
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