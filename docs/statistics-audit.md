# Statistics Accuracy Audit

Date: 2026-06-03

## Scope

This audit checks the current academic dashboard calculations and data flow for
the Kos Distance Analytics Dashboard. The unit of observation is kos-kosan, and
the analyzed variable is `jarak_meter` in meters. Analytical pages must use only
active rows where `kos_data.is_deleted = false`.

## Data Source Consistency

Verified active-data usage:

- Dashboard uses `fetchActiveKosDistanceData()`, which filters `is_deleted = false`.
- Data Kos uses `fetchActiveKosData()`, which filters `is_deleted = false`.
- Statistik uses `fetchActiveKosDistanceData()`, which filters `is_deleted = false`.
- Distribusi uses `fetchActiveKosDistanceData()`, which filters `is_deleted = false`.
- Normalitas uses `fetchActiveKosDistanceData()`, which filters `is_deleted = false`.
- Visualisasi uses `fetchActiveKosDistanceData()`, which filters `is_deleted = false`.
- Data mutations select/update only non-deleted target rows when editing or soft deleting.

Audit Log intentionally reads `audit_logs`, not the active kos dataset.
Settings and Export are currently placeholder pages and do not compute counts or
statistics.

## Formulas Verified

The following formulas were checked and covered by tests:

- `n`: count of finite distance observations passed to the statistics engine.
- `sum`: total of all distance values.
- `min` and `max`: smallest and largest distance.
- `range`: `max - min`.
- `mean`: `sum / n`.
- `median`: percentile 50 using the shared percentile helper.
- Raw mode: repeated value(s) with the highest frequency; returns no raw mode
  when every value is unique.
- Q1, Q2, Q3: shared percentile helper.
- IQR: `Q3 - Q1`.
- Lower fence: `Q1 - 1.5 * IQR`.
- Upper fence: `Q3 + 1.5 * IQR`.
- IQR outlier: `x < lower fence` or `x > upper fence`.
- Sample variance: `sum((x - mean)^2) / (n - 1)`.
- Sample standard deviation: square root of sample variance.
- Population variance: `sum((x - mean)^2) / n`.
- Population standard deviation: square root of population variance.
- Coefficient of variation: `sample standard deviation / mean * 100`.
- Z-score: `(x - mean) / sample standard deviation`.
- Manual frequency distribution boundaries.
- Sturges frequency totals and zero-range edge case.
- Standard normal CDF and inverse standard normal helper.
- Lilliefors-style normality rows, `Lhitung`, lookup/approximation source, and
  insufficient-data handling.
- QQ plot point count, sorted sample quantiles, and reference line data.

## Quantile Method

The shared `percentile()` helper uses linear interpolation equivalent to R type
7 / Excel `PERCENTILE.INC`. The same helper is used for median, Q1, Q2, Q3,
boxplot summaries, and IQR outlier fences. This keeps Statistik and Visualisasi
internally consistent.

## Bugs Found

1. Input validation did not fully match the PRD:
   - `namaKos` allowed 2 characters instead of the required minimum 3.
   - `namaKos` did not reject names made only of numbers.
   - `area` allowed 120 characters instead of the required maximum 100.
   - `jarakMeter` allowed up to 50000 instead of the required maximum 10000.

2. Data quality status was incomplete:
   - Distances above 3000 meters were not marked `warning`.
   - Distances above 5000 meters were not marked `needs_review`.
   - Duplicate Google Maps URLs were not checked.
   - Duplicate detection only checked normalized kos names.

3. Sturges distribution had a zero-range edge case:
   - When all distances were equal, generated intervals could become invalid or
     not useful because the range was 0.

4. CRUD revalidation missed analytical routes:
   - Data changes revalidated Dashboard and Statistik but did not explicitly
     revalidate Distribusi, Normalitas, or Visualisasi.

## Bugs Fixed

1. Updated `lib/kos/validation.ts`:
   - `namaKos` minimum is now 3 characters.
   - `namaKos` rejects numeric-only names.
   - `area` maximum is now 100 characters.
   - `jarakMeter` maximum is now 10000 meters.

