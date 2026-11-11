"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const isEnglish = language === "en";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Membaca status login dari localStorage
  useEffect(() => {
    const checkLogin = () => {
      try {
        const savedUser = localStorage.getItem("sportify_user");

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkLogin();

    window.addEventListener("sportify-auth-change", checkLogin);

    return () => {
      window.removeEventListener("sportify-auth-change", checkLogin);
    };
  }, []);

  // Menutup dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigasi
  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: isEnglish ? "Courts" : "Lapangan",
      path: "/lapangan",
    },
    {
      name: isEnglish ? "About Us" : "Tentang Kami",
      path: "/tentang",
    },
  ];

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("sportify_user");
    localStorage.removeItem("token");

    setUser(null);
    setIsLoggedIn(false);
    setIsDropdownOpen(false);

    window.dispatchEvent(new Event("sportify-auth-change"));

    router.push("/");
  };

  const userName =
    user?.name ||
    user?.fullName ||
    user?.full_name ||
    user?.email?.split("@")[0] ||
    "Pengguna";

  return (
    <header className="sticky top-0 z-50 px-4 pt-3">
      <nav className="liquid-navbar max-w-7xl mx-auto">
        <div className="flex justify-between items-center min-h-[76px] px-5 sm:px-8">

          {/* LOGO */}
          <Link
            href="/"
            className="text-2xl font-bold text-primary tracking-tight"
          >
            Sportify
          </Link>

          {/* MENU TENGAH */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`liquid-nav-link ${isActive ? "active" : ""
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* MENU KANAN */}
          <div className="hidden md:flex items-center gap-3">

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-dark-text hover:text-primary transition"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="liquid-outline-button"
                >
                  {isEnglish ? "Register" : "Daftar"}
                </Link>
              </>
            ) : (
              /* DROPDOWN PROFIL */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/50 transition"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>

                  <span className="text-sm font-medium text-dark-text">
                    {userName}
                  </span>

                  <span className="text-xs text-gray-400">▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-xl py-2 z-50">

                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm text-dark-text hover:bg-soft-mint transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {isEnglish ? "My Profile" : "Profil Saya"}
                    </Link>

                    <Link
                      href="/riwayat"
                      className="block px-4 py-3 text-sm text-dark-text hover:bg-soft-mint transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {isEnglish ? "Booking History" : "Riwayat Booking"}
                    </Link>

                    <hr className="my-1 border-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CARI LAPANGAN */}
            <Link
              href="/lapangan"
              className="liquid-primary-button"
            >
              {isEnglish ? "Find a Court" : "Cari Lapangan"}
            </Link>

            {/* PILIHAN BAHASA */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="liquid-language"
              aria-label="Select language"
            >
              <option value="id">ID</option>
              <option value="en">EN</option>
            </select>

          </div>
        </div>
      </nav>
    </header>
  );
}