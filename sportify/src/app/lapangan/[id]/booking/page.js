"use client";

import { useState } from "react";
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
  const t = translations[language]?.booking || translations.id.booking;

  const lapangan = daftarLapangan.find(
    (item) => String(item.id) === String(params.id)
  );

  const getTanggalHariIni = () => {
    const today = new Date();
    const tahun = today.getFullYear();
    const bulan = String(today.getMonth() + 1).padStart(2, "0");
    const tanggal = String(today.getDate()).padStart(2, "0");

    return `${tahun}-${bulan}-${tanggal}`;
  };

  const [unit, setUnit] = useState("");
  const [tanggal, setTanggal] = useState(getTanggalHariIni());
  const [jam, setJam] = useState("");
  const [durasi, setDurasi] = useState("1");
  const [expandedUnit, setExpandedUnit] = useState(null);

  const [filterWaktu, setFilterWaktu] = useState("Semua Waktu");
  const [filterCabor, setFilterCabor] = useState("Semua");

  if (!lapangan) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="liquid-info-card text-center max-w-md w-full p-6">
            <h1 className="text-2xl font-bold text-dark-text">
              {t.notFound}
            </h1>
            <Link
              href="/lapangan"
              className="liquid-booking-button inline-block mt-5"
            >
              {t.backToList}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const daftarUnit = lapangan.unitLapangan || [];

  const daftarJam = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00",
  ];

  const kategoriLapangan = Array.isArray(lapangan.kategori)
    ? lapangan.kategori
    : [lapangan.kategori];

  const daftarTanggal = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);

    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      hari: date.toLocaleDateString(
        language === "en" ? "en-US" : "id-ID",
        { weekday: "short" }
      ),
      tanggal: date.getDate(),
      bulan: date.toLocaleDateString(
        language === "en" ? "en-US" : "id-ID",
        { month: "short" }
      ),
    };
  });

  const daftarJamFilter = daftarJam.filter((item) => {
    const angka = Number(item.split(":")[0]);

    if (filterWaktu === "Pagi") return angka >= 6 && angka < 12;
    if (filterWaktu === "Siang") return angka >= 12 && angka < 18;
    if (filterWaktu === "Malam") return angka >= 18;

    return true;
  });

  const daftarUnitFilter = daftarUnit.filter((item) => {
    if (filterCabor === "Semua" || !item.kategori) return true;

    const kategori = Array.isArray(item.kategori)
      ? item.kategori
      : [item.kategori];

    return kategori.includes(filterCabor);
  });

  // SIMULASI JADWAL BOOKING
  // Belum terhubung dengan database.

  const jamSudahDipesan = (indexUnit, indexJam) => {
    return (indexUnit + indexJam) % 5 === 1;
  };

  function formatJamSelesai(jamMulai) {
    const angka = Number(jamMulai.split(":")[0]) + 1;
    return `${String(angka).padStart(2, "0")}:00`;
  }

  const totalHarga = lapangan.harga * Number(durasi);

  function lanjutBooking() {
    if (!unit || !tanggal || !jam || !durasi) {
      alert(t.alert);
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
  }

  const filterWaktuOptions = [
    { value: "Semua Waktu", label: t.allTimes },
    { value: "Pagi", label: t.morning },
    { value: "Siang", label: t.afternoon },
    { value: "Malam", label: t.evening },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">

          {/* KEMBALI */}
          <Link
            href={`/lapangan/${lapangan.id}`}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm"
          >
            ← {t.backToDetail}
          </Link>

          {/* HEADER */}
          <div className="mt-7 mb-6">
            <p className="text-primary font-semibold text-sm mb-2">
              {t.headerLabel}
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-dark-text">
              {t.title}
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              {t.description}
            </p>
          </div>

          {/* PILIH TANGGAL */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {daftarTanggal.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setTanggal(item.value);
                      setJam("");
                    }}
                    className={`min-w-[65px] px-3 py-3 rounded-xl text-center transition ${
                      tanggal === item.value
                        ? "bg-primary text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-soft-mint"
                    }`}
                  >
                    <p className="text-xs">{item.hari}</p>
                    <p className="font-bold text-sm mt-1">
                      {item.tanggal}
                    </p>
                    <p className="text-xs mt-1">{item.bulan}</p>
                  </button>
                ))}

                <input
                  type="date"
                  value={tanggal}
                  min={getTanggalHariIni()}
                  onChange={(e) => {
                    setTanggal(e.target.value);
                    setJam("");
                  }}
                  className="border border-gray-200 rounded-lg p-2 text-xs w-36 shrink-0"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={filterWaktu}
                  onChange={(e) => setFilterWaktu(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {filterWaktuOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filterCabor}
                  onChange={(e) => setFilterCabor(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="Semua">{t.allCategories}</option>
                  {kategoriLapangan.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DAFTAR COURT */}
          <div className="space-y-5">

            {daftarUnitFilter.map((item, index) => {
              const unitTerpilih = unit === item.nama;

              const jadwalTersedia = daftarJamFilter.filter((itemJam) => {
                const indexAsli = daftarJam.indexOf(itemJam);
                return !jamSudahDipesan(index, indexAsli);
              }).length;

              const jadwalTerbuka = expandedUnit === item.nama;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition ${
                    unitTerpilih
                      ? "border-primary ring-1 ring-primary"
                      : "border-gray-100"
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">

                    {/* FOTO DAN INFORMASI COURT */}
                    <div className="p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-gray-100">

                      <div className="relative h-48 sm:h-52 lg:h-44 rounded-xl overflow-hidden">
                        <Image
                          src={item.gambar || lapangan.gambar}
                          alt={item.nama}
                          fill
                          sizes="(max-width: 1024px) 100vw, 320px"
                          className="object-cover"
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setUnit(item.nama)}
                          className="text-left w-full"
                        >
                          <h2 className="font-bold text-dark-text text-lg hover:text-primary">
                            {item.nama}{" "}
                            <span className="text-primary">›</span>
                          </h2>
                        </button>

                        <p className="text-xs text-gray-500 mt-2">
                          {lapangan.nama}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">
                          {kategoriLapangan.join(", ")}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">
                          {lapangan.lokasi}
                        </p>

                        <p className="text-sm font-bold text-primary mt-3">
                          Rp{lapangan.harga.toLocaleString("id-ID")}
                          <span className="text-xs text-gray-400 font-normal">
                            {" "}/ {t.session.toLowerCase()}
                          </span>
                        </p>

                        {unitTerpilih && (
                          <span className="inline-block mt-3 text-xs bg-soft-mint text-primary font-semibold px-3 py-2 rounded-lg">
                            ✓ {t.selected}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* BAGIAN JADWAL */}
                    <div className="p-4 sm:p-5">

                      {/* TOMBOL JADWAL */}
                      <div className="flex flex-wrap justify-between items-center gap-3">
                        <div>
                          <h3 className="font-bold text-dark-text">
                            {item.nama}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            {t.playingSchedule}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedUnit(
                              jadwalTerbuka ? null : item.nama
                            )
                          }
                          className="bg-primary hover:bg-secondary text-white rounded-lg px-5 py-3 flex items-center gap-2 text-xs sm:text-sm font-semibold transition"
                        >
                          {jadwalTersedia} {t.availableSchedules}

                          <span>
                            {jadwalTerbuka ? "⌃" : "⌄"}
                          </span>
                        </button>
                      </div>

                      {/* JADWAL MUNCUL SETELAH TOMBOL DIKLIK */}
                      {jadwalTerbuka && (
                        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">

                          {daftarJamFilter.map((itemJam) => {
                            const indexAsli = daftarJam.indexOf(itemJam);

                            const booked = jamSudahDipesan(index, indexAsli);

                            const jamDipilih =
                              unit === item.nama && jam === itemJam;

                            return (
                              <button
                                key={itemJam}
                                type="button"
                                disabled={booked}
                                onClick={() => {
                                  setUnit(item.nama);
                                  setJam(itemJam);
                                }}
                                className={`min-h-[76px] rounded-xl border p-3 text-center transition ${
                                  booked
                                    ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                    : jamDipilih
                                    ? "bg-primary border-primary text-white shadow-md"
                                    : "bg-white border-gray-200 hover:border-primary hover:bg-soft-mint"
                                }`}
                              >
                                <p className="text-[10px] opacity-70">
                                  {t.minutes}
                                </p>

                                <p className="text-sm font-bold mt-1">
                                  {itemJam} - {formatJamSelesai(itemJam)}
                                </p>

                                {booked ? (
                                  <p className="text-xs mt-1">
                                    {t.booked}
                                  </p>
                                ) : (
                                  <p className="text-xs mt-1">
                                    Rp{lapangan.harga.toLocaleString("id-ID")}
                                  </p>
                                )}
                              </button>
                            );
                          })}

                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}

            {daftarUnitFilter.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
                {t.noUnits}
              </div>
            )}

          </div>

          {/* RINGKASAN BOOKING */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mt-7">

            <h2 className="text-lg font-bold text-dark-text mb-5">
              {t.summary}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <div>
                <p className="text-xs text-gray-400">{t.place}</p>
                <p className="font-semibold text-dark-text mt-1">
                  {lapangan.nama}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">{t.courtUnit}</p>
                <p className="font-semibold text-dark-text mt-1">
                  {unit || t.notSelected}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">{t.dateTime}</p>
                <p className="font-semibold text-dark-text mt-1">
                  {tanggal} {jam && `· ${jam}`}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">{t.duration}</p>
                <select
                  value={durasi}
                  onChange={(e) => setDurasi(e.target.value)}
                  className="border border-gray-200 rounded-lg p-2 mt-1 text-sm w-full"
                >
                  {[1, 2, 3, 4].map((jumlah) => (
                    <option key={jumlah} value={jumlah}>
                      {jumlah} {t.session}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="border-t border-gray-100 mt-6 pt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

              <div>
                <p className="text-sm text-gray-500">
                  {t.estimatedTotal}
                </p>

                <p className="text-2xl font-bold text-primary mt-1">
                  Rp{totalHarga.toLocaleString("id-ID")}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {durasi} {t.session} × Rp
                  {lapangan.harga.toLocaleString("id-ID")}
                </p>
              </div>

              <button
                type="button"
                onClick={lanjutBooking}
                className="liquid-booking-button w-full sm:w-auto"
              >
                {t.continue} →
              </button>

            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-5">
            {t.simulation}
          </p>

        </div>
      </main>

      <Footer />
    </>
  );
}