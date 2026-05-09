## ADDED Requirements

### Requirement: User dapat login dengan email dan password
Sistem SHALL mengautentikasi user berdasarkan email dan password dengan bcrypt comparison.

#### Scenario: Login berhasil
- **WHEN** user mengirim POST /api/auth/login dengan email dan password yang valid
- **THEN** sistem mencari user dengan email tersebut dan deletedAt null
- **AND** sistem memverifikasi password dengan bcrypt.compare
- **AND** sistem membuat session cookie httpOnly dengan data user (id, name, role)
- **AND** sistem mengembalikan object user

#### Scenario: Login gagal — user tidak ditemukan
- **WHEN** user mengirim POST /api/auth/login dengan email yang tidak terdaftar
- **THEN** sistem mengembalikan 401 Unauthorized dengan pesan generik

#### Scenario: Login gagal — password salah
- **WHEN** user mengirim POST /api/auth/login dengan password yang tidak cocok
- **THEN** sistem mengembalikan 401 Unauthorized dengan pesan generik

#### Scenario: Login gagal — user di-soft-delete
- **WHEN** user mengirim POST /api/auth/login dengan akun yang memiliki deletedAt tidak null
- **THEN** sistem mengembalikan 401 Unauthorized dengan pesan generik

### Requirement: User dapat logout
Sistem SHALL menghapus session user saat logout.

#### Scenario: Logout berhasil
- **WHEN** user yang terautentikasi mengirim POST /api/auth/logout
- **THEN** sistem menghapus session cookie
- **AND** sistem mengembalikan 200 OK

### Requirement: Session user tersedia via endpoint me
Sistem SHALL menyediakan endpoint untuk membaca data user dari session yang aktif.

#### Scenario: Mendapatkan data user dari session
- **WHEN** user yang terautentikasi mengirim GET /api/auth/me
- **THEN** sistem mengembalikan object user (id, name, email, role) dari session

#### Scenario: Session tidak valid atau expired
- **WHEN** user yang tidak memiliki session mengirim GET /api/auth/me
- **THEN** sistem mengembalikan 401 Unauthorized

### Requirement: User dapat mengganti password
Sistem SHALL memungkinkan user terautentikasi untuk mengganti password dengan validasi password lama.

#### Scenario: Ganti password berhasil
- **WHEN** user terautentikasi mengirim PUT /api/auth/password dengan password lama dan password baru
- **THEN** sistem memverifikasi password lama dengan bcrypt
- **AND** sistem meng-hash password baru dengan bcrypt salt rounds 12
- **AND** sistem mengupdate passwordHash di database
- **AND** sistem mengembalikan 200 OK

#### Scenario: Ganti password gagal — password lama salah
- **WHEN** user mengirim PUT /api/auth/password dengan password lama yang tidak cocok
- **THEN** sistem mengembalikan 400 Bad Request dengan pesan error

### Requirement: Server middleware memvalidasi session untuk semua API
Sistem SHALL menolak request ke API endpoint (kecuali login) jika tidak memiliki session yang valid.

#### Scenario: Request tanpa session ditolak
- **WHEN** request masuk ke endpoint API selain /api/auth/login tanpa session cookie
- **THEN** middleware mengembalikan 401 Unauthorized

#### Scenario: Request dengan session diizinkan
- **WHEN** request masuk ke endpoint API dengan session cookie yang valid
- **THEN** middleware memperbolehkan request untuk diproses oleh route handler

### Requirement: Client-side middleware redirect ke login jika tidak terautentikasi
Sistem SHALL melindungi halaman yang memerlukan autentikasi dengan redirect otomatis ke halaman login.

#### Scenario: Akses halaman tanpa login
- **WHEN** user yang belum login mengakses halaman yang dilindungi middleware auth
- **THEN** sistem redirect ke /login

#### Scenario: Akses halaman dengan login
- **WHEN** user yang sudah login mengakses halaman yang dilindungi middleware auth
- **THEN** sistem menampilkan halaman yang diminta

### Requirement: Owner-only middleware melindungi halaman khusus owner
Sistem SHALL menolak akses ke halaman dan API khusus owner untuk user dengan role KASIR.

#### Scenario: Kasir mengakses halaman owner
- **WHEN** user dengan role KASIR mengakses halaman yang dilindungi middleware owner-only
- **THEN** sistem redirect ke halaman dashboard (/)

#### Scenario: Owner mengakses halaman owner
- **WHEN** user dengan role OWNER mengakses halaman yang dilindungi middleware owner-only
- **THEN** sistem menampilkan halaman yang diminta

#### Scenario: Kasir mengakses API owner
- **WHEN** user dengan role KASIR mengirim request ke API yang menggunakan requireOwner helper
- **THEN** sistem mengembalikan 403 Forbidden
