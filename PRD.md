# Product Requirements Document (PRD): Anekafoto CRM

**Version:** 1.0  
**Status:** Draft  
**Owner:** Antigravity (AI Architect)  
**Project:** Anekafoto CRM Foundation  

---

## 1. Executive Summary
### 🎯 Vision
Membangun platform CRM internal yang lincah dan berpusat pada data untuk **Anekafoto**, yang memungkinkan tim sales mengelola katalog produk ribuan item dan melacak interaksi pelanggan secara real-time dari satu dashboard tunggal.

### 🚩 Problem Statement
Saat ini, data produk tersebar di website dan katalog manual. Tim sales memerlukan cara cepat untuk mengecek spesifikasi (Key Features/In the Box) dan menghubungkan ketertarikan pelanggan ke produk tertentu tanpa harus mencarinya secara manual di web publik.

---

## 2. Target Users & Personas
| Persona | Goals |
| :--- | :--- |
| **Sales Representative** | Cepat menemukan spesifikasi produk untuk menjawab pertanyaan pelanggan & mencatat lead baru. |
| **Sales Manager** | Melihat produk apa yang paling banyak diminati & memantau pipeline penjualan. |
| **Admin IT** | Mengelola database produk dan akses user. |

---

## 3. Functional Requirements (MVP)

### 3.1 Product Intelligence Center (PIC)
*   **Search & Filter**: Pencarian secepat kilat berdasarkan nama, brand, atau rentang harga (menggunakan dataset 442+ produk yang sudah ada).
*   **Deep Specs View**: Menampilkan detail "Key Features" dan "What's In The Box" secara terstruktur (hasil optimasi scraper).

### 3.2 Customer & Lead Management
*   **Customer Profiles**: Database terpusat untuk data pelanggan Anekafoto (Nama, No. WA, Email, Alamat).
*   **Interaction History**: Rekam jejak seluruh chat WhatsApp dan histori pembelian per pelanggan.
*   **Lead Capture**: Form khusus untuk mencatat prospek dari kampanye marketing atau walk-in.

### 3.3 Deal Pipeline (Sales Funnel)
Visualisasi proses penjualan dalam 4 tahap Utama:
1.  **Inquiry**: Pelanggan bertanya tentang produk.
2.  **Quotation**: Penawaran harga diberikan.
3.  **Negotiation**: Diskusi detail/diskon.
4.  **Closed (Won/Lost)**: Status akhir transaksi.

### 3.4 WhatsApp Bridge (Omnichannel Communication)
*   **One-Click Quote**: Tombol "Kirim ke WA" di detail produk yang otomatis menyusun teks harga & spek.
*   **Auto-Notification**: Bot mengirim pesan ke sales saat ada lead baru di dashboard.
*   **Session Dashboard**: Menu untuk scan QR code WhatsApp langsung dari CRM.

---

## 4. Technical Architecture
*   **Frontend**: Next.js 15 (App Router) + Tailwind CSS (UI Premium).
*   **Backend & DB**: Supabase (PostgreSQL) dengan Tabel Prefixed.
*   **Messaging**: `whatsapp-web.js` (wwebjs) untuk jembatan automasi.
*   **Entities**: 
    - `anekafoto_products`: Katalog (Read-only for Sales).
    - `anekafoto_customers`: Data pelanggan tetap.
    - `anekafoto_leads`: Prospek baru.
*   **Infrastructure**: CI/CD via GitHub & Vercel.
*   **Naming Convention**: `anekafoto_` prefix pada seluruh entitas database.

---

## 5. Security & Compliance
*   **Row Level Security (RLS)**: Hanya staff terautentikasi yang bisa mengubah data lead/deal.
*   **Public Access**: Hanya tabel `anekafoto_products` yang bisa dibaca secara publik (untuk kebutuhan katalog non-login).

---

## 6. Future Roadmap (Phase 2)
*   **AI Chat Bridge**: Bot yang bisa menjawab spesifikasi produk berdasarkan database CRM.
*   **Inventory Sync**: Sinkronisasi stok real-time (jika API backend toko tersedia).
*   **Multi-Agent Support**: Distribusi chat WhatsApp ke beberapa tim sales secara otomatis.

---

## 7. Open Questions for Stakeholders
> [!IMPORTANT]
> 1. Apakah ada tahapan spesifik dalam proses penjualan Anekafoto yang berbeda dari standar (Inquiry -> Closed)?
> 2. Siapa saja yang diberikan akses Admin untuk mengubah data produk?
