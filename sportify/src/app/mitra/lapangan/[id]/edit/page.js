"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/api";

const kategoriOptions = [
    "Padel",
    "Tennis",
    "Badminton",
    "Mini Soccer",
];

const fasilitasOptions = [
    "Parkir Mobil",
    "Parkir Motor",
    "Toilet",
    "Ruang Ganti",
    "Shower",
    "Mushola",
    "Kantin",
    "Jual Minuman",
    "WiFi",
    "Tribun Penonton",
    "Loker",
    "AC",
    "Hot Shower",
];

const permukaanOptions = [
    "Vinyl",
    "Interlock",
    "Rumput Sintetis",
    "Beton",
    "Kayu",
    "Akrilik",
    "Pasir",
    "Lainnya",
];

// =========================================
// HELPER JADWAL KHUSUS
// =========================================

const buatJadwalKhusus = () => ({
    id: `jadwal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tanggal: "",
    buka: "08:00",
    tutup: "22:00",
    tutupHari: false,
    keterangan: "",
});

const normalisasiJadwalKhusus = (jadwal) => {
    if (!Array.isArray(jadwal)) {
        return [];
    }

    return jadwal.map((item, index) => ({
        id:
            item.id ||
            `jadwal-${Date.now()}-${index}`,
        tanggal: item.tanggal
            ? String(item.tanggal).slice(0, 10)
            : "",
        buka: item.buka || "08:00",
        tutup: item.tutup || "22:00",
        tutupHari: Boolean(item.tutupHari),
        keterangan: item.keterangan || "",
    }));
};

const initialForm = {
    nama: "",
    lokasi: "",
    alamat: "",
    mapsUrl: "",
    kategori: [],
    harga: "",
    fasilitas: [],
    deskripsi: "",
    gambar: "",
    foto: ["", "", "", "", ""],
    unitLapangan: [],
};

const buatUnitBaru = (nomor) => ({
    id: `unit-${Date.now()}-${nomor}`,
    nama: `Area ${nomor}`,
    tipeLapangan: "",
    jenisPermukaan: "",
    gambar: "",
    jadwalKhusus: [],
});

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#27A36B] focus:ring-2 focus:ring-[#27A36B]/10 dark:border-white/10 dark:bg-[#111A15] dark:text-white";

const labelClass =
    "mb-2 block text-sm font-semibold text-[#202B25] dark:text-gray-200";

const sectionClass =
    "rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1B2921]";

export default function EditLapanganPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id;

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================
    // AMBIL DATA LAPANGAN
    // =========================================

    useEffect(() => {
        const fetchLapangan = async () => {
            try {
                const result = await apiRequest(
                    `/mitra/lapangan/${encodeURIComponent(id)}`
                );

                const venue = result.data || result.venue;

                if (!venue) {
                    throw new Error("Data lapangan tidak ditemukan.");
                }

                let units = [];

                if (
                    Array.isArray(venue.unitLapangan) &&
                    venue.unitLapangan.length > 0
                ) {
                    units = venue.unitLapangan.map((unit, index) => ({
                        id: unit.id || `unit-${Date.now()}-${index}`,
                        nama: unit.nama || `Area ${index + 1}`,
                        tipeLapangan: unit.tipeLapangan || "",
                        jenisPermukaan: unit.jenisPermukaan || "",
                        gambar: unit.gambar || "",
                        jadwalKhusus: normalisasiJadwalKhusus(
                            unit.jadwalKhusus
                        ),
                    }));
                } else {
                    units = [
                        {
                            id: `unit-${Date.now()}-1`,
                            nama: "Area 1",
                            tipeLapangan: venue.tipeLapangan || "",
                            jenisPermukaan: venue.jenisPermukaan || "",
                            gambar: "",
                            jadwalKhusus: [],
                        },
                    ];
                }

                setForm({
                    ...initialForm,

                    nama: venue.nama || "",
                    lokasi: venue.lokasi || "",
                    alamat: venue.alamat || "",
                    mapsUrl: venue.mapsUrl || "",

                    kategori: Array.isArray(venue.kategori)
                        ? venue.kategori
                        : venue.kategori
                            ? [venue.kategori]
                            : [],

                    harga: venue.harga ?? "",

                    fasilitas: Array.isArray(venue.fasilitas)
                        ? venue.fasilitas
                        : [],

                    deskripsi: venue.deskripsi || "",
                    gambar: venue.gambar || "",

                    foto: Array.isArray(venue.foto)
                        ? [
                            ...venue.foto,
                            ...Array(
                                Math.max(0, 5 - venue.foto.length)
                            ).fill(""),
                        ].slice(0, 5)
                        : ["", "", "", "", ""],

                    unitLapangan: units,
                });
            } catch (err) {
                setError(
                    err.message || "Gagal mengambil data lapangan."
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchLapangan();
        }
    }, [id]);

    // =========================================
    // HANDLE INPUT VENUE
    // =========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================================
    // HANDLE KATEGORI DAN FASILITAS
    // =========================================

    const handleArrayChange = (field, value) => {
        setForm((prev) => {
            const current = prev[field];

            return {
                ...prev,
                [field]: current.includes(value)
                    ? current.filter((item) => item !== value)
                    : [...current, value],
            };
        });
    };

    // =========================================
    // HANDLE FOTO VENUE
    // =========================================

    const handlePhotoChange = (index, value) => {
        setForm((prev) => {
            const updatedPhotos = [...prev.foto];

            updatedPhotos[index] = value;

            return {
                ...prev,
                foto: updatedPhotos,
            };
        });
    };

    // =========================================
    // HANDLE UNIT LAPANGAN
    // =========================================

    const tambahUnit = () => {
        setForm((prev) => ({
            ...prev,
            unitLapangan: [
                ...prev.unitLapangan,
                buatUnitBaru(prev.unitLapangan.length + 1),
            ],
        }));
    };

    const hapusUnit = (index) => {
        if (form.unitLapangan.length <= 1) {
            setError("Minimal harus ada satu unit lapangan.");
            return;
        }

        setForm((prev) => ({
            ...prev,
            unitLapangan: prev.unitLapangan.filter(
                (_, i) => i !== index
            ),
        }));

        setError("");
    };

    const handleUnitChange = (index, field, value) => {
        setForm((prev) => {
            const updatedUnits = [...prev.unitLapangan];

            updatedUnits[index] = {
                ...updatedUnits[index],
                [field]: value,
            };

            return {
                ...prev,
                unitLapangan: updatedUnits,
            };
        });
    };

    // =========================================
    // HANDLE JADWAL KHUSUS
    // =========================================

    const tambahJadwalKhusus = (unitId) => {
        setForm((prev) => ({
            ...prev,

            unitLapangan: prev.unitLapangan.map((unit) => {
                if (unit.id !== unitId) {
                    return unit;
                }

                return {
                    ...unit,
                    jadwalKhusus: [
                        ...(unit.jadwalKhusus || []),
                        buatJadwalKhusus(),
                    ],
                };
            }),
        }));

        setError("");
    };

    const updateJadwalKhusus = (
        unitId,
        jadwalId,
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,

            unitLapangan: prev.unitLapangan.map((unit) => {
                if (unit.id !== unitId) {
                    return unit;
                }

                return {
                    ...unit,

                    jadwalKhusus: unit.jadwalKhusus.map(
                        (jadwal) => {
                            if (jadwal.id !== jadwalId) {
                                return jadwal;
                            }

                            return {
                                ...jadwal,
                                [field]: value,
                            };
                        }
                    ),
                };
            }),
        }));
    };

    const hapusJadwalKhusus = (unitId, jadwalId) => {
        setForm((prev) => ({
            ...prev,

            unitLapangan: prev.unitLapangan.map((unit) => {
                if (unit.id !== unitId) {
                    return unit;
                }

                return {
                    ...unit,
                    jadwalKhusus: unit.jadwalKhusus.filter(
                        (jadwal) => jadwal.id !== jadwalId
                    ),
                };
            }),
        }));
    };

    // =========================================
    // HANDLE FOTO UNIT
    // =========================================

    const handleUnitPhoto = (index, file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("File foto unit harus berupa gambar.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Ukuran foto unit maksimal 5 MB.");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            handleUnitChange(
                index,
                "gambar",
                reader.result
            );
        };

        reader.onerror = () => {
            setError("Gagal membaca foto unit.");
        };

        reader.readAsDataURL(file);

        setError("");
    };

    // =========================================
    // VALIDASI FORM
    // =========================================

    const validateForm = () => {
        if (!form.nama.trim()) {
            return "Nama venue wajib diisi.";
        }

        if (!form.lokasi.trim()) {
            return "Kota atau lokasi wajib diisi.";
        }

        if (!form.alamat.trim()) {
            return "Alamat lengkap wajib diisi.";
        }

        if (form.kategori.length === 0) {
            return "Pilih minimal satu kategori olahraga.";
        }

        if (!form.harga || Number(form.harga) <= 0) {
            return "Harga lapangan harus lebih dari 0.";
        }

        if (form.mapsUrl.trim()) {
            try {
                new URL(form.mapsUrl);
            } catch {
                return "Link Google Maps tidak valid.";
            }
        }

        if (form.unitLapangan.length === 0) {
            return "Minimal harus ada satu unit lapangan.";
        }

        for (let i = 0; i < form.unitLapangan.length; i++) {
            const unit = form.unitLapangan[i];

            if (!unit.nama.trim()) {
                return `Nama Unit ${i + 1} wajib diisi.`;
            }

            if (!unit.tipeLapangan) {
                return `Pilih tipe lapangan untuk ${unit.nama}.`;
            }

            if (!unit.jenisPermukaan) {
                return `Pilih jenis permukaan untuk ${unit.nama}.`;
            }

            const daftarTanggal = [];

            for (const jadwal of unit.jadwalKhusus || []) {
                if (!jadwal.tanggal) {
                    return `Tanggal jadwal khusus untuk ${unit.nama} wajib diisi.`;
                }

                if (daftarTanggal.includes(jadwal.tanggal)) {
                    return `Tanggal ${jadwal.tanggal} tidak boleh dimasukkan lebih dari satu kali pada ${unit.nama}.`;
                }

                daftarTanggal.push(jadwal.tanggal);

                if (!jadwal.tutupHari) {
                    if (!jadwal.buka || !jadwal.tutup) {
                        return `Lengkapi jam operasional tanggal ${jadwal.tanggal} untuk ${unit.nama}.`;
                    }

                    if (jadwal.tutup <= jadwal.buka) {
                        return `Jam tutup harus lebih besar dari jam buka pada ${jadwal.tanggal} untuk ${unit.nama}.`;
                    }
                }
            }
        }

        return null;
    };

    // =========================================
    // SIMPAN PERUBAHAN
    // =========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }

        setSaving(true);

        try {
            const unitData = form.unitLapangan.map((unit) => ({
                id: unit.id,
                nama: unit.nama.trim(),
                tipeLapangan: unit.tipeLapangan,
                jenisPermukaan: unit.jenisPermukaan,
                gambar: unit.gambar || "",

                jadwalKhusus: (unit.jadwalKhusus || [])
                    .map((jadwal) => ({
                        id: jadwal.id,
                        tanggal: jadwal.tanggal,

                        buka: jadwal.tutupHari
                            ? null
                            : jadwal.buka,

                        tutup: jadwal.tutupHari
                            ? null
                            : jadwal.tutup,

                        tutupHari: Boolean(jadwal.tutupHari),

                        keterangan: jadwal.keterangan.trim(),
                    }))
                    .sort((a, b) =>
                        a.tanggal.localeCompare(b.tanggal)
                    ),
            }));

            const payload = {
                nama: form.nama.trim(),
                lokasi: form.lokasi.trim(),
                alamat: form.alamat.trim(),
                mapsUrl: form.mapsUrl.trim(),

                kategori: form.kategori,

                harga: Number(form.harga),

                fasilitas: form.fasilitas,

                deskripsi: form.deskripsi.trim(),

                gambar: form.gambar.trim(),

                foto: form.foto.filter(
                    (item) => item.trim() !== ""
                ),

                unitLapangan: unitData,
            };

            const result = await apiRequest(
                `/mitra/lapangan/${encodeURIComponent(id)}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payload),
                }
            );

            if (result.success === false) {
                throw new Error(
                    result.message ||
                    "Gagal memperbarui lapangan."
                );
            }

            setSuccess("Data lapangan berhasil diperbarui!");

            setTimeout(() => {
                router.push("/mitra/lapangan");
                router.refresh();
            }, 1200);
        } catch (err) {
            setError(
                err.message ||
                "Terjadi kesalahan saat menyimpan."
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } finally {
            setSaving(false);
        }
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-[#F7F9F7] px-4 py-24 text-center dark:bg-[#111A15]">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#146B45]/20 border-t-[#146B45]" />

                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Memuat data lapangan...
                    </p>
                </main>

                <Footer />
            </>
        );
    }

    // =========================================
    // DATA TIDAK DITEMUKAN
    // =========================================

    if (error && !form.nama) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-[#F7F9F7] px-4 py-24 dark:bg-[#111A15]">
                    <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-[#1B2921]">
                        <div className="text-4xl">!</div>

                        <h1 className="mt-4 text-xl font-bold text-[#202B25] dark:text-white">
                            Lapangan Tidak Ditemukan
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {error}
                        </p>

                        <Link
                            href="/mitra/lapangan"
                            className="mt-6 inline-flex rounded-xl bg-[#146B45] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#105638]"
                        >
                            Kembali ke Kelola Lapangan
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    // =========================================
    // HALAMAN EDIT LAPANGAN
    // =========================================

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F7F9F7] px-4 py-10 dark:bg-[#111A15]">
                <div className="mx-auto max-w-5xl">

                    {/* HEADER */}

                    <div className="mb-8">
                        <Link
                            href="/mitra/lapangan"
                            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#146B45] transition hover:text-[#27A36B] dark:text-[#B7E34A]"
                        >
                            <span>&lt;</span>
                            Kembali ke Kelola Lapangan
                        </Link>

                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#27A36B]">
                                MITRA SPORTIFY
                            </span>

                            <h1 className="mt-2 text-3xl font-bold text-[#202B25] dark:text-white md:text-4xl">
                                Edit Lapangan
                            </h1>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Perbarui informasi venue dan setiap unit lapangan olahraga kamu.
                            </p>
                        </div>
                    </div>

                    {/* ALERT */}

                    {error && (
                        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* INFORMASI UTAMA */}

                        <section className={sectionClass}>
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-[#202B25] dark:text-white">
                                    Informasi Venue
                                </h2>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Informasi dasar mengenai tempat olahraga.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>
                                        Nama Venue *
                                    </label>

                                    <input
                                        type="text"
                                        name="nama"
                                        value={form.nama}
                                        onChange={handleChange}
                                        placeholder="Contoh: Unity Sports Center"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>
                                            Kota / Lokasi *
                                        </label>

                                        <input
                                            type="text"
                                            name="lokasi"
                                            value={form.lokasi}
                                            onChange={handleChange}
                                            placeholder="Contoh: Semarang"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Harga per Sesi (Rp) *
                                        </label>

                                        <input
                                            type="number"
                                            name="harga"
                                            min="1"
                                            value={form.harga}
                                            onChange={handleChange}
                                            placeholder="160000"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Alamat Lengkap *
                                    </label>

                                    <textarea
                                        name="alamat"
                                        value={form.alamat}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Masukkan alamat lengkap venue..."
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Link Google Maps
                                    </label>

                                    <input
                                        type="url"
                                        name="mapsUrl"
                                        value={form.mapsUrl}
                                        onChange={handleChange}
                                        placeholder="https://maps.app.goo.gl/..."
                                        className={inputClass}
                                    />

                                    <p className="mt-2 text-xs text-gray-400">
                                        Masukkan link lokasi Google Maps venue.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* KATEGORI OLAHRAGA */}

                        <section className={sectionClass}>
                            <h2 className="text-lg font-bold text-[#202B25] dark:text-white">
                                Kategori Olahraga
                            </h2>

                            <p className="mb-5 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Pilih semua jenis olahraga yang tersedia.
                            </p>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {kategoriOptions.map((kategori) => {
                                    const selected =
                                        form.kategori.includes(kategori);

                                    return (
                                        <button
                                            key={kategori}
                                            type="button"
                                            onClick={() =>
                                                handleArrayChange(
                                                    "kategori",
                                                    kategori
                                                )
                                            }
                                            className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${selected
                                                    ? "border-[#146B45] bg-[#EAF5EF] text-[#146B45] dark:border-[#27A36B] dark:bg-[#146B45]/20 dark:text-[#B7E34A]"
                                                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-[#27A36B] dark:border-white/10 dark:bg-[#111A15] dark:text-gray-300"
                                                }`}
                                        >
                                            {selected ? "✓ " : ""}
                                            {kategori}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* UNIT LAPANGAN DAN JADWAL KHUSUS */}

                        <section className={sectionClass}>
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-[#202B25] dark:text-white">
                                        Unit Lapangan
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Atur informasi, foto, dan jadwal khusus setiap unit.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={tambahUnit}
                                    className="rounded-xl bg-[#146B45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#105638]"
                                >
                                    + Tambah Unit
                                </button>
                            </div>

                            <div className="space-y-6">
                                {form.unitLapangan.map((unit, index) => (
                                    <div
                                        key={unit.id || index}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-[#111A15]"
                                    >
                                        {/* HEADER UNIT */}

                                        <div className="mb-5 flex items-center justify-between gap-3">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-[#27A36B]">
                                                    UNIT LAPANGAN {index + 1}
                                                </span>

                                                <h3 className="mt-1 text-lg font-bold text-[#202B25] dark:text-white">
                                                    {unit.nama || `Area ${index + 1}`}
                                                </h3>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => hapusUnit(index)}
                                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                                            >
                                                Hapus Unit
                                            </button>
                                        </div>

                                        <div className="space-y-5">

                                            {/* NAMA UNIT */}

                                            <div>
                                                <label className={labelClass}>
                                                    Nama Unit *
                                                </label>

                                                <input
                                                    type="text"
                                                    value={unit.nama}
                                                    onChange={(e) =>
                                                        handleUnitChange(
                                                            index,
                                                            "nama",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Contoh: Area 1"
                                                    className={inputClass}
                                                />
                                            </div>

                                            {/* TIPE DAN PERMUKAAN */}

                                            <div className="grid gap-5 md:grid-cols-2">
                                                <div>
                                                    <label className={labelClass}>
                                                        Tipe Lapangan *
                                                    </label>

                                                    <select
                                                        value={unit.tipeLapangan}
                                                        onChange={(e) =>
                                                            handleUnitChange(
                                                                index,
                                                                "tipeLapangan",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">
                                                            Pilih tipe lapangan
                                                        </option>

                                                        <option value="Indoor">
                                                            Indoor
                                                        </option>

                                                        <option value="Outdoor">
                                                            Outdoor
                                                        </option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className={labelClass}>
                                                        Jenis Permukaan *
                                                    </label>

                                                    <select
                                                        value={unit.jenisPermukaan}
                                                        onChange={(e) =>
                                                            handleUnitChange(
                                                                index,
                                                                "jenisPermukaan",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">
                                                            Pilih permukaan
                                                        </option>

                                                        {permukaanOptions.map(
                                                            (item) => (
                                                                <option
                                                                    key={item}
                                                                    value={item}
                                                                >
                                                                    {item}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* FOTO UNIT */}

                                            <div>
                                                <label className={labelClass}>
                                                    Foto Unit
                                                </label>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        handleUnitPhoto(
                                                            index,
                                                            e.target.files?.[0]
                                                        )
                                                    }
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#EAF5EF] file:px-4 file:py-2 file:font-semibold file:text-[#146B45] dark:border-white/10 dark:bg-[#1B2921] dark:text-gray-300"
                                                />

                                                <p className="mt-2 text-xs text-gray-400">
                                                    Pilih foto dari laptop. Maksimal 5 MB.
                                                </p>

                                                {unit.gambar && (
                                                    <img
                                                        src={unit.gambar}
                                                        alt={`Foto ${unit.nama}`}
                                                        className="mt-3 h-44 w-full rounded-xl object-cover sm:w-72"
                                                    />
                                                )}
                                            </div>

                                            {/* JADWAL KHUSUS */}

                                            <div className="border-t border-gray-200 pt-5 dark:border-white/10">
                                                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-[#202B25] dark:text-white">
                                                            Jadwal Khusus
                                                        </h4>

                                                        <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                                            Atur jam operasional atau hari libur khusus berdasarkan tanggal untuk unit ini.
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            tambahJadwalKhusus(unit.id)
                                                        }
                                                        className="rounded-xl bg-[#146B45] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#105638]"
                                                    >
                                                        + Tambah Jadwal
                                                    </button>
                                                </div>

                                                {(!unit.jadwalKhusus ||
                                                    unit.jadwalKhusus.length === 0) ? (
                                                    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center dark:border-white/20 dark:bg-[#1B2921]">
                                                        <div className="text-3xl">
                                                            📅
                                                        </div>

                                                        <p className="mt-3 text-sm font-semibold text-[#202B25] dark:text-white">
                                                            Belum ada jadwal khusus
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                            Tambahkan tanggal untuk mengatur jam operasional atau hari libur unit ini.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {unit.jadwalKhusus
                                                            .map((jadwal) => (
                                                                <div
                                                                    key={jadwal.id}
                                                                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#1B2921]"
                                                                >
                                                                    <div className="mb-4 flex items-center justify-between gap-3">
                                                                        <span className="text-xs font-bold uppercase tracking-wider text-[#27A36B]">
                                                                            JADWAL TANGGAL KHUSUS
                                                                        </span>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                hapusJadwalKhusus(
                                                                                    unit.id,
                                                                                    jadwal.id
                                                                                )
                                                                            }
                                                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                                                                        >
                                                                            Hapus
                                                                        </button>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <label className={labelClass}>
                                                                                Tanggal *
                                                                            </label>

                                                                            <input
                                                                                type="date"
                                                                                value={jadwal.tanggal}
                                                                                onChange={(e) =>
                                                                                    updateJadwalKhusus(
                                                                                        unit.id,
                                                                                        jadwal.id,
                                                                                        "tanggal",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                className={inputClass}
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-[#111A15]">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={!jadwal.tutupHari}
                                                                                    onChange={(e) =>
                                                                                        updateJadwalKhusus(
                                                                                            unit.id,
                                                                                            jadwal.id,
                                                                                            "tutupHari",
                                                                                            !e.target.checked
                                                                                        )
                                                                                    }
                                                                                    className="h-4 w-4 accent-[#146B45]"
                                                                                />

                                                                                <span className="text-sm font-semibold text-[#202B25] dark:text-white">
                                                                                    Unit buka pada tanggal ini
                                                                                </span>
                                                                            </label>
                                                                        </div>

                                                                        {jadwal.tutupHari ? (
                                                                            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-300">
                                                                                Unit tutup / libur pada tanggal ini.
                                                                            </div>
                                                                        ) : (
                                                                            <div className="grid gap-4 sm:grid-cols-2">
                                                                                <div>
                                                                                    <label className={labelClass}>
                                                                                        Jam Buka
                                                                                    </label>

                                                                                    <input
                                                                                        type="time"
                                                                                        value={jadwal.buka}
                                                                                        onChange={(e) =>
                                                                                            updateJadwalKhusus(
                                                                                                unit.id,
                                                                                                jadwal.id,
                                                                                                "buka",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        className={inputClass}
                                                                                    />
                                                                                </div>

                                                                                <div>
                                                                                    <label className={labelClass}>
                                                                                        Jam Tutup
                                                                                    </label>

                                                                                    <input
                                                                                        type="time"
                                                                                        value={jadwal.tutup}
                                                                                        onChange={(e) =>
                                                                                            updateJadwalKhusus(
                                                                                                unit.id,
                                                                                                jadwal.id,
                                                                                                "tutup",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        className={inputClass}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div>
                                                                            <label className={labelClass}>
                                                                                Keterangan
                                                                            </label>

                                                                            <input
                                                                                type="text"
                                                                                value={jadwal.keterangan}
                                                                                onChange={(e) =>
                                                                                    updateJadwalKhusus(
                                                                                        unit.id,
                                                                                        jadwal.id,
                                                                                        "keterangan",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                placeholder="Contoh: Libur acara khusus atau jam operasional berubah"
                                                                                className={inputClass}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FASILITAS */}

                        <section className={sectionClass}>
                            <h2 className="text-lg font-bold text-[#202B25] dark:text-white">
                                Fasilitas Venue
                            </h2>

                            <p className="mb-5 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Pilih fasilitas yang tersedia di venue.
                            </p>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {fasilitasOptions.map((fasilitas) => {
                                    const selected =
                                        form.fasilitas.includes(fasilitas);

                                    return (
                                        <button
                                            key={fasilitas}
                                            type="button"
                                            onClick={() =>
                                                handleArrayChange(
                                                    "fasilitas",
                                                    fasilitas
                                                )
                                            }
                                            className={`rounded-xl border px-3 py-3 text-left text-sm transition ${selected
                                                    ? "border-[#146B45] bg-[#EAF5EF] font-semibold text-[#146B45] dark:border-[#27A36B] dark:bg-[#146B45]/20 dark:text-[#B7E34A]"
                                                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-[#27A36B] dark:border-white/10 dark:bg-[#111A15] dark:text-gray-300"
                                                }`}
                                        >
                                            {selected ? "✓ " : "+ "}
                                            {fasilitas}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* DESKRIPSI */}

                        <section className={sectionClass}>
                            <h2 className="text-lg font-bold text-[#202B25] dark:text-white">
                                Deskripsi Venue
                            </h2>

                            <textarea
                                name="deskripsi"
                                value={form.deskripsi}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Ceritakan fasilitas, keunggulan, dan informasi venue..."
                                className={`${inputClass} mt-5 resize-none`}
                            />
                        </section>

                        {/* FOTO VENUE */}

                        <section className={sectionClass}>
                            <h2 className="text-lg font-bold text-[#202B25] dark:text-white">
                                Foto Venue
                            </h2>

                            <p className="mb-5 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Perbarui URL foto utama dan maksimal lima foto tambahan.
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>
                                        URL Foto Utama
                                    </label>

                                    <input
                                        type="url"
                                        name="gambar"
                                        value={form.gambar}
                                        onChange={handleChange}
                                        placeholder="https://example.com/foto-utama.jpg"
                                        className={inputClass}
                                    />

                                    {form.gambar && (
                                        <img
                                            src={form.gambar}
                                            alt="Preview foto utama"
                                            className="mt-3 h-40 w-full rounded-xl object-cover sm:w-64"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {form.foto.map((foto, index) => (
                                        <div key={index}>
                                            <label className={labelClass}>
                                                Foto Tambahan {index + 1}
                                            </label>

                                            <input
                                                type="url"
                                                value={foto}
                                                onChange={(e) =>
                                                    handlePhotoChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="https://example.com/foto.jpg"
                                                className={inputClass}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* TOMBOL */}

                        <div className="flex flex-col-reverse gap-3 pb-10 sm:flex-row sm:justify-end">
                            <Link
                                href="/mitra/lapangan"
                                className="rounded-xl border border-gray-200 bg-white px-7 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#1B2921] dark:text-gray-300"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#146B45] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#146B45]/20 transition hover:bg-[#105638] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Menyimpan Perubahan..."
                                    : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    );
}