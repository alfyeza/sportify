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

  const kategoriAktif =
    kategoriPilihan ??
    (kategoriURL && kategoriOlahraga.includes(kategoriURL)
      ? kategoriURL
      : "Semua");

  const resetFilter = () => {
    setPencarian("");
    setKategoriPilihan("Semua");
    setUrutan("rekomendasi");
    setFilterHarga("semua");
  };

  const isFiltered =
    pencarian.trim() !== "" ||
    kategoriAktif !== "Semua" ||
    filterHarga !== "semua" ||
    urutan !== "rekomendasi";

  const hasilFilter = daftarLapangan
    .filter((lapangan) => {
      const kategoriLapangan = Array.isArray(lapangan.kategori)
        ? lapangan.kategori
        : [lapangan.kategori];

      const cocokKategori =
        kategoriAktif === "Semua" ||
        kategoriLapangan.includes(kategoriAktif);

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

      <main
        className="min-h-screen sportify-catalog-page"
        style={{
          backgroundColor: "var(--bg-main)",
          color: "var(--text-main)",
        }}
      >
        {/* HEADER KATALOG */}
        <section className="relative overflow-hidden px-4 sm:px-6 pt-12 pb-10 md:pt-20 md:pb-14">
          <div
            className="absolute -top-10 right-0 w-72 h-72 rounded-full blur-3xl opacity-60 pointer-events-none"
            style={{ backgroundColor: "var(--bg-soft)" }}
          />

          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{ backgroundColor: "var(--bg-soft)" }}
          />

          <div className="relative max-w-7xl mx-auto">
            <div className="liquid-catalog-header rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden sportify-catalog-hero">
              <div className="relative z-10 max-w-2xl">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md mb-5 sportify-catalog-badge"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />

                  <span className="text-primary font-semibold text-xs tracking-wider">
                    SPORTIFY · SEMARANG
                  </span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight sportify-catalog-title"
                  style={{ color: "var(--text-main)" }}
                >
                  {t.title}
                  <br />
                  <span className="text-primary">{t.highlight}</span>
                </h1>

                <p
                  className="mt-5 max-w-xl leading-relaxed text-sm sm:text-base sportify-catalog-description"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-7">
                  <div
                    className="px-4 py-2 rounded-xl backdrop-blur-md sportify-stat-card"
                    style={{
                      backgroundColor: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {isEnglish ? "Available venues" : "Lapangan tersedia"}
                    </p>

                    <p className="text-lg font-bold text-primary">
                      {daftarLapangan.length}
                    </p>
                  </div>

                  <div
                    className="px-4 py-2 rounded-xl backdrop-blur-md sportify-stat-card"
                    style={{
                      backgroundColor: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {isEnglish ? "Sports categories" : "Kategori olahraga"}
                    </p>

                    <p className="text-lg font-bold text-primary">
                      {kategoriOlahraga.length - 1}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-10 -bottom-16 text-[180px] sm:text-[230px] opacity-[0.06] rotate-12 select-none pointer-events-none sportify-catalog-ball">
                ⚽
              </div>
            </div>
          </div>
        </section>

        {/* PENCARIAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 sportify-catalog-search">
          <div className="liquid-search-container flex items-center gap-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20">
            <span className="text-2xl text-primary shrink-0">⌕</span>

            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              className="w-full min-w-0 bg-transparent outline-none text-sm sm:text-base"
              style={{
                color: "var(--input-text)",
                backgroundColor: "transparent",
              }}
            />

            {pencarian && (
              <button
                type="button"
                onClick={() => setPencarian("")}
                className="transition shrink-0"
                style={{ color: "var(--text-muted)" }}
                aria-label={isEnglish ? "Clear search" : "Hapus pencarian"}
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* KATEGORI OLAHRAGA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sportify-catalog-category">
          <div className="mb-6">
            <p className="text-primary font-semibold text-xs sm:text-sm mb-2 tracking-wider">
              {t.explore}
            </p>

            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ color: "var(--text-main)" }}
            >
              {t.categoryTitle}
            </h2>

            <p
              className="mt-2 text-sm sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              {t.categoryDescription}
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {kategoriOlahraga.map((kategori, index) => (
              <button
                key={kategori}
                type="button"
                onClick={() => setKategoriPilihan(kategori)}
                style={{ animationDelay: `${index * 70}ms` }}
                className={`liquid-filter-button shrink-0 transition-all duration-300 sportify-category-button ${kategoriAktif === kategori ? "active" : ""
                  }`}
              >
                {t.categories[kategori]}

                <span
                  className={`ml-2 text-xs ${kategoriAktif === kategori ? "text-white/80" : ""
                    }`}
                  style={
                    kategoriAktif !== kategori
                      ? { color: "var(--text-muted)" }
                      : {}
                  }
                >
                  {jumlahKategori(kategori)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* DAFTAR LAPANGAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-20 sportify-catalog-results">
          {/* FILTER DAN PENGURUTAN */}
          <div
            className="backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-sm mb-8 sportify-filter-panel"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {isEnglish ? "Filter by budget" : "Filter berdasarkan harga"}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {pilihanHarga.map((item, index) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilterHarga(item.value)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 sportify-price-button ${filterHarga === item.value
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "border hover:border-primary hover:text-primary"
                        }`}
                      style={{
                        ...(filterHarga !== item.value
                          ? {
                            backgroundColor: "var(--bg-soft)",
                            color: "var(--text-secondary)",
                            borderColor: "var(--border-main)",
                          }
                          : {}),
                        animationDelay: `${index * 60}ms`,
                      }}
                    >
                      {isEnglish ? item.labelEn : item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="select-urutan"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {isEnglish ? "Sort by" : "Urutkan berdasarkan"}
                </label>

                <select
                  id="select-urutan"
                  value={urutan}
                  onChange={(e) => setUrutan(e.target.value)}
                  className="rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    color: "var(--input-text)",
                    border: "1px solid var(--input-border)",
                  }}
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-7 sportify-results-heading">
            <div>
              <p className="text-primary font-semibold text-xs sm:text-sm mb-2 tracking-wider">
                {t.searchResult}
              </p>

              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "var(--text-main)" }}
              >
                {t.listTitle}
              </h2>

              <p
                className="text-sm mt-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {hasilFilter.length} {t.resultText}
                {kategoriAktif !== "Semua" && ` · ${kategoriAktif}`}
                {pencarian && ` · "${pencarian}"`}
              </p>
            </div>

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
              {hasilFilter.map((lapangan, index) => (
                <div
                  key={lapangan.id}
                  className="sportify-catalog-card"
                  style={{
                    animationDelay: `${Math.min(index * 90, 900)}ms`,
                  }}
                >
                  <CardLapangan {...lapangan} />
                </div>
              ))}
            </div>
          ) : (
            <div className="liquid-empty-state text-center py-14 sm:py-16 px-5 sportify-empty-animation">
              <div
                className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center text-4xl"
                style={{ backgroundColor: "var(--bg-soft)" }}
              >
                ⚽
              </div>

              <h3
                className="text-lg sm:text-xl font-bold"
                style={{ color: "var(--text-main)" }}
              >
                {t.emptyTitle}
              </h3>

              <p
                className="mt-3 max-w-md mx-auto text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
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

      {/* ANIMASI KATALOG */}
      <style jsx global>{`
        @keyframes sportifyCatalogEnter {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes sportifyCatalogZoom {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes sportifyCatalogFloat {
          0%,
          100% {
            transform: translateY(0) rotate(12deg);
          }
          50% {
            transform: translateY(-12px) rotate(15deg);
          }
        }

        .sportify-catalog-hero {
          animation: sportifyCatalogZoom 0.8s ease-out both;
        }

        .sportify-catalog-badge {
          animation: sportifyCatalogEnter 0.6s 0.15s ease-out both;
        }

        .sportify-catalog-title {
          animation: sportifyCatalogEnter 0.7s 0.25s ease-out both;
        }

        .sportify-catalog-description {
          animation: sportifyCatalogEnter 0.7s 0.38s ease-out both;
        }

        .sportify-stat-card {
          animation: sportifyCatalogEnter 0.65s 0.5s ease-out both;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .sportify-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card);
        }

        .sportify-catalog-ball {
          animation: sportifyCatalogFloat 5s ease-in-out infinite;
        }

        .sportify-catalog-search {
          animation: sportifyCatalogEnter 0.7s 0.2s ease-out both;
        }

        .sportify-catalog-category {
          animation: sportifyCatalogEnter 0.7s 0.3s ease-out both;
        }

        .sportify-category-button {
          animation: sportifyCatalogEnter 0.5s ease-out both;
        }

        .sportify-filter-panel {
          animation: sportifyCatalogEnter 0.7s 0.2s ease-out both;
        }

        .sportify-price-button {
          animation: sportifyCatalogEnter 0.5s ease-out both;
        }

        .sportify-results-heading {
          animation: sportifyCatalogEnter 0.6s 0.3s ease-out both;
        }

        .sportify-catalog-card {
          min-width: 0;
          animation: sportifyCatalogZoom 0.65s ease-out both;
          transition:
            transform 0.35s ease,
            filter 0.35s ease;
        }

        .sportify-catalog-card:hover {
          transform: translateY(-7px);
          filter: drop-shadow(0 12px 14px rgba(20, 107, 69, 0.1));
        }

        .sportify-empty-animation {
          animation: sportifyCatalogZoom 0.5s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .sportify-catalog-page *,
          .sportify-catalog-page *::before,
          .sportify-catalog-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}

export default function HalamanLapangan() {
  const { language } = useLanguage();
  const t = translations[language]?.lapangan || translations.id.lapangan;

  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            backgroundColor: "var(--bg-main)",
            color: "var(--text-secondary)",
          }}
        >
          <p className="text-sm">{t.loading}</p>
        </div>
      }
    >
      <KontenHalamanLapangan />
    </Suspense>
  );
}