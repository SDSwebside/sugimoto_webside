# 杉鼎森數位工程網站

目前使用 React 19、Vite、TypeScript 與 React Router。原本的多個純 HTML 入口已整合為單一 React 應用程式，保留既有視覺、響應式版面與主要互動。

## 開發指令

```bash
npm install
npm run dev
npm run build
npm run preview
```

## React 路由

- `/`：LOGO 開場、首頁入口與品牌理念。
- `/portfolio`：作品案例與專案諮詢區。
- `/services`：五項服務、工程交付流程與互動式規模概估。
- `/cip`：CIP 介紹、IP 路徑與四階段課程。
- `/about`：團隊、聯絡方式與高雄／桃園辦公室地圖。
- `/register?course=seminar|beginner|intermediate|advanced`：課程報名意向頁。

## 專案結構

```text
src/
├── components/       共用導覽、頁尾、頁面標題與諮詢區塊
├── features/         依功能拆分首頁、作品、服務、CIP、報名與關於頁面
├── hooks/            共用的 reveal 動畫 hook
└── styles/           從既有設計遷移的 CSS variables、響應式樣式與動畫
public/assets/        品牌標誌、插圖與作品圖片
```

作品頁目前使用 `src/features/portfolio/data.ts` 的型別化 fixture。後續新增後端時，可在同一個 feature 內加入 API client，將資料來源替換為 API，頁面元件不需要重寫。

## 上線前需要替換

1. LINE 官方帳號開通後，替換 QR Code、ID 與加好友連結。
2. 關於頁的團隊姓名、照片與職務資訊。
3. CIP 認證機構、授證條件、課程內容與價格。
4. 報名表目前會開啟電子郵件軟體；正式上線前應改接後端或表單服務。
5. 確認電話、電子郵件、辦公室地址與服務時間。
