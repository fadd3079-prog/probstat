# Kos Distance Analytics Dashboard

Dashboard akademik desktop-only untuk proyek "Jarak Kos-kosan Mahasiswa di
Sekitar FT Unsoed ke Gerbang Kampus".

Unit observasi adalah kos-kosan. Variabel utama yang dianalisis adalah jarak
kos ke titik acuan gerbang kampus dalam meter. Titik tujuan tetap adalah ATM
BNI dekat gerbang FT Unsoed, mode rute tetap motor, dan jarak diinput manual
dari Google Maps.

## Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui
- Supabase Auth, PostgreSQL, and RLS
- Vercel
- Recharts
- TanStack Table
- React Hook Form and Zod
- Vitest
- SheetJS, jsPDF, and docx for export

## Setup

1. Install dependencies.

```bash
npm install
```

2. Create local environment variables from `.env.example`.

3. Start the development server.

```bash
npm run dev
```

4. Run verification.

```bash
npm run lint
npm run typecheck
npm run build
```

## Milestone Status

Milestone 1 is complete: Next.js App Router, Tailwind CSS, shadcn/ui, a
desktop dashboard shell, placeholder dashboard routes, base domain types, and
initial docs/env setup.

Milestone 2 is complete: Supabase browser/server utilities, login UI, protected
dashboard guard, database migration, RLS policies, role helpers, and Supabase
setup documentation.

Data input, statistics formulas, charts, and export generation are intentionally
deferred to later milestones.

## Supabase

Read [docs/supabase-setup.md](docs/supabase-setup.md) before connecting a real
project. Passwords are managed only by Supabase Auth. Public database tables do
not store password values.
