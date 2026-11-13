"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardLapangan from "@/components/CardLapangan";
import { daftarLapangan } from "@/lib/lapangan";
import { daftarArtikel } from "@/lib/artikel";
import { translations } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

const kategoriOlahraga = [
  {
    nama: "Padel",
    icon: "🎾",
    tagline: "Play with friends",
    warna: "from-emerald-500 to-green-800",
  },
  {
    nama: "Tennis",
    icon: "🎾",
    tagline: "Serve your best",
    warna: "from-lime-500 to-green-700",
  },
  {
    nama: "Mini Soccer",
    icon: "⚽",
    tagline: "Score together",
    warna: "from-green-500 to-teal-800",
  },
  {
    nama: "Badminton",
    icon: "🏸",
    tagline: "Smash your limits",
    warna: "from-teal-500 to-emerald-800",
  },
];

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language].home;
  const isEnglish = language === "en";

  // CERITA PENGGUNA DARI API
  const [testimoniPengguna, setTestimoniPengguna] = useState([]);
  const [loadingCerita, setLoadingCerita] = useState(true);
  const [semuaLapangan, setSemuaLapangan] = useState(daftarLapangan);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch("/api/lapangan");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSemuaLapangan(json.data);
        }
      } catch {
        // Fallback ke data statis
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    const fetchCeritaPengguna = async () => {
      try {
        const response = await apiRequest("/cerita-pengguna");

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        const ceritaDisetujui = data
          .filter((item) => item.status === "approved")
          .sort(
            (a, b) =>
              new Date(b.tanggal).getTime() -
              new Date(a.tanggal).getTime()
          );

        setTestimoniPengguna(ceritaDisetujui);
      } catch (error) {
        console.error("Gagal mengambil cerita pengguna:", error);
        setTestimoniPengguna([]);
      } finally {
        setLoadingCerita(false);
      }
    };

    fetchCeritaPengguna();
  }, []);

  const keunggulan = [
    {
      icon: "🔎",
      judul: isEnglish ? "Easy to Find" : "Mudah Ditemukan",
      deskripsi: isEnglish
        ? "Discover various sports venues based on your location and favorite sport."
        : "Temukan berbagai pilihan lapangan olahraga berdasarkan lokasi dan olahraga favoritmu.",
    },
    {
      icon: "📅",
      judul: isEnglish ? "Easy Booking" : "Booking Praktis",
      deskripsi: isEnglish
        ? "Choose your preferred venue, date, and schedule without complicated steps."
        : "Pilih lapangan, tanggal, dan jadwal bermain tanpa proses yang rumit.",
    },
    {
      icon: "⭐",
      judul: isEnglish ? "Trusted Reviews" : "Ulasan Pengguna",
      deskripsi: isEnglish
        ? "Read reviews and ratings from other users before making a reservation."
        : "Lihat ulasan dan penilaian pengguna lain sebelum melakukan pemesanan.",
    },
  ];

  const aktivitas = [
    {
      icon: "🏆",
      judul: isEnglish ? "Sports Tournament" : "Turnamen Olahraga",
      deskripsi: isEnglish
        ? "Find a venue for your next competition."
        : "Temukan lapangan untuk pertandingan dan kompetisi berikutnya.",
    },
    {
      icon: "👥",
      judul: isEnglish ? "Play Together" : "Main Bareng",
      deskripsi: isEnglish
        ? "Spend quality time with friends through sports."
        : "Habiskan waktu bersama teman dengan aktivitas olahraga.",
    },
    {
      icon: "💚",
      judul: isEnglish ? "Stay Active" : "Tetap Aktif",
      deskripsi: isEnglish
        ? "Make exercise a fun part of your daily routine."
        : "Jadikan olahraga sebagai bagian menyenangkan dari rutinitasmu.",
    },
  ];

  const caraBooking = [
    {
      nomor: "01",
      icon: "🔍",
      judul: isEnglish ? "Find a Court" : "Cari Lapangan",
      deskripsi: isEnglish
        ? "Explore available sports venues."
        : "Jelajahi berbagai pilihan lapangan olahraga.",
    },
    {
      nomor: "02",
      icon: "📆",
      judul: isEnglish ? "Choose a Schedule" : "Pilih Jadwal",
      deskripsi: isEnglish
        ? "Select your preferred date and playing time."
        : "Tentukan tanggal dan waktu bermain yang kamu inginkan.",
    },
    {
      nomor: "03",
      icon: "🏃",
      judul: isEnglish ? "Enjoy Your Game" : "Nikmati Permainan",
      deskripsi: isEnglish
        ? "Get ready and enjoy your sports session."
        : "Siapkan perlengkapanmu dan nikmati waktu bermain.",
    },
  ];

  const artikelTerbaru = daftarArtikel.slice(0, 3);

  const getImageForCategory = (nama) => {
    const match = semuaLapangan.find((lapangan) => {
      const kategori = Array.isArray(lapangan.kategori)
        ? lapangan.kategori
        : [lapangan.kategori];

      return kategori.some(
        (item) => String(item).toLowerCase() === nama.toLowerCase()
      );
    });

    return match?.gambar || null;
  };

  const lapanganUnggulan = semuaLapangan.slice(0, 8);
  const heroImage = semuaLapangan[0]?.gambar;

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-[var(--bg-main)]">
        {/* HERO SECTION */}
        <section className="relative bg-[var(--bg-soft)] px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 dark:border-white/10 bg-white/80 dark:bg-white/10 px-4 py-2 text-sm font-semibold text-primary dark:text-green-300 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                {isEnglish
                  ? "Your Sports Booking Platform"
                  : "Platform Penyewaan Lapangan Olahraga"}
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-dark-text dark:text-white md:text-5xl lg:text-6xl">
                {t.heroTitle}{" "}
                <span className="text-primary dark:text-green-400">
                  {t.heroHighlight}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 dark:text-gray-300 md:text-lg">
                {t.heroDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/lapangan"
                  className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-lg shadow-green-900/15 transition hover:-translate-y-1 hover:bg-green-800"
                >
                  {t.findCourt}
                  <span className="text-lg">&gt;</span>
                </Link>

                <Link
                  href="/artikel"
                  className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-7 py-4 font-semibold text-primary transition hover:bg-soft-mint dark:border-white/10 dark:bg-[#1B2B22] dark:text-green-300 dark:hover:bg-green-900/40"
                >
                  {isEnglish ? "Read Articles" : "Jelajahi Artikel"}
                </Link>
              </div>

              <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-green-200 pt-7 dark:border-white/10">
                <div>
                  <p className="text-2xl font-extrabold text-primary dark:text-green-400 md:text-3xl">
                    4+
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                    {isEnglish ? "Sports Categories" : "Kategori Olahraga"}
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-primary dark:text-green-400 md:text-3xl">
                    {semuaLapangan.length}+
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                    {isEnglish ? "Sports Venues" : "Pilihan Lapangan"}
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-primary dark:text-green-400 md:text-3xl">
                    24/7
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                    {isEnglish ? "Easy Access" : "Akses Fleksibel"}
                  </p>
                </div>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-lime-300/50 blur-2xl" />

              <div className="relative h-[390px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-emerald-900 shadow-2xl md:h-[480px]">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt="Sports venue"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-8xl">
                    🎾
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#062b1b]/90 via-[#062b1b]/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-9">
                  <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur-md">
                    SPORTIFY EXPERIENCE
                  </span>

                  <h2 className="mt-5 text-3xl font-bold md:text-4xl">
                    {isEnglish ? "Find your court." : "Temukan lapanganmu."}
                    <br />
                    <span className="text-lime-300">
                      {isEnglish ? "Feel the game." : "Rasakan serunya."}
                    </span>
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                    {isEnglish
                      ? "Your next sports experience starts here."
                      : "Pengalaman olahraga berikutnya dimulai dari sini."}
                  </p>
                </div>

                <div className="absolute right-5 top-5 rounded-2xl border border-white/30 bg-white/20 px-4 py-3 text-white shadow-lg backdrop-blur-xl">
                  <p className="text-xs text-white/80">
                    {isEnglish ? "Explore" : "Jelajahi"}
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {semuaLapangan.length}+{" "}
                    <span className="text-sm font-normal">
                      {isEnglish ? "Venues" : "Lapangan"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-4 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#1B2B22]/95 md:-left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft-mint text-xl dark:bg-green-900/50">
                    ⭐
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark-text dark:text-white">
                      {isEnglish ? "Find your favorite" : "Pilih favoritmu"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isEnglish ? "Book with ease" : "Booking lebih praktis"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY SECTION */}
        <section className="px-5 py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-secondary dark:text-green-400">
                  {t.categoryLabel}
                </p>
                <h2 className="text-3xl font-extrabold text-dark-text dark:text-white md:text-4xl">
                  {t.categoryTitle}
                </h2>
                <p className="mt-3 max-w-xl text-gray-500 dark:text-gray-400">
                  {t.categoryDescription}
                </p>
              </div>

              <Link
                href="/lapangan"
                className="font-semibold text-primary transition hover:text-secondary dark:text-green-400"
              >
                {t.seeAll} &gt;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {kategoriOlahraga.map((kategori) => {
                const gambar = getImageForCategory(kategori.nama);

                return (
                  <Link
                    key={kategori.nama}
                    href={`/lapangan?kategori=${encodeURIComponent(kategori.nama)}`}
                    className="group relative h-56 overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl md:h-72"
                  >
                    {gambar ? (
                      <img
                        src={gambar}
                        alt={kategori.nama}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${kategori.warna}`} />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                      <span className="text-3xl">{kategori.icon}</span>
                      <h3 className="mt-3 text-xl font-bold md:text-2xl">
                        {kategori.nama}
                      </h3>
                      <p className="mt-1 text-xs text-white/80 md:text-sm">
                        {kategori.tagline}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                        {isEnglish ? "Explore" : "Jelajahi"}
                        <span className="transition group-hover:translate-x-1">&gt;</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROMO BANNER */}
        <section className="px-5 pb-20 md:px-10">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary">
            {semuaLapangan[0]?.gambar && (
              <img
                src={semuaLapangan[0].gambar}
                alt="Sportify promotion"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#052d1c]/95 via-[#052d1c]/80 to-[#052d1c]/30" />

            <div className="relative max-w-2xl px-7 py-14 text-white md:px-14 md:py-20">
              <span className="rounded-full border border-lime-300/40 bg-lime-300/15 px-4 py-2 text-xs font-bold uppercase tracking-widest text-lime-300">
                SPORTIFY
              </span>

              <h2 className="mt-6 text-3xl font-extrabold leading-tight md:text-5xl">
                {isEnglish
                  ? "Your next game starts here."
                  : "Permainan Seru Dimulai dari Sini"}
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-white/75">
                {isEnglish
                  ? "Find the right venue, choose your schedule, and get ready to play."
                  : "Temukan lapangan yang tepat, tentukan jadwal bermain, dan bersiaplah untuk pengalaman olahraga yang menyenangkan."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/lapangan"
                  className="rounded-full bg-lime-300 px-7 py-3.5 font-bold text-green-950 transition hover:bg-lime-200"
                >
                  {isEnglish ? "Book a Court" : "Cari Lapangan"} &gt;
                </Link>

                <Link
                  href="/artikel"
                  className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  {isEnglish ? "Read More" : "Baca Artikel"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR COURTS */}
        <section className="overflow-hidden bg-gradient-to-br from-[#0C5638] to-[#073C29] px-5 py-20 text-white md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-lime-300">
                  SPORTIFY PICKS
                </p>

                <h2 className="text-3xl font-extrabold md:text-4xl">
                  {isEnglish ? "Popular Sports Venues" : "Lapangan Pilihan"}
                </h2>

                <p className="mt-3 text-sm text-white/70 md:text-base">
                  {isEnglish
                    ? "Discover popular venues for your next game."
                    : "Temukan berbagai pilihan lapangan untuk aktivitas olahragamu."}
                </p>
              </div>

              <Link
                href="/lapangan"
                className="font-semibold text-lime-300 transition hover:text-white"
              >
                {t.seeAll} &gt;
              </Link>
            </div>

            <div className="-mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-6 md:-mx-10 md:px-10">
              {lapanganUnggulan.map((lapangan, index) => (
                <div
                  key={lapangan.id}
                  className="relative w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl bg-white text-dark-text shadow-xl md:w-[320px]"
                >
                  <div className="absolute left-4 top-4 z-10 rounded-full bg-lime-300 px-3 py-1.5 text-xs font-bold text-green-950 shadow">
                    {index < 3
                      ? isEnglish
                        ? "POPULAR"
                        : "POPULER"
                      : isEnglish
                        ? "RECOMMENDED"
                        : "REKOMENDASI"}
                  </div>

                  <CardLapangan {...lapangan} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS / CERITA PENGGUNA */}
        <section className="bg-[#F5F8F5] px-5 py-20 dark:bg-[#101B15] md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-secondary dark:text-green-400">
                {isEnglish ? "USER STORIES" : "CERITA PENGGUNA"}
              </p>

              <h2 className="text-3xl font-extrabold text-[#202B25] dark:text-white md:text-4xl">
                {isEnglish
                  ? "Experiences with Sportify"
                  : "Pengalaman Mereka Bersama Sportify"}
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-300">
                {isEnglish
                  ? "Real stories from people who have experienced Sportify."
                  : "Cerita dan pengalaman nyata dari pengguna yang telah menggunakan Sportify."}
              </p>
            </div>

            {loadingCerita ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-green-200 border-t-primary" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {isEnglish ? "Loading user stories..." : "Memuat cerita pengguna..."}
                </p>
              </div>
            ) : testimoniPengguna.length > 0 ? (
              <div className="-mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-5 md:-mx-10 md:px-10">
                {testimoniPengguna.map((cerita) => (
                  <div
                    key={cerita.id}
                    className="flex w-[290px] shrink-0 snap-start flex-col rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#1B2B22] md:w-[340px]"
                  >
                    <div className="mb-4 flex gap-1 text-lg text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < Number(cerita.rating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>

                    <p className="flex-1 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      “{cerita.cerita}”
                    </p>

                    <div className="mt-6 border-t border-gray-100 pt-5 dark:border-white/10">
                      <p className="font-bold text-[#202B25] dark:text-white">
                        {cerita.nama || (isEnglish ? "Sportify User" : "Pengguna Sportify")}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-soft-mint px-3 py-1 text-xs font-semibold text-primary dark:bg-green-900/50 dark:text-green-300">
                          {cerita.kategori}
                        </span>

                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {cerita.tanggal
                            ? new Date(cerita.tanggal).toLocaleDateString(
                              isEnglish ? "en-US" : "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-green-200 bg-white/70 px-6 py-12 text-center dark:border-white/10 dark:bg-[#1B2B22]">
                <div className="text-4xl">💚</div>

                <h3 className="mt-4 text-lg font-bold text-dark-text dark:text-white">
                  {isEnglish
                    ? "Your story could be here!"
                    : "Ceritamu Bisa Tampil di Sini!"}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500 dark:text-gray-400">
                  {isEnglish
                    ? "Share your experience using Sportify and let others know what you think."
                    : "Bagikan pengalamanmu menggunakan Sportify dan ceritakan pendapatmu kepada pengguna lainnya."}
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/cerita-pengguna"
                className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-6 py-3 font-semibold text-primary transition hover:bg-soft-mint dark:border-white/10 dark:bg-[#1B2B22] dark:text-green-300 dark:hover:bg-green-900/40"
              >
                {isEnglish ? "See All Stories" : "Lihat Semua Cerita"}
                <span>&gt;</span>
              </Link>

              <Link
                href="/cerita-pengguna/tulis"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                {isEnglish ? "Share Your Story" : "Tulis Ceritamu"}
                <span>&gt;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* WHY SPORTIFY */}
        <section className="bg-white px-5 py-20 dark:bg-[#142019] md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-secondary dark:text-green-400">
                WHY SPORTIFY
              </p>

              <h2 className="text-3xl font-extrabold text-dark-text dark:text-white md:text-4xl">
                {isEnglish
                  ? "A Better Way to Book Your Court"
                  : "Kenapa Memilih Sportify?"}
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-500 dark:text-gray-300">
                {isEnglish
                  ? "We make finding and booking sports venues easier, so you can focus on enjoying the game."
                  : "Sportify membantu proses pencarian dan pemesanan lapangan menjadi lebih mudah agar kamu bisa fokus menikmati permainan."}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {keunggulan.map((item, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-green-100 bg-[#F8FBF8] p-8 transition duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl dark:border-white/10 dark:bg-[#1B2B22] dark:hover:border-green-700"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-soft-mint text-3xl dark:bg-green-900/50">
                    {item.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-dark-text dark:text-white">
                    {item.judul}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-300">
                    {item.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SPORTS ACTIVITIES */}
        <section className="bg-[#F5F8F5] px-5 py-20 dark:bg-[#101B15] md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-secondary dark:text-green-400">
                  MORE THAN JUST SPORTS
                </p>

                <h2 className="text-3xl font-extrabold text-[#202B25] dark:text-white md:text-4xl">
                  {isEnglish
                    ? "Make Every Game Meaningful"
                    : "Lebih dari Sekadar Olahraga"}
                </h2>

                <p className="mt-3 max-w-xl text-gray-600 dark:text-gray-300">
                  {isEnglish
                    ? "Sports are not just about playing. They are about connection, memorable moments, and a healthier lifestyle."
                    : "Olahraga bukan hanya tentang permainan, tetapi juga tentang kebersamaan, pengalaman baru, dan gaya hidup yang lebih sehat."}
                </p>
              </div>

              <Link
                href="/lapangan"
                className="font-semibold text-primary transition hover:text-secondary dark:text-green-300"
              >
                {isEnglish ? "Explore Venues" : "Jelajahi Lapangan"} &gt;
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {aktivitas.map((item, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-3xl border border-green-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl dark:border-white/10 dark:bg-[#1B2B22] dark:hover:border-green-700"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-soft-mint text-3xl transition group-hover:scale-110 dark:bg-green-900/50">
                    {item.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#202B25] dark:text-white">
                    {item.judul}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
                    {item.deskripsi}
                  </p>

                  <Link
                    href="/lapangan"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-secondary dark:text-green-300"
                  >
                    {isEnglish ? "Find a Venue" : "Cari Lapangan"}
                    <span className="transition group-hover:translate-x-1">&gt;</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO BOOK */}
        <section className="bg-white px-5 py-20 dark:bg-[#142019] md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-secondary dark:text-green-400">
                SIMPLE STEPS
              </p>

              <h2 className="text-3xl font-extrabold text-dark-text dark:text-white md:text-4xl">
                {isEnglish
                  ? "How to Book a Court?"
                  : "Bagaimana Cara Booking?"}
              </h2>

              <p className="mt-4 text-gray-500 dark:text-gray-300">
                {isEnglish
                  ? "Three simple steps to start your sports experience."
                  : "Hanya dengan tiga langkah mudah untuk memulai pengalaman olahragamu."}
              </p>
            </div>

            <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
              {caraBooking.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-100 bg-soft-mint text-4xl dark:border-white/10 dark:bg-green-900/40">
                    {item.icon}

                    <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {item.nomor}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-dark-text dark:text-white">
                    {item.judul}
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-gray-500 dark:text-gray-300">
                    {item.deskripsi}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/lapangan"
                className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-800"
              >
                {isEnglish ? "Start Booking" : "Mulai Booking"}
                <span>&gt;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* LATEST ARTICLES */}
        {artikelTerbaru.length > 0 && (
          <section className="bg-[#F5F8F5] px-5 py-20 dark:bg-[#101B15] md:px-10 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-secondary dark:text-green-400">
                    SPORTIFY JOURNAL
                  </p>

                  <h2 className="text-3xl font-extrabold text-dark-text dark:text-white md:text-4xl">
                    {isEnglish
                      ? "Latest Sports Articles"
                      : "Artikel & Informasi Olahraga"}
                  </h2>

                  <p className="mt-3 text-gray-500 dark:text-gray-300">
                    {isEnglish
                      ? "Get inspiration and useful information about sports."
                      : "Temukan informasi, tips, dan inspirasi seputar dunia olahraga."}
                  </p>
                </div>

                <Link
                  href="/artikel"
                  className="font-semibold text-primary hover:text-secondary dark:text-green-400"
                >
                  {isEnglish ? "View All Articles" : "Lihat Semua Artikel"} &gt;
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {artikelTerbaru.map((artikel, index) => (
                  <Link
                    key={artikel.id || artikel.slug || index}
                    href={`/artikel/${artikel.slug}`}
                    className={`group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl dark:bg-[#1B2B22] ${index === 0 ? "md:col-span-2" : ""
                      }`}
                  >
                    <div
                      className={`relative overflow-hidden bg-gray-200 ${index === 0 ? "h-64 md:h-80" : "h-56"
                        }`}
                    >
                      {artikel.gambar && (
                        <img
                          src={artikel.gambar}
                          alt={isEnglish ? artikel.judulEn : artikel.judul}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {artikel.kategori && (
                        <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-primary backdrop-blur-md">
                          {artikel.kategori}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {artikel.tanggal}
                        {artikel.penulis && ` • ${artikel.penulis}`}
                      </p>

                      <h3 className="mt-3 text-lg font-bold leading-snug text-dark-text transition group-hover:text-primary dark:text-white md:text-xl">
                        {isEnglish
                          ? artikel.judulEn || artikel.judul
                          : artikel.judul}
                      </h3>

                      <p className="mt-3 line-clamp-2 text-sm leading-7 text-gray-500 dark:text-gray-300">
                        {isEnglish
                          ? artikel.deskripsiEn || artikel.deskripsi
                          : artikel.deskripsi}
                      </p>

                      <p className="mt-5 text-sm font-bold text-primary dark:text-green-400">
                        {isEnglish ? "Read Article" : "Baca Artikel"} &gt;
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <section className="px-5 py-20 md:px-10 md:py-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[#073C29] px-7 py-16 text-center text-white md:px-16 md:py-20">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

            <div className="relative">
              <span className="text-4xl">🏸</span>

              <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
                {t.ctaTitle}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/75">
                {t.ctaDescription}
              </p>

              <Link
                href="/lapangan"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-lime-300 px-8 py-4 font-bold text-green-950 shadow-lg transition hover:-translate-y-1 hover:bg-lime-200"
              >
                {t.bookNow}
                <span>&gt;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}