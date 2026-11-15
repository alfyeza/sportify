"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import { apiRequest } from "@/lib/api";

export default function DetailLapanganMitraPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [lapangan, setLapangan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(
            localStorage.getItem("sportify_user") || "null"
        );
        const role = localStorage.getItem("sportify_role") || user?.role;

        if (!token) {
            router.replace("/login?redirect=%2Fmitra%2Flapangan");
            return;
        }

        if (role !== "mitra") {
            router.replace("/profile");
            return;
        }

        fetchLapangan();
    }, [id]);

    const fetchLapangan = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest(`/mitra/lapangan/${id}`);

            const data =
                response?.data?.lapangan ||
                response?.data ||
                response?.lapangan ||
                response;

            if (!data || !data.id) {
                throw new Error("Data lapangan tidak ditemukan.");
            }

            setLapangan(data);
        } catch (err) {
            console.error("Gagal mengambil detail lapangan:", err);
            setError(err.message || "Gagal memuat detail lapangan.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Apakah kamu yakin ingin menghapus lapangan ini? Data yang dihapus tidak dapat dikembalikan."
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await apiRequest(`/mitra/lapangan/${id}`, {
                method: "DELETE",
            });

            alert("Lapangan berhasil dihapus.");
            router.push("/mitra/lapangan");
        } catch (err) {
            console.error("Gagal menghapus lapangan:", err);
            alert(err.message || "Gagal menghapus lapangan.");
        } finally {
            setDeleting(false);
        }
    };

    const formatRupiah = (harga) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(harga) || 0);
    };

    const kategori = Array.isArray(lapangan?.kategori)
        ? lapangan.kategori
        : lapangan?.kategori
            ? [lapangan.kategori]
            : [];

    const fotoLapangan = [
        lapangan?.gambar,
        ...(lapangan?.foto || []),
    ].filter(Boolean);

    const fasilitas = Array.isArray(lapangan?.fasilitas)
        ? lapangan.fasilitas
        : [];

    const unitLapangan = Array.isArray(lapangan?.unitLapangan)
        ? lapangan.unitLapangan
        : [];

    const status = lapangan?.status || "Aktif";

    const statusStyle = {
        Aktif: "bg-green-100 text-green-700",
        Menunggu: "bg-yellow-100 text-yellow-700",
        Ditolak: "bg-red-100 text-red-700",
        Nonaktif: "bg-gray-100 text-gray-600",
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-[#F7F9F7] dark:bg-[#111A15] flex items-center justify-center">
                    <LoadingState />
                </main>
                <Footer />
            </>
        );
    }

    if (error || !lapangan) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-[#F7F9F7] dark:bg-[#111A15] px-5 py-20">
                    <div className="max-w-2xl mx-auto text-center bg-white dark:bg-[#1B2920] rounded-3xl p-8 shadow-sm">
                        <div className="text-5xl mb-4">!</div>

                        <h1 className="text-xl font-bold text-[#202B25] dark:text-white">
                            Lapangan Tidak Ditemukan
                        </h1>

                        <p className="text-gray-500 mt-2">
                            {error || "Data lapangan tidak tersedia."}
                        </p>

                        <Link
                            href="/mitra/lapangan"
                            className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#146B45] text-white font-semibold hover:bg-[#105638] transition"
                        >
                            Kembali ke Kelola Lapangan
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F7F9F7] dark:bg-[#111A15] py-8 md:py-12">
                <div className="max-w-6xl mx-auto px-4 md:px-6">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <Link
                                href="/mitra/lapangan"
                                className="text-sm text-[#146B45] dark:text-[#7ED6A7] font-semibold hover:underline"
                            >
                                &lt; Kembali ke Kelola Lapangan
                            </Link>

                            <h1 className="text-2xl md:text-3xl font-bold text-[#202B25] dark:text-white mt-3">
                                Detail Lapangan
                            </h1>

                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Informasi lengkap lapangan yang kamu kelola.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={`/mitra/lapangan/${id}/edit`}
                                className="flex-1 sm:flex-none text-center px-5 py-3 rounded-xl bg-[#146B45] text-white font-semibold hover:bg-[#105638] transition"
                            >
                                Edit Lapangan
                            </Link>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50 transition"
                            >
                                {deleting ? "Menghapus..." : "Hapus"}
                            </button>
                        </div>
                    </div>

                    {/* INFORMASI UTAMA */}
                    <section className="bg-white dark:bg-[#1B2920] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 mb-6">

                        <div className="relative h-64 md:h-96 bg-gray-100 dark:bg-gray-800">
                            {lapangan.gambar ? (
                                <img
                                    src={lapangan.gambar}
                                    alt={lapangan.nama}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Tidak ada foto lapangan
                                </div>
                            )}

                            <div className="absolute top-5 left-5">
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-bold ${statusStyle[status] ||
                                        "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#202B25] dark:text-white">
                                        {lapangan.nama}
                                    </h2>

                                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                                        {lapangan.lokasi || "-"}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {kategori.map((item, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 rounded-full bg-[#EAF5EF] dark:bg-[#263D30] text-[#146B45] dark:text-[#9BE0B7] text-sm font-semibold"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#EAF5EF] dark:bg-[#263D30] rounded-2xl p-5 min-w-[190px]">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Harga Sewa
                                    </p>

                                    <p className="text-2xl font-bold text-[#146B45] dark:text-[#9BE0B7] mt-1">
                                        {formatRupiah(lapangan.harga)}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        per Sesi
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* LOKASI */}
                    <section className="bg-white dark:bg-[#1B2920] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                        <h2 className="text-xl font-bold text-[#202B25] dark:text-white mb-5">
                            Informasi Lokasi
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Kota / Lokasi
                                </p>
                                <p className="font-semibold text-[#202B25] dark:text-white mt-1">
                                    {lapangan.lokasi || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Alamat Lengkap
                                </p>
                                <p className="font-semibold text-[#202B25] dark:text-white mt-1">
                                    {lapangan.alamat || "-"}
                                </p>
                            </div>

                            {lapangan.mapsUrl && (
                                <a
                                    href={lapangan.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#146B45] dark:text-[#7ED6A7] font-semibold hover:underline"
                                >
                                    Buka Google Maps &gt;
                                </a>
                            )}
                        </div>
                    </section>

                    {/* DESKRIPSI */}
                    <section className="bg-white dark:bg-[#1B2920] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                        <h2 className="text-xl font-bold text-[#202B25] dark:text-white mb-4">
                            Deskripsi Lapangan
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {lapangan.deskripsi || "Belum ada deskripsi lapangan."}
                        </p>
                    </section>

                    {/* FASILITAS */}
                    <section className="bg-white dark:bg-[#1B2920] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                        <h2 className="text-xl font-bold text-[#202B25] dark:text-white mb-5">
                            Fasilitas
                        </h2>

                        {fasilitas.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {fasilitas.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-[#F7F9F7] dark:bg-[#243329]"
                                    >
                                        <span className="text-[#146B45] dark:text-[#7ED6A7]">
                                            ✓
                                        </span>
                                        <span className="text-sm font-medium text-[#202B25] dark:text-gray-200">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Belum ada fasilitas.</p>
                        )}
                    </section>

                    {/* GALERI FOTO */}
                    <section className="bg-white dark:bg-[#1B2920] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                        <h2 className="text-xl font-bold text-[#202B25] dark:text-white mb-5">
                            Galeri Foto
                        </h2>

                        {fotoLapangan.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {fotoLapangan.map((foto, index) => (
                                    <div
                                        key={index}
                                        className="h-40 md:h-52 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                                    >
                                        <img
                                            src={foto}
                                            alt={`${lapangan.nama} - Foto ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Belum ada foto tambahan.</p>
                        )}
                    </section>

                    {/* UNIT LAPANGAN */}
                    <section className="bg-white dark:bg-[#1B2920] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                        <h2 className="text-xl font-bold text-[#202B25] dark:text-white mb-5">
                            Unit Lapangan
                        </h2>

                        {unitLapangan.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {unitLapangan.map((unit, index) => (
                                    <div
                                        key={unit.id || index}
                                        className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
                                    >
                                        <div className="h-40 bg-gray-100 dark:bg-gray-800">
                                            {unit.gambar ? (
                                                <img
                                                    src={unit.gambar}
                                                    alt={unit.nama}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-gray-400">
                                                    Tidak ada foto
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <p className="font-bold text-[#202B25] dark:text-white">
                                                {unit.nama || `Unit ${index + 1}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                Belum ada unit lapangan.
                            </p>
                        )}
                    </section>

                    {/* RATING */}
                    <section className="bg-white dark:bg-[#1B2920] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
                        <h2 className="text-xl font-bold text-[#202B25] dark:text-white mb-5">
                            Rating dan Ulasan
                        </h2>

                        <div className="flex items-center gap-4 mb-5">
                            <div className="text-4xl font-bold text-[#146B45] dark:text-[#9BE0B7]">
                                {Number(lapangan.rating || 0).toFixed(1)}
                            </div>

                            <div>
                                <p className="text-yellow-500 text-xl">
                                    {"★".repeat(Math.round(lapangan.rating || 0))}
                                    {"☆".repeat(5 - Math.round(lapangan.rating || 0))}
                                </p>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {lapangan.jumlahRating || 0} penilaian
                                </p>
                            </div>
                        </div>

                        {lapangan.ulasan?.length > 0 ? (
                            <div className="space-y-4">
                                {lapangan.ulasan.map((ulasan, index) => (
                                    <div
                                        key={ulasan.id || index}
                                        className="p-4 rounded-2xl bg-[#F7F9F7] dark:bg-[#243329]"
                                    >
                                        <div className="flex justify-between gap-3">
                                            <p className="font-semibold text-[#202B25] dark:text-white">
                                                {ulasan.nama || ulasan.userName || "Pengguna"}
                                            </p>

                                            <span className="text-yellow-500">
                                                {"★".repeat(
                                                    Math.min(5, Math.max(0, Number(ulasan.rating) || 0))
                                                )}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                            {ulasan.komentar || ulasan.ulasan || ulasan.review || "-"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                Belum ada ulasan untuk lapangan ini.
                            </p>
                        )}
                    </section>

                    {/* TOMBOL KEMBALI */}
                    <div className="flex justify-end">
                        <Link
                            href="/mitra/lapangan"
                            className="px-6 py-3 rounded-xl bg-[#146B45] text-white font-semibold hover:bg-[#105638] transition"
                        >
                            Kembali ke Kelola Lapangan
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
}