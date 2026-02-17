# 🖥️ Room Bookings — Frontend

> **Version:** `1.0.0`  
> **Platform:** React + TypeScript  
> **Dikonsumsi dari:** ASP.NET Core Backend

Antarmuka pengguna untuk sistem peminjaman ruangan kampus.

---

## Gambaran Umum

Frontend ini menyediakan tampilan interaktif bagi admin untuk membuat peminjaman ruangan, memantau status peminjaman, serta menelusuri riwayat peminjaman yang telah tersimpan.

---

## Arsitektur Sistem

```
┌─────────────────────┐     ┌─────────────────────┐
│  Frontend           │     │  Mobile             │
│  React + TypeScript │     │  Flutter            │
│  (Anda di sini)     │     └──────────┬──────────┘
└────────┬────────────┘                │
         │                             │
         └──────────────┬──────────────┘
                        ▼
              ┌─────────────────┐
              │  Backend        │
              │  ASP.NET Core   │
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  Database       │
              │  SQL Server     │
              └─────────────────┘
```

---

## Teknologi

| Komponen | Teknologi |
|---|---|
| Framework | React 18 |
| Bahasa | TypeScript |
| HTTP Client | Fetch API / Axios |
| Build Tool | Vite |
| Package Manager | npm |

---

## Prasyarat

Pastikan perangkat Anda telah terinstal:

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [npm](https://www.npmjs.com/) v9 atau lebih baru

Verifikasi instalasi:

```bash
node -v
npm -v
```

---

## Instalasi & Menjalankan Proyek

### 1. Clone repositori

```bash
git clone https://github.com/Elight-dotcom/2026-room_bookings-fronted.git
```

### 2. Install dependensi

```bash
npm install
```

### 3. Konfigurasi URL backend

Buat file `.env` di root proyek dan sesuaikan URL backend:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Jalankan aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` secara default.

### Build untuk produksi

```bash
npm run build
```

---

## Struktur Proyek

```
src/
├── components/          # Komponen UI yang dapat digunakan ulang
├── pages/               # Halaman utama aplikasi peminjaman
├── api/            # Fungsi pemanggilan API (fetch/axios)
├── App.tsx              # Root komponen & routing
└── main.tsx             # Entry point
```

---

## Fitur

### 1. Pencatatan Peminjaman

- Menampilkan daftar seluruh peminjaman ruangan
- Melihat detail peminjaman
- Membuat peminjaman baru melalui form
- Mengubah dan menghapus data peminjaman

### 2. Pengelolaan Status

- Menampilkan status terkini setiap peminjaman
- Mengubah status peminjaman (Menunggu → Disetujui / Ditolak → Dicancel)

### 3. Riwayat & Penelusuran

- Menampilkan riwayat peminjaman
- Pencarian dan filter berdasarkan nama pengguna, ruangan, atau tanggal

---

## Koneksi ke Backend

Seluruh komunikasi ke backend dilakukan melalui layer `api/`.

## Catatan Versi

### v1.0.0 — Rilis Pertama

**Fitur yang tersedia:**

- Tampilan daftar, detail, dan form peminjaman ruangan
- Pengelolaan status peminjaman
- Pencarian dan filter peminjaman

**Tantangan yang ditemui & solusi:**

- *TypeScript yang sulit dipahami* → Mempelajari lebih dalam terutama penggunaan `interface`, `type`, dan generic
- *Error handling di TypeScript* → Menggunakan pola `try/catch` dengan pengecekan `instanceof Error`
- *Komponen React melebihi 200 baris* → Refactor dengan memecah komponen besar menjadi komponen-komponen kecil yang lebih fokus

---

> Dibuat sebagai tugas individu Product Base Learning.
