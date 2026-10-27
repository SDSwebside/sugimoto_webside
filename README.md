# 杉鼎森數位工程網站

網站使用 React 19、Vite、TypeScript 與 React Router。本地報名 API 使用 Node.js 和 PGlite（嵌入式 PostgreSQL），資料保存在本機 `.local-data/`。

## 開發指令

```bash
npm install
npm run admin:init
npm run dev
npm run build
```

`admin:init` 只需執行一次，會在終端顯示本機管理者密碼；請自行保存。`npm run dev` 會同時啟動 Vite（`127.0.0.1:5173`）及 API（`127.0.0.1:3001`）。若已有既存的開發伺服器，先關閉再啟動完整服務。`.local-data/` 包含報名資料與管理者密碼雜湊，已排除 Git 追蹤，請自行備份。

## React 路由

- `/`：LOGO 開場、首頁入口與品牌理念。
- `/portfolio`：作品案例與專案諮詢區。
- `/services`：五項服務、工程交付流程與互動式規模概估。
- `/cip`：CIP 官方制度重點、認證申請流程、評審主任與培訓方向。
- `/about`：團隊、聯絡方式與高雄／桃園辦公室地圖。
- `/journal`：「工程師的心內話」文章入口；文章發布功能尚未建置。
- `/register?course=seminar|beginner|intermediate|advanced`：課程報名申請，送出後儲存至本機資料庫。
- `/admin`：從頁尾圖示進入的本機管理者登入與報名處理頁。

## 專案結構

```text
src/
├── components/       共用導覽、頁尾、頁面標題與諮詢區塊
├── features/         首頁、作品、服務、CIP、報名、文章入口及管理後台
├── hooks/            共用的 reveal 動畫 hook
└── styles/           從既有設計遷移的 CSS variables、響應式樣式與動畫
public/assets/        品牌標誌、插圖與作品圖片
server/               本地報名 API 與資料表結構
scripts/              本地服務啟動與管理者初始化
.local-data/           本機資料庫及管理者密碼雜湊（不納入 Git）
```

作品與課程內容目前仍由前端程式提供。線上內容管理與文章發布尚未串接資料庫。

## 上線前需要確認

1. LINE 官方帳號 QR Code 已使用提供的圖檔；若要加入可點擊的加好友按鈕，需提供官方加好友網址。
2. 關於頁的團隊姓名、照片與職務資訊。
3. 與培訓中心確認各課程實際梯次、時數、可銜接的 CIP 認證項目與證照全名。
4. 正式網站需部署可持久運作的 API 與 PostgreSQL，建立管理者帳號及備份機制。只部署 Vite 靜態檔案時，報名與後台 API 無法使用；本機報名資料與密碼不會隨 Git 推送。
5. 確認電話、電子郵件、辦公室地址與服務時間。

線上報名、文章、PostgreSQL 與管理後台的討論方案見 [`docs/backend-proposal.md`](docs/backend-proposal.md)。
