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
  }).format(angka);

const formatTanggal = (tanggal, isEnglish) => {
  if (!tanggal) return "-";
  const dateObj = new Date(`${tanggal}T00:00:00`);
  if (isNaN(dateObj.getTime())) return tanggal;

  return dateObj.toLocaleDateString(
    isEnglish ? "en-US" : "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
};

const statusBookingStyle = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const statusPembayaranStyle = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Refunded: "bg-purple-100 text-purple-700",
  Failed: "bg-red-100 text-red-700",
};

export default function RiwayatPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isEnglish = language === "English" || language === "en";

  const [filter, setFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
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
  };

  const filters = [
    { value: "All", label: translations.all },
    { value: "Pending", label: translations.pending },
    { value: "Confirmed", label: translations.confirmed },
    { value: "Completed", label: translations.completed },
    { value: "Cancelled", label: translations.cancelled },
  ];

  // Muat data booking dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sportify_bookings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          requestAnimationFrame(() => {
            setBookings([...parsed, ...initialRiwayat]);
            setLoading(false);
          });
          return;
        }
      }
    } catch {
      // ignore parse error
    }

    requestAnimationFrame(() => {
      setBookings(initialRiwayat);
      setLoading(false);
    });
  }, []);

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((booking) => booking.statusBooking === filter);

  const getBookingStatus = (status) => {
    const labels = {
      Pending: translations.pending,
      Confirmed: translations.confirmed,
      Completed: translations.completed,
      Cancelled: translations.cancelled,
    };

    return labels[status] || status;
  };

  const getPaymentStatus = (status) => {
    const labels = {
      Paid: isEnglish ? "Paid" : "Lunas",
      Pending: isEnglish ? "Pending" : "Menunggu",
      Refunded: isEnglish ? "Refunded" : "Dikembalikan",
      Failed: isEnglish ? "Failed" : "Gagal",
    };

    return labels[status] || status;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f8f5] text-gray-800">
        <section className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 pb-20 pt-10 sm:pt-14 md:px-8">

          {/* HEADER */}
          <div className="mb-8 sm:mb-9">
            <span className="inline-block px-4 py-2 rounded-full bg-soft-mint text-primary text-xs font-bold tracking-wider mb-3">
              SPORTIFY
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {translations.title}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 md:text-base">
              {translations.subtitle}
            </p>
          </div>

          {/* FILTER */}
          <div className="mb-7 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 ${filter === item.value
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                    : "border-white bg-white/80 text-gray-600 shadow-sm backdrop-blur-xl hover:border-green-300 hover:text-primary"
                  }`}
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
            /* BOOKING DATA */
            <div className="space-y-5">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-[0_8px_35px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-5">
                      <div>
                        <p className="text-xs text-gray-400">
                          {translations.bookingId}
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                          {booking.id}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${statusBookingStyle[booking.statusBooking] ||
                          "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                      >
                        {getBookingStatus(booking.statusBooking)}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            {translations.venue}
                          </p>

                          <h3 className="mt-1 text-base font-bold text-gray-900">
                            {booking.tempat}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {booking.lapangan} • {booking.kategori}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            {translations.date}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-800">
                            {formatTanggal(booking.tanggal, isEnglish)}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {booking.jam} ({booking.durasi})
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            {translations.total}
                          </p>

                          <p className="mt-1 text-base font-bold text-primary">
                            {formatRupiah(booking.total)}
                          </p>

                          <div className="mt-2">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusPembayaranStyle[booking.statusPembayaran] ||
                                "bg-gray-100 text-gray-700"
                                }`}
                            >
                              {getPaymentStatus(booking.statusPembayaran)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center lg:justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="w-full lg:w-auto rounded-xl border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                          >
                            {translations.detail} →
                          </button>
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
                  onButtonClick={() => {
                    router.push("/lapangan");
                  }}
                />
              )}
            </div>
          )}
        </section>

        {/* DETAIL MODAL */}
        {selectedBooking && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/70 bg-white/95 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Sportify
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {translations.detailTitle}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="mb-5 rounded-2xl bg-soft-mint p-4">
                <p className="text-xs text-gray-500">
                  {translations.bookingId}
                </p>

                <p className="mt-1 font-bold text-primary text-lg">
                  {selectedBooking.id}
                </p>
              </div>

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
                    className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3"
                  >
                    <span className="text-sm text-gray-500">{label}</span>

                    <span className="text-right text-sm font-semibold text-gray-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="liquid-booking-button w-full mt-7 justify-center"
              >
                {translations.close}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
