"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { daftarLapangan } from "@/lib/lapangan";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

function BookingContent() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const isEnglish = language === "en";

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
              {isEnglish ? "No Booking Found" : "Belum Ada Pemesanan"}
            </h1>

            <p className="text-gray-500 mt-3 leading-relaxed text-sm sm:text-base">
              {isEnglish
                ? "Please choose a sports venue before continuing with your booking."
                : "Silakan pilih tempat olahraga terlebih dahulu sebelum melanjutkan booking."}
            </p>

            <Link
              href="/lapangan"
              className="liquid-booking-button inline-flex mt-6"
            >
              {isEnglish ? "Find a Court" : "Cari Lapangan"}
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
            ← {isEnglish ? "Back to Court Details" : "Kembali ke Detail Lapangan"}
          </Link>

          {/* HEADER */}
          <div className="mt-6 sm:mt-7 mb-7 sm:mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-soft-mint text-primary text-xs font-bold tracking-wider">
              SPORTIFY BOOKING
            </span>

            <h1 className="text-2xl sm:text-4xl font-bold text-dark-text mt-4">
              {isEnglish ? "Booking Summary" : "Ringkasan Booking"}
            </h1>

            <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed">
              {isEnglish
                ? "Please review your booking details before continuing."
                : "Periksa kembali detail pemesanan sebelum melanjutkan."}
            </p>
          </div>

          {/* KARTU RINGKASAN */}
          <div className="liquid-booking-page-card">

            {/* INFORMASI TEMPAT */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="min-w-0">
                <p className="text-xs text-primary font-bold tracking-wider uppercase">
                  {isEnglish ? "Booking Details" : "Detail Pemesanan"}
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
                <span>{isEnglish ? "Sports Venue" : "Tempat Olahraga"}</span>
                <strong>{lapangan.nama}</strong>
              </div>

              <div className="liquid-summary-row">
                <span>{isEnglish ? "Court Unit" : "Unit Lapangan"}</span>
                <strong>{unit || "-"}</strong>
              </div>

              <div className="liquid-summary-row">
                <span>{isEnglish ? "Playing Date" : "Tanggal Bermain"}</span>
                <strong>{tanggal || "-"}</strong>
              </div>

              <div className="liquid-summary-row">
                <span>{isEnglish ? "Start Time" : "Jam Mulai"}</span>
                <strong>{jam || "-"}</strong>
              </div>

              <div className="liquid-summary-row">
                <span>{isEnglish ? "Playing Duration" : "Durasi Bermain"}</span>
                <strong>
                  {durasi} {isEnglish ? "sessions" : "sesi"}
                </strong>
              </div>

            </div>

            <div className="liquid-booking-divider" />

            {/* RINCIAN HARGA */}
            <div className="bg-soft-mint/70 rounded-2xl p-4 sm:p-6">

              <p className="text-sm text-gray-500">
                {isEnglish ? "Payment Details" : "Rincian Pembayaran"}
              </p>

              <div className="flex justify-between items-center gap-3 mt-4">
                <span className="text-gray-600 text-sm">
                  {isEnglish ? "Price per session" : "Harga per sesi"}
                </span>

                <span className="font-semibold text-dark-text text-sm sm:text-base">
                  Rp {lapangan.harga.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between items-center gap-3 mt-3">
                <span className="text-gray-600 text-sm">
                  {isEnglish ? "Duration" : "Durasi"}
                </span>

                <span className="font-semibold text-dark-text text-sm sm:text-base">
                  {durasi} {isEnglish ? "sessions" : "sesi"}
                </span>
              </div>

              <div className="border-t border-primary/10 my-5" />

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="font-bold text-dark-text">
                  {isEnglish ? "Total Payment" : "Total Pembayaran"}
                </span>

                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>

            </div>

            {/* CATATAN */}
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              {isEnglish
                ? "The price is calculated based on the court rental rate multiplied by the rental duration. This booking is still a simulation."
                : "Harga dihitung berdasarkan tarif lapangan dikalikan dengan durasi sewa. Pemesanan ini masih berupa simulasi."}
            </p>

            {/* TOMBOL LANJUT */}
            <Link
              href="/login"
              className="liquid-booking-button flex w-full mt-7 sm:mt-8 justify-center"
            >
              {isEnglish ? "Continue to Login" : "Lanjut Login"}
              <span>→</span>
            </Link>

            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              {isEnglish
                ? "Make sure your booking details are correct before continuing."
                : "Pastikan detail pemesanan sudah benar sebelum melanjutkan."}
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function BookingPage() {
  const isEnglishLoading = "Loading booking summary...";
  const isIndonesianLoading = "Memuat ringkasan booking...";

  return (
    <Suspense
      fallback={
        <>
          <Navbar />

          <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <p className="text-gray-500 text-sm">
              <LoadingText
                indonesian={isIndonesianLoading}
                english={isEnglishLoading}
              />
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

function LoadingText({ indonesian, english }) {
  const { language } = useLanguage();

  return language === "en" ? english : indonesian;
}
