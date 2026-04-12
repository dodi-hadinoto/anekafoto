# Bug Tracker: Anekafoto CRM

Daftar isu teknis, bugs, dan rintangan yang ditemukan selama pengembangan beserta status penanganannya.

## 🔴 Open Issues
*Belum ada bugs kritis yang terbuka saat ini.*

---

## 🟡 In Progress
*   **Next.js Prerendering Warning**: Recharts container width issue during static generation (Warning only, doesn't break build).

---

## ✅ Fixed / Resolved
| Date | Issue | Resolution |
| :--- | :--- | :--- |
| 2026-04-12 | TS Error: `PieChart` Missing | Menambahkan import `PieChart` di `src/app/leads/page.tsx`. |
| 2026-04-12 | Tailwind 4 `@apply` Error | Mengganti `@apply` dengan standard CSS untuk custom utility `nothing-dot-matrix`. |
| 2026-04-12 | Git `index.lock` Error | Melakukan pembersihan manual folder `.git/index.lock` dan sinkronisasi ulang. |
| 2026-04-12 | Supabase Price Overflow | Mengubah tipe data kolom `price` dari integer ke `NUMERIC`. |

---

## 🛠️ How to Report
Setiap kali menemukan bug baru:
1. Catat deskripsi bug.
2. Lampirkan pesan error (log).
3. Tandai tingkat keparahan (Critical, Major, Minor).
