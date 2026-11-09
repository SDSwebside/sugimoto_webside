export interface PortfolioProject {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  category: string;
  tags: string[];
  noteTitle: string;
  noteDescription: string;
  gallery?: Array<{ image: string; alt: string; label: string }>;
  imageFit?: 'cover' | 'contain';
  isReverse?: boolean;
}

// 目前是前端 fixture；未來接後端時，只需要替換此 feature 的資料來源。
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'brand-platform',
    eyebrow: '01 / 品牌網站',
    title: '雲門玉品\n翡翠玉石品牌網站',
    description: '以深色底、金色字體與商品影像建立玉石品牌質感，整合品牌故事、作品展示、商品細節與 LINE 預約鑑賞，讓使用者從瀏覽到諮詢都有清楚入口。',
    image: 'yunmen-jade/homepage.png',
    imageAlt: '雲門玉品翡翠玉石品牌網站首頁',
    category: 'WEB DESIGN · BRAND EXPERIENCE',
    tags: ['品牌形象', '商品展示', 'LINE 預約鑑賞'],
    noteTitle: '質感傳遞',
    noteDescription: '讓每件玉石作品被清楚看見',
    imageFit: 'contain',
    gallery: [
      { image: 'yunmen-jade/catalog.png', alt: '雲門玉品藏品總覽與商品列表畫面', label: 'COLLECTION / 01' },
      { image: 'yunmen-jade/product-detail.png', alt: '雲門玉品商品詳細介紹與預約鑑賞畫面', label: 'PRODUCT DETAIL / 02' },
    ],
  },
  {
    id: 'operation-system',
    eyebrow: '02 / 專案營運系統',
    title: '專案營運與帳務\n管理系統',
    description: '整合客戶、專案、估價報價與收付款流程，讓團隊在同一個工作介面掌握案件進度、營運數據與帳務狀態。',
    image: 'operation-system/dashboard.png',
    imageAlt: '專案營運與帳務管理系統的儀表板畫面',
    category: 'PROJECT OPS / ACCOUNTING SYSTEM',
    tags: ['客戶管理', '估價報價', '收付款整合'],
    noteTitle: '流程集中',
    noteDescription: '讓專案進度與帳務資訊在同一個視野',
    imageFit: 'contain',
    gallery: [
      { image: 'operation-system/customers.png', alt: '專案營運與帳務管理系統的客戶履歷畫面', label: 'CLIENT HISTORY / 01' },
      { image: 'operation-system/estimate.png', alt: '專案營運與帳務管理系統的估價報價畫面', label: 'ESTIMATE / 02' },
    ],
    isReverse: true,
  },
  {
    id: 'line-ai',
    eyebrow: '03 / AI 對話自動化',
    title: '企業級 LINE AI\n智慧客服與行銷自動化',
    description: '將常見問題、預約、通知與資料查詢串進熟悉的 LINE 對話。讓回覆更即時，也讓團隊把時間留給真正需要人處理的事情。',
    image: 'project-3.jpg',
    imageAlt: 'LINE AI 智慧客服顯示於兩支手機',
    category: 'LINE AI / AUTOMATION',
    tags: ['LINE 官方帳號', 'AI 問答', '流程自動化'],
    noteTitle: '自然互動',
    noteDescription: '把服務帶進使用者已習慣的場景',
  },
  {
    id: 'techbrief-platform',
    eyebrow: '04 / AI 內容平台',
    title: 'TechBrief 科技快訊\n與訂閱平台',
    description: '整合 AI 內容生成、會員訂閱、線上付款與電子報寄送，讓科技與財經資訊從整理、編輯到發送形成完整的內容營運流程。',
    image: 'techbrief/techbrief-home.png',
    imageAlt: 'TechBrief 科技與財經內容平台首頁',
    category: 'AI / CONTENT PLATFORM',
    tags: ['AI 內容生成', '會員訂閱', 'Email 電子報'],
    noteTitle: '內容自動化',
    noteDescription: '從新聞整理、文章生成到訂閱寄送',
    imageFit: 'contain',
    gallery: [
      { image: 'techbrief/financial-calendar.png', alt: 'TechBrief 財報日曆與經濟事件畫面', label: 'FINANCIAL CALENDAR / 01' },
      { image: 'techbrief/admin-dashboard.png', alt: 'TechBrief 內容平台管理後台畫面', label: 'ADMIN DASHBOARD / 02' },
    ],
    isReverse: true,
  },
];
