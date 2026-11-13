"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

const bookingContoh = [
    {
        id: "BK-001",
        nama: "Andi Pratama",
        lapangan: "Unity Sports Center",
        unit: "Court A",
        tanggal: "13 Nov 2026",
        waktu: "09:00 - 10:00",
        harga: 160000,
        status: "Dibayar",
    },
    {
        id: "BK-002",
        nama: "Budi Santoso",
        lapangan: "Unity Sports Center",
        unit: "Court B",
        tanggal: "13 Nov 2026",
        waktu: "11:00 - 12:00",
        harga: 160000,
        status: "Menunggu",
    },
    {
        id: "BK-003",
        nama: "Citra Amelia",
        lapangan: "Unity Sports Center",
        unit: "Court A",
        tanggal: "13 Nov 2026",
        waktu: "14:00 - 16:00",
        harga: 320000,
        status: "Dibayar",
    },
    {
        id: "BK-004",
        nama: "Dimas Putra",
        lapangan: "Unity Sports Center",
        unit: "Court C",
        tanggal: "13 Nov 2026",
        waktu: "16:00 - 17:00",
        harga: 160000,
        status: "Dibatalkan",
    },
];

const statistik = [
    {
        label: "Booking Hari Ini",
        value: "12",
        perubahan: "+20% dari kemarin",
        icon: "calendar",
    },
    {
        label: "Pendapatan Hari Ini",
        value: "Rp1.920.000",
        perubahan: "+15% dari kemarin",
        icon: "wallet",
    },
    {
        label: "Total Lapangan",
        value: "3",
        perubahan: "Lapangan aktif",
        icon: "court",
    },
    {
        label: "Menunggu Konfirmasi",
        value: "2",
        perubahan: "Perlu diperiksa",
        icon: "clock",
    },
];

const menuMitra = [
    {
        title: "Kelola Lapangan",
        description: "Tambah dan atur informasi lapangan.",
        href: "/mitra/lapangan",
        icon: "court",
    },
    {
        title: "Kelola Jadwal",
        description: "Atur jam operasional dan ketersediaan.",
        href: "/mitra/jadwal",
        icon: "calendar",
    },
    {
        title: "Kelola Booking",
        description: "Lihat dan kelola pesanan penyewa.",
        href: "/mitra/booking",
        icon: "booking",
    },
    {
        title: "Keuangan",
        description: "Pantau pendapatan dan pencairan dana.",
        href: "/mitra/keuangan",
        icon: "wallet",
    },
];

function Icon({ name, size = 22 }) {
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
        calendar: (
            <>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
            </>
        ),
        wallet: (
            <>
                <rect x="3" y="5" width="18" height="15" rx="2" />
                <path d="M3 9h18M16 14h2" />
            </>
        ),
        court: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="1" />
                <path d="M12 3v18M3 12h18M8 3v18M16 3v18" />
            </>
        ),
        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),
        booking: (
            <>
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 8h8M8 12h8M8 16h5" />
            </>
        ),
        arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
        plus: <path d="M12 5v14m-7-7h14" />,
        chart: (
            <>
                <path d="M3 3v18h18" />
                <path d="m7 14 4-4 4 3 5-7" />
            </>
        ),
        location: (
            <>
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </>
        ),
    };

    return <svg {...common}>{paths[name] || paths.booking}</svg>;
}

