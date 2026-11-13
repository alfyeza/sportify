"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/translations";

export default function TentangPage() {
  const { language } = useLanguage();

  const t = translations[language]?.tentang || translations.id.tentang;

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen overflow-hidden"
        style={{ background: "var(--bg-main)" }}
      >
        {/* HERO SECTION */}
        <section className="liquid-about-hero">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 py-6 sm:py-8">

            <span className="liquid-about-label text-[10px] sm:text-xs">
              {t.heroLabel}
            </span>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 sm:mt-6 leading-tight"
              style={{ color: "var(--text-main)" }}
            >
              {t.heroTitle}

              <span className="block text-primary">
                {t.heroHighlight}
              </span>
            </h1>

            <p
              className="mt-5 sm:mt-7 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              {t.heroDescription}
            </p>

            <Link
              href="/lapangan"
              className="liquid-primary-button inline-flex mt-7 sm:mt-9 text-sm sm:text-base"
            >
              {t.explore}
              <span>&gt;</span>
            </Link>

          </div>

          <div className="liquid-about-decoration liquid-about-decoration-one" />
          <div className="liquid-about-decoration liquid-about-decoration-two" />
        </section>

        {/* MENGAPA SPORTIFY */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">

            {/* PENJELASAN */}
            <div>

              <span className="text-primary font-semibold text-xs sm:text-sm tracking-widest">
                {t.introductionLabel}
              </span>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-5 sm:mb-6 leading-tight"
                style={{ color: "var(--text-main)" }}
              >
                {t.whyTitle}
              </h2>

              <p
                className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-5"
                style={{ color: "var(--text-secondary)" }}
              >
                {t.whyDescription1}
              </p>

              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {t.whyDescription2}
              </p>

            </div>

            {/* LAYANAN */}
            <div className="liquid-about-card w-full p-5 sm:p-7 lg:p-8">

              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-7">

                <div className="liquid-about-icon shrink-0">
                  <span>✦</span>
                </div>

                <div>
                  <h3
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: "var(--text-main)" }}
                  >
                    {t.serviceTitle}
                  </h3>

                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.serviceSubtitle}
                  </p>
                </div>

              </div>

              <div className="space-y-4 sm:space-y-5">

                {t.services.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 sm:gap-4 items-start"
                  >
                    <span className="liquid-about-check shrink-0">
                      ✓
                    </span>

                    <p
                      className="text-sm sm:text-base leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item}
                    </p>
                  </div>
                ))}

              </div>

            </div>

          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 lg:pb-20">

          <div className="liquid-about-cta px-5 py-10 sm:px-8 sm:py-14 lg:py-16">

            <div className="relative z-10 max-w-3xl mx-auto text-center">

              <span className="text-green-100 text-[10px] sm:text-sm font-semibold tracking-widest">
                {t.ctaLabel}
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-4 leading-tight">
                {t.ctaTitle}
              </h2>

              <p className="mt-4 sm:mt-5 text-green-100 text-sm sm:text-base leading-relaxed">
                {t.ctaDescription}
              </p>

              <Link
                href="/lapangan"
                className="inline-flex items-center mt-7 sm:mt-8 bg-white text-primary font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-soft-mint transition duration-300 shadow-lg text-sm sm:text-base"
              >
                {t.ctaButton}
                <span className="ml-2">&gt;</span>
              </Link>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}