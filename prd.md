# Product Requirements Document

# Kos Distance Analytics Dashboard

# Dashboard Analisis Jarak Kos-kosan Mahasiswa di Sekitar FT Unsoed ke Gerbang Kampus

## 0. Ringkasan Dokumen

Dokumen ini adalah Product Requirements Document untuk pengembangan aplikasi berbasis website desktop-only yang digunakan untuk menginput, mengelola, menganalisis, memvisualisasikan, dan mengekspor data jarak kos-kosan mahasiswa di sekitar Fakultas Teknik Universitas Jenderal Soedirman, Balter, Kalimanah, Purbalingga, menuju gerbang kampus FT Unsoed.

Aplikasi ini dirancang sebagai sistem dashboard profesional, bukan hanya form input sederhana. Fokus utama aplikasi adalah membantu kelompok mahasiswa Informatika FT Unsoed dalam tugas mata kuliah Probabilitas dan Statistika, khususnya dalam proses pengumpulan data numerik, pengolahan statistik deskriptif, distribusi frekuensi, normalisasi data, uji normalitas, visualisasi data, serta pembuatan laporan hasil analisis.

Data utama yang dikelola adalah data kos-kosan, bukan data mahasiswa. Dengan demikian, unit observasi dalam sistem ini adalah kos-kosan, sedangkan variabel utama yang dianalisis adalah jarak kos ke titik acuan gerbang kampus dalam satuan meter.

Sistem ini dibuat online menggunakan Vercel dan Supabase agar dapat digunakan oleh seluruh anggota kelompok secara bersama-sama. Setiap anggota memiliki akun masing-masing, sehingga sistem dapat mencatat siapa yang menginput, mengedit, atau menghapus data.

Landasan akademik aplikasi ini mengikuti materi statistika deskriptif, metode sampling, distribusi frekuensi, uji normalitas, dan QQ Plot. Materi statistika deskriptif menjelaskan bahwa statistika mencakup proses mengumpulkan, mengolah, menganalisis, menafsirkan, dan menarik kesimpulan berdasarkan data, serta membedakan populasi, sampel, parameter, statistik, dan statistika deskriptif.  Materi sampling menjelaskan bahwa sampling adalah proses memilih sebagian elemen dari populasi untuk dianalisis, termasuk konsep convenience sampling dan purposive sampling yang relevan untuk pengambilan data kos.  Materi uji normalitas menjelaskan penggunaan hipotesis H0 dan H1, taraf signifikansi 0,05, serta langkah uji Liliefors dengan z-score, F(zi), S(zi), dan L0.  Materi QQ Plot menjelaskan bahwa Q-Q Plot digunakan untuk membandingkan quantile dan dapat membandingkan data dengan distribusi teoritis seperti distribusi normal. 

Dari sisi teknologi, Next.js dipilih karena mendukung App Router, React Server Components, layout, routing berbasis file, loading states, dan error handling yang cocok untuk aplikasi dashboard modern. ([Next.js][1]) Supabase dipilih karena menyediakan Postgres, Auth, dan integrasi Row Level Security untuk authorization; data user Auth dapat dihubungkan dengan tabel public seperti profiles. ([Supabase][2]) Vercel Hobby digunakan untuk deployment gratis personal/small-scale, tetapi tetap harus memperhatikan fair use dan batas penggunaan. ([Vercel][3]) Supabase Free menyediakan 500 MB database, 50.000 monthly active users, 5 GB egress, 5 GB cached egress, dan 1 GB file storage, sehingga cukup untuk kebutuhan tugas kelompok selama pemakaian masih kecil. ([Supabase][4])

---

# 1. Nama Produk

## 1.1 Nama Internal

Kos Distance Analytics Dashboard

## 1.2 Nama Tampilan Aplikasi

Dashboard Analisis Jarak Kos FT Unsoed

## 1.3 Nama Laporan

Jarak Kos-kosan Mahasiswa di Sekitar FT Unsoed ke Gerbang Kampus

## 1.4 Tagline

Input data kos, analisis statistik otomatis, visualisasi lengkap, dan export laporan dalam satu dashboard.

---

# 2. Latar Belakang

Mahasiswa Fakultas Teknik Unsoed yang berkuliah di kawasan Balter, Kalimanah, Purbalingga umumnya tinggal di kos-kosan sekitar kampus. Jarak kos menuju gerbang kampus menjadi salah satu data yang menarik untuk diamati karena berhubungan dengan akses mahasiswa ke kampus, sebaran kos di sekitar kawasan FT, serta variasi lokasi tempat tinggal yang tersedia.

Pada tugas Probabilitas dan Statistika, kelompok membutuhkan data angka yang bisa dianalisis secara statistik. Data jarak kos merupakan data numerik yang cocok karena dapat dihitung rata-ratanya, median, modus, range, standar deviasi, varians, distribusi frekuensi, normalisasi Z-Score, serta dapat diuji normalitasnya.

Namun, jika pengumpulan data dilakukan secara manual menggunakan Excel atau Google Spreadsheet, prosesnya dapat menjadi kurang efisien. Anggota kelompok harus mengisi data manual, membuat rumus manual, membuat grafik manual, dan menyusun laporan secara terpisah. Risiko kesalahan input, rumus salah, data duplikat, dan versi file berbeda juga lebih besar.

Karena kelompok berasal dari Program Studi Informatika, solusi yang lebih tepat adalah membuat dashboard berbasis website. Dashboard ini bukan hanya menyimpan data, tetapi juga memproses data secara otomatis dan menghasilkan analisis statistik yang siap dipakai untuk laporan.

Aplikasi ini akan dibuat online agar semua anggota dapat login dan menginput data masing-masing. Setiap data memiliki identitas penginput, waktu input, status validasi, dan dapat dianalisis secara real-time.

---

# 3. Pernyataan Masalah

## 3.1 Masalah Utama

Kelompok membutuhkan sistem digital yang dapat membantu proses pengumpulan dan analisis data jarak kos ke gerbang FT Unsoed secara lebih efisien, akurat, konsisten, dan mudah dipresentasikan.

## 3.2 Masalah Detail

1. Input data manual di Excel/Google Spreadsheet rawan tidak konsisten.
2. Anggota kelompok dapat memakai format data berbeda.
3. Pengukuran jarak harus memakai metode yang sama, yaitu mode rute motor.
4. Titik tujuan harus sama, yaitu ATM BNI dekat gerbang FT Unsoed.
5. Data harus dapat dianalisis otomatis tanpa menghitung manual satu per satu.
6. Sistem harus dapat membedakan data mentah, data berkelompok, data normalisasi, dan hasil uji normalitas.
7. Sistem harus dapat menampilkan grafik yang relevan dengan statistik.
8. Sistem harus dapat mengekspor data dan laporan ke berbagai format.
9. Sistem harus online tetapi tetap memakai layanan gratis.
10. Sistem harus cukup profesional untuk dipresentasikan sebagai karya mahasiswa Informatika, bukan hanya alat bantu sederhana.

---

# 4. Tujuan Produk

## 4.1 Tujuan Utama

Membangun aplikasi dashboard berbasis website desktop-only untuk mengelola dan menganalisis data jarak kos-kosan mahasiswa di sekitar FT Unsoed menuju gerbang kampus secara otomatis, kolaboratif, dan profesional.

## 4.2 Tujuan Akademik

Aplikasi harus membantu kelompok dalam:

1. Mengumpulkan data jarak kos dalam bentuk angka.
2. Menyajikan data mentah dalam tabel.
3. Mengelompokkan data ke interval jarak.
4. Menghitung statistik deskriptif.
5. Melakukan normalisasi data menggunakan Z-Score.
6. Melakukan uji normalitas, terutama pendekatan Liliefors/Kolmogorov-Smirnov style.
7. Membuat visualisasi berupa histogram, bar chart, boxplot, dan QQ Plot.
8. Menyusun laporan hasil analisis.
9. Menjelaskan metode sampling dan metode pengumpulan data.
10. Menjaga konsistensi metodologi pengukuran.

## 4.3 Tujuan Teknis

Aplikasi harus:

