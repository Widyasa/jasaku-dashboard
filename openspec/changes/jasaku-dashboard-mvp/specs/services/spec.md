## ADDED Requirements

### Requirement: User dapat melihat daftar layanan
Sistem SHALL menyediakan endpoint untuk melihat daftar layanan dengan filter dan pencarian.

#### Scenario: Melihat semua layanan aktif
- **WHEN** user terautentikasi mengirim GET /api/services
- **THEN** sistem mengembalikan array layanan dengan deletedAt null dan isActive true
- **AND** setiap layanan mencakup data category terkait

#### Scenario: Filter layanan berdasarkan kategori
- **WHEN** user mengirim GET /api/services?category=categoryId
- **THEN** sistem mengembalikan hanya layanan dengan categoryId yang sesuai

#### Scenario: Filter layanan berdasarkan status aktif
- **WHEN** user mengirim GET /api/services?active=false
- **THEN** sistem mengembalikan layanan dengan isActive false (owner only)

#### Scenario: Pencarian layanan
- **WHEN** user mengirim GET /api/services?search=keyword
- **THEN** sistem mengembalikan layanan yang namanya mengandung keyword (case-insensitive)

### Requirement: Owner dapat membuat layanan baru
Sistem SHALL memungkinkan Owner untuk menambahkan layanan atau produk baru.

#### Scenario: Owner membuat layanan baru
- **WHEN** user dengan role OWNER mengirim POST /api/services dengan name, categoryId, price, description, durationMin, stock, unit, type
- **THEN** sistem memvalidasi input dengan Zod
- **AND** sistem membuat service baru di database
- **AND** sistem mengembalikan object service yang dibuat

#### Scenario: Kasir mencoba membuat layanan
- **WHEN** user dengan role KASIR mengirim POST /api/services
- **THEN** sistem mengembalikan 403 Forbidden

### Requirement: Owner dapat mengupdate layanan
Sistem SHALL memungkinkan Owner untuk mengupdate data layanan yang sudah ada.

#### Scenario: Owner mengupdate layanan
- **WHEN** user dengan role OWNER mengirim PUT /api/services/[id] dengan data yang diupdate
- **THEN** sistem memvalidasi input dengan Zod
- **AND** sistem mengupdate service di database
- **AND** sistem mengembalikan object service yang diupdate

#### Scenario: Update layanan yang tidak ada
- **WHEN** Owner mengirim PUT /api/services/[id] dengan id yang tidak terdaftar
- **THEN** sistem mengembalikan 404 Not Found

### Requirement: Owner dapat menghapus layanan (soft delete)
Sistem SHALL melakukan soft delete pada layanan yang dihapus.

#### Scenario: Owner menghapus layanan
- **WHEN** user dengan role OWNER mengirim DELETE /api/services/[id]
- **THEN** sistem mengupdate deletedAt service menjadi current timestamp
- **AND** sistem mengembalikan 200 OK

### Requirement: Owner dapat mengupdate stok layanan
Sistem SHALL memungkinkan Owner untuk mengupdate stok dengan delta (increment/decrement).

#### Scenario: Owner menambah stok
- **WHEN** user dengan role OWNER mengirim PUT /api/services/[id]/stock dengan delta positif dan note
- **THEN** sistem menambah stok dengan nilai delta
- **AND** sistem mencatat perubahan stok
- **AND** sistem mengembalikan object service dengan stok terupdate

#### Scenario: Owner mengurangi stok
- **WHEN** user dengan role OWNER mengirim PUT /api/services/[id]/stock dengan delta negatif
- **THEN** sistem mengurangi stok dengan nilai delta
- **AND** sistem mengembalikan 400 Bad Request jika stok menjadi negatif

### Requirement: Sistem dapat mengelompokkan layanan dalam kategori
Sistem SHALL mendukung kategorisasi layanan dengan tipe SERVICE atau PRODUCT.

#### Scenario: Melihat layanan per kategori
- **WHEN** user membuka halaman daftar layanan
- **THEN** sistem menampilkan layanan yang dikelompokkan berdasarkan kategori
- **AND** setiap kategori menunjukkan tipe (SERVICE atau PRODUCT)

### Requirement: Sistem menampilkan alert stok tipis
Sistem SHALL memberikan peringatan ketika stok produk mendekati habis.

#### Scenario: Stok mendekati batas minimum
- **WHEN** stok suatu produk ≤ 5 unit (threshold default)
- **THEN** sistem menampilkan alert stok tipis di dashboard
- **AND** alert muncul di notifikasi bell

#### Scenario: Stok habis
- **WHEN** stok suatu produk mencapai 0
- **THEN** sistem menampilkan alert kritis di dashboard
- **AND** produk tetap terlihat di daftar dengan status stok habis
