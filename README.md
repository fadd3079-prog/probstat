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

## Milestone 1 Status

This repository currently contains the project foundation: Next.js App Router,
Tailwind CSS, shadcn/ui, a desktop dashboard shell, placeholder dashboard
routes, base domain types, Supabase config placeholders, and initial docs/env
setup.

Supabase Auth, PostgreSQL schema, RLS, data input, statistics formulas, charts,
and export generation are intentionally deferred to later milestones.
