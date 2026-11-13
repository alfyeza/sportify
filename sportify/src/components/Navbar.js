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
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState("light");

  // TERJEMAHAN
  const text = {
    id: {
      home: "Home",
      lapangan: "Lapangan",
      artikel: "Berita & Artikel",
      tentang: "Tentang Kami",
      bantuan: "Bantuan",
      contact: "Contact Us",
      riwayat: "Riwayat",
      profil: "Profil",
      login: "Login",
      daftar: "Daftar",
      logout: "Keluar",
      cari: "Cari Lapangan",
      terang: "Mode Terang",
      gelap: "Mode Gelap",
    },

    en: {
      home: "Home",
      lapangan: "Courts",
      artikel: "News & Articles",
      tentang: "About Us",
      bantuan: "Help Center",
      contact: "Contact Us",
      riwayat: "History",
      profil: "Profile",
      login: "Login",
      daftar: "Register",
      logout: "Logout",
      cari: "Find a Court",
      terang: "Light Mode",
      gelap: "Dark Mode",
    },
  };

  const t = text[language] || text.id;

  // CEK HALAMAN AKTIF
  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // AMBIL TEMA YANG TERSIMPAN
  useEffect(() => {
    const savedTheme = localStorage.getItem("sportify-theme") || "light";

    setTheme(savedTheme);

    document.documentElement.classList.toggle(
      "dark",
      savedTheme === "dark"
    );
  }, []);

  // GANTI TEMA
  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    localStorage.setItem("sportify-theme", newTheme);

    document.documentElement.classList.toggle(
      "dark",
      newTheme === "dark"
    );
  };

  // CEK STATUS AUTENTIKASI
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("sportify_user");
      const adminToken = localStorage.getItem("sportify_admin_token");

      setIsAdmin(Boolean(adminToken));

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

  // GANTI BAHASA
  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
    closeMenu();
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sportify_user");

    setUser(null);
    closeMenu();

    window.dispatchEvent(new Event("sportify-auth-change"));

    router.push("/");
  };

  // LINK NAVBAR
  const navLinkClass = (path) =>
    `liquid-nav-link transition-colors ${isActive(path)
      ? "text-primary font-bold bg-soft-mint px-3 py-1.5 rounded-full"
      : ""
    }`;

  const mobileLinkClass = (path) =>
    `liquid-nav-link py-2 px-3 rounded-xl ${isActive(path)
      ? "bg-soft-mint text-primary font-bold"
      : ""
    }`;

  // TOMBOL TEMA
  const themeButtonClass =
    "flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 text-dark-text dark:text-white text-sm font-semibold hover:bg-soft-mint dark:hover:bg-white/10 transition-all duration-300";

  return (
    <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="max-w-7xl mx-auto">

        {/* NAVBAR UTAMA */}
        <div className="liquid-navbar flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-5 lg:px-5 py-3 sm:py-4">

          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="text-xl sm:text-2xl font-bold text-primary tracking-tight shrink-0"
          >
            Sportify
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 text-sm">

            <Link href="/" className={navLinkClass("/")}>
              {t.home}
            </Link>

            <Link
              href="/lapangan"
              className={navLinkClass("/lapangan")}
            >
              {t.lapangan}
            </Link>

            <Link
              href="/artikel"
              className={navLinkClass("/artikel")}
            >
              {t.artikel}
            </Link>

            <Link
              href="/tentang"
              className={navLinkClass("/tentang")}
            >
              {t.tentang}
            </Link>

            <Link
              href="/bantuan"
              className={navLinkClass("/bantuan")}
            >
              {t.bantuan}
            </Link>

            <Link
              href="/contact"
              className={navLinkClass("/contact")}
            >
              {t.contact}
            </Link>

            {user && (
              <Link
                href="/riwayat"
                className={navLinkClass("/riwayat")}
              >
                {t.riwayat}
              </Link>
            )}

          </div>

          {/* AKSI DESKTOP */}
          <div className="hidden lg:flex items-center gap-2">

            {user ? (
              <div className="flex items-center gap-2">

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft-mint text-primary text-sm font-semibold hover:bg-green-100 transition"
                >
                  <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs shrink-0">
                    {user.fullName
                      ? user.fullName[0].toUpperCase()
                      : "U"}
                  </span>

                  <span className="max-w-[90px] truncate">
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
                  className="text-dark-text dark:text-white font-semibold text-sm hover:text-primary transition"
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
              className="liquid-primary-button text-sm whitespace-nowrap"
            >
              {t.cari}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition shrink-0"
                title="Buka Dashboard Admin"
              >
                <span>🛡️</span>
                <span>Admin</span>
              </Link>
            )}

            {/* TOMBOL DARK / LIGHT MODE */}
            <button
              type="button"
              onClick={handleThemeChange}
              className={themeButtonClass}
              aria-label={
                theme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
              title={theme === "dark" ? t.terang : t.gelap}
            >
              <span className="text-lg">
                {theme === "dark" ? "☀" : "☾"}
              </span>
            </button>

            {/* PILIHAN BAHASA */}
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

          {/* AKSI MOBILE DAN TABLET */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">

            {/* TOMBOL DARK / LIGHT MODE */}
            <button
              type="button"
              onClick={handleThemeChange}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 text-primary dark:text-lime-300 text-xl transition hover:bg-white dark:hover:bg-white/20"
              aria-label={
                theme === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
              title={theme === "dark" ? t.terang : t.gelap}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>

            {/* PILIHAN BAHASA */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="liquid-language"
              aria-label="Pilih bahasa"
            >
              <option value="id">ID</option>
              <option value="en">EN</option>
            </select>

            {/* MENU MOBILE */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 text-primary dark:text-white text-xl sm:text-2xl transition hover:bg-white dark:hover:bg-white/20"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? "×" : "☰"}
            </button>

          </div>

        </div>

        {/* MENU MOBILE DAN TABLET */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="liquid-mobile-menu lg:hidden mt-2 p-4 sm:p-5"
          >
            <div className="flex flex-col gap-3">

              <Link
                href="/"
                onClick={closeMenu}
                className={mobileLinkClass("/")}
              >
                {t.home}
              </Link>

              <Link
                href="/lapangan"
                onClick={closeMenu}
                className={mobileLinkClass("/lapangan")}
              >
                {t.lapangan}
              </Link>

              <Link
                href="/artikel"
                onClick={closeMenu}
                className={mobileLinkClass("/artikel")}
              >
                {t.artikel}
              </Link>

              <Link
                href="/tentang"
                onClick={closeMenu}
                className={mobileLinkClass("/tentang")}
              >
                {t.tentang}
              </Link>

              <Link
                href="/bantuan"
                onClick={closeMenu}
                className={mobileLinkClass("/bantuan")}
              >
                {t.bantuan}
              </Link>

              <Link
                href="/contact"
                onClick={closeMenu}
                className={mobileLinkClass("/contact")}
              >
                {t.contact}
              </Link>

              {user && (
                <>
                  <Link
                    href="/riwayat"
                    onClick={closeMenu}
                    className={mobileLinkClass("/riwayat")}
                  >
                    {t.riwayat}
                  </Link>

                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className={mobileLinkClass("/profile")}
                  >
                    {t.profil} ({user.fullName || "User"})
                  </Link>
                </>
              )}

              {/* LOGIN DAN LOGOUT */}
              <div className="border-t border-gray-200/70 dark:border-white/10 pt-4 flex flex-col gap-3">

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
                      className="liquid-nav-link py-2 px-3"
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

                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="liquid-outline-button text-center flex items-center justify-center gap-1.5 text-xs text-primary font-bold"
                >
                  <span>🛡️</span>
                  <span>Portal Admin</span>
                </Link>

              </div>

            </div>
          </div>
        )}

      </div>
    </nav>
  );
}