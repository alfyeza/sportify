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

const pilihanHarga = [
  { value: "semua", label: "Semua", labelEn: "All" },
  { value: "dibawah100k", label: "< Rp100rb", labelEn: "< Rp100k" },
  {
    value: "100k-150k",
    label: "Rp100rb - 150rb",
    labelEn: "Rp100k - 150k",
  },
  { value: "diatas150k", label: "> Rp150rb", labelEn: "> Rp150k" },
];

// Komponen utama katalog
function KontenHalamanLapangan() {
  const [pencarian, setPencarian] = useState("");
  const [kategoriPilihan, setKategoriPilihan] = useState(null);
  const [urutan, setUrutan] = useState("rekomendasi");
  const [filterHarga, setFilterHarga] = useState("semua");

  const { language } = useLanguage();
  const t = translations[language]?.lapangan || translations.id.lapangan;
  const isEnglish = language === "en";

  const searchParams = useSearchParams();
  const kategoriURL = searchParams.get("kategori");

  // Kategori aktif
  const kategoriAktif =
    kategoriPilihan ??
    (kategoriURL && kategoriOlahraga.includes(kategoriURL)
      ? kategoriURL
      : "Semua");

  // Reset semua filter
  const resetFilter = () => {
    setPencarian("");
    setKategoriPilihan("Semua");
    setUrutan("rekomendasi");
    setFilterHarga("semua");
  };

  // Mengecek apakah filter sedang digunakan
  const isFiltered =
    pencarian.trim() !== "" ||
    kategoriAktif !== "Semua" ||
    filterHarga !== "semua" ||
    urutan !== "rekomendasi";

  // Pencarian, filter, dan pengurutan
  const hasilFilter = daftarLapangan
    .filter((lapangan) => {
      const kategoriLapangan = Array.isArray(lapangan.kategori)
        ? lapangan.kategori
        : [lapangan.kategori];

      // Filter kategori
      const cocokKategori =
        kategoriAktif === "Semua" ||
        kategoriLapangan.includes(kategoriAktif);

      // Filter pencarian
      const kataKunci = pencarian.trim().toLowerCase();

      const informasiLapangan = [
        lapangan.nama,
        lapangan.lokasi,
        lapangan.alamat,
        ...(Array.isArray(lapangan.fasilitas)
          ? lapangan.fasilitas
          : []),
        ...kategoriLapangan,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const cocokPencarian = informasiLapangan.includes(kataKunci);

      // Filter harga
      const harga = Number(lapangan.harga) || 0;

      let cocokHarga = true;

      if (filterHarga === "dibawah100k") {
        cocokHarga = harga < 100000;
      } else if (filterHarga === "100k-150k") {
        cocokHarga = harga >= 100000 && harga <= 150000;
      } else if (filterHarga === "diatas150k") {
        cocokHarga = harga > 150000;
      }

      return cocokKategori && cocokPencarian && cocokHarga;
    })
    .sort((a, b) => {
      if (urutan === "termurah") {
        return Number(a.harga || 0) - Number(b.harga || 0);
      }

      if (urutan === "termahal") {
        return Number(b.harga || 0) - Number(a.harga || 0);
      }

      if (urutan === "rating") {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }

      return 0;
    });

  // Menghitung jumlah lapangan berdasarkan kategori
  const jumlahKategori = (kategori) => {
    if (kategori === "Semua") {
      return daftarLapangan.length;
    }

    return daftarLapangan.filter((lapangan) => {
      const kategoriLapangan = Array.isArray(lapangan.kategori)
        ? lapangan.kategori
        : [lapangan.kategori];

      return kategoriLapangan.includes(kategori);
    }).length;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">

        {/* HEADER KATALOG */}
        <section className="relative overflow-hidden px-4 sm:px-6 pt-12 pb-10 md:pt-20 md:pb-14">

          <div className="absolute -top-10 right-0 w-72 h-72 bg-soft-mint rounded-full blur-3xl opacity-80 pointer-events-none" />

          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto">

            <div className="liquid-catalog-header rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden">

              <div className="relative z-10 max-w-2xl">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/80 mb-5">

                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />

                  <span className="text-primary font-semibold text-xs tracking-wider">
                    SPORTIFY · SEMARANG
                  </span>

                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-text leading-tight">

                  {t.title}

                  <br />

                  <span className="text-primary">
                    {t.highlight}
                  </span>

                </h1>

                <p className="text-gray-600 mt-5 max-w-xl leading-relaxed text-sm sm:text-base">
                  {t.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-7">

                  <div className="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md border border-white/70">

                    <p className="text-xs text-gray-500">
                      {isEnglish ? "Available venues" : "Lapangan tersedia"}
                    </p>

                    <p className="text-lg font-bold text-primary">
                      {daftarLapangan.length}
                    </p>

                  </div>

                  <div className="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md border border-white/70">

                    <p className="text-xs text-gray-500">
                      {isEnglish ? "Sports categories" : "Kategori olahraga"}
                    </p>

                    <p className="text-lg font-bold text-primary">
                      {kategoriOlahraga.length - 1}
                    </p>

                  </div>

                </div>

              </div>

              {/* Dekorasi */}
              <div className="absolute -right-10 -bottom-16 text-[180px] sm:text-[230px] opacity-[0.06] rotate-12 select-none pointer-events-none">
                ⚽
              </div>

            </div>

          </div>

        </section>

        {/* PENCARIAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">

          <div className="liquid-search-container flex items-center gap-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20">

            <span className="text-2xl text-primary shrink-0">
              ⌕
            </span>

            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              className="w-full min-w-0 bg-transparent outline-none text-dark-text placeholder:text-gray-400 text-sm sm:text-base"
            />

            {pencarian && (
              <button
                type="button"
                onClick={() => setPencarian("")}
                className="text-gray-400 hover:text-primary transition shrink-0"
                aria-label={isEnglish ? "Clear search" : "Hapus pencarian"}
              >
                ✕
              </button>
            )}

          </div>

        </section>

        {/* KATEGORI OLAHRAGA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

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

          {/* Tombol Kategori */}
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">

            {kategoriOlahraga.map((kategori) => (

              <button
                key={kategori}
                type="button"
                onClick={() => setKategoriPilihan(kategori)}
                className={`liquid-filter-button shrink-0 transition-all duration-300 ${kategoriAktif === kategori ? "active" : ""
                  }`}
              >

                {t.categories[kategori]}

                <span className={`ml-2 text-xs ${kategoriAktif === kategori
                    ? "text-white/80"
                    : "text-gray-400"
                  }`}>
                  {jumlahKategori(kategori)}
                </span>

              </button>

            ))}

          </div>

        </section>

        {/* DAFTAR LAPANGAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">

          {/* FILTER DAN PENGURUTAN */}
          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm mb-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* Filter Harga */}
              <div>

                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {isEnglish ? "Filter by budget" : "Filter berdasarkan harga"}
                </p>

                <div className="flex flex-wrap items-center gap-2">

                  {pilihanHarga.map((item) => (

                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilterHarga(item.value)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${filterHarga === item.value
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                    >

                      {isEnglish ? item.labelEn : item.label}

                    </button>

                  ))}

                </div>

              </div>

              {/* Pengurutan */}
              <div className="flex flex-col gap-2">

                <label
                  htmlFor="select-urutan"
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {isEnglish ? "Sort by" : "Urutkan berdasarkan"}
                </label>

                <select
                  id="select-urutan"
                  value={urutan}
                  onChange={(e) => setUrutan(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-dark-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
                >

                  <option value="rekomendasi">
                    {isEnglish ? "Recommended" : "Rekomendasi"}
                  </option>

                  <option value="termurah">
                    {isEnglish ? "Lowest Price" : "Harga Terendah"}
                  </option>

                  <option value="termahal">
                    {isEnglish ? "Highest Price" : "Harga Tertinggi"}
                  </option>

                  <option value="rating">
                    {isEnglish ? "Highest Rating" : "Rating Tertinggi"}
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* JUDUL HASIL */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-7">

            <div>

              <p className="text-primary font-semibold text-xs sm:text-sm mb-2 tracking-wider">
                {t.searchResult}
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-dark-text">
                {t.listTitle}
              </h2>

              <p className="text-gray-500 text-sm mt-2">

                {hasilFilter.length} {t.resultText}

                {kategoriAktif !== "Semua" && ` · ${kategoriAktif}`}

                {pencarian && ` · "${pencarian}"`}

              </p>

            </div>

            {/* Reset Filter */}
            {isFiltered && (

              <button
                type="button"
                onClick={resetFilter}
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-secondary transition self-start"
              >

                <span>↻</span>

                {t.resetFilter}

              </button>

            )}

          </div>

          {/* HASIL LAPANGAN */}
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

            /* EMPTY STATE */
            <div className="liquid-empty-state text-center py-14 sm:py-16 px-5">

              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-soft-mint flex items-center justify-center text-4xl">
                ⚽
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-dark-text">
                {t.emptyTitle}
              </h3>

              <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                {t.emptyDescription}
              </p>

              <button
                type="button"
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

// Halaman utama dengan Suspense
export default function HalamanLapangan() {
  const { language } = useLanguage();
  const t = translations[language]?.lapangan || translations.id.lapangan;

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