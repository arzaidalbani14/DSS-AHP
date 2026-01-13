# DSS AHP – Decision Support System using Analytical Hierarchy Process

DSS AHP adalah aplikasi web Sistem Pendukung Keputusan (Decision Support System) yang mengimplementasikan metode Analytical Hierarchy Process (AHP) untuk membantu pengguna menentukan keputusan terbaik berdasarkan kriteria dan alternatif yang dibandingkan secara berpasangan.

Aplikasi ini dirancang agar mudah digunakan oleh non-teknis, namun tetap akurat secara metodologi AHP.

## Fitur Utama

1. Manajemen Kriteria (tambah, edit, hapus)
2. Manajemen Alternatif (tambah, edit, hapus)
3. Perbandingan berpasangan Kriteria (Pairwise Comparison)
4. Perbandingan berpasangan Alternatif untuk setiap Kriteria
5. Perhitungan otomatis:
   * Normalisasi matriks
   * Bobot prioritas
   * λ max, CI, dan CR
   * Validasi konsistensi AHP (CR ≤ 0.1)
   * Agregasi hasil dan ranking alternatif
   * Navigasi bertahap dengan guard alur AHP
   * Tampilan hasil akhir yang jelas dan terurut

### Konsep Dasar AHP yang Digunakan

Metode AHP membagi proses pengambilan keputusan menjadi beberapa tahap:

1. Menentukan Kriteria
2. Menentukan Alternatif
3. Membandingkan Kriteria secara berpasangan
4. Membandingkan Alternatif secara berpasangan untuk setiap Kriteria
5. Menghitung bobot global dan menentukan alternatif terbaik

Aplikasi ini memastikan setiap tahap harus diselesaikan berurutan agar hasil keputusan valid.

---

## Menjalankan Project Secara Lokal

1. Pastikan **Node.js** sudah terinstall di komputer Anda.
2. Download file zip atau clone repository ini.
3. Buka terminal (cmd, git bash, powershell, dsb).
4. Navigasi ke folder project:
   ```bash
   cd ".../DSS-AHP"
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Jalankan development server:
   ```bash
   npm run dev
   ```
7. Buka browser dan akses `http://localhost:5173`

---

## Alur Menggunakan Website

1. **Landing Page** – Anda akan masuk ke halaman utama website. Klik tombol **"Dashboard"** untuk memulai.

2. **Dashboard** – Tampilan utama yang menampilkan daftar project AHP Anda. Klik **"Buat Project Baru"** untuk membuat analisis baru, atau pilih project yang sudah ada.

3. **Input Kriteria** – Tambahkan kriteria yang akan digunakan dalam pengambilan keputusan. Minimal **2 kriteria** diperlukan. Klik tombol **"Simpan & Lanjutkan"** setelah selesai.

4. **Input Alternatif** – Tambahkan alternatif pilihan yang akan dibandingkan. Minimal **2 alternatif** diperlukan. Klik tombol **"Simpan & Lanjutkan"** setelah selesai.

5. **Perbandingan Kriteria** – Lakukan perbandingan berpasangan antar kriteria menggunakan skala AHP (1-9). Sistem akan menghitung **Consistency Ratio (CR)**. CR harus ≤ 0.1 untuk melanjutkan.

6. **Perbandingan Alternatif** – Untuk setiap kriteria, lakukan perbandingan berpasangan antar alternatif. Setiap perbandingan harus memiliki CR ≤ 0.1.

7. **Hasil Akhir** – Setelah semua perbandingan selesai dan konsisten, sistem akan menampilkan:
   * Ranking alternatif berdasarkan skor global
   * Bobot prioritas setiap kriteria
   * Bobot lokal setiap alternatif per kriteria
   * Visualisasi grafik hasil

---

## Validasi & Konsistensi

Aplikasi ini **tidak akan menampilkan hasil akhir** jika:

- Jumlah kriteria kurang dari 2
- Jumlah alternatif kurang dari 2
- Perbandingan kriteria belum dilakukan
- Perbandingan alternatif belum lengkap (untuk semua kriteria)
- Consistency Ratio (CR) > 0.1 pada salah satu matriks perbandingan
- Ada tahap yang dilewati (tidak sesuai alur)

---

## Teknologi yang Digunakan

| Teknologi | Keterangan |
|-----------|------------|
| Frontend | React + Vite |
| State Management | Zustand |
| Routing | React Router |
| Styling | Bootstrap |
| Metodologi | Analytical Hierarchy Process (AHP) |

---

## Struktur Folder Utama

```
DSS-AHP/
├── src/
│   ├── components/          # Komponen reusable
│   │   ├── ahp/            # Komponen khusus AHP (matriks, input, dll)
│   │   ├── charts/         # Komponen visualisasi grafik
│   │   ├── common/         # Komponen umum (button, modal, dll)
│   │   └── layout/         # Komponen layout (header, footer, sidebar)
│   ├── pages/              # Halaman-halaman aplikasi
│   │   ├── Landing/        # Halaman landing page
│   │   ├── Dashboard/      # Halaman dashboard utama
│   │   ├── Project/        # Halaman detail project
│   │   ├── Criteria/       # Halaman input kriteria
│   │   ├── Alternatives/   # Halaman input alternatif
│   │   ├── Comparison/     # Halaman perbandingan berpasangan
│   │   └── Result/         # Halaman hasil akhir
│   ├── router/             # Konfigurasi routing
│   ├── services/           # Logic & API services
│   ├── store/              # Zustand state management
│   ├── styles/             # File CSS & styling
│   ├── utils/              # Helper functions (perhitungan AHP, dll)
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── package.json            # Dependencies & scripts
└── README.md               # Dokumentasi ini
```

---

## Catatan Penting

- **Backup Data**: Data disimpan di browser (localStorage/state). Jika Anda membersihkan cache browser, data bisa hilang.
- **Skala AHP**: Gunakan skala 1-9 sesuai standar AHP:
  - 1 = Sama penting
  - 3 = Sedikit lebih penting
  - 5 = Lebih penting
  - 7 = Sangat lebih penting
  - 9 = Mutlak lebih penting
  - 2, 4, 6, 8 = Nilai antara
- **Konsistensi**: Pastikan penilaian Anda konsisten. Jika A > B dan B > C, maka seharusnya A > C.
- **Minimum Input**: Minimal 2 kriteria dan 2 alternatif untuk dapat melakukan perhitungan AHP.

---

## Lisensi

Project ini bersifat open untuk pengembangan dan pembelajaran.

Silakan dikembangkan lebih lanjut sesuai kebutuhan.

