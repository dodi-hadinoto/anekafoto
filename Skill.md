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
> - ✅ **Production Restored**: Sinkronisasi Vercel Environment Variables dan forcing dynamic rendering untuk 442 produk.
> - ✅ **Technical Info Fixed**: Perbaikan parser pada `ProductModal.tsx` sehingga spesifikasi produk muncul dengan rapi.
> - ✅ **GitHub Push**: Seluruh perbaikan kode dan status terbaru telah di-push ke main repository.
> - 🏗️ **Image Recovery (Opsi B)**: Script `scraper/image_patcher.js` telah dibuat dan memproses **28 dari 442 produk**.

### 🚀 Next Action (Prioritas Eksekusi)
1. **Resume Image Recovery**: Jalankan kembali `node scraper/image_patcher.js` untuk menyelesaikan sisa 414 produk.
2. **Verification Final**: Cek rendring gambar di Vercel Production UI setelah sinkronisasi DB selesai.
3. **Interactive Smart Quotation Logic**: Menghubungkan tombol "Create Quote" di detail Lead dengan skema database `anekafoto_quotations`.
4. **Dynamic UI Quotation**: Membangun halaman `app/quote/[id]/page.tsx` yang responsif sesuai desain Nothing OS agar pelanggan bisa melakukan Approve/Reject.
5. **WhatsApp Auto-Send**: Mengaktifkan pengiriman link Quotation secara otomatis melalui WhatsApp Bridge.
