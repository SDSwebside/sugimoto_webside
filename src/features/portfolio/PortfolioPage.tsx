import { ConsultBanner } from '../../components/ConsultBanner';
import { Eyebrow } from '../../components/Eyebrow';
import { PageHero } from '../../components/PageHero';
import { portfolioProjects } from './data';

export function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="SELECTED WORKS · 作品介紹"
        title={<>讓每一個作品，<br /><em>成為有用的數位體驗。</em></>}
        description="從品牌網站到企業內部系統，以清楚的架構與細膩的使用體驗，解決真實世界的問題。"
        index="01"
      />
      <section className="portfolio-list container" aria-label="作品案例">
        {portfolioProjects.map((project) => (
          <article className={`project${project.isReverse ? ' project--reverse' : ''}`} data-reveal key={project.id}>
            <div className="project__image">
              <img src={`/assets/${project.image}`} alt={project.imageAlt} width="512" height="288" loading="lazy" />
              <span>{project.category}</span>
            </div>
            <div className="project__content">
              <Eyebrow showDot>{project.eyebrow}</Eyebrow>
              <h2>{project.title.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h2>
              <p>{project.description}</p>
              <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="project__note"><strong>{project.noteTitle}</strong><small>{project.noteDescription}</small></div>
            </div>
          </article>
        ))}
      </section>
      <ConsultBanner
        eyebrow="即時線上工程諮詢"
        title="準備啟動您的下一個數位架構？"
        description="不論是全新數位平台、既有系統重構，或企業專屬 LINE AI 與 CIP 課程，杉鼎森期待與您討論適合的技術路徑。"
      />
    </>
  );
}
