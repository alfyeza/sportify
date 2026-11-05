
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { daftarLapangan } from "@/lib/lapangan";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <>
        <Navbar />

        <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
          <div className="liquid-info-card text-center max-w-md w-full p-6 sm:p-8">
            <div className="text-4xl mb-4">!</div>

            <h1 className="text-xl sm:text-2xl font-bold text-dark-text">
              Belum Ada Pemesanan
            </h1>

            <p className="text-gray-500 mt-3 leading-relaxed text-sm sm:text-base">
              Silakan pilih tempat olahraga terlebih dahulu sebelum
              melanjutkan booking.
            </p>

            <Link
              href="/lapangan"
              className="liquid-booking-button inline-flex mt-6"
            >
              Cari Lapangan
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const totalHarga = lapangan.harga * durasi;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background px-4 sm:px-6 py-8 sm:py-12 md:py-14">
        <div className="max-w-3xl mx-auto">

          {/* TOMBOL KEMBALI */}
          <Link
            href={`/lapangan/${lapangan.id}`}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-70 transition"
          >
            ← Kembali ke Detail Lapangan
          </Link>

          {/* HEADER */}
          <div className="mt-6 sm:mt-7 mb-7 sm:mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-soft-mint text-primary text-xs font-bold tracking-wider">
              SPORTIFY BOOKING
            </span>

            <h1 className="text-2xl sm:text-4xl font-bold text-dark-text mt-4">
              Ringkasan Booking
            </h1>

            <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed">
              Periksa kembali detail pemesanan sebelum melanjutkan.
            </p>
          </div>

          {/* KARTU RINGKASAN */}
          <div className="liquid-booking-page-card">

            {/* INFORMASI TEMPAT */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="min-w-0">
                <p className="text-xs text-primary font-bold tracking-wider uppercase">
                  Detail Pemesanan
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-dark-text mt-2 break-words">
                  {lapangan.nama}
                </h2>

                <p className="text-sm text-gray-500 mt-2 flex items-start gap-2">
                  <span>📍</span>
                  <span>{lapangan.lokasi}</span>
                </p>
              </div>

              <div className="bg-soft-mint text-primary px-4 py-2 rounded-full text-sm font-semibold w-fit shrink-0">
                Booking
              </div>

            </div>

            <div className="liquid-booking-divider" />

            {/* INFORMASI BOOKING */}
            <div className="space-y-4 sm:space-y-5">

              <div className="liquid-summary-row">
                <span>Tempat Olahraga</span>
                <strong>{lapangan.nama}</strong>
              </div>

              <div className="liquid-summary-row">
                <span>Unit Lapangan</span>
                <strong>{unit || "-"}</strong>
              </div>

              <div className="liquid-summary-row">
                <span>Tanggal Bermain</span>
                <strong>{tanggal || "-"}</strong>
              </div>

              <div className="liquid-summary-row">
                <span>Jam Mulai</span>
                <strong>{jam || "-"}</strong>
              </div>

              <div className="liquid-summary-row">
                <span>Durasi Bermain</span>
                <strong>{durasi} sesi</strong>
              </div>

            </div>

            <div className="liquid-booking-divider" />

            {/* RINCIAN HARGA */}
            <div className="bg-soft-mint/70 rounded-2xl p-4 sm:p-6">

              <p className="text-sm text-gray-500">
                Rincian Pembayaran
              </p>

              <div className="flex justify-between items-center gap-3 mt-4">
                <span className="text-gray-600 text-sm">
                  Harga per sesi
                </span>

                <span className="font-semibold text-dark-text text-sm sm:text-base">
                  Rp {lapangan.harga.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between items-center gap-3 mt-3">
                <span className="text-gray-600 text-sm">
                  Durasi
                </span>

                <span className="font-semibold text-dark-text text-sm sm:text-base">
                  {durasi} sesi
                </span>
              </div>

              <div className="border-t border-primary/10 my-5" />

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="font-bold text-dark-text">
                  Total Pembayaran
                </span>

                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>

            </div>

            {/* CATATAN */}
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Harga dihitung berdasarkan tarif lapangan dikalikan dengan
              durasi sewa. Pemesanan ini masih berupa simulasi.
            </p>

            {/* TOMBOL LANJUT */}
            <Link
              href="/login"
              className="liquid-booking-button flex w-full mt-7 sm:mt-8 justify-center"
            >
              Lanjut Login <span>→</span>
            </Link>

            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              Pastikan detail pemesanan sudah benar sebelum melanjutkan.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />

          <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <p className="text-gray-500 text-sm">
              Memuat ringkasan booking...
            </p>
          </div>

          <Footer />
        </>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
