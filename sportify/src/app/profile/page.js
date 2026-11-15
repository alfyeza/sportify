"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("sportify_user");
  localStorage.removeItem("sportify_role");

  window.dispatchEvent(new Event("sportify-auth-change"));
};

const isUnauthorizedError = (error) => {
  const status = error?.status || error?.statusCode;

  if (status === 401 || status === 403) {
    return true;
  }

  const message = String(error?.message || "").toLowerCase();

  return (
    message.includes("unauthorized") ||
    message.includes("unauthenticated") ||
    message.includes("token expired") ||
    message.includes("invalid token") ||
    message.includes("token tidak valid") ||
    message.includes("token kedaluwarsa")
  );
};

const getResponseUser = (response) => {
  return (
    response?.user ||
    response?.data?.user ||
    response?.data?.profile ||
    response?.data ||
    response?.profile ||
    response ||
    {}
  );
};

const getResponseArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.stories)) return response.stories;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.stories)) return response.data.stories;

  return [];
};

export default function ProfilePage() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [ceritaSaya, setCeritaSaya] = useState([]);
  const [loadingCerita, setLoadingCerita] = useState(true);

  const [profile, setProfile] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    role: "penyewa",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // MENGARAHKAN PENGGUNA KEMBALI KE LOGIN
  const redirectToLogin = useCallback(() => {
    clearSession();
    router.replace("/login?redirect=%2Fprofile");
  }, [router]);

  // MENGAMBIL DATA PROFIL
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        redirectToLogin();
        return;
      }

      const response = await apiRequest("/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = getResponseUser(response);

      if (!user || (!user.email && !user.fullName && !user.name)) {
        throw new Error(
          isEnglish
            ? "Profile data is incomplete."
            : "Data profil yang diterima belum lengkap."
        );
      }

      const userRole = String(
        user.role ||
        user.user_role ||
        localStorage.getItem("sportify_role") ||
        "penyewa"
      ).toLowerCase();

      // HALAMAN INI KHUSUS PENYEWA
      if (["mitra", "pemilik", "owner"].includes(userRole)) {
        router.replace("/mitra/dashboard");
        return;
      }

      if (userRole === "admin") {
        router.replace("/admin/dashboard");
        return;
      }

      const profileData = {
        id: user.id || user.user_id || "",
        fullName: user.fullName || user.full_name || user.name || "",
        email: user.email || "",
        phone: user.phone || user.phoneNumber || user.phone_number || "",
        role: userRole,
      };

      setProfile(profileData);

      setFormData({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
      });

      localStorage.setItem(
        "sportify_user",
        JSON.stringify({
          ...user,
          ...profileData,
        })
      );

      localStorage.setItem("sportify_role", userRole);
    } catch (err) {
      console.error("Gagal mengambil profil:", err);

      if (isUnauthorizedError(err)) {
        redirectToLogin();
        return;
      }

      setError(
        err.message ||
        (isEnglish
          ? "Failed to load profile."
          : "Gagal mengambil data profil.")
      );
    } finally {
      setLoading(false);
    }
  }, [isEnglish, redirectToLogin, router]);

  // MENGAMBIL CERITA MILIK PENGGUNA
  const fetchCeritaSaya = useCallback(async () => {
    setLoadingCerita(true);

    try {
      const token = getToken();

      if (!token) {
        setCeritaSaya([]);
        return;
      }

      const response = await apiRequest("/cerita-pengguna", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const semuaCerita = getResponseArray(response);

      const savedUser = localStorage.getItem("sportify_user");

      let user = {};

      try {
        user = JSON.parse(savedUser || "{}");
      } catch {
        user = {};
      }

      const userId = String(
        user.id || user.user_id || profile.id || ""
      );

      const emailPengguna = String(user.email || profile.email || "")
        .trim()
        .toLowerCase();

      const ceritaPengguna = semuaCerita.filter((item) => {
        const storyUserId = String(
          item.user_id || item.userId || item.pengguna_id || ""
        );

        const storyEmail = String(item.email || "")
          .trim()
          .toLowerCase();

        // Utamakan pencocokan ID pengguna.
        if (userId && storyUserId) {
          return storyUserId === userId;
        }

        // Gunakan email sebagai alternatif jika ID tidak tersedia.
        if (emailPengguna && storyEmail) {
          return storyEmail === emailPengguna;
        }

        return false;
      });

      setCeritaSaya(ceritaPengguna);
    } catch (err) {
      console.error("Gagal mengambil cerita:", err);

      if (isUnauthorizedError(err)) {
        redirectToLogin();
        return;
      }

      setCeritaSaya([]);
    } finally {
      setLoadingCerita(false);
    }
  }, [profile.id, profile.email, redirectToLogin]);

  // JALANKAN SAAT HALAMAN DIBUKA
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // AMBIL CERITA SETELAH PROFIL BERHASIL DIMUAT
  useEffect(() => {
    if (!loading && !error && profile.email) {
      fetchCeritaSaya();
    }

    if (!loading && error) {
      setLoadingCerita(false);
      setCeritaSaya([]);
    }
  }, [loading, error, profile.email, fetchCeritaSaya]);

  // LOGOUT
  const handleLogout = () => {
    clearSession();
    router.replace("/login");
    router.refresh();
  };

  // MULAI EDIT PROFIL
  const handleEdit = () => {
    setFormData({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
    });

    setIsEditing(true);
    setMessage("");
    setError("");
  };

  // MEMBATALKAN EDIT
  const handleCancel = () => {
    setFormData({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
    });

    setIsEditing(false);
    setMessage("");
    setError("");
  };

  // SIMPAN PERUBAHAN PROFIL
  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    // VALIDASI NAMA
    if (!fullName) {
      setMessageType("error");
      setMessage(
        isEnglish ? "Full name is required." : "Nama lengkap wajib diisi."
      );
      return;
    }

    if (fullName.length < 3 || fullName.length > 100) {
      setMessageType("error");
      setMessage(
        isEnglish
          ? "Name must contain 3–100 characters."
          : "Nama harus terdiri dari 3–100 karakter."
      );
      return;
    }

    // VALIDASI EMAIL
    if (!email) {
      setMessageType("error");
      setMessage(
        isEnglish ? "Email is required." : "Email wajib diisi."
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setMessageType("error");
      setMessage(
        isEnglish
          ? "Please enter a valid email."
          : "Masukkan email yang valid."
      );
      return;
    }

    // VALIDASI NOMOR HP
    const phoneDigits = phone.replace(/\D/g, "");

    if (
      !phone ||
      !/^\+?[0-9\s-]+$/.test(phone) ||
      phoneDigits.length < 10 ||
      phoneDigits.length > 15
    ) {
      setMessageType("error");
      setMessage(
        isEnglish
          ? "Please enter a valid phone number (10–15 digits)."
          : "Masukkan nomor HP yang valid (10–15 angka)."
      );
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        redirectToLogin();
        return;
      }

      const updatedData = {
        fullName,
        email,
        phone,
      };

      const response = await apiRequest("/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const updatedUser = getResponseUser(response);

      const updatedProfile = {
        ...profile,
        ...updatedData,
        id:
          updatedUser.id ||
          updatedUser.user_id ||
          profile.id,
        fullName:
          updatedUser.fullName ||
          updatedUser.full_name ||
          updatedUser.name ||
          updatedData.fullName,
        email: updatedUser.email || updatedData.email,
        phone:
          updatedUser.phone ||
          updatedUser.phoneNumber ||
          updatedUser.phone_number ||
          updatedData.phone,
      };

      setProfile(updatedProfile);

      setFormData({
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
      });

      setIsEditing(false);

      // PERBARUI DATA PENGGUNA DI LOCAL STORAGE
      const savedUser = localStorage.getItem("sportify_user");

      let previousUser = {};

      try {
        previousUser = JSON.parse(savedUser || "{}");
      } catch {
        previousUser = {};
      }

      localStorage.setItem(
        "sportify_user",
        JSON.stringify({
          ...previousUser,
          ...updatedProfile,
        })
      );

      window.dispatchEvent(new Event("sportify-auth-change"));

      setMessageType("success");
      setMessage(
        isEnglish
          ? "Profile updated successfully."
          : "Profil berhasil diperbarui."
      );
    } catch (err) {
      console.error("Gagal memperbarui profil:", err);

      if (isUnauthorizedError(err)) {
        redirectToLogin();
        return;
      }

      setMessageType("error");
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

  // LABEL STATUS CERITA
  const getStatus = (status) => {
    const normalizedStatus = String(status || "pending").toLowerCase();

    const statuses = {
      pending: {
        label: isEnglish ? "Pending Review" : "Menunggu Persetujuan",
        className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        icon: "◷",
      },
      approved: {
        label: isEnglish ? "Published" : "Dipublikasikan",
        className: "bg-green-500/10 text-green-600 dark:text-green-400",
        icon: "✓",
      },
      rejected: {
        label: isEnglish ? "Rejected" : "Ditolak",
        className: "bg-red-500/10 text-red-600 dark:text-red-400",
        icon: "×",
      },
    };

    return statuses[normalizedStatus] || statuses.pending;
  };

  return (
    <>
      <Navbar />

      <main
        className="profile-page min-h-screen px-4 py-10 sm:py-14"
        style={{
          backgroundColor: "var(--bg-main)",
          color: "var(--text-main)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          {/* HEADER */}
          <div className="profile-header mb-8 text-center">
            <span className="inline-block rounded-full bg-soft-mint px-4 py-2 text-xs font-bold tracking-wider text-primary">
              {isEnglish ? "MY ACCOUNT" : "AKUN SAYA"}
            </span>

            <h1 className="mt-4 text-2xl font-bold text-dark-text sm:text-3xl">
              {isEnglish ? "My Profile" : "Profil Saya"}
            </h1>

            <p
              className="mt-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {isEnglish
                ? "Manage your personal information."
                : "Kelola informasi pribadi akun Sportify kamu."}
            </p>
          </div>

          {/* PROFILE CARD */}
          <div className="profile-card liquid-auth-card p-5 sm:p-8">
            {loading ? (
              <LoadingState
                message={
                  isEnglish ? "Loading profile..." : "Memuat profil..."
                }
              />
            ) : error ? (
              <ErrorState
                title={
                  isEnglish
                    ? "Failed to Load Profile"
                    : "Gagal Memuat Profil"
                }
                message={error}
                buttonText={isEnglish ? "Try Again" : "Coba Lagi"}
                onRetry={fetchProfile}
              />
            ) : !profile.fullName && !profile.email && !profile.phone ? (
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
                  isEnglish ? "Reload Profile" : "Muat Ulang Profil"
                }
                onButtonClick={fetchProfile}
              />
            ) : (
              <>
                {/* FOTO PROFIL */}
                <div className="profile-avatar mb-8 flex flex-col items-center text-center">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-md"
                    style={{
                      borderColor: "var(--bg-card-solid)",
                      backgroundColor: "var(--bg-soft)",
                    }}
                  >
                    <span className="text-3xl font-bold text-primary">
                      {profile.fullName
                        ? profile.fullName.charAt(0).toUpperCase()
                        : "S"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-dark-text">
                    {profile.fullName ||
                      (isEnglish ? "Sportify User" : "Pengguna Sportify")}
                  </h2>

                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {profile.email ||
                      (isEnglish ? "No email added" : "Belum ada email")}
                  </p>

                  <span className="mt-3 inline-flex rounded-full bg-soft-mint px-4 py-1.5 text-xs font-bold text-primary">
                    {isEnglish ? "Tenant Account" : "Akun Penyewa"}
                  </span>
                </div>

                {/* PESAN */}
                {message && (
                  <div
                    className={`profile-message mb-5 rounded-xl border px-4 py-3 text-sm ${messageType === "success"
                        ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                        : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
                      }`}
                  >
                    {message}
                  </div>
                )}

                {!isEditing ? (
                  <div className="space-y-5">
                    {/* NAMA */}
                    <div className="profile-field">
                      <label className="mb-2 block text-sm font-semibold text-dark-text">
                        {isEnglish ? "Full Name" : "Nama Lengkap"}
                      </label>

                      <div className="liquid-auth-input w-full text-sm">
                        {profile.fullName || "-"}
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div className="profile-field">
                      <label className="mb-2 block text-sm font-semibold text-dark-text">
                        Email
                      </label>

                      <div className="liquid-auth-input w-full text-sm">
                        {profile.email || "-"}
                      </div>
                    </div>

                    {/* NOMOR HP */}
                    <div className="profile-field">
                      <label className="mb-2 block text-sm font-semibold text-dark-text">
                        {isEnglish ? "Phone Number" : "Nomor HP"}
                      </label>

                      <div className="liquid-auth-input w-full text-sm">
                        {profile.phone || "-"}
                      </div>
                    </div>

                    {/* EDIT PROFIL */}
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="liquid-booking-button mt-4 w-full"
                    >
                      {isEnglish ? "Edit Profile" : "Edit Profil"}
                      <span>&gt;</span>
                    </button>

                    {/* LOGOUT */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-3 w-full rounded-full border border-red-500/30 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                    >
                      {isEnglish ? "Log Out" : "Keluar Akun"}
                    </button>
                  </div>
                ) : (
                  /* FORM EDIT PROFIL */
                  <form onSubmit={handleSave} className="space-y-5">
                    <div className="profile-field">
                      <label className="mb-2 block text-sm font-semibold text-dark-text">
                        {isEnglish ? "Full Name" : "Nama Lengkap"}
                      </label>

                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            fullName: e.target.value,
                          });
                          setMessage("");
                        }}
                        placeholder={
                          isEnglish ? "Enter your name" : "Masukkan nama"
                        }
                        className="liquid-auth-input w-full text-sm"
                        autoComplete="name"
                        maxLength={100}
                        disabled={saving}
                      />
                    </div>

                    <div className="profile-field">
                      <label className="mb-2 block text-sm font-semibold text-dark-text">
                        Email
                      </label>

                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          });
                          setMessage("");
                        }}
                        placeholder={
                          isEnglish ? "Enter your email" : "Masukkan email"
                        }
                        className="liquid-auth-input w-full text-sm"
                        autoComplete="email"
                        disabled={saving}
                      />
                    </div>

                    <div className="profile-field">
                      <label className="mb-2 block text-sm font-semibold text-dark-text">
                        {isEnglish ? "Phone Number" : "Nomor HP"}
                      </label>

                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          });
                          setMessage("");
                        }}
                        placeholder={
                          isEnglish
                            ? "Enter your phone number"
                            : "Masukkan nomor HP"
                        }
                        className="liquid-auth-input w-full text-sm"
                        autoComplete="tel"
                        disabled={saving}
                      />
                    </div>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                      <button
                        type="submit"
                        disabled={saving}
                        className="liquid-booking-button flex-1 disabled:cursor-not-allowed disabled:opacity-60"
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
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex-1 rounded-full border py-3 text-sm font-semibold transition disabled:opacity-60"
                        style={{
                          borderColor: "var(--border-main)",
                          color: "var(--text-secondary)",
                          backgroundColor: "var(--bg-card)",
                        }}
                      >
                        {isEnglish ? "Cancel" : "Batal"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          {/* CERITA SAYA */}
          {!loading && !error && profile.email && (
            <section
              className="profile-stories mt-8 overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-8"
              style={{
                borderColor: "var(--border-main)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <span className="text-xs font-bold tracking-widest text-primary dark:text-green-400">
                    MY STORIES
                  </span>

                  <h2 className="mt-2 text-xl font-bold text-dark-text sm:text-2xl">
                    {isEnglish ? "My Stories" : "Cerita Saya"}
                  </h2>

                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {isEnglish
                      ? "Manage the stories you have shared with Sportify."
                      : "Lihat pengalaman yang pernah kamu bagikan bersama Sportify."}
                  </p>
                </div>

                <Link
                  href="/cerita-pengguna/tulis"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
                >
                  <span>+</span>
                  {isEnglish ? "Write a Story" : "Tulis Cerita"}
                </Link>
              </div>

              <div className="mt-7">
                {loadingCerita ? (
                  <LoadingState
                    message={
                      isEnglish
                        ? "Loading your stories..."
                        : "Memuat cerita kamu..."
                    }
                  />
                ) : ceritaSaya.length === 0 ? (
                  <div
                    className="profile-empty rounded-2xl border border-dashed px-5 py-10 text-center"
                    style={{ borderColor: "var(--border-main)" }}
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-2xl text-primary dark:text-green-400">
                      ✦
                    </div>

                    <h3 className="mt-4 font-bold text-dark-text">
                      {isEnglish
                        ? "You haven't shared a story yet"
                        : "Kamu Belum Punya Cerita"}
                    </h3>

                    <p
                      className="mx-auto mt-2 max-w-sm text-sm leading-6"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {isEnglish
                        ? "Share your experience using Sportify and let others know what you think."
                        : "Bagikan pengalamanmu menggunakan Sportify dan ceritakan pendapatmu kepada pengguna lain."}
                    </p>

                    <Link
                      href="/cerita-pengguna/tulis"
                      className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
                    >
                      {isEnglish
                        ? "Share Your Experience"
                        : "Bagikan Pengalaman"}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ceritaSaya.map((item) => {
                      const status = getStatus(item.status);
                      const tanggalCerita = item.tanggal
                        ? new Date(item.tanggal)
                        : null;

                      const tanggalValid =
                        tanggalCerita &&
                        !Number.isNaN(tanggalCerita.getTime());

                      return (
                        <article
                          key={item.id}
                          className="profile-story-item rounded-2xl border p-5"
                          style={{
                            borderColor: "var(--border-main)",
                            backgroundColor: "var(--bg-main)",
                          }}
                        >
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div>
                              <span className="text-xs font-semibold text-primary dark:text-green-400">
                                {item.kategori}
                              </span>

                              <div className="mt-2 flex gap-1 text-lg text-yellow-400">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <span key={index}>
                                    {index < Number(item.rating || 0)
                                      ? "★"
                                      : "☆"}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <span
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                            >
                              {status.icon} {status.label}
                            </span>
                          </div>

                          <p
                            className="mt-4 text-sm leading-7"
                            style={{ color: "var(--text-main)" }}
                          >
                            "{item.cerita}"
                          </p>

                          {tanggalValid && (
                            <p
                              className="mt-4 text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {isEnglish ? "Submitted on" : "Dikirim pada"}{" "}
                              {tanggalCerita.toLocaleDateString(
                                isEnglish ? "en-US" : "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* KEMBALI KE BERANDA */}
          <div className="profile-back mt-7 text-center">
            <Link
              href="/"
              className="text-sm transition hover:text-primary"
              style={{ color: "var(--text-secondary)" }}
            >
              &lt; {isEnglish ? "Back to Home" : "Kembali ke Beranda"}
            </Link>
          </div>
        </div>

        {/* ANIMATION STYLES */}
        <style jsx global>{`
          .profile-page {
            animation: profilePageEnter 0.7s ease both;
          }

          .profile-header {
            animation: profileFadeUp 0.7s ease both;
          }

          .profile-card {
            animation: profileFadeUp 0.8s ease 0.1s both;
            transition:
              transform 0.35s ease,
              box-shadow 0.35s ease;
          }

          .profile-card:hover {
            transform: translateY(-3px);
          }

          .profile-avatar {
            animation: profileFadeUp 0.8s ease 0.2s both;
          }

          .profile-avatar > div {
            animation: profileAvatarFloat 3s ease-in-out infinite;
            transition: box-shadow 0.3s ease;
          }

          .profile-avatar > div:hover {
            box-shadow: 0 0 25px rgba(39, 163, 107, 0.25);
          }

          .profile-stories {
            animation: profileFadeUp 0.8s ease 0.25s both;
            transition:
              transform 0.35s ease,
              box-shadow 0.35s ease;
          }

          .profile-story-item {
            animation: profileFadeUp 0.6s ease both;
            transition:
              transform 0.3s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;
          }

          .profile-story-item:hover {
            transform: translateY(-4px);
            border-color: rgba(39, 163, 107, 0.5) !important;
            box-shadow: 0 10px 25px rgba(20, 107, 69, 0.08);
          }

          .profile-story-item:nth-child(2) {
            animation-delay: 0.1s;
          }

          .profile-story-item:nth-child(3) {
            animation-delay: 0.2s;
          }

          .profile-story-item:nth-child(4) {
            animation-delay: 0.3s;
          }

          .profile-empty {
            animation: profileFadeUp 0.6s ease both;
          }

          .profile-page button,
          .profile-page a {
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease,
              background-color 0.25s ease;
          }

          .profile-page button:not(:disabled):active,
          .profile-page a:active {
            transform: scale(0.97);
          }

          .profile-page input {
            transition:
              border-color 0.25s ease,
              box-shadow 0.25s ease;
          }

          .profile-page input:focus {
            box-shadow: 0 0 0 3px rgba(39, 163, 107, 0.12);
          }

          .profile-message {
            animation: profileFadeUp 0.4s ease both;
          }

          .profile-back {
            animation: profileFadeUp 0.8s ease 0.35s both;
          }

          @keyframes profilePageEnter {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes profileFadeUp {
            from {
              opacity: 0;
              transform: translateY(22px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes profileAvatarFloat {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .profile-page *,
            .profile-page *::before,
            .profile-page *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
