#!/usr/bin/env node
import {
  getDb,
  authenticateAdmin,
  createAdminSession,
  verifyAdminSession,
  createLapangan,
  getAllLapangan,
  getLapanganById,
  deleteLapangan,
} from "../src/lib/db.js";

async function runTests() {
  console.log("==========================================");
  console.log("   TESTING SPORTIFY ADMIN & LAPANGAN DB   ");
  console.log("==========================================");

  // 1. Auth Test
  console.log("\n[TEST 1] Admin Authentication");
  const validAdmin = authenticateAdmin("admin", "admin123");
  if (!validAdmin) throw new Error("Gagal login dengan admin/admin123");
  console.log("✓ Berhasil login admin:", validAdmin.username, `(${validAdmin.name})`);

  const invalidAdmin = authenticateAdmin("admin", "wrongpassword");
  if (invalidAdmin) throw new Error("Seharusnya gagal login dengan password salah");
  console.log("✓ Password salah ditolak dengan benar.");

  // 2. Session Test
  console.log("\n[TEST 2] Session Token");
  const { token } = createAdminSession(validAdmin.id);
  const sessionAdmin = verifyAdminSession(token);
  if (!sessionAdmin || sessionAdmin.username !== "admin") {
    throw new Error("Verifikasi sesi admin gagal.");
  }
  console.log("✓ Sesi admin valid:", sessionAdmin.username);

  // 3. Create Lapangan Test (All 7 Structure Points)
  console.log("\n[TEST 3] Create Lapangan (7 Struktur Data Sesuai Permintaan User)");
  const sampleVenue = {
    nama: "Smash & Volley Arena Test",
    kategori: ["Padel", "Tennis"],
    lokasi: "Kota Semarang, Jawa Tengah",
    alamat: "Jl. Pemuda No. 108, Sekayu, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah 50132",
    mapsUrl: "https://maps.app.goo.gl/sampleVenue123",
    harga: 175000,
    deskripsi: "Arena olahraga modern berstandar internasional dengan sirkulasi udara optimal dan pencahayaan LED malam hari.",
    fasilitas: [
      "Jual Minuman",
      "Parkir Mobil",
      "Parkir Motor",
      "Ruang Ganti",
      "Shower",
      "Toilet",
      "Wi-fi",
    ],
    foto: [
      "/images/lapangan/padel/padel01/padel1.jpeg",
      "/images/lapangan/padel/padel01/padel2.jpeg",
      "/images/lapangan/padel/padel01/padel3.jpeg",
    ],
    gambar: "/images/lapangan/padel/padel01/padel1.jpeg",
    kontak: "081298765432",
    unitLapangan: [
      { id: 1, nama: "Court A" },
      { id: 2, nama: "Court B" },
    ],
  };

  const created = createLapangan(sampleVenue);
  if (!created || !created.id) throw new Error("Gagal membuat venue");
  console.log("✓ Venue berhasil dibuat dengan ID:", created.id);
  console.log("  - Nama:", created.nama);
  console.log("  - Kategori:", created.kategori);
  console.log("  - Lokasi:", created.lokasi);
  console.log("  - Alamat:", created.alamat);
  console.log("  - Harga:", created.harga);
  console.log("  - Maps URL:", created.mapsUrl);
  console.log("  - Fasilitas (" + created.fasilitas.length + " item):", created.fasilitas.join(", "));
  console.log("  - Galeri Foto (" + created.foto.length + " foto):", created.foto);
  console.log("  - Kontak WhatsApp:", created.kontak);

  // 4. Fetch All and verify presence
  console.log("\n[TEST 4] Integrasi Data Lapangan");
  const all = getAllLapangan();
  const found = all.find((v) => v.id === created.id);
  if (!found) throw new Error("Venue yang baru dibuat tidak ditemukan di database!");
  console.log("✓ Venue baru ditemukan di database. Total lapangan saat ini:", all.length);

  // 5. Cleanup test venue
  console.log("\n[TEST 5] Hapus Venue Percobaan");
  const deleted = deleteLapangan(created.id);
  if (!deleted) throw new Error("Gagal menghapus venue test");
  console.log("✓ Venue test berhasil dihapus.");

  console.log("\n==========================================");
  console.log("   SEMUA PENGUJIAN BACKEND BERHASIL! 🚀   ");
  console.log("==========================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