2. Added `lib/kos/data-quality.ts`:
   - `valid`: distance <= 3000 and no duplicate.
   - `warning`: distance > 3000 and <= 5000.
   - `needs_review`: distance > 5000.
   - `duplicate_suspected`: normalized duplicate name or duplicate Google Maps
     URL, checked case-insensitively.
   - Current record is ignored during edit duplicate checks.

3. Updated `app/(dashboard)/kos-actions.ts`:
   - Uses the new data-quality helper during create and update.
   - Queries active records only for duplicate checks.
   - Includes Google Maps URL in duplicate checks.
   - Revalidates `/distribusi`, `/normalitas`, and `/visualisasi` after create,
     update, and soft delete.

4. Updated `lib/statistics/frequency.ts`:
   - Collapses Sturges distribution to one class when range is 0, preventing
     invalid reversed interval bounds while keeping all values covered.

5. Documented the quantile method in `lib/statistics/utils.ts`.

## Tests Added or Expanded

Added deterministic coverage for:

- Dataset A: `[150, 170, 263, 393, 411, 412, 446, 534, 554, 557, 648, 698]`
  - `n = 12`, `sum = 5236`, `min = 150`, `max = 698`, `range = 548`,
    `mean = 436.333333...`, `median = 429`.
  - Manual interval frequencies: `0-250 = 2`, `251-500 = 5`,
    `501-750 = 5`, all later intervals = 0.

- Dataset B:
  `[250, 251, 500, 501, 750, 751, 1000, 1001, 1250, 1251, 1500, 1501, 1750, 1751, 2000, 2001]`
  - Verifies manual interval boundary placement and total frequency 16.

- Dataset C: `[100, 100, 100, 100]`
  - Verifies safe zero-variance handling, z-score fallback, normality
    insufficient-data handling, and Sturges zero-range coverage.

- Dataset D: `[100, 120, 130, 140, 150, 160, 1000]`
  - Verifies IQR outlier detection flags 1000.

- Dataset E: `[]`
  - Existing empty-statistics test confirms safe empty output.

- Dataset F: `[500]`
  - Verifies single-value mean, median, sample variance null, sample standard
    deviation null, and z-score safe fallback.

Added validation/data-quality tests for:

- Empty Google Maps URL accepted.
- Valid Google Maps URL accepted.
- Invalid Google Maps URL rejected.
- PRD boundaries for name, area, and distance.
- Duplicate names after normalization.
- Duplicate URLs case-insensitively.
- Warning and needs-review distance thresholds.

Current test result: 4 test files passed, 41 tests passed.

## Normality Test Limitations

- The normality implementation is Liliefors-style.
- It uses sample standard deviation consistently with the displayed Statistik
  page sample standard deviation.
- `Ltabel` uses a lookup table for `n = 4..30` at alpha 0.05.
- For `n > 30`, `Ltabel` is marked as an approximation using `0.886 / sqrt(n)`.
- For `n < 4`, zero variance, or unavailable `Ltabel`, the decision is
  `insufficient_data`.
- Equality is handled conservatively: `Lhitung < Ltabel` is normal; otherwise
  the result is not normal.
- QQ Plot remains visual support and is not the only basis for a decision.

## Export Limitations

The Export page is currently a placeholder. CSV, XLSX, JSON, HTML report, PDF,
and DOCX export generation are not implemented yet in the current code. Because
there is no export output, exported-data accuracy cannot be verified beyond
confirming no export code currently includes soft-deleted rows or sensitive
developer configuration.

## Known Product Limitations

- Dashboard currently shows a subset of all PRD KPI cards. The displayed KPI
  cards are computed from active data.
- Settings is currently a placeholder and does not show counts.
- Export is currently a placeholder.
- Integration and E2E tests for authenticated Supabase flows are not present in
  this repository.

## Change Safety Confirmation

- Database schema was not changed.
- Supabase RLS policies were not changed.
- Authentication flow was not changed.
- Core descriptive statistics, z-score, IQR, normal CDF, inverse normal, and
  Lilliefors formulas were not changed.
- Sturges frequency handling was changed only for the real zero-range edge case
  where all distances are equal, to prevent invalid intervals and preserve full
  data coverage.
