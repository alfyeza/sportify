import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { daftarLapangan as initialData } from "./lapangan.js";

let dbInstance = null;

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "sportify.db");

// Password hashing menggunakan scrypt bawaan Node.js
export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  try {
    const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(testHash, "hex"));
  } catch {
    return false;
  }
}

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function getDb() {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new DatabaseSync(DB_PATH);

  // Aktifkan foreign keys & WAL mode untuk konkurensi optimal
  db.exec("PRAGMA foreign_keys = ON;");

  // Inisialisasi tabel-tabel
  initSchema(db);

  dbInstance = db;
  return dbInstance;
}

function initSchema(db) {
  // 1. Tabel Admins
  db.exec(`
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
  `);

  // 2. Tabel Sesi Admin
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      admin_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  `);

  // 3. Tabel Lapangan
  db.exec(`
    CREATE TABLE IF NOT EXISTS lapangan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      kategori TEXT NOT NULL,
      lokasi TEXT NOT NULL,
      alamat TEXT NOT NULL,
      harga INTEGER NOT NULL,
      fasilitas TEXT NOT NULL,
      maps_url TEXT DEFAULT '',
      deskripsi TEXT DEFAULT '',
      gambar TEXT DEFAULT '',
      foto TEXT DEFAULT '[]',
      unit_lapangan TEXT DEFAULT '[]',
      kontak TEXT DEFAULT '',
      rating REAL DEFAULT 5.0,
      jumlah_rating INTEGER DEFAULT 0,
      aspek_rating TEXT DEFAULT '[]',
      ulasan TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_lapangan_nama ON lapangan(nama);
    CREATE INDEX IF NOT EXISTS idx_lapangan_lokasi ON lapangan(lokasi);
  `);

  // Seed default admin jika belum ada
  seedDefaultAdmin(db);

  // Seed data lapangan awal dari daftarLapangan jika masih kosong
  seedInitialLapangan(db);
}

function seedDefaultAdmin(db) {
  const checkStmt = db.prepare("SELECT COUNT(*) as count FROM admins WHERE username = ?");
  const row = checkStmt.get("admin");

  if (!row || row.count === 0) {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
    const { hash, salt } = hashPassword(defaultPassword);

    const insertStmt = db.prepare(`
      INSERT INTO admins (username, password_hash, salt, name, role)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertStmt.run("admin", hash, salt, "Super Admin Sportify", "admin");
    console.log("[DB] Default admin created (username: admin)");
  }
}

