# Dashboard Jarak Kos FT Unsoed

Dashboard Jarak Kos FT Unsoed adalah aplikasi analitik akademik untuk mengelola
dan menganalisis data jarak kos-kosan di sekitar Fakultas Teknik Universitas
Jenderal Soedirman menuju titik acuan gerbang kampus.

Aplikasi ini dirancang sebagai dashboard desktop untuk kebutuhan tugas
Probabilitas dan Statistika. Data mentah kos menjadi sumber kebenaran, sementara
statistik, distribusi frekuensi, normalisasi, visualisasi, dan uji normalitas
dihitung dari data tersebut.

## Fitur Utama

- Login berbasis Supabase Auth dengan role `admin`, `member`, dan `viewer`.
- Dashboard ringkasan data kos, kualitas data, dan metodologi penelitian.
- Input, edit, tabel data, validasi, soft delete, dan audit log data kos.
- Statistik deskriptif dari variabel `jarak_meter`.
- Distribusi frekuensi dengan interval manual dan Sturges.
- Normalisasi z-score dan deteksi outlier berbasis IQR.
- Uji normalitas Lilliefors-style dengan tabel detail dan interpretasi.
- Visualisasi data berupa grafik distribusi, boxplot, scatter plot, donut chart,
  dan Q-Q plot.
- Ekspor data mentah aktif untuk CSV, XLSX, dan JSON.
- Ekspor laporan HTML aktif dengan pratinjau laporan; PDF dan DOCX ditampilkan
  sebagai format yang segera tersedia.
- Identitas anggota kelompok pada topbar dashboard.
- Modul ekspor dan laporan mengikuti arah PRD untuk CSV, XLSX, PDF, DOCX, HTML,
  dan JSON.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Vercel
- Recharts
- TanStack Table
- React Hook Form
- Zod
- Vitest
- SheetJS/xlsx untuk export Excel
- jsPDF dan docx sebagai target library ekspor PDF/DOCX sesuai PRD

## Struktur Folder

```text
.
├── app/                  # Route Next.js App Router
│   ├── (auth)/           # Halaman dan action autentikasi
│   └── (dashboard)/      # Halaman dashboard terlindungi
├── components/           # Komponen UI, dashboard, tabel, statistik, dan grafik
├── docs/                 # PRD, setup Supabase, dan catatan audit statistik
├── lib/                  # Logic auth, Supabase, kos, statistik, format, export
├── public/               # Aset publik
├── supabase/             # Migration dan dokumentasi Supabase
├── tests/                # Unit test Vitest
├── types/                # TypeScript type definitions
├── .env.example          # Contoh environment variables tanpa kredensial asli
├── package.json          # Script dan dependency proyek
└── README.md             # Dokumentasi proyek
```

## Environment Variables

Buat `.env.local` dari `.env.example`, lalu isi dengan nilai dari project
Supabase dan konfigurasi aplikasi. Gunakan placeholder berikut sebagai contoh;
jangan menaruh password, service role key, API key pribadi, atau kredensial user
di repository.

```bash
NEXT_PUBLIC_APP_NAME="Dashboard Analisis Jarak Kos FT Unsoed"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-public-anon-or-publishable-key"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-public-publishable-key"
```

Catatan:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` atau `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  digunakan untuk client browser.
- Jangan pernah menggunakan Supabase service role key di variable yang diawali
  `NEXT_PUBLIC_`.
- File `.env.local` tidak boleh dikomit.

## Setup Lokal

1. Install dependency.

```bash
npm install
```

2. Siapkan environment lokal.

```bash
cp .env.example .env.local
```

3. Isi `.env.local` dengan placeholder yang sudah diganti sesuai project
   Supabase.

4. Jalankan development server.

```bash
npm run dev
```

5. Buka aplikasi di browser desktop.

```text
http://localhost:3000
```

6. Jalankan pengecekan proyek.

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Setup Supabase

Panduan teknis Supabase tersedia di [docs/supabase-setup.md](docs/supabase-setup.md).
Langkah umum:

1. Buat project Supabase.
2. Terapkan migration dari folder `supabase/migrations/`.
3. Aktifkan Supabase Auth untuk login email dan password.
4. Buat user melalui Supabase Authentication.
5. Buat baris `profiles` untuk setiap user dengan role `admin`, `member`, atau
   `viewer`.
