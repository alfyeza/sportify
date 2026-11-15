# Panduan Backend Sportify (Supabase)

Dokumentasi ini dibuat untuk memandu tim backend dan pengujian sistem persewaan lapangan olahraga **Sportify**.

---

## 1. Akun Uji (Test Credentials)

Gunakan akun berikut untuk login dan menguji hak akses role pada aplikasi:

| Role | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Mitra / Pengelola** | `mitra@sportify.test` | `Sportify123!` | Dashboard mitra, tambah/edit lapangan, blokir slot jadwal, verifikasi pemesanan & pembayaran, rekap sewa |
| **Penyewa (User)** | `penyewa@sportify.test` | `Sportify123!` | Melihat katalog, cek ketersediaan slot, membuat pemesanan, upload bukti bayar, membatalkan pesanan sendiri |

---

## 2. Cara Setup Database di Supabase

1. Buka project Anda di [Supabase Dashboard](https://supabase.com/dashboard).
2. Masuk ke menu **SQL Editor**.
3. Buat query baru, salin seluruh isi file [`schema.sql`](./schema.sql), lalu klik tombol **Run**.
   * *Skrip ini akan membuat tabel `profiles`, `lapangan`, `pemesanan`, `blokir_jadwal`, `cerita_pengguna`, trigger anti double-booking, otomasi auth user, fungsi RPC, dan aturan Row Level Security (RLS).*
4. Buat query baru kedua, salin seluruh isi file [`seed.sql`](./seed.sql), lalu klik tombol **Run**.
   * *Skrip ini akan mengisi minimal 5 data lapangan, 5 pemesanan dengan berbagai status (menunggu, dikonfirmasi, selesai, dibatalkan), jadwal yang diblokir pengelola, dan akun uji coba.*

---

## 3. Fitur Keamanan & Integritas Backend Wajib

### A. Pencegahan Pemesanan Ganda (Anti Double-Booking)
* Diimplementasikan melalui **PostgreSQL Trigger** `trg_check_booking_conflict` pada tabel `pemesanan`.
* Setiap kali pemesanan baru dibuat atau diubah, fungsi `check_booking_conflict()` secara atomik memeriksa benturan waktu terhadap:
  1. Pemesanan lain yang berstatus aktif (`!= 'dibatalkan'`).
  2. Jadwal lapangan yang diblokir oleh mitra di tabel `blokir_jadwal`.
* Jika terjadi benturan, database secara otomatis melempar `EXCEPTION` dan menolak transaksi tersebut.

### B. Row Level Security (RLS)
* **Tabel `profiles`**: Pengguna hanya dapat mengubah profilnya sendiri. Pengubahan kolom `role` diproteksi oleh trigger `protect_user_role()`.
* **Tabel `lapangan`**: Publik hanya bisa melihat lapangan berstatus `aktif`. Mitra hanya dapat mengedit dan menghapus lapangan miliknya sendiri (`owner_id = auth.uid()`).
* **Tabel `pemesanan`**: Penyewa hanya bisa melihat pemesanannya sendiri (`user_id = auth.uid()`). Mitra hanya bisa melihat dan memverifikasi pemesanan yang memesan lapangannya.
* **Storage Bucket**:
  * `foto-lapangan` (Publik): Dapat dilihat siapa saja untuk aset katalog.
  * `bukti-pembayaran` (Privat): Berkas hanya dapat diakses oleh penyewa pemilik bukti bayar dan pengelola/mitra yang berhak via Supabase Signed URL.

---

## 4. Struktur Endpoint API (`src/lib/api.js`)

Semua interaksi frontend menggunakan wrapper `apiRequest(endpoint, options)`:

* `POST /auth/login` - Login pengguna via Supabase Auth
* `POST /auth/register` - Pendaftaran pengguna dengan role `penyewa` atau `mitra`
* `GET /auth/me` - Mengambil data profil user yang sedang login
* `GET /lapangan` - Katalog lapangan publik (mendukung query `kategori`, `q` pencarian, pagination)
* `GET /lapangan/:id` - Detail informasi lapangan tertentu
* `GET /jadwal?lapangan_id=...&tanggal=...` - Cek slot terisi via RPC `get_slot_terisi`
* `GET /booking` - Riwayat pemesanan pengguna / daftar sewa mitra
* `POST /booking` - Membuat reservasi baru (dengan auto kode booking unik & validasi jadwal)
* `PATCH /booking/:id` - Memperbarui status pemesanan / verifikasi / pembatalan
* `GET /mitra/dashboard` - Menghitung rekapitulasi sewa, total pendapatan, dan pemesanan yang menunggu verifikasi
* `GET /mitra/lapangan` - Daftar lapangan milik mitra
* `POST /mitra/lapangan` - Tambah lapangan baru
* `GET/POST/DELETE /mitra/blokir-jadwal` - Pengelolaan slot tutup/maintenance

