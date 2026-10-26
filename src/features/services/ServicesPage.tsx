import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow } from '../../components/Eyebrow';
import { PageHero } from '../../components/PageHero';

const scopeOptions = [
  ['web', '品牌官網／電商'],
  ['erp', '進銷存／倉儲 ERP'],
  ['line', 'LINE AI 客服'],
  ['dashboard', '戰情室儀表板'],
  ['api', '異質系統 API 串接'],
  ['cloud', '雲端託管'],
] as const;

const processSteps = [
  ['01', '需求深探與評估', '梳理業務痛點、資料流向與預期目標，形成可行的規格藍圖。', '交付物：規格分析書'],
  ['02', '高階架構規劃', '確認技術選型、資料結構與介面流程，完成可討論的原型。', '交付物：架構圖與 UI 原型'],
  ['03', '敏捷迭代與測試', '分段交付可用功能，持續檢查互動、相容性及穩定性。', '交付物：測試站與驗收紀錄'],
  ['04', '安全上線與維運', '安排部署、文件交接與後續維護，使系統能持續成長。', '交付物：交接文件與維運規劃'],
];

function ServiceCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <article className={`service-card ${className}`.trim()} data-reveal>{children}</article>;
}

export function ServicesPage() {
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['web']);
  const duration = selectedScopes.length ? `${3 + (selectedScopes.length - 1) * 2} – ${5 + (selectedScopes.length - 1) * 2}` : '—';

  const toggleScope = (value: string) => {
    setSelectedScopes((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  return (
    <>
      <PageHero
        eyebrow="ENGINEERING WITH PURPOSE · 服務項目"
        title={<>從需求出發，<br /><em>把複雜變得清楚。</em></>}
        description="我們以工程思維梳理流程，以合適的技術打造能長期使用的數位工具。每一項服務都從你的實際工作方式開始。"
        index="02"
      />
      <section className="services-section container" aria-labelledby="services-title">
        <div className="section-heading" data-reveal><Eyebrow>WHAT WE DO</Eyebrow><h2 id="services-title">五個方向，回應不同階段的需求</h2></div>
        <div className="service-grid">
          <ServiceCard className="service-card--featured">
            <div className="service-card__top"><span className="service-card__icon" aria-hidden="true">▧</span><span>01 / WEB EXPERIENCE</span></div>
            <h3>網頁製作</h3><p>從品牌識別、資訊架構到響應式介面與內容管理，打造兼具形象與實用性的網站。</p>
            <div className="service-card__features"><span>RWD 全螢幕支援</span><span>搜尋友善架構</span><span>內容管理整合</span><span>高效能頁面體驗</span></div>
            <img src="/assets/project-1.jpg" alt="企業網站在桌上螢幕及平板展示" width="512" height="288" loading="lazy" />
            <div className="service-card__footer"><span>網站架構 · UI 設計 · 前端開發</span><Link to="/about#contact">諮詢網站專案 ↗</Link></div>
          </ServiceCard>
          <ServiceCard>
            <div className="service-card__top"><span className="service-card__icon" aria-hidden="true">⌗</span><span>02 / ERP SYSTEM</span></div>
            <h3>客製化進銷存系統</h3><p>把採購、銷售、庫存與報表連成清楚的工作流程，配合企業實際作業方式設計。</p>
            <ul><li>訂單與庫存管理</li><li>跨部門流程整合</li><li>營運資料與報表</li></ul>
            <div className="service-card__metric"><span>流程整合重點</span><strong>即時可視化</strong></div>
            <div className="service-card__footer"><span>ERP · CRM · API</span><Link to="/about#contact">了解服務範圍 ↗</Link></div>
          </ServiceCard>
          <ServiceCard>
            <div className="service-card__top"><span className="service-card__icon" aria-hidden="true">✳</span><span>03 / LINE AI</span></div>
            <h3>LINE AI 機器人串接</h3><p>在熟悉的對話介面提供問答、預約、提醒與資料查詢，減少重複工作。</p>
            <div className="service-card__sample"><span>訪客：我想了解服務內容</span><strong>AI 助理：您好！我可以幫您整理合適的服務方向。</strong></div>
            <ul><li>LINE 官方帳號與知識庫整合</li><li>預約、通知及客服流程</li></ul>
            <div className="service-card__footer"><span>LINE Messaging API</span><Link to="/about#contact">預約 AI 諮詢 ↗</Link></div>
          </ServiceCard>
          <ServiceCard>
            <div className="service-card__top"><span className="service-card__icon" aria-hidden="true">▥</span><span>04 / DATA VISUALIZATION</span></div>
            <h3>既有系統儀表板建置</h3><p>串接原有系統與資料來源，以視覺化方式呈現重要指標、狀態與趨勢。</p>
            <div className="service-card__chart" aria-label="示意資料長條圖"><i /><i /><i /><i /><i /><i /></div>
            <ul><li>SQL、試算表與系統資料整合</li><li>即時指標與異常提醒</li></ul>
            <div className="service-card__footer"><span>DATA · BI · IoT</span><Link to="/about#contact">評估資料視覺化 ↗</Link></div>
          </ServiceCard>
          <ServiceCard>
            <div className="service-card__top"><span className="service-card__icon" aria-hidden="true">⌘</span><span>05 / CUSTOM ENGINEERING</span></div>
            <h3>其他系統工程委託</h3><p>需求不在既定分類裡也沒關係。從現況訪談、可行性評估到開發與交付，共同設計合適的解法。</p>
            <div className="service-card__features"><span>異質系統 API 串接</span><span>雲端服務整合</span><span>架構評估與優化</span><span>長期維護擴充</span></div>
            <div className="service-card__footer"><span>可依需求客製</span><Link to="/about#contact">提交需求 ↗</Link></div>
          </ServiceCard>
        </div>
      </section>
      <section className="process-section"><div className="container"><div className="section-heading" data-reveal><Eyebrow>WORKFLOW METHODOLOGY</Eyebrow><h2>四階段工程交付準則</h2><p>每個專案皆遵循清楚的規劃、製作與驗收節奏，讓需求與交付保持一致。</p></div><div className="process-grid">{processSteps.map(([number, title, description, output]) => <article data-reveal key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p><small>{output}</small></article>)}</div></div></section>
      <section className="scope-section container" aria-labelledby="scope-title" data-reveal>
        <div className="scope-section__copy"><Eyebrow>QUICK PROJECT SCOPE</Eyebrow><h2 id="scope-title">幾秒鐘內估算您的數位轉型規劃</h2><p>選擇您感興趣的模組，先取得概略時程範圍，再與我們討論實際需求。</p><div className="scope-options">{scopeOptions.map(([value, label]) => <label key={value}><input type="checkbox" checked={selectedScopes.includes(value)} onChange={() => toggleScope(value)} /><span>{label}</span></label>)}</div></div>
        <div className="scope-result"><span>ESTIMATED PROJECT SCOPE</span><strong aria-live="polite">{duration}</strong><span>週交付週期概估</span><p>此為介面示意估算，實際時程依訪談、規格與資源配置確認。</p><Link className="button button--light" to="/about#contact">取得專案規劃討論 ↗</Link></div>
      </section>
      <section className="next-step container" data-reveal><div><Eyebrow>LET'S BUILD TOGETHER</Eyebrow><h2>立即加入杉鼎森，開啟工程對話。</h2><p>從既有系統優化到全新平台建置，歡迎與我們討論。</p></div><Link className="button button--dark" to="/about#contact">洽談合作 <span aria-hidden="true">↗</span></Link></section>
    </>
  );
}
