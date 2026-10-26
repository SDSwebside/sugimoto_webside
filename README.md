# 杉鼎森數位工程網站

無須安裝套件。直接開啟 `index.html` 即可瀏覽；也可以使用本機靜態伺服器預覽。

## 頁面

- `index.html`：LOGO 開場與正式首頁。首次進入點擊 LOGO，男孩插圖旁的四張功能卡會從中心向外展開；同一瀏覽器分頁期間再次回首頁會略過開場，首頁提供「重新播放開場動畫」。
- `portfolio.html`：四個左右交錯的作品區塊。
- `services.html`：五項服務與合作流程。
- `cip.html`：CIP 介紹、個人／企業 IP 路徑及四階段課程。
- `about.html`：團隊欄位與聯絡方式。
- `register.html?course=seminar|beginner|intermediate|advanced`：各課程的報名意向頁。

## 上線前需要替換

1. `about.html` 與首頁的 LINE QR Code 預留區：放入官方 QR Code 與連結。
2. `about.html` 團隊卡：放入實際姓名、照片與職務資訊。
3. `cip.html` 四個課程卡目前連到站內報名意向頁。若已有正式報名網址，直接替換各卡片的 `href`。
4. `register.html` 和 `main.js` 的報名方式目前會開啟電子郵件軟體，收件地址 `contact@shandingsen.com` 取自設計稿，請確認後再正式啟用；如需線上送出，應接入後端或表單服務。
5. CIP 認證機構、授證條件、實際課程內容及案例資料，請於公開上線前核對。

`assets/` 中的品牌標誌、插圖和作品圖取自提供的 `disign` 設計資料夾。網站使用 Google Fonts，離線時會自動退回系統字體。
