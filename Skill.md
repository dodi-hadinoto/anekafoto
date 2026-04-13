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
> - ✅ **Vercel 404 Fixed**: Deployment dipindahkan ke project `anekafoto-crm.vercel.app` (Struktur flat).
> - ✅ **Nothing OS 4.0 UI**: Dashboard utama selesai dibangun dengan `framer-motion` dan indikator status *live*.
> - ✅ **Data Seeded**: 442 Data Produk Crawlee telah berhasil dimuat ke Supabase.
> - ✅ **PRD Updated**: Fitur "3.5 Interactive Smart Quotation" telah ditambahkan ke PRD.

### 🚀 Next Action for Tomorrow (Prioritas Eksekusi)
1. **Eksekusi Schema Database (Supabase)**: Membangun skema untuk fitur *Interactive Smart Quotation*.
   - Migration file `20260412173000_smart_quotations.sql` perlu dieksekusi.
   - Tabel: `anekafoto_quotations` dan `anekafoto_quotation_items`.
   - Setup RLS (Row Level Security) untuk akses link penawaran publik (`anon` role but bound by UUID).
2. **Build UI Web Quotation**: Membuat halaman page dinamis untuk URL `/[quotation_id]` agar kustomer bisa menekan tombol *Approve/Reject*.
3. **Mulai WhatsApp Bridge**: Mengirimkan link tersebut secara otomatis.
