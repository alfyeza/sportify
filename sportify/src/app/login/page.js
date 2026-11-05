
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
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
                WELCOME BACK
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-dark-text mt-4">
                Selamat Datang!
              </h1>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Login untuk mulai memesan lapangan olahraga.
              </p>
            </div>
          </div>

          {/* FORM LOGIN */}
          <form className="space-y-4 sm:space-y-5">

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Masukkan email"
                className="liquid-auth-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Masukkan password"
                className="liquid-auth-input"
                required
              />
            </div>

            <button
              type="button"
              className="liquid-booking-button w-full mt-3"
            >
              Login <span>→</span>
            </button>

          </form>

          {/* LINK REGISTER */}
          <div className="text-center text-sm text-gray-500 mt-6 sm:mt-7 leading-relaxed">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>

          {/* KEMBALI KE BERANDA */}
          <div className="text-center mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-gray-100">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-primary transition"
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
