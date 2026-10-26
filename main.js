document.documentElement.classList.add('js');

const currentPage = document.body.dataset.page || 'home';
const links = [
  ['home', '首頁', 'index.html'],
  ['portfolio', '作品介紹', 'portfolio.html'],
  ['services', '服務項目', 'services.html'],
  ['cip', 'CIP 課程', 'cip.html'],
  ['about', '關於我們', 'about.html'],
];

const headerHost = document.querySelector('[data-site-header]');
if (headerHost) {
  headerHost.outerHTML = `<header class="site-header"><div class="container site-header__inner">
    <a class="brand" href="index.html" aria-label="杉鼎森數位工程首頁"><span class="brand__mark"><img src="assets/brand-logo.png" alt="" width="44" height="44"></span><span class="brand__text"><strong>杉鼎森數位工程</strong><small>SHAN DING SEN DIGITAL TECH</small></span></a>
    <button class="menu-toggle" type="button" aria-label="開啟選單" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span></button>
    <nav class="primary-nav" id="primary-nav" aria-label="主要導覽">${links.map(([key, label, href]) => `<a href="${href}"${key === currentPage ? ' class="is-current" aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
    <a class="button button--dark header-cta" href="about.html#contact">聯絡我們 <span aria-hidden="true">↗</span></a>
  </div></header>`;
}

const footerHost = document.querySelector('[data-site-footer]');
if (footerHost) {
  footerHost.innerHTML = `<footer class="site-footer"><div class="container"><div class="footer-top"><div><span class="eyebrow">EXPLORE MORE</span><h2>核心導覽入口</h2><p>探索杉鼎森的作品與數位工程服務</p></div><span class="footer-top__aside">SHAN DING SEN<br>DIGITAL ENGINEERING</span></div><nav class="footer-links" aria-label="頁尾導覽">${links.slice(1).map(([, label, href], index) => `<a href="${href}"><span>0${index + 1}</span>${label} <span aria-hidden="true">↗</span></a>`).join('')}</nav><div class="footer-bottom"><strong>杉鼎森數位工程有限公司<br><small>Shan Ding Sen Digital Technology Co., Ltd.</small></strong><span>© <span data-year></span> Shan Ding Sen Digital Technology Co., Ltd.</span></div></div></footer>`;
}

document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
if (menuToggle && primaryNav) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '開啟選單');
    primaryNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    primaryNav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 900) closeMenu(); });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealNodes = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add('is-visible'));
}

const intro = document.getElementById('intro');
const shell = document.getElementById('site-shell');
const stage = document.getElementById('burst-stage');
const burstCards = stage ? [...stage.querySelectorAll('.burst-card')] : [];

function burstFromCenter() {
  if (!stage) return;
  stage.classList.add('burst-stage--bursting');
  const center = document.getElementById('burst-center')?.getBoundingClientRect();
  if (!center) return;
  const originX = center.left + center.width / 2;
  const originY = center.top + center.height / 2;
  if (reducedMotion.matches || !Element.prototype.animate) {
    stage.classList.remove('burst-stage--pending');
    burstCards.forEach((card) => { card.style.opacity = ''; });
    return;
  }
  burstCards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const dx = originX - (rect.left + rect.width / 2);
    const dy = originY - (rect.top + rect.height / 2);
    card.style.opacity = '0';
    const animation = card.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(.2) rotate(${index % 2 ? 10 : -10}deg)`, opacity: 0, filter: 'blur(8px)' },
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1, filter: 'blur(0)' },
    ], { duration: 780, delay: 130 + index * 125, easing: 'cubic-bezier(.18,.8,.22,1)', fill: 'both' });
    animation.onfinish = () => { card.style.opacity = ''; animation.cancel(); };
  });
  stage.classList.remove('burst-stage--pending');
}

if (intro && shell) {
  let hasSeenIntro = false;
  try { hasSeenIntro = sessionStorage.getItem('sds-intro-seen') === '1'; } catch (_) {}
  if (hasSeenIntro) {
    intro.remove();
    shell.inert = false;
    document.body.classList.remove('intro-active');
    stage?.classList.remove('burst-stage--pending');
  } else {
    const enter = () => {
      if (intro.classList.contains('is-leaving')) return;
      intro.classList.add('is-leaving');
      shell.inert = false;
      document.body.classList.remove('intro-active');
      try { sessionStorage.setItem('sds-intro-seen', '1'); } catch (_) {}
      const wait = reducedMotion.matches ? 0 : 570;
      window.setTimeout(() => {
        intro.remove();
        window.setTimeout(burstFromCenter, reducedMotion.matches ? 0 : 620);
      }, wait);
    };
    document.getElementById('enter-site')?.addEventListener('click', enter);
    document.getElementById('enter-site-secondary')?.addEventListener('click', enter);
  }
  document.getElementById('replay-intro')?.addEventListener('click', () => {
    try { sessionStorage.removeItem('sds-intro-seen'); } catch (_) {}
    window.location.reload();
  });
}

const courses = {
  seminar: ['研習會｜認識 CIP 與 IP 打造', '了解認證與個人／企業 IP 的整體路徑。'],
  beginner: ['初階課程｜找到你的專業定位', '建立受眾、優勢與品牌主張的基礎。'],
  intermediate: ['中階課程｜內容與數位工具整合', '從內容策略延伸到網站與自動化工具。'],
  advanced: ['高階課程｜從上線走向長期經營', '規劃協作、流程與持續成長的架構。'],
};
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
  const key = new URLSearchParams(window.location.search).get('course') || 'seminar';
  const course = courses[key] || courses.seminar;
  document.getElementById('selected-course').textContent = course[0];
  document.getElementById('selected-description').textContent = course[1];
  document.title = `${course[0]}｜杉鼎森數位工程`;
  registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(registrationForm);
    const lines = [
      `報名課程：${course[0]}`,
      `姓名：${data.get('name')}`,
      `電子郵件：${data.get('email')}`,
      `電話：${data.get('phone') || '未填寫'}`,
      `補充說明：${data.get('note') || '無'}`,
    ];
    window.location.href = `mailto:contact@shandingsen.com?subject=${encodeURIComponent(`CIP 課程報名意向｜${course[0]}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
}
