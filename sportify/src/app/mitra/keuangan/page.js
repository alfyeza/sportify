"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

export default function MitraKeuanganPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [transaksi, setTransaksi] = useState([]);
    const [totalPendapatan, setTotalPendapatan] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("sportify_role");

        if (!token) {
            router.replace("/login?redirect=%2Fmitra%2Fkeuangan");
            return;
        }

        if (
            role &&
            !["mitra", "pemilik", "owner", "admin"].includes(role.toLowerCase())
        ) {
            router.replace("/profile");
            return;
        }

        async function fetchKeuangan() {
            try {
                const res = await apiRequest("/mitra/dashboard");
                if (res.success && res.data) {
                    if (res.data.statistik?.totalPendapatan !== undefined) {
                        setTotalPendapatan(Number(res.data.statistik.totalPendapatan) || 0);
                    }

                    if (Array.isArray(res.data.daftarBooking)) {
                        const mapped = res.data.daftarBooking.map((b) => {
                            const isLunas =
                                b.statusBayarDb === "lunas" ||
                                b.statusPembayaran === "Paid" ||
                                b.statusPemesanan === "dikonfirmasi" ||
                                b.statusPemesanan === "selesai";

                            const isBatal = b.statusPemesanan === "dibatalkan";

                            return {
                                id: b.kodeBooking || b.id,
                                penyewa: b.pemesan?.fullName || "Pelanggan",
                                lapangan: b.tempat || b.lapangan || "-",
                                kategori: b.kategori || "-",
                                tanggal: b.tanggal || "-",
                                jam: b.jam || "-",
                                nominal: Number(b.total) || 0,
                                status: isBatal ? "Dibatalkan" : isLunas ? "Lunas" : "Menunggu",
                            };
                        });

                        setTransaksi(mapped);
                    }
                }
            } catch (err) {
                console.error("Gagal memuat data keuangan mitra:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchKeuangan();
    }, [router]);

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(angka || 0);

    const transaksiLunas = transaksi.filter((t) => t.status === "Lunas");
    const transaksiMenunggu = transaksi.filter((t) => t.status === "Menunggu");

    const nominalLunas = transaksiLunas.reduce((sum, t) => sum + t.nominal, 0);
    const nominalMenunggu = transaksiMenunggu.reduce(
        (sum, t) => sum + t.nominal,
        0
    );

    const saldoTampil = totalPendapatan > 0 ? totalPendapatan : nominalLunas;

    const daftarTampil =
        filterStatus === "Semua"
            ? transaksi
            : transaksi.filter((item) => item.status === filterStatus);

    const statusBadge = (status) => {
        if (status === "Lunas") {
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        }
        if (status === "Menunggu") {
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        }
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F7F9F7] px-4 py-8 text-[#202B25] dark:bg-[#111A15] dark:text-white sm:px-6 lg:px-10">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <Link
                                href="/mitra/dashboard"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#146B45] hover:underline dark:text-green-400"
                            >
                                ‹ {isEnglish ? "Back to Dashboard" : "Kembali ke Dashboard"}
                            </Link>

                            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                                {isEnglish ? "Partner Finances" : "Keuangan Mitra"}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish
                                    ? "Monitor venue revenue and booking payment history."
                                    : "Pantau pendapatan lapangan dan riwayat pembayaran dari penyewa."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                alert(
                                    isEnglish
                                        ? "Withdrawal simulation submitted! Funds will be processed to your registered bank account."
                                        : "Simulasi pencairan dana berhasil diajukan! Dana akan diproses ke rekening mitra terdaftar."
                                )
                            }
                            className="inline-flex items-center justify-center rounded-2xl bg-[#146B45] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#105638]"
                        >
                            {isEnglish ? "Withdraw Funds" : "Ajukan Pencairan Dana"}
                        </button>
                    </section>

                    {/* Ringkasan Saldo */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl bg-gradient-to-br from-[#146B45] to-[#238B5D] p-6 text-white shadow-lg">
                            <p className="text-sm text-white/80">
                                {isEnglish ? "Total Confirmed Revenue" : "Total Pendapatan Bersih"}
                            </p>
                            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                {formatRupiah(saldoTampil)}
                            </h2>
                            <p className="mt-2 text-xs text-white/75">
                                {isEnglish
                                    ? `From ${transaksiLunas.length} confirmed/completed bookings`
                                    : `Dari ${transaksiLunas.length} transaksi terkonfirmasi/selesai`}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish ? "Pending Verification" : "Menunggu Verifikasi"}
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400 sm:text-3xl">
                                {formatRupiah(nominalMenunggu)}
                            </h2>
                            <p className="mt-2 text-xs text-gray-400">
                                {isEnglish
                                    ? `${transaksiMenunggu.length} bookings awaiting confirmation`
                                    : `${transaksiMenunggu.length} pesanan menunggu konfirmasi`}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish ? "Total Transactions" : "Total Transaksi"}
                            </p>
                            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                {transaksi.length}
                            </h2>
                            <p className="mt-2 text-xs text-[#219653] dark:text-green-400">
                                {isEnglish
                                    ? "Synced with Supabase database"
                                    : "Tersinkronisasi dengan database"}
                            </p>
                        </div>
                    </section>

                    {/* Riwayat Pemasukan */}
                    <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:p-6">
                            <div>
                                <h2 className="font-bold">
                                    {isEnglish ? "Revenue History" : "Rincian Pemasukan Booking"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {isEnglish
                                        ? "List of transactions from your venues."
                                        : "Daftar transaksi masuk dari lapangan milikmu."}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {["Semua", "Lunas", "Menunggu", "Dibatalkan"].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFilterStatus(status)}
                                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${filterStatus === status
                                            ? "bg-[#146B45] text-white"
                                            : "bg-gray-100 text-gray-500 hover:bg-[#EAF5EF] hover:text-[#146B45] dark:bg-white/10 dark:text-gray-300"
                                            }`}
                                    >
                                        {isEnglish
                                            ? {
                                                Semua: "All",
                                                Lunas: "Paid",
                                                Menunggu: "Pending",
                                                Dibatalkan: "Cancelled",
                                            }[status]
                                            : status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto p-5 sm:p-6">
                            {isLoading ? (
                                <p className="py-10 text-center text-sm text-gray-400">
                                    {isEnglish
                                        ? "Loading financial data..."
                                        : "Memuat data keuangan..."}
                                </p>
                            ) : (
                                <table className="w-full min-w-[720px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs text-gray-400 dark:border-white/10">
                                            <th className="pb-4 font-medium">ID Booking</th>
                                            <th className="pb-4 font-medium">
                                                {isEnglish ? "Customer" : "Penyewa"}
                                            </th>
                                            <th className="pb-4 font-medium">
                                                {isEnglish ? "Venue" : "Lapangan"}
                                            </th>
                                            <th className="pb-4 font-medium">
                                                {isEnglish ? "Schedule" : "Jadwal Main"}
                                            </th>
                                            <th className="pb-4 font-medium">
                                                {isEnglish ? "Amount" : "Nominal"}
                                            </th>
                                            <th className="pb-4 font-medium">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {daftarTampil.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-gray-50 last:border-0 dark:border-white/5"
                                            >
                                                <td className="py-4 font-semibold text-[#146B45] dark:text-green-400">
                                                    {item.id}
                                                </td>
                                                <td className="py-4 font-medium">{item.penyewa}</td>
                                                <td className="py-4">
                                                    <p className="font-medium">{item.lapangan}</p>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {item.kategori}
                                                    </p>
                                                </td>
                                                <td className="py-4">
                                                    <p>{item.tanggal}</p>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {item.jam}
                                                    </p>
                                                </td>
                                                <td className="py-4 font-semibold">
                                                    {formatRupiah(item.nominal)}
                                                </td>
                                                <td className="py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusBadge(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}

                                        {daftarTampil.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="py-10 text-center text-sm text-gray-400"
                                                >
                                                    {isEnglish
                                                        ? "No financial records found."
                                                        : "Belum ada data transaksi untuk filter ini."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}