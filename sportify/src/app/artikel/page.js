"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { daftarArtikel } from "@/lib/artikel";

const kategoriArtikel = [
    "Semua",
    "Padel",
    "Tennis",
    "Badminton",
    "Mini Soccer",
    "Tips Olahraga",
];

export default function ArtikelPage() {
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [kategoriAktif, setKategoriAktif] = useState("Semua");
    const [pencarian, setPencarian] = useState("");

    const artikelUnggulan = daftarArtikel[0];

    const artikelLainnya = daftarArtikel.slice(1).filter((artikel) => {
        const cocokKategori =
            kategoriAktif === "Semua" ||
            artikel.kategori === kategoriAktif;

        const cocokPencarian =
            artikel.judul.toLowerCase().includes(pencarian.toLowerCase()) ||
            artikel.judulEn.toLowerCase().includes(pencarian.toLowerCase()) ||
            artikel.kategori.toLowerCase().includes(pencarian.toLowerCase());

        return cocokKategori && cocokPencarian;
    });

    const judulArtikel = (artikel) =>
        isEnglish ? artikel.judulEn : artikel.judul;

    const deskripsiArtikel = (artikel) =>
        isEnglish ? artikel.deskripsiEn : artikel.deskripsi;

    return (
        <>
            <Navbar />

            <main
                className="artikel-page min-h-screen"
                style={{ background: "var(--bg-main)" }}
            >
                {/* HERO SECTION */}
                <section className="artikel-hero relative overflow-hidden bg-primary text-white">
                    <div className="absolute inset-0 opacity-10">
                        <div className="artikel-circle artikel-circle-one absolute -right-20 -top-24 h-80 w-80 rounded-full border-[40px] border-white" />
                        <div className="artikel-circle artikel-circle-two absolute -bottom-40 -left-20 h-96 w-96 rounded-full border-[50px] border-white" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
                        <span className="artikel-hero-label mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium sm:text-sm">
                            {isEnglish ? "SPORTIFY JOURNAL" : "JURNAL SPORTIFY"}
                        </span>

                        <h1 className="artikel-hero-title max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                            {isEnglish
                                ? "Stories, Tips & Inspiration for Sports Lovers"
                                : "Cerita, Tips & Inspirasi untuk Pecinta Olahraga"}
                        </h1>

                        <p className="artikel-hero-description mt-5 max-w-2xl text-sm leading-relaxed text-green-50 sm:text-base">
                            {isEnglish
                                ? "Discover the latest sports insights, useful tips, and inspiration to make every moment of your game more exciting."
                                : "Temukan informasi olahraga terbaru, tips bermanfaat, dan berbagai inspirasi untuk membuat setiap momen olahragamu semakin menyenangkan."}
                        </p>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14">
                    {/* ARTIKEL UNGGULAN */}
                    {artikelUnggulan && (
                        <section className="artikel-featured">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-semibold text-secondary">
                                        {isEnglish ? "EDITOR'S PICK" : "PILIHAN EDITOR"}
                                    </p>

                                    <h2
                                        className="text-xl font-bold sm:text-2xl"
                                        style={{ color: "var(--text-main)" }}
                                    >
                                        {isEnglish ? "Featured Article" : "Artikel Unggulan"}
                                    </h2>
                                </div>
                            </div>

                            <Link
                                href={`/artikel/${artikelUnggulan.slug}`}
                                className="artikel-featured-card group grid grid-cols-1 overflow-hidden rounded-3xl shadow-sm transition duration-300 hover:shadow-xl lg:grid-cols-2"
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border-main)",
                                }}
                            >
                                <div className="relative h-60 overflow-hidden sm:h-80 lg:h-[420px]">
                                    <img
                                        src={artikelUnggulan.gambar}
                                        alt={judulArtikel(artikelUnggulan)}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                    />

                                    <span className="absolute left-5 top-5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
                                        {artikelUnggulan.kategori}
                                    </span>
                                </div>

                                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                                    <p
                                        className="mb-4 text-xs sm:text-sm"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        {artikelUnggulan.tanggal} · {artikelUnggulan.penulis}
                                    </p>

                                    <h3
                                        className="text-2xl font-bold leading-snug transition group-hover:text-primary sm:text-3xl"
                                        style={{ color: "var(--text-main)" }}
                                    >
                                        {judulArtikel(artikelUnggulan)}
                                    </h3>

                                    <p
                                        className="mt-5 line-clamp-3 text-sm leading-relaxed sm:text-base"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        {deskripsiArtikel(artikelUnggulan)}
                                    </p>

                                    <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-primary">
                                        {isEnglish ? "Read Article" : "Baca Artikel"}
                                        <span className="transition-transform duration-300 group-hover:translate-x-2">
                                            &gt;
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </section>
                    )}

                    {/* DAFTAR ARTIKEL */}
                    <section className="artikel-list-section mt-14 sm:mt-20">
                        <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div className="artikel-list-heading">
                                <p className="mb-1 text-sm font-semibold text-secondary">
                                    {isEnglish ? "LATEST UPDATES" : "INFORMASI TERBARU"}
                                </p>

                                <h2
                                    className="text-2xl font-bold sm:text-3xl"
                                    style={{ color: "var(--text-main)" }}
                                >
                                    {isEnglish ? "Latest Articles" : "Artikel Terbaru"}
                                </h2>

                                <p
                                    className="mt-2 text-sm"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {isEnglish
                                        ? "Explore articles and discover something new."
                                        : "Jelajahi berbagai artikel dan temukan informasi baru."}
                                </p>
                            </div>

                            {/* SEARCH */}
                            <div className="artikel-search relative w-full md:w-80">
                                <input
                                    type="text"
                                    value={pencarian}
                                    onChange={(e) => setPencarian(e.target.value)}
                                    placeholder={
                                        isEnglish ? "Search articles..." : "Cari artikel..."
                                    }
                                    className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    style={{
                                        background: "var(--input-bg)",
                                        color: "var(--input-text)",
                                        border: "1px solid var(--input-border)",
                                    }}
                                />

                                <svg
                                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                                    style={{ color: "var(--text-muted)" }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                    <path
                                        d="m16 16 4 4"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* FILTER KATEGORI */}
                        <div className="artikel-filters mb-7 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                            {kategoriArtikel.map((kategori) => {
                                const aktif = kategoriAktif === kategori;

                                return (
                                    <button
                                        key={kategori}
                                        type="button"
                                        onClick={() => setKategoriAktif(kategori)}
                                        className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold transition sm:text-sm ${aktif
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "hover:border-primary hover:text-primary"
                                            }`}
                                        style={
                                            aktif
                                                ? {}
                                                : {
                                                    background: "var(--bg-card)",
                                                    color: "var(--text-secondary)",
                                                    border: "1px solid var(--border-main)",
                                                }
                                        }
                                    >
                                        {isEnglish && kategori === "Semua" ? "All" : kategori}
                                    </button>
                                );
                            })}
                        </div>

                        {/* GRID ARTIKEL */}
                        {artikelLainnya.length > 0 ? (
                            <div className="artikel-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {artikelLainnya.map((artikel, index) => (
                                    <Link
                                        key={artikel.id}
                                        href={`/artikel/${artikel.slug}`}
                                        className="artikel-card group overflow-hidden rounded-2xl shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                        style={{
                                            background: "var(--bg-card)",
                                            border: "1px solid var(--border-main)",
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <div className="relative h-52 overflow-hidden">
                                            <img
                                                src={artikel.gambar}
                                                alt={judulArtikel(artikel)}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />

                                            <span
                                                className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold text-primary"
                                                style={{
                                                    background: "var(--bg-card)",
                                                    border: "1px solid var(--border-main)",
                                                }}
                                            >
                                                {artikel.kategori}
                                            </span>
                                        </div>

                                        <div className="p-5">
                                            <p
                                                className="mb-3 text-xs"
                                                style={{ color: "var(--text-muted)" }}
                                            >
                                                {artikel.tanggal} · {artikel.penulis}
                                            </p>

                                            <h3
                                                className="line-clamp-2 text-lg font-bold leading-snug transition group-hover:text-primary"
                                                style={{ color: "var(--text-main)" }}
                                            >
                                                {judulArtikel(artikel)}
                                            </h3>

                                            <p
                                                className="mt-3 line-clamp-3 text-sm leading-relaxed"
                                                style={{ color: "var(--text-secondary)" }}
                                            >
                                                {deskripsiArtikel(artikel)}
                                            </p>

                                            <div
                                                className="mt-5 flex items-center justify-between border-t pt-4"
                                                style={{ borderColor: "var(--border-soft)" }}
                                            >
                                                <span className="text-sm font-semibold text-primary">
                                                    {isEnglish ? "Read More" : "Baca Selengkapnya"}
                                                </span>

                                                <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">
                                                    &gt;
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div
                                className="artikel-empty rounded-2xl p-10 text-center"
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border-main)",
                                }}
                            >
                                <div
                                    className="mb-4 text-4xl"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    &gt;
                                </div>

                                <h3
                                    className="text-lg font-bold"
                                    style={{ color: "var(--text-main)" }}
                                >
                                    {isEnglish
                                        ? "No articles found"
                                        : "Artikel tidak ditemukan"}
                                </h3>

                                <p
                                    className="mt-2 text-sm"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {isEnglish
                                        ? "Try another keyword or category."
                                        : "Coba gunakan kata kunci atau kategori lainnya."}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* CTA */}
                    <section
                        className="artikel-cta mt-16 rounded-3xl p-7 text-center sm:mt-20 sm:p-10 lg:p-12"
                        style={{
                            background: "var(--bg-soft)",
                            border: "1px solid var(--border-main)",
                        }}
                    >
                        <h2
                            className="text-xl font-bold sm:text-2xl lg:text-3xl"
                            style={{ color: "var(--text-main)" }}
                        >
                            {isEnglish
                                ? "Ready to Start Playing?"
                                : "Sudah Siap untuk Mulai Bermain?"}
                        </h2>

                        <p
                            className="mx-auto mt-3 max-w-xl text-sm sm:text-base"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {isEnglish
                                ? "Find your favorite sports court and book your playing time easily with Sportify."
                                : "Temukan lapangan olahraga favoritmu dan pesan jadwal bermain dengan mudah melalui Sportify."}
                        </p>

                        <Link
                            href="/lapangan"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary"
                        >
                            {isEnglish ? "Explore Courts" : "Cari Lapangan"}
                            <span>&gt;</span>
                        </Link>
                    </section>
                </div>

                {/* ANIMATION STYLES */}
                <style jsx global>{`
          .artikel-page {
            animation: artikelPageEnter 0.7s ease both;
          }

          .artikel-hero-label,
          .artikel-hero-title,
          .artikel-hero-description {
            animation: artikelFadeUp 0.8s ease both;
          }

          .artikel-hero-title {
            animation-delay: 0.12s;
          }

          .artikel-hero-description {
            animation-delay: 0.24s;
          }

          .artikel-circle-one {
            animation: artikelRotate 25s linear infinite;
          }

          .artikel-circle-two {
            animation: artikelRotate 35s linear infinite reverse;
          }

          .artikel-featured {
            animation: artikelFadeUp 0.8s ease 0.15s both;
          }

          .artikel-featured-card {
            transition:
              transform 0.35s ease,
              box-shadow 0.35s ease;
          }

          .artikel-featured-card:hover {
            transform: translateY(-5px);
          }

          .artikel-list-heading {
            animation: artikelFadeUp 0.7s ease both;
          }

          .artikel-search {
            animation: artikelFadeUp 0.7s ease 0.1s both;
          }

          .artikel-filters {
            animation: artikelFadeUp 0.7s ease 0.15s both;
          }

          .artikel-filters button {
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease;
          }

          .artikel-filters button:hover {
            transform: translateY(-2px);
          }

          .artikel-card {
            animation: artikelFadeUp 0.65s ease both;
            transition:
              transform 0.35s ease,
              box-shadow 0.35s ease;
          }

          .artikel-empty {
            animation: artikelFadeUp 0.5s ease both;
          }

          .artikel-cta {
            animation: artikelFadeUp 0.8s ease 0.2s both;
            transition:
              transform 0.35s ease,
              box-shadow 0.35s ease;
          }

          .artikel-cta:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 35px rgba(20, 107, 69, 0.08);
          }

          .artikel-page button:active,
          .artikel-page a:active {
            transform: scale(0.98);
          }

          .artikel-search input:focus {
            box-shadow: 0 0 0 3px rgba(39, 163, 107, 0.12);
          }

          @keyframes artikelPageEnter {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes artikelFadeUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes artikelRotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .artikel-page *,
            .artikel-page *::before,
            .artikel-page *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
            </main>

            <Footer />
        </>
    );
}