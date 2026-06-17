# InsightGuide

A YouTube channel companion site. Reviews are written, products are listed with "Click here to buy ↗" affiliate links. Zero-cost stack: Next.js 14 (deployed on Vercel) + Supabase (Postgres, Auth, Storage).

## Features
- Public blog: homepage grid, post detail pages with product cards + verdict block
- Search, category filter, related posts
- About page, newsletter capture
- Admin console at `/admin`: login, posts CRUD, multi-product per post, image uploads to Supabase Storage, draft/publish, featured toggle, rating 0–10, verdict paragraph

## Quick start

1. Install deps: `npm install`
2. Set up Supabase: create project, run `supabase/schema.sql`, create public bucket `media`, create an admin user
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ADMIN_EMAILS=you@example.com
   NEXT_PUBLIC_YOUTUBE_URL=https://www.youtube.com/@YourHandle
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Run: `npm run dev`
5. Production build: `npm run build`

Deploy: import this repo in Vercel, paste the same env vars, deploy.