1. Dibuat dengan Next.js dan TypeScript.
2. Menggunakan Supabase sebagai backend, database, dan auth.
3. Menggunakan Vercel sebagai platform deployment.
4. Menggunakan Tailwind CSS dan shadcn/ui untuk tampilan.
5. Menggunakan Recharts untuk visualisasi.
6. Menggunakan GitHub sebagai VCS.
7. Mendukung kerja tim berbasis akun.
8. Mendukung export CSV, XLSX, PDF, DOCX, HTML, dan JSON.
9. Memiliki audit log.
10. Memiliki sistem role admin, member, dan viewer.
11. Memiliki struktur kode yang rapi dan siap dikembangkan.

---

# 5. Non-Goals

Aplikasi ini tidak bertujuan untuk:

1. Menghitung otomatis jarak dari Google Maps API.
2. Menggunakan Google Maps API berbayar.
3. Melakukan scraping Google Maps.
4. Menyimpan data alamat lengkap penghuni kos.
5. Menghitung jumlah mahasiswa penghuni setiap kos.
6. Menyimpulkan bahwa mayoritas mahasiswa tinggal pada jarak tertentu.
7. Menjadi sistem pemetaan kos publik skala besar.
8. Menjadi aplikasi mobile.
9. Menjadi sistem komersial.
10. Menggantikan software statistik profesional seperti SPSS, R, Jamovi, atau Python SciPy.
11. Menggunakan Java Spring Boot.
12. Menggunakan Python sebagai backend utama.
13. Menggunakan Excel sebagai pusat data utama.
14. Membuat sistem marketplace kos.
15. Membuat sistem booking kos.
16. Membuat sistem rekomendasi kos.
17. Memproses data keuangan kos.
18. Menyimpan data pribadi sensitif mahasiswa.
19. Membuat fitur chat antar anggota.
20. Membuat fitur real-time map visual dengan marker kompleks.

---

# 6. Ruang Lingkup Produk

## 6.1 Dalam Ruang Lingkup

1. Login user.
2. Manajemen role user.
3. Input data kos.
4. Edit data kos.
5. Hapus data kos.
6. Tabel data kos.
7. Validasi data.
8. Audit log.
9. Statistik deskriptif.
10. Distribusi frekuensi.
11. Interval manual.
12. Interval otomatis Sturges.
13. Normalisasi Z-Score.
14. Outlier detection.
15. Uji normalitas.
16. QQ Plot.
17. Histogram.
18. Bar chart.
19. Donut chart.
20. Boxplot.
21. Export data.
22. Export laporan.
23. Print report view.
24. Dashboard overview.
25. Filter dan search.
26. Import CSV.
27. Backup JSON.
28. Settings metodologi.
29. Settings interval.
30. Freeze dataset final.

## 6.2 Di Luar Ruang Lingkup

1. Mobile responsive penuh.
2. PWA.
3. Offline mode kompleks.
4. Google Maps API otomatis.
5. Multi-project workspace.
6. Multi-campus support.
7. Payment.
8. Public listing kos.
9. Sistem review kos.
10. Login social provider.
11. Multi-language.
12. Integrasi WhatsApp.
13. Integrasi email automation.
14. AI auto-analysis report.
15. AI auto-detect outlier dari maps.
16. Machine learning.
17. Naive Bayes.
18. Probabilitas Bayes.
19. Prediksi harga kos.
20. Estimasi waktu tempuh real-time.

---

# 7. Prinsip Produk

## 7.1 Prinsip Akademik

1. Data mentah harus selalu tersedia.
2. Analisis tidak boleh hanya berdasarkan data kelompok.
3. Data kelompok dibuat setelah data mentah terkumpul.
4. Kesimpulan harus membahas kos, bukan mahasiswa.
5. Mode rute harus konsisten.
6. Titik tujuan harus konsisten.
7. Metode sampling harus dijelaskan jujur.
8. Data yang tidak normal tidak dianggap gagal.
9. Visualisasi harus membantu interpretasi, bukan hanya mempercantik dashboard.
10. Laporan harus menjelaskan batasan penelitian.

## 7.2 Prinsip Engineering

1. Type-safe first.
2. No duplicated business logic.
3. Raw data is source of truth.
4. Derived statistics should be computed, not stored permanently.
5. Validation must happen on frontend and database.
6. Auth must use Supabase Auth.
7. Authorization must use RLS.
8. UI must be desktop-first.
9. Export must work client-side when possible.
10. Code must be modular and testable.
11. Statistical formulas must have unit tests.
12. No paid API dependency.
13. No unnecessary backend complexity.
14. No over-engineering that harms delivery.
15. But architecture must still look professional and scalable.

---

# 8. Target Pengguna

## 8.1 Admin

Admin adalah ketua kelompok atau penanggung jawab sistem.

### Kebutuhan Admin

1. Mengelola akun anggota.
2. Melihat semua data kos.
3. Mengedit semua data.
4. Menghapus data.
5. Melihat audit log.
6. Mengatur interval jarak.
7. Mengatur metodologi penelitian.
8. Melakukan export laporan final.
9. Freeze dataset final.
10. Reset data dummy.

### Hak Akses Admin

1. Create data.
2. Read all data.
3. Update all data.
4. Delete all data.
5. Export all formats.
6. Manage settings.
7. View audit logs.
8. Manage user role.
9. Freeze/unfreeze dataset.
10. Import CSV.

## 8.2 Member

Member adalah anggota kelompok yang bertugas menginput data.

### Kebutuhan Member

1. Login ke dashboard.
2. Input data kos.
3. Edit data yang dia input sendiri.
4. Melihat hasil analisis.
5. Melihat tabel data.
6. Menggunakan filter.
7. Mengecek apakah datanya valid.
8. Melihat status kontribusi masing-masing anggota.

### Hak Akses Member

1. Create data.
2. Read all data.
3. Update own data.
4. Tidak boleh delete data final.
5. Tidak boleh mengubah settings metodologi.
6. Tidak boleh mengubah role user.
7. Export bisa dibatasi oleh admin.

## 8.3 Viewer

Viewer adalah dosen, asisten, atau anggota yang hanya perlu melihat.

### Kebutuhan Viewer

1. Melihat dashboard.
2. Melihat statistik.
3. Melihat grafik.
4. Melihat laporan.
5. Tidak mengubah data.

### Hak Akses Viewer

1. Read dashboard.
2. Read report.
3. Optional export PDF.
4. No create.
5. No update.
6. No delete.

---

# 9. Definisi Data Penelitian

## 9.1 Unit Observasi

Unit observasi adalah kos-kosan di sekitar FT Unsoed.

## 9.2 Populasi

Populasi adalah seluruh kos-kosan yang berada di sekitar Fakultas Teknik Unsoed, terutama kawasan Balter, Kalimanah, dan area sekitar kampus.

## 9.3 Sampel

Sampel adalah kos-kosan yang berhasil diidentifikasi dan diukur jaraknya oleh kelompok.

Target awal minimal: 30 kos.

## 9.4 Variabel Utama

Nama variabel: jarak kos ke gerbang kampus
Jenis data: numerik
Skala data: rasio
Satuan: meter
Metode pengukuran: Google Maps mode motor
Titik tujuan: ATM BNI dekat gerbang FT Unsoed

## 9.5 Titik Tujuan

Karena titik gerbang FT Unsoed tidak tersedia secara spesifik di Google Maps, titik tujuan yang digunakan adalah ATM BNI dekat gerbang FT Unsoed. Titik ini digunakan sebagai pendekatan karena lokasinya dekat dengan akses masuk gerbang kampus.

## 9.6 Mode Rute

Mode rute dikunci menjadi:

Motor / kendaraan bermotor

Sistem tidak menyediakan pilihan jalan kaki, mobil, atau sepeda agar data tetap konsisten.

## 9.7 Batasan Interpretasi

Data ini menjelaskan sebaran jarak kos-kosan, bukan sebaran tempat tinggal mahasiswa. Jika satu kos dihuni oleh banyak mahasiswa, data tetap dihitung sebagai satu kos, bukan sejumlah penghuni.

---

# 10. Metode Sampling

## 10.1 Metode Utama

Metode sampling yang digunakan adalah purposive convenience sampling.

## 10.2 Alasan

Metode ini dipilih karena:

