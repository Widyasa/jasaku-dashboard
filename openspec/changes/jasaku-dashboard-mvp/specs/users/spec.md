## ADDED Requirements

### Requirement: Owner dapat melihat daftar semua user
Sistem SHALL menyediakan endpoint untuk Owner melihat semua user yang belum di-soft-delete.

#### Scenario: Owner melihat daftar user
- **WHEN** user dengan role OWNER mengirim GET /api/users
- **THEN** sistem mengembalikan array user (id, name, email, role, isActive, createdAt) dengan deletedAt null

#### Scenario: Kasir mencoba melihat daftar user
- **WHEN** user dengan role KASIR mengirim GET /api/users
- **THEN** sistem mengembalikan 403 Forbidden

### Requirement: Owner dapat membuat user kasir baru
Sistem SHALL memungkinkan Owner untuk membuat akun user baru dengan role KASIR atau OWNER.

#### Scenario: Owner membuat user kasir baru
- **WHEN** user dengan role OWNER mengirim POST /api/users dengan name, email, password, role
- **THEN** sistem memvalidasi input dengan Zod
- **AND** sistem memastikan email belum terdaftar (unique)
- **AND** sistem meng-hash password dengan bcrypt salt rounds 12
- **AND** sistem membuat user baru di database
- **AND** sistem mengembalikan object user yang dibuat

#### Scenario: Membuat user dengan email yang sudah terdaftar
- **WHEN** Owner mengirim POST /api/users dengan email yang sudah ada di database
- **THEN** sistem mengembalikan 400 Bad Request dengan pesan email sudah terdaftar

### Requirement: Owner dapat mengupdate user
Sistem SHALL memungkinkan Owner untuk mengupdate nama, role, dan status aktif user.

#### Scenario: Owner mengupdate data user
- **WHEN** user dengan role OWNER mengirim PUT /api/users/[id] dengan name, role, isActive
- **THEN** sistem memvalidasi input dengan Zod
- **AND** sistem mengupdate data user di database
- **AND** sistem mengembalikan object user yang diupdate

#### Scenario: Update user yang tidak ada
- **WHEN** Owner mengirim PUT /api/users/[id] dengan id yang tidak terdaftar
- **THEN** sistem mengembalikan 404 Not Found

### Requirement: User dapat mengupdate profil dan password sendiri
Sistem SHALL memungkinkan semua user terautentikasi untuk mengupdate nama dan password mereka sendiri melalui halaman settings.

#### Scenario: User mengupdate nama profil
- **WHEN** user terautentikasi mengupdate nama di halaman settings
- **THEN** sistem mengupdate field name user di database
- **AND** sistem mengupdate session dengan nama baru

### Requirement: User di-soft-delete tidak dapat login
Sistem SHALL menandai user sebagai dihapus dengan soft delete tanpa menghapus data dari database.

#### Scenario: Soft delete user
- **WHEN** sistem melakukan soft delete pada user (mengupdate deletedAt menjadi current timestamp)
- **THEN** user tersebut tidak muncul di daftar user
- **AND** user tersebut tidak dapat login
- **AND** data user tetap tersimpan di database untuk keperluan audit
