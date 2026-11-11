"use client";

import { useState, Suspense } from "react";
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
  const [kategoriPilihan, setKategoriPilihan] = useState(null);
  const [urutan, setUrutan] = useState("rekomendasi");
  const [filterHarga, setFilterHarga] = useState("semua");

  const { language } = useLanguage();
  const t = translations[language].lapangan;

  const searchParams = useSearchParams();
  const kategoriURL = searchParams.get("kategori");

  // Kategori aktif: pilihan manual atau dari URL atau default 'Semua'
  const kategoriAktif =
    kategoriPilihan ??
    (kategoriURL && kategoriOlahraga.includes(kategoriURL)
      ? kategoriURL
      : "Semua");

  // Fungsi reset filter
  const resetFilter = () => {
    setPencarian("");
    setKategoriPilihan("Semua");
    setUrutan("rekomendasi");
    setFilterHarga("semua");
  };

  const isFiltered =
    pencarian ||
    kategoriAktif !== "Semua" ||
    filterHarga !== "semua" ||
    urutan !== "rekomendasi";

  // Pencarian, filter harga, dan urutan lapangan
  const hasilFilter = daftarLapangan
    .filter((lapangan) => {
      const cocokKategori =
        kategoriAktif === "Semua" ||
        (Array.isArray(lapangan.kategori)
          ? lapangan.kategori.includes(kategoriAktif)
          : lapangan.kategori === kategoriAktif);

      const cocokPencarian =
        lapangan.nama.toLowerCase().includes(pencarian.toLowerCase()) ||
        lapangan.lokasi.toLowerCase().includes(pencarian.toLowerCase());

      const harga = Number(lapangan.harga) || 0;
      let cocokHarga = true;
      if (filterHarga === "dibawah100k") cocokHarga = harga < 100000;
      else if (filterHarga === "100k-150k") cocokHarga = harga >= 100000 && harga <= 150000;
      else if (filterHarga === "diatas150k") cocokHarga = harga > 150000;

      return cocokKategori && cocokPencarian && cocokHarga;
    })
    .sort((a, b) => {
      if (urutan === "termurah") return a.harga - b.harga;
      if (urutan === "termahal") return b.harga - a.harga;
      if (urutan === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0; // rekomendasi / default
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

        {/* KATEGORI */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

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
                onClick={() => setKategoriPilihan(kategori)}
                className={`liquid-filter-button shrink-0 ${kategoriAktif === kategori ? "active" : ""
                  }`}
              >
                {t.categories[kategori]}
              </button>
            ))}

          </div>
        </section>

        {/* DAFTAR LAPANGAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">

          {/* BAR FILTER HARGA & URUTKAN */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7 bg-white/80 p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm backdrop-blur-sm">
            {/* Filter Harga */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
                {language === "en" ? "Budget:" : "Harga:"}
              </span>
              {[
                { value: "semua", label: language === "en" ? "All" : "Semua" },
                { value: "dibawah100k", label: "< Rp100rb" },
                { value: "100k-150k", label: "Rp100rb - 150rb" },
                { value: "diatas150k", label: "> Rp150rb" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilterHarga(item.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filterHarga === item.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Urutkan */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <label htmlFor="select-urutan" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {language === "en" ? "Sort:" : "Urutkan:"}
              </label>
              <select
                id="select-urutan"
                value={urutan}
                onChange={(e) => setUrutan(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-dark-text outline-none focus:border-primary cursor-pointer shadow-sm"
              >
                <option value="rekomendasi">{language === "en" ? " Recommendation" : " Rekomendasi"}</option>
                <option value="termurah">{language === "en" ? " Lowest Price" : " Harga Terendah"}</option>
                <option value="termahal">{language === "en" ? " Highest Price" : " Harga Tertinggi"}</option>
                <option value="rating">{language === "en" ? " Top Rated" : " Rating Tertinggi"}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-7">

            <div>

              <p className="text-primary font-semibold text-xs sm:text-sm mb-2 tracking-wider">
                {t.searchResult}
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-dark-text">
                {t.listTitle}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {hasilFilter.length} {t.resultText}
                {kategoriAktif !== "Semua" && ` · ${kategoriAktif}`}
                {pencarian && ` · "${pencarian}"`}
              </p>

            </div>

            {isFiltered && (
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
                className="liquid-booking-button inline-block mt-6"
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

export default function HalamanLapangan() {
  const { language } = useLanguage();
  const t = translations[language].lapangan;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-gray-500 text-sm">
            {t.loading}
          </p>
        </div>
      }
    >
      <KontenHalamanLapangan />
    </Suspense>
  );
}
