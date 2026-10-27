# 杉鼎森數位工程網站

React 19、Vite、TypeScript 前端，搭配 Node.js API 和 **PostgreSQL**。同一個 Node 服務在正式環境提供網站靜態檔與 `/api`，報名、文章文字及文章圖片都存入 PostgreSQL。

## 目前進度（2026-10-27）

- 首頁、作品、服務、CIP、關於、課程報名、工程師的心內話及管理後台已建立。
- 課程報名 API 會驗證輸入並寫入 `registrations`，後台可查看申請、更新狀態和內部備註。
- 後台可新增、編輯、發布及取消發布文章。文章有標題、摘要、內文及圖片；文字和圖片二進位資料分別存入 `articles` 與 `article_images`。公開頁只列出已發布文章。
- 每篇文章最多 8 張 PNG、JPEG 或 WebP，單張不超過 5 MB。第一張作為文章列表封面。內文以空白行分段，目前是純文字編輯器。
- 本機已用 PostgreSQL 18.6 執行整合測試與瀏覽器操作，結果記錄於下方「驗收紀錄」。
- **這次修正保存在獨立 Git 分支，尚未部署。** 目前 `www.sugimoto01.com/api/health` 仍回傳網站 HTML，表示線上 API 還沒接通；線上報名尚不能視為可收件。

## 本機啟動

1. 安裝 Node.js 20+ 與 PostgreSQL，建立一個專案資料庫。
2. 安裝依賴：`npm ci`。
3. 設定環境變數。PowerShell 範例：

   ```powershell
   $env:DATABASE_URL = 'postgresql://使用者:密碼@127.0.0.1:5432/資料庫名稱'
   $env:SDS_ADMIN_PASSWORD = '請設定強密碼'
   ```

4. 執行 `npm run dev`，開啟 `http://127.0.0.1:5173`。Vite 會把 `/api` 轉送到本機 API（預設 `127.0.0.1:3001`）。

若未設定 `SDS_ADMIN_PASSWORD`，可執行 `npm run admin:init` 建立本機管理者密碼；雜湊保存在 `.local-data/admin.json`。正式環境建議使用服務的秘密變數 `SDS_ADMIN_PASSWORD`。沒有 `DATABASE_URL` 時 API 會拒絕啟動，避免誤以為資料已保存。

## 路由與資料

| 路徑 | 功能 |
| --- | --- |
| `/register?course=seminar\|beginner\|intermediate\|advanced` | 提交課程報名申請並顯示受理編號。 |
| `/journal`、`/journal/:id` | 已發布文章列表與文章內容。 |
| `/admin` | 管理報名、編輯文章與上傳圖片。 |
| `/api/health` | 查詢 PostgreSQL 連線健康狀態，應回傳 `{"ok":true,"storage":"postgresql"}`。 |

資料表由 `server/schema.sql` 在 API 啟動時建立：`registrations`、`articles`、`article_images`。圖片以 `bytea` 儲存在 PostgreSQL，刪除文章時關聯圖片一併刪除。`.local-data/` 與 `.env` 已排除 Git 追蹤，請自行備份既有本機資料。

舊版 `.local-data/pgdata` 是 PGlite 資料，**新 API 不再讀取它**。如需保留舊報名資料，先停止舊 API、設定新 PostgreSQL 的 `DATABASE_URL`，再執行 `npm run db:migrate:pglite`。這個指令只複製尚未存在的報名紀錄，不刪除舊資料。舊管理者密碼檔仍可供本機登入使用。

搬遷測試或特殊路徑可用 `SDS_LEGACY_PGLITE_DIR` 指向來源資料夾；日常使用不需設定。

## 建置與測試

```bash
npm run build
npm start
```

`npm start` 會用 `PORT`（若有設定）或 `SDS_API_PORT`（預設 3001）啟動同一個網站與 API 服務。建置後應檢查 `/api/health` 回傳 JSON，而不是首頁 HTML。

整合測試需要一個**獨立測試資料庫**和正在執行的 API；測試會暫時新增並刪除報名與文章資料：

```powershell
$env:DATABASE_URL = 'postgresql://使用者:密碼@127.0.0.1:5432/測試資料庫'
$env:SDS_ADMIN_PASSWORD = '測試管理者密碼'
$env:SDS_API_PORT = '3002'
npm start
# 在另一個終端，設定同一個 DATABASE_URL：
$env:SDS_TEST_ADMIN_PASSWORD = '測試管理者密碼'
npm run test:integration
```

`SDS_TEST_BASE` 可覆寫測試 URL，預設 `http://127.0.0.1:3002`。測試會核對 PostgreSQL 中的報名欄位、文章文字和圖片位元組，以及草稿無法公開讀取。

## 驗收紀錄（2026-10-27，本機）

| 項目 | 結果 |
| --- | --- |
| TypeScript 檢查與 Vite 正式建置 | 通過。 |
| 報名頁瀏覽器送出 | 成功顯示受理編號；PostgreSQL 查得課程、姓名、電子郵件、電話、備註與初始狀態。 |
| 報名 API 與後台 | 驗證無效輸入；成功報名、管理者登入、查詢報名、更新狀態與內部備註。 |
| 文章與圖片 | 瀏覽器中新增草稿、編輯兩段內文、上傳 PNG、發布，公開列表及內頁可閱讀文章並顯示圖片；PostgreSQL 查得文章文字及圖片。 |
| 權限與格式 | 未登入不能讀取後台；草稿文章及其圖片不能公開讀取；拒絕跨站寫入與無效圖片。取消發布後，文章及圖片無法再公開讀取。 |
| 手機、平板、桌面版 | 文章頁在 375、768、1440 px 寬度檢查，未發現水平溢出。 |
| 舊資料搬遷 | 用 PGlite 測試資料複製 1 筆至 PostgreSQL；第二次執行新增 0 筆，確認可重複執行。 |
| 測試資料 | 已清除；測試 PostgreSQL 的 `registrations`、`articles`、`article_images` 均為 0 筆。這不是正式資料庫的筆數。 |

以上結果只代表本機程式與測試資料庫。線上網站目前沒有可用的 API，正式 PostgreSQL 的服務與資料狀態仍待 Railway 重新連線後確認。

## Railway 上線設定

1. 在現有 Railway 專案新增 PostgreSQL 服務，開啟資料庫備份。
2. 網站服務設定 `DATABASE_URL` 為 PostgreSQL 服務的參照變數，例如 `${{Postgres.DATABASE_URL}}`；另設定 `SDS_ADMIN_PASSWORD` 與 `PUBLIC_ORIGIN=https://www.sugimoto01.com`。
3. `railway.json` 指定 `npm run build`、`npm start` 與 `/api/health` 健康檢查。確認網站服務使用這份設定，再部署。
4. 部署後檢查 `/api/health` 是 PostgreSQL JSON，再用正式網站測試報名、後台登入、文章發布與圖片讀取；測試報名資料需由管理者清除。

目前 Railway 連線需要重新驗證，因此**尚未確認線上是否已有 PostgreSQL 服務，也尚未更動 Railway 設定**。不要只推送程式碼就假設線上資料庫已可用；缺少 `DATABASE_URL` 時新服務會啟動失敗。

## 待完成

- 正式環境部署與端對端驗收。
- 文章目前使用純文字段落；若需要粗體、標題或圖片插入指定段落，可擴充編輯器。
- 郵件通知、一般服務詢問、課程內容管理與公開網站文案管理尚未建置，詳見 `docs/backend-proposal.md`。
