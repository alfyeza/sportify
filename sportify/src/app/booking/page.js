"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { daftarLapangan } from "@/lib/lapangan";

function BookingContent() {
  const searchParams = useSearchParams();

  const lapanganId = searchParams.get("lapangan");
  const unit = searchParams.get("unit");
  const tanggal = searchParams.get("tanggal");
  const jam = searchParams.get("jam");
  const durasi = Number(searchParams.get("durasi")) || 1;

  const lapangan = daftarLapangan.find(
    (item) => String(item.id) === String(lapanganId)
  );

  if (!lapangan) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm max-w-md w-full">
          <h1 className="text-2xl font-bold text-dark-text">
            Belum Ada Pemesanan
          </h1>
          <p className="text-gray-500 mt-3">
            Silakan pilih tempat olahraga terlebih dahulu sebelum melanjutkan booking.
          </p>
          <Link
            href="/lapangan"
            className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary"
          >
            Cari Lapangan
          </Link>
        </div>
      </main>
    );
  }

  const totalHarga = lapangan.harga * durasi;

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/lapangan/${lapangan.id}`}
          className="text-primary font-semibold hover:underline"
        >
          ← Kembali ke Detail Lapangan
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-dark-text">
            Ringkasan Booking
          </h1>
          <p className="text-gray-500 mt-2">
            Periksa kembali detail pemesanan sebelum melanjutkan.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-dark-text mb-5">
            Detail Pemesanan
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Tempat Olahraga</span>
              <span className="font-semibold text-right">{lapangan.nama}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Unit Lapangan</span>
              <span className="font-semibold">{unit || "-"}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Tanggal</span>
              <span className="font-semibold">{tanggal || "-"}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Jam Mulai</span>
              <span className="font-semibold">{jam || "-"}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Durasi</span>
              <span className="font-semibold">{durasi} jam</span>
            </div>
          </div>

          <hr className="my-6" />

          <div className="flex justify-between items-center">
            <span className="font-semibold text-dark-text">Total Pembayaran</span>
            <span className="text-2xl font-bold text-primary">
              Rp {totalHarga.toLocaleString("id-ID")}
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Harga dihitung berdasarkan tarif per jam dikalikan durasi sewa.
          </p>

          <Link
            href="/login"
            className="block text-center bg-primary text-white w-full py-3 rounded-xl mt-8 font-semibold hover:bg-secondary transition"
          >
            Lanjut Login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Memuat ringkasan booking...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}