# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan di file ini.

Format mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-02-17

Rilis pertama frontend sistem peminjaman ruangan kampus.

### Added

- **Halaman Daftar Peminjaman**
  - Menampilkan seluruh data peminjaman dalam bentuk tabel
  - Informasi yang ditampilkan meliputi nama pengguna, ruangan, tanggal, dan status

- **Halaman Detail Peminjaman**
  - Menampilkan informasi lengkap dari satu data peminjaman berdasarkan ID

- **Form Peminjaman**
  - Form untuk membuat peminjaman baru
  - Form untuk mengedit data peminjaman yang sudah ada
  - Tombol hapus peminjaman

- **Manajemen Status**
  - Tombol untuk mengubah status peminjaman menjadi *Disetujui*, *Ditolak*, atau *Dicancel*
  - Tampilan label status yang mencerminkan kondisi terkini

- **Pencarian & Filter**
  - Input pencarian berdasarkan nama pengguna, ruangan, atau tanggal
  - Memanggil `GET /api/roombooking/search` secara dinamis

- **Layer Service API**
  - Seluruh pemanggilan API dikelola terpusat di folder `api/`

- **Definisi Tipe TypeScript**
  - Interface dan type untuk entitas `Room`, `RoomBooking`, dan status peminjaman

---
