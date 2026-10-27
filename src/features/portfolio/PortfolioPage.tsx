import { ConsultBanner } from '../../components/ConsultBanner';
import { Eyebrow } from '../../components/Eyebrow';
import { PageHero } from '../../components/PageHero';
import { portfolioProjects } from './data';

export function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="SELECTED WORKS · 作品介紹"
        title={<>網站與系統<br /><em>開發案例</em></>}
        description="查看我們的品牌網站、企業管理系統、LINE AI 與資料儀表板案例，了解各類專案的功能與設計方式。"
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
        title="需要規劃網站或企業系統？"
        description="告訴我們目前的工作流程與目標，我們可以討論網站開發、系統重構或 LINE AI 整合的做法。"
      />
    </>
  );
}
