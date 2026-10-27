import { Link } from 'react-router-dom';
import { ConsultBanner } from '../../components/ConsultBanner';
import { Eyebrow } from '../../components/Eyebrow';
import { PageHero } from '../../components/PageHero';
import { courseCatalog } from './data';

const certificationFacts = [
  {
    number: '01',
    title: '多種專業認證項目',
    description: 'CIP 公布的項目涵蓋品牌策劃管理、行銷、企業管理及其他專業領域，申請時需確認正式項目名稱。',
  },
  {
    number: '02',
    title: '依資格申請適合等級',
    description: '官方列有初級、中級與高級申報條件；學歷、相關工作經驗及既有資格會影響可申請等級。',
  },
  {
    number: '03',
    title: '通過考核後查詢證書',
    description: '考試方式依認證項目而定。通過相應考核並完成申請程序後，可使用官方證書查詢服務核對資料。',
  },
];

const pathSteps = [
  ['01 / CHOOSE', '確認認證項目', '依職業背景選擇官方公布的專業項目與申請等級。'],
  ['02 / CHECK', '檢查申報條件', '確認學歷、工作年資與該項目需要的申請資料。'],
  ['03 / PREPARE', '參與培訓準備', '依專業領域整理實務成果與考核需要的知識。'],
  ['04 / APPLY', '完成考核申請', '依官方程序報名、考核，合格後查詢證書資訊。'],
];

export function CipPage() {
  return (
    <>
      <PageHero
        className="page-hero--cip"
        eyebrow="CIP · 國際職業認證培訓"
        title={<>CIP 國際職業認證<br /><em>培訓與申請諮詢</em></>}
        description="杉鼎森為 CIP 授權培訓中心，協助專業人士了解認證項目、申報條件與準備方向，並提供品牌與數位工具相關培訓。"
        index="03"
      />

      <section className="cip-intro container" data-reveal>
        <div className="cip-intro__label"><Eyebrow>ABOUT CIP</Eyebrow><span className="cip-intro__symbol" aria-hidden="true">✳</span></div>
        <div>
          <h2>什麼是 CIP 國際職業認證？</h2>
          <p>CIP 國際職業認證管理協會提供多類職業項目的認證。專業人士可依自身經驗與目標項目確認申報資格，再按該項目的考核方式準備。培訓課程本身不等於取得證書，核發結果以官方審核與考試為準。</p>
        </div>
      </section>

      <section className="cip-facts container" aria-labelledby="cip-facts-title">
        <div className="section-heading" data-reveal>
          <Eyebrow showDot>CERTIFICATION ESSENTIALS</Eyebrow>
          <h2 id="cip-facts-title">專業人士要知道的 CIP 重點</h2>
          <p>一張可查詢的職業認證，能讓專業背景更容易被核對；適合的項目與等級仍需依官方標準判定。</p>
        </div>
        <div className="cip-facts__grid">
          {certificationFacts.map((fact) => <article className="cip-fact" data-reveal key={fact.number}><span>{fact.number}</span><h3>{fact.title}</h3><p>{fact.description}</p></article>)}
        </div>
        <p className="cip-facts__sources">資料來源：<a href="https://www.twcip.org/aboutlist.php?id=9" target="_blank" rel="noopener noreferrer">CIP 認證項目 ↗</a>、<a href="https://www.twcip.org/authenticate_list.php?id=3" target="_blank" rel="noopener noreferrer">申報條件 ↗</a>、<a href="https://www.twcip.org/authenticate_list.php?id=5" target="_blank" rel="noopener noreferrer">考試方式 ↗</a></p>
      </section>

      <section className="cip-reviewer container" aria-labelledby="reviewer-title" data-reveal>
        <div><Eyebrow>OUR REVIEW DIRECTOR</Eyebrow><h2 id="reviewer-title">評審主任｜徐家芸（Angel）</h2><p>徐家芸同時列於 CIP 官方評審團隊名錄，具企業經營與跨領域組織經驗。課程規劃與認證細節將依核定項目公布。</p></div>
        <a href="https://www.twcip.org/imgslist_cap.php?c_id=1" target="_blank" rel="noopener noreferrer">查看 CIP 官方評審名錄 ↗</a>
      </section>

      <section className="path-section container" aria-labelledby="path-title">
        <div className="section-heading" data-reveal><Eyebrow>FROM INTEREST TO APPLICATION</Eyebrow><h2 id="path-title">從選擇項目到認證申請</h2><p>先確認自己的專業領域與資格，再依官方要求準備資料與考核。</p></div>
        <div className="path-grid">{pathSteps.map(([label, title, description]) => <article data-reveal key={label}><span>{label}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="course-section">
        <div className="container">
          <div className="section-heading" data-reveal><Eyebrow>TRAINING OPTIONS</Eyebrow><h2>培訓與認證準備方向</h2><p>從認證說明到品牌與數位工具實作，選擇想了解的方向並留下聯絡資料。開課時間、時數與可銜接的證照項目由我們確認後提供。</p></div>
          <div className="course-grid">
            {Object.values(courseCatalog).map((course, index) => (
              <Link className="course-card" to={`/register?course=${course.id}`} data-reveal key={course.id}>
                <div className="course-card__top"><span>0{index + 1} / TRAINING</span><span aria-hidden="true">↗</span></div>
                <span className={`course-card__level${course.id === 'advanced' ? ' course-card__level--dark' : ''}`}>{course.level}</span>
                <h3>{course.title}</h3><p>{course.description}</p>
                <div className="course-card__meta"><div><span>課程時數</span><strong>{course.hoursLabel}</strong></div><div><span>培訓重點</span><strong>{course.focus}</strong></div><div><span>適合對象</span><strong>{course.audience}</strong></div></div>
                <div className="course-card__bottom"><span className="course-card__button">{course.actionLabel}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ConsultBanner eyebrow="FOR TEAMS & ORGANIZATIONS" title="企業內訓與 CIP 認證諮詢" description="告訴我們團隊的專業領域與目標，我們協助確認培訓方向及可申請的認證項目。" />
    </>
  );
}
