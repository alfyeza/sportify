"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { daftarLapangan } from "@/lib/lapangan";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/translations";

export default function BookingLapanganPage() {
  const params = useParams();
  const router = useRouter();

  const { language } = useLanguage();
  const isEnglish = language === "en";

  const t = translations[language]?.booking || translations.id.booking;

  const [unit, setUnit] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [durasi, setDurasi] = useState("1");
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [filterWaktu, setFilterWaktu] = useState("Semua Waktu");
  const [filterCabor, setFilterCabor] = useState("Semua");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const getTanggalHariIni = () => {
    const sekarang = new Date();
    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
    const tanggal = String(sekarang.getDate()).padStart(2, "0");

    return `${tahun}-${bulan}-${tanggal}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      const bookingPath = `/lapangan/${params.id}/booking`;

      router.replace(
        `/login?redirect=${encodeURIComponent(bookingPath)}`
      );

      return;
    }

    setTanggal(getTanggalHariIni());
    setIsCheckingAuth(false);
  }, [params.id, router]);

  const lapangan = daftarLapangan.find(
    (item) => String(item.id) === String(params.id)
  );

  const formatRupiah = (nominal) => {
    return `Rp ${Number(nominal || 0).toLocaleString("id-ID")}`;
  };

  const formatTanggal = (value) => {
    if (!value) return "-";

    const date = new Date(`${value}T00:00:00`);

    return date.toLocaleDateString(isEnglish ? "en-US" : "id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isCheckingAuth) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background flex items-center justify-center px-5">
          <div className="text-center booking-fade-up">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              {isEnglish
                ? "Checking account access..."
                : "Memeriksa akses akun..."}
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!lapangan) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background flex items-center justify-center px-5">
          <div className="text-center booking-fade-up">
            <h1 className="text-2xl font-bold text-dark-text">
              {isEnglish ? "Court not found" : "Lapangan tidak ditemukan"}
            </h1>

            <p className="mt-2 text-gray-500">
              {isEnglish
                ? "The court you are looking for is unavailable."
                : "Lapangan yang kamu cari tidak tersedia."}
            </p>

            <Link
              href="/lapangan"
              className="inline-flex mt-6 rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-secondary transition"
            >
              {isEnglish ? "Back to courts" : "Kembali ke lapangan"}
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const daftarUnit = lapangan.unitLapangan || [];

  const daftarJam = Array.from({ length: 15 }, (_, index) => {
    return `${String(index + 8).padStart(2, "0")}:00`;
  });

  const kategoriLapangan = Array.isArray(lapangan.kategori)
    ? lapangan.kategori
    : lapangan.kategori
      ? [lapangan.kategori]
      : [];

  const daftarTanggal = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    const tahun = date.getFullYear();
    const bulan = String(date.getMonth() + 1).padStart(2, "0");
    const hari = String(date.getDate()).padStart(2, "0");

    return {
      value: `${tahun}-${bulan}-${hari}`,
      namaHari: date.toLocaleDateString(
        isEnglish ? "en-US" : "id-ID",
        { weekday: "short" }
      ),
      tanggal: date.getDate(),
      bulan: date.toLocaleDateString(
        isEnglish ? "en-US" : "id-ID",
        { month: "short" }
      ),
    };
  });

  const daftarJamFilter = daftarJam.filter((waktu) => {
    const jamAngka = Number(waktu.split(":")[0]);

    if (filterWaktu === "Pagi") return jamAngka >= 6 && jamAngka < 12;
    if (filterWaktu === "Siang") return jamAngka >= 12 && jamAngka < 18;
    if (filterWaktu === "Malam") return jamAngka >= 18;

    return true;
  });

  const daftarUnitFilter = daftarUnit.filter((item) => {
    if (filterCabor === "Semua") return true;

    const kategoriUnit = Array.isArray(item.kategori)
      ? item.kategori
      : item.kategori
        ? [item.kategori]
        : [];

    if (kategoriUnit.length === 0) return true;

    return kategoriUnit.includes(filterCabor);
  });

  // Simulasi jadwal yang sudah dipesan.
  // Nantinya dapat diganti dengan data backend.
  const jamSudahDipesan = (indexUnit, indexJam) => {
    return (indexUnit + indexJam) % 5 === 1;
  };

  const formatJamSelesai = (jamMulai) => {
    if (!jamMulai) return "-";

    const jamAngka = Number(jamMulai.split(":")[0]);
    const jamSelesai = jamAngka + Number(durasi);

    return `${String(jamSelesai).padStart(2, "0")}:00`;
  };

  const totalHarga = Number(lapangan.harga || 0) * Number(durasi);

  const lanjutBooking = () => {
    if (!unit || !tanggal || !jam || !durasi) {
      alert(
        isEnglish
          ? "Please complete all booking details."
          : "Lengkapi pilihan lapangan, tanggal, jam, dan durasi terlebih dahulu."
      );
      return;
    }

    const query = new URLSearchParams({
      lapangan: String(lapangan.id),
      unit,
      tanggal,
      jam,
      durasi,
    });

    router.push(`/booking?${query.toString()}`);
  };

  const filterWaktuOptions = [
    { value: "Semua Waktu", label: t.allTimes },
    { value: "Pagi", label: t.morning },
    { value: "Siang", label: t.afternoon },
    { value: "Malam", label: t.evening },
  ];

  const pilihUnit = (namaUnit) => {
    setUnit(namaUnit);
    setJam("");
  };

  return (
    <>
      <Navbar />

      <main className="booking-animate min-h-screen bg-background pb-20">
        {/* HEADER */}
        <section className="booking-header relative overflow-hidden bg-gradient-to-br from-soft-mint via-background to-white">
          <div className="booking-glow absolute -top-20 -right-20 w-72 h-72 rounded-full bg-secondary/10 blur-3xl" />
          <div className="booking-glow booking-glow-delay absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-8 pb-10">
            <Link
              href={`/lapangan/${lapangan.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary transition"
            >
              <span className="text-lg">‹</span>
              {t.backToDetail}
            </Link>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
              <div className="booking-fade-up">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-primary/10 px-4 py-2 text-xs font-semibold text-primary shadow-sm backdrop-blur-lg">
                  <span className="w-2 h-2 rounded-full bg-secondary booking-pulse" />
                  {t.headerLabel}
                </div>

                <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-dark-text">
                  {t.title}
                </h1>

                <p className="mt-3 max-w-xl text-sm md:text-base leading-relaxed text-gray-600">
                  {t.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {kategoriLapangan.map((kategori, index) => (
                    <span
                      key={kategori}
                      style={{ animationDelay: `${index * 100}ms` }}
                      className="booking-chip rounded-full bg-soft-mint px-4 py-2 text-xs font-semibold text-primary"
                    >
                      {kategori}
                    </span>
                  ))}
                </div>
              </div>

              <div className="booking-selected-card rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl p-5 shadow-lg shadow-primary/5 md:min-w-[260px]">
                <p className="text-xs font-medium text-gray-500">
                  {isEnglish ? "Selected court" : "Lapangan pilihan"}
                </p>

                <h2 className="mt-2 text-xl font-bold text-dark-text">
                  {lapangan.nama}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {lapangan.lokasi}
                </p>

                <div className="mt-4 border-t border-primary/10 pt-4">
                  <p className="text-xs text-gray-500">
                    {isEnglish ? "Starting from" : "Mulai dari"}
                  </p>

                  <p className="mt-1 text-xl font-bold text-primary">
                    {formatRupiah(lapangan.harga)}
                    <span className="text-xs font-medium text-gray-400">
                      {" "}
                      / {isEnglish ? "hour" : "jam"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-7 items-start">
            {/* BAGIAN KIRI */}
            <div className="space-y-7">
              {/* PILIH TANGGAL */}
              <section className="liquid-booking-page-card booking-card-enter p-5 md:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-soft-mint text-xl booking-icon">
                    📅
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-dark-text">
                      {isEnglish ? "Choose a date" : "Pilih Tanggal"}
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                      {isEnglish
                        ? "Select your preferred booking date"
                        : "Tentukan tanggal bermain yang kamu inginkan"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {daftarTanggal.map((item, index) => {
                    const aktif = tanggal === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        style={{ animationDelay: `${index * 60}ms` }}
                        onClick={() => {
                          setTanggal(item.value);
                          setJam("");
                        }}
                        className={`booking-date-button rounded-2xl border px-2 py-4 text-center transition-all ${aktif
                          ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                          : "border-gray-100 bg-background text-dark-text hover:border-secondary hover:bg-soft-mint"
                          }`}
                      >
                        <span
                          className={`block text-xs ${aktif ? "text-white/80" : "text-gray-400"
                            }`}
                        >
                          {item.namaHari}
                        </span>

                        <span className="block my-1 text-xl font-bold">
                          {item.tanggal}
                        </span>

                        <span
                          className={`block text-xs ${aktif ? "text-white/80" : "text-gray-400"
                            }`}
                        >
                          {item.bulan}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-semibold text-dark-text mb-2">
                    {isEnglish
                      ? "Or choose another date"
                      : "Atau pilih tanggal lainnya"}
                  </label>

                  <input
                    type="date"
                    value={tanggal}
                    min={getTanggalHariIni()}
                    onChange={(e) => {
                      setTanggal(e.target.value);
                      setJam("");
                    }}
                    className="liquid-booking-input w-full sm:w-auto"
                  />
                </div>
              </section>

              {/* PILIH LAPANGAN */}
              <section className="liquid-booking-page-card booking-card-enter p-5 md:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-dark-text">
                      {isEnglish ? "Available courts" : "Pilih Lapangan"}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {isEnglish
                        ? "Choose a court and its available schedule"
                        : "Pilih unit lapangan dan jadwal yang tersedia"}
                    </p>
                  </div>

                  <span className="rounded-full bg-soft-mint px-4 py-2 text-xs font-semibold text-primary">
                    {formatTanggal(tanggal)}
                  </span>
                </div>

                {/* FILTER */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">
                      {isEnglish ? "Time" : "Waktu"}
                    </label>

                    <select
                      value={filterWaktu}
                      onChange={(e) => setFilterWaktu(e.target.value)}
                      className="liquid-booking-input w-full"
                    >
                      {filterWaktuOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {kategoriLapangan.length > 1 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2">
                        {isEnglish ? "Sport category" : "Kategori Olahraga"}
                      </label>

                      <select
                        value={filterCabor}
                        onChange={(e) => setFilterCabor(e.target.value)}
                        className="liquid-booking-input w-full"
                      >
                        <option value="Semua">
                          {isEnglish ? "All categories" : "Semua"}
                        </option>

                        {kategoriLapangan.map((kategori) => (
                          <option key={kategori} value={kategori}>
                            {kategori}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* LEGENDA */}
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-primary" />
                    {isEnglish ? "Selected" : "Dipilih"}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded border border-secondary bg-soft-mint" />
                    {isEnglish ? "Available" : "Tersedia"}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-gray-200" />
                    {isEnglish ? "Booked" : "Sudah dipesan"}
                  </div>
                </div>

                {/* DAFTAR UNIT */}
                <div className="mt-5 space-y-4">
                  {daftarUnitFilter.length === 0 ? (
                    <div className="rounded-2xl bg-background p-8 text-center">
                      <p className="font-semibold text-dark-text">
                        {isEnglish
                          ? "No courts found"
                          : "Tidak ada lapangan ditemukan"}
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {isEnglish
                          ? "Try another category."
                          : "Coba pilih kategori lainnya."}
                      </p>
                    </div>
                  ) : (
                    daftarUnitFilter.map((item, index) => {
                      const namaUnit =
                        item.nama || item.namaUnit || item.unit;

                      const indexUnit = daftarUnit.indexOf(item);
                      const isExpanded = expandedUnit === namaUnit;
                      const isSelected = unit === namaUnit;

                      return (
                        <div
                          key={namaUnit}
                          style={{ animationDelay: `${index * 100}ms` }}
                          className={`booking-unit-card overflow-hidden rounded-3xl border transition-all ${isSelected
                            ? "border-primary bg-soft-mint/50 shadow-md shadow-primary/5"
                            : "border-gray-100 bg-white hover:border-secondary/50"
                            }`}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
                            {/* FOTO UNIT */}
                            <div className="booking-unit-image relative h-48 sm:h-full min-h-[190px] bg-soft-mint">
                              <Image
                                src={item.gambar || lapangan.gambar}
                                alt={namaUnit}
                                fill
                                sizes="(max-width: 640px) 100vw, 180px"
                                className="object-cover"
                              />

                              <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                                {item.kategori ||
                                  kategoriLapangan[0] ||
                                  "Court"}
                              </div>
                            </div>

                            {/* INFO UNIT */}
                            <div className="p-5">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div>
                                  <h3 className="text-lg font-bold text-dark-text">
                                    {namaUnit}
                                  </h3>

                                  <p className="mt-1 text-sm text-gray-500">
                                    {lapangan.nama}
                                  </p>

                                  <p className="mt-3 text-sm font-semibold text-primary">
                                    {formatRupiah(lapangan.harga)}
                                    <span className="font-normal text-gray-400">
                                      {" "}
                                      / {isEnglish ? "hour" : "jam"}
                                    </span>
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => pilihUnit(namaUnit)}
                                  className={`booking-select-button rounded-full px-5 py-2.5 text-sm font-semibold transition ${isSelected
                                    ? "bg-primary text-white"
                                    : "border border-primary text-primary hover:bg-soft-mint"
                                    }`}
                                >
                                  {isSelected
                                    ? isEnglish
                                      ? "Selected"
                                      : "Dipilih"
                                    : isEnglish
                                      ? "Choose court"
                                      : "Pilih Lapangan"}
                                </button>
                              </div>

                              <div className="mt-5 border-t border-primary/10 pt-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedUnit(
                                      isExpanded ? null : namaUnit
                                    )
                                  }
                                  className="flex w-full items-center justify-between text-sm font-semibold text-dark-text hover:text-primary transition"
                                >
                                  <span>
                                    {isEnglish
                                      ? "View available schedule"
                                      : "Lihat jadwal tersedia"}
                                  </span>

                                  <span className="text-lg text-primary">
                                    {isExpanded ? "−" : "+"}
                                  </span>
                                </button>

                                {isExpanded && (
                                  <div className="booking-schedule-enter mt-4">
                                    <p className="mb-3 text-xs text-gray-500">
                                      {isEnglish
                                        ? "Select your preferred starting time."
                                        : "Pilih jam mulai yang kamu inginkan."}
                                    </p>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                      {daftarJamFilter.map((waktu) => {
                                        const indexJam =
                                          daftarJam.indexOf(waktu);

                                        const sudahDipesan =
                                          jamSudahDipesan(
                                            indexUnit,
                                            indexJam
                                          );

                                        const isJamSelected =
                                          isSelected && jam === waktu;

                                        return (
                                          <button
                                            key={waktu}
                                            type="button"
                                            disabled={sudahDipesan}
                                            onClick={() => {
                                              setUnit(namaUnit);
                                              setJam(waktu);
                                            }}
                                            className={`booking-time-button rounded-xl border px-2 py-3 text-xs font-semibold transition ${sudahDipesan
                                              ? "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-300"
                                              : isJamSelected
                                                ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                                                : "border-secondary/20 bg-soft-mint/60 text-primary hover:border-secondary hover:bg-soft-mint"
                                              }`}
                                          >
                                            {waktu}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            {/* RINGKASAN BOOKING */}
            <aside className="booking-summary-enter lg:sticky lg:top-24 self-start min-w-0">
              <div className="liquid-booking-summary w-full">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary p-6 text-white">
                  <div className="booking-summary-glow absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                  <div className="relative">
                    <p className="text-sm text-white/80">
                      {isEnglish ? "Your booking" : "Booking Kamu"}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      {isEnglish ? "Booking Summary" : "Ringkasan Booking"}
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-white/80">
                      {isEnglish
                        ? "Check your booking details before continuing."
                        : "Periksa kembali detail pesanan sebelum melanjutkan."}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        {isEnglish ? "Court" : "Lapangan"}
                      </p>

                      <p className="mt-1 font-semibold text-dark-text">
                        {lapangan.nama}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-400">
                        {isEnglish ? "Court unit" : "Unit Lapangan"}
                      </p>

                      <p className="mt-1 font-semibold text-dark-text">
                        {unit || "-"}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-400">
                        {isEnglish ? "Date" : "Tanggal"}
                      </p>

                      <p className="mt-1 font-semibold text-dark-text">
                        {formatTanggal(tanggal)}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-400">
                        {isEnglish ? "Time" : "Jam"}
                      </p>

                      <p className="mt-1 font-semibold text-dark-text">
                        {jam
                          ? `${jam} - ${formatJamSelesai(jam)}`
                          : "-"}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <label
                        htmlFor="durasi"
                        className="block text-xs text-gray-400"
                      >
                        {isEnglish ? "Duration" : "Durasi"}
                      </label>

                      <select
                        id="durasi"
                        value={durasi}
                        onChange={(e) => setDurasi(e.target.value)}
                        className="liquid-booking-input mt-2 w-full"
                      >
                        {[1, 2, 3, 4].map((angka) => (
                          <option key={angka} value={String(angka)}>
                            {angka} {isEnglish ? "hour(s)" : "jam"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="booking-price-box mt-6 rounded-2xl bg-soft-mint p-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {isEnglish ? "Price per hour" : "Harga per jam"}
                      </span>

                      <span>{formatRupiah(lapangan.harga)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                      <span>{isEnglish ? "Duration" : "Durasi"}</span>

                      <span>
                        {durasi} {isEnglish ? "hour(s)" : "jam"}
                      </span>
                    </div>

                    <div className="my-3 border-t border-primary/15" />

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-dark-text">
                        {isEnglish ? "Total price" : "Total Harga"}
                      </span>

                      <span className="text-xl font-bold text-primary">
                        {formatRupiah(totalHarga)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={lanjutBooking}
                    className="liquid-booking-button booking-continue-button mt-5 flex w-full items-center justify-center gap-2"
                  >
                    {isEnglish ? "Continue booking" : "Lanjutkan Booking"}
                    <span className="text-lg">›</span>
                  </button>

                  <p className="mt-4 text-center text-xs leading-relaxed text-gray-400">
                    {t.simulation}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <style jsx global>{`
          @keyframes bookingFadeUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bookingFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes bookingFloat {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }

          @keyframes bookingPulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(0.75);
            }
          }

          .booking-fade-up {
            animation: bookingFadeUp 0.8s ease both;
          }

          .booking-header {
            animation: bookingFadeIn 0.8s ease both;
          }

          .booking-selected-card {
            animation: bookingFadeUp 0.8s ease 0.15s both;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .booking-selected-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 18px 40px rgba(20, 107, 69, 0.12);
          }

          .booking-glow {
            animation: bookingFloat 7s ease-in-out infinite;
            pointer-events: none;
          }

          .booking-glow-delay {
            animation-delay: -3s;
          }

          .booking-pulse {
            animation: bookingPulse 2s ease-in-out infinite;
          }

          .booking-chip {
            animation: bookingFadeUp 0.5s ease both;
          }

          .booking-card-enter {
            animation: bookingFadeUp 0.75s ease both;
          }

          .booking-animate > div > div > div > section:nth-child(1) {
            animation-delay: 0.1s;
          }

          .booking-animate > div > div > div > section:nth-child(2) {
            animation-delay: 0.22s;
          }

          .booking-icon {
            transition: transform 0.3s ease;
          }

          .liquid-booking-page-card:hover .booking-icon {
            transform: rotate(-6deg) scale(1.08);
          }

          .booking-date-button {
            animation: bookingFadeUp 0.45s ease both;
          }

          .booking-date-button:hover {
            transform: translateY(-4px);
          }

          .booking-unit-card {
            animation: bookingFadeUp 0.55s ease both;
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease,
              border-color 0.3s ease;
          }

          .booking-unit-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 14px 30px rgba(20, 107, 69, 0.08);
          }

          .booking-unit-image {
            overflow: hidden;
          }

          .booking-unit-image img {
            transition: transform 0.65s cubic-bezier(0.2, 0.7, 0.3, 1);
          }

          .booking-unit-card:hover .booking-unit-image img {
            transform: scale(1.06);
          }

          .booking-select-button,
          .booking-time-button,
          .booking-continue-button {
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease,
              background-color 0.25s ease;
          }

          .booking-select-button:hover:not(:disabled),
          .booking-time-button:hover:not(:disabled) {
            transform: translateY(-2px);
          }

          .booking-time-button:active:not(:disabled),
          .booking-select-button:active:not(:disabled) {
            transform: scale(0.96);
          }

          .booking-schedule-enter {
            animation: bookingFadeUp 0.35s ease both;
          }

          .booking-summary-enter {
            animation: bookingFadeUp 0.8s ease 0.3s both;
          }

          .booking-summary-glow {
            animation: bookingFloat 6s ease-in-out infinite;
          }

          .booking-price-box {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .booking-price-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(20, 107, 69, 0.08);
          }

          .booking-continue-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(20, 107, 69, 0.2);
          }

          .booking-continue-button:active {
            transform: scale(0.98);
          }

          @media (prefers-reduced-motion: reduce) {
            .booking-animate *,
            .booking-animate *::before,
            .booking-animate *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}