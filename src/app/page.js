"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardLapangan from "@/components/CardLapangan";
import { daftarLapangan } from "@/lib/lapangan";
import { translations } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageProvider";

const kategoriOlahraga = [
  "Padel",
  "Tennis",
  "Mini Soccer",
  "Badminton",
];

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language].home;

  return (
    <>
      <Navbar />

      <main className="overflow-hidden">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden px-4 sm:px-6 py-12 sm:py-16 md:py-24">

          <div className="absolute top-10 left-0 sm:left-10 w-48 sm:w-64 h-48 sm:h-64 bg-soft-mint rounded-full blur-3xl opacity-80" />

          <div className="absolute bottom-0 right-0 sm:right-10 w-56 sm:w-72 h-56 sm:h-72 bg-green-100 rounded-full blur-3xl opacity-60" />

          <div className="relative max-w-7xl mx-auto">
            <div className="liquid-hero rounded-3xl sm:rounded-[32px] px-5 py-14 sm:px-8 sm:py-20 md:px-16 md:py-28 text-center">

              <span className="inline-block px-4 sm:px-5 py-2 rounded-full bg-white/70 border border-white/80 text-primary text-xs sm:text-sm font-semibold shadow-sm">
                SPORTIFY · SEMARANG
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-dark-text leading-tight mt-7 sm:mt-8">
                {t.heroTitle}
                <br />
                <span className="text-primary">
                  {t.heroHighlight}
                </span>
              </h1>

              <p className="text-gray-600 mt-5 sm:mt-6 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg">
                {t.heroDescription}
              </p>

              <div className="flex justify-center mt-8 sm:mt-10">
                <Link
                  href="/lapangan"
                  className="liquid-primary-button text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl"
                >
                  {t.findCourt} →
                </Link>
              </div>

              <p className="text-gray-400 text-xs mt-7 sm:mt-8">
                {t.heroFooter}
              </p>

            </div>
          </div>
        </section>

        {/* KATEGORI OLAHRAGA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

          <div className="text-center mb-8 sm:mb-10">
            <p className="text-primary font-semibold text-xs sm:text-sm mb-3 tracking-wider">
              {t.categoryLabel}
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-text">
              {t.categoryTitle}
            </h2>

            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              {t.categoryDescription}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {kategoriOlahraga.map((kategori) => (
              <Link
                key={kategori}
                href={`/lapangan?kategori=${encodeURIComponent(kategori)}`}
                className="liquid-category"
              >
                {kategori}
                <span className="text-primary ml-2">↗</span>
              </Link>
            ))}
          </div>

        </section>

        {/* DAFTAR LAPANGAN */}
        <section className="relative bg-soft-mint/40 py-14 sm:py-16 md:py-20">

          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8 sm:mb-10">

              <div>
                <p className="text-primary font-semibold text-xs sm:text-sm mb-3 tracking-wider">
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
                className="text-primary font-semibold text-sm sm:text-base hover:text-secondary transition self-start sm:self-auto"
              >
                {t.seeAll} →
              </Link>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {daftarLapangan.map((lapangan) => (
                <CardLapangan
                  key={lapangan.id}
                  {...lapangan}
                />
              ))}
            </div>

          </div>
        </section>

        {/* AJAKAN PEMESANAN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 md:py-20">

          <div className="liquid-cta relative overflow-hidden rounded-3xl sm:rounded-[32px] p-7 sm:p-10 md:p-16 text-center">

            <div className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 bg-lime/20 rounded-full blur-3xl" />

            <div className="absolute -bottom-20 -left-20 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative">
              <span className="text-green-100 text-xs sm:text-sm font-semibold tracking-wider">
                SPORTIFY
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-4">
                {t.ctaTitle}
              </h2>

              <p className="text-green-100 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                {t.ctaDescription}
              </p>

              <Link
                href="/lapangan"
                className="inline-block mt-8 sm:mt-9 bg-white/95 text-primary px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base shadow-lg hover:bg-soft-mint hover:-translate-y-1 transition-all duration-300"
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