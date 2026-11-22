# 健康俱樂部

大臺北的室內課程與講座平台，由海連科技有限公司經營，不綁定單一廠商。一般大眾都可以看活動、報名或候補、加入社團、做每日打卡。管理員與場地管理員可以在後台維護內容。健康相關單位可在「合作夥伴」頁提出開課申請。

目前入會免費。資料表已留會員方案與價格欄位，這一版沒有金流。全站介面是繁體中文，預設字級 18px，可切換較大、特大。

本站不是醫療服務，不蒐集病歷或健檢報告。隱私權政策與使用條款是草稿，上線前請律師審閱。

## 本機啟動

需要 Node.js 20 以上。

```bash
npm install
npm run dev
```

瀏覽器打開 [http://127.0.0.1:43123](http://127.0.0.1:43123)。

沒有設定 Supabase 時，自動進入**本機示範模式**。資料寫在 `.data/demo-db.json`（不會進版控）。會員用 LINE 加入；沒有 `LINE_CHANNEL_ID` 時，綠色按鈕是標明「示範」的模擬登入。工作人員示範帳號密碼都是 `Demo1234!`：

| 角色 | 信箱 | 暱稱 |
| --- | --- | --- |
| 會員 | member@bama.example | 陳阿姨 |
| 管理員 | admin@bama.example | 林志工 |
| 大安場地管理員 | branch@bama.example | 林場地 |

活動、社團、挑戰標題裡的「範例」是種子資料，不是正式場次。松山那一場名額是 1，用來看候補。

```bash
npm run lint
npm run typecheck
npm run exercise
npm run build
```

`exercise` 用記憶體裡的示範資料跑過註冊、報名、取消、候補、加入社團、打卡、管理員建立活動。

## 環境變數

複製 `.env.example` 成 `.env.local`。

| 變數 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案網址。空白就用示範模式。 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 瀏覽器與伺服器用的 anon key。新版 publishable key 也可填在 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`。 |
| `SUPABASE_SERVICE_ROLE_KEY` | 只放伺服器。每日提醒與候補遞補寄信用。不可加 `NEXT_PUBLIC_`。 |
| `RESEND_API_KEY` | 有這把金鑰才真的寄信。沒有時報名與提醒會略過，網站仍可用。 |
| `NEXT_PUBLIC_SITE_URL` | 本機 `http://127.0.0.1:43123`。正式網址由公司決定後再填，登入信與信內連結會用它。 |
| `RESEND_FROM` | 選填。寄件者，須是 Resend 已驗證的網域。 |
| `CRON_SECRET` | 選填。`/api/cron/reminders` 要帶 `Authorization: Bearer <值>`。 |

`onboarding@resend.dev` 只能寄到 Resend 帳號自己的信箱，正式環境請改 `RESEND_FROM`。

## 接上 Supabase

1. 建立 Supabase 專案。
2. 在 SQL Editor 依序貼上並執行：
   - `supabase/migrations/20261119120000_init.sql`
   - `supabase/migrations/20261119143000_club_venues.sql`
   - `supabase/migrations/20261122120000_partner_applications.sql`
   - `supabase/migrations/20261122153000_line_members.sql`
   - `supabase/seed.sql`
3. Authentication → Providers：開啟 Email。若要魔法連結或註冊確認信，設定寄信。Google 登入要另外貼上 Google 的 Client ID 與 Secret，重新導向網址用正式網域的 `/auth/callback`。
4. Authentication → URL Configuration：Site URL 設成正式網址，Redirect URLs 加上本機與正式網址的 `/auth/callback`。
5. 把上面的環境變數填進部署平台。
6. 第一位正式管理員不會從註冊表單產生。用 SQL Editor（或 service role）執行：

```sql
update public.profiles
set role = 'admin', verified = true
where email = '你的信箱';
```

種子檔若成功建立 `admin@bama.example`，那是測試帳號。正式上線前請刪除示範使用者，並不要沿用 `Demo1234!`。

每一張公開資料表都有啟用 Row Level Security。角色存在 `profiles.role`，不讀使用者可自行修改的 `user_metadata`。主辦電話不開放一般查詢，已登入會員才經由函式取得。病歷欄位不存在。

## 寄信

報名成功、候補遞補、以及未來 30 小時內的活動提醒會走 Resend。沒有 `RESEND_API_KEY` 時函式直接回傳略過。

提醒有兩條路：

- 管理後台首頁的按鈕，用目前管理員的身分寄出。
- `GET /api/cron/reminders`，需要 `CRON_SECRET`。Vercel 的 `vercel.json` 已排每天 00:00 UTC（臺北時間早上 8 點）。

Supabase 模式下，排程與候補信的寄件清單需要 `SUPABASE_SERVICE_ROLE_KEY`。沒有這把金鑰時，會員自己的報名確認信仍可寄（用登入者的信箱），候補遞補信會留在 `email_outbox` 等到有金鑰再送。

## 部署建議：Vercel

建議放在 **Vercel**。這個專案是 Next.js App Router，含 Server Actions、Cookie 工作階段，以及每天一次的提醒。正式網域確定後，再把 `NEXT_PUBLIC_SITE_URL` 設成那個網址。Cloudflare Workers 需要再套 OpenNext，不建議作為第一個正式環境。

## 還需要公司確認

- 官方標誌圖檔。頁首現在是文字，核准後再換上。
- 上課場地的正式地址與租約。現在的地址是示範用的區域說明。
- 海連科技有限公司的正式聯絡方式。法律頁仍是草稿。

## 這一版沒有做的事

- 沒有付款或購物車。合作申請只留下聯絡資料，不在網站上販售商品。
- Google 登入按鈕在示範模式會說明尚未連接；正式環境還要在 Supabase 打開 Google provider。
- 沒有簡訊。
- 法律頁是草稿。
- 不提供診斷、療效或個人健康報告，挑戰也不紀錄產品使用。
