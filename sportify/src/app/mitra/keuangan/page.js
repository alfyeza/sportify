"use client";

import { useEffect, useState, useCallback } from "react";
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
    const [isAdmin, setIsAdmin] = useState(false);
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [transaksi, setTransaksi] = useState([]);
    const [riwayatPencairan, setRiwayatPencairan] = useState([]);
    const [ringkasan, setRingkasan] = useState({
        totalPendapatan: 0,
        totalDicairkan: 0,
        saldoTersedia: 0,
    });

    // State Modal Ajukan Pencairan Dana
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [pesanSukses, setPesanSukses] = useState("");
    const [payoutActionId, setPayoutActionId] = useState(null);
    const [formPencairan, setFormPencairan] = useState({
        jumlah: "",
        namaBank: "BCA",
        nomorRekening: "",
        namaPemilikRekening: "",
        catatan: "",
    });

    const loadKeuangan = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await apiRequest("/mitra/keuangan");
            if (res.success && res.data) {
                if (res.data.ringkasan) {
                    setRingkasan({
                        totalPendapatan: Number(res.data.ringkasan.totalPendapatan) || 0,
                        totalDicairkan: Number(res.data.ringkasan.totalDicairkan) || 0,
                        saldoTersedia: Number(res.data.ringkasan.saldoTersedia) || 0,
                    });
                }

                if (Array.isArray(res.data.riwayatTransaksi)) {
                    const mapped = res.data.riwayatTransaksi.map((b) => {
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

                if (Array.isArray(res.data.riwayatPencairan)) {
                    setRiwayatPencairan(res.data.riwayatPencairan);
                }
            }
        } catch (err) {
            console.error("Gagal memuat data keuangan mitra:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        let user = {};
        try {
            user = JSON.parse(localStorage.getItem("sportify_user") || "{}");
        } catch {
            user = {};
        }

        const role = (
            user.role ||
            localStorage.getItem("sportify_role") ||
            ""
        ).toLowerCase();

        if (!token) {
            router.replace("/login?redirect=%2Fmitra%2Fkeuangan");
            return;
        }

        if (role && !["mitra", "pemilik", "owner", "admin"].includes(role)) {
            router.replace("/profile");
            return;
        }

        setIsAdmin(role === "admin");
        if (user.fullName) {
            setFormPencairan((prev) => ({
                ...prev,
                namaPemilikRekening: prev.namaPemilikRekening || user.fullName,
            }));
        }

        loadKeuangan();
    }, [router, loadKeuangan]);

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(angka || 0);

    const handleAjukanPencairan = async (e) => {
        e.preventDefault();
        setFormError("");
        setPesanSukses("");

        const nominal = Number(formPencairan.jumlah);
        if (!nominal || nominal < 50000) {
            setFormError(
                isEnglish
                    ? "Minimum withdrawal amount is Rp 50.000."
                    : "Minimal pengajuan pencairan dana adalah Rp 50.000."
            );
            return;
        }

        if (ringkasan.saldoTersedia > 0 && nominal > ringkasan.saldoTersedia) {
            setFormError(
                isEnglish
                    ? "Withdrawal amount exceeds available balance."
                    : "Nominal pengajuan melebihi saldo tersedia."
            );
            return;
        }

        try {
            setSubmitting(true);
            const res = await apiRequest("/mitra/pencairan", {
                method: "POST",
                body: JSON.stringify(formPencairan),
            });

            if (res.success) {
                setShowModal(false);
                setFormPencairan((prev) => ({
                    ...prev,
                    jumlah: "",
                    catatan: "",
                }));
                setPesanSukses(
                    isEnglish
                        ? "Withdrawal request submitted successfully!"
                        : "Pengajuan pencairan dana berhasil dikirim dan menunggu proses!"
                );
                await loadKeuangan();
            }
        } catch (err) {
            setFormError(err.message || "Gagal mengajukan pencairan dana.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatusPencairan = async (id, statusBaru) => {
        try {
            setPayoutActionId(id);
            setPesanSukses("");
            await apiRequest(`/mitra/pencairan/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: statusBaru }),
            });
            setPesanSukses(
                statusBaru === "selesai"
                    ? "Pencairan dana telah ditandai selesai."
                    : "Pengajuan pencairan dana ditolak."
            );
            await loadKeuangan();
        } catch (err) {
            alert(err.message || "Gagal memperbarui status pencairan.");
        } finally {
            setPayoutActionId(null);
        }
    };

    const transaksiLunas = transaksi.filter((t) => t.status === "Lunas");
    const transaksiMenunggu = transaksi.filter((t) => t.status === "Menunggu");
    const nominalMenunggu = transaksiMenunggu.reduce((sum, t) => sum + t.nominal, 0);

    const daftarTampil =
        filterStatus === "Semua"
            ? transaksi
            : transaksi.filter((item) => item.status === filterStatus);

    const statusBadge = (status) => {
        if (status === "Lunas" || status === "selesai") {
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        }
        if (status === "Menunggu" || status === "menunggu_proses") {
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
                                {isAdmin
                                    ? isEnglish
                                        ? "Platform Finances & Payouts (Admin)"
                                        : "Keuangan & Pencairan Dana (Admin)"
                                    : isEnglish
                                        ? "Partner Finances"
                                        : "Keuangan Mitra"}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish
                                    ? "Monitor venue revenue and submit fund withdrawal requests."
                                    : "Pantau pendapatan lapangan, saldo tersedia, dan ajukan pencairan dana."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setFormError("");
                                setShowModal(true);
                            }}
                            className="inline-flex items-center justify-center rounded-2xl bg-[#146B45] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#105638]"
                        >
                            {isEnglish ? "Request Withdrawal" : "Ajukan Pencairan Dana"}
                        </button>
                    </section>

                    {pesanSukses && (
                        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800 dark:border-green-800/40 dark:bg-green-950/30 dark:text-green-400">
                            {pesanSukses}
                        </div>
                    )}

                    {/* Ringkasan Saldo */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl bg-gradient-to-br from-[#146B45] to-[#238B5D] p-6 text-white shadow-lg">
                            <p className="text-sm text-white/80">
                                {isEnglish ? "Available Balance" : "Saldo Tersedia untuk Dicairkan"}
                            </p>
                            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                {formatRupiah(ringkasan.saldoTersedia)}
                            </h2>
                            <p className="mt-2 text-xs text-white/75">
                                {isEnglish
                                    ? `Total revenue: ${formatRupiah(ringkasan.totalPendapatan)}`
                                    : `Total pendapatan bersih: ${formatRupiah(ringkasan.totalPendapatan)}`}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish ? "Total Withdrawn" : "Total Dana Dicairkan"}
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-[#146B45] dark:text-green-400 sm:text-3xl">
                                {formatRupiah(ringkasan.totalDicairkan)}
                            </h2>
                            <p className="mt-2 text-xs text-gray-400">
                                {isEnglish
                                    ? `${riwayatPencairan.length} withdrawal requests`
                                    : `${riwayatPencairan.length} riwayat pengajuan pencairan`}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish ? "Total Transactions" : "Total Transaksi Masuk"}
                            </p>
                            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                {transaksiLunas.length}
                            </h2>
                            <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                                {nominalMenunggu > 0
                                    ? `Menunggu verifikasi: ${formatRupiah(nominalMenunggu)}`
                                    : isEnglish
                                        ? "Synced with Supabase database"
                                        : "Tersinkronisasi dengan database"}
                            </p>
                        </div>
                    </section>

                    {/* Riwayat Pengajuan Pencairan Dana */}
                    <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="border-b border-gray-100 p-5 dark:border-white/10 sm:p-6">
                            <h2 className="font-bold">
                                {isEnglish ? "Withdrawal History" : "Riwayat Pengajuan Pencairan Dana"}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish
                                    ? "Track fund disbursement status to partner bank accounts."
                                    : "Pantau status pencairan dana ke rekening bank mitra."}
                            </p>
                        </div>

                        <div className="overflow-x-auto p-5 sm:p-6">
                            {riwayatPencairan.length === 0 ? (
                                <p className="py-6 text-center text-sm text-gray-400">
                                    {isEnglish
                                        ? "No withdrawal requests submitted yet."
                                        : "Belum ada riwayat pengajuan pencairan dana."}
                                </p>
                            ) : (
                                <table className="w-full min-w-[720px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs text-gray-400 dark:border-white/10">
                                            <th className="pb-4 font-medium">Tanggal</th>
                                            <th className="pb-4 font-medium">Rekening Tujuan</th>
                                            <th className="pb-4 font-medium">Nominal</th>
                                            <th className="pb-4 font-medium">Status</th>
                                            {isAdmin && (
                                                <th className="pb-4 text-right font-medium">Aksi Admin</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riwayatPencairan.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-gray-50 last:border-0 dark:border-white/5"
                                            >
                                                <td className="py-4">
                                                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td className="py-4">
                                                    <p className="font-semibold">
                                                        {item.nama_bank} - {item.nomor_rekening}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        a.n. {item.nama_pemilik_rekening}
                                                    </p>
                                                </td>
                                                <td className="py-4 font-bold text-[#146B45] dark:text-green-400">
                                                    {formatRupiah(item.jumlah)}
                                                </td>
                                                <td className="py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status === "menunggu_proses"
                                                            ? "Menunggu Proses"
                                                            : item.status === "selesai"
                                                                ? "Selesai Dicairkan"
                                                                : "Ditolak"}
                                                    </span>
                                                </td>
                                                {isAdmin && (
                                                    <td className="py-4 text-right">
                                                        {item.status === "menunggu_proses" && (
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={payoutActionId === item.id}
                                                                    onClick={() =>
                                                                        handleUpdateStatusPencairan(item.id, "selesai")
                                                                    }
                                                                    className="rounded-xl bg-[#146B45] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#105638] disabled:opacity-50"
                                                                >
                                                                    Tandai Cair
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    disabled={payoutActionId === item.id}
                                                                    onClick={() =>
                                                                        handleUpdateStatusPencairan(item.id, "ditolak")
                                                                    }
                                                                    className="rounded-xl border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                                >
                                                                    Tolak
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
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
                                        : "Daftar transaksi masuk dari lapangan."}
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

            {/* Modal Form Ajukan Pencairan Dana */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => !submitting && setShowModal(false)}
                >
                    <div
                        className="w-full max-w-md rounded-3xl border border-white/50 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#17221B]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-white/10">
                            <h3 className="text-lg font-bold">
                                {isEnglish ? "Request Fund Withdrawal" : "Ajukan Pencairan Dana"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="rounded-full bg-gray-100 px-2.5 py-1 text-sm text-gray-500 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-4 rounded-2xl bg-[#EAF5EF] p-3.5 text-xs text-[#146B45] dark:bg-green-900/20 dark:text-green-400">
                            Saldo Tersedia: <strong>{formatRupiah(ringkasan.saldoTersedia)}</strong> (Minimal penarikan Rp 50.000)
                        </div>

                        {formError && (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleAjukanPencairan} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold">
                                    Nominal Pencairan (Rp) *
                                </label>
                                <input
                                    type="number"
                                    min="50000"
                                    required
                                    value={formPencairan.jumlah}
                                    onChange={(e) =>
                                        setFormPencairan({ ...formPencairan, jumlah: e.target.value })
                                    }
                                    placeholder="Contoh: 500000"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#146B45] dark:border-white/10 dark:bg-white/5"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold">
                                        Bank Tujuan *
                                    </label>
                                    <select
                                        value={formPencairan.namaBank}
                                        onChange={(e) =>
                                            setFormPencairan({ ...formPencairan, namaBank: e.target.value })
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#146B45] dark:border-white/10 dark:bg-white/5"
                                    >
                                        <option value="BCA">BCA</option>
                                        <option value="BNI">BNI</option>
                                        <option value="BRI">BRI</option>
                                        <option value="Mandiri">Mandiri</option>
                                        <option value="BSI">BSI</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold">
                                        Nomor Rekening *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formPencairan.nomorRekening}
                                        onChange={(e) =>
                                            setFormPencairan({
                                                ...formPencairan,
                                                nomorRekening: e.target.value,
                                            })
                                        }
                                        placeholder="1234567890"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#146B45] dark:border-white/10 dark:bg-white/5"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold">
                                    Nama Pemilik Rekening *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formPencairan.namaPemilikRekening}
                                    onChange={(e) =>
                                        setFormPencairan({
                                            ...formPencairan,
                                            namaPemilikRekening: e.target.value,
                                        })
                                    }
                                    placeholder="Nama sesuai buku tabungan"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#146B45] dark:border-white/10 dark:bg-white/5"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold">
                                    Catatan (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={formPencairan.catatan}
                                    onChange={(e) =>
                                        setFormPencairan({ ...formPencairan, catatan: e.target.value })
                                    }
                                    placeholder="Keterangan tambahan"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#146B45] dark:border-white/10 dark:bg-white/5"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 rounded-xl bg-[#146B45] py-2.5 text-sm font-semibold text-white hover:bg-[#105638] disabled:opacity-50"
                                >
                                    {submitting ? "Mengirim..." : "Kirim Pengajuan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}