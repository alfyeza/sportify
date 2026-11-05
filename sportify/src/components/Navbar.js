
"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function Navbar() {
  const { language, changeLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const text = {
    id: {
      home: "Home",
      lapangan: "Lapangan",
      tentang: "Tentang Kami",
      login: "Login",
      daftar: "Daftar",
      cari: "Cari Lapangan",
    },
    en: {
      home: "Home",
      lapangan: "Courts",
      tentang: "About Us",
      login: "Login",
      daftar: "Register",
      cari: "Find a Court",
    },
  };

  const t = text[language] || text.id;

  const closeMenu = () => setMenuOpen(false);

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
    closeMenu();
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
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm xl:text-base">
            <Link href="/" className="liquid-nav-link">
              {t.home}
            </Link>

            <Link href="/lapangan" className="liquid-nav-link">
              {t.lapangan}
            </Link>

            <Link href="/tentang" className="liquid-nav-link">
              {t.tentang}
            </Link>
          </div>

          {/* Aksi Desktop */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
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
                className="liquid-nav-link py-1"
              >
                {t.home}
              </Link>

              <Link
                href="/lapangan"
                onClick={closeMenu}
                className="liquid-nav-link py-1"
              >
                {t.lapangan}
              </Link>

              <Link
                href="/tentang"
                onClick={closeMenu}
                className="liquid-nav-link py-1"
              >
                {t.tentang}
              </Link>

              <div className="border-t border-gray-200/70 pt-4 flex flex-col gap-4">

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