6. Pastikan Row Level Security tetap aktif pada tabel penting.
7. Gunakan akun terpisah untuk setiap anggota agar audit log akurat.

Password hanya dikelola oleh Supabase Auth. Tabel publik tidak boleh menyimpan
password.

## Deployment Vercel

1. Hubungkan repository GitHub ke Vercel.
2. Atur environment variables di Vercel Project Settings:
   `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`,
   `NEXT_PUBLIC_SUPABASE_URL`, serta salah satu dari
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` atau `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Gunakan build command berikut.

```bash
npm run build
```

4. Pastikan migration Supabase sudah diterapkan sebelum aplikasi digunakan untuk
   input data produksi.
5. Deploy dari branch stabil, misalnya `main`.

Jangan menambahkan service role key Supabase ke environment client atau kode
frontend.

## Metodologi Data

- Unit observasi adalah kos-kosan, bukan mahasiswa.
- Populasi penelitian adalah kos-kosan di sekitar FT Unsoed, terutama area yang
  relevan dengan akses Fakultas Teknik.
- Sampel adalah kos-kosan yang berhasil diidentifikasi dan diukur oleh kelompok.
- Variabel utama adalah jarak kos ke titik acuan gerbang kampus dalam satuan
  meter.
- Titik tujuan tetap adalah ATM BNI dekat gerbang FT Unsoed.
- Mode rute tetap adalah motor.
- Jarak diperoleh dari Google Maps secara manual; aplikasi tidak memakai Google
  Maps API dan tidak melakukan scraping.
- Metode sampling yang digunakan adalah purposive convenience sampling.
- Data dengan `is_deleted = true` tidak dihitung dalam analisis aktif.
- Data berstatus `needs_review` tetap dapat dihitung, tetapi perlu diberi
  catatan kehati-hatian pada interpretasi.

Hasil analisis menjelaskan sebaran jarak kos-kosan, bukan sebaran tempat tinggal
mahasiswa.

## Analisis Statistik

Analisis statistik dihitung dari data mentah `jarak_meter`.

- Statistik dasar: `n`, `sum`, minimum, maksimum, range, mean, median, dan modus
  data mentah.
- Kuartil dan sebaran: Q1, Q2, Q3, IQR, lower fence, upper fence, dan outlier.
- Varians dan standar deviasi: sample variance, sample standard deviation,
  population variance, dan population standard deviation.
- Koefisien variasi untuk membaca tingkat penyebaran relatif.
- Distribusi frekuensi dengan interval manual dan aturan Sturges.
- Normalisasi z-score menggunakan mean dan sample standard deviation.
- Uji normalitas Lilliefors-style pada taraf signifikansi 5%.
- Q-Q plot sebagai visualisasi pendukung normalitas.

Jika data tidak normal, hal tersebut bukan kegagalan sistem. Hasil tersebut
menjadi bagian dari interpretasi akademik.

## Testing

Script pengujian dan verifikasi:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Unit test mencakup validasi data kos, normalisasi teks, kualitas data, statistik
deskriptif, distribusi frekuensi, z-score, outlier, normalitas, dan Q-Q plot.
Catatan audit statistik dapat dilihat di [docs/statistics-audit.md](docs/statistics-audit.md).

## Security Notes

- Semua halaman dashboard wajib memakai Supabase Auth.
- Row Level Security adalah lapisan utama authorization.
- Role check di frontend hanya untuk UX, bukan pengganti RLS.
- Password tidak disimpan di tabel publik.
- Supabase service role key tidak boleh diekspos ke browser.
- Environment file lokal tidak boleh dikomit.
- Google Maps URL boleh disimpan sebagai referensi data, tetapi harus digunakan
  secara hati-hati.
- Aplikasi tidak melakukan scraping Google Maps dan tidak memakai Google Maps API
  berbayar.
- Export data dan laporan hanya boleh dilakukan oleh user yang sudah login
  sesuai hak akses.
- Audit log digunakan untuk mencatat perubahan penting pada data.

## Anggota Kelompok

| No | Nama | NIM |
| --- | --- | --- |
| 1 | Fardizza Vinda Rahman | H1D025067 |
| 2 | Muhammad Fattachul Fawwaz | H1D025068 |
| 3 | Mufaddhol | H1D025069 |
| 4 | Balqis Safitri | H1D025070 |
| 5 | Alika Salsabila | H1D025071 |
