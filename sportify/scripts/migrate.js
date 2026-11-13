#!/usr/bin/env node
/**
 * Standalone Migration Script for Sportify
 * Usage: node scripts/migrate.js
 */

import { getDb, getAllLapangan, authenticateAdmin } from "../src/lib/db.js";

console.log("==========================================");
console.log("   SPORTIFY DATABASE MIGRATION & SEED     ");
console.log("==========================================");

try {
  console.log("[1/3] Membuka koneksi database SQLite...");
  const db = getDb();
  console.log("      Koneksi database berhasil.");

  console.log("[2/3] Memeriksa tabel dan seed admin...");
  const admin = authenticateAdmin("admin", process.env.ADMIN_DEFAULT_PASSWORD || "admin123");
  if (admin) {
    console.log(`      Admin terverifikasi: ${admin.username} (${admin.name})`);
  }

  console.log("[3/3] Memeriksa data lapangan...");
  const data = getAllLapangan();
  console.log(`      Total lapangan tersimpan di database: ${data.length}`);

  console.log("==========================================");
  console.log("   MIGRATION & DATABASE READY!            ");
  console.log("==========================================");
} catch (err) {
  console.error("Migration failed:", err);
  process.exit(1);
}

