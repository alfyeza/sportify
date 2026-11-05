
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="liquid-auth-card w-full max-w-md mx-auto p-5 sm:p-7 lg:p-8">

          {/* Header Register */}
          <div className="text-center mb-7 sm:mb-8">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold text-primary"
            >
              Sportify
            </Link>

            <div className="mt-5 sm:mt-6">
              <span className="inline-block px-4 py-2 rounded-full bg-soft-mint text-primary text-[10px] sm:text-xs font-bold tracking-wider">
                JOIN SPORTIFY
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-dark-text mt-4">
                Buat Akun Baru
              </h1>

              <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-relaxed">
                Daftar sekarang dan mulai pesan lapangan favoritmu.
              </p>
            </div>
          </div>

          {/* Form Register */}
          <form className="space-y-4 sm:space-y-5">

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                Nama Lengkap
              </label>

              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Masukkan email"
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* Nomor HP */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                Nomor HP
              </label>

              <input
                type="tel"
                placeholder="Masukkan nomor HP"
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Buat password"
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-dark-text mb-2">
                Konfirmasi Password
              </label>

              <input
                type="password"
                placeholder="Ulangi password"
                className="liquid-auth-input w-full text-sm"
                required
              />
            </div>

            {/* Tombol Daftar */}
            <button
              type="button"
              className="liquid-booking-button w-full mt-3 text-sm sm:text-base"
            >
              Daftar Sekarang <span>→</span>
            </button>

          </form>

          {/* Link Login */}
          <div className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-7">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Login
            </Link>
          </div>

          {/* Kembali ke Beranda */}
          <div className="text-center mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-gray-100">
            <Link
              href="/"
              className="text-xs sm:text-sm text-gray-500 hover:text-primary transition"
            >
              ← Kembali ke Beranda
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
