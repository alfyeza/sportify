"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardLapangan from "@/components/CardLapangan";
import { daftarLapangan } from "@/lib/lapangan";
import { translations } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageProvider";

const kategoriOlahraga = [
  "Semua",
  "Padel",
  "Tennis",
  "Mini Soccer",
  "Badminton",
];

// Komponen utama katalog
function KontenHalamanLapangan() {
  const [pencarian, setPencarian] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const { language } = useLanguage();
  const t = translations[language].lapangan;

  const searchParams = useSearchParams();

  // Membaca kategori dari URL homepage
  useEffect(() => {
    const kategoriURL = searchParams.get("kategori");

    if (kategoriURL && kategoriOlahraga.includes(kategoriURL)) {
      setKategoriAktif(kategoriURL);
    }
  }, [searchParams]);

  // Fungsi reset filter
  const resetFilter = () => {
    setPencarian("");
    setKategoriAktif("Semua");
  };

  // Pencarian dan filter lapangan
  const hasilFilter = daftarLapangan.filter((lapangan) => {
    const cocokKategori =
      kategoriAktif === "Semua" ||
      (Array.isArray(lapangan.kategori)
        ? lapangan.kategori.includes(kategoriAktif)
        : lapangan.kategori === kategoriAktif);

    const cocokPencarian =
      lapangan.nama.toLowerCase().includes(pencarian.toLowerCase()) ||
      lapangan.lokasi.toLowerCase().includes(pencarian.toLowerCase());

    return cocokKategori && cocokPencarian;
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">

        {/* HEADER */}
        <section className="relative overflow-hidden px-4 sm:px-6 py-12 md:py-20">
          <div className="absolute top-0 right-10 w-64 h-64 bg-soft-mint rounded-full blur-3xl opacity-80" />
          <div className="absolute bottom-0 left-10 w-56 h-56 bg-green-100 rounded-full blur-3xl opacity-60" />

          <div className="relative max-w-7xl mx-auto">
            <div className="liquid-catalog-header rounded-3xl p-6 sm:p-8 md:p-14">

              <p className="text-primary font-semibold text-xs sm:text-sm tracking-wider">
                SPORTIFY · SEMARANG
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-text mt-4 leading-tight">
                {t.title}
                <br />
                <span className="text-primary">
                  {t.highlight}
                </span>
              </h1>

              <p className="text-gray-600 mt-5 max-w-xl leading-relaxed text-sm sm:text-base">
                {t.description}
              </p>

            </div>
          </div>
        </section>

        {/* PENCARIAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">
          <div className="liquid-search-container flex items-center gap-3">

            <span className="text-xl shrink-0">⌕</span>

            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              className="w-full min-w-0 bg-transparent outline-none text-dark-text placeholder:text-gray-400 text-sm sm:text-base"
            />

            {pencarian && (
              <button
                onClick={() => setPencarian("")}
                className="text-gray-400 hover:text-primary transition shrink-0"
                aria-label={language === "en" ? "Clear search" : "Hapus pencarian"}
              >
                ✕
              </button>
            )}

          </div>
        </section>

        {/* FILTER KATEGORI */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">

          <div className="mb-6">

            <p className="text-primary font-semibold text-xs sm:text-sm mb-2 tracking-wider">
              {t.explore}
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-dark-text">
              {t.categoryTitle}
            </h2>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              {t.categoryDescription}
            </p>

          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">

            {kategoriOlahraga.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setKategoriAktif(kategori)}
                className={`liquid-filter-button shrink-0 ${
                  kategoriAktif === kategori ? "active" : ""
                }`}
              >
                {t.categories[kategori]}
              </button>
            ))}

          </div>
        </section>

        {/* DAFTAR LAPANGAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-7">

            <div>

              <p className="text-primary font-semibold text-xs sm:text-sm mb-2 tracking-wider">
                {t.searchResult}
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-dark-text">
                {t.listTitle}
              </h2>

              <p className="text-gray-500 mt-2 text-sm">
                {language === "en"
                  ? `Showing ${hasilFilter.length} ${t.resultText}.`
                  : `Menampilkan ${hasilFilter.length} ${t.resultText}.`}
              </p>

            </div>

            {(pencarian || kategoriAktif !== "Semua") && (
              <button
                onClick={resetFilter}
                className="text-primary font-semibold text-sm hover:text-secondary transition self-start"
              >
                {t.resetFilter} ↻
              </button>
            )}

          </div>

          {hasilFilter.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">

              {hasilFilter.map((lapangan) => (
                <CardLapangan
                  key={lapangan.id}
                  {...lapangan}
                />
              ))}

            </div>

          ) : (

            <div className="liquid-empty-state text-center py-14 sm:py-16 px-5">

              <div className="text-5xl mb-5">
                ⚽
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-dark-text">
                {t.emptyTitle}
              </h3>

              <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm sm:text-base">
                {t.emptyDescription}
              </p>

              <button
                onClick={resetFilter}
                className="liquid-primary-button mt-7"
              >
                {t.resetSearch}
              </button>

            </div>

          )}

        </section>
      </main>

      <Footer />
    </>
  );
}

// Halaman dengan Suspense Boundary
export default function HalamanLapangan() {
  const { language } = useLanguage();
  const t = translations[language].lapangan;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-primary font-semibold">
            {t.loading}
          </p>
        </div>
      }
    >
      <KontenHalamanLapangan />
    </Suspense>
  );
}