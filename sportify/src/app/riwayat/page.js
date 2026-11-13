"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { useLanguage } from "@/components/LanguageProvider";

const initialRiwayat = [
  {
    id: "SPT-2026-001",
    tempat: "Unity Sports Center",
    lapangan: "Court A",
    kategori: "Padel",
    tanggal: "2026-11-05",
    jam: "09:00 - 10:00",
    durasi: "1 Jam",
    total: 150000,
    statusBooking: "Confirmed",
    statusPembayaran: "Paid",
  },
  {
    id: "SPT-2026-002",
    tempat: "Sport Arena Demak",
    lapangan: "Court B",
    kategori: "Badminton",
    tanggal: "2026-11-08",
    jam: "13:00 - 15:00",
    durasi: "2 Jam",
    total: 100000,
    statusBooking: "Pending",
    statusPembayaran: "Pending",
  },
  {
    id: "SPT-2026-003",
    tempat: "Grand Tennis Center",
    lapangan: "Court 1",
    kategori: "Tennis",
    tanggal: "2026-10-28",
    jam: "15:00 - 16:00",
    durasi: "1 Jam",
    total: 200000,
    statusBooking: "Completed",
    statusPembayaran: "Paid",
  },
  {
    id: "SPT-2026-004",
    tempat: "Unity Sports Center",
    lapangan: "Court C",
    kategori: "Padel",
    tanggal: "2026-10-20",
    jam: "10:00 - 11:00",
    durasi: "1 Jam",
    total: 150000,
    statusBooking: "Cancelled",
    statusPembayaran: "Refunded",
  },
];

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka || 0);

