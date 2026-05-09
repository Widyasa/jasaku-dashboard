## 1. Fase 0 — Fondasi Project

- [ ] 1.1 Initialize project dengan `nuxi init` dan install dependencies (prisma, nuxt-auth-utils, @pinia/nuxt, zod, bcrypt)
- [ ] 1.2 Setup Prisma client dan PostgreSQL connection di `.env`
- [ ] 1.3 Buat `prisma/schema.prisma` dengan semua model (User, Category, Service, Order, OrderItem, FinanceRecord) dan enum types
- [ ] 1.4 Jalankan `prisma migrate dev --name init` dan `prisma generate`
- [ ] 1.5 Buat Prisma client singleton di `server/database/index.ts`
- [ ] 1.6 Setup `nuxt.config.ts` dengan modules (tailwindcss, pinia, nuxt-auth-utils) dan runtimeConfig
- [ ] 1.7 Buat global styles dan Tailwind setup di `assets/css/main.css`
- [ ] 1.8 Setup types global di `types/index.d.ts`
- [ ] 1.9 Buat Zod validators dasar di `server/utils/validators.ts`

## 2. Fase 0 — Auth Infrastructure

- [ ] 2.1 Buat server middleware auth di `server/middleware/auth.ts` (cek session, reject 401 jika tidak login)
- [ ] 2.2 Buat auth helpers di `server/utils/auth.ts` (requireAuth, requireOwner)
- [ ] 2.3 Implementasi API POST /api/auth/login (bcrypt compare, setUserSession)
- [ ] 2.4 Implementasi API POST /api/auth/logout (clear session)
- [ ] 2.5 Implementasi API GET /api/auth/me (return user dari session)
- [ ] 2.6 Implementasi API PUT /api/auth/password (validasi password lama, bcrypt hash baru)
- [ ] 2.7 Buat client middleware auth di `middleware/auth.ts` (redirect ke /login jika tidak loggedIn)
- [ ] 2.8 Buat client middleware owner-only di `middleware/owner-only.ts` (redirect ke / jika role !== OWNER)
- [ ] 2.9 Buat auth Pinia store di `stores/auth.ts` (login, logout, fetchMe, user state)
- [ ] 2.10 Buat layout auth.vue untuk halaman login (tanpa sidebar)
- [ ] 2.11 Buat layout default.vue untuk halaman utama (sidebar + topbar slot)
- [ ] 2.12 Buat halaman login.vue dengan form dan validasi client-side

## 3. Fase 1 — Modul Layanan & Stok (Backend)

- [ ] 3.1 Implementasi API GET /api/services (list dengan filter: category, search, active, pagination)
- [ ] 3.2 Implementasi API GET /api/services/[id] (detail service dengan category)
- [ ] 3.3 Implementasi API POST /api/services (create service, validasi Zod, owner-only)
- [ ] 3.4 Implementasi API PUT /api/services/[id] (update service, validasi Zod, owner-only)
- [ ] 3.5 Implementasi API PUT /api/services/[id]/stock (update stok dengan delta, validasi stok tidak negatif, owner-only)
- [ ] 3.6 Implementasi API DELETE /api/services/[id] (soft delete, owner-only)
- [ ] 3.7 Implementasi API GET /api/services dengan include category relation
- [ ] 3.8 Buat orderNumber utility di `server/utils/orderNumber.ts` (format TRX-YYYYMMDD-XXXX)

## 4. Fase 1 — Modul Layanan & Stok (Frontend)

- [ ] 4.1 Buat halaman services/index.vue (daftar layanan dengan filter dan pencarian)
- [ ] 4.2 Buat ServiceCard.vue component (tampilan card per layanan dengan StockBadge)
- [ ] 4.3 Buat ServiceForm.vue component (form tambah/edit layanan)
- [ ] 4.4 Buat halaman services/new.vue (form tambah layanan baru)
- [ ] 4.5 Buat halaman services/[id]/edit.vue (form edit layanan)
- [ ] 4.6 Buat StockBadge.vue component (indikator level stok)
- [ ] 4.7 Buat useServices composable (fetchServices, createService, updateService, updateStock, deleteService)
- [ ] 4.8 Integrasi ServicePickerModal.vue (untuk dipakai nanti di order creation)

## 5. Fase 2 — Modul Transaksi/Order (Backend)

- [ ] 5.1 Implementasi API POST /api/orders (create order + items dalam 1 transaksi, validasi stok, generate orderNumber)
- [ ] 5.2 Implementasi API GET /api/orders (list order dengan filter status, date range, pagination)
- [ ] 5.3 Implementasi API GET /api/orders/[id] (detail order dengan items lengkap)
- [ ] 5.4 Implementasi API PUT /api/orders/[id]/status (update status, set completedAt jika DONE, restore stok jika CANCELLED)
- [ ] 5.5 Implementasi API PUT /api/orders/[id]/payment (konfirmasi bayar, create FinanceRecord INCOME)
- [ ] 5.6 Implementasi API DELETE /api/orders/[id] (soft delete, restore stok jika belum paid, owner-only)
- [ ] 5.7 Validasi business rule: paid order tidak boleh di-cancel atau di-delete

## 6. Fase 2 — Modul Transaksi/Order (Frontend)

