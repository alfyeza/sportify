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
  const [role, setRole] = useState("penyewa");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE REGISTER
  // =====================================================

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // VALIDASI KOLOM WAJIB
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

    // VALIDASI NAMA LENGKAP
    if (fullName.trim().length < 3 || fullName.trim().length > 100) {
      setError(
        isEnglish
          ? "Name must contain 3–100 characters."
          : "Nama harus terdiri dari 3–100 karakter."
      );
      return;
    }

    // VALIDASI EMAIL
    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
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
    const phoneDigits = cleanPhone.replace(/\D/g, "");

    if (
      !phonePattern.test(phone) ||
      phoneDigits.length < 10 ||
      phoneDigits.length > 15
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

    // VALIDASI ROLE
    if (!["penyewa", "mitra"].includes(role)) {
      setError(
        isEnglish
          ? "Please select a valid account type."
          : "Pilih jenis akun yang valid."
      );
      return;
    }

    try {
      setLoading(true);

      // REQUEST REGISTRASI KE BACKEND
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: normalizedEmail,
          phone: cleanPhone,
          password,
          role,
        }),
      });

      // PASTIKAN REGISTRASI BERHASIL
      if (!data || data.success !== true) {
        throw new Error(
          data?.message ||
          (isEnglish
            ? "Registration failed."
            : "Registrasi gagal.")
        );
      }

      // AMBIL TOKEN DARI RESPONSE BACKEND
      const token =
        data?.token ||
        data?.accessToken ||
        data?.access_token ||
        data?.data?.token ||
        data?.data?.accessToken ||
        null;

      // AMBIL DATA USER DARI RESPONSE BACKEND
      const user =
        data?.user ||
        data?.data?.user ||
        null;

      // DATA USER WAJIB ADA, TOKEN BOLEH NULL
      if (!user || !user.id || !user.email || !user.role) {
        throw new Error(
          isEnglish
            ? "User data from server is incomplete."
            : "Data pengguna dari server tidak lengkap."
        );
      }

      // VALIDASI ROLE DARI BACKEND
      const registeredRole = String(user.role).toLowerCase();

      if (registeredRole !== role) {
        throw new Error(
          isEnglish
            ? "Account role does not match registration."
            : "Jenis akun tidak sesuai dengan pilihan registrasi."
        );
      }

      // BENTUK DATA USER
      const userWithRole = {
        ...user,
        role: registeredRole,
      };

      // JIKA TOKEN TERSEDIA, SIMPAN SESI DI FRONTEND
      if (typeof token === "string" && token.length > 0) {
        localStorage.setItem("token", token);

        localStorage.setItem(
          "sportify_user",
          JSON.stringify(userWithRole)
        );

        localStorage.setItem(
          "sportify_role",
          registeredRole
        );

        // NOTIFIKASI PERUBAHAN STATUS AUTENTIKASI
        window.dispatchEvent(
          new Event("sportify-auth-change")
        );

        // REDIRECT BERDASARKAN ROLE
        if (registeredRole === "mitra") {
          router.replace("/mitra/dashboard");
        } else {
          router.replace("/profile");
        }

        router.refresh();
        return;
      }

      // REGISTRASI BERHASIL, TETAPI SESSION/TOKEN BELUM TERSEDIA
      // JANGAN ANGGAP PENGGUNA SUDAH LOGIN
      setSuccess(
        isEnglish
          ? "Registration successful. Please check your email for confirmation if required, then log in."
          : "Registrasi berhasil. Silakan periksa email untuk konfirmasi jika diminta, kemudian masuk ke akun Anda."
      );

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

  // =====================================================
  // REGISTER PAGE
  // =====================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
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

              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] mt-4">
                {isEnglish ? "Create a New Account" : "Buat Akun Baru"}
              </h1>

              <p className="text-[var(--text-secondary)] mt-2 text-xs sm:text-sm leading-relaxed">
                {isEnglish
                  ? "Register now and start using Sportify."
                  : "Daftar sekarang dan mulai gunakan Sportify."}
              </p>
            </div>
          </div>

          {/* FORM REGISTER */}
          <form
            onSubmit={handleRegister}
            className="space-y-4 sm:space-y-5"
          >

            {/* JENIS AKUN */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[var(--text-main)] mb-2">
                {isEnglish ? "Account Type" : "Jenis Akun"}
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* PENYEWA */}
                <button
                  type="button"
                  onClick={() => {
                    setRole("penyewa");
                    setError("");
                  }}
                  disabled={loading}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${role === "penyewa"
                      ? "border-primary bg-soft-mint text-primary"
                      : "border-[var(--border-main)] text-[var(--text-secondary)] hover:border-primary"
                    }`}
                >
                  {isEnglish ? "Tenant" : "Penyewa"}

                  {role === "penyewa" && (
                    <span className="block text-xs mt-1">
                      {isEnglish ? "Selected" : "Dipilih"}
                    </span>
                  )}
                </button>

                {/* MITRA */}
                <button
                  type="button"
                  onClick={() => {
                    setRole("mitra");
                    setError("");
                  }}
                  disabled={loading}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${role === "mitra"
                      ? "border-primary bg-soft-mint text-primary"
                      : "border-[var(--border-main)] text-[var(--text-secondary)] hover:border-primary"
                    }`}
                >
                  {isEnglish ? "Partner" : "Mitra"}

                  {role === "mitra" && (
                    <span className="block text-xs mt-1">
                      {isEnglish ? "Selected" : "Dipilih"}
                    </span>
                  )}
                </button>

              </div>

              <p className="text-xs text-[var(--text-secondary)] mt-2">
                {role === "penyewa"
                  ? isEnglish
                    ? "For users who want to book sports venues."
                    : "Untuk pengguna yang ingin memesan lapangan olahraga."
                  : isEnglish
                    ? "For sports venue owners who want to manage their business."
                    : "Untuk pemilik lapangan yang ingin mengelola usahanya."}
              </p>
            </div>

            {/* NAMA LENGKAP */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[var(--text-main)] mb-2">
                {isEnglish ? "Full Name" : "Nama Lengkap"}
              </label>

              <input
                type="text"
                placeholder={
                  isEnglish
                    ? "Enter your full name"
                    : "Masukkan nama lengkap"
                }
                className="liquid-auth-input w-full text-sm"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError("");
                }}
                autoComplete="name"
                maxLength={100}
                disabled={loading}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[var(--text-main)] mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder={
                  isEnglish
                    ? "Enter your email"
                    : "Masukkan email"
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
              <label className="block text-xs sm:text-sm font-semibold text-[var(--text-main)] mb-2">
                {isEnglish ? "Phone Number" : "Nomor HP"}
              </label>

              <input
                type="tel"
                placeholder={
                  isEnglish
                    ? "Enter your phone number"
                    : "Masukkan nomor HP"
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
              <label className="block text-xs sm:text-sm font-semibold text-[var(--text-main)] mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isEnglish
                      ? "Create a password"
                      : "Buat password"
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
              <label className="block text-xs sm:text-sm font-semibold text-[var(--text-main)] mb-2">
                {isEnglish ? "Confirm Password" : "Konfirmasi Password"}
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={
                    isEnglish
                      ? "Re-enter your password"
                      : "Ulangi password"
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
              <div
                role="alert"
                className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </div>
            )}

            {/* PESAN SUKSES */}
            {success && (
              <div
                role="status"
                className="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 px-4 py-3 text-sm text-green-700 dark:text-green-400"
              >
                {success}

                <Link
                  href="/login"
                  className="block mt-2 font-bold underline"
                >
                  {isEnglish ? "Go to Login" : "Masuk ke Akun"}
                </Link>
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

              {!loading && <span>&gt;</span>}
            </button>
          </form>

          {/* LINK LOGIN */}
          <div className="text-center text-xs sm:text-sm text-[var(--text-secondary)] mt-6 sm:mt-7">
            {isEnglish
              ? "Already have an account?"
              : "Sudah punya akun?"}{" "}

            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              {isEnglish ? "Login" : "Masuk"}
            </Link>
          </div>

          {/* KEMBALI KE BERANDA */}
          <div className="text-center mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-[var(--border-main)]">
            <Link
              href="/"
              className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-primary transition"
            >
              &lt; {isEnglish ? "Back to Home" : "Kembali ke Beranda"}
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}