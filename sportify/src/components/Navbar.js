import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            PlayCourt
          </Link>

          {/* Menu Navigasi */}
          <div className="flex flex-wrap items-center gap-5 text-sm md:text-base text-dark-text">
            <Link href="/" className="hover:text-primary transition">
              Home
            </Link>

            <Link href="/lapangan" className="hover:text-primary transition">
              Lapangan
            </Link>

            <Link href="/tentang" className="hover:text-primary transition">
              Tentang Kami
            </Link>
          </div>

          {/* Tombol Cari Lapangan */}
          <Link
            href="/lapangan"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-secondary transition text-sm font-semibold"
          >
            Cari Lapangan
          </Link>

        </div>
      </div>
    </nav>
  );
}