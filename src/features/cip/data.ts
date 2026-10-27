export type CourseId = 'seminar' | 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: CourseId;
  level: string;
  title: string;
  description: string;
  hoursLabel: string;
  focus: string;
  audience: string;
  actionLabel: string;
}

// These are the site's planned training topics. Exact class dates, hours and
// eligible CIP credential titles require confirmation by the training centre.
export const courseCatalog: Record<CourseId, Course> = {
  seminar: {
    id: 'seminar',
    level: '認識 CIP · 說明會',
    title: 'CIP 國際職業認證說明會',
    description: '了解 CIP 的認證項目、申報條件、考試方式與證書查詢，先確認適合自己的專業方向。',
    hoursLabel: '8 小時',
    focus: '認證制度與申請方向',
    audience: '想了解國際職業認證的專業人士',
    actionLabel: '詢問說明會 ↗',
  },
  beginner: {
    id: 'beginner',
    level: '品牌基礎 · 初階培訓',
    title: '個人品牌定位與內容規劃',
    description: '整理專業定位、服務對象與內容主題，建立能清楚介紹自身專長的品牌資料。',
    hoursLabel: '8 小時',
    focus: '定位、受眾與內容架構',
    audience: '專業工作者、講師與創業者',
    actionLabel: '詢問初階培訓 ↗',
  },
  intermediate: {
    id: 'intermediate',
    level: '工具應用 · 中階培訓',
    title: '數位內容與 AI 工具實作',
    description: '規劃內容製作流程，實作自動化工具與 LINE 互動，讓專業服務更容易被看見與管理。',
    hoursLabel: '8 小時',
    focus: '內容流程、AI 與 LINE 應用',
    audience: '已有服務或內容基礎的團隊',
    actionLabel: '詢問中階培訓 ↗',
  },
  advanced: {
    id: 'advanced',
    level: '成果整理 · 高階培訓',
    title: '專業成果與認證申請準備',
    description: '整理實務案例、專業成果與申請資料，並依目標認證項目的官方條件確認下一步。',
    hoursLabel: '8 小時',
    focus: '案例整理與申請準備',
    audience: '準備申請相應 CIP 項目的專業人士',
    actionLabel: '諮詢認證準備 ↗',
  },
};