function seedInitialLapangan(db) {
  const checkStmt = db.prepare("SELECT COUNT(*) as count FROM lapangan");
  const row = checkStmt.get();

  if (row && row.count > 0) {
    return; // Sudah ada data
  }

  if (!Array.isArray(initialData) || initialData.length === 0) {
    return;
  }

  console.log(`[DB] Seeding ${initialData.length} initial venues from lapangan.js...`);

  const insertStmt = db.prepare(`
    INSERT INTO lapangan (
      id, nama, kategori, lokasi, alamat, harga, fasilitas,
      maps_url, deskripsi, gambar, foto, unit_lapangan, kontak,
      rating, jumlah_rating, aspek_rating, ulasan
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  for (const item of initialData) {
    const kategori = JSON.stringify(
      Array.isArray(item.kategori) ? item.kategori : [item.kategori || "Umum"]
    );
    const fasilitas = JSON.stringify(Array.isArray(item.fasilitas) ? item.fasilitas : []);
    const foto = JSON.stringify(
      Array.isArray(item.foto) ? item.foto : item.gambar ? [item.gambar] : []
    );
    const unitLapangan = JSON.stringify(Array.isArray(item.unitLapangan) ? item.unitLapangan : []);
    const aspekRating = JSON.stringify(Array.isArray(item.aspekRating) ? item.aspekRating : []);
    const ulasan = JSON.stringify(Array.isArray(item.ulasan) ? item.ulasan : []);
    const kontak = item.kontak || "081234567890";

    try {
      insertStmt.run(
        item.id,
        item.nama || "Venue Sportify",
        kategori,
        item.lokasi || "Semarang, Jawa Tengah",
        item.alamat || "",
        Number(item.harga) || 100000,
        fasilitas,
        item.mapsUrl || "",
        item.deskripsi || "",
        item.gambar || (Array.isArray(item.foto) && item.foto[0]) || "",
        foto,
        unitLapangan,
        kontak,
        Number(item.rating) || 5.0,
        Number(item.jumlahRating) || 0,
        aspekRating,
        ulasan
      );
    } catch (err) {
      console.error("[DB] Failed to seed venue:", item.nama, err.message);
    }
  }

  console.log("[DB] Initial venues seeded successfully.");
}

// ----------------------------------------------------
// AUTHENTICATION HELPERS
// ----------------------------------------------------

export function authenticateAdmin(username, password) {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM admins WHERE username = ?");
  const admin = stmt.get(username);

  if (!admin) return null;

  const isValid = verifyPassword(password, admin.password_hash, admin.salt);
  if (!isValid) return null;

  return {
    id: admin.id,
    username: admin.username,
    name: admin.name,
    role: admin.role,
  };
}

export function createAdminSession(adminId, daysValid = 7) {
  const db = getDb();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString();

  const stmt = db.prepare(`
    INSERT INTO sessions (token, admin_id, expires_at)
    VALUES (?, ?, ?)
  `);
  stmt.run(token, adminId, expiresAt);

  return { token, expiresAt };
}

export function verifyAdminSession(token) {
  if (!token) return null;

  const db = getDb();
  const stmt = db.prepare(`
    SELECT s.token, s.expires_at, a.id, a.username, a.name, a.role
    FROM sessions s
    JOIN admins a ON s.admin_id = a.id
    WHERE s.token = ?
  `);

  const session = stmt.get(token);
  if (!session) return null;

  if (new Date(session.expires_at) < new Date()) {
    // Sesi kedaluwarsa, hapus
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }

  return {
    id: session.id,
    username: session.username,
    name: session.name,
    role: session.role,
  };
}

export function deleteAdminSession(token) {
  if (!token) return;
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

// ----------------------------------------------------
// LAPANGAN DATA HELPERS
// ----------------------------------------------------

function formatLapanganRow(row) {
  if (!row) return null;

  const parseJson = (val, fallback = []) => {
    if (!val) return fallback;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  };

  return {
    id: row.id,
    nama: row.nama,
    kategori: parseJson(row.kategori, []),
    lokasi: row.lokasi,
    alamat: row.alamat,
    harga: Number(row.harga),
    fasilitas: parseJson(row.fasilitas, []),
    mapsUrl: row.maps_url || "",
    deskripsi: row.deskripsi || "",
    gambar: row.gambar || "",
    foto: parseJson(row.foto, []),
    unitLapangan: parseJson(row.unit_lapangan, []),
    kontak: row.kontak || "",
    rating: Number(row.rating || 5.0),
    jumlahRating: Number(row.jumlah_rating || 0),
    aspekRating: parseJson(row.aspek_rating, []),
    ulasan: parseJson(row.ulasan, []),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getAllLapangan(filter = {}) {
  const db = getDb();
  let query = "SELECT * FROM lapangan ORDER BY id DESC";
  const rows = db.prepare(query).all();
  return rows.map(formatLapanganRow);
}

export function getLapanganById(id) {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM lapangan WHERE id = ?");
  const row = stmt.get(Number(id));
  return formatLapanganRow(row);
}

export function createLapangan(data) {
  const db = getDb();

  const kategori = JSON.stringify(
    Array.isArray(data.kategori)
      ? data.kategori
      : [data.kategori || "Umum"]
  );

  const fasilitas = JSON.stringify(
    Array.isArray(data.fasilitas) ? data.fasilitas : []
  );

  const foto = Array.isArray(data.foto)
    ? data.foto.filter(Boolean)
    : data.gambar
      ? [data.gambar]
      : [];

  const gambarUtama = data.gambar || (foto.length > 0 ? foto[0] : "/images/lapangan/padel/padel01/padel1.jpeg");

  const fotoJson = JSON.stringify(foto.length > 0 ? foto : [gambarUtama]);
  const unitLapanganJson = JSON.stringify(Array.isArray(data.unitLapangan) ? data.unitLapangan : []);
  const aspekRatingJson = JSON.stringify(
    Array.isArray(data.aspekRating)
      ? data.aspekRating
      : [
          { nama: "Kebersihan", nilai: 5.0 },
          { nama: "Kondisi Lapangan", nilai: 5.0 },
          { nama: "Komunikasi", nilai: 5.0 },
        ]
  );
  const ulasanJson = JSON.stringify(Array.isArray(data.ulasan) ? data.ulasan : []);

  const stmt = db.prepare(`
    INSERT INTO lapangan (
      nama, kategori, lokasi, alamat, harga, fasilitas,
      maps_url, deskripsi, gambar, foto, unit_lapangan, kontak,
      rating, jumlah_rating, aspek_rating, ulasan
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  const result = stmt.run(
    data.nama?.trim() || "Venue Sportify",
    kategori,
    data.lokasi?.trim() || "",
    data.alamat?.trim() || "",
    Number(data.harga) || 0,
    fasilitas,
    data.mapsUrl?.trim() || "",
    data.deskripsi?.trim() || "",
    gambarUtama,
    fotoJson,
    unitLapanganJson,
    data.kontak?.trim() || "",
    Number(data.rating) || 5.0,
    Number(data.jumlahRating) || 0,
    aspekRatingJson,
    ulasanJson
  );

  return getLapanganById(result.lastInsertRowid);
}

export function updateLapangan(id, data) {
  const db = getDb();
  const existing = getLapanganById(id);
  if (!existing) return null;

  const kategori = JSON.stringify(
    Array.isArray(data.kategori) ? data.kategori : existing.kategori
  );
  const fasilitas = JSON.stringify(
    Array.isArray(data.fasilitas) ? data.fasilitas : existing.fasilitas
  );
  const foto = Array.isArray(data.foto) ? data.foto : existing.foto;
  const gambar = data.gambar || (foto.length > 0 ? foto[0] : existing.gambar);
  const fotoJson = JSON.stringify(foto);
  const unitLapanganJson = JSON.stringify(
    Array.isArray(data.unitLapangan) ? data.unitLapangan : existing.unitLapangan
  );

  const stmt = db.prepare(`
    UPDATE lapangan SET
      nama = ?,
      kategori = ?,
      lokasi = ?,
      alamat = ?,
      harga = ?,
      fasilitas = ?,
      maps_url = ?,
      deskripsi = ?,
      gambar = ?,
      foto = ?,
      unit_lapangan = ?,
      kontak = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(
    data.nama?.trim() || existing.nama,
    kategori,
    data.lokasi?.trim() || existing.lokasi,
    data.alamat?.trim() || existing.alamat,
    Number(data.harga) || existing.harga,
    fasilitas,
    data.mapsUrl !== undefined ? data.mapsUrl.trim() : existing.mapsUrl,
    data.deskripsi !== undefined ? data.deskripsi.trim() : existing.deskripsi,
    gambar,
    fotoJson,
    unitLapanganJson,
    data.kontak !== undefined ? data.kontak.trim() : existing.kontak,
    Number(id)
  );

  return getLapanganById(id);
}

export function deleteLapangan(id) {
  const db = getDb();
  const existing = getLapanganById(id);
  if (!existing) return false;

  db.prepare("DELETE FROM lapangan WHERE id = ?").run(Number(id));
  return true;
}

