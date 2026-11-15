"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest, getBuktiBayarSignedUrl } from "@/lib/api";

export default function MitraBookingPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [actionLoading, setActionLoading] = useState(null);
    const [previewBukti, setPreviewBukti] = useState(null);
    const [pesanSukses, setPesanSukses] = useState("");
    const [pesanError, setPesanError] = useState("");

    const loadBookings = async () => {
        try {
            setLoading(true);
            const res = await apiRequest("/booking");
            if (res.success && Array.isArray(res.data)) {
                setBookings(res.data);
            }
        } catch (err) {
            setPesanError(err.message || "Gagal memuat data pemesanan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("sportify_role");

        if (!token) {
            router.replace("/login?redirect=%2Fmitra%2Fbooking");
            return;
        }

        if (role && !["mitra", "pemilik", "owner", "admin"].includes(role.toLowerCase())) {
            router.replace("/profile");
            return;
        }

        loadBookings();
    }, [router]);

    const handleUpdateStatus = async (bookingId, statusBaru, pembayaranBaru) => {
        try {
            setActionLoading(bookingId);
            setPesanSukses("");
            setPesanError("");

            const body = {
                status_pemesanan: statusBaru,
            };
            if (pembayaranBaru) {
                body.status_pembayaran = pembayaranBaru;
            }

            const res = await apiRequest(`/booking/${bookingId}`, {
                method: "PATCH",
                body: JSON.stringify(body),
            });

            if (res.success) {
                setPesanSukses(`Pemesanan ${res.data?.kodeBooking || ""} berhasil diperbarui.`);
                await loadBookings();
            }
        } catch (err) {
            setPesanError(err.message || "Gagal memperbarui status pemesanan.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleLihatBukti = async (path) => {
        if (!path) return;
        try {
            const signedUrl = await getBuktiBayarSignedUrl(path);
            if (signedUrl) {
                setPreviewBukti(signedUrl);
            } else {
                alert("Bukti pembayaran tidak dapat dibuka atau telah kedaluwarsa.");
            }
        } catch {
            alert("Gagal memuat bukti pembayaran.");
        }
    };

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(angka || 0);

    const filteredBookings = bookings.filter((b) => {
        if (filterStatus === "Semua") return true;
        if (filterStatus === "Menunggu") return b.statusPemesanan === "menunggu_konfirmasi" || b.statusBooking === "Pending";
        if (filterStatus === "Dikonfirmasi") return b.statusPemesanan === "dikonfirmasi" || b.statusBooking === "Confirmed";
        if (filterStatus === "Selesai") return b.statusPemesanan === "selesai" || b.statusBooking === "Completed";
        if (filterStatus === "Dibatalkan") return b.statusPemesanan === "dibatalkan" || b.statusBooking === "Cancelled";
        return true;
    });

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F7F9F7] px-4 py-8 text-[#202B25] dark:bg-[#111A15] dark:text-white sm:px-6 lg:px-10">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <Link
                                    href="/mitra/dashboard"
                                    className="text-xs font-semibold text-[#146B45] hover:underline dark:text-green-400"
                                >
                                    &larr; {isEnglish ? "Back to Dashboard" : "Kembali ke Dashboard"}
                                </Link>
                            </div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {isEnglish ? "Booking Verification & Management" : "Verifikasi & Kelola Pemesanan"}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish
                                    ? "Review customer reservations, verify payments, and update schedules."
                                    : "Tinjau reservasi pelanggan, verifikasi bukti pembayaran, dan konfirmasi jadwal."}
                            </p>
                        </div>

                        <button
                            onClick={loadBookings}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5"
                        >
                            <span>↻</span>
                            {loading ? "Memuat..." : "Segarkan Data"}
                        </button>
                    </div>

                    {/* Notifikasi Pesan */}
                    {pesanSukses && (
                        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800/40 dark:bg-green-950/30 dark:text-green-400">
                            {pesanSukses}
                        </div>
                    )}
                    {pesanError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-400">
                            {pesanError}
                        </div>
                    )}

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {["Semua", "Menunggu", "Dikonfirmasi", "Selesai", "Dibatalkan"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${filterStatus === status
                                    ? "bg-[#146B45] text-white shadow-sm"
                                    : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-300"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Daftar Booking */}
                    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                                <p className="mt-4 text-sm text-gray-500">Memuat data pemesanan dari database...</p>
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="py-20 text-center">
                                <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                                    Tidak ada data pemesanan
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Pemesanan untuk kategori filter ini belum tersedia.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs text-gray-400 dark:border-white/10">
                                            <th className="p-5 font-medium">ID & Pemesan</th>
                                            <th className="p-5 font-medium">Lapangan</th>
                                            <th className="p-5 font-medium">Jadwal Main</th>
                                            <th className="p-5 font-medium">Total & Pembayaran</th>
                                            <th className="p-5 font-medium">Status Sewa</th>
                                            <th className="p-5 text-right font-medium">Aksi Verifikasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBookings.map((b) => {
                                            const isPending = b.statusPemesanan === "menunggu_konfirmasi" || b.statusBooking === "Pending";
                                            const isConfirmed = b.statusPemesanan === "dikonfirmasi" || b.statusBooking === "Confirmed";

                                            return (
                                                <tr
                                                    key={b.id}
                                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/[0.02]"
                                                >
                                                    <td className="p-5">
                                                        <div className="font-bold text-[#146B45] dark:text-green-400">
                                                            {b.kodeBooking || b.id}
                                                        </div>
                                                        <div className="mt-1 font-medium">{b.pemesan?.fullName || "Penyewa"}</div>
                                                        <div className="text-xs text-gray-400">{b.pemesan?.phone || b.pemesan?.email || ""}</div>
                                                    </td>

                                                    <td className="p-5">
                                                        <div className="font-semibold">{b.tempat}</div>
                                                        <div className="text-xs text-gray-400">{b.kategori}</div>
                                                    </td>

                                                    <td className="p-5">
                                                        <div className="font-medium">{b.tanggal}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {b.jam} ({b.durasi})
                                                        </div>
                                                    </td>

                                                    <td className="p-5">
                                                        <div className="font-bold text-[#146B45] dark:text-green-400">
                                                            {formatRupiah(b.total)}
                                                        </div>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <span
                                                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${b.statusBayarDb === "lunas" || b.statusPembayaran === "Paid"
                                                                    ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                                                                    }`}
                                                            >
                                                                {b.statusPembayaran}
                                                            </span>

                                                            {b.buktiBayarPath && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleLihatBukti(b.buktiBayarPath)}
                                                                    className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                                >
                                                                    [Lihat Bukti]
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="p-5">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${isConfirmed
                                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                                : isPending
                                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                                                    : b.statusPemesanan === "selesai"
                                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                                                        : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                                                                }`}
                                                        >
                                                            {b.statusPemesanan || b.statusBooking}
                                                        </span>
                                                    </td>

                                                    <td className="p-5 text-right">
                                                        <div className="flex flex-wrap items-center justify-end gap-2">
                                                            {isPending && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        disabled={actionLoading === b.id}
                                                                        onClick={() =>
                                                                            handleUpdateStatus(b.id, "dikonfirmasi", "lunas")
                                                                        }
                                                                        className="rounded-xl bg-[#146B45] px-3.5 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-[#105638] disabled:opacity-50"
                                                                    >
                                                                        Konfirmasi & Lunas
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        disabled={actionLoading === b.id}
                                                                        onClick={() =>
                                                                            handleUpdateStatus(b.id, "dibatalkan", "dibatalkan")
                                                                        }
                                                                        className="rounded-xl border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 disabled:opacity-50"
                                                                    >
                                                                        Tolak
                                                                    </button>
                                                                </>
                                                            )}

                                                            {isConfirmed && (
                                                                <button
                                                                    type="button"
                                                                    disabled={actionLoading === b.id}
                                                                    onClick={() => handleUpdateStatus(b.id, "selesai")}
                                                                    className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                                                >
                                                                    Tandai Selesai
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal Preview Bukti Bayar (Signed URL) */}
            {previewBukti && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() => setPreviewBukti(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-lg overflow-hidden rounded-3xl bg-white p-5 shadow-2xl dark:bg-[#1B2B22]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-white/10">
                            <h3 className="font-bold">Bukti Pembayaran (Privat)</h3>
                            <button
                                onClick={() => setPreviewBukti(null)}
                                className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-auto rounded-xl">
                            <img
                                src={previewBukti}
                                alt="Bukti Pembayaran"
                                className="h-auto w-full object-contain"
                            />
                        </div>

                        <div className="mt-4 text-center">
                            <a
                                href={previewBukti}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-[#146B45] hover:underline dark:text-green-400"
                            >
                                Buka di Tab Baru
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

