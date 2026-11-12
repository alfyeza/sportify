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

            <main className="min-h-screen bg-background">

                {/* HERO SECTION */}
                <section className="relative overflow-hidden bg-primary text-white">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full border-[40px] border-white" />
                        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full border-[50px] border-white" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20 lg:py-24">

                        <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium mb-5">
                            {isEnglish ? "SPORTIFY JOURNAL" : "JURNAL SPORTIFY"}
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
                            {isEnglish
                                ? "Stories, Tips & Inspiration for Sports Lovers"
                                : "Cerita, Tips & Inspirasi untuk Pecinta Olahraga"}
                        </h1>

                        <p className="mt-5 text-sm sm:text-base text-green-50 leading-relaxed max-w-2xl">
                            {isEnglish
                                ? "Discover the latest sports insights, useful tips, and inspiration to make every moment of your game more exciting."
                                : "Temukan informasi olahraga terbaru, tips bermanfaat, dan berbagai inspirasi untuk membuat setiap momen olahragamu semakin menyenangkan."}
                        </p>

                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-14">

                    {/* ARTIKEL UNGGULAN */}
                    <section>

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm font-semibold text-secondary mb-1">
                                    {isEnglish ? "EDITOR'S PICK" : "PILIHAN EDITOR"}
                                </p>

                                <h2 className="text-xl sm:text-2xl font-bold text-dark-text">
                                    {isEnglish ? "Featured Article" : "Artikel Unggulan"}
                                </h2>
                            </div>
                        </div>

                        <Link
                            href={`/artikel/${artikelUnggulan.slug}`}
                            className="group grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition duration-300"
                        >

                            <div className="relative h-60 sm:h-80 lg:h-[420px] overflow-hidden">
                                <img
                                    src={artikelUnggulan.gambar}
                                    alt={judulArtikel(artikelUnggulan)}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />

                                <span className="absolute top-5 left-5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full">
                                    {artikelUnggulan.kategori}
                                </span>
                            </div>

                            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">

                                <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                    {artikelUnggulan.tanggal} · {artikelUnggulan.penulis}
                                </p>

                                <h3 className="text-2xl sm:text-3xl font-bold text-dark-text leading-snug group-hover:text-primary transition">
                                    {judulArtikel(artikelUnggulan)}
                                </h3>

                                <p className="mt-5 text-sm sm:text-base text-gray-500 leading-relaxed line-clamp-3">
                                    {deskripsiArtikel(artikelUnggulan)}
                                </p>

                                <div className="mt-7 flex items-center gap-2 text-primary font-semibold text-sm">
                                    {isEnglish ? "Read Article" : "Baca Artikel"}
                                    <span className="group-hover:translate-x-2 transition">
                                        &gt;
                                    </span>
                                </div>

                            </div>

                        </Link>

                    </section>

                    {/* DAFTAR ARTIKEL */}
                    <section className="mt-14 sm:mt-20">

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-7">

                            <div>
                                <p className="text-sm font-semibold text-secondary mb-1">
                                    {isEnglish ? "LATEST UPDATES" : "INFORMASI TERBARU"}
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-dark-text">
                                    {isEnglish ? "Latest Articles" : "Artikel Terbaru"}
                                </h2>

                                <p className="text-sm text-gray-500 mt-2">
                                    {isEnglish
                                        ? "Explore articles and discover something new."
                                        : "Jelajahi berbagai artikel dan temukan informasi baru."}
                                </p>
                            </div>

                            {/* SEARCH */}
                            <div className="relative w-full md:w-80">

                                <input
                                    type="text"
                                    value={pencarian}
                                    onChange={(e) => setPencarian(e.target.value)}
                                    placeholder={
                                        isEnglish
                                            ? "Search articles..."
                                            : "Cari artikel..."
                                    }
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-dark-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                                />

                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                    <path d="m16 16 4 4" strokeWidth="2" strokeLinecap="round" />
                                </svg>

                            </div>

                        </div>

                        {/* FILTER KATEGORI */}
                        <div className="flex gap-2 overflow-x-auto pb-3 mb-7 scrollbar-hide">

                            {kategoriArtikel.map((kategori) => {

                                const aktif = kategoriAktif === kategori;

                                return (
                                    <button
                                        key={kategori}
                                        onClick={() => setKategoriAktif(kategori)}
                                        className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition ${aktif
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                                            }`}
                                    >
                                        {isEnglish && kategori === "Semua"
                                            ? "All"
                                            : kategori}
                                    </button>
                                );
                            })}

                        </div>

                        {/* GRID ARTIKEL */}
                        {artikelLainnya.length > 0 ? (

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                {artikelLainnya.map((artikel) => (

                                    <Link
                                        key={artikel.id}
                                        href={`/artikel/${artikel.slug}`}
                                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                                    >

                                        <div className="relative h-52 overflow-hidden">

                                            <img
                                                src={artikel.gambar}
                                                alt={judulArtikel(artikel)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />

                                            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 text-primary text-xs font-semibold">
                                                {artikel.kategori}
                                            </span>

                                        </div>

                                        <div className="p-5">

                                            <p className="text-xs text-gray-400 mb-3">
                                                {artikel.tanggal} · {artikel.penulis}
                                            </p>

                                            <h3 className="text-lg font-bold text-dark-text leading-snug line-clamp-2 group-hover:text-primary transition">
                                                {judulArtikel(artikel)}
                                            </h3>

                                            <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-3">
                                                {deskripsiArtikel(artikel)}
                                            </p>

                                            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">

                                                <span className="text-sm font-semibold text-primary">
                                                    {isEnglish ? "Read More" : "Baca Selengkapnya"}
                                                </span>

                                                <span className="text-primary group-hover:translate-x-1 transition">
                                                    &gt;
                                                </span>

                                            </div>

                                        </div>

                                    </Link>

                                ))}

                            </div>

                        ) : (

                            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">

                                <div className="text-4xl mb-4">
                                    {">"}
                                </div>

                                <h3 className="font-bold text-dark-text text-lg">
                                    {isEnglish
                                        ? "No articles found"
                                        : "Artikel tidak ditemukan"}
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    {isEnglish
                                        ? "Try another keyword or category."
                                        : "Coba gunakan kata kunci atau kategori lainnya."}
                                </p>

                            </div>

                        )}

                    </section>

                    {/* CTA */}
                    <section className="mt-16 sm:mt-20 rounded-3xl bg-soft-mint border border-green-100 p-7 sm:p-10 lg:p-12 text-center">

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-text">
                            {isEnglish
                                ? "Ready to Start Playing?"
                                : "Sudah Siap untuk Mulai Bermain?"}
                        </h2>

                        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                            {isEnglish
                                ? "Find your favorite sports court and book your playing time easily with Sportify."
                                : "Temukan lapangan olahraga favoritmu dan pesan jadwal bermain dengan mudah melalui Sportify."}
                        </p>

                        <Link
                            href="/lapangan"
                            className="inline-flex items-center gap-2 mt-6 px-7 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-secondary transition shadow-lg shadow-primary/20"
                        >
                            {isEnglish ? "Explore Courts" : "Cari Lapangan"}
                            <span>&gt;</span>
                        </Link>

                    </section>

                </div>

            </main>

            <Footer />
        </>
    );
}