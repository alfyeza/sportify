"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

function Icon({ name, size = 20 }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    const paths = {
        plus: <path d="M12 5v14m-7-7h14" />,
        search: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
            </>
        ),
        edit: (
            <>
                <path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16z" />
            </>
        ),
        trash: (
            <>
                <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />
                <path d="M10 11v5m4-5v5" />
            </>
        ),
        location: (
            <>
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </>
        ),
        court: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="1" />
                <path d="M12 3v18M3 12h18" />
            </>
        ),
        refresh: (
            <>
                <path d="M20 7v5h-5M4 17v-5h5" />
                <path d="M5.5 9a7 7 0 0 1 12-2L20 12M4 12l2.5 5a7 7 0 0 0 12-2" />
            </>
        ),
        arrow: <path d="m9 18 6-6-6-6" />,
        eye: (
            <>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
    };

    return <svg {...common}>{paths[name] || paths.court}</svg>;
}

function StatusBadge({ status, isEnglish }) {
    const normalized = (status || "").toLowerCase();

    let style =
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

    let label = isEnglish ? "Pending Verification" : "Menunggu Verifikasi";

    if (
        normalized.includes("aktif") ||
        normalized.includes("approved") ||
        normalized.includes("disetujui")
    ) {
        style =
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        label = isEnglish ? "Active" : "Aktif";
    } else if (
        normalized.includes("tolak") ||
        normalized.includes("rejected")
    ) {
        style =
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        label = isEnglish ? "Rejected" : "Ditolak";
    }

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${style}`}
        >
            {label}
        </span>
    );
}

export default function MitraLapanganPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchVenues = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const result = await apiRequest("/mitra/lapangan");

            const data = Array.isArray(result)
                ? result
                : result.data || result.venues || [];

            setVenues(data);
        } catch (err) {
            setError(
                err.message ||
                (isEnglish
                    ? "Failed to load venues."
                    : "Gagal memuat daftar lapangan.")
            );
        } finally {
            setLoading(false);
        }
    }, [isEnglish]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/login?redirect=%2Fmitra%2Flapangan");
            return;
        }

        let user = {};

        try {
            user = JSON.parse(
                localStorage.getItem("sportify_user") || "{}"
            );
        } catch {
            user = {};
        }

        const role = (
            user.role ||
            localStorage.getItem("sportify_role") ||
            ""
        ).toLowerCase();

        if (!["mitra", "pemilik", "owner"].includes(role)) {
            router.replace("/profile");
            return;
        }

        fetchVenues();
    }, [router, fetchVenues]);

    const filteredVenues = venues.filter((venue) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
            (venue.nama || "").toLowerCase().includes(keyword) ||
            (venue.lokasi || "").toLowerCase().includes(keyword) ||
            (Array.isArray(venue.kategori)
                ? venue.kategori.join(" ")
                : venue.kategori || ""
            )
                .toLowerCase()
                .includes(keyword);

        const status = (venue.status || "").toLowerCase();

        const matchesStatus =
            filterStatus === "Semua" ||
            (filterStatus === "Aktif" &&
                (status.includes("aktif") ||
                    status.includes("approved") ||
                    status.includes("disetujui"))) ||
            (filterStatus === "Menunggu" &&
                (status.includes("menunggu") ||
                    status.includes("pending"))) ||
            (filterStatus === "Ditolak" &&
                (status.includes("tolak") ||
                    status.includes("rejected")));

        return matchesSearch && matchesStatus;
    });

    const formatRupiah = (price) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(price) || 0);

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setDeleting(true);

        try {
            await apiRequest(`/mitra/lapangan/${deleteTarget.id}`, {
                method: "DELETE",
            });

            setVenues((previous) =>
                previous.filter((venue) => venue.id !== deleteTarget.id)
            );

            setDeleteTarget(null);
        } catch (err) {
            alert(err.message || "Gagal menghapus lapangan.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F7F9F7] px-4 py-8 text-[#202B25] dark:bg-[#111A15] dark:text-white sm:px-6 lg:px-10">
                <div className="mx-auto max-w-7xl space-y-7">

                    {/* Header */}
                    <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <Link
                                href="/mitra/dashboard"
                                className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-[#146B45] dark:text-gray-400"
                            >
                                <span className="rotate-180">
                                    <Icon name="arrow" size={16} />
                                </span>
                                {isEnglish ? "Back to Dashboard" : "Kembali ke Dashboard"}
                            </Link>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {isEnglish ? "My Venues" : "Kelola Lapangan"}
                            </h1>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish
                                    ? "Manage your registered sports venues."
                                    : "Kelola informasi dan daftar lapangan olahraga milikmu."}
                            </p>
                        </div>

                        <Link
                            href="/mitra/lapangan/tambah"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#146B45] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#105638]"
                        >
                            <Icon name="plus" size={19} />
                            {isEnglish ? "Add Venue" : "Tambah Lapangan"}
                        </Link>
                    </section>

                    {/* Statistik */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            {
                                label: isEnglish ? "Total Venues" : "Total Lapangan",
                                value: venues.length,
                            },
                            {
                                label: isEnglish ? "Active Venues" : "Lapangan Aktif",
                                value: venues.filter((venue) => {
                                    const status = (venue.status || "").toLowerCase();
                                    return (
                                        status.includes("aktif") ||
                                        status.includes("approved") ||
                                        status.includes("disetujui")
                                    );
                                }).length,
                            },
                            {
                                label: isEnglish ? "Pending Verification" : "Menunggu Verifikasi",
                                value: venues.filter((venue) => {
                                    const status = (venue.status || "").toLowerCase();
                                    return (
                                        status.includes("menunggu") ||
                                        status.includes("pending")
                                    );
                                }).length,
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
                            >
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.label}
                                </p>
                                <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>
                            </div>
                        ))}
                    </section>

                    {/* Search dan Filter */}
                    <section className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="flex flex-col gap-4 lg:flex-row">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Icon name="search" size={19} />
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder={
                                        isEnglish
                                            ? "Search venue name, location, or sport..."
                                            : "Cari nama lapangan, lokasi, atau olahraga..."
                                    }
                                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[#146B45] focus:ring-2 focus:ring-[#146B45]/10 dark:border-white/10 dark:bg-white/5"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {["Semua", "Aktif", "Menunggu", "Ditolak"].map(
                                    (filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setFilterStatus(filter)}
                                            className={`rounded-xl px-4 py-3 text-xs font-semibold transition ${filterStatus === filter
                                                ? "bg-[#146B45] text-white"
                                                : "bg-gray-100 text-gray-500 hover:bg-[#EAF5EF] hover:text-[#146B45] dark:bg-white/10 dark:text-gray-300"
                                                }`}
                                        >
                                            {isEnglish
                                                ? {
                                                    Semua: "All",
                                                    Aktif: "Active",
                                                    Menunggu: "Pending",
                                                    Ditolak: "Rejected",
                                                }[filter]
                                                : filter}
                                        </button>
                                    )
                                )}
                            </div>

                            <button
                                onClick={fetchVenues}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                            >
                                <Icon name="refresh" size={17} />
                                {isEnglish ? "Refresh" : "Muat Ulang"}
                            </button>
                        </div>
                    </section>

                    {/* Daftar Lapangan */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                {isEnglish ? "Venue List" : "Daftar Lapangan"}
                            </h2>

                            <span className="text-sm text-gray-400">
                                {filteredVenues.length}{" "}
                                {isEnglish ? "venues" : "lapangan"}
                            </span>
                        </div>

                        {loading ? (
                            <LoadingState />
                        ) : error ? (
                            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-900/10">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                                <button
                                    onClick={fetchVenues}
                                    className="mt-4 rounded-xl bg-[#146B45] px-5 py-2.5 text-sm font-semibold text-white"
                                >
                                    {isEnglish ? "Try Again" : "Coba Lagi"}
                                </button>
                            </div>
                        ) : filteredVenues.length === 0 ? (
                            <div className="rounded-3xl border border-white/70 bg-white/80 px-5 py-12 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF5EF] text-[#146B45] dark:bg-green-900/30 dark:text-green-400">
                                    <Icon name="court" size={30} />
                                </div>

                                <h3 className="mt-5 text-lg font-bold">
                                    {search || filterStatus !== "Semua"
                                        ? isEnglish
                                            ? "No matching venues"
                                            : "Lapangan tidak ditemukan"
                                        : isEnglish
                                            ? "You haven't added a venue yet"
                                            : "Belum Ada Lapangan"}
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                    {search || filterStatus !== "Semua"
                                        ? isEnglish
                                            ? "Try changing your search or filter."
                                            : "Coba ubah kata pencarian atau filter status."
                                        : isEnglish
                                            ? "Start registering your sports venue so customers can find and book it through Sportify."
                                            : "Mulai daftarkan lapangan olahraga milikmu agar penyewa bisa menemukan dan memesannya melalui Sportify."}
                                </p>

                                {!search && filterStatus === "Semua" && (
                                    <Link
                                        href="/mitra/lapangan/tambah"
                                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#146B45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#105638]"
                                    >
                                        <Icon name="plus" size={18} />
                                        {isEnglish ? "Add Your First Venue" : "Tambah Lapangan Pertama"}
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {filteredVenues.map((venue) => {
                                    const categories = Array.isArray(venue.kategori)
                                        ? venue.kategori
                                        : venue.kategori
                                            ? [venue.kategori]
                                            : [];

                                    const image =
                                        venue.gambar ||
                                        venue.foto?.[0] ||
                                        "/images/placeholder.jpg";

                                    return (
                                        <article
                                            key={venue.id}
                                            className="group overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04]"
                                        >
                                            <div className="relative h-48 overflow-hidden bg-[#EAF5EF] dark:bg-green-900/20">
                                                {image !== "/images/placeholder.jpg" ? (
                                                    <img
                                                        src={image}
                                                        alt={venue.nama}
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-[#146B45] dark:text-green-400">
                                                        <Icon name="court" size={55} />
                                                    </div>
                                                )}

                                                <div className="absolute left-4 top-4">
                                                    <StatusBadge
                                                        status={venue.status}
                                                        isEnglish={isEnglish}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 p-5">
                                                <div>
                                                    <h3 className="text-lg font-bold">
                                                        {venue.nama}
                                                    </h3>

                                                    <p className="mt-2 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="mt-0.5 shrink-0">
                                                            <Icon name="location" size={16} />
                                                        </span>
                                                        {venue.lokasi || venue.alamat || "-"}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {categories.map((category, index) => (
                                                        <span
                                                            key={`${category}-${index}`}
                                                            className="rounded-full bg-[#EAF5EF] px-3 py-1 text-xs font-medium text-[#146B45] dark:bg-green-900/30 dark:text-green-400"
                                                        >
                                                            {category}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10">
                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            {isEnglish ? "Starting from" : "Mulai dari"}
                                                        </p>
                                                        <p className="mt-1 font-bold text-[#146B45] dark:text-green-400">
                                                            {formatRupiah(venue.harga)}
                                                            <span className="text-xs font-normal text-gray-400">
                                                                {" "}/ Sesi
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <Link
                                                        href={`/mitra/lapangan/${venue.id}`}
                                                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#146B45] hover:underline dark:text-green-400"
                                                    >
                                                        {isEnglish ? "Details" : "Detail"}
                                                        <Icon name="arrow" size={16} />
                                                    </Link>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <Link
                                                        href={`/mitra/lapangan/${venue.id}/edit`}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#146B45]/20 px-3 py-2.5 text-sm font-semibold text-[#146B45] transition hover:bg-[#EAF5EF] dark:border-green-400/20 dark:text-green-400 dark:hover:bg-green-900/20"
                                                    >
                                                        <Icon name="edit" size={16} />
                                                        {isEnglish ? "Edit" : "Edit"}
                                                    </Link>

                                                    <button
                                                        onClick={() => setDeleteTarget(venue)}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20"
                                                    >
                                                        <Icon name="trash" size={16} />
                                                        {isEnglish ? "Delete" : "Hapus"}
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Konfirmasi Hapus */}
            {deleteTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#17221B]">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <Icon name="trash" size={25} />
                        </div>

                        <h3 className="mt-5 text-center text-lg font-bold">
                            {isEnglish ? "Delete Venue?" : "Hapus Lapangan?"}
                        </h3>

                        <p className="mt-2 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            {isEnglish
                                ? `Are you sure you want to delete "${deleteTarget.nama}"? This action cannot be undone.`
                                : `Apakah kamu yakin ingin menghapus "${deleteTarget.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                            >
                                {isEnglish ? "Cancel" : "Batal"}
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting
                                    ? isEnglish
                                        ? "Deleting..."
                                        : "Menghapus..."
                                    : isEnglish
                                        ? "Yes, Delete"
                                        : "Ya, Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}