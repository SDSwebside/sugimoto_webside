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
  isReverse?: boolean;
}

// 目前是前端 fixture；未來接後端時，只需要替換此 feature 的資料來源。
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'brand-platform',
    eyebrow: '01 / 品牌網站',
    title: '大型企業數位轉型\n與品牌形象體驗',
    description: '讓龐大的專案資訊保持清晰，讓服務與品牌故事各有位置。從導覽規劃、響應式介面到後台內容管理，建立能持續成長的網站基礎。',
    image: 'project-1.jpg',
    imageAlt: '建築品牌網站在桌上螢幕與平板呈現',
    category: 'WEB DESIGN · BRAND EXPERIENCE',
    tags: ['網站架構', 'RWD 設計', '內容管理'],
    noteTitle: '清楚傳達',
    noteDescription: '讓複雜資訊更容易被理解',
  },
  {
    id: 'operation-system',
    eyebrow: '02 / 企業營運系統',
    title: '全通路智慧進銷存\n管理系統',
    description: '整合訂單、庫存、採購與報表，把分散的工作流程收進同一個介面。讓團隊在日常作業中看得清楚，也做得更有效率。',
    image: 'project-2.jpg',
    imageAlt: '企業進銷存管理系統與資料圖表展示於電腦螢幕',
    category: 'ERP / OPERATION SYSTEM',
    tags: ['進銷存', '流程整合', '即時報表'],
    noteTitle: '資料整合',
    noteDescription: '讓營運決策有更可靠的依據',
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
    id: 'iot-dashboard',
    eyebrow: '04 / 數據儀表板',
    title: '工業物聯網與\n即時戰情儀表板',
    description: '把既有系統、設備與資料來源接進同一個視野。以簡潔的圖表與狀態提示呈現關鍵資訊，協助團隊及早發現問題。',
    image: 'project-4.jpg',
    imageAlt: '工業控制室中的多螢幕即時儀表板',
    category: 'DATA / IOT DASHBOARD',
    tags: ['IoT 資料', '視覺化', '既有系統串接'],
    noteTitle: '即時可見',
    noteDescription: '從資料到行動，減少判讀距離',
    isReverse: true,
  },
];
