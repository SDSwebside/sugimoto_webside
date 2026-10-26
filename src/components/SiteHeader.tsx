import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: '首頁', end: true },
  { to: '/portfolio', label: '作品介紹' },
  { to: '/services', label: '服務項目' },
  { to: '/cip', label: 'CIP 課程' },
  { to: '/about', label: '關於我們' },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main">跳到主要內容</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <NavLink className="brand" to="/" aria-label="杉鼎森數位工程首頁" onClick={closeMenu}>
            <span className="brand__mark"><img src="/assets/brand-mark.png" alt="" width="40" height="40" /></span>
            <span className="brand__text"><strong>杉鼎森數位工程</strong><small>SHAN DING SEN DIGITAL TECH</small></span>
          </NavLink>
          <button
            className="menu-toggle"
            type="button"
            aria-label={isMenuOpen ? '關閉選單' : '開啟選單'}
            aria-expanded={isMenuOpen}
            aria-controls="primary-nav"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span /><span />
          </button>
          <nav className={`primary-nav${isMenuOpen ? ' is-open' : ''}`} id="primary-nav" aria-label="主要導覽">
            {links.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} onClick={closeMenu}>
                {({ isActive }) => <>{isActive && <span className="sr-only">目前頁面：</span>}{label}</>}
              </NavLink>
            ))}
          </nav>
          <NavLink className="button button--dark header-cta" to="/about#contact" onClick={closeMenu}>聯絡我們 <span aria-hidden="true">↗</span></NavLink>
        </div>
      </header>
    </>
  );
}
