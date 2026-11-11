"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function Navbar() {
  const { language, changeLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const text = {
    id: {
      home: "Home",
      lapangan: "Lapangan",
      tentang: "Tentang Kami",
      riwayat: "Riwayat",
      profil: "Profil",
      login: "Login",
      daftar: "Daftar",
      logout: "Keluar",
      cari: "Cari Lapangan",
    },
    en: {
      home: "Home",
      lapangan: "Courts",
      tentang: "About Us",
      riwayat: "History",
      profil: "Profile",
      login: "Login",
      daftar: "Register",
      logout: "Logout",
      cari: "Find a Court",
    },
  };

  const t = text[language] || text.id;

  // Cek status autentikasi pengguna
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("sportify_user");

      if (token) {
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser({ fullName: "Member" });
          }
        } else {
          setUser({ fullName: "Member" });
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("sportify-auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("sportify-auth-change", checkAuth);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
    closeMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sportify_user");
    setUser(null);
    closeMenu();
    window.dispatchEvent(new Event("sportify-auth-change"));
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="max-w-7xl mx-auto">

        {/* Navbar Utama */}
        <div className="liquid-navbar flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-5 lg:px-6 py-3 sm:py-4">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="text-xl sm:text-2xl font-bold text-primary tracking-tight shrink-0"
          >
            Sportify
          </Link>

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm xl:text-base">
            <Link
              href="/"
              className={`liquid-nav-link transition-colors ${
                isActive("/")
                  ? "text-primary font-bold bg-soft-mint px-3.5 py-1.5 rounded-full"
                  : ""
              }`}
            >
              {t.home}
            </Link>

            <Link
              href="/lapangan"
              className={`liquid-nav-link transition-colors ${
                isActive("/lapangan")
                  ? "text-primary font-bold bg-soft-mint px-3.5 py-1.5 rounded-full"
                  : ""
              }`}
            >
              {t.lapangan}
            </Link>

            <Link
              href="/tentang"
              className={`liquid-nav-link transition-colors ${
                isActive("/tentang")
                  ? "text-primary font-bold bg-soft-mint px-3.5 py-1.5 rounded-full"
                  : ""
              }`}
            >
              {t.tentang}
            </Link>

            {user && (
              <Link
                href="/riwayat"
                className={`liquid-nav-link transition-colors ${
                  isActive("/riwayat")
                    ? "text-primary font-bold bg-soft-mint px-3.5 py-1.5 rounded-full"
                    : ""
                }`}
              >
                {t.riwayat}
              </Link>
            )}
          </div>

          {/* Aksi Desktop */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft-mint text-primary text-sm font-semibold hover:bg-green-100 transition"
                >
                  <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                  </span>
                  <span className="max-w-[120px] truncate">
                    {user.fullName || t.profil}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 text-sm font-medium px-2 py-1 transition"
                  title={t.logout}
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-dark-text font-semibold text-sm hover:text-primary transition"
                >
                  {t.login}
                </Link>

                <Link
                  href="/register"
                  className="liquid-outline-button text-sm"
                >
                  {t.daftar}
                </Link>
              </>
            )}

            <Link
              href="/lapangan"
              className="liquid-primary-button text-sm"
            >
              {t.cari}
            </Link>

            <select
              value={language}
              onChange={handleLanguageChange}
              className="liquid-language"
              aria-label="Pilih bahasa"
            >
              <option value="id">ID</option>
              <option value="en">EN</option>
            </select>
          </div>

          {/* Aksi Mobile dan Tablet */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="liquid-language"
              aria-label="Pilih bahasa"
            >
              <option value="id">ID</option>
              <option value="en">EN</option>
            </select>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/70 border border-white/80 text-primary text-xl sm:text-2xl transition hover:bg-white"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {/* Dropdown Mobile dan Tablet */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="liquid-mobile-menu lg:hidden mt-2 p-4 sm:p-5"
          >
            <div className="flex flex-col gap-4">

              <Link
                href="/"
                onClick={closeMenu}
                className={`liquid-nav-link py-2 px-3 rounded-xl ${
                  isActive("/") ? "bg-soft-mint text-primary font-bold" : ""
                }`}
              >
                {t.home}
              </Link>

              <Link
                href="/lapangan"
                onClick={closeMenu}
                className={`liquid-nav-link py-2 px-3 rounded-xl ${
                  isActive("/lapangan")
                    ? "bg-soft-mint text-primary font-bold"
                    : ""
                }`}
              >
                {t.lapangan}
              </Link>

              <Link
                href="/tentang"
                onClick={closeMenu}
                className={`liquid-nav-link py-2 px-3 rounded-xl ${
                  isActive("/tentang")
                    ? "bg-soft-mint text-primary font-bold"
                    : ""
                }`}
              >
                {t.tentang}
              </Link>

              {user && (
                <>
                  <Link
                    href="/riwayat"
                    onClick={closeMenu}
                    className={`liquid-nav-link py-2 px-3 rounded-xl ${
                      isActive("/riwayat")
                        ? "bg-soft-mint text-primary font-bold"
                        : ""
                    }`}
                  >
                    {t.riwayat}
                  </Link>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className={`liquid-nav-link py-2 px-3 rounded-xl ${
                      isActive("/profile")
                        ? "bg-soft-mint text-primary font-bold"
                        : ""
                    }`}
                  >
                    {t.profil} ({user.fullName || "User"})
                  </Link>
                </>
              )}

              <div className="border-t border-gray-200/70 pt-4 flex flex-col gap-4">
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="liquid-outline-button text-center text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {t.logout}
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="liquid-nav-link py-1"
                    >
                      {t.login}
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="liquid-outline-button text-center"
                    >
                      {t.daftar}
                    </Link>
                  </>
                )}

                <Link
                  href="/lapangan"
                  onClick={closeMenu}
                  className="liquid-primary-button justify-center"
                >
                  {t.cari}
                </Link>

              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
