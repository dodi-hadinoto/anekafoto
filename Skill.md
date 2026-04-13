---
name: Local Skills - Anekafoto CRM & Automation
description: Kumpulan skill spesifik untuk project Anekafoto, mencakup Scraping, Database, dan Automasi WhatsApp.
---

# Local Skills: Anekafoto CRM & Automation

> File ini adalah Local Skill untuk project `anekafoto`. Sesuai aturan global, instruksi di sini memiliki **Override / Prioritas Tertinggi** untuk project ini.

---

## 1. Web Scraping & Data Engineering

### Crawlee (Industrial Web Scraper - Node.js)
*Sumber: apify/crawlee — The web scraping and browser automation library for Node.js.*

**Key Benefit**: Penanganan retries dan storage secara native untuk scraping skala besar.
**Workflow**: Digunakan di folder `scraper/` untuk memelihara katalog produk yang bersih dan terstruktur.

---

## 2. Communication & Automation

### WhatsApp Integration Architect (wwebjs)
*Sumber: wwebjs/whatsapp-web.js — A WhatsApp client library for Node.js that connects through the WhatsApp Web browser app.*

**Key Benefit**: Memungkinkan CRM Anekafoto untuk mengirim **Product Quote** dan **Lead Notification** langsung ke WhatsApp pelanggan tanpa biaya API resmi. Sangat efektif untuk sistem *Follow-up* otomatis.

**Key Procedures & Utilities**:
- **Session Persistence**: Selalu gunakan `LocalAuth` dari `whatsapp-web.js` untuk menyimpan state login di folder `.wwebjs_auth`.
- **Media Message**: Gunakan `MessageMedia.fromUrl()` untuk mengirim foto produk langsung dari database ke pelanggan.
- **Client Initialization**:
  ```javascript
  const client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true, args: ['--no-sandbox'] }
  });
  ```

**AI Use Case**: Digunakan untuk membangun "WhatsApp Bridge" yang menghubungkan data dari tabel `anekafoto_leads` di Supabase ke percakapan real-time dengan pelanggan.

---

## 3. Session Memory & Pending Tasks (Auto-Saved)

> **Last State (13 April 2026)**
> - ✅ **GitHub Authentication**: Berhasil mengonfigurasi ulang remote git menggunakan PAT (Personal Access Token) untuk push massal.
> - ✅ **Real Data Migration**: **442 Produk hasil scraping** (Fujifilm, Canon, DJI, etc.) telah berhasil diimpor ke Supabase menggantikan data demo.
> - ✅ **Inquiry Modal Resolution**: `AddLeadModal` diperbaiki agar robust terhadap data kosong dan sudah mendukung pemilihan produk asli.
> - ✅ **Live Status Labeling**: Menambahkan label versi pengembangan `DEV_VERSION_v4.0.1_RC2` pada halaman utama.

### 🚀 Next Action (Prioritas Eksekusi)
1. **Interactive Smart Quotation Logic**: Menghubungkan tombol "Create Quote" di detail Lead dengan skema database `anekafoto_quotations`.
2. **Dynamic UI Quotation**: Membangun halaman `app/quote/[id]/page.tsx` yang responsif sesuai desain Nothing OS agar pelanggan bisa melakukan Approve/Reject.
3. **WhatsApp Auto-Send**: Mengaktifkan pengiriman link Quotation secara otomatis melalui WhatsApp Bridge.
4. **Database Optimization**: Pastikan tabel `anekafoto_quotations` dan `anekafoto_quotation_items` sudah terhubung dengan RLS yang benar.
5. **UI Polish**: Selesaikan navigasi detail Lead untuk melihat history interaksi WhatsApp.
