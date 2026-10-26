import { Link } from 'react-router-dom';
import { Eyebrow } from './Eyebrow';

const footerLinks = [
  { to: '/portfolio', label: '作品介紹' },
  { to: '/services', label: '服務項目' },
  { to: '/cip', label: 'CIP 課程' },
  { to: '/about', label: '關於我們' },
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
          <strong>杉鼎森數位工程有限公司<br /><small>Shan Ding Sen Digital Technology Co., Ltd.</small></strong>
          <span>© {new Date().getFullYear()} Shan Ding Sen Digital Technology Co., Ltd.</span>
        </div>
      </div>
    </footer>
  );
}
