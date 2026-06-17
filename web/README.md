# ミヤタアスリートクラブ — Web app

Production rebuild of the陸上教室 landing page + recruitment pages + staff admin
dashboard, migrated from the Claude-Design HTML prototypes in `../project/`.

- **Framework:** Next.js 16 (App Router, React 19, TypeScript)
- **Database / Auth:** Supabase (PostgreSQL + Auth)
- **Notifications:** LINE Messaging API (staff push) — optional
- **Payments:** deferred phase (the checkout UI is preserved; enrollment
  applications are stored, but no card is charged yet)

## Pages

| Route          | Source prototype           | Notes |
|----------------|----------------------------|-------|
| `/`            | `Koza Track Kids.dc.html`  | Landing page (hero video, courses, schedule, trial calendar, enrollment & withdrawal modals, coach overlay) |
| `/coach`       | `Coach Recruit.dc.html`    | Coach recruitment + application form |
| `/sponsor`     | `Sponsor Recruit.dc.html`  | Sponsor recruitment + inquiry form |
| `/admin`       | `Admin.dc.html`            | Staff dashboard (auth-gated) |
| `/admin/login` | (login gate)               | Supabase Auth login |

## Forms → API → DB

All public forms POST to server Route Handlers, which insert via the Supabase
service role (browser never touches the DB) and fire a LINE notification:

| Form | Endpoint | Table |
|------|----------|-------|
| 体験・見学予約 | `POST /api/trial` | `trial_entries` |
| 入会申込（決済UI） | `POST /api/enroll` | `enrollments` |
| 退会手続き | `POST /api/withdraw` | `withdrawals` |
| コーチ募集 | `POST /api/coach` | `coach_applications` |
| スポンサー問合せ | `POST /api/sponsor` | `sponsor_inquiries` |

`GET /api/trial?date=YYYY-MM-DD` returns remaining trial capacity (先着5組/日).

## Setup

1. **Create a Supabase project** at https://supabase.com.
2. **Run the schema:** in the Supabase SQL editor, run
   `../supabase/migrations/0001_init.sql` (then optionally `../supabase/seed.sql`
   for demo data).
3. **Env:** copy `.env.example` → `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (Project → API → service_role; **server-only**)
   - `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_NOTIFY_TARGET_ID` (optional)
4. **Create the staff login:** from the repo root run
   `node supabase/setup-staff.mjs` (defaults to ID `Miyata` / password
   `Miyata0305`; override with `STAFF_ID` / `STAFF_PASSWORD`).
5. **Dev:** `npm run dev` → http://localhost:3000

## Deploy (Vercel)

1. Import the repo into Vercel; set the **Root Directory** to `web`.
2. Add the same env vars in Vercel → Project → Settings → Environment Variables.
3. Deploy. (Run the SQL migration + `setup-staff.mjs` against the production
   Supabase project once.)

## Architecture notes

- `lib/supabase/server.ts` — request-scoped client (RLS, staff session)
- `lib/supabase/admin.ts` — service-role client (server only, bypasses RLS)
- `lib/supabase/client.ts` — browser client (admin login)
- `proxy.ts` — Next 16 proxy (was `middleware`); refreshes the session and
  guards `/admin`
- `lib/types.ts` — `COURSE_PLANS` and fee constants are the single source of
  truth for prices (never hardcode money in components)
- `components/Reveal.tsx`, `components/Hoverable.tsx` — reproduce the
  prototype's `data-reveal` scroll animation and `style-hover` effects
- RLS denies anon by default; staff read via session; inserts go through the
  service role in API routes.