1. Kos dipilih berdasarkan area yang relevan dengan FT Unsoed.
2. Kos dipilih berdasarkan kemudahan identifikasi melalui Google Maps atau observasi sekitar.
3. Data dikumpulkan dalam waktu terbatas.
4. Tidak tersedia daftar lengkap seluruh kos di sekitar FT Unsoed.
5. Tujuan tugas lebih berfokus pada pengolahan dan analisis data daripada generalisasi populasi besar.

## 10.3 Implementasi di Sistem

Setiap data kos wajib memiliki:

1. Nama kos.
2. Area.
3. Jarak meter.
4. Metode pengukuran.
5. Mode rute.
6. Titik tujuan.
7. Penginput.
8. Waktu input.

## 10.4 Validasi Sampling di Laporan

Sistem harus otomatis menampilkan kalimat metodologi:

“Teknik sampling yang digunakan adalah purposive convenience sampling, yaitu pengambilan sampel berdasarkan kriteria tertentu dan kemudahan akses data. Kriteria yang digunakan adalah kos-kosan yang berada di sekitar Fakultas Teknik Unsoed dan dapat diukur jaraknya menuju titik acuan gerbang kampus menggunakan Google Maps.”

---

# 11. Keputusan Teknologi Final

## 11.1 Frontend

Framework: Next.js
Language: TypeScript
UI Library: React
Styling: Tailwind CSS
Component system: shadcn/ui
Icons: lucide-react
Charts: Recharts
Table: TanStack Table
Form: React Hook Form
Validation: Zod
State server data: TanStack Query atau Supabase client pattern
Date formatting: date-fns
Export XLSX: SheetJS
Export PDF: jsPDF + autoTable / print report
Export DOCX: docx
Testing: Vitest
E2E testing: Playwright
Linting: ESLint
Formatting: Prettier

## 11.2 Backend

Backend utama: Supabase
Database: PostgreSQL
Authentication: Supabase Auth
Authorization: Row Level Security
Storage: Supabase Storage, jika nanti butuh simpan file export atau bukti screenshot
Server logic: Next.js Server Actions / Route Handlers seperlunya
No custom Express server
No Python backend
No Java backend

## 11.3 Deployment

Hosting: Vercel Hobby
Repository: GitHub private repository
CI/CD: Vercel Git integration
Environment variables: Vercel Project Settings
Database hosting: Supabase Free
Domain: Vercel subdomain atau custom domain jika sudah ada

## 11.4 Alasan Tidak Menggunakan Python

Python tidak digunakan sebagai stack utama karena aplikasi ini adalah dashboard web interaktif, bukan notebook data science. Perhitungan statistik yang diperlukan masih dapat dilakukan dengan TypeScript secara efisien, yaitu mean, median, modus, range, varians, standar deviasi, Z-Score, distribusi frekuensi, outlier, dan uji normalitas sederhana.

Python hanya akan menambah kompleksitas deployment, dependency, dan arsitektur. Untuk tugas ini, satu bahasa utama yaitu TypeScript lebih efisien.

## 11.5 Alasan Tidak Menggunakan Java

Java tidak digunakan karena terlalu berat untuk kebutuhan aplikasi ini. Java Spring Boot cocok untuk sistem enterprise berskala besar, tetapi untuk dashboard akademik yang memerlukan deployment gratis, pengembangan cepat, dan integrasi frontend modern, Next.js + Supabase lebih tepat.

## 11.6 Alasan Tidak Menggunakan Excel sebagai Pusat Data

Excel tidak digunakan sebagai pusat data karena:

1. Tidak cocok untuk kolaborasi berbasis akun.
2. Sulit membuat audit log.
3. Rawan konflik versi.
4. Rumus bisa berubah tidak sengaja.
5. Visualisasi dan export laporan tidak sefleksibel dashboard custom.
6. Tidak merepresentasikan kemampuan Informatika secara maksimal.

Excel tetap didukung sebagai format export.

---

# 12. Arsitektur Sistem

## 12.1 High-Level Architecture

User membuka website melalui browser desktop. Website berjalan di Vercel sebagai aplikasi Next.js. User login melalui Supabase Auth. Setelah login, user dapat mengakses dashboard sesuai role. Data kos disimpan di Supabase PostgreSQL. Semua akses data dilindungi oleh Row Level Security. Perhitungan statistik dilakukan di layer TypeScript berdasarkan data mentah dari database. Hasil analisis ditampilkan dalam dashboard dan dapat diekspor ke beberapa format.

## 12.2 Diagram Teks

```text
Desktop Browser
  ↓
Next.js App on Vercel
  ↓
Supabase Auth
  ↓
Supabase PostgreSQL + RLS
  ↓
TypeScript Statistical Engine
  ↓
Dashboard UI + Charts + Reports + Export
```

## 12.3 Prinsip Data Flow

1. User login.
2. Supabase memberikan session.
3. App membaca profile user.
4. App memuat data kos sesuai policy.
5. Statistical engine menghitung data turunan.
6. UI menampilkan hasil.
7. User melakukan input/edit/delete.
8. Database menyimpan perubahan.
9. Audit log mencatat aktivitas.
10. Dashboard refresh.

---

# 13. Struktur Direktori Project

```text
kos-distance-dashboard/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── data-kos/
│   │   │   └── page.tsx
│   │   ├── input/
│   │   │   └── page.tsx
│   │   ├── statistik/
│   │   │   └── page.tsx
│   │   ├── distribusi/
│   │   │   └── page.tsx
│   │   ├── normalitas/
│   │   │   └── page.tsx
│   │   ├── visualisasi/
│   │   │   └── page.tsx
│   │   ├── export/
│   │   │   └── page.tsx
│   │   ├── audit-log/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── export/
│   │   │   └── route.ts
│   │   └── health/
│   │       └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── charts/
│   │   ├── DistanceHistogram.tsx
│   │   ├── FrequencyBarChart.tsx
│   │   ├── FrequencyDonutChart.tsx
│   │   ├── DistanceBoxplot.tsx
│   │   ├── NormalQQPlot.tsx
│   │   └── ContributorChart.tsx
│   ├── dashboard/
│   │   ├── DashboardShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── StatCard.tsx
│   │   ├── MethodologyCard.tsx
│   │   └── DataQualityPanel.tsx
│   ├── forms/
│   │   ├── KosForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── IntervalSettingsForm.tsx
│   │   └── MethodologySettingsForm.tsx
│   ├── tables/
│   │   ├── KosDataTable.tsx
│   │   ├── FrequencyTable.tsx
│   │   ├── ZScoreTable.tsx
│   │   ├── NormalityTable.tsx
│   │   └── AuditLogTable.tsx
│   ├── export/
│   │   ├── ExportPanel.tsx
│   │   ├── ReportPreview.tsx
│   │   └── ExportFormatSelector.tsx
│   └── ui/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── auth.ts
│   │   └── queries.ts
│   ├── statistics/
│   │   ├── descriptive.ts
│   │   ├── frequency.ts
│   │   ├── zscore.ts
│   │   ├── outlier.ts
│   │   ├── normal-cdf.ts
│   │   ├── inverse-normal.ts
│   │   ├── lilliefors.ts
│   │   ├── qqplot.ts
│   │   └── index.ts
│   ├── export/
│   │   ├── csv.ts
│   │   ├── xlsx.ts
│   │   ├── pdf.ts
│   │   ├── docx.ts
│   │   ├── html.ts
│   │   └── json.ts
│   ├── report/
│   │   ├── generate-report-data.ts
│   │   ├── report-copy.ts
│   │   └── report-template.ts
│   ├── validation/
│   │   ├── kos-schema.ts
│   │   ├── auth-schema.ts
│   │   └── settings-schema.ts
│   └── utils/
│       ├── format-number.ts
│       ├── format-date.ts
│       ├── role.ts
│       └── cn.ts
├── types/
│   ├── kos.ts
│   ├── user.ts
│   ├── statistics.ts
│   ├── frequency.ts
│   ├── normality.ts
│   ├── report.ts
│   └── database.ts
├── tests/
│   ├── statistics/
│   │   ├── descriptive.test.ts
│   │   ├── frequency.test.ts
│   │   ├── zscore.test.ts
│   │   ├── outlier.test.ts
│   │   └── lilliefors.test.ts
│   └── export/
│       └── export.test.ts
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── policies.sql
├── public/
├── docs/
│   ├── prd.md
│   ├── methodology.md
│   ├── database.md
│   ├── testing.md
│   └── deployment.md
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── components.json
└── README.md
```

