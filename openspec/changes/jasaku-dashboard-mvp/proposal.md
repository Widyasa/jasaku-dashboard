## Why

UMKM jasa (salon, laundry, bengkel, spa) masih banyak mengelola operasional secara manual atau dengan spreadsheet yang rentan error. JasaKu Dashboard hadir sebagai solusi manajemen terintegrasi — menggabungkan pengelolaan layanan, transaksi, keuangan, dan laporan dalam satu platform web-based dengan role-based access untuk Owner dan Kasir.

## What Changes

Membangun aplikasi dashboard manajemen UMKM jasa dengan fitur MVP:

- **Auth & Session Management**: Login/logout dengan session cookie httpOnly, bcrypt password hashing, role-based access control (Owner vs Kasir)
- **Service & Stock Management**: CRUD layanan dan produk, kategorisasi, manajemen stok bahan habis pakai dengan alert stok tipis
- **Transaction/Order Management**: Pembuatan order dengan service picker dan cart, update status order (Pending → In Progress → Done), konfirmasi pembayaran otomatis mencatat keuangan, struk printable
- **Finance Management**: Rekap pemasukan otomatis dari order, input pengeluaran manual, filter per tanggal dan kategori
- **Reports & Dashboard**: KPI real-time (omzet, order aktif, stok kritis, profit), chart pendapatan, ranking layanan terlaris
- **User Management**: Owner dapat menambah/mengelola akun kasir, semua user dapat ganti password

Semua fitur di atas dibangun dengan pendekatan vertical slice per modul (BE + FE selesai sebelum lanjut modul berikutnya).

## Capabilities

### New Capabilities
- `auth`: Authentication & session management — login/logout, password hashing, session cookie, me endpoint, password change
- `users`: User management — CRUD pengguna dengan role (Owner/Kasir), soft delete, owner-only access
- `services`: Service & stock management — CRUD layanan/produk, kategorisasi, stok tracking, alert stok tipis
- `orders`: Transaction/order management — pembuatan order dengan cart, status workflow, konfirmasi pembayaran, struk
- `finance`: Finance management — rekap income/expense, input pengeluaran manual, kategorisasi
- `reports`: Reports & dashboard — summary KPI, chart data, top services ranking

### Modified Capabilities
- (none — this is a greenfield project)

## Impact

- **Backend**: Nuxt 3 Nitro server routes, Prisma ORM dengan PostgreSQL, Zod validation
- **Frontend**: Nuxt 3 pages & components, Pinia stores, Tailwind CSS v4
- **Database**: Schema Prisma dengan 6 model utama (User, Category, Service, Order, OrderItem, FinanceRecord) + enum types
- **Dependencies**: @prisma/client, nuxt-auth-utils, @pinia/nuxt, zod, bcrypt
- **Security**: Session cookie httpOnly + secure + sameSite, CSRF protection via sameSite, parameterized queries via Prisma
- **Deploy target**: Railway / VPS dengan Node adapter
