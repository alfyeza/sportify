"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        isEnglish
          ? "Email and password are required."
          : "Email dan password wajib diisi."
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError(
        isEnglish
          ? "Please enter a valid email address."
          : "Masukkan alamat email yang valid."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        isEnglish
          ? "Password must contain at least 6 characters."
          : "Password minimal harus 6 karakter."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      // Simpan token jika diberikan oleh backend
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

      // Arahkan pengguna setelah login berhasil
      router.push("/profile");
    } catch (err) {
      setError(
        err.message ||
          (isEnglish
            ? "Login failed. Please try again."
            : "Login gagal. Silakan coba lagi.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="liquid-auth-card w-full max-w-md">

          {/* HEADER LOGIN */}
          <div className="text-center mb-7 sm:mb-8">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold text-primary"
            >
              Sportify
            </Link>

            <div className="mt-5 sm:mt-6">
              <span className="inline-block px-4 py-2 rounded-full bg-soft-mint text-primary text-xs font-bold tracking-wider">
                {isEnglish ? "WELCOME BACK" : "SELAMAT DATANG KEMBALI"}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-dark-text mt-4">
                {isEnglish ? "Welcome Back!" : "Selamat Datang!"}
              </h1>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                {isEnglish
                  ? "Login to start booking sports venues."
                  : "Login untuk mulai memesan lapangan olahraga."}
              </p>
            </div>
          </div>

          {/* FORM LOGIN */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder={
                  isEnglish ? "Enter your email" : "Masukkan email"
                }
                className="liquid-auth-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">
                {isEnglish ? "Password" : "Kata Sandi"}
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isEnglish ? "Enter your password" : "Masukkan password"
                  }
                  className="liquid-auth-input pr-16"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary"
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

            {/* PESAN ERROR */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* BUTTON LOGIN */}
            <button
              type="submit"
              disabled={loading}
              className="liquid-booking-button w-full mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? isEnglish
                  ? "Logging in..."
                  : "Sedang masuk..."
                : isEnglish
                  ? "Login"
                  : "Masuk"}

              {!loading && <span>→</span>}
            </button>

          </form>

          {/* LINK REGISTER */}
          <div className="text-center text-sm text-gray-500 mt-6 sm:mt-7 leading-relaxed">
            {isEnglish
              ? "Don't have an account?"
              : "Belum punya akun?"}{" "}

            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              {isEnglish ? "Register now" : "Daftar sekarang"}
            </Link>
          </div>

          {/* KEMBALI KE BERANDA */}
          <div className="text-center mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-gray-100">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-primary transition"
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