---

# 14. Database Design

## 14.1 Prinsip Database

1. Database hanya menyimpan data utama.
2. Statistik turunan dihitung ulang dari data mentah.
3. Password tidak boleh disimpan manual.
4. User login dikelola oleh Supabase Auth.
5. Tabel profiles hanya menyimpan data tambahan user.
6. Semua tabel penting wajib memakai RLS.
7. Semua perubahan penting dicatat di audit_logs.
8. Soft delete dapat digunakan untuk data penting.
9. Dataset final dapat di-freeze agar tidak berubah menjelang laporan.
10. Database harus cukup sederhana tetapi tetap profesional.

## 14.2 Tabel profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'member', 'viewer')),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## 14.3 Tabel kos_data

```sql
create table public.kos_data (
  id uuid primary key default gen_random_uuid(),
  nama_kos text not null,
  area text,
  jarak_meter integer not null check (jarak_meter > 0),
  google_maps_url text,
  mode_rute text not null default 'motor',
  titik_tujuan text not null default 'ATM BNI dekat gerbang FT Unsoed',
  metode_pengukuran text not null default 'Google Maps mode motor',
  catatan text,
  data_quality_status text not null default 'valid'
    check (data_quality_status in ('valid', 'warning', 'needs_review', 'duplicate_suspected')),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## 14.4 Tabel audit_logs

```sql
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);
```

## 14.5 Tabel app_settings

```sql
create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  description text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);
```

## 14.6 Tabel dataset_snapshots

```sql
create table public.dataset_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_name text not null,
  description text,
  data jsonb not null,
  statistics jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
