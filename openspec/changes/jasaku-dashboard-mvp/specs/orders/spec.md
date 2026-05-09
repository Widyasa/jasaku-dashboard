## ADDED Requirements

### Requirement: User dapat membuat order baru
Sistem SHALL memungkinkan user terautentikasi untuk membuat transaksi/order baru dengan memilih layanan dan memasukkan jumlah.

#### Scenario: Membuat order dengan beberapa item
- **WHEN** user terautentikasi mengirim POST /api/orders dengan customerName, customerPhone, items (array of serviceId + quantity), paymentMethod
- **THEN** sistem memvalidasi input dengan Zod
- **AND** sistem memverifikasi semua serviceId valid dan isActive
- **AND** sistem menghitung subtotal dari price × quantity per item
- **AND** sistem mengurangi stok produk (jika stock tidak null)
- **AND** sistem membuat order dengan status PENDING dan paymentStatus UNPAID
- **AND** sistem membuat orderNumber dengan format TRX-YYYYMMDD-XXXX
- **AND** sistem membuat orderItems untuk setiap item (dengan snapshot serviceName dan price)
- **AND** sistem mengembalikan object order yang dibuat dengan items

#### Scenario: Membuat order dengan stok tidak mencukupi
- **WHEN** user mengirim POST /api/orders dengan item yang quantity melebihi stok tersedia
- **THEN** sistem mengembalikan 400 Bad Request dengan pesan stok tidak mencukupi

### Requirement: User dapat melihat daftar order
Sistem SHALL menyediakan endpoint untuk melihat daftar order dengan filter dan pagination.

#### Scenario: Melihat semua order dengan pagination
- **WHEN** user terautentikasi mengirim GET /api/orders
- **THEN** sistem mengembalikan array order dengan pagination (default 20 items per page)
- **AND** setiap order mencakup kasir dan item count

#### Scenario: Filter order berdasarkan status
- **WHEN** user mengirim GET /api/orders?status=PENDING
- **THEN** sistem mengembalikan hanya order dengan status PENDING

#### Scenario: Filter order berdasarkan rentang tanggal
- **WHEN** user mengirim GET /api/orders?date_from=2024-01-01&date_to=2024-01-31
- **THEN** sistem mengembalikan order yang createdAt dalam rentang tanggal tersebut

### Requirement: User dapat melihat detail order
Sistem SHALL menyediakan endpoint untuk melihat detail order beserta item-itemnya.

#### Scenario: Melihat detail order
- **WHEN** user terautentikasi mengirim GET /api/orders/[id]
- **THEN** sistem mengembalikan object order dengan items lengkap (serviceName, price, quantity, subtotal per item)

#### Scenario: Order tidak ditemukan
- **WHEN** user mengirim GET /api/orders/[id] dengan id yang tidak terdaftar atau sudah soft delete
- **THEN** sistem mengembalikan 404 Not Found

### Requirement: User dapat mengupdate status order
Sistem SHALL memungkinkan user untuk mengupdate status order melalui workflow yang ditentukan.

#### Scenario: Update status dari PENDING ke IN_PROGRESS
- **WHEN** user terautentikasi mengirim PUT /api/orders/[id]/status dengan status IN_PROGRESS
- **THEN** sistem memvalidasi status valid
- **AND** sistem mengupdate status order
- **AND** sistem mengembalikan object order yang diupdate

#### Scenario: Update status dari IN_PROGRESS ke DONE
- **WHEN** user mengirim PUT /api/orders/[id]/status dengan status DONE
- **THEN** sistem mengupdate status order
- **AND** sistem mengupdate completedAt dengan timestamp saat ini

#### Scenario: Cancel order
- **WHEN** user dengan role OWNER mengirim PUT /api/orders/[id]/status dengan status CANCELLED
- **THEN** sistem mengupdate status order menjadi CANCELLED
- **AND** sistem mengembalikan stok produk yang sudah dikurangi saat pembuatan order

### Requirement: User dapat mengkonfirmasi pembayaran
Sistem SHALL memungkinkan user untuk mengkonfirmasi pembayaran dan otomatis mencatat keuangan.

#### Scenario: Konfirmasi pembayaran cash
- **WHEN** user terautentikasi mengirim PUT /api/orders/[id]/payment dengan paymentStatus PAID dan paymentMethod CASH
- **THEN** sistem mengupdate paymentStatus menjadi PAID
- **AND** sistem membuat FinanceRecord tipe INCOME dengan amount = order.total
- **AND** sistem mengembalikan object order yang diupdate

#### Scenario: Konfirmasi pembayaran dengan QRIS
- **WHEN** user mengirim PUT /api/orders/[id]/payment dengan paymentMethod QRIS
- **THEN** sistem mengupdate paymentStatus dan paymentMethod
- **AND** sistem membuat FinanceRecord tipe INCOME

### Requirement: Owner dapat menghapus order (soft delete)
Sistem SHALL memungkinkan Owner untuk menghapus order dengan soft delete.

#### Scenario: Owner menghapus order
- **WHEN** user dengan role OWNER mengirim DELETE /api/orders/[id]
- **THEN** sistem mengupdate deletedAt order menjadi current timestamp
- **AND** jika order belum paid, sistem mengembalikan stok produk
- **AND** sistem mengembalikan 200 OK

#### Scenario: Kasir mencoba menghapus order
- **WHEN** user dengan role KASIR mengirim DELETE /api/orders/[id]
- **THEN** sistem mengembalikan 403 Forbidden

### Requirement: Order yang sudah paid tidak dapat dihapus
Sistem SHALL mencegah penghapusan order yang sudah memiliki pembayaran tercatat.

#### Scenario: Mencoba menghapus order yang sudah paid
- **WHEN** user mengirim DELETE /api/orders/[id] dengan paymentStatus PAID
- **THEN** sistem mengembalikan 400 Bad Request dengan pesan order sudah dibayar tidak dapat dihapus

### Requirement: Order yang sudah paid tidak dapat di-cancel
Sistem SHALL mencegah cancel pada order yang sudah dibayar.

#### Scenario: Mencoba cancel order yang sudah paid
- **WHEN** user mengirim PUT /api/orders/[id]/status dengan status CANCELLED dan paymentStatus PAID
- **THEN** sistem mengembalikan 400 Bad Request dengan pesan order sudah dibayar tidak dapat dibatalkan
