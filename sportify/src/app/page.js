"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardLapangan from "@/components/CardLapangan";
import { daftarLapangan } from "@/lib/lapangan";
import { translations } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageProvider";

const kategoriOlahraga = [
  {
    nama: "Padel",
    icon: "🎾",
    warna: "bg-green-100",
    deskripsi: "Play with friends",
  },
  {
    nama: "Tennis",
    icon: "🎾",
    warna: "bg-lime-100",
    deskripsi: "Serve your best",
  },
  {
    nama: "Mini Soccer",
    icon: "⚽",
    warna: "bg-emerald-100",
    deskripsi: "Score together",
  },
  {
    nama: "Badminton",
    icon: "🏸",
    warna: "bg-teal-100",
    deskripsi: "Smash your limits",
  },
];

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language].home;
  const isEnglish = language === "en";

  const keunggulan = [
    {
      icon: "🔎",
      title: isEnglish ? "Easy to Find" : "Mudah Ditemukan",
      desc: isEnglish
        ? "Discover sports venues that match your needs."
        : "Temukan lapangan olahraga sesuai kebutuhanmu.",
    },
    {
      icon: "📅",
      title: isEnglish ? "Easy Booking" : "Booking Praktis",
      desc: isEnglish
        ? "Choose your preferred venue and schedule."
        : "Pilih lapangan dan jadwal bermain dengan mudah.",
    },
    {
      icon: "⭐",
      title: isEnglish ? "Trusted Reviews" : "Ulasan Pengguna",
      desc: isEnglish
        ? "Check ratings and reviews before booking."
        : "Lihat rating dan ulasan sebelum memilih lapangan.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-white">

        {/* HERO SECTION */}
        <section className="relative px-4 sm:px-6 pt-10 sm:pt-14 pb-16">

          <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-60" />

          <div className="absolute bottom-0 right-0 w-80 h-80 bg-lime-100 rounded-full blur-3xl opacity-50" />

          <div className="relative max-w-7xl mx-auto">

            <div className="liquid-hero relative overflow-hidden rounded-[32px] sm:rounded-[40px] p-7 sm:p-12 md:p-16 lg:p-20">

              <div className="absolute top-0 right-0 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />

              <div className="relative grid lg:grid-cols-2 gap-12 items-center">

                <div className="text-center lg:text-left">

                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-white/80 text-primary text-xs sm:text-sm font-semibold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    SPORTIFY · SEMARANG
                  </span>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-text leading-tight mt-7">
                    {t.heroTitle}
                    <br />
                    <span className="text-primary">
                      {t.heroHighlight}
                    </span>
                  </h1>

                  <p className="text-gray-600 mt-5 max-w-lg mx-auto lg:mx-0 leading-relaxed text-sm sm:text-base lg:text-lg">
                    {t.heroDescription}
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mt-8">

                    <Link
                      href="/lapangan"
                      className="liquid-primary-button px-8 py-4 rounded-2xl text-sm sm:text-base text-center font-semibold hover:-translate-y-1 transition-all duration-300"
                    >
                      {t.findCourt} →
                    </Link>

                    <Link
                      href="/lapangan"
                      className="px-8 py-4 rounded-2xl bg-white/70 border border-white text-primary font-semibold text-sm sm:text-base hover:bg-white transition text-center"
                    >
                      {isEnglish ? "Explore Courts" : "Jelajahi Lapangan"}
                    </Link>

                  </div>

                  <div className="flex justify-center lg:justify-start gap-6 mt-9 text-sm text-gray-500">

                    <div>
                      <p className="font-bold text-dark-text text-lg">
                        4+
                      </p>
                      <p>{isEnglish ? "Sports" : "Olahraga"}</p>
                    </div>

                    <div className="w-px bg-green-200" />

                    <div>
                      <p className="font-bold text-dark-text text-lg">
                        {daftarLapangan.length}+
                      </p>
                      <p>{isEnglish ? "Courts" : "Lapangan"}</p>
                    </div>

                    <div className="w-px bg-green-200" />

                    <div>
                      <p className="font-bold text-dark-text text-lg">
                        24/7
                      </p>
                      <p>{isEnglish ? "Explore" : "Jelajahi"}</p>
                    </div>

                  </div>

                </div>

                {/* HERO VISUAL */}

                <div className="relative max-w-lg mx-auto w-full">

                  <div className="relative rounded-[30px] bg-gradient-to-br from-green-200 via-emerald-100 to-lime-100 p-5 sm:p-8 min-h-[300px] sm:min-h-[380px] flex items-center justify-center overflow-hidden">

                    <div className="absolute w-64 h-64 rounded-full border border-white/60" />
                    <div className="absolute w-80 h-80 rounded-full border border-white/40" />

                    <div className="relative text-center">

                      <div className="text-8xl sm:text-9xl mb-5">
                        🎾
                      </div>

                      <p className="text-primary font-bold text-xl sm:text-2xl">
                        PLAY YOUR GAME
                      </p>

                      <p className="text-gray-600 text-sm mt-2">
                        Find your perfect court.
                      </p>

                    </div>

                    <div className="absolute top-6 left-5 sm:left-7 bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg">
                      <p className="text-xs text-gray-500">
                        {isEnglish ? "Your game" : "Olahraga favorit"}
                      </p>
                      <p className="text-sm font-bold text-dark-text">
                        Let's Play!
                      </p>
                    </div>

                    <div className="absolute bottom-6 right-5 sm:right-7 bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg">
                      <p className="text-xs text-gray-500">
                        SPORTIFY
                      </p>
                      <p className="text-sm font-bold text-primary">
                        Find · Book · Play
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* CATEGORY SECTION */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9">

            <div>
              <p className="text-primary font-semibold text-sm tracking-wider mb-3">
                {t.categoryLabel}
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-text">
                {t.categoryTitle}
              </h2>

              <p className="text-gray-500 mt-3 text-sm sm:text-base">
                {t.categoryDescription}
              </p>
            </div>

            <Link
              href="/lapangan"
              className="text-primary font-semibold text-sm hover:underline"
            >
              {t.seeAll} →
            </Link>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {kategoriOlahraga.map((kategori) => (

              <Link
                key={kategori.nama}
                href={`/lapangan?kategori=${encodeURIComponent(kategori.nama)}`}
                className="group liquid-category rounded-3xl p-5 sm:p-7 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >

                <div className={`${kategori.warna} w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-110 transition-transform`}>
                  {kategori.icon}
                </div>

                <h3 className="font-bold text-dark-text mt-5 text-base sm:text-lg">
                  {kategori.nama}
                </h3>

                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  {kategori.deskripsi}
                </p>

                <span className="text-primary text-sm mt-4 font-semibold">
                  Explore →
                </span>

              </Link>

            ))}

          </div>

        </section>

        {/* POPULAR COURTS */}

        <section className="relative bg-soft-mint/40 py-16 sm:py-20">

          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">

              <div>
                <p className="text-primary font-semibold text-sm tracking-wider mb-3">
                  {t.recommendationLabel}
                </p>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-text">
                  {t.recommendationTitle}
                </h2>

                <p className="text-gray-500 mt-3 text-sm sm:text-base">
                  {t.recommendationDescription}
                </p>
              </div>

              <Link
                href="/lapangan"
                className="text-primary font-semibold text-sm hover:underline"
              >
                {t.seeAll} →
              </Link>

            </div>

            <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory">

              {daftarLapangan.slice(0, 6).map((lapangan) => (

                <div
                  key={lapangan.id}
                  className="min-w-[280px] sm:min-w-[320px] max-w-[320px] flex-shrink-0 snap-start"
                >
                  <CardLapangan {...lapangan} />
                </div>

              ))}

            </div>

          </div>
        </section>

        {/* WHY SPORTIFY */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

          <div className="text-center mb-12">

            <p className="text-primary font-semibold text-sm tracking-wider mb-3">
              WHY SPORTIFY?
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-text">
              {isEnglish
                ? "Everything You Need to Play"
                : "Semua yang Kamu Butuhkan untuk Bermain"}
            </h2>

            <p className="text-gray-500 mt-4 text-sm sm:text-base max-w-xl mx-auto">
              {isEnglish
                ? "Make finding and booking sports venues easier with Sportify."
                : "Buat pengalaman mencari dan memesan lapangan olahraga menjadi lebih mudah bersama Sportify."}
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {keunggulan.map((item, index) => (

              <div
                key={index}
                className="liquid-info-card rounded-3xl p-7 sm:p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >

                <div className="w-16 h-16 rounded-2xl bg-soft-mint flex items-center justify-center text-3xl mx-auto">
                  {item.icon}
                </div>

                <h3 className="text-lg font-bold text-dark-text mt-6">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mt-3">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* PROMO / CTA */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          <div className="liquid-cta relative overflow-hidden rounded-[32px] p-8 sm:p-12 md:p-16 text-center">

            <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime/20 rounded-full blur-3xl" />

            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative">

              <span className="text-green-100 text-sm font-semibold tracking-widest">
                SPORTIFY
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-5">
                {t.ctaTitle}
              </h2>

              <p className="text-green-100 mt-5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                {t.ctaDescription}
              </p>

              <Link
                href="/lapangan"
                className="inline-block mt-9 bg-white text-primary px-9 py-4 rounded-2xl font-semibold text-sm sm:text-base shadow-lg hover:bg-soft-mint hover:-translate-y-1 transition-all duration-300"
              >
                {t.bookNow} →
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}