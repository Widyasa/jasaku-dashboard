# FSD — JasaKu Dashboard

**Sistem manajemen UMKM jasa** (salon, laundry, bengkel, spa)
**Tech stack:** Nuxt 3 fullstack · Prisma ORM · PostgreSQL · Pinia · Tailwind CSS

---

## Daftar Isi

1. [Overview & Tech Stack](#1-overview--tech-stack)
2. [Package Dependencies](#2-package-dependencies)
3. [Struktur Folder](#3-struktur-folder)
4. [Database Schema (Prisma)](#4-database-schema-prisma)
5. [ERD — Relasi Tabel](#5-erd--relasi-tabel)
6. [API Routes](#6-api-routes)
7. [Component Tree](#7-component-tree)
8. [Auth Flow](#8-auth-flow)
9. [Role & Akses](#9-role--akses)
10. [Roadmap Pengerjaan](#10-roadmap-pengerjaan)

---

## 1. Overview & Tech Stack

| Aspek | Detail |
|---|---|
| Nama sistem | JasaKu Dashboard |
| Target UMKM | Salon, laundry, bengkel, spa, jasa lainnya |
| Pengguna | Owner, Kasir |
| Framework | Nuxt 3 (fullstack — FE + BE dalam satu project) |
| ORM | Prisma |
| Database | PostgreSQL 17 (via Docker) |
| Auth | nuxt-auth-utils (session cookie httpOnly) |
| State management | Pinia |
| Styling | Tailwind CSS v4 |
| Validasi | Zod |
| Runtime | Node.js (Nitro / H3) |
| Deploy target | Railway / VPS (Node adapter) |

### Fitur MVP

| Modul | Deskripsi |
|---|---|
| Auth | Login/logout, session cookie, role-based access |
| Layanan & Stok | CRUD layanan/paket, manajemen stok bahan habis pakai |
| Transaksi / Order | Buat order, pilih layanan, update status, konfirmasi bayar |
| Keuangan | Rekap pemasukan otomatis, input pengeluaran manual |
| Laporan | Ringkasan omzet, chart pendapatan, layanan terlaris |
| Dashboard | KPI real-time, order aktif, alert stok tipis |
| Settings | Manajemen akun pengguna (owner only) |

### Post-MVP (V2)

- CRM pelanggan & loyalty point
- Booking online & manajemen jadwal
- Integrasi payment gateway (Midtrans)
- Multi-cabang / multi-outlet
- Ekspor laporan PDF / Excel
- Aplikasi mobile (Capacitor)

---

## 2. Package Dependencies

### Instalasi lengkap

```bash
# Dependencies utama
npm install @prisma/client
npm install nuxt-auth-utils
npm install @pinia/nuxt
npm install zod
npm install bcrypt

# Dev dependencies
npm install -D prisma
npm install -D @types/bcrypt
npm install -D @nuxtjs/tailwindcss
```

### Pemetaan package per fungsi

| Package | Kategori | Fungsi |
|---|---|---|
| `prisma` | ORM (dev) | CLI untuk migrate, generate, studio |
| `@prisma/client` | ORM | Prisma client untuk query database |
| `nuxt-auth-utils` | Auth | Session management berbasis cookie httpOnly |
| `bcrypt` | Auth | Hash & verify password |
| `@types/bcrypt` | Auth (dev) | TypeScript types untuk bcrypt |
| `@pinia/nuxt` | State | Global state management (cart, auth, UI) |
| `zod` | Validasi | Schema validasi input server-side & client-side |
| `@nuxtjs/tailwindcss` | Styling | Utility-first CSS framework |

### `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-auth-utils',
  ],
  runtimeConfig: {
    // server-only (tidak expose ke client)
    sessionPassword: process.env.NUXT_SESSION_PASSWORD,
  },
})
```

> **Catatan Prisma:** `DATABASE_URL` dibaca langsung oleh Prisma dari `.env`, tidak perlu didaftarkan ke `runtimeConfig`.

### File `.env`

```bash
# PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jasakу_db"

# Nuxt session (min 32 karakter, random string)
NUXT_SESSION_PASSWORD="ganti-dengan-random-string-minimum-32-karakter"
```

---

## 3. Struktur Folder

```
jasakу-dashboard/
├── assets/
│   └── css/
│       └── main.css              # Global styles, Tailwind import
│
├── components/
│   ├── dashboard/
│   │   ├── StatCard.vue          # KPI tile (omzet, jumlah order, dsb)
│   │   ├── RevenueChart.vue      # Chart.js line/bar chart
│   │   ├── TopServicesTable.vue  # Tabel layanan terlaris
│   │   ├── ActiveOrdersList.vue  # Daftar order pending/in_progress
│   │   ├── LowStockAlert.vue     # Alert stok mendekati habis
│   │   └── DateRangePicker.vue   # Pilih rentang tanggal laporan
│   │
│   ├── orders/
│   │   ├── OrderTable.vue        # List order + filter + pagination
│   │   ├── OrderStatusBadge.vue  # Badge warna per status
│   │   ├── OrderForm.vue         # Form buat order baru
│   │   ├── ServicePickerModal.vue # Modal search & pilih layanan
│   │   ├── CartSummary.vue       # Ringkasan item yang dipilih
│   │   ├── PaymentModal.vue      # Konfirmasi metode & status bayar
│   │   └── ReceiptView.vue       # Tampilan struk (printable)
│   │
│   ├── services/
│   │   ├── ServiceCard.vue       # Card per layanan
│   │   ├── ServiceForm.vue       # Form tambah/edit layanan
│   │   └── StockBadge.vue        # Badge level stok
│   │
│   ├── finance/
│   │   ├── FinanceTable.vue      # Tabel riwayat income/expense
│   │   └── ExpenseForm.vue       # Form input pengeluaran manual
│   │
│   ├── layout/
│   │   ├── AppSidebar.vue        # Sidebar navigasi
│   │   ├── AppTopbar.vue         # Topbar + nama user + logout
│   │   ├── AppBreadcrumb.vue     # Breadcrumb navigasi
│   │   └── AppNotifBell.vue      # Notifikasi stok tipis
│   │
│   └── ui/                       # Design system / shared components
│       ├── BaseButton.vue
│       ├── BaseInput.vue
│       ├── BaseModal.vue
│       ├── BaseTable.vue
│       ├── BasePagination.vue
│       ├── BaseSelect.vue
│       ├── BaseToast.vue
│       ├── ConfirmDialog.vue
│       ├── EmptyState.vue
│       └── LoadingSkeleton.vue
│
├── composables/
│   ├── useOrders.ts              # CRUD order + update status/payment
│   ├── useServices.ts            # CRUD layanan + update stok
│   ├── useFinance.ts             # Fetch finance records
│   ├── useReports.ts             # Fetch data laporan & chart
│   ├── useToast.ts               # Toast notification helper
│   └── useConfirm.ts             # Dialog konfirmasi helper
│
├── layouts/
│   ├── default.vue               # Layout utama: sidebar + topbar
│   └── auth.vue                  # Layout halaman login (tanpa sidebar)
│
├── middleware/
│   ├── auth.ts                   # Cek session, redirect ke /login
│   └── owner-only.ts             # Guard halaman khusus owner
│
├── pages/
│   ├── login.vue
│   ├── index.vue                 # Dashboard utama
│   ├── orders/
│   │   ├── index.vue             # Daftar semua transaksi
│   │   ├── new.vue               # Buat order baru
│   │   └── [id].vue              # Detail order
│   ├── services/
│   │   ├── index.vue             # Daftar layanan & stok
│   │   ├── new.vue               # Form tambah layanan
│   │   └── [id]/
│   │       └── edit.vue          # Form edit layanan
│   ├── finance/
│   │   ├── index.vue             # Rekap keuangan
│   │   └── new-expense.vue       # Input pengeluaran manual
│   └── settings/
│       ├── index.vue             # Profil & ganti password
│       └── users.vue             # Manajemen pengguna (owner only)
│
├── plugins/
│   └── chartjs.client.ts         # Register Chart.js komponen
│
├── prisma/
│   ├── schema.prisma             # Definisi semua model/tabel
│   └── migrations/               # Auto-generated oleh prisma migrate
│
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── logout.post.ts
│   │   │   ├── me.get.ts
│   │   │   └── password.put.ts
│   │   ├── users/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   └── [id].put.ts
│   │   ├── services/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── [id].delete.ts
│   │   │   └── [id]/
│   │   │       └── stock.put.ts
│   │   ├── orders/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   └── [id]/
│   │   │       ├── status.put.ts
│   │   │       └── payment.put.ts
│   │   ├── finance/
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   └── reports/
│   │       ├── summary.get.ts
│   │       ├── chart.get.ts
│   │       └── top-services.get.ts
│   │
│   ├── database/
│   │   └── index.ts              # Prisma client singleton
│   │
│   ├── middleware/
│   │   └── auth.ts               # Server-side request guard
│   │
│   └── utils/
│       ├── auth.ts               # requireOwner(), requireAuth() helpers
│       ├── orderNumber.ts        # Generate TRX-YYYYMMDD-XXXX
│       └── validators.ts         # Zod schemas (shared)
│
├── stores/
│   ├── auth.ts                   # User session & role
│   ├── cart.ts                   # Item yang dipilih saat buat order
│   └── ui.ts                     # Sidebar toggle, global loading
│
├── types/
│   └── index.d.ts                # Global TypeScript types
│
├── .env                          # DATABASE_URL, NUXT_SESSION_PASSWORD
├── .env.example                  # Template .env (value dikosongkan)
├── .gitignore
├── nuxt.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 4. Database Schema (Prisma)

File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// ENUM
// ─────────────────────────────────────────

enum Role {
  OWNER
  KASIR
}

enum ServiceType {
  SERVICE   // jasa murni (tidak ada stok fisik)
  PRODUCT   // produk fisik yang dijual
}

enum OrderStatus {
  PENDING
  IN_PROGRESS
  DONE
  CANCELLED
}

enum PaymentMethod {
  CASH
  QRIS
  TRANSFER
}

enum PaymentStatus {
  UNPAID
  PAID
}

enum FinanceType {
  INCOME
  EXPENSE
}

// ─────────────────────────────────────────
// MODEL
// ─────────────────────────────────────────

model User {
  id           String    @id @default(uuid())
  name         String    @db.VarChar(100)
  email        String    @unique @db.VarChar(150)
  passwordHash String    @db.Text
  role         Role      @default(KASIR)
  isActive     Boolean   @default(true)

  // Soft delete
  deletedAt    DateTime?

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  // Relations
  orders         Order[]
  financeRecords FinanceRecord[]

  @@map("users")
}

model Category {
  id   String      @id @default(uuid())
  name String      @db.VarChar(80)
  type ServiceType @default(SERVICE)

  // Soft delete
  deletedAt DateTime?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  services Service[]

  @@map("categories")
}

model Service {
  id          String      @id @default(uuid())
  categoryId  String
  name        String      @db.VarChar(120)
  description String?     @db.Text
  price       Decimal     @db.Decimal(12, 2)
  durationMin Int?                          // estimasi durasi pengerjaan (menit)
  stock       Int?                          // null = unlimited (untuk jasa murni)
  unit        String?     @db.VarChar(30)   // pcs, kg, liter, dll
  isActive    Boolean     @default(true)

  // Soft delete
  deletedAt   DateTime?

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  category   Category    @relation(fields: [categoryId], references: [id])
  orderItems OrderItem[]

  @@map("services")
}

model Order {
  id            String        @id @default(uuid())
  orderNumber   String        @unique @db.VarChar(20)  // TRX-20240101-0001
  kasirId       String
  customerName  String?       @db.VarChar(100)
  customerPhone String?       @db.VarChar(20)
  status        OrderStatus   @default(PENDING)
  paymentMethod PaymentMethod @default(CASH)
  paymentStatus PaymentStatus @default(UNPAID)
  subtotal      Decimal       @db.Decimal(14, 2)
  discount      Decimal       @default(0) @db.Decimal(14, 2)
  total         Decimal       @db.Decimal(14, 2)
  notes         String?       @db.Text

  // Soft delete
  deletedAt     DateTime?

  completedAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  kasir         User          @relation(fields: [kasirId], references: [id])
  items         OrderItem[]
  financeRecord FinanceRecord?

  @@map("orders")
}

model OrderItem {
  id          String  @id @default(uuid())
  orderId     String
  serviceId   String
  serviceName String  @db.VarChar(120)  // snapshot nama saat transaksi
  price       Decimal @db.Decimal(12, 2) // snapshot harga saat transaksi
  quantity    Int
  subtotal    Decimal @db.Decimal(14, 2) // price × quantity

  createdAt   DateTime @default(now())

  // Relations
  order   Order   @relation(fields: [orderId], references: [id])
  service Service @relation(fields: [serviceId], references: [id])

  @@map("order_items")
}

model FinanceRecord {
  id          String      @id @default(uuid())
  type        FinanceType
  orderId     String?     @unique               // nullable — hanya untuk income dari order
  userId      String
  amount      Decimal     @db.Decimal(14, 2)
  category    String      @db.VarChar(80)       // operasional, bahan baku, gaji, dll
  description String?     @db.Text

  // Soft delete
  deletedAt   DateTime?

  recordedAt  DateTime    @default(now())
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  order Order? @relation(fields: [orderId], references: [id])
  user  User   @relation(fields: [userId], references: [id])

  @@map("finance_records")
}
```

### Prisma Client Singleton

File: `server/database/index.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

// Cegah multiple instance di dev mode (hot reload)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### Perintah Prisma yang sering dipakai

```bash
# Buat & jalankan migrasi baru (setelah ubah schema)
npx prisma migrate dev --name nama_migrasi

# Generate ulang Prisma Client (setelah migrate atau pull)
npx prisma generate

# Buka GUI untuk lihat/edit data
npx prisma studio

# Sync schema ke DB tanpa membuat file migrasi (prototyping saja)
npx prisma db push

# Reset database + jalankan ulang semua migrasi
npx prisma migrate reset
```

### Catatan Soft Delete

Semua tabel utama memiliki kolom `deletedAt DateTime?`. Record dianggap terhapus jika `deletedAt` tidak null. Semua query harus selalu menambahkan filter `where: { deletedAt: null }` kecuali ada kebutuhan spesifik untuk melihat data yang sudah dihapus.

Contoh implementasi di server route:

```typescript
// Selalu filter soft delete
const services = await prisma.service.findMany({
  where: {
    deletedAt: null,
    isActive: true,
  }
})

// Soft delete — jangan pakai prisma.service.delete()
await prisma.service.update({
  where: { id },
  data: { deletedAt: new Date() }
})
```

---

## 5. ERD — Relasi Tabel

```
users ──────────────────────────── orders
  │  (1 kasir → banyak order)        │
  │                                  │
  └──────────────────────── finance_records
       (1 user → banyak records)     │
                                     │
orders ──────────────────── order_items
  │  (1 order → banyak items)        │
  │                                  │
  └────────── finance_records        │
    (1 order → 0/1 finance record)   │
                                     │
categories ──── services ───────────┘
  (1 kategori    (1 layanan → banyak order items)
   → banyak
   layanan)
```

| Relasi | Tipe | Keterangan |
|---|---|---|
| `users` → `orders` | 1 to many | Satu kasir bisa membuat banyak order |
| `orders` → `order_items` | 1 to many | Satu order memiliki banyak item |
| `services` → `order_items` | 1 to many | Satu layanan bisa muncul di banyak order |
| `categories` → `services` | 1 to many | Pengelompokan layanan |
| `orders` → `finance_records` | 1 to 0/1 | Order yang sudah paid otomatis punya 1 finance record income |
| `users` → `finance_records` | 1 to many | Mencatat siapa yang menginput |

---

## 6. API Routes

Semua route ada di `server/api/` dan diakses via prefix `/api/`.

### Auth

| Method | Path | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login, set session cookie |
| POST | `/api/auth/logout` | Auth | Clear session |
| GET | `/api/auth/me` | Auth | Data user dari session |
| PUT | `/api/auth/password` | Auth | Ganti password |

### Users

| Method | Path | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/users` | Owner | List semua user |
| POST | `/api/users` | Owner | Buat user kasir baru |
| PUT | `/api/users/[id]` | Owner | Update nama, role, is_active |

### Services (Layanan)

| Method | Path | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/services` | Auth | List layanan (`?category`, `?search`, `?active`) |
| GET | `/api/services/[id]` | Auth | Detail layanan |
| POST | `/api/services` | Owner | Tambah layanan baru |
| PUT | `/api/services/[id]` | Owner | Update layanan |
| PUT | `/api/services/[id]/stock` | Owner | Update stok (`delta`, `note`) |
| DELETE | `/api/services/[id]` | Owner | Soft delete layanan |

### Orders (Transaksi)

| Method | Path | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/orders` | Auth | List order paginated (`?status`, `?date_from`, `?date_to`, `?page`) |
| GET | `/api/orders/[id]` | Auth | Detail order + items |
| POST | `/api/orders` | Auth | Buat order baru |
| PUT | `/api/orders/[id]/status` | Auth | Update status order |
| PUT | `/api/orders/[id]/payment` | Auth | Konfirmasi pembayaran — otomatis buat `FinanceRecord` |
| DELETE | `/api/orders/[id]` | Owner | Soft delete / cancel order |

### Finance & Laporan

| Method | Path | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/finance` | Owner | List records (`?type`, `?date_from`, `?date_to`) |
| POST | `/api/finance` | Owner | Input pengeluaran manual |
| GET | `/api/reports/summary` | Owner | Total income, expense, profit, jumlah order |
| GET | `/api/reports/chart` | Owner | Data array untuk line chart (`?period=daily\|weekly\|monthly`) |
| GET | `/api/reports/top-services` | Owner | Ranking layanan terlaris |

### Server Middleware

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/')) return
  if (path === '/api/auth/login') return

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
})

// server/utils/auth.ts
export async function requireOwner(event: H3Event) {
  const { user } = await getUserSession(event)
  if (user.role !== 'OWNER') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }
}
```

---

## 7. Component Tree

### Layouts

```
layouts/
├── default.vue             ← wrapper semua halaman setelah login
│   ├── AppSidebar.vue
│   ├── AppTopbar.vue
│   │   └── AppNotifBell.vue
│   ├── AppBreadcrumb.vue
│   └── <slot />            ← konten halaman
└── auth.vue                ← wrapper halaman login
    └── <slot />
```

### Pages

```
pages/
├── login.vue
├── index.vue (Dashboard)
│   ├── StatCard.vue × 4    (omzet, order aktif, stok kritis, profit)
│   ├── RevenueChart.vue
│   ├── TopServicesTable.vue
│   ├── ActiveOrdersList.vue
│   └── LowStockAlert.vue
│
├── orders/
│   ├── index.vue
│   │   ├── OrderTable.vue
│   │   │   ├── OrderStatusBadge.vue
│   │   │   └── BasePagination.vue
│   │   └── DateRangePicker.vue
│   │
│   ├── new.vue
│   │   ├── ServicePickerModal.vue
│   │   ├── CartSummary.vue
│   │   ├── BaseInput.vue
│   │   └── BaseButton.vue
│   │
│   └── [id].vue
│       ├── OrderStatusBadge.vue
│       ├── PaymentModal.vue
│       └── ReceiptView.vue
│
├── services/
│   ├── index.vue
│   │   ├── ServiceCard.vue
│   │   │   └── StockBadge.vue
│   │   └── BaseButton.vue
│   │
│   ├── new.vue
│   │   └── ServiceForm.vue
│   │
│   └── [id]/edit.vue
│       └── ServiceForm.vue
│
├── finance/
│   ├── index.vue
│   │   ├── FinanceTable.vue
│   │   └── DateRangePicker.vue
│   └── new-expense.vue
│       └── ExpenseForm.vue
│
└── settings/
    ├── index.vue           (profil + ganti password)
    └── users.vue           (owner only)
```

### Pinia Stores

| Store | State | Actions |
|---|---|---|
| `auth.ts` | `user`, `role`, `loggedIn` | `login()`, `logout()`, `fetchMe()` |
| `cart.ts` | `items[]`, `total` | `addItem()`, `removeItem()`, `clearCart()` |
| `ui.ts` | `sidebarOpen`, `loading` | `toggleSidebar()`, `setLoading()` |

### Composables

| Composable | Fungsi utama |
|---|---|
| `useOrders.ts` | `fetchOrders()`, `createOrder()`, `updateStatus()`, `confirmPayment()` |
| `useServices.ts` | `fetchServices()`, `createService()`, `updateService()`, `updateStock()` |
| `useFinance.ts` | `fetchFinance()`, `createExpense()` |
| `useReports.ts` | `fetchSummary()`, `fetchChartData()`, `fetchTopServices()` |
| `useToast.ts` | `success()`, `error()`, `info()` |
| `useConfirm.ts` | `confirm(message)` → Promise\<boolean\> |

---

## 8. Auth Flow

### Login

```
1. User isi form login di /login
   └── validasi Zod client-side (email format, password tidak kosong)

2. POST /api/auth/login { email, password }
   └── cari user di DB via Prisma (where: { email, deletedAt: null })
   └── bcrypt.compare(password, user.passwordHash)

3. Jika cocok:
   └── setUserSession(event, { user: { id, name, role } })
   └── cookie httpOnly di-set otomatis (7 hari)
   └── return user object

4. Client redirect ke / (dashboard)
   └── Pinia auth store update state

5. Jika gagal:
   └── return 401 dengan pesan generik
   └── tampil error di form (tidak expose email vs password salah)
```

### Session Guard

```typescript
// middleware/auth.ts — client-side
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})

// middleware/owner-only.ts — client-side
export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession()
  if (user.value?.role !== 'OWNER') {
    return navigateTo('/')
  }
})
```

### Keamanan

| Aspek | Implementasi |
|---|---|
| Password | bcrypt salt rounds 12 — tidak pernah simpan plaintext |
| Session | Cookie httpOnly + secure + sameSite=lax |
| CSRF | sameSite=lax sudah cukup proteksi untuk form biasa |
| SQL Injection | Aman — Prisma menggunakan parameterized queries |
| Validasi input | Semua body di-validate Zod di server sebelum masuk DB |
| Soft delete | User yang dihapus tidak bisa login (filter `deletedAt: null`) |

---

## 9. Role & Akses

| Halaman / Aksi | Kasir | Owner |
|---|---|---|
| Dashboard | ✅ | ✅ |
| Lihat daftar transaksi | ✅ | ✅ |
| Buat order baru | ✅ | ✅ |
| Update status order | ✅ | ✅ |
| Konfirmasi pembayaran | ✅ | ✅ |
| Hapus / cancel order | ❌ | ✅ |
| Lihat daftar layanan | ✅ | ✅ |
| Tambah / edit layanan | ❌ | ✅ |
| Update stok | ❌ | ✅ |
| Hapus layanan | ❌ | ✅ |
| Laporan keuangan | ❌ | ✅ |
| Input pengeluaran | ❌ | ✅ |
| Kelola akun pengguna | ❌ | ✅ |
| Ganti password sendiri | ✅ | ✅ |

---

## 10. Roadmap Pengerjaan

Pendekatan yang direkomendasikan: **vertical slice per modul** — selesaikan BE + FE satu modul sebelum lanjut ke modul berikutnya.

### Fase 0 — Fondasi (1–2 hari)

- [ ] `nuxi init` + install semua dependencies
- [ ] Setup Prisma, hubungkan ke PostgreSQL Docker
- [ ] Buat `prisma/schema.prisma` dengan semua model
- [ ] Jalankan `prisma migrate dev --name init`
- [ ] Buat server middleware auth + Prisma singleton
- [ ] Layout default + halaman login terhubung ke API

### Fase 1 — Modul Layanan & Stok (2–3 hari)

- [ ] API: GET + POST `/api/services`
- [ ] API: PUT + DELETE `/api/services/[id]`
- [ ] API: PUT `/api/services/[id]/stock`
- [ ] Halaman daftar layanan dengan filter
- [ ] Form tambah & edit layanan

### Fase 2 — Modul Transaksi (3–4 hari)

- [ ] API: POST `/api/orders` (buat order + order items dalam 1 transaksi DB)
- [ ] API: GET list & detail, PUT status & payment
- [ ] Halaman buat order baru (picker + cart)
- [ ] Halaman daftar & detail order
- [ ] Modal konfirmasi bayar + ReceiptView

### Fase 3 — Modul Keuangan (2–3 hari)

- [ ] API: GET + POST `/api/finance`
- [ ] API: GET reports (summary, chart, top-services)
- [ ] Halaman rekap keuangan + form pengeluaran

### Fase 4 — Dashboard (2 hari)

- [ ] KPI stat cards (pakai data dari reports/summary)
- [ ] Revenue chart (Chart.js)
- [ ] Active orders list + low stock alert

### Fase 5 — Settings & Users (1–2 hari)

- [ ] API + halaman manajemen pengguna
- [ ] Form ganti password

**Estimasi total: 11–16 hari** (solo developer, pengerjaan penuh)

---

*Dokumen ini dihasilkan sebagai bagian dari proses perencanaan awal. Update seiring pengembangan berlangsung.*
