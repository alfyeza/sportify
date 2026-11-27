"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

export default function DetailLapanganMitraPage() {
    const params = useParams();
    const id = params?.id;
    const router = useRouter();
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [venue, setVenue] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchDetail = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError("");
        try {
            const res = await apiRequest(`/mitra/lapangan/${id}`);
            if (res.success && res.data) {
                setVenue(res.data);
            } else {
                throw new Error(isEnglish ? "Venue not found." : "Data lapangan tidak ditemukan.");
            }
        } catch (err) {
            setError(err.message || (isEnglish ? "Failed to load venue details." : "Gagal memuat detail lapangan."));
        } finally {
            setLoading(false);
        }
    }, [id, isEnglish]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace(`/login?redirect=%2Fmitra%2Flapangan%2F${id}`);
            return;
        }

        let user = {};
        try {
            user = JSON.parse(localStorage.getItem("sportify_user") || "{}");
        } catch {
            user = {};
        }

        const role = (user.role || localStorage.getItem("sportify_role") || "").toLowerCase();
        if (!["mitra", "pemilik", "owner", "admin"].includes(role)) {
            router.replace("/profile");
            return;
        }

        setIsAdmin(role === "admin");
        fetchDetail();
    }, [id, router, fetchDetail]);

    const handleUpdateStatus = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            await apiRequest(`/mitra/lapangan/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            });
            setVenue((prev) => (prev ? { ...prev, status: newStatus } : prev));
        } catch (err) {
            alert(err.message || "Gagal memperbarui status lapangan.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const formatRupiah = (price) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(price) || 0);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F9F9F9] px-4 py-8 text-[#333333] dark:bg-[#1A1A1A] dark:text-white sm:px-6 lg:px-10">
                <div className="mx-auto max-w-4xl space-y-6">
                    <Link
                        href="/mitra/lapangan"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E85002] hover:underline dark:text-green-400"
                    >
                        &larr; {isEnglish ? "Back to Venue List" : "Kembali ke Daftar Lapangan"}
                    </Link>

                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-900/10">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={fetchDetail}
                                className="mt-4 rounded-xl bg-[#E85002] px-5 py-2.5 text-sm font-semibold text-white"
                            >
                                {isEnglish ? "Try Again" : "Coba Lagi"}
                            </button>
                        </div>
                    ) : venue ? (
                        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                            <div className="relative h-64 w-full bg-[#FFF4ED] dark:bg-green-900/20 sm:h-80">
                                <img
                                    src={venue.fotoUrl || venue.gambar || "/images/lapangan/default.jpg"}
                                    alt={venue.nama}
                                    className="h-full w-full object-cover"
                                />
                                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-[#E85002] shadow dark:bg-[#17221B] dark:text-green-400">
                                    Status: {venue.status}
                                </span>
                            </div>

                            <div className="space-y-6 p-6 sm:p-8">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold sm:text-3xl">{venue.nama}</h1>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            {venue.lokasi} &bull; {venue.alamat}
                                        </p>
                                    </div>

                                    <div className="sm:text-right">
                                        <p className="text-xs text-gray-400">
                                            {isEnglish ? "Price per session" : "Harga per Sesi"}
                                        </p>
                                        <p className="text-2xl font-bold text-[#E85002] dark:text-green-400">
                                            {formatRupiah(venue.harga)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {(venue.kategori || []).map((kat, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-full bg-[#FFF4ED] px-3.5 py-1.5 text-xs font-semibold text-[#E85002] dark:bg-green-900/30 dark:text-green-400"
                                        >
                                            {kat}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-white/[0.03] sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            {isEnglish ? "Operating Hours" : "Jam Operasional"}
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {(venue.jamBuka || "08:00").slice(0, 5)} - {(venue.jamTutup || "22:00").slice(0, 5)} WIB
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            {isEnglish ? "Facilities" : "Fasilitas"}
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            {venue.fasilitas?.length > 0 ? venue.fasilitas.join(", ") : "-"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                        {isEnglish ? "Description" : "Deskripsi Lapangan"}
                                    </h2>
                                    <p className="mt-2 text-sm leading-relaxed">
                                        {venue.deskripsi || (isEnglish ? "No description available." : "Belum ada deskripsi untuk lapangan ini.")}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5 dark:border-white/10">
                                    {isAdmin && (
                                        <>
                                            <button
                                                type="button"
                                                disabled={updatingStatus || venue.status === "aktif"}
                                                onClick={() => handleUpdateStatus("aktif")}
                                                className="rounded-xl bg-[#E85002] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C10801] disabled:opacity-40"
                                            >
                                                {isEnglish ? "Approve Venue" : "Verifikasi Aktif"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={updatingStatus || venue.status === "ditolak"}
                                                onClick={() => handleUpdateStatus("ditolak")}
                                                className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-40 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400"
                                            >
                                                {isEnglish ? "Reject" : "Tolak"}
                                            </button>
                                        </>
                                    )}

                                    <Link
                                        href={`/mitra/lapangan/${venue.id}/edit`}
                                        className="rounded-xl border border-[#E85002]/30 px-5 py-2.5 text-sm font-semibold text-[#E85002] transition hover:bg-[#FFF4ED] dark:border-green-400/30 dark:text-green-400"
                                    >
                                        {isEnglish ? "Edit Venue" : "Edit Lapangan"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>

            <Footer />
        </>
    );
}