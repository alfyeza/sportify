
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-8 sm:py-10 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Footer Content */}
        <div className="flex flex-col items-center text-center">

          {/* Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold tracking-tight hover:text-green-100 transition"
          >
            Sportify
          </Link>

          {/* Deskripsi */}
          <p className="mt-2 text-xs sm:text-sm text-green-50 leading-relaxed">
            Pesan Lapangan Olahraga Jadi Lebih Mudah.
          </p>

          {/* Navigasi Footer */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mt-5 text-xs sm:text-sm text-green-100">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>

            <Link href="/lapangan" className="hover:text-white transition">
              Lapangan
            </Link>

            <Link href="/tentang" className="hover:text-white transition">
              Tentang Kami
            </Link>
          </div>

          {/* Copyright */}
          <div className="w-full border-t border-white/20 mt-7 pt-5">
            <p className="text-[11px] sm:text-sm text-green-100">
              © 2026 Sportify. All Rights Reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
