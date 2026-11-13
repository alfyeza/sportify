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

  const [namaPemesan, setNamaPemesan] = useState("");
  const [emailPemesan, setEmailPemesan] = useState("");
  const [teleponPemesan, setTeleponPemesan] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      const currentPath = `/booking?${searchParams.toString()}`;

      router.replace(
        `/login?redirect=${encodeURIComponent(currentPath)}`
      );

      return;
    }

    try {
      const savedUser = localStorage.getItem("sportify_user");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (user.fullName) setNamaPemesan(user.fullName);
        if (user.email) setEmailPemesan(user.email);
        if (user.phone) setTeleponPemesan(user.phone);
      }
    } catch {
      // Abaikan jika JSON tidak valid
    }

    setIsCheckingAuth(false);
  }, [router, searchParams]);

  if (isCheckingAuth) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background flex items-center justify-center px-5">
          <div className="text-center booking-loading">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

            <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              {isEnglish
                ? "Checking account access..."
                : "Memeriksa akses akun..."}
            </p>
          </div>
        </main>

        <Footer />

        <style jsx global>{`
          @keyframes bookingLoading {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .booking-loading {
            animation: bookingLoading 0.6s ease both;
          }
        `}</style>
      </>
    );
  }

  if (!lapangan) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
          <div className="liquid-info-card booking-empty-state text-center max-w-md w-full p-6 sm:p-8 dark:bg-[#17231e] dark:border-white/10">
            <div className="text-4xl mb-4">!</div>

            <h1 className="text-xl sm:text-2xl font-bold text-dark-text dark:text-gray-100">
              {isEnglish ? "No Booking Found" : "Belum Ada Pemesanan"}
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-3 leading-relaxed text-sm sm:text-base">
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

        <style jsx global>{`
          @keyframes bookingEmpty {
            from {
              opacity: 0;
              transform: translateY(25px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .booking-empty-state {
            animation: bookingEmpty 0.7s ease both;
          }
        `}</style>
      </>
    );
  }

  // Harga lapangan dihitung per sesi, tidak dikalikan durasi.
  const totalHarga = Number(lapangan.harga || 0);

  const hitungJamSelesai = (jamMulai, totalDurasi) => {
    if (!jamMulai) return "-";

    const [jamAwal] = jamMulai.split(":").map(Number);
    const jamAkhir = (jamAwal + totalDurasi) % 24;

    return `${String(jamAkhir).padStart(2, "0")}:00`;
  };

  const jamSelesai = hitungJamSelesai(jam, durasi);

  const handleProsesBooking = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      const currentPath = `/booking?${searchParams.toString()}`;

      router.replace(
        `/login?redirect=${encodeURIComponent(currentPath)}`
      );

      return;
    }

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

    if (!unit || !tanggal || !jam) {
      setErrorMessage(
        isEnglish
          ? "Booking details are incomplete. Please select a court schedule again."
          : "Detail booking belum lengkap. Silakan pilih jadwal lapangan kembali."
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
        lapangan: unit,
        kategori: kategoriUtama,
        tanggal: tanggal,
        jam: `${jam} - ${jamSelesai}`,
        durasi: `${durasi} Jam`,
        total: totalHarga,
        statusBooking: "Pending",
        statusPembayaran: "Pending",
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

      <main className="booking-confirmation-page min-h-screen bg-background dark:bg-[#101a15] px-4 sm:px-6 py-8 sm:py-12 md:py-14">
        <div className="booking-content max-w-3xl mx-auto min-w-0">
          {/* TOMBOL KEMBALI */}
          <Link
            href={`/lapangan/${lapangan.id}/booking`}
            className="booking-back inline-flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-70 transition"
          >
            ← {isEnglish ? "Back to Schedule Selection" : "Kembali ke Pilih Jadwal"}
          </Link>

          {/* HEADER */}
          <div className="booking-page-header mt-6 sm:mt-7 mb-7 sm:mb-8">
            <span className="booking-label inline-block px-4 py-2 rounded-full bg-soft-mint dark:bg-[#22382c] text-primary text-xs font-bold tracking-wider">
              SPORTIFY BOOKING
            </span>

            <h1 className="text-2xl sm:text-4xl font-bold text-dark-text dark:text-gray-100 mt-4">
              {isEnglish ? "Booking & Payment Summary" : "Ringkasan & Pembayaran"}
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm sm:text-base leading-relaxed">
              {isEnglish
                ? "Review your booking details and submit your booking request."
                : "Periksa kembali detail pemesanan sebelum mengirim permintaan booking."}
            </p>
          </div>

          {/* KARTU RINGKASAN */}
          <div className="liquid-booking-page-card booking-main-card w-full min-w-0 !bg-white dark:!bg-[#1b2922] !border-gray-200 dark:!border-white/10">
            {/* INFORMASI TEMPAT */}
            <div className="booking-venue-info flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-primary font-bold tracking-wider uppercase">
                  {isEnglish ? "Booking Details" : "Detail Pemesanan"}
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-dark-text dark:text-gray-100 mt-2 break-words">
                  {lapangan.nama}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-start gap-2">
                  <span className="shrink-0">📍</span>
                  <span className="min-w-0 break-words">
                    {lapangan.lokasi}
                  </span>
                </p>
              </div>

              <div className="booking-venue-badge bg-soft-mint dark:bg-[#22382c] text-primary px-4 py-2 rounded-full text-sm font-semibold w-fit shrink-0">
                Sportify Booking
              </div>
            </div>

            <div className="liquid-booking-divider dark:border-white/10" />

            {/* INFORMASI BOOKING */}
            <div className="booking-details space-y-4 sm:space-y-5 w-full min-w-0">
              <div className="liquid-summary-row dark:text-gray-300">
                <span>{isEnglish ? "Sports Venue" : "Tempat Olahraga"}</span>
                <strong className="dark:text-gray-100">{lapangan.nama}</strong>
              </div>

              <div className="liquid-summary-row dark:text-gray-300">
                <span>{isEnglish ? "Court Unit" : "Unit Lapangan"}</span>
                <strong className="dark:text-gray-100">{unit || "-"}</strong>
              </div>

              <div className="liquid-summary-row dark:text-gray-300">
                <span>{isEnglish ? "Playing Date" : "Tanggal Bermain"}</span>
                <strong className="dark:text-gray-100">{tanggal || "-"}</strong>
              </div>

              <div className="liquid-summary-row dark:text-gray-300">
                <span>{isEnglish ? "Playing Time" : "Waktu Bermain"}</span>
                <strong className="dark:text-gray-100">{jam ? `${jam} - ${jamSelesai}` : "-"}</strong>
              </div>

              <div className="liquid-summary-row dark:text-gray-300">
                <span>{isEnglish ? "Playing Duration" : "Durasi Bermain"}</span>
                <strong className="dark:text-gray-100">
                  {durasi} {isEnglish ? "hour(s)" : "Jam"}
                </strong>
              </div>
            </div>

            <div className="liquid-booking-divider dark:border-white/10" />

            {/* FORM DATA PEMESAN */}
            <div className="booking-form-section space-y-4 min-w-0">
              <h3 className="font-bold text-dark-text dark:text-gray-100 text-base sm:text-lg">
                {isEnglish ? "Customer Information" : "Data Pemesan"}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  {isEnglish ? "Full Name" : "Nama Lengkap"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={namaPemesan}
                  onChange={(e) => setNamaPemesan(e.target.value)}
                  placeholder={isEnglish ? "Enter full name" : "Masukkan nama lengkap"}
                  className="liquid-auth-input booking-input w-full text-sm dark:bg-[#22382c] dark:text-gray-100 dark:border-white/10 dark:placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                    {isEnglish ? "WhatsApp / Phone" : "No. WhatsApp / HP"}{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="tel"
                    value={teleponPemesan}
                    onChange={(e) => setTeleponPemesan(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="liquid-auth-input booking-input w-full text-sm dark:bg-[#22382c] dark:text-gray-100 dark:border-white/10 dark:placeholder:text-gray-500"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                    Email ({isEnglish ? "Optional" : "Opsional"})
                  </label>

                  <input
                    type="email"
                    value={emailPemesan}
                    onChange={(e) => setEmailPemesan(e.target.value)}
                    placeholder="email@example.com"
                    className="liquid-auth-input booking-input w-full text-sm dark:bg-[#22382c] dark:text-gray-100 dark:border-white/10 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="liquid-booking-divider dark:border-white/10" />

            {/* PILIH METODE PEMBAYARAN */}
            <div className="booking-payment-section space-y-3 min-w-0">
              <h3 className="font-bold text-dark-text dark:text-gray-100 text-base sm:text-lg">
                {isEnglish ? "Payment Method" : "Metode Pembayaran"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* QRIS */}
                <button
                  type="button"
                  onClick={() => setMetodePembayaran("qris")}
                  className={`booking-payment-option p-3.5 rounded-2xl border text-left transition ${metodePembayaran === "qris"
                    ? "border-primary bg-soft-mint dark:bg-[#22382c] text-primary ring-1 ring-primary"
                    : "border-gray-200 bg-white text-dark-text hover:border-gray-300 dark:border-white/10 dark:bg-[#1b2922] dark:text-gray-100 dark:hover:border-white/20"
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm">QRIS</span>

                    <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded shrink-0">
                      Instan
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Gopay, OVO, Dana, BCA
                  </p>
                </button>

                {/* TRANSFER BANK */}
                <button
                  type="button"
                  onClick={() => setMetodePembayaran("transfer")}
                  className={`booking-payment-option p-3.5 rounded-2xl border text-left transition ${metodePembayaran === "transfer"
                    ? "border-primary bg-soft-mint dark:bg-[#22382c] text-primary ring-1 ring-primary"
                    : "border-gray-200 bg-white text-dark-text hover:border-gray-300 dark:border-white/10 dark:bg-[#1b2922] dark:text-gray-100 dark:hover:border-white/20"
                    }`}
                >
                  <div className="font-bold text-sm">
                    Transfer Bank
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Virtual Account BCA, BNI
                  </p>
                </button>

                {/* BAYAR DI TEMPAT */}
                <button
                  type="button"
                  onClick={() => setMetodePembayaran("cod")}
                  className={`booking-payment-option p-3.5 rounded-2xl border text-left transition ${metodePembayaran === "cod"
                    ? "border-primary bg-soft-mint dark:bg-[#22382c] text-primary ring-1 ring-primary"
                    : "border-gray-200 bg-white text-dark-text hover:border-gray-300 dark:border-white/10 dark:bg-[#1b2922] dark:text-gray-100 dark:hover:border-white/20"
                    }`}
                >
                  <div className="font-bold text-sm">
                    Bayar di Tempat
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Bayar langsung di kasir
                  </p>
                </button>
              </div>
            </div>

            <div className="liquid-booking-divider dark:border-white/10" />

            {/* RINCIAN HARGA */}
            <div className="booking-payment-details bg-soft-mint/70 dark:bg-[#22382c] rounded-2xl p-4 sm:p-6 w-full min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {isEnglish ? "Payment Details" : "Rincian Pembayaran"}
              </p>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mt-5">
                <span className="text-gray-600 dark:text-gray-300 text-sm min-w-0">
                  {isEnglish ? "Price per session" : "Harga per sesi"}
                </span>

                <span className="font-semibold text-dark-text dark:text-gray-100 text-sm sm:text-base whitespace-nowrap tabular-nums">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mt-4">
                <span className="text-gray-600 dark:text-gray-300 text-sm min-w-0">
                  {isEnglish ? "Playing Duration" : "Durasi Bermain"}
                </span>

                <span className="font-semibold text-dark-text dark:text-gray-100 text-sm sm:text-base whitespace-nowrap">
                  {durasi} {isEnglish ? "hour(s)" : "Jam"}
                </span>
              </div>

              <div className="border-t border-primary/10 dark:border-white/10 my-5" />

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <span className="font-bold text-dark-text dark:text-gray-100 text-sm sm:text-base min-w-0">
                  {isEnglish ? "Total Payment" : "Total Pembayaran"}
                </span>

                <span className="text-lg sm:text-2xl font-bold text-primary whitespace-nowrap tabular-nums">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* PESAN ERROR */}
            {errorMessage && (
              <div className="booking-error mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 text-sm border border-red-200 dark:border-red-500/20">
                {errorMessage}
              </div>
            )}

            {/* TOMBOL KONFIRMASI */}
            <button
              type="button"
              onClick={handleProsesBooking}
              disabled={isSubmitting}
              className="liquid-booking-button booking-confirm-button flex w-full mt-7 sm:mt-8 justify-center items-center gap-3 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting
                ? isEnglish
                  ? "Processing..."
                  : "Memproses..."
                : isEnglish
                  ? "Submit Booking Request"
                  : "Kirim Permintaan Booking"}

              <span>→</span>
            </button>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 leading-relaxed">
              {isEnglish
                ? "Your booking will be pending until the venue confirms it. Payment must also be verified."
                : "Booking akan menunggu konfirmasi mitra. Pembayaran juga perlu diverifikasi."}
            </p>
          </div>
        </div>

        {/* MODAL SUKSES PEMESANAN */}
        {bookingSuccess && (
          <div className="booking-success-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
            <div className="booking-success-modal max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/70 bg-white/95 dark:border-white/10 dark:bg-[#17231e] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center">
              <div className="booking-success-icon w-16 h-16 rounded-full bg-soft-mint dark:bg-[#22382c] text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                ✓
              </div>

              <span className="inline-block px-4 py-1.5 rounded-full bg-soft-mint dark:bg-[#22382c] text-primary text-xs font-bold tracking-wider mb-2">
                {isEnglish ? "BOOKING REQUEST SENT" : "PERMINTAAN BOOKING TERKIRIM"}
              </span>

              <h2 className="text-2xl font-bold text-dark-text dark:text-gray-100">
                {isEnglish
                  ? "Booking Request Submitted!"
                  : "Permintaan Booking Berhasil Dikirim!"}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isEnglish
                  ? "Your booking request has been recorded and is waiting for venue confirmation."
                  : "Permintaan booking kamu sudah tercatat dan sedang menunggu konfirmasi dari mitra."}
              </p>

              <div className="bg-soft-mint/70 dark:bg-[#22382c] rounded-2xl p-4 my-6 text-left space-y-3 text-sm">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500 dark:text-gray-400">ID Booking:</span>
                  <span className="font-bold text-primary text-right break-words">
                    {bookingSuccess.id}
                  </span>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500 dark:text-gray-400">Venue:</span>
                  <span className="font-semibold text-dark-text dark:text-gray-100 text-right break-words">
                    {bookingSuccess.tempat}
                  </span>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500 dark:text-gray-400">Unit:</span>
                  <span className="font-semibold text-dark-text dark:text-gray-100 text-right break-words">
                    {bookingSuccess.lapangan}
                  </span>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500 dark:text-gray-400">Jadwal:</span>
                  <span className="font-semibold text-dark-text dark:text-gray-100 text-right break-words">
                    {bookingSuccess.tanggal} • {bookingSuccess.jam}
                  </span>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-start">
                  <span className="text-gray-500 dark:text-gray-400">Pemesan:</span>
                  <span className="font-semibold text-dark-text dark:text-gray-100 text-right break-words">
                    {bookingSuccess.customer.name}
                  </span>
                </div>

                <div className="border-t border-primary/10 dark:border-white/10 pt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center">
                  <span className="font-bold text-dark-text dark:text-gray-100">
                    Total Pembayaran:
                  </span>

                  <span className="font-bold text-primary text-base whitespace-nowrap tabular-nums">
                    Rp {bookingSuccess.total.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="border-t border-primary/10 dark:border-white/10 pt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    {isEnglish ? "Booking Status:" : "Status Booking:"}
                  </span>

                  <span className="font-bold text-yellow-700 dark:text-yellow-400">
                    {isEnglish ? "Pending" : "Menunggu Konfirmasi"}
                  </span>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    {isEnglish ? "Payment Status:" : "Status Pembayaran:"}
                  </span>

                  <span className="font-bold text-yellow-700 dark:text-yellow-400">
                    {isEnglish ? "Pending" : "Menunggu Pembayaran"}
                  </span>
                </div>
              </div>

              {metodePembayaran === "qris" && (
                <div className="p-4 bg-gray-50 dark:bg-[#22382c] rounded-2xl border border-gray-200 dark:border-white/10 mb-6 text-xs text-gray-600 dark:text-gray-300">
                  <p className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                    {isEnglish ? "QRIS Payment" : "Pembayaran QRIS"}
                  </p>

                  <p>
                    {isEnglish
                      ? "Your selected payment method is QRIS. Payment instructions and verification will follow the venue's confirmation."
                      : "Kamu memilih metode QRIS. Instruksi dan verifikasi pembayaran akan mengikuti konfirmasi dari mitra."}
                  </p>
                </div>
              )}

              {metodePembayaran === "transfer" && (
                <div className="p-4 bg-gray-50 dark:bg-[#22382c] rounded-2xl border border-gray-200 dark:border-white/10 mb-6 text-xs text-gray-600 dark:text-gray-300">
                  <p className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                    {isEnglish ? "Bank Transfer" : "Transfer Bank"}
                  </p>

                  <p>
                    {isEnglish
                      ? "Your selected payment method is bank transfer. Please wait for payment instructions from the venue."
                      : "Kamu memilih metode transfer bank. Silakan tunggu instruksi pembayaran dari mitra."}
                  </p>
                </div>
              )}

              {metodePembayaran === "cod" && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-2xl border border-yellow-200 dark:border-yellow-500/20 mb-6 text-xs text-yellow-800 dark:text-yellow-300">
                  <p className="font-bold mb-1">
                    {isEnglish ? "Pay at Venue" : "Bayar di Tempat"}
                  </p>

                  <p>
                    {isEnglish
                      ? "If your booking is confirmed, show this booking ID to the cashier when you arrive."
                      : "Jika booking sudah dikonfirmasi, tunjukkan ID Booking ini kepada petugas kasir saat tiba di lokasi."}
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
                  className="booking-home-button rounded-full border border-gray-300 dark:border-white/15 py-3 px-5 text-sm font-semibold text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition flex-1"
                >
                  {isEnglish ? "Back to Home" : "Kembali ke Beranda"}
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes bookingPageFade {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes bookingPageUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bookingPageScale {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(16px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes bookingSuccessPop {
            0% {
              opacity: 0;
              transform: scale(0.5);
            }
            70% {
              opacity: 1;
              transform: scale(1.12);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes bookingSuccessCheck {
            from {
              opacity: 0;
              transform: scale(0.5) rotate(-30deg);
            }
            to {
              opacity: 1;
              transform: scale(1) rotate(0);
            }
          }

          .booking-confirmation-page {
            animation: bookingPageFade 0.6s ease both;
          }

          .booking-back {
            animation: bookingPageUp 0.5s ease both;
          }

          .booking-page-header {
            animation: bookingPageUp 0.65s ease 0.08s both;
          }

          .booking-label {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .booking-label:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(20, 107, 69, 0.12);
          }

          .booking-main-card {
            animation: bookingPageUp 0.8s ease 0.18s both;
            transition: box-shadow 0.3s ease;
          }

          .booking-main-card:hover {
            box-shadow: 0 20px 55px rgba(20, 107, 69, 0.07);
          }

          .booking-venue-info {
            animation: bookingPageUp 0.6s ease 0.25s both;
          }

          .booking-venue-badge {
            transition: transform 0.3s ease;
          }

          .booking-venue-badge:hover {
            transform: translateY(-3px);
          }

          .booking-details {
            animation: bookingPageUp 0.6s ease 0.32s both;
          }

          .booking-details .liquid-summary-row {
            transition: transform 0.25s ease;
          }

          .booking-details .liquid-summary-row:hover {
            transform: translateX(4px);
          }

          .booking-form-section {
            animation: bookingPageUp 0.6s ease 0.4s both;
          }

          .booking-payment-section {
            animation: bookingPageUp 0.6s ease 0.48s both;
          }

          .booking-payment-option {
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease,
              border-color 0.25s ease;
          }

          .booking-payment-option:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 22px rgba(20, 107, 69, 0.09);
          }

          .booking-payment-option:active {
            transform: scale(0.98);
          }

          .booking-input {
            transition:
              border-color 0.25s ease,
              box-shadow 0.25s ease,
              transform 0.25s ease;
          }

          .booking-input:focus {
            transform: translateY(-1px);
          }

          .booking-payment-details {
            animation: bookingPageUp 0.65s ease 0.55s both;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .booking-payment-details:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 28px rgba(20, 107, 69, 0.08);
          }

          .booking-confirm-button {
            animation: bookingPageUp 0.6s ease 0.65s both;
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease,
              opacity 0.25s ease;
          }

          .booking-confirm-button:hover:not(:disabled) {
            transform: translateY(-4px);
            box-shadow: 0 14px 28px rgba(20, 107, 69, 0.2);
          }

          .booking-confirm-button:active:not(:disabled) {
            transform: scale(0.98);
          }

          .booking-error {
            animation: bookingPageUp 0.3s ease both;
          }

          .booking-success-overlay {
            animation: bookingPageFade 0.25s ease both;
          }

          .booking-success-modal {
            animation: bookingPageScale 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          }

          .booking-success-icon {
            animation: bookingSuccessPop 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both;
            position: relative;
          }

          .booking-success-icon::after {
            content: "";
            position: absolute;
            inset: -7px;
            border: 2px solid rgba(39, 163, 107, 0.2);
            border-radius: 9999px;
            animation: bookingSuccessCheck 0.7s ease both;
          }

          .booking-home-button {
            transition:
              transform 0.25s ease,
              background-color 0.25s ease;
          }

          .booking-home-button:hover {
            transform: translateY(-2px);
          }

          @media (prefers-reduced-motion: reduce) {
            .booking-confirmation-page *,
            .booking-confirmation-page *::before,
            .booking-confirmation-page *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">
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