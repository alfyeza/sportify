"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

export default function ProfilePage() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // MENGAMBIL DATA PROFIL
  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          isEnglish
            ? "Please login first to view your profile."
            : "Silakan login terlebih dahulu untuk melihat profil."
        );
      }

      const data = await apiRequest("/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = data?.user || data?.data?.user || data?.data || data;

      const profileData = {
        fullName: user?.fullName || user?.name || "",
        email: user?.email || "",
        phone: user?.phone || user?.phoneNumber || "",
      };

      setProfile(profileData);
      setFormData(profileData);
    } catch (err) {
      setError(
        err.message ||
          (isEnglish
            ? "Failed to load profile."
            : "Gagal mengambil data profil.")
      );
    } finally {
      setLoading(false);
    }
  };

  // JALANKAN SAAT HALAMAN DIBUKA
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        queueMicrotask(() => {
          if (!isCancelled) {
            setError(
              isEnglish
                ? "Please login first to view your profile."
                : "Silakan login terlebih dahulu untuk melihat profil."
            );
            setLoading(false);
          }
        });
        return;
      }

      try {
        const data = await apiRequest("/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isCancelled) return;
        const user = data?.user || data?.data?.user || data?.data || data;

        const profileData = {
          fullName: user?.fullName || user?.name || "",
          email: user?.email || "",
          phone: user?.phone || user?.phoneNumber || "",
        };

        setProfile(profileData);
        setFormData(profileData);
      } catch (err) {
        if (!isCancelled) {
          setError(
            err.message ||
              (isEnglish
                ? "Failed to load profile."
                : "Gagal mengambil data profil.")
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [isEnglish]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sportify_user");
    window.dispatchEvent(new Event("sportify-auth-change"));
    router.push("/login");
  };

  // MULAI EDIT PROFIL
  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
    setMessage("");
    setError("");
  };

  // SIMPAN PERUBAHAN PROFIL
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setMessage(
        isEnglish
          ? "All fields must be filled in."
          : "Semua kolom wajib diisi."
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      setMessage(
        isEnglish
          ? "Please enter a valid email."
          : "Masukkan email yang valid."
      );
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          isEnglish
            ? "Please login first."
            : "Silakan login terlebih dahulu."
        );
      }

      await apiRequest("/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        }),
      });

      setProfile({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      setIsEditing(false);

      setMessage(
        isEnglish
          ? "Profile updated successfully."
          : "Profil berhasil diperbarui."
      );
    } catch (err) {
      setMessage(
        err.message ||
          (isEnglish
            ? "Failed to update profile."
            : "Gagal memperbarui profil.")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background px-4 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-soft-mint text-primary text-xs font-bold tracking-wider">
              {isEnglish ? "MY ACCOUNT" : "AKUN SAYA"}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-dark-text mt-4">
              {isEnglish ? "My Profile" : "Profil Saya"}
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              {isEnglish
                ? "Manage your personal information."
                : "Kelola informasi pribadi akun Sportify kamu."}
            </p>
          </div>

          {/* PROFILE CARD */}
          <div className="liquid-auth-card p-5 sm:p-8">

            {/* LOADING STATE */}
            {loading ? (
              <LoadingState
                message={
                  isEnglish
                    ? "Loading profile..."
                    : "Memuat profil..."
                }
              />

            ) : error ? (

              /* ERROR STATE */
              <ErrorState
                title={
                  isEnglish
                    ? "Failed to Load Profile"
                    : "Gagal Memuat Profil"
                }
                message={error}
                buttonText={
                  isEnglish
                    ? "Try Again"
                    : "Coba Lagi"
                }
                onRetry={fetchProfile}
              />

            ) : !profile.fullName && !profile.email && !profile.phone ? (

              /* EMPTY STATE */
              <EmptyState
                title={
                  isEnglish
                    ? "Profile Not Found"
                    : "Profil Belum Tersedia"
                }
                description={
                  isEnglish
                    ? "Your profile information is not available yet."
                    : "Informasi profil kamu belum tersedia."
                }
                buttonText={
                  isEnglish
                    ? "Reload Profile"
                    : "Muat Ulang Profil"
                }
                onButtonClick={fetchProfile}
              />

            ) : (
              <>
                {/* FOTO PROFIL */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-soft-mint border-4 border-white shadow-md flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {profile.fullName
                        ? profile.fullName.charAt(0).toUpperCase()
                        : "S"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-dark-text mt-4">
                    {profile.fullName ||
                      (isEnglish ? "Sportify User" : "Pengguna Sportify")}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {profile.email ||
                      (isEnglish ? "No email added" : "Belum ada email")}
                  </p>
                </div>

                {/* PESAN */}
                {message && (
                  <div className="rounded-xl bg-soft-mint border border-green-200 px-4 py-3 text-sm text-primary mb-5">
                    {message}
                  </div>
                )}

                {/* INFORMASI PROFIL */}
                {!isEditing ? (
                  <div className="space-y-5">

                    <div>
                      <label className="block text-sm font-semibold text-dark-text mb-2">
                        {isEnglish ? "Full Name" : "Nama Lengkap"}
                      </label>

                      <div className="liquid-auth-input w-full text-sm">
                        {profile.fullName || "-"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark-text mb-2">
                        Email
                      </label>

                      <div className="liquid-auth-input w-full text-sm">
                        {profile.email || "-"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark-text mb-2">
                        {isEnglish ? "Phone Number" : "Nomor HP"}
                      </label>

                      <div className="liquid-auth-input w-full text-sm">
                        {profile.phone || "-"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleEdit}
                      className="liquid-booking-button w-full mt-4"
                    >
                      {isEnglish ? "Edit Profile" : "Edit Profil"}{" "}
                      <span>→</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full mt-3 py-3 rounded-full border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition"
                    >
                      {isEnglish ? "Log Out" : "Keluar Akun"}
                    </button>

                  </div>
                ) : (

                  /* FORM EDIT PROFIL */
                  <form onSubmit={handleSave} className="space-y-5">

                    <div>
                      <label className="block text-sm font-semibold text-dark-text mb-2">
                        {isEnglish ? "Full Name" : "Nama Lengkap"}
                      </label>

                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullName: e.target.value,
                          })
                        }
                        placeholder={
                          isEnglish
                            ? "Enter your name"
                            : "Masukkan nama"
                        }
                        className="liquid-auth-input w-full text-sm"
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark-text mb-2">
                        Email
                      </label>

                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        placeholder="Masukkan email"
                        className="liquid-auth-input w-full text-sm"
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark-text mb-2">
                        {isEnglish ? "Phone Number" : "Nomor HP"}
                      </label>

                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Masukkan nomor HP"
                        className="liquid-auth-input w-full text-sm"
                        disabled={saving}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">

                      <button
                        type="submit"
                        disabled={saving}
                        className="liquid-booking-button flex-1 disabled:opacity-60"
                      >
                        {saving
                          ? isEnglish
                            ? "Saving..."
                            : "Menyimpan..."
                          : isEnglish
                            ? "Save Changes"
                            : "Simpan Perubahan"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(profile);
                          setMessage("");
                        }}
                        disabled={saving}
                        className="flex-1 rounded-full border border-gray-300 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                      >
                        {isEnglish ? "Cancel" : "Batal"}
                      </button>

                    </div>

                  </form>
                )}
              </>
            )}

          </div>

          {/* KEMBALI */}
          <div className="text-center mt-7">
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