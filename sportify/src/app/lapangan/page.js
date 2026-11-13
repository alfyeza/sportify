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
  const [lapanganList, setLapanganList] = useState(daftarLapangan);
  const [loadingDb, setLoadingDb] = useState(false);
  const [pencarian, setPencarian] = useState("");
  const [kategoriPilihan, setKategoriPilihan] = useState(null);
  const [urutan, setUrutan] = useState("rekomendasi");
  const [filterHarga, setFilterHarga] = useState("semua");

  const { language } = useLanguage();
  const t = translations[language]?.lapangan || translations.id.lapangan;
  const isEnglish = language === "en";

  // Ambil data lapangan secara dinamis dari database
  useEffect(() => {
    const fetchVenuesFromDb = async () => {
      try {
        setLoadingDb(true);
        const res = await fetch("/api/lapangan");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLapanganList(json.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data lapangan dari database:", err);
      } finally {
        setLoadingDb(false);
      }
    };

    fetchVenuesFromDb();
  }, []);

  // Kategori dinamis (menggabungkan default dengan kategori baru dari database)
  const kategoriDinamis = [
    "Semua",
    ...Array.from(
      new Set([
        ...kategoriOlahraga.filter((k) => k !== "Semua"),
        ...lapanganList.flatMap((item) =>
          Array.isArray(item.kategori) ? item.kategori : [item.kategori]
        ).filter(Boolean),
      ])
    ),
  ];

  const searchParams = useSearchParams();
  const kategoriURL = searchParams.get("kategori");

  const kategoriAktif =
    kategoriPilihan ??
    (kategoriURL && kategoriDinamis.includes(kategoriURL)
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

  const hasilFilter = lapanganList
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
      return lapanganList.length;
    }

    return lapanganList.filter((lapangan) => {
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
        className="min-h-screen"
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
            <div className="liquid-catalog-header rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md mb-5"
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
                  className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                  style={{ color: "var(--text-main)" }}
                >
                  {t.title}
                  <br />
                  <span className="text-primary">{t.highlight}</span>
                </h1>

                <p
                  className="mt-5 max-w-xl leading-relaxed text-sm sm:text-base"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-7">
                  <div
                    className="px-4 py-2 rounded-xl backdrop-blur-md"
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
                      {lapanganList.length}
                    </p>
                  </div>

                  <div
                    className="px-4 py-2 rounded-xl backdrop-blur-md"
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
                      {kategoriDinamis.length - 1}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-10 -bottom-16 text-[180px] sm:text-[230px] opacity-[0.06] rotate-12 select-none pointer-events-none">
                ⚽
              </div>
            </div>
          </div>
        </section>

        {/* PENCARIAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
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
            {kategoriDinamis.map((kategori) => (
              <button
                key={kategori}
                type="button"
                onClick={() => setKategoriPilihan(kategori)}
                className={`liquid-filter-button shrink-0 transition-all duration-300 ${kategoriAktif === kategori ? "active" : ""
                  }`}
              >
                {t.categories?.[kategori] || kategori}

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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">
          {/* FILTER DAN PENGURUTAN */}
          <div
            className="backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-sm mb-8"
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
                  {pilihanHarga.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilterHarga(item.value)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${filterHarga === item.value
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "border hover:border-primary hover:text-primary"
                        }`}
                      style={
                        filterHarga !== item.value
                          ? {
                            backgroundColor: "var(--bg-soft)",
                            color: "var(--text-secondary)",
                            borderColor: "var(--border-main)",
                          }
                          : {}
                      }
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-7">
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
              {hasilFilter.map((lapangan) => (
                <CardLapangan key={lapangan.id} {...lapangan} />
              ))}
            </div>
          ) : (
            <div className="liquid-empty-state text-center py-14 sm:py-16 px-5">
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