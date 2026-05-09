## Context

Project ini adalah greenfield development untuk JasaKu Dashboard — sistem manajemen UMKM jasa berbasis web. Tidak ada codebase existing yang perlu dimodifikasi. Target tech stack telah dipilih berdasarkan kebutuhan fullstack JavaScript dengan ORM yang mature dan ekosistem Nuxt 3 yang komprehensif.

## Goals / Non-Goals

**Goals:**
- Membangun aplikasi dashboard fullstack dengan Nuxt 3 (Vue 3 + Nitro server)
- Implementasi autentikasi session-based dengan cookie httpOnly yang aman
- Database relational dengan Prisma ORM dan PostgreSQL
- Role-based access control (Owner vs Kasir) di seluruh lapisan (API, UI, middleware)
- Manajemen layanan dengan kategorisasi dan tracking stok
- Workflow order dengan status lifecycle dan konfirmasi pembayaran otomatis
- Rekap keuangan otomatis dari transaksi + input pengeluaran manual
- Dashboard dengan KPI real-time dan visualisasi chart
- Soft delete pattern untuk semua entitas utama

**Non-Goals:**
- Multi-cabang / multi-outlet (V2)
- Integrasi payment gateway (Midtrans) (V2)
- CRM pelanggan & loyalty point (V2)
- Booking online & manajemen jadwal (V2)
- Ekspor laporan PDF / Excel (V2)
- Aplikasi mobile native / Capacitor (V2)
- Real-time updates / WebSocket
- Email notifications

## Decisions

### 1. Nuxt 3 Fullstack (vs separate FE/BE)
- **Decision**: Gunakan Nuxt 3 sebagai monolith fullstack (Vue 3 frontend + Nitro server backend dalam satu project)
- **Rationale**: Simpler deployment, shared types, file-based routing otomatis, API routes terintegrasi. Untuk MVP dengan solo developer, overhead maintenance lebih rendah daripada stack terpisah.
- **Alternative**: Express/NestJS backend + Vite Vue frontend — ditolak karena kompleksitas deployment dan tidak ada kebutuhan tim terpisah

### 2. Session Cookie Auth (vs JWT)
- **Decision**: Session cookie httpOnly via `nuxt-auth-utils` (server-side session store)
- **Rationale**: CSRF protection lebih sederhana (sameSite=lax), tidak perlu refresh token logic, session dapat di-revoke server-side. Cookie httpOnly tidak bisa diakses JavaScript yang mengurangi risiko XSS token theft.
- **Alternative**: JWT di localStorage — ditolak karena lebih rentan XSS dan perlu implementasi refresh token sendiri

### 3. Prisma ORM (vs raw SQL / Drizzle)
- **Decision**: Prisma ORM dengan PostgreSQL
- **Rationale**: Type safety auto-generated, migration system mature, Prisma Studio untuk debugging data, komunitas besar. Sudah familiar dalam tim (implied dari keputusan tech stack).
- **Alternative**: Drizzle — lebih lightweight tapi ecosystem tooling belum se-mature Prisma

### 4. Soft Delete Pattern
- **Decision**: Semua tabel memiliki `deletedAt DateTime?` dan tidak ada hard delete untuk data bisnis
- **Rationale**: Audit trail, kemampuan recovery data, kebutuhan compliance sederhana. Semua query default menambahkan `where: { deletedAt: null }`.
- **Trade-off**: Query menjadi lebih verbose, perlu indexing pada `deletedAt`

### 5. Vertical Slice Development
- **Decision**: Selesaikan BE + FE satu modul sebelum lanjut ke modul berikutnya (Auth → Services → Orders → Finance → Reports)
- **Rationale**: Setiap modul dapat di-test end-to-end lebih awal, mengurangi integrasi risk di akhir, memungkinkan demo ke stakeholder per modul.
- **Alternative**: Horizontal (backend semua dulu baru frontend) — ditolak karena feedback loop lebih lambat

### 6. Decimal untuk Financial Data
- **Decision**: Gunakan `Decimal` Prisma (`@db.Decimal(14,2)`) untuk semua field harga dan amount
- **Rationale**: Hindari floating point precision issues yang kritis untuk data keuangan
- **Trade-off**: Perlu konversi ke number di frontend untuk display

### 7. Order Number Format
- **Decision**: Format `TRX-YYYYMMDD-XXXX` (auto-increment per hari dengan zero-padding)
- **Rationale**: Human-readable, sortable, unik per hari, tidak expose database ID

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Session management dengan `nuxt-auth-utils` masih relatif baru | Fallback ke implementasi session manual jika ada bug kritis; monitor GitHub issues |
| Solo developer — scope creep bisa delay launch | Strict adherence ke Non-Goals, milestone per fase dengan demo |
| Chart.js dependency menambah bundle size | Load chart hanya di dashboard page (lazy), plugin Chart.js di-load client-side only |
| PostgreSQL setup lokal memerlukan Docker | Dokumentasi setup lengkap di README, gunakan Prisma db push untuk prototyping awal |
| Soft delete query repetitive | Buat reusable Prisma middleware atau helper functions di server/utils |
| Nuxt 3 fullstack — debugging bisa tricky (FE vs BE error) | Gunakan consistent error format, logging di server routes, devtools Nuxt 3 |

## Migration Plan

- **Fase 0**: Setup project, Prisma schema, migrasi database, auth middleware
- **Fase 1**: Services module (BE + FE)
- **Fase 2**: Orders module (BE + FE)
- **Fase 3**: Finance module (BE + FE)
- **Fase 4**: Dashboard & Reports (BE + FE)
- **Fase 5**: Settings & Users (BE + FE)
- **Deploy**: Railway dengan Node adapter, environment variables (DATABASE_URL, NUXT_SESSION_PASSWORD)

## Open Questions

- Apakah perlu rate limiting untuk login endpoint? (rekomendasi: tambahkan setelah MVP)
- Backup strategy untuk PostgreSQL di production? (Railway managed DB otomatis backup)
- Apakah perlu pagination di semua list API atau hanya yang besar? (implementasi: semua list GET pakai pagination default 20 items)
