import { Eyebrow } from '../../components/Eyebrow';
import { PageHero } from '../../components/PageHero';

const team = [
  ['01', 'FOUNDER / STRATEGY', '創辦人', '品牌方向、需求梳理與整體專案規劃。'],
  ['02', 'UI / FRONTEND', 'UI 與前端工程師', '介面設計、互動體驗與響應式網站實作。'],
  ['03', 'BACKEND / SYSTEMS', '後端工程師', '資料架構、系統邏輯與穩定的服務整合。'],
  ['04', 'ROBOTICS / AUTOMATION', '機器人系統工程師', '機器人流程、自動化串接與系統應用。'],
];

const offices = [
  {
    city: '高雄辦公室',
    english: 'KAOHSIUNG',
    title: '高雄辦公室地圖：高雄市鹽埕區新樂街214號2樓',
    address: '80341 高雄市鹽埕區中山里新樂街214號2樓',
    query: '高雄市鹽埕區新樂街214號2樓',
  },
  {
    city: '桃園辦公室',
    english: 'TAOYUAN',
    title: '桃園辦公室地圖：桃園市桃園區中正路1249號21樓',
    address: '330 桃園市桃園區中正路1249號21樓',
    query: '桃園市桃園區中正路1249號21樓',
  },
];

export function AboutPage() {
  return (
    <>
      <PageHero className="about-hero" eyebrow="ABOUT SHAN DING SEN · 關於我們" title={<>森林之序，<br /><em>鼎鑄為本。</em></>} description="杉鼎森相信，好的數位工程應該像一座穩固的建築：架構清楚、細節可靠，也能隨著使用者的需要持續生長。" index="04" />
      <section className="about-feature container" data-reveal><div className="about-feature__visual"><img src="/assets/brand-logo.png" alt="杉鼎森森林與電路結合的品牌標誌" width="720" height="645" loading="lazy" /><span>ROOTED IN NATURE<br />ENGINEERED FOR PEOPLE</span></div><div><Eyebrow>OUR PHILOSOPHY</Eyebrow><h2>讓技術擁有溫度，<br />讓每個細節有依據。</h2><p>我們從問題出發，把品牌設計、前後端開發與自動化系統放進同一個思考框架。畫面要清楚，流程要順暢，背後的工程也要經得起日常使用。</p><p>「杉」是自然與成長，「鼎」是穩定的結構，「森」是多個專業彼此連結。這些意象也構成我們做事的方式。</p></div></section>
      <section className="team-section"><div className="container"><div className="section-heading" data-reveal><Eyebrow>THE PEOPLE BEHIND THE WORK</Eyebrow><h2>專注於把事情做好的團隊</h2><p>團隊成員照片與姓名目前保留欄位，正式資料到位後即可替換。</p></div><div className="team-grid">{team.map(([number, role, name, description]) => <article className="team-card" data-reveal key={number}><div className="team-card__portrait"><span aria-hidden="true">{number}</span><small>PORTRAIT COMING SOON</small></div><div><span>{role}</span><h3>{name}</h3><p>{description}</p></div></article>)}</div></div></section>
      <section className="contact-section container" id="contact" aria-labelledby="contact-title"><div className="contact-section__main" data-reveal><Eyebrow showDot>CONTACT US</Eyebrow><h2 id="contact-title">與杉鼎森展開<br />下一段對話。</h2><p>想討論專案、課程或合作方式？選擇方便的方式與我們聯絡。</p><a className="button button--dark" href="mailto:contact@shandingsen.com?subject=%E6%9D%89%E9%BC%8E%E6%A3%AE%E5%B0%88%E6%A1%88%E8%AB%AE%E8%A9%A2">寄送電子郵件 <span aria-hidden="true">↗</span></a><div className="contact-details"><div><span aria-hidden="true">◌</span><p><small>LINE 官方帳號</small><strong>申請中，開通後公布</strong></p></div><div><span aria-hidden="true">☎</span><p><small>專案聯絡電話</small><a href="tel:+886227988980">02-2798-8980</a></p></div><div><span aria-hidden="true">✉</span><p><small>工程與商務信箱</small><a href="mailto:contact@shandingsen.com">contact@shandingsen.com</a></p></div></div></div><aside className="line-card" data-reveal><span className="line-card__badge">LINE 官方帳號申請中</span><div className="line-card__qr line-card__qr--pending" aria-hidden="true"><span>LINE</span></div><strong>新的 LINE 帳號即將上線</strong><small>QR Code 與加好友連結會在開通後置入</small><span className="line-card__button line-card__button--pending">敬請期待</span></aside></section>
      <section className="office-section" aria-labelledby="office-title"><div className="container"><div className="section-heading" data-reveal><Eyebrow>OUR OFFICES</Eyebrow><h2 id="office-title">辦公室位置</h2><p>高雄與桃園兩處辦公室，歡迎事先聯絡安排會面。</p></div><div className="office-grid">{offices.map((office) => { const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.query)}`; const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(office.query)}&output=embed`; return <article className="office-card" data-reveal key={office.city}><div className="office-card__top"><span>⌖ {office.city}</span><span>{office.english}</span></div><iframe title={office.title} src={embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="office-card__bottom"><address>{office.address}</address><a href={mapUrl} target="_blank" rel="noopener noreferrer">開啟地圖 ↗</a></div></article>; })}</div></div></section>
    </>
  );
}
