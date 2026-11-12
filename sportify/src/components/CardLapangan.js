"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/translations";

export default function CardLapangan({
  id,
  nama,
  lokasi,
  harga,
  fasilitas = [],
  gambar,
  kategori,
  rating,
  jumlahRating,
}) {
  const { language } = useLanguage();

  const t = translations[language]?.card || translations.id.card;
  const isEnglish = language === "en";

  const daftarFasilitas = Array.isArray(fasilitas) ? fasilitas : [];

  const daftarKategori = Array.isArray(kategori)
    ? kategori
    : kategori
      ? [kategori]
      : [];

  const hargaFormat = Number(harga || 0).toLocaleString("id-ID");

  return (
    <article className="liquid-card group flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Foto Lapangan */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">

        <Image
          src={gambar}
          alt={nama}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay Foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-white/70 text-primary text-xs font-semibold shadow-sm">
          {t.badge}
        </div>

        {/* Kategori */}
        {daftarKategori.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {daftarKategori.slice(0, 2).map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/30 text-white text-xs font-medium"
              >
                {item}
              </span>
            ))}

            {daftarKategori.length > 2 && (
              <span className="px-2 py-1 rounded-full bg-black/35 backdrop-blur-md text-white text-xs">
                +{daftarKategori.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Informasi Lapangan */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">

        {/* Nama Lapangan */}
        <h3 className="text-lg sm:text-xl font-bold text-dark-text group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {nama}
        </h3>

        {/* Lokasi */}
        <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-start gap-2">
          <span>📍</span>
          <span className="line-clamp-2">{lokasi}</span>
        </p>

        {/* Rating */}
        {Number(rating) > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-yellow-500">★</span>

            <span className="text-sm font-semibold text-dark-text">
              {Number(rating).toFixed(1)}
            </span>

            <span className="text-xs text-gray-400">
              ({jumlahRating || 0} {isEnglish ? "reviews" : "ulasan"})
            </span>
          </div>
        )}

        {/* Fasilitas */}
        {daftarFasilitas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {daftarFasilitas.slice(0, 3).map((item) => (
              <span key={item} className="liquid-facility">
                {item}
              </span>
            ))}

            {daftarFasilitas.length > 3 && (
              <span className="liquid-facility">
                +{daftarFasilitas.length - 3} {t.other}
              </span>
            )}
          </div>
        )}

        {/* Garis Pemisah */}
        <div className="border-t border-gray-100/80 my-4 mt-auto" />

        {/* Harga dan Tombol */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

          {/* Harga */}
          <div>
            <p className="text-xs text-gray-500 mb-1">
              {t.rentalPrice}
            </p>

            <p className="text-lg font-bold text-primary">
              Rp {hargaFormat}
              <span className="text-xs font-normal text-gray-500 ml-1">
                {t.session}
              </span>
            </p>
          </div>

          {/* Tombol Detail */}
          <Link
            href={`/lapangan/${id}`}
            className="liquid-detail-button w-full sm:w-auto justify-center text-center transition-all duration-300 group-hover:shadow-md"
          >
            {t.viewDetail} <span className="ml-1">&gt;</span>
          </Link>

        </div>
      </div>
    </article>
  );
}