const formatTanggal = (tanggal, isEnglish) => {
  if (!tanggal) return "-";

  const dateObj = new Date(`${tanggal}T00:00:00`);

  if (isNaN(dateObj.getTime())) return tanggal;

  return dateObj.toLocaleDateString(isEnglish ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const statusBookingStyle = {
  Pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  Confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  Cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const statusPembayaranStyle = {
  Paid: "bg-green-500/10 text-green-700 dark:text-green-400",
  Pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  Refunded: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  Failed: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const surfaceStyle = {
  backgroundColor: "var(--bg-card)",
  borderColor: "var(--border-main)",
};

const textSecondaryStyle = {
  color: "var(--text-secondary)",
};

const textMutedStyle = {
  color: "var(--text-muted)",
};

export default function RiwayatPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const isEnglish = language === "English" || language === "en";

  const [filter, setFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [bookings, setBookings] = useState(initialRiwayat);
  const [loading, setLoading] = useState(true);

  const translations = {
    title: isEnglish ? "Booking History" : "Riwayat Booking",
    subtitle: isEnglish
      ? "Keep track of all your sports field bookings."
      : "Lihat dan pantau semua riwayat pemesanan lapangan olahraga kamu.",

    all: isEnglish ? "All" : "Semua",
    pending: isEnglish ? "Pending" : "Menunggu",
    confirmed: isEnglish ? "Confirmed" : "Dikonfirmasi",
    completed: isEnglish ? "Completed" : "Selesai",
    cancelled: isEnglish ? "Cancelled" : "Dibatalkan",

    bookingId: isEnglish ? "Booking ID" : "ID Booking",
    field: isEnglish ? "Field" : "Lapangan",
    date: isEnglish ? "Playing Date" : "Tanggal Bermain",
    time: isEnglish ? "Playing Time" : "Jam Bermain",
    duration: isEnglish ? "Duration" : "Durasi",
    total: isEnglish ? "Total Payment" : "Total Pembayaran",
    bookingStatus: isEnglish ? "Booking Status" : "Status Booking",
    paymentStatus: isEnglish ? "Payment Status" : "Status Pembayaran",

    detail: isEnglish ? "View Details" : "Lihat Detail",

    empty: isEnglish
      ? "No booking history found."
      : "Belum ada riwayat booking.",

    emptyDescription: isEnglish
      ? "Your bookings will appear here."
      : "Riwayat pemesanan kamu akan muncul di sini.",

    detailTitle: isEnglish ? "Booking Details" : "Detail Booking",
    venue: isEnglish ? "Sports Venue" : "Tempat Olahraga",
    category: isEnglish ? "Sport Category" : "Kategori Olahraga",
    close: isEnglish ? "Close" : "Tutup",

    cancel: isEnglish ? "Cancel Booking" : "Batalkan Pesanan",

    cancelTitle: isEnglish
      ? "Cancel This Booking?"
      : "Batalkan Pesanan Ini?",

    cancelDescription: isEnglish
      ? "Are you sure you want to cancel this booking? This action cannot be undone."
      : "Apakah kamu yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan kembali.",

    cancelWarning: isEnglish
      ? "Make sure you have checked your booking details before continuing."
      : "Pastikan kamu sudah memeriksa detail pesanan sebelum melanjutkan.",

    confirmCancel: isEnglish
      ? "Yes, Cancel Booking"
      : "Ya, Batalkan Pesanan",

    keepBooking: isEnglish
      ? "Keep Booking"
      : "Jangan Batalkan",

    cancelledNotice: isEnglish
      ? "This booking has been cancelled."
      : "Pesanan ini sudah dibatalkan.",

    timeline: isEnglish ? "Booking Progress" : "Perjalanan Pesanan",

    created: isEnglish ? "Booking Created" : "Pesanan Dibuat",
    createdDescription: isEnglish
      ? "Your booking has been registered."
      : "Pesanan berhasil dibuat.",

    confirmedTitle: isEnglish
      ? "Booking Confirmed"
      : "Pesanan Dikonfirmasi",

    waitingConfirmation: isEnglish
      ? "Waiting for venue confirmation."
      : "Menunggu konfirmasi dari pihak lapangan.",

    confirmedDescription: isEnglish
      ? "Your booking has been confirmed."
      : "Pesanan telah dikonfirmasi.",

    completedTitle: isEnglish
      ? "Booking Completed"
      : "Pesanan Selesai",

    completedDescription: isEnglish
      ? "Enjoy your sports session!"
      : "Selamat menikmati sesi olahraga!",

    cancelledTitle: isEnglish
      ? "Booking Cancelled"
      : "Pesanan Dibatalkan",

    cancelledDescription: isEnglish
      ? "This booking has been cancelled."
      : "Pesanan ini telah dibatalkan.",
  };

  const filters = [
    { value: "All", label: translations.all },
    { value: "Pending", label: translations.pending },
    { value: "Confirmed", label: translations.confirmed },
    { value: "Completed", label: translations.completed },
    { value: "Cancelled", label: translations.cancelled },
  ];

  // MEMERIKSA LOGIN DAN MEMUAT DATA BOOKING
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login?redirect=%2Friwayat");
      return;
    }

    try {
      const stored = localStorage.getItem("sportify_bookings");

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const combined = [...parsed, ...initialRiwayat];

          const uniqueBookings = combined.filter(
            (booking, index, self) =>
              index === self.findIndex((item) => item.id === booking.id)
          );

          setBookings(uniqueBookings);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Gagal membaca riwayat booking:", error);
    }

    setBookings(initialRiwayat);
    setLoading(false);
  }, [router]);

  // MENYIMPAN DATA BOOKING
  const saveBookings = (updatedBookings) => {
    setBookings(updatedBookings);

    try {
      localStorage.setItem(
        "sportify_bookings",
        JSON.stringify(updatedBookings)
      );
    } catch (error) {
      console.error("Gagal menyimpan riwayat booking:", error);
    }
  };

  // MEMERIKSA APAKAH BOOKING BISA DIBATALKAN
  const canCancelBooking = (booking) => {
    return (
      booking.statusBooking === "Pending" ||
      booking.statusBooking === "Confirmed"
    );
  };

  // MENDAPATKAN LABEL STATUS BOOKING
  const getBookingStatus = (status) => {
    const labels = {
      Pending: translations.pending,
      Confirmed: translations.confirmed,
      Completed: translations.completed,
      Cancelled: translations.cancelled,
    };

    return labels[status] || status;
  };

  // MENDAPATKAN LABEL STATUS PEMBAYARAN
  const getPaymentStatus = (status) => {
    const labels = {
      Paid: isEnglish ? "Paid" : "Lunas",
      Pending: isEnglish ? "Pending" : "Menunggu",
      Refunded: isEnglish ? "Refunded" : "Dikembalikan",
      Failed: isEnglish ? "Failed" : "Gagal",
    };

    return labels[status] || status;
  };

  // MEMBUAT TIMELINE BERDASARKAN STATUS
  const getBookingTimeline = (status) => {
    if (status === "Cancelled") {
      return [
        {
          title: translations.created,
          description: translations.createdDescription,
          completed: true,
        },
        {
          title: translations.cancelledTitle,
          description: translations.cancelledDescription,
          completed: true,
          cancelled: true,
        },
      ];
    }

    return [
      {
        title: translations.created,
        description: translations.createdDescription,
        completed: true,
      },
      {
        title: translations.confirmedTitle,
        description:
          status === "Pending"
            ? translations.waitingConfirmation
            : translations.confirmedDescription,
        completed: status === "Confirmed" || status === "Completed",
      },
      {
        title: translations.completedTitle,
        description: translations.completedDescription,
        completed: status === "Completed",
      },
    ];
  };

  // PROSES PEMBATALAN BOOKING
  const handleCancelBooking = () => {
    if (!cancelTarget) return;

    if (
      cancelTarget.statusBooking !== "Pending" &&
      cancelTarget.statusBooking !== "Confirmed"
    ) {
      setCancelTarget(null);
      return;
    }

    const updatedBookings = bookings.map((booking) =>
      booking.id === cancelTarget.id
        ? {
          ...booking,
          statusBooking: "Cancelled",
        }
        : booking
    );

    try {
      localStorage.setItem(
        "sportify_bookings",
        JSON.stringify(updatedBookings)
      );

      setBookings(updatedBookings);

      setSelectedBooking((previous) =>
        previous?.id === cancelTarget.id
          ? {
            ...previous,
            statusBooking: "Cancelled",
          }
          : previous
      );

      setCancelTarget(null);

      window.alert(
        isEnglish
          ? "Your booking has been cancelled successfully."
          : "Pesanan berhasil dibatalkan."
      );
    } catch (error) {
      console.error("Gagal membatalkan booking:", error);

      window.alert(
        isEnglish
          ? "Failed to cancel booking. Please try again."
          : "Gagal membatalkan pesanan. Silakan coba lagi."
      );
    }
  };

  // FILTER BOOKING
  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((booking) => booking.statusBooking === filter);

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen"
        style={{
          backgroundColor: "var(--bg-main)",
          color: "var(--text-main)",
        }}
      >
        <section className="mx-auto min-h-screen max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 md:px-8">

          {/* HEADER */}
          <div className="mb-8 sm:mb-9">
            <span className="mb-3 inline-block rounded-full bg-soft-mint px-4 py-2 text-xs font-bold tracking-wider text-primary">
              SPORTIFY
            </span>

            <h1 className="text-2xl font-bold tracking-tight text-dark-text sm:text-3xl md:text-4xl">
              {translations.title}
            </h1>

            <p
              className="mt-3 max-w-xl text-sm leading-6 md:text-base"
              style={textSecondaryStyle}
            >
              {translations.subtitle}
            </p>
          </div>

          {/* FILTER */}
          <div className="mb-7 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${filter === item.value
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                    : "hover:border-primary hover:text-primary"
                  }`}
                style={
                  filter === item.value
                    ? {}
                    : {
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-main)",
                      color: "var(--text-secondary)",
                    }
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <LoadingState
              message={
                isEnglish
                  ? "Loading booking history..."
                  : "Memuat riwayat booking..."
              }
            />
          ) : (
            <div className="space-y-5">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="overflow-hidden rounded-3xl border shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-lg"
                    style={{
                      ...surfaceStyle,
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    {/* BOOKING HEADER */}
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-5 sm:px-6"
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      <div>
                        <p className="text-xs" style={textMutedStyle}>
                          {translations.bookingId}
                        </p>

                        <p className="mt-1 font-semibold text-dark-text">
                          {booking.id}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${statusBookingStyle[booking.statusBooking] ||
                          "border-gray-500/20 bg-gray-500/10 text-gray-600"
                          }`}
                      >
                        {getBookingStatus(booking.statusBooking)}
                      </span>
                    </div>

                    {/* BOOKING INFORMATION */}
                    <div className="p-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs" style={textMutedStyle}>
                            {translations.venue}
                          </p>

                          <h3 className="mt-1 text-base font-bold text-dark-text">
                            {booking.tempat}
                          </h3>

                          <p
                            className="mt-1 text-sm"
                            style={textSecondaryStyle}
                          >
                            {booking.lapangan} • {booking.kategori}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs" style={textMutedStyle}>
                            {translations.date}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-dark-text">
                            {formatTanggal(booking.tanggal, isEnglish)}
                          </p>

                          <p
                            className="mt-1 text-sm"
                            style={textSecondaryStyle}
                          >
                            {booking.jam} ({booking.durasi})
                          </p>
                        </div>

                        <div>
                          <p className="text-xs" style={textMutedStyle}>
                            {translations.total}
                          </p>

                          <p className="mt-1 text-base font-bold text-primary">
                            {formatRupiah(booking.total)}
                          </p>

                          <div className="mt-2">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusPembayaranStyle[
                                booking.statusPembayaran
                                ] || "bg-gray-500/10 text-gray-600"
                                }`}
                            >
                              {getPaymentStatus(booking.statusPembayaran)}
                            </span>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex flex-col justify-center gap-2 lg:items-end">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="w-full rounded-xl border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white lg:w-auto"
                          >
                            {translations.detail} &gt;
                          </button>

                          {canCancelBooking(booking) && (
                            <button
                              type="button"
                              onClick={() => setCancelTarget(booking)}
                              className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/20 dark:text-red-400 lg:w-auto"
                            >
                              {translations.cancel}
                            </button>
                          )}

                          {booking.statusBooking === "Cancelled" && (
                            <span className="text-xs font-medium text-red-500 dark:text-red-400">
                              {translations.cancelledNotice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title={translations.empty}
                  description={translations.emptyDescription}
                  buttonText={isEnglish ? "Find a Court" : "Cari Lapangan"}
                  onButtonClick={() => router.push("/lapangan")}
                />
              )}
            </div>
          )}
        </section>

        {/* DETAIL BOOKING MODAL */}
        {selectedBooking && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border p-6 shadow-2xl backdrop-blur-2xl sm:p-7"
              style={{
                backgroundColor: "var(--bg-card-solid)",
                borderColor: "var(--border-main)",
                color: "var(--text-main)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Sportify
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-dark-text">
                    {translations.detailTitle}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-500/10"
                  style={{
                    backgroundColor: "var(--bg-soft)",
                    color: "var(--text-secondary)",
                  }}
                  aria-label={translations.close}
                >
                  ✕
                </button>
              </div>

              {/* BOOKING ID */}
              <div className="mb-5 rounded-2xl bg-soft-mint p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {translations.bookingId}
                </p>

                <p className="mt-1 text-lg font-bold text-primary">
                  {selectedBooking.id}
                </p>
              </div>

              {/* BOOKING DETAILS */}
              <div className="space-y-4">
                {[
                  [translations.venue, selectedBooking.tempat],
                  [translations.category, selectedBooking.kategori],
                  [translations.field, selectedBooking.lapangan],
                  [
                    translations.date,
                    formatTanggal(selectedBooking.tanggal, isEnglish),
                  ],
                  [translations.time, selectedBooking.jam],
                  [translations.duration, selectedBooking.durasi],
                  [translations.total, formatRupiah(selectedBooking.total)],
                  [
                    translations.bookingStatus,
                    getBookingStatus(selectedBooking.statusBooking),
                  ],
                  [
                    translations.paymentStatus,
                    getPaymentStatus(selectedBooking.statusPembayaran),
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 border-b pb-3"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    <span className="text-sm" style={textSecondaryStyle}>
                      {label}
                    </span>

                    <span className="text-right text-sm font-semibold text-dark-text">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* BOOKING TIMELINE */}
              <div
                className="mt-8 border-t pt-6"
                style={{ borderColor: "var(--border-main)" }}
              >
                <h3 className="mb-6 text-base font-bold text-dark-text">
                  {translations.timeline}
                </h3>

                <div className="relative space-y-6">
                  {getBookingTimeline(
                    selectedBooking.statusBooking
                  ).map((step, index, steps) => (
                    <div key={index} className="relative flex gap-4">
                      {index !== steps.length - 1 && (
                        <div
                          className={`absolute left-[13px] top-7 h-full w-0.5 ${step.completed
                              ? "bg-primary"
                              : "bg-gray-300 dark:bg-gray-700"
                            }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step.cancelled
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : step.completed
                              ? "bg-primary text-white"
                              : "border-2 border-gray-300 bg-transparent text-gray-400 dark:border-gray-600"
                          }`}
                      >
                        {step.cancelled
                          ? "×"
                          : step.completed
                            ? "✓"
                            : index + 1}
                      </div>

                      <div className="pb-2">
                        <p
                          className={`text-sm font-bold ${step.cancelled
                              ? "text-red-600 dark:text-red-400"
                              : step.completed
                                ? "text-primary"
                                : "text-gray-400"
                            }`}
                        >
                          {step.title}
                        </p>

                        <p
                          className="mt-1 text-xs leading-5"
                          style={textSecondaryStyle}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CANCEL BUTTON */}
              {canCancelBooking(selectedBooking) && (
                <button
                  type="button"
                  onClick={() => setCancelTarget(selectedBooking)}
                  className="mt-6 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/20 dark:text-red-400"
                >
                  {translations.cancel}
                </button>
              )}

              {selectedBooking.statusBooking === "Cancelled" && (
                <div className="mt-6 rounded-xl bg-red-500/10 p-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
                  {translations.cancelledNotice}
                </div>
              )}

              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="liquid-booking-button mt-3 w-full justify-center"
              >
                {translations.close}
              </button>
            </div>
          </div>
        )}

        {/* CANCEL CONFIRMATION MODAL */}
        {cancelTarget && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
            onClick={() => setCancelTarget(null)}
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-3xl border p-6 shadow-2xl sm:p-7"
              style={{
                backgroundColor: "var(--bg-card-solid)",
                borderColor: "var(--border-main)",
                color: "var(--text-main)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ICON */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl font-bold text-red-600 dark:text-red-400">
                !
              </div>

              {/* TITLE */}
              <div className="mt-5 text-center">
                <h2 className="text-xl font-bold text-dark-text">
                  {translations.cancelTitle}
                </h2>

                <p
                  className="mt-3 text-sm leading-6"
                  style={textSecondaryStyle}
                >
                  {translations.cancelDescription}
                </p>
              </div>

              {/* BOOKING SUMMARY */}
              <div
                className="mt-6 rounded-2xl border p-4"
                style={{
                  backgroundColor: "var(--bg-soft)",
                  borderColor: "var(--border-soft)",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs" style={textMutedStyle}>
                    {translations.bookingId}
                  </span>

                  <span className="text-sm font-bold text-primary">
                    {cancelTarget.id}
                  </span>
                </div>

                <div
                  className="mt-4 border-t pt-4"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <p className="font-bold text-dark-text">
                    {cancelTarget.tempat}
                  </p>

                  <p className="mt-1 text-sm" style={textSecondaryStyle}>
                    {cancelTarget.lapangan} • {cancelTarget.kategori}
                  </p>

                  <p className="mt-3 text-sm" style={textSecondaryStyle}>
                    {formatTanggal(cancelTarget.tanggal, isEnglish)}
                  </p>

                  <p className="mt-1 text-sm" style={textSecondaryStyle}>
                    {cancelTarget.jam} ({cancelTarget.durasi})
                  </p>

                  <p className="mt-3 text-base font-bold text-primary">
                    {formatRupiah(cancelTarget.total)}
                  </p>
                </div>
              </div>

              {/* WARNING */}
              <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3">
                <p className="text-xs leading-5 text-yellow-700 dark:text-yellow-400">
                  {translations.cancelWarning}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-gray-500/10"
                  style={{
                    borderColor: "var(--border-main)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {translations.keepBooking}
                </button>

                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="flex-1 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                >
                  {translations.confirmCancel}
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