export default function MitraDashboardPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [namaMitra, setNamaMitra] = useState("Mitra Sportify");
    const [tanggal, setTanggal] = useState("");
    const [filterBooking, setFilterBooking] = useState("Semua");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("sportify_user");
        const role = localStorage.getItem("sportify_role");

        if (!token) {
            router.replace("/login?redirect=%2Fmitra%2Fdashboard");
            return;
        }

        if (role && !["mitra", "pemilik", "owner"].includes(role.toLowerCase())) {
            router.replace("/profile");
            return;
        }

        if (userData) {
            try {
                const user = JSON.parse(userData);
                setNamaMitra(
                    user.fullName ||
                    user.full_name ||
                    user.nama ||
                    user.name ||
                    "Mitra Sportify"
                );
            } catch {
                setNamaMitra("Mitra Sportify");
            }
        }

        setTanggal(
            new Date().toLocaleDateString(
                isEnglish ? "en-US" : "id-ID",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            )
        );
    }, [router, isEnglish]);

    const daftarBooking =
        filterBooking === "Semua"
            ? bookingContoh
            : bookingContoh.filter((item) => item.status === filterBooking);

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(angka);

    const statusStyle = (status) => {
        if (status === "Dibayar") {
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
                    <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="rounded-full bg-[#EAF5EF] px-3 py-1 text-xs font-semibold text-[#146B45] dark:bg-green-900/30 dark:text-green-400">
                                    Dashboard Mitra
                                </span>
                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    Data Demo
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {isEnglish ? "Welcome back," : "Selamat datang,"} {namaMitra}!
                            </h1>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {isEnglish
                                    ? "Manage your sports venues and monitor your business."
                                    : "Kelola lapangan olahraga dan pantau perkembangan bisnismu."}
                            </p>

                            {tanggal && (
                                <p className="mt-2 text-sm font-medium text-[#146B45] dark:text-green-400">
                                    {tanggal}
                                </p>
                            )}
                        </div>

                        <Link
                            href="/mitra/lapangan/tambah"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#146B45] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#105638]"
                        >
                            <Icon name="plus" size={18} />
                            {isEnglish ? "Add Venue" : "Tambah Lapangan"}
                        </Link>
                    </section>

                    {/* Statistik */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">
                                {isEnglish ? "Business Overview" : "Ringkasan Bisnis"}
                            </h2>
                            <span className="text-xs text-gray-400">
                                {isEnglish ? "Today" : "Hari ini"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {statistik.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="rounded-2xl bg-[#EAF5EF] p-3 text-[#146B45] dark:bg-green-900/30 dark:text-green-400">
                                            <Icon name={item.icon} size={22} />
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {isEnglish ? "Overview" : "Ringkasan"}
                                        </span>
                                    </div>

                                    <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
                                        {isEnglish
                                            ? [
                                                "Today's Bookings",
                                                "Today's Revenue",
                                                "Total Venues",
                                                "Pending Bookings",
                                            ][index]
                                            : item.label}
                                    </p>

                                    <h3 className="mt-1 text-2xl font-bold">{item.value}</h3>

                                    <p className="mt-2 text-xs text-[#219653] dark:text-green-400">
                                        {item.perubahan}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Menu Pengelolaan */}
                    <section>
                        <h2 className="mb-4 text-lg font-bold">
                            {isEnglish ? "Venue Management" : "Pengelolaan Lapangan"}
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {menuMitra.map((menu) => (
                                <Link
                                    key={menu.title}
                                    href={menu.href}
                                    className="group rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#B7E34A] hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04]"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="rounded-2xl bg-[#EAF5EF] p-3 text-[#146B45] dark:bg-green-900/30 dark:text-green-400">
                                            <Icon name={menu.icon} size={23} />
                                        </div>

                                        <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#146B45]">
                                            <Icon name="arrow" size={20} />
                                        </span>
                                    </div>

                                    <h3 className="font-bold">
                                        {isEnglish
                                            ? {
                                                "Kelola Lapangan": "Manage Venues",
                                                "Kelola Jadwal": "Manage Schedules",
                                                "Kelola Booking": "Manage Bookings",
                                                Keuangan: "Finances",
                                            }[menu.title]
                                            : menu.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                        {isEnglish
                                            ? {
                                                "Kelola Lapangan":
                                                    "Add and manage your venue information.",
                                                "Kelola Jadwal":
                                                    "Manage operating hours and availability.",
                                                "Kelola Booking":
                                                    "View and manage customer reservations.",
                                                Keuangan:
                                                    "Monitor revenue and withdrawal requests.",
                                            }[menu.title]
                                            : menu.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Grafik Pendapatan */}
                    <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] lg:col-span-2">
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="font-bold">
                                        {isEnglish ? "Revenue Overview" : "Ringkasan Pendapatan"}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {isEnglish
                                            ? "Your revenue this week"
                                            : "Pendapatan lapangan minggu ini"}
                                    </p>
                                </div>

                                <span className="rounded-xl bg-[#EAF5EF] px-3 py-2 text-xs font-semibold text-[#146B45] dark:bg-green-900/30 dark:text-green-400">
                                    {isEnglish ? "This Week" : "Minggu Ini"}
                                </span>
                            </div>

                            <div className="flex h-52 items-end justify-between gap-3 border-b border-gray-100 pb-2 dark:border-white/10">
                                {[45, 70, 55, 90, 65, 80, 100].map((height, index) => (
                                    <div
                                        key={index}
                                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                    >
                                        <div
                                            className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-[#146B45] to-[#7BC99D] transition hover:opacity-80"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-xs text-gray-400">
                                            {isEnglish
                                                ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]
                                                : ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][index]}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <p className="mt-4 text-xs text-gray-400">
                                * {isEnglish
                                    ? "Illustrative revenue chart. Real data will be connected to the backend."
                                    : "Grafik pendapatan ilustrasi. Data sebenarnya akan dihubungkan ke backend."}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-[#146B45] to-[#238B5D] p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/80">
                                    {isEnglish ? "Total Revenue" : "Total Pendapatan"}
                                </span>
                                <Icon name="chart" size={23} />
                            </div>

                            <h3 className="mt-5 text-3xl font-bold">Rp8.450.000</h3>

                            <p className="mt-2 text-sm text-white/70">
                                {isEnglish ? "Illustrative monthly revenue" : "Ilustrasi pendapatan bulan ini"}
                            </p>

                            <div className="my-6 h-px bg-white/20" />

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/70">
                                    {isEnglish ? "Completed bookings" : "Booking selesai"}
                                </span>
                                <span className="font-bold">48</span>
                            </div>

                            <Link
                                href="/mitra/keuangan"
                                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#146B45] transition hover:bg-[#EAF5EF]"
                            >
                                {isEnglish ? "View Finances" : "Lihat Keuangan"}
                                <Icon name="arrow" size={17} />
                            </Link>
                        </div>
                    </section>

                    {/* Booking Terbaru */}
                    <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:p-6">
                            <div>
                                <h2 className="font-bold">
                                    {isEnglish ? "Latest Bookings" : "Booking Terbaru"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {isEnglish
                                        ? "Monitor your latest customer reservations."
                                        : "Pantau pemesanan terbaru dari pelanggan."}
                                </p>
                            </div>

                            <Link
                                href="/mitra/booking"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#146B45] hover:underline dark:text-green-400"
                            >
                                {isEnglish ? "View All" : "Lihat Semua"}
                                <Icon name="arrow" size={17} />
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-2 px-5 pt-5 sm:px-6">
                            {["Semua", "Dibayar", "Menunggu", "Dibatalkan"].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setFilterBooking(filter)}
                                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${filterBooking === filter
                                            ? "bg-[#146B45] text-white"
                                            : "bg-gray-100 text-gray-500 hover:bg-[#EAF5EF] hover:text-[#146B45] dark:bg-white/10 dark:text-gray-300"
                                        }`}
                                >
                                    {isEnglish
                                        ? {
                                            Semua: "All",
                                            Dibayar: "Paid",
                                            Menunggu: "Pending",
                                            Dibatalkan: "Cancelled",
                                        }[filter]
                                        : filter}
                                </button>
                            ))}
                        </div>

                        <div className="overflow-x-auto p-5 sm:p-6">
                            <table className="w-full min-w-[750px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs text-gray-400 dark:border-white/10">
                                        <th className="pb-4 font-medium">ID Booking</th>
                                        <th className="pb-4 font-medium">
                                            {isEnglish ? "Customer" : "Penyewa"}
                                        </th>
                                        <th className="pb-4 font-medium">
                                            {isEnglish ? "Venue / Court" : "Lapangan"}
                                        </th>
                                        <th className="pb-4 font-medium">
                                            {isEnglish ? "Schedule" : "Jadwal"}
                                        </th>
                                        <th className="pb-4 font-medium">
                                            {isEnglish ? "Total" : "Total Harga"}
                                        </th>
                                        <th className="pb-4 font-medium">
                                            {isEnglish ? "Status" : "Status"}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {daftarBooking.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="border-b border-gray-50 last:border-0 dark:border-white/5"
                                        >
                                            <td className="py-4 font-semibold text-[#146B45] dark:text-green-400">
                                                {booking.id}
                                            </td>
                                            <td className="py-4 font-medium">{booking.nama}</td>
                                            <td className="py-4">
                                                <p className="font-medium">{booking.lapangan}</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {booking.unit}
                                                </p>
                                            </td>
                                            <td className="py-4">
                                                <p>{booking.tanggal}</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {booking.waktu}
                                                </p>
                                            </td>
                                            <td className="py-4 font-semibold">
                                                {formatRupiah(booking.harga)}
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {isEnglish
                                                        ? {
                                                            Dibayar: "Paid",
                                                            Menunggu: "Pending",
                                                            Dibatalkan: "Cancelled",
                                                        }[booking.status]
                                                        : booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {daftarBooking.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="py-10 text-center text-sm text-gray-400"
                                            >
                                                {isEnglish
                                                    ? "No bookings found."
                                                    : "Tidak ada booking untuk status ini."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Informasi */}
                    <section className="rounded-3xl border border-[#D8EBDD] bg-[#EAF5EF] p-5 dark:border-green-900/40 dark:bg-green-900/10 sm:p-6">
                        <div className="flex gap-4">
                            <div className="shrink-0 rounded-2xl bg-white p-3 text-[#146B45] dark:bg-white/10 dark:text-green-400">
                                <Icon name="location" size={22} />
                            </div>

                            <div>
                                <h3 className="font-bold text-[#146B45] dark:text-green-400">
                                    {isEnglish ? "Complete Your Venue Information" : "Lengkapi Informasi Lapangan"}
                                </h3>
                                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    {isEnglish
                                        ? "Make sure your venue details, photos, facilities, and location are complete so customers can easily find your sports venue."
                                        : "Pastikan informasi lapangan, foto, fasilitas, dan lokasi sudah lengkap agar penyewa lebih mudah menemukan tempat olahragamu."}
                                </p>

                                <Link
                                    href="/mitra/lapangan"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#146B45] hover:underline dark:text-green-400"
                                >
                                    {isEnglish ? "Manage Venues" : "Kelola Lapangan"}
                                    <Icon name="arrow" size={16} />
                                </Link>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </>
    );
}