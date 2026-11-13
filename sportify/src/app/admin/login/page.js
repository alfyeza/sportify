"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Jika sudah login, langsung alihkan ke dashboard admin
  useEffect(() => {
    const checkCurrentSession = async () => {
      try {
        const token = localStorage.getItem("sportify_admin_token");
        const res = await fetch("/api/admin/me", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          router.replace("/admin");
          return;
        }
      } catch {
        // Abaikan
      } finally {
        setCheckingAuth(false);
      }
    };

    checkCurrentSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login admin gagal. Periksa username dan password.");
      }

      if (data.token) {
        localStorage.setItem("sportify_admin_token", data.token);
      }
      if (data.admin) {
        localStorage.setItem("sportify_admin_user", JSON.stringify(data.admin));
      }

      router.replace("/admin");
    } catch (err) {
      setError(err.message || "Gagal masuk ke sistem admin.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  if (checkingAuth) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[var(--text-secondary)]">Memeriksa sesi admin...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="liquid-auth-card w-full max-w-md relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-lime-500/10 blur-2xl pointer-events-none" />

          {/* HEADER LOGIN ADMIN */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 text-primary dark:text-emerald-400 text-xs font-bold tracking-wider mb-4">
              <span>🛡️</span>
              <span>PORTAL ADMINISTRATOR</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
              Admin Sportify
            </h1>

            <p className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed">
              Masuk untuk mengelola data lapangan, jadwal venue, dan informasi publik Sportify.
            </p>
          </div>

          {/* ALERT ERROR */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-fade-in">
              <span className="text-lg">⚠️</span>
              <p className="flex-1 font-medium">{error}</p>
            </div>
          )}

          {/* FORM LOGIN */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* USERNAME */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                Username Admin
              </label>
              <input
                type="text"
                placeholder="Contoh: admin"
                className="liquid-auth-input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                autoComplete="username"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                Kata Sandi
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password admin"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:text-secondary transition"
                  disabled={loading}
                >
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </div>

            {/* DEMO CREDENTIAL QUICK FILL */}
            <div className="p-3.5 rounded-2xl bg-soft-mint dark:bg-white/5 border border-primary/20 text-xs flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-primary dark:text-emerald-400">Akun Default Sistem:</p>
                <p className="text-[var(--text-secondary)]">User: <code className="font-mono font-bold text-[var(--text-main)]">admin</code> | Pass: <code className="font-mono font-bold text-[var(--text-main)]">admin123</code></p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="px-3 py-1.5 rounded-xl bg-primary text-white font-semibold hover:bg-secondary transition shrink-0"
              >
                Isi Otomatis
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="liquid-primary-button w-full justify-center text-center py-3.5 font-bold shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memverifikasi...
                </span>
              ) : (
                "Masuk ke Dashboard Admin →"
              )}
            </button>
          </form>

          {/* BACK TO HOME */}
          <div className="text-center mt-6 pt-5 border-t border-[var(--border-soft)]">
            <Link
              href="/"
              className="text-xs font-semibold text-[var(--text-secondary)] hover:text-primary transition"
            >
              ← Kembali ke Beranda Sportify
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

