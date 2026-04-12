# Changelog: Anekafoto CRM

Rekapan seluruh perubahan, penambahan fitur, dan milestone project Anekafoto CRM.

## [1.0.5] - 2026-04-12
### 🚀 Added
- **Customer Registration Engine**: Implementasi modal registrasi pelanggan dengan data validation.
- **Customer Directory UI**: Halaman directory yang mendukung search real-time dan kategori.
- **Relational Data Binding**: Otomatisasi penarikan kategori (Regular, Silver, Gold, Reseller) ke dalam form.

## [1.0.4] - 2026-04-12
### 🚀 Added
- **Deep Specs View**: Penambahan modal detail produk yang sangat detail.
- **Interaction Feedback**: Efek hover dan klik pada kartu produk yang lebih hidup.
- **Specification Parser**: Logika untuk menampilkan data kompleks (JSONB) secara terstruktur (Key Features, In the Box).

## [1.0.3] - 2026-04-12
### 🚀 Added
- **Product Intelligence Center**: Full implementation of `/inventory` page.
- **Dynamic Filtering**: Sistem filter brand otomatis berdasarkan data live Supabase.
- **Product Cards**: Komponen kartu produk premium dengan efek hover Nothing OS 4.0.
- **Client-side Search**: Fitur pencarian instan pada katalog ribuan produk.

## [1.0.2] - 2026-04-12
### 🚀 Added
- **UI Extension**: Pembuatan halaman **Customers** (Customer Directory) dan **Leads** (Sales Funnel).
- **Component Refactoring**: Ekstraksi sidebar menjadi reusable component `<Sidebar />`.
- **Relational View**: Implementasi fetching data terintegrasi antara Leads, Products, dan Customers di UI.

## [1.0.1] - 2026-04-12
### 🚀 Added
- **Database Schema Expansion**: Berhasil melakukan migrasi tabel `anekafoto_customer_categories`, `anekafoto_customers`, `anekafoto_leads`, dan `anekafoto_interactions`.
- **Master Data Seeding**: Initial seed untuk kategori pelanggan (Regular, Silver, Gold, Reseller).

## [1.0.0] - 2026-04-12
### 🚀 Added
- **Core Scraping**: Deep Extraction 442 produk (Key Features & What's In The Box).
- **Database Architecture**: Inisiasi Supabase dengan prefix `anekafoto_`.
- **Next.js Dashboard**: Inisiasi App Router 15 dengan desain **Nothing OS 4.0**.
- **Data Visuals**: Integrasi Lead Stat Cards dan Growth Line Chart (Recharts).
- **Global & Local Skills**: Penambahan modul **WhatsApp Automation (wwebjs)** dan **CRM Stack**.
- **Documentation**: Pembuatan `PRD.md`, `BUG_TRACKER.md`, dan `CHANGELOG.md` terpusat.

### 🔧 Changed
- **Folder Reorganization**: Memindahkan script scraper ke folder `scraper/` untuk kebersihan root project.
- **Normalization**: Mengonversi harga produk dari string mentah ke numerik di database.

### 🛡️ Fixed
- Perbaikan build error pada Tailwind CSS 4 (`unknown utility class`).
- Sinkronisasi Git index lock.

---

## 📅 Roadmap Terdekat
- [ ] Migrasi tabel `anekafoto_customers` & `anekafoto_leads`.
- [ ] Implementasi Sidebar Navigation (Inventory, Leads, Customers).
- [ ] Setup WhatsApp Bridge (QR Scan via Dashboard).
