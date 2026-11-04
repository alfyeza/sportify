"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { daftarLapangan } from "@/lib/lapangan";

export default function BookingLapanganPage() {
  const params = useParams();
  const router = useRouter();

  const lapangan = daftarLapangan.find(
    (item) => String(item.id) === String(params.id)
  );

  const [unit, setUnit] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [durasi, setDurasi] = useState("1");

  if (!lapangan) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Lapangan Tidak Ditemukan
          </h1>

          <Link
            href="/lapangan"
            className="text-primary mt-4 inline-block"
          >
            Kembali ke Daftar Lapangan
          </Link>
        </div>
      </main>
    );
  }

  // Mengambil data unit dari lapangan.js
  const daftarUnit = lapangan.unitLapangan || [];

  const daftarJam = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00",
    "20:00",
  ];

  const totalHarga = lapangan.harga * Number(durasi);

  function lanjutBooking() {
    if (!unit || !tanggal || !jam || !durasi) {
      alert("Silakan lengkapi semua pilihan booking terlebih dahulu.");
      return;
    }

    const query = new URLSearchParams({
      lapangan: String(lapangan.id),
      unit,
      tanggal,
      jam,
      durasi,
    });

    router.push(`/booking?${query.toString()}`);
  }

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Tombol Kembali */}
        <Link
          href={`/lapangan/${lapangan.id}`}
          className="text-primary font-semibold hover:underline"
        >
          ← Kembali ke Detail Lapangan
        </Link>

        {/* Judul */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-dark-text">
            Booking Lapangan
          </h1>

          <p className="text-gray-500 mt-2">
            Pilih unit lapangan dan jadwal bermain yang kamu inginkan.
          </p>
        </div>

        {/* Informasi Tempat */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">

          <h2 className="text-xl font-bold text-dark-text">
            {lapangan.nama}
          </h2>

          <p className="text-gray-500 mt-2">
            {lapangan.lokasi}
          </p>

          <p className="text-primary font-bold mt-3">
            Rp {lapangan.harga.toLocaleString("id-ID")} / sesi
          </p>

          <hr className="my-6" />

          {/* 1. Pilih Unit */}
          <h3 className="font-bold text-dark-text mb-4">
            1. Pilih Unit Lapangan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

            {daftarUnit.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setUnit(item.nama)}
                className={`text-left border rounded-xl overflow-hidden transition ${
                  unit === item.nama
                    ? "border-primary ring-2 ring-primary bg-soft-mint"
                    : "border-gray-200 bg-white hover:border-primary"
                }`}
              >

                {/* Gambar Unit */}
                <div className="h-36 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.gambar || lapangan.gambar}
                    alt={item.nama}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Nama Unit */}
                <div className="p-4">
                  <p className={`font-bold ${
                    unit === item.nama
                      ? "text-primary"
                      : "text-dark-text"
                  }`}>
                    {item.nama}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {unit === item.nama
                      ? "Unit dipilih"
                      : "Pilih unit ini"}
                  </p>
                </div>

              </button>
            ))}

          </div>

          <p className="text-xs text-gray-400 mt-3">
            Pilihan unit ini masih berupa simulasi dan belum memeriksa ketersediaan sebenarnya.
          </p>

          <hr className="my-6" />

          {/* 2. Pilih Tanggal */}
          <h3 className="font-bold text-dark-text mb-4">
            2. Pilih Tanggal Bermain
          </h3>

          <input
            type="date"
            value={tanggal}
            min={new Date().toLocaleDateString("en-CA")}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary"
          />

          <hr className="my-6" />

          {/* 3. Pilih Jam */}
          <h3 className="font-bold text-dark-text mb-4">
            3. Pilih Jam Mulai
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {daftarJam.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setJam(item)}
                className={`border rounded-lg py-3 font-medium transition ${
                  jam === item
                    ? "bg-primary text-white border-primary"
                    : "border-gray-200 hover:border-primary text-dark-text"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <hr className="my-6" />

          {/* 4. Pilih Durasi */}
          <h3 className="font-bold text-dark-text mb-4">
            4. Pilih Durasi Bermain
          </h3>

          <select
            value={durasi}
            onChange={(e) => setDurasi(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary"
          >
            <option value="1">1 Sesi</option>
            <option value="2">2 Sesi</option>
            <option value="3">3 Sesi</option>
            <option value="4">4 Sesi</option>
          </select>

          <hr className="my-6" />

          {/* Total Harga */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Estimasi Total Harga
              </p>

              <p className="text-2xl font-bold text-primary">
                Rp {totalHarga.toLocaleString("id-ID")}
              </p>
            </div>

            <button
              type="button"
              onClick={lanjutBooking}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition"
            >
              Lanjut Booking
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}