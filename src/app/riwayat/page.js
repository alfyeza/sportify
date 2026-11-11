"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RiwayatPage() {
  // Simulasi data booking
  const [booking, setBooking] = useState({
    id: "INV-SPRT-001234",
    lapangan: "Futsal Arena A (Lapangan 1)",
    tanggal: "24 November 2026",
    jam: "19:00 - 21:00 WIB",
    total: 300000,
    status: "Dikonfirmasi", // 'Dikonfirmasi' atau 'Dibatalkan'
  });

  const handleBatal = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan jadwal ini? Aksi ini tidak dapat dikembalikan.")) {
      setBooking({ ...booking, status: "Dibatalkan" });
    }
  };

  const handleCetak = () => {
    window.print();
  };

  return (
    <>
      {/* Sembunyikan Navbar saat di-print */}
      <div className="print:hidden"><Navbar /></div>

      <main className="min-h-screen bg-background px-4 py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-dark-text mb-8 print:hidden">Riwayat Booking</h1>

        {/* CONTAINER E-TICKET (Area ini yang akan dicetak dengan rapi) */}
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden print:shadow-none print:border-black print:m-0">

          {/* Header Tiket */}
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center print:bg-white print:text-black print:border-b-2 print:border-black">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider opacity-80 print:text-gray-500">E-Ticket Sportify</h2>
              <p className="text-2xl font-bold mt-1">{booking.id}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${booking.status === "Dikonfirmasi"
                ? "bg-white text-blue-600 border-white print:border-black print:text-black"
                : "bg-red-500 text-white border-red-500 print:border-black print:text-black"
              }`}>
              {booking.status}
            </div>
          </div>

          {/* Rincian Tiket */}
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tempat</p>
              <p className="text-xl font-bold text-dark-text">{booking.lapangan}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tanggal</p>
                <p className="font-semibold">{booking.tanggal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Waktu</p>
                <p className="font-semibold">{booking.jam}</p>
              </div>
            </div>

            <div className="border-t pt-6 flex justify-between items-center">
              <p className="text-gray-500 font-medium">Total Pembayaran</p>
              <p className="text-2xl font-bold text-blue-600 print:text-black">
                Rp {booking.total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Aksi (Hanya Tampil di Layar, Hilang Saat Print) */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 print:hidden">
          {booking.status === "Dikonfirmasi" && (
            <>
              <button
                onClick={handleCetak}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 font-semibold transition-colors"
              >
                🖨️ Cetak Bukti E-Ticket
              </button>

              <button
                onClick={handleBatal}
                className="flex-1 bg-white text-red-500 border-2 border-red-100 py-3 rounded-xl hover:bg-red-50 font-semibold transition-colors"
              >
                Batalkan Booking
              </button>
            </>
          )}
        </div>
      </main>

      {/* Sembunyikan Footer saat di-print */}
      <div className="print:hidden"><Footer /></div>
    </>
  );
}