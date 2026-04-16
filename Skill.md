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

> **Last State (16 April 2026)**
> - ✅ **Image Recovery Tuntas**: Script `scraper/image_patcher.js` telah selesai memproses **414 produk**. Semua gambar produk kini tersinkronisasi di database.
> - ✅ **Quotation UI & Logic**: Halaman penawaran publik (`app/quote/[id]`) dan modal pembuatan penawaran (`CreateQuotationModal`) sudah aktif.
> - ⚠️ **WhatsApp Bridge (On Hold)**: Skrip `scripts/whatsapp_service.js` sudah siap, namun dinonaktifkan sementara atas permintaan user. CRM kembali menggunakan mode manual via WhatsApp Web API.

### 🚀 Next Action (Prioritas Eksekusi)
1. **Verification Production**: Cek rendring gambar produk di UI Vercel/Production untuk memastikan CDN Supabase melayani gambar dengan benar.
2. **Final QA Quotation Flow**: Melakukan simulasi "End-to-End" (Buat Quote -> Kirim Manual -> Approve sebagai Customer) untuk memastikan status leads berubah otomatis menjadi `closed_won`.
3. **Re-activate WhatsApp Bridge**: Aktifkan kembali layanan otomatisasi jika Anda sudah siap untuk melakukan Scan QR Code.
