"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { daftarLapangan } from "@/lib/lapangan";

const daftarUlasan = [
  {
    nama: "Andi Pratama",
    tanggal: "12 Oktober 2026",
    rating: 5,
    komentar: "Tempatnya nyaman, lapangannya bagus dan bersih. Cocok untuk bermain bersama teman.",
  },
  {
    nama: "Dina Putri",
    tanggal: "18 Oktober 2026",
    rating: 4,
    komentar: "Fasilitas cukup lengkap dan tempatnya nyaman. Pelayanannya juga baik.",
  },
  {
    nama: "Rizky Maulana",
    tanggal: "25 Oktober 2026",
    rating: 5,
    komentar: "Pengalaman bermain yang menyenangkan. Area parkirnya juga cukup luas.",
  },
];

export default function DetailLapanganPage() {
  const { id } = useParams();

  const lapangan = daftarLapangan.find(
    (item) => String(item.id) === String(id)
  );

  if (!lapangan) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">
          Tempat tidak ditemukan
        </h1>

        <Link href="/lapangan" className="text-primary mt-4">
          Kembali ke katalog
        </Link>
      </main>
    );
  }

  // Rekomendasi venue lain berdasarkan kategori dan lokasi.
  // Untuk sementara menggunakan data lokasi dari katalog.
  const rekomendasi = daftarLapangan
    .filter((item) => String(item.id) !== String(lapangan.id))
    .sort((a, b) => {
      const lokasiA =
        a.lokasi === lapangan.lokasi ? 1 : 0;
      const lokasiB =
        b.lokasi === lapangan.lokasi ? 1 : 0;

      return lokasiB - lokasiA;
    })
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-background">

      {/* Tombol Kembali */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          href="/lapangan"
          className="text-primary font-semibold hover:underline"
        >
          ← Kembali ke Daftar Lapangan
        </Link>
      </section>

      {/* Galeri dan Informasi Tempat */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">

            <div className="relative h-64 md:h-[420px] bg-gray-200 rounded-xl overflow-hidden">
              <img
                src={lapangan.foto?.[0] || lapangan.gambar}
                alt={`${lapangan.nama} foto 1`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-3">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="h-32 md:h-[203px] bg-gray-200 rounded-xl overflow-hidden"
                >
                  <img
                    src={
                      lapangan.foto?.[index] || lapangan.gambar
                    }
                    alt={`${lapangan.nama} foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

          </div>

          {/* Informasi Tempat */}
          <div className="p-6 md:p-8">

            <span className="bg-soft-mint text-primary px-4 py-2 rounded-full text-sm font-semibold">
              {lapangan.kategori}
            </span>

            <h1 className="text-3xl font-bold text-dark-text mt-4">
              {lapangan.nama}
            </h1>

            <p className="text-gray-500 mt-3">
              {lapangan.alamat || lapangan.lokasi}
            </p>

            <p className="text-gray-600 mt-5 leading-relaxed">
              {lapangan.deskripsi}
            </p>
            {/* Fasilitas */}
            <div className="mt-6">
            <h2 className="font-bold text-lg mb-3">
                Fasilitas
            </h2>

            <div className="flex flex-wrap gap-2">
                {lapangan.fasilitas.map((item) => (
                <span
                    key={item}
                    className="bg-soft-mint text-primary px-4 py-2 rounded-lg text-sm"
                >
                    {item}
                </span>
                ))}
            </div>
            </div>

            {/* Harga */}
            <p className="text-primary font-bold text-xl mt-6">
              Rp {lapangan.harga.toLocaleString("id-ID")}
              <span className="text-sm text-gray-500 font-normal">
                {" "}/ sesi
              </span>
            </p>

          </div>
        </div>
      </section>

      {/* Google Maps Khusus Unity Sports Center */}
      {lapangan.nama === "Unity Sports Center" && (
        <section className="max-w-7xl mx-auto px-6 pb-10">
          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h2 className="text-2xl font-bold text-dark-text mb-2">
              Lokasi Unity Sports Center
            </h2>

            <p className="text-gray-500 mb-5">
              Temukan lokasi Unity Sports Center melalui Google Maps.
            </p>

            <div className="w-full h-[350px] rounded-xl overflow-hidden">
              <iframe
                title="Lokasi Unity Sports Center"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.943363764403!2d110.4239082!3d-7.015943399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b5ac826a411%3A0x3cceec8f4296255!2sUnity%20Sports%20Center!5e0!3m2!1sen!2sid!4v1793722006474!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Unity+Sports+Center+Semarang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 bg-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Buka Google Maps
            </a>

          </div>
        </section>
      )}

      {/* ULASAN PENGGUNA */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark-text">
                Ulasan Pengguna
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Pengalaman pengguna saat bermain di {lapangan.nama}.
              </p>
            </div>

            <div className="bg-soft-mint px-4 py-3 rounded-xl">
              <p className="text-primary font-bold text-xl">
                ★ 4.7 / 5
              </p>
              <p className="text-xs text-gray-500">
                Contoh tampilan rating
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {daftarUlasan.map((ulasan, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-xl p-5"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="font-bold text-dark-text">
                      {ulasan.nama}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {ulasan.tanggal}
                    </p>
                  </div>

                  <span className="text-yellow-500 font-semibold whitespace-nowrap">
                    {"★".repeat(ulasan.rating)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - ulasan.rating)}
                    </span>
                  </span>
                </div>

                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  {ulasan.komentar}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-5">
            Ulasan di atas merupakan data contoh, bukan ulasan pengguna sebenarnya.
          </p>

        </div>
      </section>

      {/* REKOMENDASI VENUE */}
      <section className="max-w-7xl mx-auto px-6 pb-10">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-text">
            Rekomendasi Venue Terdekat
          </h2>

          <p className="text-gray-500 mt-2">
            Temukan tempat olahraga lainnya di sekitar {lapangan.lokasi}.
          </p>
        </div>

        {rekomendasi.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {rekomendasi.map((item) => (
              <Link
                key={item.id}
                href={`/lapangan/${item.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group"
              >
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-5">

                  <span className="text-xs bg-soft-mint text-primary px-3 py-1 rounded-full">
                    {item.kategori}
                  </span>

                  <h3 className="font-bold text-lg text-dark-text mt-3">
                    {item.nama}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {item.lokasi}
                  </p>

                  <p className="text-primary font-bold mt-4">
                    Rp {item.harga.toLocaleString("id-ID")}
                    <span className="text-xs text-gray-500 font-normal">
                      {" "}/ jam
                    </span>
                  </p>

                  <span className="inline-block mt-4 text-sm text-primary font-semibold">
                    Lihat Venue →
                  </span>

                </div>
              </Link>
            ))}

          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            Belum ada rekomendasi venue lainnya.
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Rekomendasi sementara diurutkan berdasarkan kesamaan informasi lokasi, bukan jarak GPS sebenarnya.
        </p>

      </section>

      {/* TOMBOL BOOKING */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-5">

          <div>
            <h2 className="text-xl font-bold text-dark-text">
              Tertarik bermain di sini?
            </h2>

            <p className="text-gray-500 mt-2">
              Pilih lapangan dan jadwal bermain sesuai keinginanmu.
            </p>
          </div>

          <Link
            href={`/lapangan/${lapangan.id}/booking`}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Pilih Lapangan dan Booking
          </Link>

        </div>
      </section>

    </main>
  );
}