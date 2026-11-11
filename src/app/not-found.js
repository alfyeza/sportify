"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

export default function NotFound() {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">

          {/* ICON & 404 */}
          <div className="relative mb-6">
            <span className="text-7xl sm:text-8xl select-none">🏟️</span>
            <div className="inline-block mt-4 px-4 py-1.5 rounded-full bg-soft-mint text-primary text-xs font-bold tracking-widest uppercase">
              Error 404
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-dark-text">
            {isEnglish ? "Court Not Found!" : "Lapangan Tidak Ditemukan!"}
          </h1>

          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed">
            {isEnglish
              ? "Oops, looks like you stepped out of bounds. The page or venue you are looking for does not exist or has been moved."
              : "Waduh, sepertinya kamu keluar dari garis lapangan. Halaman yang kamu tuju tidak ditemukan atau sudah dipindahkan."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="liquid-primary-button justify-center text-sm"
            >
              ← {isEnglish ? "Back to Home" : "Kembali ke Beranda"}
            </Link>

            <Link
              href="/lapangan"
              className="liquid-outline-button justify-center text-sm"
            >
              {isEnglish ? "Find Other Courts" : "Cari Lapangan Lain"}
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

