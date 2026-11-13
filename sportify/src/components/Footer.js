"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/translations";

export default function Footer() {
  const { language } = useLanguage();

  const isEnglish = language === "en";
  const t = translations[language]?.footer || translations.id.footer;

  return (
    <footer className="bg-primary dark:bg-[#101A15] text-white mt-12 sm:mt-16 transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-6">

        {/* FOOTER CONTENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 lg:gap-10">

          {/* KOLOM 1 - BRAND */}
          <div className="sm:col-span-2 lg:col-span-1">

            <Link
              href="/"
              className="inline-block text-2xl sm:text-3xl font-bold tracking-tight hover:text-green-100 dark:hover:text-[#B7E34A] transition"
            >
              Sportify
            </Link>

            <p className="mt-4 text-sm text-green-50 dark:text-[#B2C1B7] leading-relaxed max-w-sm">
              {t.description}
            </p>

            <p className="mt-4 text-xs text-green-100 dark:text-[#91A398] font-medium">
              {isEnglish
                ? "Find your game. Book your court."
                : "Temukan olahraga favoritmu. Pesan lapangan dengan mudah."}
            </p>

            {/* SOCIAL MEDIA */}
            <div className="flex items-center gap-3 mt-5">

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center text-sm font-bold hover:bg-white hover:text-primary dark:hover:bg-[#7DDBA8] dark:hover:text-[#101A15] transition"
              >
                IG
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center text-sm font-bold hover:bg-white hover:text-primary dark:hover:bg-[#7DDBA8] dark:hover:text-[#101A15] transition"
              >
                f
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center text-sm font-bold hover:bg-white hover:text-primary dark:hover:bg-[#7DDBA8] dark:hover:text-[#101A15] transition"
              >
                TT
              </a>

            </div>

          </div>

          {/* KOLOM 2 - EXPLORE */}
          <div>

            <h3 className="font-bold text-base mb-5 text-white dark:text-[#EDF5EF]">
              {isEnglish ? "Explore" : "Jelajahi"}
            </h3>

            <div className="flex flex-col gap-3 text-sm text-green-100 dark:text-[#B2C1B7]">

              <Link
                href="/"
                className="hover:text-white dark:hover:text-[#7DDBA8] hover:translate-x-1 transition w-fit"
              >
                {t.home}
              </Link>

              <Link
                href="/lapangan"
                className="hover:text-white dark:hover:text-[#7DDBA8] hover:translate-x-1 transition w-fit"
              >
                {t.lapangan}
              </Link>

              <Link
                href="/artikel"
                className="hover:text-white dark:hover:text-[#7DDBA8] hover:translate-x-1 transition w-fit"
              >
                {isEnglish ? "News & Articles" : "Berita & Artikel"}
              </Link>

              <Link
                href="/tentang"
                className="hover:text-white dark:hover:text-[#7DDBA8] hover:translate-x-1 transition w-fit"
              >
                {t.tentang}
              </Link>

            </div>

          </div>

          {/* KOLOM 3 - BANTUAN */}
          <div>

            <h3 className="font-bold text-base mb-5 text-white dark:text-[#EDF5EF]">
              {isEnglish ? "Help & Support" : "Bantuan"}
            </h3>

            <div className="flex flex-col gap-3 text-sm text-green-100 dark:text-[#B2C1B7]">

              <Link
                href="/bantuan"
                className="hover:text-white dark:hover:text-[#7DDBA8] hover:translate-x-1 transition w-fit"
              >
                {isEnglish ? "Help Center" : "Pusat Bantuan"}
              </Link>

              <Link
                href="/bantuan"
                className="hover:text-white dark:hover:text-[#7DDBA8] hover:translate-x-1 transition w-fit"
              >
                FAQ
              </Link>

              <Link
                href="/contact"
                className="hover:text-white dark:hover:text-[#7DDBA8] hover:translate-x-1 transition w-fit"
              >
                Contact Us
              </Link>

            </div>

          </div>

          {/* KOLOM 4 - INFORMASI */}
          <div>

            <h3 className="font-bold text-base mb-5 text-white dark:text-[#EDF5EF]">
              {isEnglish ? "Information" : "Informasi"}
            </h3>

            <div className="flex flex-col gap-3 text-sm text-green-100 dark:text-[#B2C1B7]">

              <Link
                href="/kebijakan-privasi"
                className="hover:text-white dark:hover:text-[#7DDBA8] hover:translate-x-1 transition w-fit"
              >
                {isEnglish ? "Privacy Policy" : "Kebijakan Privasi"}
              </Link>

              <Link
                href="/syarat-ketentuan"
                className="hover:text-white dark:hover:text-[#7DDBA8] hover:translate-x-1 transition w-fit"
              >
                {isEnglish ? "Terms & Conditions" : "Syarat & Ketentuan"}
              </Link>

            </div>

          </div>

        </div>

        {/* GARIS PEMISAH */}
        <div className="border-t border-white/20 dark:border-white/10 mt-10 pt-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">

            <p className="text-xs sm:text-sm text-green-100 dark:text-[#91A398]">
              © 2026 Sportify. {t.copyright}
            </p>

            <p className="text-xs text-green-100 dark:text-[#91A398]">
              {isEnglish
                ? "Made for every sports enthusiast."
                : "Dibuat untuk semua pecinta olahraga."}
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}