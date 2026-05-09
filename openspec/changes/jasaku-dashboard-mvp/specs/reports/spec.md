## ADDED Requirements

### Requirement: Owner dapat melihat summary dashboard
Sistem SHALL menyediakan endpoint untuk melihat ringkasan KPI dashboard.

#### Scenario: Melihat summary dashboard
- **WHEN** user dengan role OWNER mengirim GET /api/reports/summary
- **THEN** sistem mengembalikan object berisi:
  - totalIncome (jumlah semua FinanceRecord type INCOME)
  - totalExpense (jumlah semua FinanceRecord type EXPENSE)
  - profit (totalIncome - totalExpense)
  - totalOrders (jumlah order yang tidak di-soft-delete)
  - activeOrders (jumlah order dengan status PENDING atau IN_PROGRESS)
  - lowStockCount (jumlah service dengan stock ≤ 5)

#### Scenario: Filter summary per rentang tanggal
- **WHEN** user mengirim GET /api/reports/summary?date_from=2024-01-01&date_to=2024-01-31
- **THEN** sistem menghitung summary hanya untuk data dalam rentang tanggal tersebut

### Requirement: Owner dapat melihat chart pendapatan
Sistem SHALL menyediakan endpoint untuk data chart pendapatan per periode.

#### Scenario: Chart harian
- **WHEN** user mengirim GET /api/reports/chart?period=daily
- **THEN** sistem mengembalikan array data pendapatan harian untuk 30 hari terakhir
- **AND** setiap item berisi tanggal dan total income

#### Scenario: Chart mingguan
- **WHEN** user mengirim GET /api/reports/chart?period=weekly
- **THEN** sistem mengembalikan array data pendapatan mingguan untuk 12 minggu terakhir

#### Scenario: Chart bulanan
- **WHEN** user mengirim GET /api/reports/chart?period=monthly
- **THEN** sistem mengembalikan array data pendapatan bulanan untuk 12 bulan terakhir

### Requirement: Owner dapat melihat ranking layanan terlaris
Sistem SHALL menyediakan endpoint untuk melihat layanan yang paling sering dipesan.

#### Scenario: Layanan terlaris
- **WHEN** user mengirim GET /api/reports/top-services
- **THEN** sistem mengembalikan array layanan terlaris berdasarkan jumlah order items
- **AND** setiap item berisi serviceName, totalQuantity, totalRevenue

#### Scenario: Filter top services per rentang tanggal
- **WHEN** user mengirim GET /api/reports/top-services?date_from=2024-01-01&date_to=2024-01-31
- **THEN** sistem menghitung hanya untuk order yang createdAt dalam rentang tersebut

### Requirement: Dashboard menampilkan KPI real-time
Sistem SHALL menampilkan KPI utama di halaman dashboard utama.

#### Scenario: Dashboard KPI cards
- **WHEN** user dengan role OWNER atau KASIR membuka halaman dashboard (/)
- **THEN** sistem menampilkan:
  - Total omzet hari ini
  - Jumlah order aktif (PENDING + IN_PROGRESS)
  - Jumlah stok kritis (≤ 5)
  - Profit hari ini

#### Scenario: Dashboard active orders list
- **WHEN** user membuka dashboard
- **THEN** sistem menampilkan daftar order dengan status PENDING atau IN_PROGRESS
- **AND** diurutkan berdasarkan createdAt terbaru
- **AND** menampilkan maksimal 10 order

#### Scenario: Dashboard low stock alert
- **WHEN** user membuka dashboard
- **THEN** sistem menampilkan alert untuk produk dengan stok ≤ 5
- **AND** alert menampilkan nama produk dan jumlah stok tersisa

### Requirement: Dashboard menampilkan chart revenue
Sistem SHALL menampilkan chart line/bar untuk visualisasi pendapatan di dashboard.

#### Scenario: Revenue chart di dashboard
- **WHEN** user membuka dashboard
- **THEN** sistem menampilkan line chart pendapatan harian untuk 7 hari terakhir
- **AND** chart menggunakan Chart.js
- **AND** chart di-load client-side only

#### Scenario: Chart interaktif
- **WHEN** user memilih periode chart (7 hari / 30 hari / 12 bulan)
- **THEN** chart di-update sesuai periode yang dipilih
- **AND** data di-fetch ulang dari API
