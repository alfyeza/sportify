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
}) {
  const { language } = useLanguage();

  const t = translations[language]?.card || translations.id.card;

  return (
    <div className="liquid-card group flex flex-col h-full">

      {/* Foto Lapangan */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        <Image
          src={gambar}
          alt={nama}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/70 text-primary text-xs font-semibold shadow-sm">
          {t.badge}
        </div>
      </div>

      {/* Informasi Lapangan */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">

        <h3 className="text-lg sm:text-xl font-bold text-dark-text group-hover:text-primary transition line-clamp-1">
          {nama}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-start gap-2">
          <span>📍</span>
          <span className="line-clamp-2">{lokasi}</span>
        </p>

        {/* Fasilitas */}
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
          {fasilitas.slice(0, 4).map((item) => (
            <span key={item} className="liquid-facility">
              {item}
            </span>
          ))}

          {fasilitas.length > 4 && (
            <span className="liquid-facility">
              +{fasilitas.length - 4} {t.other}
            </span>
          )}
        </div>

        {/* Garis Pemisah */}
        <div className="border-t border-gray-100 my-4 sm:my-5 mt-auto" />

        {/* Harga dan Tombol */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

          <div>
            <p className="text-xs text-gray-500 mb-1">
              {t.rentalPrice}
            </p>

            <p className="text-lg font-bold text-primary">
              Rp {harga.toLocaleString("id-ID")}
              <span className="text-xs font-normal text-gray-500">
                {t.session}
              </span>
            </p>
          </div>

          <Link
            href={`/lapangan/${id}`}
            className="liquid-detail-button w-full sm:w-auto justify-center text-center"
          >
            {t.viewDetail} →
          </Link>

        </div>
      </div>
    </div>
  );
}