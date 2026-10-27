# 後端現況與後續規劃

更新日期：2026-10-27。操作與部署方式請先看專案根目錄的 `README.md`。

## 已完成於本機

- Node API 已改用 PostgreSQL 的 `DATABASE_URL`。報名資料存入 `registrations`；後台可登入、查看最近 200 筆報名、更新處理狀態與內部備註。
- 後台文章管理可新增、編輯、儲存草稿、發布及取消發布；`/journal` 只顯示已發布文章。標題、摘要及內文存入 `articles`，圖片二進位資料存入 `article_images`。
- PostgreSQL 連線、報名、文章及圖片已在獨立本機資料庫通過整合測試。舊 PGlite 資料可用 `npm run db:migrate:pglite` 複製報名紀錄。
- 目前正式網站的 `/api/health` 仍是靜態網站 HTML。線上 API 與 PostgreSQL 尚未部署驗收。

## 後續功能

| 功能 | 規劃 |
| --- | --- |
| `inquiries` | 一般服務詢問的聯絡資料、需求內容與處理狀態。 |
| `notification_outbox` | 報名和詢問通知的寄送狀態、重試次數與錯誤紀錄。 |
| `courses` | 課程內容、排序、草稿與已發布版本；目前課程內容仍在 `src/features/cip/data.ts`。 |
| `site_copy` | 首頁、服務、CIP、關於等頁面的短文案草稿與發布版本。 |
| `content_revisions` | 文章、課程與文案修改紀錄。 |
| `admin_users` | 多位管理者、角色與密碼重設流程。目前使用 `SDS_ADMIN_PASSWORD` 服務秘密變數，或本機 `.local-data/admin.json`。 |

正式環境還需設定 PostgreSQL 備份、管理者密碼、資料保存期限與寄信網域。課程報名目前仍屬**申請**，提交不代表名額確認；若日後有固定日期與名額，再加入 `course_sessions`。文章內文目前為純文字段落，如需豐富排版可擴充編輯器。
