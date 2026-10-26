export type CourseId = 'seminar' | 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: CourseId;
  level: string;
  title: string;
  description: string;
  hoursLabel: string;
  mode: string;
  audience: string;
  certificate: string;
  priceLabel: string;
  actionLabel: string;
}

export const courseCatalog: Record<CourseId, Course> = {
  seminar: { id: 'seminar', level: '趨勢先導 · 研習會', title: 'CIP 研習會：AI 時代數位品牌啟發', description: '針對新手及轉型創作者設計的啟發論壇，快速拆解個人 IP 與企業案例架構。', hoursLabel: '3 小時密集工作坊', mode: '線上互動直播／線下研討', audience: '自由職業者、行銷專員、品牌初創者', certificate: '研習證書電子存證', priceLabel: '體驗名額優惠', actionLabel: '立即報名研習會 ↗' },
  beginner: { id: 'beginner', level: '核心基底 · 初階課程', title: '個人 IP 核心定位與自媒體框架', description: '聚焦個人標籤、視覺基調與自媒體渠道，實作專業定位及內容藍圖。', hoursLabel: '12 小時（分 4 模組授課）', mode: '精緻小班制／專案實操批改', audience: '專業人士、教練講師', certificate: 'CIP 基礎自媒體策劃師資格', priceLabel: '正規班定價', actionLabel: '前往報名網頁 ↗' },
  intermediate: { id: 'intermediate', level: '工程實戰 · 中階課程', title: '內容自動化產出與機器人整合實作', description: '搭建 AI 內容流程、自動排程，並整合 LINE 互動機器人與名單標籤分流。', hoursLabel: '24 小時（含 8 次技術工作坊）', mode: '線上沉浸實戰＋工程師諮詢', audience: '電商主理人、營運主管、行銷架構師', certificate: 'CIP 數位自動化工程專家資格', priceLabel: '深度技術培訓', actionLabel: '前往報名網頁 ↗' },
  advanced: { id: 'advanced', level: '最高殿堂 · 高階課程', title: '企業級 IP 商業模式與 CIP 認證考核', description: '面向企業決策層，探討 IP 資產化、經營架構與認證答辯準備。', hoursLabel: '36 小時＋實戰輔導答辯', mode: '高管沙龍＋認證審查考核', audience: '企業創辦人、合夥人、品牌總監', certificate: 'CIP 國際註冊資深品牌營運管理師', priceLabel: '決策階層資格', actionLabel: '申請資格與報名 ↗' },
};

export const coursePrices: Record<CourseId, string> = {
  seminar: 'NT$ 1,200',
  beginner: 'NT$ 9,800',
  intermediate: 'NT$ 22,800',
  advanced: 'NT$ 46,000',
};
