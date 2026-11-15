"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

export default function MitraJadwalPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [lapanganList, setLapanganList] = useState([]);
    const [blokirList, setBlokirList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [pesanSukses, setPesanSukses] = useState("");
    const [pesanError, setPesanError] = useState("");

    // Form blokir
    const [selectedLapangan, setSelectedLapangan] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [jamMulai, setJamMulai] = useState("08:00");
    const [jamSelesai, setJamSelesai] = useState("12:00");
    const [alasan, setAlasan] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            const [venuesRes, blocksRes] = await Promise.all([
                apiRequest("/mitra/lapangan"),
                apiRequest("/mitra/blokir-jadwal"),
            ]);

            if (venuesRes.success) {
                setLapanganList(venuesRes.data || []);
                if (venuesRes.data?.length > 0 && !selectedLapangan) {
                    setSelectedLapangan(venuesRes.data[0].id);
                }
            }

            if (blocksRes.success) {
                setBlokirList(blocksRes.data || []);
            }
        } catch (err) {
            setPesanError(err.message || "Gagal memuat data jadwal.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("sportify_role");

        if (!token) {
            router.replace("/login?redirect=%2Fmitra%2Fjadwal");
            return;
        }

        if (role && !["mitra", "pemilik", "owner", "admin"].includes(role.toLowerCase())) {
            router.replace("/profile");
            return;
        }

        // Set default tanggal besok
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setTanggal(tomorrow.toISOString().split("T")[0]);

        loadData();
    }, [router]);

    const handleTambahBlokir = async (e) => {
        e.preventDefault();
        setPesanSukses("");
        setPesanError("");

        if (!selectedLapangan) {
            setPesanError("Pilih lapangan terlebih dahulu.");
            return;
        }
        if (!tanggal || !jamMulai || !jamSelesai || !alasan.trim()) {
            setPesanError("Semua kolom formulir blokir jadwal wajib diisi.");
            return;
        }
        if (jamSelesai <= jamMulai) {
            setPesanError("Jam selesai harus lebih besar dari jam mulai.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await apiRequest("/mitra/blokir-jadwal", {
                method: "POST",
                body: JSON.stringify({
                    lapangan_id: selectedLapangan,
                    tanggal,
                    jam_mulai: jamMulai,
                    jam_selesai: jamSelesai,
                    alasan: alasan.trim(),
                }),
            });

            if (res.success) {
                setPesanSukses("Slot jadwal berhasil diblokir. Jadwal ini tidak dapat dipesan oleh penyewa.");
                setAlasan("");
                await loadData();
            }
        } catch (err) {
            setPesanError(err.message || "Gagal memblokir jadwal.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleHapusBlokir = async (id) => {
        if (!confirm("Buka kembali slot jadwal ini untuk penyewa?")) return;

        try {
            setPesanSukses("");
            setPesanError("");
            const res = await apiRequest(`/mitra/blokir-jadwal/${id}`, {
                method: "DELETE",
            });

            if (res.success) {
                setPesanSukses("Blokir jadwal berhasil dihapus.");
                await loadData();
            }
        } catch (err) {
            setPesanError(err.message || "Gagal menghapus blokir jadwal.");
        }
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F7F9F7] px-4 py-8 text-[#202B25] dark:bg-[#111A15] dark:text-white sm:px-6 lg:px-10">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <div>
                        <div className="mb-2">
                            <Link
                                href="/mitra/dashboard"
                                className="text-xs font-semibold text-[#146B45] hover:underline dark:text-green-400"
                            >
                                &larr; {isEnglish ? "Back to Dashboard" : "Kembali ke Dashboard"}
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            {isEnglish ? "Schedule & Slot Maintenance" : "Kelola Jadwal & Blokir Slot"}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {isEnglish
                                ? "Block field slots for maintenance, tournament, or internal events."
                                : "Tutup sementara slot jam tertentu untuk pemeliharaan lapangan, reservasi offline, atau libur."}
                        </p>
                    </div>

                    {/* Notifikasi */}
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

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Formulir Blokir Slot */}
                        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] lg:col-span-1">
                            <h2 className="text-lg font-bold">
                                {isEnglish ? "Block Field Slot" : "Blokir Slot Jam"}
                            </h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Slot yang diblokir otomatis tidak akan bisa dipilih oleh penyewa.
                            </p>

                            <form onSubmit={handleTambahBlokir} className="mt-6 space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        Pilih Lapangan
                                    </label>
                                    <select
                                        value={selectedLapangan}
                                        onChange={(e) => setSelectedLapangan(e.target.value)}
                                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5"
                                        required
                                    >
                                        {lapanganList.map((lap) => (
                                            <option key={lap.id} value={lap.id} className="text-black">
                                                {lap.nama} ({lap.kategori?.join(", ")})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                            Jam Mulai
                                        </label>
                                        <input
                                            type="time"
                                            value={jamMulai}
                                            onChange={(e) => setJamMulai(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                            Jam Selesai
                                        </label>
                                        <input
                                            type="time"
                                            value={jamSelesai}
                                            onChange={(e) => setJamSelesai(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        Alasan Penutupan Slot
                                    </label>
                                    <input
                                        type="text"
                                        value={alasan}
                                        onChange={(e) => setAlasan(e.target.value)}
                                        placeholder="Contoh: Perawatan rumput, Perbaikan lampu"
                                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="mt-2 w-full rounded-xl bg-[#146B45] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#105638] disabled:opacity-50"
                                >
                                    {submitting ? "Memproses..." : "Terapkan Blokir Slot"}
                                </button>
                            </form>
                        </div>

                        {/* Daftar Slot Terblokir */}
                        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] lg:col-span-2">
                            <h2 className="text-lg font-bold">
                                {isEnglish ? "Active Blocked Schedules" : "Daftar Slot Diblokir"}
                            </h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Jadwal di bawah ini saat ini ditutup dan diabaikan dari ketersediaan publik.
                            </p>

                            {loading ? (
                                <div className="py-16 text-center text-sm text-gray-500">
                                    Memuat daftar jadwal blokir...
                                </div>
                            ) : blokirList.length === 0 ? (
                                <div className="py-16 text-center text-sm text-gray-400">
                                    Belum ada jadwal yang diblokir. Semua slot lapangan terbuka sesuai jam operasional.
                                </div>
                            ) : (
                                <div className="mt-5 divide-y divide-gray-100 dark:divide-white/5">
                                    {blokirList.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                                        >
                                            <div>
                                                <div className="font-semibold text-[#146B45] dark:text-green-400">
                                                    {item.lapangan?.nama || "Lapangan"}
                                                </div>
                                                <div className="mt-0.5 text-sm font-medium">
                                                    {item.tanggal} • {item.jam_mulai?.slice(0, 5)} - {item.jam_selesai?.slice(0, 5)} WIB
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    Alasan: <span className="italic">{item.alasan}</span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleHapusBlokir(item.id)}
                                                className="self-start rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 sm:self-center"
                                            >
                                                Buka Kembali
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

