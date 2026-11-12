"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { daftarArtikel } from "@/lib/artikel";

export default function DetailArtikelPage() {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    const { language } = useLanguage();
    const isEnglish = language === "en";

    const artikel = daftarArtikel.find(
        (item) => item.slug === slug
    );

    const kembali = isEnglish ? "Back to Articles" : "Kembali ke Artikel";

    if (!artikel) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen flex items-center justify-center px-5">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-dark-text">
                            {isEnglish ? "Article Not Found" : "Artikel Tidak Ditemukan"}
                        </h1>
                        <p className="text-gray-500 mt-3 text-sm">
                            {isEnglish
                                ? "The article you are looking for does not exist."
                                : "Artikel yang kamu cari tidak tersedia."}
                        </p>
                        <Link
                            href="/artikel"
                            className="inline-flex mt-6 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-secondary transition"
                        >
                            {kembali}
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const judul = isEnglish ? artikel.judulEn : artikel.judul;
    const deskripsi = isEnglish ? artikel.deskripsiEn : artikel.deskripsi;
    const isi = isEnglish ? artikel.isiEn : artikel.isi;

    const artikelTerkait = daftarArtikel
        .filter(
            (item) =>
                item.id !== artikel.id &&
                item.kategori === artikel.kategori
        )
        .slice(0, 3);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-background">

                <section className="bg-primary text-white">
                    <div className="max-w-4xl mx-auto px-5 sm:px-6 py-10 sm:py-14">

                        <Link
                            href="/artikel"
                            className="inline-flex items-center gap-2 text-sm text-green-100 hover:text-white transition mb-8"
                        >
                            <span>&lt;</span>
                            {kembali}
                        </Link>

                        <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold">
                            {artikel.kategori}
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mt-5">
                            {judul}
                        </h1>

                        <p className="mt-5 text-sm sm:text-base text-green-100 leading-relaxed">
                            {deskripsi}
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-green-100">
                            <span>{artikel.penulis}</span>
                            <span>{artikel.tanggal}</span>
                        </div>

                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-5 sm:px-6 py-10 sm:py-14">

                    <article className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">

                        <div className="w-full h-64 sm:h-96 overflow-hidden">
                            <img
                                src={artikel.gambar}
                                alt={judul}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-6 sm:p-9 lg:p-12">

                            <div className="flex items-center justify-between gap-3 pb-6 border-b border-gray-100">
                                <span className="text-sm font-semibold text-primary">
                                    {isEnglish ? "Sportify Journal" : "Jurnal Sportify"}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {artikel.tanggal}
                                </span>
                            </div>

                            <div className="mt-8 space-y-6">
                                {Array.isArray(isi) && isi.map((paragraf, index) => (
                                    <p
                                        key={index}
                                        className="text-sm sm:text-base text-gray-600 leading-8 text-justify"
                                    >
                                        {paragraf}
                                    </p>
                                ))}
                            </div>

                            <div className="mt-10 p-6 rounded-2xl bg-soft-mint border border-green-100">
                                <h3 className="text-lg font-bold text-dark-text">
                                    {isEnglish
                                        ? "Keep Moving with Sportify!"
                                        : "Terus Bergerak Bersama Sportify!"}
                                </h3>

                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                    {isEnglish
                                        ? "Find your favorite sports court and enjoy your next game with Sportify."
                                        : "Temukan lapangan olahraga favoritmu dan nikmati pengalaman bermain bersama Sportify."}
                                </p>

                                <Link
                                    href="/lapangan"
                                    className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-secondary transition"
                                >
                                    {isEnglish ? "Find a Court" : "Cari Lapangan"}
                                    <span>&gt;</span>
                                </Link>
                            </div>

                        </div>
                    </article>

                    {artikelTerkait.length > 0 && (
                        <section className="mt-14">
                            <h2 className="text-xl sm:text-2xl font-bold text-dark-text mb-6">
                                {isEnglish ? "Related Articles" : "Artikel Terkait"}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {artikelTerkait.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/artikel/${item.slug}`}
                                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition"
                                    >
                                        <div className="h-40 overflow-hidden">
                                            <img
                                                src={item.gambar}
                                                alt={isEnglish ? item.judulEn : item.judul}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        </div>

                                        <div className="p-4">
                                            <span className="text-xs font-semibold text-primary">
                                                {item.kategori}
                                            </span>

                                            <h3 className="mt-2 text-sm font-bold text-dark-text leading-relaxed line-clamp-2 group-hover:text-primary transition">
                                                {isEnglish ? item.judulEn : item.judul}
                                            </h3>

                                            <p className="mt-3 text-xs text-gray-400">
                                                {item.tanggal}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </main>

            <Footer />
        </>
    );
}