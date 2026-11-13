"use client";

import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const id = params.id;

  const [fotoAktif, setFotoAktif] = useState(0);
  const { language } = useLanguage();
  const t = translations[language]?.detail || translations.id.detail;
  const isEnglish = language === "en";

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [copied, setCopied] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [namaReviewer, setNamaReviewer] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [komentarInput, setKomentarInput] = useState("");
  const [ulasanTambahan, setUlasanTambahan] = useState([]);

  const handleBookingClick = () => {
    const bookingPath = `/lapangan/${id}/booking`;
    const token = localStorage.getItem("token");

    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(bookingPath)}`);
      return;
    }

    router.push(bookingPath);
  };

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

  const lapangan = daftarLapangan.find(
    (item) => String(item.id) === String(id)
  );

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

  if (!lapangan) {
    return (
      <>
        <Navbar />

        <main
          className="min-h-screen flex items-center justify-center px-4"
          style={{ background: "var(--bg-main)" }}
        >
          <div className="liquid-info-card text-center p-8 sm:p-10 max-w-md w-full detail-animate">
            <div className="text-5xl mb-5">⚽</div>

            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-main)" }}
            >
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

        <style jsx global>{`
          @keyframes detailFadeUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .detail-animate {
            animation: detailFadeUp 0.7s ease both;
          }
        `}</style>
      </>
    );
  }

  const daftarFoto =
    lapangan.foto?.length > 0
      ? lapangan.foto
      : lapangan.gambar
        ? [lapangan.gambar]
        : [];

  const daftarFasilitas = Array.isArray(lapangan.fasilitas)
    ? lapangan.fasilitas
    : [];

  const kategoriLapangan = Array.isArray(lapangan.kategori)
    ? lapangan.kategori
    : lapangan.kategori
      ? [lapangan.kategori]
      : [];

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

  const daftarUlasanAwal = Array.isArray(lapangan.ulasan)
    ? lapangan.ulasan
    : [];

  const daftarSemuaUlasan = [
    ...ulasanTambahan,
    ...daftarUlasanAwal,
  ];

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

      <main
        className="min-h-screen detail-page"
        style={{ background: "var(--bg-main)" }}
      >
        {/* HEADER DETAIL */}
        <section className="relative overflow-hidden px-4 sm:px-6 py-10 sm:py-12 md:py-16 detail-section">
          <div
            className="absolute top-0 right-10 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none detail-glow"
            style={{ background: "var(--bg-soft)" }}
          />

          <div
            className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none detail-glow detail-glow-delay"
            style={{ background: "var(--glass-bg)" }}
          />

          <div className="relative max-w-7xl mx-auto">
            <div className="liquid-detail-header p-6 sm:p-8 md:p-12 rounded-3xl detail-header-animation">
              <Link
                href="/lapangan"
                className="inline-flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm hover:text-secondary transition"
              >
                &lt; {t.back}
              </Link>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6 leading-tight"
                style={{ color: "var(--text-main)" }}
              >
                {lapangan.nama}
              </h1>

              <p
                className="mt-4 text-sm sm:text-base break-words"
                style={{ color: "var(--text-secondary)" }}
              >
                📍 {lapangan.lokasi}
              </p>

              {Number(rataRataRating) > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-yellow-500">★</span>

                  <span
                    className="font-bold text-sm"
                    style={{ color: "var(--text-main)" }}
                  >
                    {rataRataRating}
                  </span>

                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ({jumlahRating} {t.rating})
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
                <div className="flex flex-wrap gap-2">
                  {kategoriLapangan.map((kategori, index) => (
                    <span
                      key={kategori}
                      className="liquid-detail-category detail-category-animation"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {kategori}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareWA}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition detail-button"
                  >
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold shadow-sm transition detail-button hover:border-primary hover:text-primary"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-main)",
                      color: "var(--text-main)",
                    }}
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 detail-section">
          <div className="mb-6 detail-reveal">
            <p className="text-primary font-semibold text-xs sm:text-sm mb-2">
              {t.galleryLabel}
            </p>

            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ color: "var(--text-main)" }}
            >
              {t.galleryTitle}
            </h2>
          </div>

          {daftarFoto.length > 0 ? (
            <div>
              <div
                className="relative overflow-hidden rounded-3xl liquid-photo h-[260px] sm:h-[380px] md:h-[500px] detail-gallery"
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

                {daftarFoto.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFotoAktif((prev) =>
                        prev === 0 ? daftarFoto.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition detail-gallery-button"
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-main)",
                    }}
                  >
                    &#10094;
                  </button>
                )}

                {daftarFoto.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFotoAktif((prev) =>
                        prev === daftarFoto.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition detail-gallery-button"
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-main)",
                    }}
                  >
                    &#10095;
                  </button>
                )}

                <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-sm">
                  {fotoAktif + 1} / {daftarFoto.length}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-5">
                {daftarFoto.map((foto, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFotoAktif(index)}
                    aria-label={`Lihat foto ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${fotoAktif === index
                      ? "w-8 bg-primary"
                      : "w-2"
                      }`}
                    style={
                      fotoAktif === index
                        ? {}
                        : { background: "var(--border-main)" }
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <div
              className="liquid-info-card p-10 text-center"
              style={{ color: "var(--text-muted)" }}
            >
              {isEnglish
                ? "No photos available."
                : "Belum ada foto lapangan."}
            </div>
          )}
        </section>

        {/* INFORMASI LAPANGAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 detail-section">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-5 sm:space-y-6">
              {/* DESKRIPSI */}
              <div className="liquid-info-card p-5 sm:p-6 md:p-8 detail-card">
                <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                  {t.aboutLabel}
                </p>

                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "var(--text-main)" }}
                >
                  {t.descriptionTitle}
                </h2>

                <p
                  className={`text-sm leading-relaxed whitespace-pre-line break-words ${showFullDescription ? "" : "line-clamp-4"
                    }`}
                  style={{ color: "var(--text-secondary)" }}
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
                    {showFullDescription ? t.showLess : t.readMore}
                  </button>
                )}
              </div>

              {/* FASILITAS */}
              <div className="liquid-info-card p-5 sm:p-6 md:p-8 detail-card">
                <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                  {t.comfortLabel}
                </p>

                <h2
                  className="text-xl font-bold mb-6"
                  style={{ color: "var(--text-main)" }}
                >
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
                        className="liquid-facility-detail detail-facility"
                        style={{ animationDelay: `${index * 70}ms` }}
                      >
                        <span className="text-primary font-bold">✓</span>
                        {fasilitas}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
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
              <div className="liquid-info-card p-5 sm:p-6 md:p-8 detail-card">
                <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                  {t.locationLabel}
                </p>

                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "var(--text-main)" }}
                >
                  {t.locationTitle}
                </h2>

                <p
                  className="text-sm leading-relaxed break-words"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {lapangan.alamat || lapangan.lokasi}
                </p>

                {lapangan.alamat && (
                  <div className="mt-5 sm:mt-6">
                    <div
                      className="rounded-2xl overflow-hidden shadow-sm detail-map"
                      style={{ border: "1px solid var(--border-main)" }}
                    >
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
              <div className="liquid-booking-card p-5 sm:p-6 md:p-7 lg:sticky lg:top-28 detail-booking">
                <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                  {t.bookingLabel}
                </p>

                <h2
                  className="text-xl font-bold mb-6"
                  style={{ color: "var(--text-main)" }}
                >
                  {t.bookingTitle}
                </h2>

                <p
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t.startingPrice}
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">
                  Rp{hargaLapangan.toLocaleString("id-ID")}
                </p>

                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t.session}
                </p>

                <div
                  className="my-6 border-t"
                  style={{ borderColor: "var(--border-main)" }}
                />

                <div className="space-y-4 text-sm">
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: "var(--text-main)" }}
                    >
                      {t.venueName}
                    </p>

                    <p
                      className="mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {lapangan.nama}
                    </p>
                  </div>

                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: "var(--text-main)" }}
                    >
                      {t.category}
                    </p>

                    <p
                      className="mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {kategoriLapangan.join(", ")}
                    </p>
                  </div>

                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: "var(--text-main)" }}
                    >
                      {t.location}
                    </p>

                    <p
                      className="mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {lapangan.lokasi}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookingClick}
                  className="liquid-booking-button block w-full text-center mt-7"
                >
                  {t.bookNow} &gt;
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ULASAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 detail-section">
          <div className="liquid-info-card p-5 sm:p-6 md:p-8 detail-card">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-primary text-xs font-semibold mb-2">
                  {isEnglish
                    ? "CUSTOMER FEEDBACK"
                    : "PENILAIAN PENGUNJUNG"}
                </p>

                <h2
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-main)" }}
                >
                  {t.reviewTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2.5 rounded-xl bg-soft-mint text-primary text-xs sm:text-sm font-semibold hover:bg-green-100 transition detail-button"
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
                className="mb-8 p-5 rounded-2xl shadow-sm space-y-4 detail-review-form"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-main)",
                }}
              >
                <h3
                  className="font-bold text-sm sm:text-base"
                  style={{ color: "var(--text-main)" }}
                >
                  {isEnglish
                    ? "Share Your Experience"
                    : "Bagikan Pengalamanmu"}
                </h3>

                <div>
                  <label
                    className="block text-xs font-semibold mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
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
                          : "text-gray-400"
                          }`}
                      >
                        ★
                      </button>
                    ))}

                    <span
                      className="text-xs font-bold ml-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      ({ratingInput}/5)
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
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

                <div>
                  <label
                    className="block text-xs font-semibold mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {isEnglish ? "Your Review" : "Ulasan Kamu"}

                    <span className="text-red-500 ml-1">*</span>
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
                  <span
                    className="text-3xl font-bold"
                    style={{ color: "var(--text-main)" }}
                  >
                    {rataRataRating}
                  </span>

                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    / 5
                  </span>

                  <span className="text-yellow-500 text-xl tracking-wider">
                    ★★★★★
                  </span>

                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
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
                        <div
                          key={index}
                          className="detail-aspect"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between gap-2 text-xs mb-2">
                            <span style={{ color: "var(--text-secondary)" }}>
                              {aspek.nama}
                            </span>

                            <span
                              className="font-semibold"
                              style={{ color: "var(--text-main)" }}
                            >
                              {nilai.toFixed(2)}
                            </span>
                          </div>

                          <div
                            className="w-full rounded-full h-1.5"
                            style={{ background: "var(--border-main)" }}
                          >
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
                      className="liquid-review-item rounded-xl p-4 sm:p-5 detail-review-item"
                      style={{
                        borderColor: "var(--border-main)",
                        animationDelay: `${index * 80}ms`,
                      }}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <h3
                            className="font-bold text-sm"
                            style={{ color: "var(--text-main)" }}
                          >
                            {ulasan.nama}
                          </h3>

                          <p
                            className="text-xs mt-1"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {t.reviewed}: {ulasan.tanggal}
                          </p>
                        </div>

                        <span className="text-yellow-500 text-sm font-semibold whitespace-nowrap">
                          ★ {Number(ulasan.rating || 0).toFixed(1)}
                        </span>
                      </div>

                      <p
                        className="text-sm mt-4 leading-relaxed break-words"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {ulasan.komentar}
                      </p>

                      {ulasan.court && (
                        <p
                          className="text-xs mt-5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {ulasan.court}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {daftarSemuaUlasan.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-primary font-semibold text-sm mt-6 hover:text-secondary transition"
                  >
                    {showAllReviews ? t.reviewLess : t.allReviews}
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">★</div>

                <p
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t.noReviews}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* REKOMENDASI LAPANGAN */}
        {rekomendasi.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 detail-section">
            <div className="mb-8 detail-reveal">
              <p className="text-primary text-xs sm:text-sm font-semibold mb-2">
                {t.recommendationLabel}
              </p>

              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-main)" }}
              >
                {t.recommendationTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {rekomendasi.slice(0, 6).map((item, index) => (
                <div
                  key={item.id}
                  className="detail-recommendation"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardLapangan {...item} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* ANIMASI DETAIL LAPANGAN */}
      <style jsx global>{`
        @keyframes detailFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes detailFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes detailFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes detailGlow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.45;
            transform: scale(1.12);
          }
        }

        .detail-header-animation {
          animation: detailFadeUp 0.8s ease both;
        }

        .detail-glow {
          animation: detailGlow 6s ease-in-out infinite;
        }

        .detail-glow-delay {
          animation-delay: 2s;
        }

        .detail-section {
          animation: detailFadeIn 0.8s ease both;
        }

        .detail-section:nth-of-type(2) {
          animation-delay: 0.1s;
        }

        .detail-section:nth-of-type(3) {
          animation-delay: 0.2s;
        }

        .detail-section:nth-of-type(4) {
          animation-delay: 0.3s;
        }

        .detail-gallery {
          animation: detailFadeUp 0.8s ease both;
        }

        .detail-gallery img {
          transition: transform 0.7s ease;
        }

        .detail-gallery:hover img {
          transform: scale(1.025);
        }

        .detail-gallery-button {
          transition:
            transform 0.25s ease,
            background 0.25s ease;
        }

        .detail-gallery-button:hover {
          transform: translateY(-50%) scale(1.1);
        }

        .detail-card,
        .detail-booking {
          animation: detailFadeUp 0.7s ease both;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .detail-card:hover {
          transform: translateY(-4px);
        }

        .detail-booking {
          animation-delay: 0.15s;
        }

        .detail-category-animation,
        .detail-facility,
        .detail-aspect,
        .detail-review-item,
        .detail-recommendation {
          animation: detailFadeUp 0.6s ease both;
        }

        .detail-facility,
        .detail-review-item {
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .detail-facility:hover,
        .detail-review-item:hover {
          transform: translateY(-4px);
        }

        .detail-button,
        .detail-page .liquid-booking-button {
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .detail-button:hover,
        .detail-page .liquid-booking-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(20, 107, 69, 0.18);
        }

        .detail-map {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .detail-map:hover {
          transform: translateY(-3px);
        }

        .detail-review-form {
          animation: detailFadeUp 0.4s ease both;
        }

        .detail-reveal {
          animation: detailFadeUp 0.7s ease both;
        }

        @media (prefers-reduced-motion: reduce) {
          .detail-page *,
          .detail-page *::before,
          .detail-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}