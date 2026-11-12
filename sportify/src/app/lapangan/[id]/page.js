"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardLapangan from "@/components/CardLapangan";
import { daftarLapangan } from "@/lib/lapangan";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/translations";

export default function DetailLapangan() {
  const params = useParams();
  const id = params.id;
  const [fotoAktif, setFotoAktif] = useState(0);

  const { language } = useLanguage();
  const t = translations[language]?.detail || translations.id.detail;
  const isEnglish = language === "en";

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Bagikan halaman
  const [copied, setCopied] = useState(false);

  // Form ulasan
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [namaReviewer, setNamaReviewer] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [komentarInput, setKomentarInput] = useState("");
  const [ulasanTambahan, setUlasanTambahan] = useState([]);

  // Ambil data ulasan dan pengguna dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`sportify_reviews_${id}`);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setUlasanTambahan(parsed);
        }
      }

      const savedUser = localStorage.getItem("sportify_user");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (user.fullName) {
          setNamaReviewer(user.fullName);
        }
      }
    } catch {
      // Abaikan jika data localStorage tidak valid
    }
  }, [id]);

  // Cari data lapangan
  const lapangan = daftarLapangan.find(
    (item) => String(item.id) === String(id)
  );

  // Bagikan ke WhatsApp
  const handleShareWA = () => {
    if (!lapangan || typeof window === "undefined") return;

    const text = isEnglish
      ? `Let's play at ${lapangan.nama}! Check the schedule and book on Sportify: ${window.location.href}`
      : `Ayo main di ${lapangan.nama}! Cek jadwal dan booking di Sportify: ${window.location.href}`;

    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Salin tautan
  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;

    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert(
        isEnglish
          ? "Unable to copy the link."
          : "Tautan tidak dapat disalin."
      );
    }
  };

  // Kirim ulasan
  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!komentarInput.trim()) return;

    const newReview = {
      nama:
        namaReviewer.trim() ||
        (isEnglish ? "Sportify Player" : "Pengunjung Sportify"),
      tanggal: isEnglish ? "Just now" : "Baru saja",
      rating: Number(ratingInput),
      komentar: komentarInput.trim(),
    };

    const updatedReviews = [newReview, ...ulasanTambahan];

    setUlasanTambahan(updatedReviews);

    try {
      localStorage.setItem(
        `sportify_reviews_${id}`,
        JSON.stringify(updatedReviews)
      );
    } catch {
      // Abaikan jika penyimpanan gagal
    }

    setKomentarInput("");
    setRatingInput(5);
    setShowReviewForm(false);
  };

  // Halaman jika lapangan tidak ditemukan
  if (!lapangan) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background flex items-center justify-center px-4">

          <div className="liquid-info-card text-center p-8 sm:p-10 max-w-md w-full">

            <div className="text-5xl mb-5">
              ⚽
            </div>

            <h1 className="text-2xl font-bold text-dark-text">
              {t.notFound}
            </h1>

            <Link
              href="/lapangan"
              className="liquid-booking-button inline-block mt-6"
            >
              {t.backToList}
            </Link>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  // Data foto
  const daftarFoto =
    lapangan.foto?.length > 0
      ? lapangan.foto
      : lapangan.gambar
        ? [lapangan.gambar]
        : [];

  // Data fasilitas
  const daftarFasilitas = Array.isArray(lapangan.fasilitas)
    ? lapangan.fasilitas
    : [];

  // Data kategori
  const kategoriLapangan = Array.isArray(lapangan.kategori)
    ? lapangan.kategori
    : lapangan.kategori
      ? [lapangan.kategori]
      : [];

  // Data rekomendasi
  const rekomendasi = daftarLapangan.filter((item) => {
    const kategoriItem = Array.isArray(item.kategori)
      ? item.kategori
      : item.kategori
        ? [item.kategori]
        : [];

    return (
      String(item.id) !== String(lapangan.id) &&
      kategoriItem.some((kategori) =>
        kategoriLapangan.includes(kategori)
      )
    );
  });

  // Gabungkan ulasan dari data awal dan localStorage
  const daftarUlasanAwal = Array.isArray(lapangan.ulasan)
    ? lapangan.ulasan
    : [];

  const daftarSemuaUlasan = [
    ...ulasanTambahan,
    ...daftarUlasanAwal,
  ];

  // Hitung rating
  const jumlahUlasan = daftarSemuaUlasan.length;

  const totalRating = daftarSemuaUlasan.reduce(
    (total, ulasan) => total + Number(ulasan.rating || 0),
    0
  );

  const rataRataRating =
    jumlahUlasan > 0
      ? (totalRating / jumlahUlasan).toFixed(1)
      : Number(lapangan.rating || 0).toFixed(1);

  const jumlahRating =
    Number(lapangan.jumlahRating || 0) + ulasanTambahan.length;

  const hargaLapangan = Number(lapangan.harga || 0);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">

        {/* HEADER DETAIL */}
        <section className="relative overflow-hidden px-4 sm:px-6 py-10 sm:py-12 md:py-16">

          <div className="absolute top-0 right-10 w-64 h-64 bg-soft-mint rounded-full blur-3xl opacity-80 pointer-events-none" />

          <div className="absolute bottom-0 left-0 w-56 h-56 bg-green-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto">

            <div className="liquid-detail-header p-6 sm:p-8 md:p-12 rounded-3xl">

              {/* Kembali */}
              <Link
                href="/lapangan"
                className="inline-flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm hover:text-secondary transition"
              >
                &lt; {t.back}
              </Link>

              {/* Nama Lapangan */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-text mt-6 leading-tight">
                {lapangan.nama}
              </h1>

              {/* Lokasi */}
              <p className="text-gray-600 mt-4 text-sm sm:text-base break-words">
                📍 {lapangan.lokasi}
              </p>

              {/* Rating */}
              {Number(rataRataRating) > 0 && (
                <div className="flex items-center gap-2 mt-4">

                  <span className="text-yellow-500">
                    ★
                  </span>

                  <span className="font-bold text-dark-text text-sm">
                    {rataRataRating}
                  </span>

                  <span className="text-gray-500 text-xs">
                    ({jumlahRating} {t.rating})
                  </span>

                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 mt-5">

                {/* Kategori */}
                <div className="flex flex-wrap gap-2">

                  {kategoriLapangan.map((kategori) => (
                    <span
                      key={kategori}
                      className="liquid-detail-category"
                    >
                      {kategori}
                    </span>
                  ))}

                </div>

                {/* Bagikan */}
                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={handleShareWA}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition"
                  >
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/80 border border-gray-200 text-gray-700 hover:border-primary hover:text-primary text-xs font-semibold shadow-sm transition"
                  >
                    {copied
                      ? isEnglish
                        ? "Copied!"
                        : "Tersalin!"
                      : isEnglish
                        ? "Copy Link"
                        : "Salin Link"}
                  </button>

                </div>

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

          {daftarFoto.length > 0 ? (

            <div>
              {/* FOTO UTAMA */}
              <div
                className="relative overflow-hidden rounded-3xl liquid-photo h-[260px] sm:h-[380px] md:h-[500px]"
                onTouchStart={(e) => {
                  e.currentTarget.dataset.touchStart = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  const start = Number(e.currentTarget.dataset.touchStart);
                  const end = e.changedTouches[0].clientX;

                  if (start - end > 50) {
                    setFotoAktif((prev) =>
                      prev === daftarFoto.length - 1 ? 0 : prev + 1
                    );
                  }

                  if (end - start > 50) {
                    setFotoAktif((prev) =>
                      prev === 0 ? daftarFoto.length - 1 : prev - 1
                    );
                  }
                }}
              >

                <Image
                  key={fotoAktif}
                  src={daftarFoto[fotoAktif]}
                  alt={`${lapangan.nama} ${fotoAktif + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover transition-all duration-500"
                  priority
                />

                {/* TOMBOL SEBELUMNYA */}
                {daftarFoto.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFotoAktif((prev) =>
                        prev === 0 ? daftarFoto.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-dark-text hover:bg-white transition"
                  >
                    &#10094;
                  </button>
                )}

                {/* TOMBOL SELANJUTNYA */}
                {daftarFoto.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFotoAktif((prev) =>
                        prev === daftarFoto.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-dark-text hover:bg-white transition"
                  >
                    &#10095;
                  </button>
                )}

                {/* NOMOR FOTO */}
                <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-sm">
                  {fotoAktif + 1} / {daftarFoto.length}
                </div>

              </div>

              {/* INDIKATOR FOTO */}
              <div className="flex justify-center gap-2 mt-5">
                {daftarFoto.map((foto, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFotoAktif(index)}
                    aria-label={`Lihat foto ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${fotoAktif === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-gray-300"
                      }`}
                  />
                ))}
              </div>

            </div>

          ) : (

            <div className="liquid-info-card p-10 text-center text-gray-500">
              {isEnglish
                ? "No photos available."
                : "Belum ada foto lapangan."}
            </div>

          )}

        </section>

        {/* INFORMASI LAPANGAN */}
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
                  className={`text-gray-600 text-sm leading-relaxed whitespace-pre-line break-words ${showFullDescription ? "" : "line-clamp-4"
                    }`}
                >
                  {lapangan.deskripsi ||
                    (isEnglish
                      ? "No description available."
                      : "Belum ada deskripsi lapangan.")}
                </p>

                {lapangan.deskripsi?.length > 150 && (

                  <button
                    type="button"
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

                {daftarFasilitas.length > 0 ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

                    {(showAllFacilities
                      ? daftarFasilitas
                      : daftarFasilitas.slice(0, 6)
                    ).map((fasilitas, index) => (

                      <div
                        key={index}
                        className="liquid-facility-detail"
                      >
                        <span className="text-primary font-bold">
                          ✓
                        </span>

                        {fasilitas}
                      </div>

                    ))}

                  </div>

                ) : (

                  <p className="text-gray-500 text-sm">
                    {isEnglish
                      ? "No facilities listed."
                      : "Belum ada informasi fasilitas."}
                  </p>

                )}

                {daftarFasilitas.length > 6 && (

                  <button
                    type="button"
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

              {/* LOKASI DAN PETA */}
              <div className="liquid-info-card p-5 sm:p-6 md:p-8">

                <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                  {t.locationLabel}
                </p>

                <h2 className="text-xl font-bold text-dark-text mb-4">
                  {t.locationTitle}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed break-words">
                  {lapangan.alamat || lapangan.lokasi}
                </p>

                {lapangan.alamat && (

                  <div className="mt-5 sm:mt-6">

                    <div className="rounded-2xl overflow-hidden border border-white shadow-sm">

                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          lapangan.alamat
                        )}&output=embed`}
                        width="100%"
                        height="350"
                        loading="lazy"
                        title={`Lokasi ${lapangan.nama}`}
                        className="border-0 w-full h-[250px] sm:h-[350px]"
                        referrerPolicy="no-referrer-when-downgrade"
                      />

                    </div>

                    {lapangan.mapsUrl && (

                      <a
                        href={lapangan.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-primary font-semibold text-sm hover:text-secondary transition"
                      >
                        📍 {t.openMaps} &gt;
                      </a>

                    )}

                  </div>

                )}

              </div>

            </div>

            {/* KARTU BOOKING */}
            <div>

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
                  Rp{hargaLapangan.toLocaleString("id-ID")}
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
                  {t.bookNow} &gt;
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* ULASAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">

          <div className="liquid-info-card p-5 sm:p-6 md:p-8">

            {/* HEADER ULASAN */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

              <div>
                <p className="text-primary text-xs font-semibold mb-2">
                  {isEnglish ? "CUSTOMER FEEDBACK" : "PENILAIAN PENGUNJUNG"}
                </p>

                <h2 className="text-2xl font-bold text-dark-text">
                  {t.reviewTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2.5 rounded-xl bg-soft-mint text-primary text-xs sm:text-sm font-semibold hover:bg-green-100 transition"
              >
                {showReviewForm
                  ? isEnglish
                    ? "Close Form"
                    : "Tutup Form"
                  : isEnglish
                    ? "Write Review"
                    : "Tulis Ulasan"}
              </button>

            </div>

            {/* FORM ULASAN */}
            {showReviewForm && (

              <form
                onSubmit={handleSubmitReview}
                className="mb-8 p-5 bg-white/80 border border-primary/20 rounded-2xl shadow-sm space-y-4"
              >

                <h3 className="font-bold text-dark-text text-sm sm:text-base">
                  {isEnglish
                    ? "Share Your Experience"
                    : "Bagikan Pengalamanmu"}
                </h3>

                {/* PILIH RATING */}
                <div>

                  <label className="block text-xs font-semibold text-gray-500 mb-2">
                    {isEnglish ? "Your Rating" : "Rating Bintang"}
                  </label>

                  <div className="flex items-center gap-1.5 text-2xl">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        aria-label={`${star} stars`}
                        className={`transition hover:scale-125 ${star <= ratingInput
                          ? "text-yellow-400"
                          : "text-gray-300"
                          }`}
                      >
                        ★
                      </button>

                    ))}

                    <span className="text-xs font-bold text-gray-600 ml-2">
                      ({ratingInput}/5)
                    </span>

                  </div>

                </div>

                {/* NAMA */}
                <div>

                  <label className="block text-xs font-semibold text-gray-500 mb-2">
                    {isEnglish ? "Your Name" : "Nama Kamu"}
                  </label>

                  <input
                    type="text"
                    value={namaReviewer}
                    onChange={(e) => setNamaReviewer(e.target.value)}
                    placeholder={
                      isEnglish
                        ? "Enter your name"
                        : "Masukkan nama"
                    }
                    className="liquid-auth-input w-full text-sm py-3"
                  />

                </div>

                {/* KOMENTAR */}
                <div>

                  <label className="block text-xs font-semibold text-gray-500 mb-2">
                    {isEnglish ? "Your Review" : "Ulasan Kamu"}

                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <textarea
                    rows={4}
                    value={komentarInput}
                    onChange={(e) => setKomentarInput(e.target.value)}
                    placeholder={
                      isEnglish
                        ? "Share your experience about the court and facilities..."
                        : "Ceritakan pengalamanmu tentang lapangan dan fasilitasnya..."
                    }
                    className="liquid-auth-input w-full text-sm resize-none"
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="liquid-booking-button inline-flex text-xs sm:text-sm py-3 px-6"
                >
                  {isEnglish ? "Submit Review" : "Kirim Ulasan"} &gt;
                </button>

              </form>

            )}

            {/* RINGKASAN RATING */}
            {jumlahUlasan > 0 ? (

              <>

                <div className="flex flex-wrap items-center gap-3 mb-7">

                  <span className="text-3xl font-bold text-dark-text">
                    {rataRataRating}
                  </span>

                  <span className="text-gray-400 text-sm">
                    / 5
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

                    {lapangan.aspekRating.map((aspek, index) => {

                      const nilai = Math.min(
                        5,
                        Math.max(0, Number(aspek.nilai) || 0)
                      );

                      return (

                        <div key={index}>

                          <div className="flex justify-between gap-2 text-xs mb-2">

                            <span className="text-gray-600">
                              {aspek.nama}
                            </span>

                            <span className="font-semibold text-dark-text">
                              {nilai.toFixed(2)}
                            </span>

                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-1.5">

                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${(nilai / 5) * 100}%`,
                              }}
                            />

                          </div>

                        </div>

                      );
                    })}

                  </div>

                )}

                {/* DAFTAR ULASAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {(showAllReviews
                    ? daftarSemuaUlasan
                    : daftarSemuaUlasan.slice(0, 4)
                  ).map((ulasan, index) => (

                    <div
                      key={`${ulasan.nama}-${index}`}
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
                          ★ {Number(ulasan.rating || 0).toFixed(1)}
                        </span>

                      </div>

                      <p className="text-gray-600 text-sm mt-4 leading-relaxed break-words">
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

                {/* TOMBOL LIHAT SEMUA */}
                {daftarSemuaUlasan.length > 4 && (

                  <button
                    type="button"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-primary font-semibold text-sm mt-6 hover:text-secondary transition"
                  >
                    {showAllReviews
                      ? t.reviewLess
                      : t.allReviews}
                  </button>

                )}

              </>

            ) : (

              <div className="text-center py-10">

                <div className="text-4xl mb-4">
                  ★
                </div>

                <p className="text-gray-500 text-sm">
                  {t.noReviews}
                </p>

              </div>

            )}

          </div>

        </section>

        {/* REKOMENDASI LAPANGAN */}
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

              {rekomendasi.slice(0, 6).map((item) => (

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