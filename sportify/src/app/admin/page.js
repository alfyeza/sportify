"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const KATEGORI_POPULER = [
  "Padel",
  "Tennis",
  "Mini Soccer",
  "Badminton",
  "Futsal",
  "Basket",
  "Gym",
  "Renang",
  "Pickleball",
];

const FASILITAS_DEFAULT = [
  "Jual Minuman",
  "Parkir Mobil",
  "Parkir Motor",
  "Ruang Ganti",
  "Shower",
  "Hot Shower",
  "Toilet",
  "Wi-fi",
  "Musholla",
  "Cafe & Resto",
  "Tribun Penonton",
  "Jual Makanan Ringan",
  "Sewa Alat / Raket",
  "Loker Penyimpanan",
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Status autentikasi
  const [admin, setAdmin] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Tab aktif: "tambah" atau "kelola"
  const [activeTab, setActiveTab] = useState("tambah");

  // State Daftar Lapangan
  const [daftarLapangan, setDaftarLapangan] = useState([]);
  const [loadingDaftar, setLoadingDaftar] = useState(false);
  const [searchDaftar, setSearchDaftar] = useState("");

  // State Form Tambah Lapangan
  const [nama, setNama] = useState("");
  const [lokasi, setLokasi] = useState("Kota Semarang, Jawa Tengah");
  const [alamat, setAlamat] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [harga, setHarga] = useState("");
  const [kontak, setKontak] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategoriList, setKategoriList] = useState(["Padel"]);
  const [kategoriInput, setKategoriInput] = useState("");
  const [fasilitasSelected, setFasilitasSelected] = useState([
    "Jual Minuman",
    "Parkir Mobil",
    "Parkir Motor",
    "Ruang Ganti",
    "Shower",
    "Toilet",
  ]);
  const [customFasilitasInput, setCustomFasilitasInput] = useState("");
  const [fotoList, setFotoList] = useState([]);
  const [fotoUrlInput, setFotoUrlInput] = useState("");
  const [fotoSampulIndex, setFotoSampulIndex] = useState(0);

  // Unit / Court spesifik
  const [unitList, setUnitList] = useState([]);
  const [unitInput, setUnitInput] = useState("");

  // Status submit form
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  const [successResult, setSuccessResult] = useState(null);

  // Status modal hapus
  const [deleteModalVenue, setDeleteModalVenue] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Notifikasi toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. CEK AUTENTIKASI ADMIN
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("sportify_admin_token");
        const res = await fetch("/api/admin/me", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }

        const data = await res.json();
        setAdmin(data.admin);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/admin/login");
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // 2. FETCH DAFTAR LAPANGAN
  const fetchLapangan = async () => {
    try {
      setLoadingDaftar(true);
      const res = await fetch("/api/lapangan");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDaftarLapangan(json.data);
      }
    } catch (err) {
      console.error("Fetch lapangan error:", err);
      showToast("Gagal memuat daftar lapangan", "error");
    } finally {
      setLoadingDaftar(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchLapangan();
    }
  }, [admin]);

  // LOGOUT
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("sportify_admin_token");
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      // Abaikan
    } finally {
      localStorage.removeItem("sportify_admin_token");
      localStorage.removeItem("sportify_admin_user");
      router.replace("/admin/login");
    }
  };

  // TOGGLE KATEGORI
  const toggleKategori = (kat) => {
    if (kategoriList.includes(kat)) {
      if (kategoriList.length > 1) {
        setKategoriList(kategoriList.filter((k) => k !== kat));
      }
    } else {
      setKategoriList([...kategoriList, kat]);
    }
  };

  const handleAddCustomKategori = (e) => {
    e.preventDefault();
    const val = kategoriInput.trim();
    if (val && !kategoriList.includes(val)) {
      setKategoriList([...kategoriList, val]);
      setKategoriInput("");
    }
  };

  // TOGGLE FASILITAS
  const toggleFasilitas = (fas) => {
    if (fasilitasSelected.includes(fas)) {
      setFasilitasSelected(fasilitasSelected.filter((f) => f !== fas));
    } else {
      setFasilitasSelected([...fasilitasSelected, fas]);
    }
  };

  const handleAddCustomFasilitas = (e) => {
    e.preventDefault();
    const val = customFasilitasInput.trim();
    if (val && !fasilitasSelected.includes(val)) {
      setFasilitasSelected([...fasilitasSelected, val]);
      setCustomFasilitasInput("");
    }
  };

  // UPLOAD FILE GAMBAR
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const token = localStorage.getItem("sportify_admin_token");
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal mengunggah foto.");
      }

      const newUrls = data.urls || [data.url];
      setFotoList((prev) => [...prev, ...newUrls]);
      showToast(`${newUrls.length} foto berhasil diunggah.`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // TAMBAH URL FOTO MANUAL
  const handleAddFotoUrl = (e) => {
    e.preventDefault();
    const url = fotoUrlInput.trim();
    if (url) {
      setFotoList((prev) => [...prev, url]);
      setFotoUrlInput("");
      showToast("Tautan foto ditambahkan.");
    }
  };

  // HAPUS FOTO
  const handleRemoveFoto = (index) => {
    const updated = fotoList.filter((_, i) => i !== index);
    setFotoList(updated);
    if (fotoSampulIndex >= updated.length) {
      setFotoSampulIndex(Math.max(0, updated.length - 1));
    }
  };

  // TAMBAH UNIT / COURT
  const handleAddUnit = (e) => {
    e.preventDefault();
    const name = unitInput.trim();
    if (name) {
      setUnitList((prev) => [
        ...prev,
        { id: prev.length + 1, nama: name, gambar: fotoList[0] || "" },
      ]);
      setUnitInput("");
    }
  };

  const handleRemoveUnit = (index) => {
    setUnitList(unitList.filter((_, i) => i !== index));
  };

  // RESET FORM
  const handleResetForm = () => {
    setNama("");
    setLokasi("Kota Semarang, Jawa Tengah");
    setAlamat("");
    setMapsUrl("");
    setHarga("");
    setKontak("");
    setDeskripsi("");
    setKategoriList(["Padel"]);
    setFasilitasSelected([
      "Jual Minuman",
      "Parkir Mobil",
      "Parkir Motor",
      "Ruang Ganti",
      "Shower",
      "Toilet",
    ]);
    setFotoList([]);
    setFotoSampulIndex(0);
    setUnitList([]);
    setFormError("");
    setSuccessResult(null);
  };

  // SUBMIT FORM TAMBAH LAPANGAN
  const handleSubmitLapangan = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessResult(null);

    // Validasi
    if (!nama.trim()) {
      setFormError("Nama Venue wajib diisi.");
      return;
    }
    if (!lokasi.trim()) {
      setFormError("Kota / Lokasi Venue wajib diisi.");
      return;
    }
    if (!alamat.trim()) {
      setFormError("Alamat lengkap venue wajib diisi.");
      return;
    }
    if (!harga || Number(harga) <= 0) {
      setFormError("Harga sewa per sesi harus berupa angka valid lebih dari 0.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("sportify_admin_token");

      const finalFoto = fotoList.length > 0 ? fotoList : ["/images/lapangan/padel/padel01/padel1.jpeg"];
      const finalGambarUtama = finalFoto[fotoSampulIndex] || finalFoto[0];

      const payload = {
        nama: nama.trim(),
        lokasi: lokasi.trim(),
        alamat: alamat.trim(),
        mapsUrl: mapsUrl.trim(),
        kategori: kategoriList,
        harga: Number(harga),
        deskripsi: deskripsi.trim(),
        fasilitas: fasilitasSelected,
        foto: finalFoto,
        gambar: finalGambarUtama,
        kontak: kontak.trim(),
        unitLapangan: unitList,
      };

      const res = await fetch("/api/lapangan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal menyimpan lapangan ke database.");
      }

      setSuccessResult(data.data);
      showToast(`Venue "${data.data.nama}" berhasil disimpan ke database!`);

      // Refresh list
      fetchLapangan();

      // Scroll to top of form
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch (err) {
      setFormError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  // HAPUS LAPANGAN
  const handleDeleteVenue = async () => {
    if (!deleteModalVenue) return;

    try {
      setDeletingId(deleteModalVenue.id);
      const token = localStorage.getItem("sportify_admin_token");

      const res = await fetch(`/api/lapangan/${deleteModalVenue.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal menghapus lapangan.");
      }

      showToast(`Lapangan "${deleteModalVenue.nama}" berhasil dihapus.`);
      setDeleteModalVenue(null);
      fetchLapangan();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  // FILTER LAPANGAN DI TAB KELOLA
  const filteredDaftar = daftarLapangan.filter((item) => {
    const q = searchDaftar.toLowerCase().trim();
    if (!q) return true;
    return (
      item.nama.toLowerCase().includes(q) ||
      item.lokasi.toLowerCase().includes(q) ||
      (Array.isArray(item.kategori) &&
        item.kategori.some((k) => k.toLowerCase().includes(q)))
    );
  });

  if (loadingAuth) {
    return (
      <main className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[var(--text-secondary)]">
            Memuat Dashboard Admin Sportify...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
      {/* TOAST NOTIFIKASI */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up text-sm font-semibold text-white ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER ADMIN */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-xl border-b border-[var(--border-main)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* LOGO & BADGE */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-2xl font-black text-primary tracking-tight hover:opacity-85 transition"
            >
              Sportify
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-primary dark:text-emerald-400 text-xs font-bold">
              <span>🛡️</span>
              <span>ADMIN PANEL</span>
            </span>
          </div>

          {/* USER INFO & ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[var(--text-secondary)]">Login sebagai:</span>
              <span className="font-bold text-[var(--text-main)]">
                {admin?.name || admin?.username || "Admin"}
              </span>
            </div>

            <Link
              href="/lapangan"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-main)] hover:border-primary hover:text-primary transition"
              title="Buka Halaman Lapangan Publik di Tab Baru"
            >
              <span>🌐</span>
              <span className="hidden sm:inline">Lihat Web Publik</span>
              <span>↗</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition"
            >
              <span>🚪</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER / TAB NAVIGATION */}
      <section className="bg-gradient-to-r from-emerald-800 to-green-950 text-white py-8 sm:py-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-lime-300 text-xs font-bold tracking-wider uppercase">
                Sportify Management System
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1">
                Dashboard & Manajemen Lapangan
              </h1>
              <p className="text-white/75 text-sm mt-1 max-w-2xl">
                Tambah data venue baru secara lengkap, kelola ketersediaan fasilitas, serta integrasikan langsung ke halaman pencarian dan detail publik Sportify.
              </p>
            </div>

            {/* QUICK STATS */}
            <div className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <p className="text-xs text-white/70">Total Venue</p>
                <p className="text-2xl font-black text-lime-300">
                  {daftarLapangan.length}
                </p>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <p className="text-xs text-white/70">Database Status</p>
                <p className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 justify-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  SQLite Connected
                </p>
              </div>
            </div>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex items-center gap-2 mt-8 border-b border-white/15">
            <button
              type="button"
              onClick={() => setActiveTab("tambah")}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "tambah"
                  ? "border-lime-400 text-lime-300 bg-white/10 rounded-t-xl"
                  : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              <span>➕</span>
              <span>Form Tambah Lapangan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kelola")}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "kelola"
                  ? "border-lime-400 text-lime-300 bg-white/10 rounded-t-xl"
                  : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              <span>📋</span>
              <span>Daftar & Kelola Lapangan ({daftarLapangan.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full">
        {/* ========================================================
            TAB 1: FORM TAMBAH LAPANGAN
        ======================================================== */}
        {activeTab === "tambah" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* FORM CONTAINER (KIRI) */}
            <div className="lg:col-span-8 space-y-6">
              {/* SUCCESS BANNER JIKA BARU DISIMPAN */}
              {successResult && (
                <div className="p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 text-[var(--text-main)] shadow-lg animate-fade-in">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🎉</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary dark:text-emerald-400">
                        Venue Berhasil Disimpan ke Database!
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Data <strong>{successResult.nama}</strong> telah tersimpan di tabel database dan langsung tampil di halaman daftar serta detail publik.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={`/lapangan/${successResult.id}`}
                          target="_blank"
                          className="liquid-booking-button inline-flex items-center gap-2 text-xs py-2 px-4"
                        >
                          <span>Buka Detail Lapangan Ini</span>
                          <span>→</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleResetForm}
                          className="px-4 py-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] text-xs font-semibold hover:border-primary transition"
                        >
                          ➕ Tambah Lapangan Lain
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FORM CARD */}
              <form
                onSubmit={handleSubmitLapangan}
                className="liquid-info-card p-6 sm:p-8 space-y-8"
              >
                {/* TITLE & INTRO */}
                <div className="border-b border-[var(--border-soft)] pb-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                    Formulir Input Data Lapangan
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Pastikan informasi yang dimasukkan akurat agar pengunjung mendapatkan informasi yang jelas mengenai lokasi, harga, fasilitas, dan foto venue.
                  </p>
                </div>

                {/* ERROR ALERT */}
                {formError && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
                    <span className="text-lg">⚠️</span>
                    <p className="font-semibold">{formError}</p>
                  </div>
                )}

                {/* 1. NAMA VENUE & HARGA */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-primary dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-soft-mint text-primary flex items-center justify-center text-xs">
                      1
                    </span>
                    Informasi Utama & Tarif Sewa
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nama Venue */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 uppercase tracking-wider">
                        Nama Venue Lapangan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Unity Sports Center, Padel Bee, Smashville"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="liquid-auth-input"
                        required
                      />
                    </div>

                    {/* Harga Sewa */}
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 uppercase tracking-wider">
                        Harga Sewa per Sesi (Rp) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)]">
                          Rp
                        </span>
                        <input
                          type="number"
                          placeholder="160000"
                          value={harga}
                          onChange={(e) => setHarga(e.target.value)}
                          className="liquid-auth-input pl-12"
                          min="0"
                          step="5000"
                          required
                        />
                      </div>
                      {harga && Number(harga) > 0 && (
                        <p className="text-xs text-primary font-semibold mt-1">
                          Pratinjau: Rp {Number(harga).toLocaleString("id-ID")} / sesi
                        </p>
                      )}
                    </div>

                    {/* Kontak WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 uppercase tracking-wider">
                        Kontak WhatsApp Venue / Admin
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                          💬
                        </span>
                        <input
                          type="text"
                          placeholder="0812-3456-7890 atau 628123456789"
                          value={kontak}
                          onChange={(e) => setKontak(e.target.value)}
                          className="liquid-auth-input pl-11"
                        />
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Akan tampil sebagai tombol WhatsApp langsung di halaman detail.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. KATEGORI OLAHRAGA */}
                <div className="space-y-4 pt-4 border-t border-[var(--border-soft)]">
                  <h3 className="text-base font-bold text-primary dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-soft-mint text-primary flex items-center justify-center text-xs">
                      2
                    </span>
                    Kategori Olahraga (Bisa Pilih Lebih Dari Satu)
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {KATEGORI_POPULER.map((kat) => {
                      const isSelected = kategoriList.includes(kat);
                      return (
                        <button
                          key={kat}
                          type="button"
                          onClick={() => toggleKategori(kat)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-primary text-white shadow-md scale-105"
                              : "bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-primary"
                          }`}
                        >
                          {isSelected && "✓ "}
                          {kat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tambah Kategori Kustom */}
                  <div className="flex items-center gap-2 max-w-sm pt-2">
                    <input
                      type="text"
                      placeholder="Tambah kategori lain..."
                      value={kategoriInput}
                      onChange={(e) => setKategoriInput(e.target.value)}
                      className="liquid-auth-input text-xs py-2"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomKategori}
                      className="px-4 py-2 rounded-xl bg-soft-mint text-primary text-xs font-bold hover:bg-green-100 transition whitespace-nowrap"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>

                {/* 3. LOKASI, ALAMAT & GOOGLE MAPS */}
                <div className="space-y-4 pt-4 border-t border-[var(--border-soft)]">
                  <h3 className="text-base font-bold text-primary dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-soft-mint text-primary flex items-center justify-center text-xs">
                      3
                    </span>
                    Lokasi, Alamat & Peta Google Maps
                  </h3>

                  <div className="space-y-4">
                    {/* Kota / Lokasi Ringkas */}
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 uppercase tracking-wider">
                        Kota / Lokasi Umum <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Kota Semarang, Jawa Tengah"
                        value={lokasi}
                        onChange={(e) => setLokasi(e.target.value)}
                        className="liquid-auth-input"
                        required
                      />
                    </div>

                    {/* Alamat Lengkap */}
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 uppercase tracking-wider">
                        Alamat Lengkap Venue <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Jl. Sisingamangaraja No.24, Kaliwiru, Kec. Candisari, Kota Semarang, Jawa Tengah 50253"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        className="liquid-auth-input resize-y"
                        required
                      />
                    </div>

                    {/* Google Maps Link / Embed */}
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 uppercase tracking-wider">
                        Link / Embed Google Maps
                      </label>
                      <input
                        type="url"
                        placeholder="https://maps.app.goo.gl/... atau tautan share Google Maps"
                        value={mapsUrl}
                        onChange={(e) => setMapsUrl(e.target.value)}
                        className="liquid-auth-input"
                      />
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Sistem juga akan membuat peta embed interaktif secara otomatis berdasarkan alamat lengkap di atas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. DESKRIPSI & CHECKLIST FASILITAS */}
                <div className="space-y-4 pt-4 border-t border-[var(--border-soft)]">
                  <h3 className="text-base font-bold text-primary dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-soft-mint text-primary flex items-center justify-center text-xs">
                      4
                    </span>
                    Deskripsi Venue & Checklist Fasilitas
                  </h3>

                  {/* Deskripsi */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 uppercase tracking-wider">
                      Deskripsi Venue (Aturan bermain, keunggulan, jadwal)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Contoh: Sports Make Me Happy! Unity Sports Center menyediakan lapangan padel dan tenis standar internasional dengan fasilitas shower dan ruang ganti higienis..."
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                      className="liquid-auth-input resize-y"
                    />
                  </div>

                  {/* Checklist Fasilitas */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 uppercase tracking-wider">
                      Fasilitas yang Tersedia (Centang yang sesuai)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {FASILITAS_DEFAULT.map((fas) => {
                        const checked = fasilitasSelected.includes(fas);
                        return (
                          <label
                            key={fas}
                            onClick={() => toggleFasilitas(fas)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer select-none transition ${
                              checked
                                ? "bg-soft-mint dark:bg-emerald-950/40 border-primary text-primary dark:text-emerald-300 font-bold"
                                : "bg-[var(--bg-card)] border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-primary/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              readOnly
                              className="rounded text-primary focus:ring-primary"
                            />
                            <span className="truncate">{fas}</span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Tambah Fasilitas Kustom */}
                    <div className="flex items-center gap-2 max-w-sm mt-3">
                      <input
                        type="text"
                        placeholder="Fasilitas lain (cth: Sound System, Locker)"
                        value={customFasilitasInput}
                        onChange={(e) => setCustomFasilitasInput(e.target.value)}
                        className="liquid-auth-input text-xs py-2"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomFasilitas}
                        className="px-4 py-2 rounded-xl bg-soft-mint text-primary text-xs font-bold hover:bg-green-100 transition whitespace-nowrap"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. GALERI FOTO VENUE (UPLOAD / URL) */}
                <div className="space-y-4 pt-4 border-t border-[var(--border-soft)]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-primary dark:text-emerald-400 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-soft-mint text-primary flex items-center justify-center text-xs">
                        5
                      </span>
                      Galeri Foto Venue (Untuk Slider Galeri)
                    </h3>
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      {fotoList.length} Foto
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)]">
                    Foto-foto ini akan ditampilkan pada slider galeri interaktif di halaman detail lapangan utama. Anda dapat mengunggah file foto atau memasukkan URL gambar.
                  </p>

                  {/* DROPZONE / FILE UPLOAD */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Upload File */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[var(--border-main)] hover:border-primary rounded-2xl p-6 text-center cursor-pointer transition bg-emerald-500/5 hover:bg-emerald-500/10 flex flex-col items-center justify-center gap-2"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="text-3xl">📸</span>
                      <p className="text-xs font-bold text-primary">
                        {uploadingImage ? "Sedang Mengunggah..." : "Klik untuk Unggah Foto dari Komputer"}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Mendukung JPG, PNG, WebP (Bisa pilih beberapa foto sekaligus)
                      </p>
                    </div>

                    {/* Masukkan URL Gambar Manual */}
                    <div className="flex flex-col justify-center p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)]">
                      <label className="text-xs font-bold text-[var(--text-main)] mb-2">
                        Atau Tambahkan Tautan URL Foto:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/... atau /images/..."
                          value={fotoUrlInput}
                          onChange={(e) => setFotoUrlInput(e.target.value)}
                          className="liquid-auth-input text-xs py-2 flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleAddFotoUrl}
                          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-secondary transition"
                        >
                          + Tambah
                        </button>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-2">
                        Contoh foto demo: <code>/images/lapangan/padel/padel01/padel1.jpeg</code>
                      </p>
                    </div>
                  </div>

                  {/* DAFTAR THUMBNAIL FOTO */}
                  {fotoList.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-semibold text-[var(--text-secondary)]">
                        Pilih foto untuk dijadikan foto sampul utama (klik bintang):
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {fotoList.map((url, idx) => {
                          const isSampul = fotoSampulIndex === idx;
                          return (
                            <div
                              key={idx}
                              className={`relative rounded-2xl overflow-hidden aspect-video border-2 transition group ${
                                isSampul
                                  ? "border-primary ring-2 ring-primary/40"
                                  : "border-[var(--border-soft)]"
                              }`}
                            >
                              <img
                                src={url}
                                alt={`Foto ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {/* BADGE SAMPUL */}
                              {isSampul && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold shadow">
                                  Sampul
                                </span>
                              )}

                              {/* TOMBOL AKSI */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setFotoSampulIndex(idx)}
                                  title="Jadikan Foto Sampul"
                                  className="w-8 h-8 rounded-full bg-yellow-500 text-white font-bold flex items-center justify-center text-sm shadow hover:scale-110 transition"
                                >
                                  ★
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFoto(idx)}
                                  title="Hapus Foto"
                                  className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm shadow hover:scale-110 transition"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-soft)] text-center text-xs text-[var(--text-muted)]">
                      Belum ada foto yang ditambahkan. Jika dikosongkan, sistem akan menggunakan foto default Sportify.
                    </div>
                  )}
                </div>

                {/* 6. UNIT LAPANGAN / COURT (OPSIONAL) */}
                <div className="space-y-4 pt-4 border-t border-[var(--border-soft)]">
                  <h3 className="text-base font-bold text-primary dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-soft-mint text-primary flex items-center justify-center text-xs">
                      6
                    </span>
                    Unit / Court Spesifik (Opsional)
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)]">
                    Jika venue memiliki beberapa lapangan (misal: Court 1, Court 2, dsb), Anda dapat mendaftarkannya di sini.
                  </p>

                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      placeholder="Contoh: Court Padel 1, Tennis Outdoor 2"
                      value={unitInput}
                      onChange={(e) => setUnitInput(e.target.value)}
                      className="liquid-auth-input text-xs py-2"
                    />
                    <button
                      type="button"
                      onClick={handleAddUnit}
                      className="px-4 py-2 rounded-xl bg-soft-mint text-primary text-xs font-bold hover:bg-green-100 transition whitespace-nowrap"
                    >
                      + Tambah Unit
                    </button>
                  </div>

                  {unitList.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {unitList.map((unit, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-xs font-semibold"
                        >
                          <span>🏟️ {unit.nama}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveUnit(idx)}
                            className="text-red-500 hover:text-red-700 ml-1 font-bold"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* TOMBOL SUBMIT */}
                <div className="pt-6 border-t border-[var(--border-soft)] flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[var(--border-main)] text-xs font-bold hover:bg-[var(--bg-card)] transition"
                  >
                    Reset Formulir
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="liquid-primary-button w-full sm:w-auto px-8 py-3.5 font-bold shadow-xl text-center justify-center"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Menyimpan ke Database...
                      </span>
                    ) : (
                      "💾 Simpan Lapangan ke Database"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* LIVE PREVIEW CARD (KANAN) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="liquid-info-card p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-soft)]">
                  <h3 className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                    <span>👁️</span>
                    <span>Live Pratinjau Publik</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-primary text-[10px] font-bold">
                    Realtime
                  </span>
                </div>

                {/* PRATINJAU KARTU LAPANGAN */}
                <article className="liquid-card overflow-hidden rounded-2xl border border-[var(--border-main)] shadow-md">
                  {/* FOTO */}
                  <div className="relative h-44 w-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    <img
                      src={
                        fotoList[fotoSampulIndex] ||
                        fotoList[0] ||
                        "/images/lapangan/padel/padel01/padel1.jpeg"
                      }
                      alt={nama || "Preview Venue"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      ⭐ Rekomendasi
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
                      {kategoriList.slice(0, 2).map((k) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-semibold"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* KONTEN */}
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-base text-[var(--text-main)] line-clamp-1">
                      {nama || "Nama Venue Anda"}
                    </h4>

                    <p className="text-xs text-[var(--text-secondary)] flex items-start gap-1 line-clamp-1">
                      <span>📍</span>
                      <span>{lokasi || "Kota / Lokasi"}</span>
                    </p>

                    {/* FASILITAS PREVIEW */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {fasilitasSelected.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="px-2 py-0.5 rounded-md bg-soft-mint dark:bg-white/5 text-primary text-[10px] font-medium"
                        >
                          {f}
                        </span>
                      ))}
                      {fasilitasSelected.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[var(--bg-main)] text-[var(--text-muted)] text-[10px]">
                          +{fasilitasSelected.length - 3} lainnya
                        </span>
                      )}
                    </div>

                    <div className="border-t border-[var(--border-soft)] pt-3 mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[var(--text-muted)]">Harga Sewa</p>
                        <p className="text-sm font-extrabold text-primary">
                          Rp {Number(harga || 0).toLocaleString("id-ID")}
                          <span className="text-[10px] font-normal text-[var(--text-muted)]">
                            {" "}/ sesi
                          </span>
                        </p>
                      </div>

                      <span className="liquid-detail-button text-xs py-1.5 px-3">
                        Detail &gt;
                      </span>
                    </div>
                  </div>
                </article>

                {/* INFO SINGKAT KONTAK & MAPS */}
                <div className="mt-4 p-3 rounded-xl bg-soft-mint dark:bg-white/5 border border-primary/20 text-xs space-y-1.5">
                  <p className="font-bold text-primary dark:text-emerald-400">
                    Fitur Otomatis Tersedia:
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    ✓ <strong>WhatsApp:</strong>{" "}
                    {kontak ? (
                      <span className="text-emerald-600 font-bold">{kontak}</span>
                    ) : (
                      "Belum diatur"
                    )}
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    ✓ <strong>Google Maps:</strong>{" "}
                    {mapsUrl ? "Tautan Aktif" : "Otomatis via Alamat"}
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    ✓ <strong>Galeri Slider:</strong> {fotoList.length} Foto
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: DAFTAR & KELOLA LAPANGAN
        ======================================================== */}
        {activeTab === "kelola" && (
          <div className="space-y-6">
            {/* SEARCH & FILTER BAR */}
            <div className="liquid-info-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Cari nama venue, lokasi, kategori..."
                  value={searchDaftar}
                  onChange={(e) => setSearchDaftar(e.target.value)}
                  className="liquid-auth-input pl-10 text-xs py-2.5 w-full"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={fetchLapangan}
                  disabled={loadingDaftar}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-main)] text-xs font-semibold hover:border-primary transition flex items-center gap-1.5"
                >
                  <span>🔄</span>
                  <span>{loadingDaftar ? "Memuat..." : "Segarkan Data"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tambah")}
                  className="liquid-primary-button text-xs py-2.5 px-4 font-bold"
                >
                  + Tambah Baru
                </button>
              </div>
            </div>

            {/* TABEL VENUE */}
            <div className="liquid-info-card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-main)] border-b border-[var(--border-main)] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Venue & Foto</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Lokasi & Alamat</th>
                      <th className="p-4">Harga / Sesi</th>
                      <th className="p-4">Kontak WA</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-soft)]">
                    {filteredDaftar.length > 0 ? (
                      filteredDaftar.map((item) => {
                        const kategoriArray = Array.isArray(item.kategori)
                          ? item.kategori
                          : [item.kategori];
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-[var(--bg-card)]/60 transition"
                          >
                            {/* NAMA & FOTO */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-11 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
                                  <img
                                    src={
                                      item.gambar ||
                                      (Array.isArray(item.foto) && item.foto[0]) ||
                                      "/images/lapangan/padel/padel01/padel1.jpeg"
                                    }
                                    alt={item.nama}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-[var(--text-main)]">
                                    {item.nama}
                                  </p>
                                  <p className="text-[11px] text-[var(--text-muted)]">
                                    ID: #{item.id} • {item.foto?.length || 1} Foto
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* KATEGORI */}
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-[160px]">
                                {kategoriArray.map((kat) => (
                                  <span
                                    key={kat}
                                    className="px-2 py-0.5 rounded-full bg-soft-mint dark:bg-white/5 text-primary text-[10px] font-bold"
                                  >
                                    {kat}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* LOKASI */}
                            <td className="p-4 max-w-[220px]">
                              <p className="font-semibold text-[var(--text-main)] truncate">
                                {item.lokasi}
                              </p>
                              <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                                {item.alamat}
                              </p>
                            </td>

                            {/* HARGA */}
                            <td className="p-4 whitespace-nowrap">
                              <span className="font-bold text-primary">
                                Rp {Number(item.harga || 0).toLocaleString("id-ID")}
                              </span>
                            </td>

                            {/* KONTAK */}
                            <td className="p-4 whitespace-nowrap">
                              {item.kontak ? (
                                <a
                                  href={`https://wa.me/${String(item.kontak).replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:underline font-semibold"
                                >
                                  💬 {item.kontak}
                                </a>
                              ) : (
                                <span className="text-[var(--text-muted)]">-</span>
                              )}
                            </td>

                            {/* AKSI */}
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <Link
                                  href={`/lapangan/${item.id}`}
                                  target="_blank"
                                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] hover:bg-emerald-500/10 text-primary border border-[var(--border-main)] font-semibold transition"
                                  title="Lihat Halaman Publik"
                                >
                                  👁️ Lihat
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => setDeleteModalVenue(item)}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 font-semibold transition"
                                  title="Hapus Venue"
                                >
                                  🗑️ Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-10 text-center text-sm text-[var(--text-muted)]"
                        >
                          {searchDaftar
                            ? `Tidak ada venue yang cocok dengan pencarian "${searchDaftar}".`
                            : "Belum ada data lapangan di database."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteModalVenue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="liquid-info-card max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center text-2xl mx-auto">
              🗑️
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                Hapus Lapangan Ini?
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Apakah Anda yakin ingin menghapus venue{" "}
                <strong>{deleteModalVenue.nama}</strong> (ID #{deleteModalVenue.id}) dari database?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-soft)]">
              <button
                type="button"
                onClick={() => setDeleteModalVenue(null)}
                disabled={deletingId !== null}
                className="px-4 py-2 rounded-xl border border-[var(--border-main)] text-xs font-bold hover:bg-[var(--bg-main)] transition"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDeleteVenue}
                disabled={deletingId !== null}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-lg flex items-center gap-2"
              >
                {deletingId ? "Menghapus..." : "Ya, Hapus Lapangan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

