import { Link } from 'react-router-dom';
import { Eyebrow } from './Eyebrow';

const footerLinks = [
  { to: '/portfolio', label: '作品介紹' },
  { to: '/services', label: '服務項目' },
  { to: '/cip', label: 'CIP 課程' },
  { to: '/about', label: '關於我們' },
  { to: '/journal', label: '工程師的心內話' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div><Eyebrow>EXPLORE MORE</Eyebrow><h2>核心導覽入口</h2><p>探索杉鼎森的作品與數位工程服務</p></div>
          <span className="footer-top__aside">SHAN DING SEN<br />DIGITAL ENGINEERING</span>
        </div>
        <nav className="footer-links" aria-label="頁尾導覽">
          {footerLinks.map(({ to, label }, index) => (
            <Link key={to} to={to}><span>0{index + 1}</span>{label} <span aria-hidden="true">↗</span></Link>
          ))}
        </nav>
        <div className="footer-offices">
          <span><strong>高雄辦公室</strong>80341 高雄市鹽埕區中山里新樂街214號2樓</span>
          <span><strong>桃園辦公室</strong>330 桃園市桃園區中正路1249號21樓</span>
        </div>
        <div className="footer-bottom">
          <div className="footer-brand-row">
            <strong>杉鼎森數位工程有限公司<br /><small>Shan Ding Sen Digital Technology Co., Ltd.</small></strong>
            <Link className="footer-admin" to="/admin" aria-label="管理者後台登入" title="管理者後台登入">
              <svg viewBox="0 0 32 32" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13 4 4 16l9 12M13 4l4 4M13 28l4-4" />
                <path d="M28 16H11m0 0 5-5m-5 5 5 5" />
              </svg>
            </Link>
          </div>
          <span>© {new Date().getFullYear()} Shan Ding Sen Digital Technology Co., Ltd.</span>
        </div>
      </div>
    </footer>
  );
}
