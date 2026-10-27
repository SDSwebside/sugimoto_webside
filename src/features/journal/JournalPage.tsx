import { Link } from 'react-router-dom';
import { Eyebrow } from '../../components/Eyebrow';
import { PageHero } from '../../components/PageHero';

const topics = [
  {
    number: '01',
    title: '工程筆記',
    description: '網站、企業系統與 AI 工具的設計和開發方法。',
  },
  {
    number: '02',
    title: '專案觀察',
    description: '從需求訪談到上線維護，記錄專案中值得分享的判斷。',
  },
  {
    number: '03',
    title: '團隊札記',
    description: '分享團隊如何協作、學習與改善日常工作。',
  },
];

export function JournalPage() {
  return (
    <>
      <PageHero
        className="page-hero--journal"
        eyebrow="NOTES FROM OUR TEAM · 工程筆記"
        title={<>工程師的心內話<br /><em>把做法說清楚</em></>}
        description="這裡會分享網站開發、企業系統、AI 工具與專案協作的實務經驗。文章由杉鼎森團隊整理，讓讀者看見我們如何處理具體問題。"
        index="05"
      />

      <section className="journal-topics container" aria-labelledby="journal-topics-title">
        <div className="section-heading" data-reveal>
          <Eyebrow showDot>WHAT WE WRITE</Eyebrow>
          <h2 id="journal-topics-title">我們會分享的主題</h2>
          <p>從實際工作出發，整理可參考的方法與經驗。</p>
        </div>
        <div className="journal-topics__grid">
          {topics.map((topic) => (
            <article className="journal-topic" data-reveal key={topic.number}>
              <span>{topic.number} / TOPIC</span>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="journal-posts container" aria-labelledby="journal-posts-title">
        <div className="section-heading" data-reveal>
          <Eyebrow showDot>ARTICLES</Eyebrow>
          <h2 id="journal-posts-title">最新文章</h2>
        </div>
        <div className="journal-empty" data-reveal>
          <span aria-hidden="true">✳</span>
          <h3>文章整理中</h3>
          <p>第一篇文章發布後，會在這裡依發布時間顯示。課程與服務資訊可先從其他頁面查看。</p>
          <div>
            <Link className="button button--dark" to="/services">查看服務項目 ↗</Link>
            <Link className="button button--light" to="/cip">了解 CIP 培訓 ↗</Link>
          </div>
        </div>
      </section>
    </>
  );
}
