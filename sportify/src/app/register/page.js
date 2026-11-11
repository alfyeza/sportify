"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // VALIDASI INPUT
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError(
        isEnglish
          ? "All fields are required."
          : "Semua kolom wajib diisi."
      );
      return;
    }

    // VALIDASI EMAIL
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError(
        isEnglish
          ? "Please enter a valid email address."
          : "Masukkan alamat email yang valid."
      );
      return;
    }

    // VALIDASI NOMOR HP
    const phonePattern = /^\+?[0-9\s-]+$/;
    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (
      !phonePattern.test(phone) ||
      cleanPhone.replace(/\D/g, "").length < 10 ||
      cleanPhone.replace(/\D/g, "").length > 15
    ) {
      setError(
        isEnglish
          ? "Please enter a valid phone number."
          : "Masukkan nomor HP yang valid (10–15 angka)."
      );
      return;
    }

    // VALIDASI PASSWORD
    if (password.length < 6) {
      setError(
        isEnglish
          ? "Password must contain at least 6 characters."
          : "Password minimal harus 6 karakter."
      );
      return;
    }

    // VALIDASI KONFIRMASI PASSWORD
    if (password !== confirmPassword) {
      setError(
        isEnglish
          ? "Passwords do not match."
          : "Konfirmasi password tidak cocok."
      );
      return;
    }

    // KIRIM DATA KE BACKEND
    try {
      setLoading(true);

      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password,
        }),
      });

      const token =
        data?.token ||
        data?.accessToken ||
        data?.access_token;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (data?.user) {
        localStorage.setItem("sportify_user", JSON.stringify(data.user));
      }

      window.dispatchEvent(new Event("sportify-auth-change"));

      // JIKA PENDAFTARAN BERHASIL
      router.push("/profile");

    } catch (err) {
      setError(
        err.message ||
          (isEnglish
            ? "Registration failed. Please try again."
            : "Pendaftaran gagal. Silakan coba lagi.")
      );
    } finally {
      setLoading(false);
    }
  };

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
          <form
            onSubmit={handleRegister}
            className="space-y-4 sm:space-y-5"
          >

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
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError("");
                }}
                autoComplete="name"
                disabled={loading}
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoComplete="email"
                disabled={loading}
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
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                autoComplete="tel"
                disabled={loading}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isEnglish ? "Create a password" : "Buat password"
                  }
                  className="liquid-auth-input w-full text-sm pr-16"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary"
                  disabled={loading}
                >
                  {showPassword
                    ? isEnglish
                      ? "Hide"
                      : "Sembunyi"
                    : isEnglish
                      ? "Show"
                      : "Lihat"}
                </button>
              </div>
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                {isEnglish ? "Confirm Password" : "Konfirmasi Password"}
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={
                    isEnglish ? "Re-enter your password" : "Ulangi password"
                  }
                  className="liquid-auth-input w-full text-sm pr-16"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary"
                  disabled={loading}
                >
                  {showConfirmPassword
                    ? isEnglish
                      ? "Hide"
                      : "Sembunyi"
                    : isEnglish
                      ? "Show"
                      : "Lihat"}
                </button>
              </div>
            </div>

            {/* PESAN ERROR */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* TOMBOL DAFTAR */}
            <button
              type="submit"
              disabled={loading}
              className="liquid-booking-button w-full mt-3 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? isEnglish
                  ? "Registering..."
                  : "Sedang mendaftar..."
                : isEnglish
                  ? "Register Now"
                  : "Daftar Sekarang"}

              {!loading && <span>→</span>}
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