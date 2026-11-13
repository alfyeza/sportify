-- ========================================================
-- SPORTIFY DATABASE MIGRATION
-- File: migrations/001_create_tables.sql
-- Description: Skema database untuk Admin, Sesi, dan Lapangan
-- Engine: SQLite / Compatible with PostgreSQL & MySQL syntax
-- ========================================================

-- 1. TABEL ADMIN
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL SESI ADMIN (TOKEN AUTHENTICATION)
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE NOT NULL,
  admin_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- 3. TABEL LAPANGAN / VENUE OLAHRAGA
CREATE TABLE IF NOT EXISTS lapangan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  kategori TEXT NOT NULL,             -- JSON string array, misal: ["Padel", "Tennis"]
  lokasi TEXT NOT NULL,               -- Kota / Lokasi, misal: "Kota Semarang, Jawa Tengah"
  alamat TEXT NOT NULL,               -- Alamat lengkap venue
  harga INTEGER NOT NULL,             -- Harga sewa per sesi (Rp)
  fasilitas TEXT NOT NULL,            -- JSON string array, misal: ["Shower", "Toilet", "Parkir Mobil"]
  maps_url TEXT DEFAULT '',           -- Embed atau link Google Maps
  deskripsi TEXT DEFAULT '',          -- Deskripsi lengkap venue
  gambar TEXT DEFAULT '',             -- Foto utama / thumbnail
  foto TEXT DEFAULT '[]',             -- JSON string array URL foto galeri slider
  unit_lapangan TEXT DEFAULT '[]',    -- JSON string array unit/court di venue
  kontak TEXT DEFAULT '',             -- Kontak WhatsApp / Link Terkait
  rating REAL DEFAULT 5.0,            -- Nilai rating rata-rata
  jumlah_rating INTEGER DEFAULT 0,    -- Jumlah orang yang memberi rating
  aspek_rating TEXT DEFAULT '[]',     -- JSON string rincian aspek penilaian
  ulasan TEXT DEFAULT '[]',           -- JSON string ulasan pengunjung
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lapangan_nama ON lapangan(nama);
CREATE INDEX IF NOT EXISTS idx_lapangan_lokasi ON lapangan(lokasi);

