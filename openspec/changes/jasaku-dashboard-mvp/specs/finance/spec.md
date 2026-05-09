## ADDED Requirements

### Requirement: Owner dapat melihat rekap keuangan
Sistem SHALL menyediakan endpoint untuk Owner melihat semua record keuangan dengan filter.

#### Scenario: Owner melihat semua record keuangan
- **WHEN** user dengan role OWNER mengirim GET /api/finance
- **THEN** sistem mengembalikan array FinanceRecord dengan urutan terbaru
- **AND** setiap record mencakup user yang menginput dan order terkait (jika ada)

#### Scenario: Filter berdasarkan tipe
- **WHEN** user mengirim GET /api/finance?type=INCOME
- **THEN** sistem mengembalikan hanya record dengan type INCOME

#### Scenario: Filter berdasarkan rentang tanggal
- **WHEN** user mengirim GET /api/finance?date_from=2024-01-01&date_to=2024-01-31
- **THEN** sistem mengembalikan record yang recordedAt dalam rentang tersebut

#### Scenario: Kasir mencoba melihat finance
- **WHEN** user dengan role KASIR mengirim GET /api/finance
- **THEN** sistem mengembalikan 403 Forbidden

### Requirement: Owner dapat input pengeluaran manual
Sistem SHALL memungkinkan Owner untuk mencatat pengeluaran operasional manual.

#### Scenario: Input pengeluaran baru
- **WHEN** user dengan role OWNER mengirim POST /api/finance dengan type EXPENSE, amount, category, description
- **THEN** sistem memvalidasi input dengan Zod
- **AND** sistem membuat FinanceRecord tipe EXPENSE
- **AND** sistem mengembalikan object FinanceRecord yang dibuat

#### Scenario: Input pengeluaran dengan kategori
- **WHEN** Owner mengirim POST /api/finance dengan category (e.g., "operasional", "bahan baku", "gaji")
- **THEN** sistem menyimpan kategori tersebut
- **AND** sistem memungkinkan filter berdasarkan kategori di kemudian hari

### Requirement: Pembayaran order otomatis tercatat sebagai income
Sistem SHALL secara otomatis membuat FinanceRecord tipe INCOME ketika order dikonfirmasi pembayarannya.

#### Scenario: Konfirmasi bayar mencatat income
- **WHEN** user mengkonfirmasi pembayaran order dengan PUT /api/orders/[id]/payment
- **THEN** sistem membuat FinanceRecord dengan type INCOME
- **AND** amount sama dengan order.total
- **AND** orderId terisi dengan id order tersebut
- **AND** userId terisi dengan id user yang mengkonfirmasi

### Requirement: Finance record yang di-soft-delete tidak muncul di rekap
Sistem SHALL melakukan soft delete pada FinanceRecord.

#### Scenario: Soft delete finance record
- **WHEN** sistem melakukan soft delete pada FinanceRecord
- **THEN** record tersebut tidak muncul di daftar rekap keuangan
- **AND** data tetap tersimpan di database untuk audit
