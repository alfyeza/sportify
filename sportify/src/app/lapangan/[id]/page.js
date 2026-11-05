"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardLapangan from "@/components/CardLapangan";
import { daftarLapangan } from "@/lib/lapangan";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/translations";

export default function DetailLapangan() {
  const params = useParams();
  const id = Number(params.id);

  const { language } = useLanguage();
  const t = translations[language]?.detail || translations.id.detail;

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const lapangan = daftarLapangan.find(
    (item) => item.id === id
  );

  if (!lapangan) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="liquid-info-card text-center p-8 sm:p-10">
            <h1 className="text-2xl font-bold text-dark-text">
              {t.notFound}
            </h1>

            <Link
              href="/lapangan"
              className="text-primary mt-4 inline-block font-semibold"
            >
              {t.backToList}
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // GALERI FOTO
  const daftarFoto = lapangan.foto?.length
    ? lapangan.foto
    : [lapangan.gambar];

  // KATEGORI LAPANGAN
  const kategoriLapangan = Array.isArray(lapangan.kategori)
    ? lapangan.kategori
    : [lapangan.kategori];

  // REKOMENDASI VENUE
  const rekomendasi = daftarLapangan.filter((item) => {
    const kategoriItem = Array.isArray(item.kategori)
      ? item.kategori
      : [item.kategori];

    return (
      item.id !== lapangan.id &&
      kategoriItem.some((kategori) =>
        kategoriLapangan.includes(kategori)
      )
    );
  });

  // RATING VENUE
  const jumlahUlasan = lapangan.ulasan?.length || 0;

  const rataRataRating =
    lapangan.rating ??
    (jumlahUlasan > 0
      ? (
          lapangan.ulasan.reduce(
            (total, ulasan) => total + ulasan.rating,
            0
          ) / jumlahUlasan
        ).toFixed(1)
      : null);

  const jumlahRating = lapangan.jumlahRating ?? jumlahUlasan;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">

        {/* HEADER DETAIL */}
        <section className="relative overflow-hidden px-4 sm:px-6 py-10 sm:py-12 md:py-16">

          <div className="absolute top-0 right-10 w-64 h-64 bg-soft-mint rounded-full blur-3xl opacity-80" />

          <div className="relative max-w-7xl mx-auto">
            <div className="liquid-detail-header p-6 sm:p-8 md:p-12 rounded-3xl">

              <Link
                href="/lapangan"
                className="text-primary font-semibold text-xs sm:text-sm hover:text-secondary transition"
              >
                ← {t.back}
              </Link>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-text mt-6 leading-tight">
                {lapangan.nama}
              </h1>

              <p className="text-gray-600 mt-4 text-sm sm:text-base break-words">
                📍 {lapangan.lokasi}
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                {kategoriLapangan.map((kategori) => (
                  <span
                    key={kategori}
                    className="liquid-detail-category"
                  >
                    {kategori}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* GALERI FOTO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          <div className="mb-6">
            <p className="text-primary font-semibold text-xs sm:text-sm mb-2">
              {t.galleryLabel}
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-dark-text">
              {t.galleryTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {(showAllPhotos
              ? daftarFoto
              : daftarFoto.slice(0, 4)
            ).map((foto, index) => (
              <div
                key={index}
                className="liquid-photo overflow-hidden h-56 sm:h-64 md:h-80"
              >
                <img
                  src={foto}
                  alt={`${lapangan.nama} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>

          {daftarFoto.length > 4 && (
            <button
              onClick={() => setShowAllPhotos(!showAllPhotos)}
              className="text-primary font-semibold text-sm mt-5 hover:text-secondary transition"
            >
              {showAllPhotos
                ? `${t.showLess} ↑`
                : `${t.readMore} ↓`}
            </button>
          )}

        </section>

        {/* INFORMASI VENUE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

            {/* INFORMASI UTAMA */}
            <div className="lg:col-span-2 space-y-5 sm:space-y-6">

              {/* DESKRIPSI */}
              <div className="liquid-info-card p-5 sm:p-6 md:p-8">

                <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                  {t.aboutLabel}
                </p>

                <h2 className="text-xl font-bold text-dark-text mb-4">
                  {t.descriptionTitle}
                </h2>

                <p
                  className={`text-gray-600 text-sm leading-relaxed whitespace-pre-line break-words ${
                    showFullDescription ? "" : "line-clamp-4"
                  }`}
                >
                  {lapangan.deskripsi}
                </p>

                {lapangan.deskripsi?.length > 150 && (
                  <button
                    onClick={() =>
                      setShowFullDescription(!showFullDescription)
                    }
                    className="text-primary font-semibold text-sm mt-4 hover:text-secondary transition"
                  >
                    {showFullDescription
                      ? t.showLess
                      : t.readMore}
                  </button>
                )}

              </div>

              {/* FASILITAS */}
              <div className="liquid-info-card p-5 sm:p-6 md:p-8">

                <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                  {t.comfortLabel}
                </p>

                <h2 className="text-xl font-bold text-dark-text mb-6">
                  {t.facilityTitle}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(showAllFacilities
                    ? lapangan.fasilitas
                    : lapangan.fasilitas?.slice(0, 6)
                  )?.map((fasilitas, index) => (
                    <div
                      key={index}
                      className="liquid-facility-detail"
                    >
                      <span className="text-primary">✓</span>
                      {fasilitas}
                    </div>
                  ))}
                </div>

                {lapangan.fasilitas?.length > 6 && (
                  <button
                    onClick={() =>
                      setShowAllFacilities(!showAllFacilities)
                    }
                    className="text-primary font-semibold text-sm mt-5 hover:text-secondary transition"
                  >
                    {showAllFacilities
                      ? `${t.showLess} ↑`
                      : `${t.readMore} ↓`}
                  </button>
                )}

              </div>

              {/* ALAMAT */}
              <div className="liquid-info-card p-5 sm:p-6 md:p-8">

                <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                  {t.locationLabel}
                </p>

                <h2 className="text-xl font-bold text-dark-text mb-4">
                  {t.locationTitle}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed break-words">
                  {lapangan.alamat}
                </p>

                {lapangan.mapsUrl && (
                  <div className="mt-5 sm:mt-6">

                    <div className="rounded-2xl overflow-hidden border border-white shadow-sm">
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          lapangan.alamat
                        )}&output=embed`}
                        width="100%"
                        height="350"
                        loading="lazy"
                        className="border-0 w-full h-[250px] sm:h-[350px]"
                        title={`Lokasi ${lapangan.nama}`}
                      />
                    </div>

                    <a
                      href={lapangan.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-primary font-semibold text-sm hover:text-secondary transition"
                    >
                      📍 {t.openMaps} →
                    </a>

                  </div>
                )}

              </div>

            </div>

            {/* INFORMASI BOOKING */}
            <div className="space-y-6">

              <div className="liquid-booking-card p-5 sm:p-6 md:p-7 lg:sticky lg:top-28">

                <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                  {t.bookingLabel}
                </p>

                <h2 className="text-xl font-bold text-dark-text mb-6">
                  {t.bookingTitle}
                </h2>

                <p className="text-gray-500 text-sm">
                  {t.startingPrice}
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">
                  Rp{lapangan.harga.toLocaleString("id-ID")}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {t.session}
                </p>

                <div className="border-t border-gray-200/70 my-6" />

                <div className="space-y-4 text-sm">

                  <div>
                    <p className="font-semibold text-dark-text">
                      {t.venueName}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {lapangan.nama}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-dark-text">
                      {t.category}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {kategoriLapangan.join(", ")}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-dark-text">
                      {t.location}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {lapangan.lokasi}
                    </p>
                  </div>

                </div>

                <Link
                  href={`/lapangan/${lapangan.id}/booking`}
                  className="liquid-booking-button block w-full text-center mt-7"
                >
                  {t.bookNow} →
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* ULASAN PENGUNJUNG */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">

          <div className="liquid-info-card p-5 sm:p-6 md:p-8">

            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl font-bold text-dark-text">
                {t.reviewTitle}
              </h2>

              {jumlahUlasan > 0 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-primary text-sm font-semibold hover:text-secondary"
                >
                  {showAllReviews
                    ? t.reviewLess
                    : t.allReviews}
                </button>
              )}
            </div>

            {jumlahUlasan > 0 ? (
              <>

                {/* RINGKASAN RATING */}
                <div className="flex flex-wrap items-center gap-3 mb-7">

                  <span className="text-3xl font-bold text-dark-text">
                    {Number(rataRataRating).toFixed(1)}
                  </span>

                  <span className="text-gray-500 text-sm">
                    /5
                  </span>

                  <span className="text-yellow-500 text-xl tracking-wider">
                    ★★★★★
                  </span>

                  <span className="text-xs text-gray-500">
                    {jumlahRating} {t.rating} · {jumlahUlasan} {t.reviews}
                  </span>

                </div>

                {/* ASPEK PENILAIAN */}
                {lapangan.aspekRating?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

                    {lapangan.aspekRating.map((aspek, index) => (
                      <div key={index}>

                        <div className="flex justify-between gap-2 text-xs mb-2">
                          <span className="text-gray-600">
                            {aspek.nama}
                          </span>

                          <span className="font-semibold text-dark-text">
                            {aspek.nilai.toFixed(2)}
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{
                              width: `${(aspek.nilai / 5) * 100}%`,
                            }}
                          />
                        </div>

                      </div>
                    ))}

                  </div>
                )}

                {/* DAFTAR ULASAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {(showAllReviews
                    ? lapangan.ulasan
                    : lapangan.ulasan.slice(0, 2)
                  ).map((ulasan, index) => (
                    <div
                      key={index}
                      className="liquid-review-item border border-gray-200 rounded-xl p-4 sm:p-5"
                    >

                      <div className="flex justify-between items-start gap-3">

                        <div className="min-w-0">
                          <h3 className="font-bold text-dark-text text-sm">
                            {ulasan.nama}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            {t.reviewed}: {ulasan.tanggal}
                          </p>
                        </div>

                        <span className="text-yellow-500 text-sm font-semibold whitespace-nowrap">
                          ★ {Number(ulasan.rating).toFixed(1)}
                        </span>

                      </div>

                      <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                        {ulasan.komentar}
                      </p>

                      {ulasan.court && (
                        <p className="text-xs text-gray-400 mt-5">
                          {ulasan.court}
                        </p>
                      )}

                    </div>
                  ))}

                </div>

              </>
            ) : (

              <p className="text-gray-500 text-center py-8">
                {t.noReviews}
              </p>

            )}

          </div>
        </section>

        {/* REKOMENDASI VENUE */}
        {rekomendasi.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">

            <div className="mb-8">

              <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                {t.recommendationLabel}
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-dark-text">
                {t.recommendationTitle}
              </h2>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">

              {rekomendasi.map((item) => (
                <CardLapangan
                  key={item.id}
                  {...item}
                />
              ))}

            </div>

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}