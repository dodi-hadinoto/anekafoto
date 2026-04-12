---
name: Local Skills - Anekafoto Scraper
description: Kumpulan skill spesifik untuk project scraping Anekafoto menggunakan Crawlee (Node.js & Python).
---

# Local Skills: Anekafoto Scraper

> File ini adalah Local Skill untuk project `anekafoto`. Sesuai aturan global, instruksi di sini memiliki **Override / Prioritas Tertinggi** untuk project ini.

---

## Web Scraping Specialized Skills

### Crawlee (Industrial Web Scraper - Node.js)
*Sumber: apify/crawlee — The web scraping and browser automation library for Node.js.*

**Key Benefit**: Memberikan keandalan (reliability) tingkat tinggi untuk scraping skala besar. Menangani retries, proxy rotation, dan storage secara native. Sangat cocok untuk memanen data bersih untuk RAG/LLM.

**Key Commands & Workflows**:
- `npx crawlee create <name>`: Inisialisasi project scraping baru dengan template (Playwright/Cheerio).
- `npx crawlee run`: Menjalankan crawler lokal.
- **AI-Ready Output**: Secara otomatis menyimpan hasil ke `storage/datasets` dalam format JSON yang siap di-consume oleh AI.

**AI Use Case**: Digunakan di project ini (`crawler.js`) untuk melakukan indexing katalog produk Anekafoto secara mendalam. Efektif menembus proteksi bot dasar dan mengelola antrian request yang besar.

---

### Crawlee Python (Industrial Web Scraper - Python)
*Sumber: apify/crawlee-python — The web scraping and browser automation library for Python.*

**Key Benefit**: Memberikan API yang konsisten untuk HTTP crawling (BeautifulSoup/Parsel) dan browser automation (Playwright). Memiliki fitur built-in resilience khas Pythonic.

**Key Commands & Workflows**:
- `pip install 'crawlee[all]'`: Instalasi lengkap termasuk engine browser.
- `playwright install`: Instalasi binary browser.
- `uvx 'crawlee[cli]' create <name>`: Inisialisasi project Python crawler baru.

**AI Use Case**: Jika project membutuhkan integrasi lebih lanjut dengan ekosistem Data Science Python (Pandas/Scikit-learn), skill ini adalah jembatan utama untuk memindahkan logic scraping dari Node.js ke Python.
