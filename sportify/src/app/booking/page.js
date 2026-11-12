"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { daftarLapangan } from "@/lib/lapangan";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

function generateBookingId() {
  return "SPT-" + Math.floor(100000 + Math.random() * 900000);
}

function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  // FORM DATA PEMESAN
  const [namaPemesan, setNamaPemesan] = useState("");
  const [emailPemesan, setEmailPemesan] = useState("");
  const [teleponPemesan, setTeleponPemesan] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // ISI OTOMATIS JIKA USER SUDAH LOGIN
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("sportify_user");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        requestAnimationFrame(() => {
          if (user.fullName) setNamaPemesan(user.fullName);
          if (user.email) setEmailPemesan(user.email);
          if (user.phone) setTeleponPemesan(user.phone);
        });
      }
    } catch {
      // Abaikan jika JSON tidak valid
    }
  }, []);

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

  const hitungJamSelesai = (jamMulai, totalDurasi) => {
    if (!jamMulai) return "-";

    const [jamAwal] = jamMulai.split(":").map(Number);
    const jamAkhir = (jamAwal + totalDurasi) % 24;

    return `${String(jamAkhir).padStart(2, "0")}:00`;
  };

  const jamSelesai = hitungJamSelesai(jam, durasi);

  // PROSES BOOKING
  const handleProsesBooking = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!namaPemesan.trim()) {
      setErrorMessage(
        isEnglish ? "Full name is required." : "Nama pemesan wajib diisi."
      );
      return;
    }

    if (!teleponPemesan.trim()) {
      setErrorMessage(
        isEnglish
          ? "WhatsApp / Phone number is required."
          : "Nomor WhatsApp / HP wajib diisi."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingId = generateBookingId();

      const kategoriUtama = Array.isArray(lapangan.kategori)
        ? lapangan.kategori[0]
        : lapangan.kategori || "Padel";

      const newBooking = {
        id: bookingId,
        tempat: lapangan.nama,
        lapangan: unit || "Court 1",
        kategori: kategoriUtama,
        tanggal: tanggal || getTodayDateString(),
        jam: jam ? `${jam} - ${jamSelesai}` : "09:00 - 10:00",
        durasi: `${durasi} Jam`,
        total: totalHarga,
        statusBooking: "Confirmed",
        statusPembayaran: metodePembayaran === "cod" ? "Pending" : "Paid",
        metodePembayaran,
        customer: {
          name: namaPemesan.trim(),
          email: emailPemesan.trim(),
          phone: teleponPemesan.trim(),
        },
        createdAt: getTodayDateString(),
      };

      const existing = JSON.parse(
        localStorage.getItem("sportify_bookings") || "[]"
      );

      localStorage.setItem(
        "sportify_bookings",
        JSON.stringify([newBooking, ...existing])
      );

      setBookingSuccess(newBooking);
    } catch {
      setErrorMessage(
        isEnglish
          ? "Failed to process booking. Please try again."
          : "Gagal memproses pemesanan. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background px-4 sm:px-6 py-8 sm:py-12 md:py-14">
        <div className="max-w-3xl mx-auto min-w-0">

          {/* TOMBOL KEMBALI */}
          <Link
            href={`/lapangan/${lapangan.id}/booking`}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-70 transition"
          >
            ← {isEnglish ? "Back to Schedule Selection" : "Kembali ke Pilih Jadwal"}
          </Link>

          {/* HEADER */}
          <div className="mt-6 sm:mt-7 mb-7 sm:mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-soft-mint text-primary text-xs font-bold tracking-wider">
              SPORTIFY BOOKING
            </span>

            <h1 className="text-2xl sm:text-4xl font-bold text-dark-text mt-4">
              {isEnglish ? "Booking & Payment Summary" : "Ringkasan & Pembayaran"}
            </h1>

            <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed">
              {isEnglish
                ? "Review your booking details and complete payment to confirm your court."
                : "Periksa kembali detail pemesanan dan selesaikan pembayaran untuk mengonfirmasi lapangan."}
            </p>
          </div>

          {/* KARTU RINGKASAN */}
          <div className="liquid-booking-page-card w-full min-w-0">

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
                  <span className="shrink-0">📍</span>
                  <span className="min-w-0 break-words">
                    {lapangan.lokasi}
                  </span>
                </p>
              </div>

              <div className="bg-soft-mint text-primary px-4 py-2 rounded-full text-sm font-semibold w-fit shrink-0">
                Sportify Booking
              </div>
            </div>

            <div className="liquid-booking-divider" />

            {/* INFORMASI BOOKING */}
            <div className="space-y-4 sm:space-y-5 w-full min-w-0">

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
                <span>{isEnglish ? "Playing Time" : "Waktu Bermain"}</span>
                <strong>{jam ? `${jam} - ${jamSelesai}` : "-"}</strong>
              </div>

              <div className="liquid-summary-row">
                <span>{isEnglish ? "Playing Duration" : "Durasi Bermain"}</span>
                <strong>
                  {durasi} {isEnglish ? "hour(s)" : "Jam"}
                </strong>
              </div>

            </div>

            <div className="liquid-booking-divider" />

            {/* FORM DATA PEMESAN */}
            <div className="space-y-4 min-w-0">
              <h3 className="font-bold text-dark-text text-base sm:text-lg">
                {isEnglish ? "Customer Information" : "Data Pemesan"}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {isEnglish ? "Full Name" : "Nama Lengkap"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={namaPemesan}
                  onChange={(e) => setNamaPemesan(e.target.value)}
                  placeholder={isEnglish ? "Enter full name" : "Masukkan nama lengkap"}
                  className="liquid-auth-input w-full text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    {isEnglish ? "WhatsApp / Phone" : "No. WhatsApp / HP"}{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="tel"
                    value={teleponPemesan}
                    onChange={(e) => setTeleponPemesan(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="liquid-auth-input w-full text-sm"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email ({isEnglish ? "Optional" : "Opsional"})
                  </label>

                  <input
                    type="email"
                    value={emailPemesan}
                    onChange={(e) => setEmailPemesan(e.target.value)}
                    placeholder="email@example.com"
                    className="liquid-auth-input w-full text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="liquid-booking-divider" />

            {/* PILIH METODE PEMBAYARAN */}
            <div className="space-y-3 min-w-0">
              <h3 className="font-bold text-dark-text text-base sm:text-lg">
                {isEnglish ? "Payment Method" : "Metode Pembayaran"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* QRIS */}
                <button
                  type="button"
                  onClick={() => setMetodePembayaran("qris")}
                  className={`p-3.5 rounded-2xl border text-left transition ${metodePembayaran === "qris"
                      ? "border-primary bg-soft-mint text-primary ring-1 ring-primary"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm">QRIS</span>

                    <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded shrink-0">
                      Instan
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Gopay, OVO, Dana, BCA
                  </p>
                </button>

                {/* TRANSFER BANK */}
                <button
                  type="button"
                  onClick={() => setMetodePembayaran("transfer")}
                  className={`p-3.5 rounded-2xl border text-left transition ${metodePembayaran === "transfer"
                      ? "border-primary bg-soft-mint text-primary ring-1 ring-primary"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="font-bold text-sm">
                    Transfer Bank
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Virtual Account BCA, BNI
                  </p>
                </button>

                {/* BAYAR DI TEMPAT */}
                <button
                  type="button"
                  onClick={() => setMetodePembayaran("cod")}
                  className={`p-3.5 rounded-2xl border text-left transition ${metodePembayaran === "cod"
                      ? "border-primary bg-soft-mint text-primary ring-1 ring-primary"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="font-bold text-sm">
                    Bayar di Tempat
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Bayar langsung di kasir
                  </p>
                </button>

              </div>
            </div>

            <div className="liquid-booking-divider" />

            {/* RINCIAN HARGA */}
            <div className="bg-soft-mint/70 rounded-2xl p-4 sm:p-6 w-full min-w-0">

              <p className="text-sm text-gray-500 font-medium">
                {isEnglish ? "Payment Details" : "Rincian Pembayaran"}
              </p>

              {/* HARGA PER JAM */}
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mt-5">
                <span className="text-gray-600 text-sm min-w-0">
                  {isEnglish ? "Price per hour" : "Tarif per jam"}
                </span>

                <span className="font-semibold text-dark-text text-sm sm:text-base whitespace-nowrap tabular-nums">
                  Rp {lapangan.harga.toLocaleString("id-ID")}
                </span>
              </div>

              {/* DURASI */}
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mt-4">
                <span className="text-gray-600 text-sm min-w-0">
                  {isEnglish ? "Duration" : "Durasi"}
                </span>

                <span className="font-semibold text-dark-text text-sm sm:text-base whitespace-nowrap">
                  {durasi} {isEnglish ? "hour(s)" : "Jam"}
                </span>
              </div>

              <div className="border-t border-primary/10 my-5" />

              {/* TOTAL PEMBAYARAN */}
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <span className="font-bold text-dark-text text-sm sm:text-base min-w-0">
                  {isEnglish ? "Total Payment" : "Total Pembayaran"}
                </span>

                <span className="text-lg sm:text-2xl font-bold text-primary whitespace-nowrap tabular-nums">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>

            </div>

            {/* PESAN ERROR */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* TOMBOL KONFIRMASI */}
            <button
              type="button"
              onClick={handleProsesBooking}
              disabled={isSubmitting}
              className="liquid-booking-button flex w-full mt-7 sm:mt-8 justify-center items-center gap-3 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting
                ? isEnglish
                  ? "Processing..."
                  : "Memproses..."
                : isEnglish
                  ? "Confirm & Pay Now"
                  : "Konfirmasi & Bayar Sekarang"}

              <span>→</span>
            </button>

            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              {isEnglish
                ? "By confirming, you agree to the venue's rules and booking policy."
                : "Dengan mengonfirmasi, Anda menyetujui ketentuan venue dan kebijakan booking."}
            </p>

          </div>
        </div>

        {/* MODAL SUKSES PEMESANAN */}
        {bookingSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/70 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center">

              <div className="w-16 h-16 rounded-full bg-soft-mint text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                ✓
              </div>

              <span className="inline-block px-4 py-1.5 rounded-full bg-soft-mint text-primary text-xs font-bold tracking-wider mb-2">
                {isEnglish ? "BOOKING CONFIRMED" : "BOOKING BERHASIL"}
              </span>

              <h2 className="text-2xl font-bold text-dark-text">
                {isEnglish ? "Thank You for Booking!" : "Pemesanan Berhasil!"}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {isEnglish
                  ? "Your booking has been recorded. Here are your booking details:"
                  : "Pemesanan kamu telah dicatat. Berikut adalah rincian pemesanan:"}
              </p>

              <div className="bg-soft-mint/70 rounded-2xl p-4 my-6 text-left space-y-3 text-sm">

                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500">ID Booking:</span>
                  <span className="font-bold text-primary text-right break-words">
                    {bookingSuccess.id}
                  </span>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500">Venue:</span>
                  <span className="font-semibold text-dark-text text-right break-words">
                    {bookingSuccess.tempat}
                  </span>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500">Unit:</span>
                  <span className="font-semibold text-dark-text text-right break-words">
                    {bookingSuccess.lapangan}
                  </span>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500">Jadwal:</span>
                  <span className="font-semibold text-dark-text text-right break-words">
                    {bookingSuccess.tanggal} • {bookingSuccess.jam}
                  </span>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500">Pemesan:</span>
                  <span className="font-semibold text-dark-text text-right break-words">
                    {bookingSuccess.customer.name}
                  </span>
                </div>

                <div className="border-t border-primary/10 pt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center">
                  <span className="font-bold text-dark-text">
                    Total Bayar:
                  </span>

                  <span className="font-bold text-primary text-base whitespace-nowrap tabular-nums">
                    Rp {bookingSuccess.total.toLocaleString("id-ID")}
                  </span>
                </div>

              </div>

              {metodePembayaran === "qris" && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-6 text-xs text-gray-600">
                  <p className="font-bold text-gray-800 mb-1">
                    Pembayaran QRIS Terverifikasi
                  </p>

                  <p>
                    Status pemesanan kamu telah{" "}
                    <strong>Dikonfirmasi (Lunas)</strong>.
                  </p>
                </div>
              )}

              {metodePembayaran === "cod" && (
                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200 mb-6 text-xs text-yellow-800">
                  <p className="font-bold mb-1">
                    Bayar di Tempat (Kasir)
                  </p>

                  <p>
                    Tunjukkan ID Booking ini ke petugas kasir saat tiba di lokasi sebelum bermain.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/riwayat")}
                  className="liquid-booking-button flex-1 justify-center"
                >
                  {isEnglish ? "View Booking History" : "Lihat Riwayat Booking"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="rounded-full border border-gray-300 py-3 px-5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition flex-1"
                >
                  {isEnglish ? "Back to Home" : "Kembali ke Beranda"}
                </button>
              </div>

            </div>
          </div>
        )}

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