```

## 14.7 Tabel report_exports

```sql
create table public.report_exports (
  id uuid primary key default gen_random_uuid(),
  export_type text not null check (export_type in ('csv', 'xlsx', 'pdf', 'docx', 'html', 'json')),
  file_name text not null,
  file_url text,
  export_metadata jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
```

---

# 15. Row Level Security Requirements

## 15.1 profiles

Admin dapat membaca semua profile. Member dan viewer hanya dapat membaca profile aktif yang diperlukan untuk menampilkan nama penginput. User dapat membaca profile sendiri.

## 15.2 kos_data

Admin:

1. Select semua data.
2. Insert data.
3. Update semua data.
4. Soft delete semua data.

Member:

1. Select semua data yang tidak dihapus.
2. Insert data.
3. Update data yang created_by sama dengan user id sendiri.
4. Tidak boleh delete permanen.
5. Soft delete sendiri hanya jika dataset belum freeze.

Viewer:

1. Select data yang tidak dihapus.
2. Tidak boleh insert.
3. Tidak boleh update.
4. Tidak boleh delete.

## 15.3 app_settings

Admin dapat select, insert, update. Member dan viewer hanya dapat select.

## 15.4 audit_logs

Admin dapat select semua. Member dapat select log miliknya sendiri. Viewer tidak perlu akses audit log.

## 15.5 dataset_snapshots

Admin dapat membuat snapshot. Member dan viewer dapat membaca snapshot final jika diperlukan.

---

# 16. Authentication Requirements

## 16.1 Login

Login menggunakan email dan password.

Field:

1. Email.
2. Password.
3. Remember session.

Validasi:

1. Email wajib valid.
2. Password wajib diisi.
3. Error message tidak boleh membocorkan apakah email terdaftar atau tidak secara detail.
4. Jika login gagal, tampilkan pesan umum.

## 16.2 User Provisioning

Admin membuat akun anggota di Supabase Auth atau melalui Supabase dashboard. Setelah user dibuat, admin membuat profile user dengan role yang sesuai.

## 16.3 Password Handling

Password tidak boleh disimpan di tabel public. Password hanya dikelola oleh Supabase Auth.

## 16.4 Shared Account Policy

Satu akun bersama dilarang. Setiap anggota harus memakai akun sendiri agar audit log akurat.

## 16.5 Session

User yang belum login tidak boleh mengakses dashboard. Jika session habis, user diarahkan ke login.

## 16.6 Logout

User dapat logout dari topbar.

---

# 17. Data Input Requirements

## 17.1 Form Input Kos

Field wajib:

1. Nama kos.
2. Area.
3. Jarak meter.
4. Google Maps URL.
5. Catatan opsional.

Field otomatis:

1. Mode rute = motor.
2. Titik tujuan = ATM BNI dekat gerbang FT Unsoed.
3. Metode pengukuran = Google Maps mode motor.
4. Created by = user login.
5. Created at = timestamp.

## 17.2 Validasi Input

Nama kos:

1. Wajib diisi.
2. Minimal 3 karakter.
3. Maksimal 120 karakter.
4. Trim whitespace.
5. Tidak boleh hanya angka.

Area:

1. Opsional tetapi disarankan.
2. Maksimal 100 karakter.
3. Contoh: Balter, Kalimanah, dekat FT, sekitar kampus.

Jarak:

1. Wajib diisi.
2. Harus angka integer.
3. Satuan meter.
4. Minimal 1.
5. Maksimal default 10000.
6. Jika lebih dari 3000 meter, status warning.
7. Jika lebih dari 5000 meter, status needs_review.

Google Maps URL:

1. Wajib atau minimal recommended tergantung settings.
2. Jika diisi harus valid URL.
3. Tidak perlu diverifikasi otomatis dengan Google API.

Catatan:

1. Opsional.
2. Maksimal 500 karakter.
3. Dapat dipakai untuk menjelaskan kondisi data.

## 17.3 Duplicate Detection

Sistem harus memberikan warning jika:

1. Nama kos sama persis.
2. Nama kos sangat mirip.
3. Jarak sama dan area sama dengan data lain.
4. Google Maps URL sama.

Sistem tidak langsung menolak duplikat karena bisa saja ada nama kos mirip. Sistem hanya memberi status duplicate_suspected.

## 17.4 Data Quality Status

Status data:

1. valid
2. warning
3. needs_review
4. duplicate_suspected

Kriteria:

valid:

1. Semua field wajib benar.
2. Jarak dalam batas wajar.
3. Tidak terdeteksi duplikat.

warning:

1. Jarak lebih dari 3000 meter.
2. Google Maps URL kosong jika setting tidak mewajibkan.
3. Area kosong.

needs_review:

1. Jarak lebih dari 5000 meter.
2. Nama kos terlalu pendek.
3. Data terlihat tidak wajar.

duplicate_suspected:

1. Nama kos mirip dengan data lain.
2. Link sama dengan data lain.

---

# 18. Data Table Requirements

## 18.1 Kolom Tabel

Tabel utama harus menampilkan:

1. No.
2. Nama Kos.
3. Area.
4. Jarak.
5. Interval.
6. Z-Score.
7. Status Jarak.
8. Data Quality.
9. Input Oleh.
10. Tanggal Input.
11. Tanggal Update.
12. Aksi.

## 18.2 Status Jarak Berdasarkan Z-Score

1. Z < -1: Lebih dekat dari rata-rata.
2. -1 <= Z <= 1: Sekitar rata-rata.
3. Z > 1: Lebih jauh dari rata-rata.
4. Z > 2 atau Z < -2: Potensial ekstrem.
5. Berdasarkan IQR outlier: outlier.

## 18.3 Fitur Tabel

1. Search nama kos.
2. Filter area.
3. Filter interval.
4. Filter data quality.
5. Filter penginput.
6. Sort jarak ascending.
7. Sort jarak descending.
8. Sort tanggal input.
9. Pagination.
10. Row density compact/default/comfortable.
11. Column visibility.
12. Export filtered data.
13. Bulk review.
14. Bulk validate by admin.
15. Copy row data.

## 18.4 Row Actions

Admin:

1. View detail.
2. Edit.
3. Duplicate.
4. Soft delete.
5. Mark valid.
6. Mark needs review.

Member:

1. View detail.
2. Edit own data.
3. Duplicate own data.
4. Request delete.

Viewer:

1. View detail.

---

# 19. Dashboard Overview Requirements

## 19.1 Top KPI Cards

Dashboard utama harus memiliki KPI cards:

1. Total Kos.
2. Data Valid.
3. Data Perlu Review.
4. Rata-rata Jarak.
5. Median Jarak.
6. Jarak Terdekat.
7. Jarak Terjauh.
8. Standar Deviasi.
9. Interval Terbanyak.
10. Status Normalitas.
11. Total Penginput Aktif.
12. Dataset Freeze Status.

## 19.2 Dashboard CTA

CTA utama:

1. Tambah Data Kos.
2. Import CSV.
3. Lihat Statistik.
4. Lihat Normalitas.
5. Export Laporan.
6. Review Data Bermasalah.
7. Freeze Dataset.
8. Buka Preview Laporan.

CTA harus kontekstual. Jika data kurang dari 30, tampilkan CTA:

“Lengkapi data sampai minimal 30 kos.”

Jika ada data needs_review, tampilkan CTA:

“Review data bermasalah sebelum export laporan.”

Jika dataset belum freeze, tampilkan CTA:

“Freeze dataset final sebelum membuat laporan.”

## 19.3 Data Quality Panel

Panel kualitas data menampilkan:

1. Total data.
2. Jumlah valid.
3. Jumlah warning.
4. Jumlah needs_review.
5. Jumlah duplicate_suspected.
6. Persentase kelengkapan Google Maps URL.
7. Persentase data yang sudah punya area.
8. Data jarak ekstrem.
9. Rekomendasi tindakan.

## 19.4 Methodology Card

Card ini menampilkan metodologi penelitian:

1. Unit observasi: kos-kosan.
2. Variabel: jarak kos ke gerbang.
3. Satuan: meter.
4. Mode rute: motor.
5. Titik tujuan: ATM BNI dekat gerbang FT Unsoed.
6. Metode pengumpulan: Google Maps.
7. Metode sampling: purposive convenience sampling.
8. Jumlah sampel saat ini.
9. Catatan batasan interpretasi.

---

# 20. Statistical Engine Requirements

## 20.1 General Rules

1. Semua perhitungan statistik menggunakan data `jarak_meter`.
2. Data yang `is_deleted = true` tidak dihitung.
3. Data yang `needs_review` tetap dapat dihitung, tetapi dashboard memberi warning.
4. Statistik utama memakai sample statistics karena data adalah sampel kos.
5. Semua angka ditampilkan maksimal 2 digit desimal.
6. Semua rumus harus memiliki unit test.

## 20.2 Required Descriptive Statistics

Statistical engine harus menghitung:

1. n.
2. sum.
3. min.
4. max.
5. range.
6. mean.
7. median.
8. mode raw jika ada.
9. mode interval.
10. Q1.
11. Q2.
12. Q3.
13. IQR.
14. lower fence.
15. upper fence.
16. outliers.
17. sample variance.
18. sample standard deviation.
19. population variance.
20. population standard deviation.
21. coefficient of variation.
22. skewness sederhana.
23. kurtosis opsional.
24. percentile 10.
25. percentile 25.
26. percentile 50.
27. percentile 75.
28. percentile 90.

## 20.3 Mean

Formula:

mean = sum(x) / n

## 20.4 Median

Jika n ganjil, median adalah data tengah setelah diurutkan.
Jika n genap, median adalah rata-rata dua data tengah.

## 20.5 Sample Variance

Formula:

s² = Σ(xi - mean)² / (n - 1)

## 20.6 Sample Standard Deviation

Formula:

s = √s²

## 20.7 Population Variance

Formula:

σ² = Σ(xi - mean)² / n

## 20.8 Population Standard Deviation

Formula:

σ = √σ²

## 20.9 Coefficient of Variation

Formula:

CV = s / mean × 100%

Interpretasi:

1. CV kecil: data relatif rapat.
2. CV besar: data menyebar.
3. Jika mean 0, CV tidak dihitung.

## 20.10 Outlier Detection

Metode utama: IQR.

Formula:

Q1 = persentil 25
Q3 = persentil 75
IQR = Q3 - Q1
Lower fence = Q1 - 1.5 × IQR
Upper fence = Q3 + 1.5 × IQR

Data dianggap outlier jika:

x < lower fence atau x > upper fence

## 20.11 Z-Score

Formula:

Z = (X - mean) / sample standard deviation

Jika standar deviasi = 0, Z-Score semua data = 0 atau null dengan warning.

## 20.12 Interpretasi Z-Score

1. Z < 0: jarak di bawah rata-rata.
2. Z = 0: jarak sama dengan rata-rata.
3. Z > 0: jarak di atas rata-rata.
4. |Z| >= 2: data cukup jauh dari rata-rata.
5. |Z| >= 3: data sangat ekstrem.

---

# 21. Frequency Distribution Requirements

## 21.1 Interval Manual Default

Default interval:

1. 0–250 m.
2. 251–500 m.
3. 501–750 m.
4. 751–1000 m.
5. 1001–1250 m.
6. 1251–1500 m.
7. 1501–1750 m.
8. 1751–2000 m.
9. > 2000 m.

## 21.2 Interval Otomatis Sturges

Sistem harus menyediakan mode Sturges.

Formula:

k = 1 + 3.3 log10(n)

Range:

R = max - min

Panjang interval:

i = R / k

Materi dosen juga memakai langkah minimum-maksimum, range, banyak kelas Sturges, panjang interval, dan susunan interval kelas untuk distribusi frekuensi berkelompok. 

## 21.3 Frequency Table Columns

Tabel distribusi frekuensi harus menampilkan:

1. Interval.
2. Batas bawah.
3. Batas atas.
4. Titik tengah.
5. Frekuensi.
6. Frekuensi relatif.
7. Persentase.
8. Frekuensi kumulatif.
9. Persentase kumulatif.

## 21.4 Mode Interval

Mode interval adalah interval dengan frekuensi terbesar.

Jika ada dua interval dengan frekuensi sama, sistem menampilkan:

“Data memiliki lebih dari satu interval dengan frekuensi tertinggi.”

## 21.5 Frequency Interpretation Generator

Sistem harus menghasilkan kalimat otomatis:

“Interval jarak dengan jumlah kos terbanyak adalah [interval], yaitu sebanyak [n] kos atau [persentase]% dari total data.”

---

# 22. Normality Test Requirements

## 22.1 Uji Normalitas Utama

Metode utama: Liliefors-style normality test.

## 22.2 Hipotesis

H0: Sampel data jarak kos berasal dari populasi yang berdistribusi normal.
H1: Sampel data jarak kos tidak berasal dari populasi yang berdistribusi normal.

## 22.3 Taraf Signifikansi

α = 0,05

## 22.4 Langkah Perhitungan

1. Ambil data jarak.
2. Urutkan dari kecil ke besar.
3. Hitung mean.
4. Hitung standar deviasi.
5. Hitung Z-Score tiap data.
6. Hitung F(zi), yaitu peluang distribusi normal baku.
7. Hitung S(zi), yaitu proporsi kumulatif empiris.
8. Hitung |F(zi) - S(zi)|.
9. Ambil nilai maksimum sebagai Lhitung.
10. Ambil Ltabel berdasarkan n dan α.
11. Bandingkan Lhitung dan Ltabel.
12. Buat keputusan.

## 22.5 Decision Rule

Jika Lhitung < Ltabel, maka H0 diterima.
Jika Lhitung > Ltabel, maka H0 ditolak.

## 22.6 Output Normality Test

Output harus menampilkan:

1. n.
2. α.
3. mean.
4. standard deviation.
5. Lhitung.
6. Ltabel.
7. H0.
8. H1.
9. Keputusan.
10. Interpretasi.

## 22.7 Normality Detail Table

Kolom tabel:

1. No.
2. Nama kos.
3. Jarak.
4. Zi.
5. F(zi).
6. S(zi).
7. |F(zi) - S(zi)|.

## 22.8 Warning Sample Size

Jika n < 30:

“Sampel kurang dari 30, hasil uji normalitas perlu ditafsirkan dengan hati-hati.”

Jika n >= 30:

“Jumlah sampel sudah memenuhi batas minimal umum untuk analisis awal.”

Jika n > 100:

“Jumlah sampel lebih kuat untuk analisis visual.”

## 22.9 Normality Interpretation Generator

Jika normal:

“Berdasarkan hasil uji normalitas, diperoleh Lhitung sebesar [x] dan Ltabel sebesar [y]. Karena Lhitung < Ltabel, maka H0 diterima. Dengan demikian, data jarak kos dapat dikatakan berdistribusi normal pada taraf signifikansi 5%.”

Jika tidak normal:

“Berdasarkan hasil uji normalitas, diperoleh Lhitung sebesar [x] dan Ltabel sebesar [y]. Karena Lhitung > Ltabel, maka H0 ditolak. Dengan demikian, data jarak kos tidak berdistribusi normal pada taraf signifikansi 5%.”

---

# 23. QQ Plot Requirements

## 23.1 Tujuan QQ Plot

QQ Plot digunakan sebagai visualisasi pendukung untuk melihat apakah data jarak kos mendekati pola distribusi normal.

## 23.2 Data yang Digunakan

1. Sample quantiles dari data jarak.
2. Theoretical quantiles dari distribusi normal baku.
3. Reference line berdasarkan mean dan standard deviation.

## 23.3 Output

Chart harus menampilkan:

1. Titik data.
2. Garis referensi.
3. Label sumbu X: Theoretical Quantiles.
4. Label sumbu Y: Sample Quantiles.
5. Tooltip berisi nama kos dan jarak.
6. Ringkasan interpretasi.

## 23.4 Interpretasi

Jika titik mendekati garis:

“Sebagian besar titik pada QQ Plot berada dekat dengan garis referensi, sehingga secara visual data cenderung mendekati distribusi normal.”

Jika titik menyimpang:

“Beberapa titik pada QQ Plot terlihat menyimpang dari garis referensi, terutama pada bagian ekor distribusi. Hal ini menunjukkan adanya kemungkinan data tidak sepenuhnya mengikuti distribusi normal.”

## 23.5 Warning

Materi QQ Plot juga memberi catatan bahwa QQ Plot pada sampel kecil dapat kurang stabil, terutama pada bagian ekor. Karena itu, sistem harus menampilkan warning bahwa QQ Plot hanya visual pendukung, bukan satu-satunya dasar keputusan. 

---

# 24. Visualization Requirements

## 24.1 Histogram

Histogram menampilkan distribusi jarak kos.

Requirements:

1. X-axis: interval jarak.
2. Y-axis: jumlah kos.
3. Tooltip: interval, frekuensi, persentase.
4. Menggunakan interval manual atau Sturges.
5. Ada interpretasi otomatis.

## 24.2 Bar Chart Distribusi Frekuensi

Menampilkan jumlah kos per interval.

Requirements:

1. Lebih eksplisit daripada histogram.
2. Cocok untuk presentasi.
3. Harus sama dengan tabel distribusi.
4. Ada label jumlah.

## 24.3 Donut Chart Persentase Interval

Menampilkan komposisi persentase kos berdasarkan interval.

Requirements:

1. Tidak boleh menjadi grafik utama.
2. Digunakan sebagai ringkasan visual.
3. Tooltip menampilkan persentase dan jumlah kos.

## 24.4 Boxplot

Menampilkan:

1. Minimum.
2. Q1.
3. Median.
4. Q3.
5. Maximum.
6. Outlier.

Boxplot harus digunakan untuk menjelaskan sebaran data dan outlier.

## 24.5 QQ Plot

Sudah dijelaskan di bagian 23.

## 24.6 Scatter Plot

Scatter plot menampilkan jarak berdasarkan urutan input atau urutan jarak.

Requirements:

1. X-axis: index data.
2. Y-axis: jarak meter.
3. Tooltip: nama kos dan jarak.
4. Bisa melihat data ekstrem.

## 24.7 Contributor Chart

Menampilkan kontribusi input data per anggota.

Requirements:

1. Nama anggota.
2. Jumlah data input.
3. Persentase kontribusi.
4. Data valid vs data warning.

## 24.8 Jangan Gunakan Grafik yang Tidak Relevan

Line chart tidak digunakan sebagai grafik utama karena data bukan time series. Line chart hanya boleh digunakan untuk aktivitas input data per hari.

---

# 25. Export Requirements

## 25.1 Format Export

Aplikasi harus mendukung export:

1. CSV.
2. XLSX.
3. PDF.
4. DOCX.
5. HTML.
6. JSON.

## 25.2 Export Data Mentah

Format:

1. CSV.
2. XLSX.
3. JSON.

Isi:

1. Nama kos.
2. Area.
3. Jarak meter.
4. Interval.
5. Z-Score.
6. Status.
7. Google Maps URL.
8. Mode rute.
9. Titik tujuan.
10. Input oleh.
11. Created at.
12. Updated at.

## 25.3 Export Analisis Statistik

Format:

1. XLSX.
2. PDF.
3. DOCX.
4. HTML.

Isi:

1. Statistik deskriptif.
2. Distribusi frekuensi.
3. Z-Score.
4. Outlier.
5. Uji normalitas.
6. Interpretasi.

## 25.4 Export Laporan Lengkap

Format:

1. PDF.
2. DOCX.
3. HTML.

Isi laporan:

1. Cover.
2. Judul.
3. Identitas kelompok.
4. Pendahuluan.
5. Rumusan masalah.
6. Tujuan.
7. Metode penelitian.
8. Populasi dan sampel.
9. Metode sampling.
10. Metode pengumpulan data.
11. Batasan penelitian.
12. Data mentah.
13. Distribusi frekuensi.
14. Statistik deskriptif.
15. Normalisasi Z-Score.
16. Uji normalitas.
17. Visualisasi.
18. Pembahasan.
19. Kesimpulan.
20. Lampiran.

## 25.5 Export Preview

Sebelum export, sistem harus menampilkan preview laporan.

## 25.6 Print-Friendly HTML

Export HTML harus menghasilkan halaman laporan yang bisa dicetak dari browser.

---

# 26. Report Generator Requirements

## 26.1 Report Sections

Report generator harus membuat struktur laporan otomatis.

### 26.1.1 Judul

“Jarak Kos-kosan Mahasiswa di Sekitar FT Unsoed ke Gerbang Kampus”

### 26.1.2 Pendahuluan

Sistem menyediakan draft narasi formal mahasiswa.

### 26.1.3 Rumusan Masalah

1. Bagaimana sebaran jarak kos-kosan di sekitar FT Unsoed menuju gerbang kampus?
2. Berapa rata-rata, median, range, dan standar deviasi jarak kos?
3. Bagaimana distribusi frekuensi jarak kos berdasarkan interval tertentu?
4. Apakah data jarak kos berdistribusi normal?

### 26.1.4 Tujuan

1. Mengumpulkan data jarak kos-kosan.
2. Mengelompokkan data jarak ke dalam interval.
3. Menghitung statistik deskriptif.
4. Melakukan normalisasi data.
5. Menguji normalitas data.
6. Menampilkan hasil dalam bentuk grafik.

### 26.1.5 Metode

Harus otomatis mengambil settings:

1. Mode rute.
2. Titik tujuan.
3. Metode sampling.
4. Jumlah sampel.
5. Tanggal pengambilan data.
6. Penginput data.

### 26.1.6 Pembahasan

Sistem harus membuat template pembahasan otomatis berdasarkan hasil.

### 26.1.7 Kesimpulan

Sistem membuat kesimpulan otomatis tetapi tetap bisa diedit manual.

## 26.2 Editable Report Text

Report preview harus memungkinkan admin mengedit teks sebelum export.

Field editable:

1. Pendahuluan.
2. Metode.
3. Pembahasan.
4. Kesimpulan.
5. Catatan tambahan.

## 26.3 Report Tone

Bahasa laporan:

1. Formal.
2. Natural mahasiswa.
3. Tidak terlalu generik.
4. Tidak terlalu berlebihan.
5. Tidak memakai klaim yang tidak didukung data.

---

# 27. UI/UX Requirements

## 27.1 Desktop Only

Target minimum viewport:

1. 1366 × 768.
2. Optimized untuk 1440 × 900.
3. Tidak perlu mobile layout.
4. Jika dibuka di mobile, tampilkan pesan:

“Aplikasi ini dirancang untuk desktop. Silakan buka melalui laptop atau komputer agar dashboard tampil optimal.”

## 27.2 Layout

Layout utama:

1. Sidebar kiri fixed.
2. Topbar atas.
3. Main content scrollable.
4. Card grid.
5. Tabel lebar.
6. Chart grid 2 kolom.
7. Report preview full width.

## 27.3 Sidebar Navigation

Menu:

1. Dashboard.
2. Input Data.
3. Data Kos.
4. Statistik.
5. Distribusi.
6. Normalitas.
7. Visualisasi.
8. Export.
9. Audit Log.
10. Settings.
11. Logout.

## 27.4 Visual Style

Style:

1. Bersih.
2. Akademik.
3. Modern.
4. Dashboard analytics.
5. Tidak terlalu ramai.
6. Warna netral.
7. Kontras jelas.
8. Font mudah dibaca.
9. Card dengan border halus.
10. Shadow tipis.

## 27.5 Tailwind Style Direction

Gunakan:

1. `bg-slate-50`
2. `bg-white`
3. `border-slate-200`
4. `text-slate-900`
5. `text-slate-600`
6. `rounded-2xl`
7. `shadow-sm`
8. `p-6`
9. `gap-6`
10. `grid-cols-12`

## 27.6 Dashboard Density

Karena desktop-only, dashboard boleh padat tetapi tetap rapi.

1. KPI card 4 kolom.
2. Chart 2 kolom.
3. Tabel full width.
4. Filter horizontal.
5. Export panel kanan atau modal.

## 27.7 Empty State

Jika belum ada data:

Tampilkan:

1. Ilustrasi sederhana.
2. Text: “Belum ada data kos.”
3. CTA: “Tambah Data Kos Pertama.”
4. CTA: “Import CSV.”

## 27.8 Loading State

Gunakan skeleton loading untuk:

1. KPI cards.
2. Tabel.
3. Charts.
4. Report preview.

## 27.9 Error State

Jika data gagal dimuat:

1. Tampilkan pesan error.
2. Tampilkan tombol retry.
3. Jangan tampilkan stack trace ke user.

---

# 28. Performance Requirements

## 28.1 Target Performance

1. Initial dashboard load < 3 detik pada koneksi normal.
2. Table interaction < 300 ms untuk 1000 data.
3. Statistik recompute < 500 ms untuk 5000 data.
4. Export CSV < 2 detik untuk 5000 data.
5. Export PDF < 10 detik untuk laporan penuh.
6. Bundle harus dijaga agar tidak terlalu besar.

## 28.2 Optimization

1. Gunakan memoization untuk statistik.
2. Gunakan pagination tabel.
3. Gunakan dynamic import untuk export library berat.
4. Jangan load jsPDF/docx/SheetJS di initial bundle.
5. Chart hanya render saat data tersedia.
6. Avoid unnecessary re-render.
7. Gunakan React Server Components untuk halaman yang cocok.
8. Client component hanya untuk interaksi.

---

# 29. Security Requirements

## 29.1 Authentication

1. Semua halaman dashboard wajib login.
2. Session harus diverifikasi.
3. Logout harus clear session.
4. Tidak ada data dashboard untuk public user.

## 29.2 Authorization

1. Role harus dicek di frontend dan database.
2. RLS menjadi layer utama.
3. Frontend role check hanya untuk UX, bukan keamanan utama.

## 29.3 Data Protection

1. Jangan simpan password di database public.
2. Jangan expose service role key ke browser.
3. Jangan commit env file.
4. Jangan tampilkan anon key sebagai rahasia; anon key boleh public tetapi RLS wajib aktif.
5. Jangan simpan alamat pribadi detail penghuni kos.
6. Google Maps URL boleh disimpan, tetapi gunakan dengan hati-hati.
7. Data export hanya untuk user login.

## 29.4 Audit

Audit log wajib mencatat:

1. Create data.
2. Update data.
3. Delete data.
4. Restore data.
5. Freeze dataset.
6. Export report.
7. Change settings.
8. Change user role.

---

# 30. Audit Log Requirements

## 30.1 Event yang Dicatat

1. User login.
2. Data kos dibuat.
3. Data kos diedit.
4. Data kos dihapus.
5. Data kos dipulihkan.
6. Import CSV.
7. Export laporan.
8. Settings interval diubah.
9. Settings metodologi diubah.
10. Dataset freeze.
11. Dataset unfreeze.
12. Role user diubah.

## 30.2 Audit Log Columns

1. Waktu.
2. User.
3. Role.
4. Action.
5. Table.
6. Record.
7. Old value.
8. New value.
9. IP address jika tersedia.
10. User agent jika tersedia.

## 30.3 Audit Log UI

Fitur:

1. Filter by user.
2. Filter by action.
3. Filter by date.
4. Search.
5. View JSON diff.
6. Export audit log CSV.

---

# 31. Dataset Freeze Requirements

## 31.1 Tujuan

Freeze dataset digunakan saat data sudah final untuk laporan agar tidak berubah lagi.

## 31.2 Behavior

Jika dataset freeze aktif:

1. Member tidak bisa tambah data.
2. Member tidak bisa edit data.
3. Admin masih bisa unfreeze.
4. Dashboard menampilkan badge “Dataset Final”.
5. Export laporan memakai snapshot final.

## 31.3 Freeze Flow

1. Admin klik “Freeze Dataset”.
2. Sistem menampilkan ringkasan:

   * Total data.
   * Data valid.
   * Warning.
   * Needs review.
3. Admin harus konfirmasi.
4. Sistem membuat dataset snapshot.
5. Status freeze aktif.

## 31.4 Unfreeze Flow

1. Admin klik “Unfreeze”.
2. Sistem meminta alasan.
3. Audit log mencatat alasan.
4. Data dapat diedit lagi.

---

# 32. Import CSV Requirements

## 32.1 Tujuan

Import CSV digunakan jika data awal sudah dikumpulkan manual dan ingin dimasukkan sekaligus.

## 32.2 CSV Columns

Required:

1. nama_kos
2. jarak_meter

Optional:

1. area
2. google_maps_url
3. catatan

## 32.3 Validation

Saat import:

1. Preview data.
2. Validasi setiap row.
3. Tampilkan error row.
4. Tampilkan duplicate warning.
5. Admin dapat memilih import valid rows only.
6. Semua data hasil import created_by = user yang import.
7. Audit log mencatat import.

---

# 33. Settings Requirements

## 33.1 Methodology Settings

Admin dapat mengatur:

1. Judul penelitian.
2. Nama kampus.
3. Lokasi.
4. Titik tujuan.
5. Mode rute.
6. Metode pengukuran.
7. Metode sampling.
8. Target jumlah sampel.
9. Tanggal mulai pengumpulan data.
10. Tanggal selesai pengumpulan data.

Mode rute harus default motor dan terkunci. Perubahan hanya dapat dilakukan admin dengan konfirmasi besar karena akan memengaruhi metodologi.

## 33.2 Interval Settings

Admin dapat mengatur:

1. Interval manual.
2. Mode Sturges.
3. Default interval.
4. Label interval.
5. Batas bawah.
6. Batas atas.

## 33.3 Export Settings

Admin dapat mengatur:

1. Nama kelompok.
2. Nama anggota.
3. Nama mata kuliah.
4. Nama dosen.
5. Program studi.
6. Fakultas.
7. Universitas.
8. Tahun akademik.
9. Format nomor halaman.
10. Include/exclude chart.

---

# 34. Testing Requirements

## 34.1 Unit Test

Wajib test:

1. Mean.
2. Median ganjil.
3. Median genap.
4. Range.
5. Variance sample.
6. Variance population.
7. Standard deviation sample.
8. Z-Score.
9. Frequency interval manual.
10. Frequency Sturges.
11. IQR.
12. Outlier.
13. Normal CDF.
14. Lilliefors calculation.
15. QQ plot data generation.

## 34.2 Integration Test

Test:

1. Login flow.
2. Insert kos.
3. Edit kos.
4. Delete kos.
5. Role restriction.
6. Export CSV.
7. Export XLSX.
8. Export report preview.
9. Settings update.
10. Freeze dataset.

## 34.3 E2E Test

Flow utama:

1. Admin login.
2. Tambah data kos.
3. Member login.
4. Member tambah data.
5. Dashboard update.
6. Admin lihat statistik.
7. Admin export laporan.
8. Admin freeze dataset.

## 34.4 Manual QA Checklist

1. Semua menu terbuka.
2. Semua KPI sesuai data.
3. Tabel tidak error saat kosong.
4. Statistik benar untuk 30 data dummy.
5. Grafik sesuai tabel frekuensi.
6. Export file dapat dibuka.
7. PDF tidak terpotong.
8. DOCX dapat dibuka di Word.
9. XLSX dapat dibuka di Excel/Google Sheets.
10. RLS tidak bisa ditembus user biasa.

---

# 35. Git Workflow

## 35.1 Repository

GitHub private repository.

## 35.2 Branch

Branches:

1. main
2. develop
3. feature/auth
4. feature/database
5. feature/input-kos
6. feature/data-table
7. feature/statistics-engine
8. feature/charts
9. feature/export
10. feature/normality
11. feature/report
12. feature/settings

## 35.3 Rules

1. Jangan push langsung ke main.
2. Semua fitur dibuat di branch.
3. Merge lewat pull request.
4. PR harus dicek minimal satu anggota.
5. Codex boleh dipakai untuk review, tetapi keputusan tetap manusia.
6. Main hanya berisi versi stabil.
7. Vercel deploy dari main.
8. Preview deploy dari PR boleh digunakan.

## 35.4 Commit Message

Format:

```text
type(scope): message
```

Contoh:

```text
feat(auth): add login page
feat(stats): implement z-score calculation
fix(export): prevent pdf table overflow
refactor(charts): split histogram component
test(stats): add variance unit test
docs(prd): update product requirements
```

---

# 36. Codex Usage Rules

## 36.1 Codex Digunakan Untuk

1. Generate komponen UI.
2. Menulis function statistik.
3. Membuat unit test.
4. Refactor kode.
5. Review bug.
6. Membaca error build.
7. Membantu membuat SQL migration.
8. Membantu membuat export.
9. Membantu membuat dokumentasi.
10. Membantu menyusun report template.

## 36.2 Codex Tidak Boleh Digunakan Tanpa Review

1. Mengubah RLS policy tanpa dicek.
2. Menghapus data migration.
3. Mengubah rumus statistik tanpa test.
4. Menghapus audit log.
5. Mengubah authentication flow.
6. Mengubah environment variable.
7. Merge langsung ke main.

## 36.3 Prompt Standar Untuk Codex

Gunakan prompt seperti:

“Baca PRD di docs/prd.md. Implementasikan fitur [nama fitur] sesuai requirement. Jangan mengubah scope lain. Gunakan TypeScript strict, Tailwind CSS, shadcn/ui, dan pastikan logic statistik punya unit test.”

---

# 37. Acceptance Criteria Umum

Produk dianggap berhasil jika:

1. User dapat login.
2. Admin/member/viewer memiliki akses berbeda.
3. Anggota dapat input data kos.
4. Data tersimpan di Supabase.
5. Dashboard menampilkan statistik otomatis.
6. Distribusi frekuensi muncul otomatis.
7. Normalisasi Z-Score muncul otomatis.
8. Uji normalitas muncul otomatis.
9. QQ Plot tampil.
10. Histogram tampil.
11. Boxplot tampil.
12. Export CSV berhasil.
13. Export XLSX berhasil.
14. Export PDF berhasil.
15. Export DOCX berhasil.
16. Export HTML berhasil.
17. Audit log bekerja.
18. Dataset dapat di-freeze.
19. Aplikasi online di Vercel.
20. Semua fitur utama dapat digunakan di desktop.
21. Tidak ada data password di database public.
22. RLS aktif.
23. Minimal 30 data kos dapat dianalisis.
24. Laporan final dapat dibuat dari sistem.
25. Hasil statistik dapat dijelaskan saat presentasi.

---

# 38. Milestone Development

## Milestone 1: Project Foundation

Output:

1. Next.js project.
2. TypeScript.
3. Tailwind.
4. shadcn/ui.
5. Supabase client.
6. Basic layout.
7. GitHub repo.
8. Vercel deployment.

## Milestone 2: Auth and Database

Output:

1. Supabase Auth.
2. Profiles table.
3. Role system.
4. RLS basic.
5. Login page.
6. Protected dashboard.

## Milestone 3: Data Input and Table

Output:

1. Kos form.
2. Validation.
3. Insert data.
4. Edit data.
5. Soft delete.
6. Data table.
7. Search/filter/sort.

## Milestone 4: Statistics Engine

Output:

1. Descriptive stats.
2. Frequency table.
3. Z-Score.
4. Outlier.
5. Unit tests.

## Milestone 5: Visual Dashboard

Output:

1. KPI cards.
2. Histogram.
3. Bar chart.
4. Donut chart.
5. Boxplot.
6. Scatter plot.

## Milestone 6: Normality Analysis

Output:

1. Lilliefors calculation.
2. Normality detail table.
3. QQ Plot.
4. Interpretation generator.

## Milestone 7: Export and Report

Output:

1. CSV export.
2. XLSX export.
3. PDF export.
4. DOCX export.
5. HTML report.
6. Report preview.

## Milestone 8: Polish and Finalization

Output:

1. Audit log.
2. Dataset freeze.
3. Settings.
4. QA.
5. Bug fixing.
6. Final demo.
7. Final report.

---

# 39. Risks and Mitigation

## 39.1 Risiko Data Tidak Konsisten

Mitigation:

1. Mode motor dikunci.
2. Titik tujuan dikunci.
3. Validasi form.
4. Warning jarak ekstrem.
5. Audit log.

## 39.2 Risiko Data Terlalu Sedikit

Mitigation:

1. Dashboard menampilkan target minimal 30.
2. Progress bar data collection.
3. Warning jika n < 30.

## 39.3 Risiko Salah Interpretasi

Mitigation:

1. Report generator menuliskan batasan.
2. UI membedakan kos dan mahasiswa.
3. Kesimpulan otomatis tidak menyebut mayoritas mahasiswa.

## 39.4 Risiko Free Tier Limit

Mitigation:

1. Hindari file besar.
2. Export client-side.
3. Jangan pakai API berbayar.
4. Jangan simpan screenshot banyak.
5. Batasi data.
6. Pantau usage Supabase dan Vercel.

## 39.5 Risiko RLS Salah

Mitigation:

1. Test role.
2. Manual QA.
3. Jangan expose service key.
4. Gunakan policy sederhana.
5. Review migration.

## 39.6 Risiko Export PDF Berantakan

Mitigation:

1. Sediakan HTML print view.
2. Sediakan DOCX alternatif.
3. Pecah tabel panjang.
4. Gunakan page break.

---

# 40. Final Product Vision

Produk akhir harus terasa seperti dashboard analitik akademik yang dibuat dengan standar engineering modern. Ketika dibuka, user langsung memahami bahwa aplikasi ini bukan spreadsheet biasa, tetapi sistem digital yang mengelola data penelitian dari input sampai laporan.

Aplikasi harus memperlihatkan kemampuan Informatika secara jelas:

1. Ada sistem login.
2. Ada database.
3. Ada role.
4. Ada validasi.
5. Ada audit.
6. Ada statistik.
7. Ada grafik.
8. Ada export.
9. Ada deployment online.
10. Ada struktur kode profesional.

Namun, produk tetap harus menjaga kebenaran akademik. Kesimpulan tidak boleh berlebihan. Data yang dianalisis adalah jarak kos, bukan jumlah mahasiswa. Mode pengukuran adalah motor. Titik tujuan adalah ATM BNI dekat gerbang FT Unsoed. Hasil analisis harus berdasarkan data yang dikumpulkan, bukan asumsi.

Versi final aplikasi harus bisa dipresentasikan dengan alur:

1. Login sebagai anggota.
2. Input data kos.
3. Lihat data masuk ke tabel.
4. Lihat dashboard berubah otomatis.
5. Lihat distribusi frekuensi.
6. Lihat statistik deskriptif.
7. Lihat normalisasi Z-Score.
8. Lihat uji normalitas.
9. Lihat QQ Plot.
10. Export laporan PDF/DOCX/XLSX.
11. Jelaskan bahwa sistem ini menggantikan proses manual Excel dengan dashboard yang lebih terstruktur.

---

