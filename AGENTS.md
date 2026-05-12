# AGENTS.md

You are working on a professional academic analytics dashboard project.

Project name:
Kos Distance Analytics Dashboard

Main PRD:
docs/prd.md

You must read docs/prd.md fully before making implementation decisions.

Core stack is locked:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Vercel deployment
- Recharts for charts
- TanStack Table for data table
- React Hook Form + Zod for forms and validation
- Vitest for unit testing
- SheetJS for XLSX export
- jsPDF for PDF export
- docx for DOCX export

Do not replace the stack with Python, Java, Express, Flask, Django, Spring Boot, or any unrelated framework.

General engineering rules:
1. Prioritize correctness over speed.
2. Do not implement random features outside the PRD.
3. Use TypeScript strict typing.
4. Keep code modular and readable.
5. Separate UI, database access, validation, statistics logic, and export logic.
6. Raw kos data is the source of truth.
7. Derived statistics must be calculated from raw data.
8. Do not store passwords in public database tables.
9. Use Supabase Auth for login.
10. Use Supabase RLS for authorization.
11. Do not expose Supabase service role key to the browser.
12. Do not scrape Google Maps.
13. Google Maps distance is manually input by users.
14. Route mode is fixed to motor.
15. Target destination is fixed to ATM BNI near the FT Unsoed gate.
16. The app is desktop-only. Mobile optimization is not required.
17. If opened on small screens, show a desktop-only warning.

Academic rules:
1. Unit of observation is kos-kosan, not students.
2. The analyzed variable is distance from kos to campus gate in meters.
3. Do not conclude anything about the number of students living at certain distances.
4. Use proper terms: object/unit observation, sample kos, variable, distance, frequency distribution, descriptive statistics, z-score normalization, normality test.
5. Keep methodology consistent.
6. If data is not normal, do not treat it as failure.

Implementation rules:
1. Before coding, inspect the existing project structure.
2. If the project is empty, initialize the project based on the PRD.
3. Work in small safe steps.
4. After each major change, run lint/build/test if available.
5. If a dependency is needed, explain why before adding it.
6. Create tests for statistical formulas.
7. Do not remove existing code unless necessary.
8. Do not overwrite user work without checking.
9. Keep commits/features logically separated.
10. Update README or docs if behavior changes.

Definition of done:
- Feature works.
- TypeScript has no obvious type errors.
- UI follows the desktop dashboard direction.
- Supabase schema or migration is documented.
- Statistical logic is tested.
- No unrelated feature is added.