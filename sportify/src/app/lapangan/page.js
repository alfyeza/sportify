"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardLapangan from "@/components/CardLapangan";
import { daftarLapangan } from "@/lib/lapangan";

const kategoriOlahraga = [
  "Semua",
  "Padel",
  "Tennis",
  "Mini Soccer",
  "Badminton",
];

export default function HalamanLapangan() {
  const [pencarian, setPencarian] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const hasilFilter = daftarLapangan.filter((lapangan) => {
    const cocokKategori =
      kategoriAktif === "Semua" ||
      lapangan.kategori === kategoriAktif;

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
        <section className="bg-soft-mint py-16">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-primary font-semibold">
              PLAYCOURT - SEMARANG
            </p>

            <h1 className="text-4xl font-bold text-dark-text mt-3">
              Temukan Tempat Olahraga
            </h1>

            <p className="text-gray-600 mt-4">
              Cari dan sewa berbagai tempat olahraga di Kota Semarang.
            </p>
          </div>
        </section>

        {/* PENCARIAN */}
        <section className="max-w-7xl mx-auto px-6 pt-12">
          <input
            type="text"
            placeholder="Cari nama tempat atau lokasi..."
            value={pencarian}
            onChange={(e) => setPencarian(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary"
          />
        </section>

        {/* FILTER KATEGORI */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold text-dark-text mb-6">
            Kategori Olahraga
          </h2>

          <div className="flex flex-wrap gap-3">
            {kategoriOlahraga.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setKategoriAktif(kategori)}
                className={`px-5 py-2 rounded-full border transition ${
                  kategoriAktif === kategori
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-dark-text border-gray-200 hover:bg-soft-mint"
                }`}
              >
                {kategori}
              </button>
            ))}
          </div>
        </section>

        {/* DAFTAR LAPANGAN */}
        <section className="max-w-7xl mx-auto px-6 pb-16">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark-text">
              Daftar Tempat Olahraga
            </h2>

            <p className="text-gray-500 mt-2">
              Menampilkan {hasilFilter.length} tempat olahraga.
            </p>
          </div>

          {hasilFilter.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hasilFilter.map((lapangan) => (
                <CardLapangan
                  key={lapangan.id}
                  {...lapangan}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <h3 className="text-xl font-semibold text-dark-text">
                Tempat olahraga tidak ditemukan
              </h3>

              <p className="text-gray-500 mt-2">
                Coba gunakan kata kunci atau kategori lainnya.
              </p>

              <button
                onClick={() => {
                  setPencarian("");
                  setKategoriAktif("Semua");
                }}
                className="mt-5 bg-primary text-white px-6 py-2 rounded-lg"
              >
                Reset Pencarian
              </button>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </>
  );
}