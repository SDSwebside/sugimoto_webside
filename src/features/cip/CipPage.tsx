import { Link } from 'react-router-dom';
import { ConsultBanner } from '../../components/ConsultBanner';
import { Eyebrow } from '../../components/Eyebrow';
import { PageHero } from '../../components/PageHero';
import { courseCatalog } from './data';

const pathSteps = [
  ['01 / FOUNDATION', '定位與架構', '梳理目標受眾、核心價值與品牌敘事。'],
  ['02 / CONTENT', '內容與形象', '建立一致的視覺、內容主題與溝通方式。'],
  ['03 / AUTOMATION', '數位工具應用', '用網站、AI 與 LINE 串起穩定的互動流程。'],
  ['04 / LAUNCH', '上線與經營', '持續觀察回應，調整內容與成長節奏。'],
];

export function CipPage() {
  return (
    <>
      <PageHero className="page-hero--cip" eyebrow="CIP · INTERNATIONAL PROFESSIONAL CERTIFICATION" title={<>讓你的專業，<br /><em>長成有辨識度的 IP。</em></>} description="CIP 國際職業認證與個人／企業 IP 培訓規劃，陪你從定位、內容、工具到上線，一步步建立自己的影響力。" index="03" />
      <section className="cip-intro container" data-reveal><div className="cip-intro__label"><Eyebrow>ABOUT CIP</Eyebrow><span className="cip-intro__symbol" aria-hidden="true">✳</span></div><div><h2>從專業認證出發，<br />把能力轉化成長期資產。</h2><p>課程以「定位、內容、數位工具、營運」為主軸，為個人與企業提供可循序實作的路徑。關於認證機構、授證條件與課程細節，正式上線前請以主辦單位公布資訊為準。</p></div></section>
      <section className="path-section container" aria-labelledby="path-title"><div className="section-heading" data-reveal><Eyebrow>FROM IDEA TO LAUNCH</Eyebrow><h2 id="path-title">個人／企業 IP，從打造到上線</h2><p>把抽象的專業優勢，整理成可以被看見、被理解、被持續經營的品牌體驗。</p></div><div className="path-grid">{pathSteps.map(([label, title, description]) => <article data-reveal key={label}><span>{label}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      <section className="course-section"><div className="container"><div className="section-heading" data-reveal><Eyebrow>LEARNING PATH</Eyebrow><h2>四大進階課程體系</h2><p>從研習會到高階實作，每張卡片都能進入對應的報名意向頁。正式開課資訊請以主辦單位公告為準。</p></div><div className="course-grid">{Object.values(courseCatalog).map((course) => <Link className="course-card" to={`/register?course=${course.id}`} data-reveal key={course.id}><div className="course-card__top"><span>{course.id === 'seminar' ? '01 / DISCOVER' : course.id === 'beginner' ? '02 / FOUNDATION' : course.id === 'intermediate' ? '03 / BUILD' : '04 / SCALE'}</span><span aria-hidden="true">↗</span></div><span className={`course-card__level${course.id === 'advanced' ? ' course-card__level--dark' : ''}`}>{course.level}</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-card__meta"><div><span>{course.id === 'seminar' ? '研習時數' : '課程時數'}</span><strong>{course.hoursLabel}</strong></div><div><span>授課模式</span><strong>{course.mode}</strong></div><div><span>適合對象</span><strong>{course.audience}</strong></div><div><span>證書加簽</span><strong>{course.certificate}</strong></div></div><div className="course-card__bottom"><span className="course-card__button">{course.actionLabel}</span></div></Link>)}</div></div></section>
      <ConsultBanner eyebrow="FOR TEAMS & ORGANIZATIONS" title="需要企業內訓或專屬規劃？" description="我們可以依團隊現況與目標，討論合適的學習形式與梯次安排。" />
    </>
  );
}
