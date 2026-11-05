"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

export default function RegisterPage() {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="liquid-auth-card w-full max-w-md mx-auto p-5 sm:p-7 lg:p-8">

          {/* HEADER REGISTER */}
          <div className="text-center mb-7 sm:mb-8">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold text-primary"
            >
              Sportify
            </Link>

            <div className="mt-5 sm:mt-6">
              <span className="inline-block px-4 py-2 rounded-full bg-soft-mint text-primary text-[10px] sm:text-xs font-bold tracking-wider">
                {isEnglish ? "JOIN SPORTIFY" : "GABUNG SPORTIFY"}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-dark-text mt-4">
                {isEnglish ? "Create a New Account" : "Buat Akun Baru"}
              </h1>

              <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-relaxed">
                {isEnglish
                  ? "Register now and start booking your favorite sports venue."
                  : "Daftar sekarang dan mulai pesan lapangan favoritmu."}
              </p>
            </div>
          </div>

          {/* FORM REGISTER */}
          <form className="space-y-4 sm:space-y-5">

            {/* NAMA LENGKAP */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                {isEnglish ? "Full Name" : "Nama Lengkap"}
              </label>

              <input
                type="text"
                placeholder={
                  isEnglish ? "Enter your full name" : "Masukkan nama lengkap"
                }
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder={
                  isEnglish ? "Enter your email" : "Masukkan email"
                }
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* NOMOR HP */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                {isEnglish ? "Phone Number" : "Nomor HP"}
              </label>

              <input
                type="tel"
                placeholder={
                  isEnglish ? "Enter your phone number" : "Masukkan nomor HP"
                }
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder={
                  isEnglish ? "Create a password" : "Buat password"
                }
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                {isEnglish ? "Confirm Password" : "Konfirmasi Password"}
              </label>

              <input
                type="password"
                placeholder={
                  isEnglish ? "Re-enter your password" : "Ulangi password"
                }
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* TOMBOL DAFTAR */}
            <button
              type="button"
              className="liquid-booking-button w-full mt-3 text-sm sm:text-base"
            >
              {isEnglish ? "Register Now" : "Daftar Sekarang"} <span>→</span>
            </button>

          </form>

          {/* LINK LOGIN */}
          <div className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-7">
            {isEnglish ? "Already have an account?" : "Sudah punya akun?"}{" "}

            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              {isEnglish ? "Login" : "Masuk"}
            </Link>
          </div>

          {/* KEMBALI KE BERANDA */}
          <div className="text-center mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-gray-100">
            <Link
              href="/"
              className="text-xs sm:text-sm text-gray-500 hover:text-primary transition"
            >
              ← {isEnglish ? "Back to Home" : "Kembali ke Beranda"}
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