- [ ] 6.1 Buat halaman orders/index.vue (daftar order dengan filter, status badge, pagination)
- [ ] 6.2 Buat OrderTable.vue component (tabel order dengan OrderStatusBadge)
- [ ] 6.3 Buat OrderStatusBadge.vue component (badge warna per status: PENDING, IN_PROGRESS, DONE, CANCELLED)
- [ ] 6.4 Buat halaman orders/new.vue (form buat order baru)
- [ ] 6.5 Buat ServicePickerModal.vue (modal pilih layanan dengan search)
- [ ] 6.6 Buat CartSummary.vue component (ringkasan item yang dipilih)
- [ ] 6.7 Buat useOrders composable (fetchOrders, createOrder, updateStatus, confirmPayment)
- [ ] 6.8 Buat cart Pinia store di `stores/cart.ts` (addItem, removeItem, clearCart, total)
- [ ] 6.9 Buat halaman orders/[id].vue (detail order dengan PaymentModal dan ReceiptView)
- [ ] 6.10 Buat PaymentModal.vue component (konfirmasi metode dan status bayar)
- [ ] 6.11 Buat ReceiptView.vue component (tampilan struk printable)

## 7. Fase 3 — Modul Keuangan & Laporan (Backend)

- [ ] 7.1 Implementasi API GET /api/finance (list records dengan filter type, date range, owner-only)
- [ ] 7.2 Implementasi API POST /api/finance (input pengeluaran manual, validasi Zod, owner-only)
- [ ] 7.3 Implementasi API GET /api/reports/summary (total income, expense, profit, order count, owner-only)
- [ ] 7.4 Implementasi API GET /api/reports/chart (data array untuk line chart per period: daily/weekly/monthly)
- [ ] 7.5 Implementasi API GET /api/reports/top-services (ranking layanan terlaris berdasarkan order items)

## 8. Fase 3 — Modul Keuangan (Frontend)

- [ ] 8.1 Buat halaman finance/index.vue (rekap keuangan dengan filter tanggal dan tipe)
- [ ] 8.2 Buat FinanceTable.vue component (tabel riwayat income/expense)
- [ ] 8.3 Buat halaman finance/new-expense.vue (form input pengeluaran manual)
- [ ] 8.4 Buat ExpenseForm.vue component (form pengeluaran dengan kategori)
- [ ] 8.5 Buat useFinance composable (fetchFinance, createExpense)
- [ ] 8.6 Buat useReports composable (fetchSummary, fetchChartData, fetchTopServices)
- [ ] 8.7 Setup Chart.js plugin di `plugins/chartjs.client.ts`

## 9. Fase 4 — Dashboard & Komponen UI

- [ ] 9.1 Buat halaman index.vue (dashboard utama)
- [ ] 9.2 Buat StatCard.vue component (KPI tile: omzet, order aktif, stok kritis, profit)
- [ ] 9.3 Buat RevenueChart.vue component (Chart.js line chart pendapatan)
- [ ] 9.4 Buat TopServicesTable.vue component (tabel layanan terlaris)
- [ ] 9.5 Buat ActiveOrdersList.vue component (daftar order pending/in_progress)
- [ ] 9.6 Buat LowStockAlert.vue component (alert stok mendekati habis)
- [ ] 9.7 Buat DateRangePicker.vue component (pilih rentang tanggal laporan)
- [ ] 9.8 Integrasi semua dashboard components dengan data dari API reports

## 10. Fase 5 — Settings, Users, & Layout

- [ ] 10.1 Implementasi API GET /api/users (list users, owner-only)
- [ ] 10.2 Implementasi API POST /api/users (create user, owner-only)
- [ ] 10.3 Implementasi API PUT /api/users/[id] (update user, owner-only)
- [ ] 10.4 Buat halaman settings/users.vue (manajemen pengguna, owner-only)
- [ ] 10.5 Buat halaman settings/index.vue (profil dan ganti password)
- [ ] 10.6 Buat AppSidebar.vue component (navigasi sidebar)
- [ ] 10.7 Buat AppTopbar.vue component (topbar dengan nama user dan logout)
- [ ] 10.8 Buat AppBreadcrumb.vue component (breadcrumb navigasi)
- [ ] 10.9 Buat AppNotifBell.vue component (notifikasi stok tipis)
- [ ] 10.10 Buat UI components dasar (BaseButton, BaseInput, BaseModal, BaseTable, BasePagination, BaseSelect, BaseToast, ConfirmDialog, EmptyState, LoadingSkeleton)
- [ ] 10.11 Buat useToast composable (success, error, info notifications)
- [ ] 10.12 Buat useConfirm composable (dialog konfirmasi Promise boolean)
- [ ] 10.13 Setup ui Pinia store di `stores/ui.ts` (sidebar toggle, global loading)

## 11. Testing & Polish

- [ ] 11.1 Test end-to-end flow: login → buat layanan → buat order → bayar → lihat laporan
- [ ] 11.2 Test role-based access: kasir tidak bisa akses owner features
- [ ] 11.3 Test soft delete: verify data tidak muncul tapi tetap di DB
- [ ] 11.4 Test edge cases: stok habis, cancel order, ganti password
- [ ] 11.5 Verify responsive design dengan Tailwind CSS
- [ ] 11.6 Code review dan cleanup (hapus console.log, optimize imports)
- [ ] 11.7 Deploy ke Railway / VPS dengan environment variables yang benar
