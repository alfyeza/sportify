"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

const kategoriOlahraga = [
    "Padel",
    "Tennis",
    "Badminton",
    "Mini Soccer",
];

const daftarFasilitas = [
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

const jenisPermukaan = [
    "Vinyl",
    "Interlock",
    "Rumput Sintetis",
    "Beton",
    "Kayu",
    "Akrilik",
    "Pasir",
    "Lainnya",
];

const daftarHari = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
];

const terjemahanHari = {
    Senin: "Monday",
    Selasa: "Tuesday",
    Rabu: "Wednesday",
    Kamis: "Thursday",
    Jumat: "Friday",
    Sabtu: "Saturday",
    Minggu: "Sunday",
};

const buatJadwalMingguan = () =>
    daftarHari.map((hari) => ({
        hari,
        buka: "08:00",
        tutup: "22:00",
        tutupHari: false,
    }));

const buatUnitBaru = (nomor) => ({
    id: `${Date.now()}-${nomor}`,
    nama: `Area ${nomor}`,
    tipeLapangan: "",
    jenisPermukaan: "",
    gambarFile: null,
    gambarPreview: "",
    jadwalMingguan: buatJadwalMingguan(),
});

const initialForm = {
    nama: "",
    lokasi: "",
    alamat: "",
    mapsUrl: "",
    kategori: [],
    harga: "",
    fasilitas: [],
    deskripsi: "",
};

const bacaFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = () =>
            reject(new Error("Gagal membaca file gambar."));

        reader.readAsDataURL(file);
    });
};

export default function TambahLapanganPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [form, setForm] = useState(initialForm);

    // Foto utama
    const [gambarUtama, setGambarUtama] = useState(null);
    const [previewUtama, setPreviewUtama] = useState("");

    // Foto galeri
    const [fotoTambahan, setFotoTambahan] = useState([]);
    const [previewFoto, setPreviewFoto] = useState([]);

    // Unit lapangan
    const [unitLapangan, setUnitLapangan] = useState([
        buatUnitBaru(1),
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const inputClass =
        "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#202B25] outline-none transition placeholder:text-gray-400 focus:border-[#146B45] focus:ring-2 focus:ring-[#146B45]/10 dark:border-white/10 dark:bg-white/5 dark:text-white";

    const labelClass =
        "mb-2 block text-sm font-semibold text-[#202B25] dark:text-gray-200";

    const sectionClass =
        "rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-7";

    // UPDATE FORM
    const updateForm = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    // KATEGORI
    const toggleKategori = (kategori) => {
        setForm((previous) => ({
            ...previous,
            kategori: previous.kategori.includes(kategori)
                ? previous.kategori.filter((item) => item !== kategori)
                : [...previous.kategori, kategori],
        }));
    };

    // FASILITAS
    const toggleFasilitas = (fasilitas) => {
        setForm((previous) => ({
            ...previous,
            fasilitas: previous.fasilitas.includes(fasilitas)
                ? previous.fasilitas.filter(
                    (item) => item !== fasilitas
                )
                : [...previous.fasilitas, fasilitas],
        }));
    };

    // FOTO UTAMA
    const handleGambarUtama = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("File harus berupa gambar.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Ukuran foto utama maksimal 5 MB.");
            event.target.value = "";
            return;
        }

        setError("");
        setGambarUtama(file);
        setPreviewUtama(URL.createObjectURL(file));
    };

    // FOTO GALERI
    const handleFotoTambahan = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length > 5) {
            setError("Maksimal pilih 5 foto tambahan.");
            event.target.value = "";
            return;
        }

        if (files.some((file) => !file.type.startsWith("image/"))) {
            setError("Semua file harus berupa gambar.");
            event.target.value = "";
            return;
        }

        if (files.some((file) => file.size > 5 * 1024 * 1024)) {
            setError("Ukuran setiap foto maksimal 5 MB.");
            event.target.value = "";
            return;
        }

        setError("");
        setFotoTambahan(files);

        setPreviewFoto(
            files.map((file) => URL.createObjectURL(file))
        );
    };

    const hapusFotoTambahan = (index) => {
        setFotoTambahan((previous) =>
            previous.filter((_, i) => i !== index)
        );

        setPreviewFoto((previous) =>
            previous.filter((_, i) => i !== index)
        );
    };

    // UNIT LAPANGAN
    const tambahUnit = () => {
        setUnitLapangan((previous) => [
            ...previous,
            buatUnitBaru(previous.length + 1),
        ]);
    };

    const hapusUnit = (id) => {
        setUnitLapangan((previous) =>
            previous.filter((unit) => unit.id !== id)
        );
    };

    const updateUnit = (id, field, value) => {
        setUnitLapangan((previous) =>
            previous.map((unit) =>
                unit.id === id
                    ? { ...unit, [field]: value }
                    : unit
            )
        );
    };

    // UPDATE JADWAL MINGGUAN UNIT
    const updateJadwalUnit = (unitId, hari, field, value) => {
        setUnitLapangan((previous) =>
            previous.map((unit) => {
                if (unit.id !== unitId) return unit;

                return {
                    ...unit,
                    jadwalMingguan: unit.jadwalMingguan.map(
                        (jadwal) =>
                            jadwal.hari === hari
                                ? {
                                    ...jadwal,
                                    [field]: value,
                                }
                                : jadwal
                    ),
                };
            })
        );
    };

    // FOTO UNIT
    const handleFotoUnit = (id, event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("File unit harus berupa gambar.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Ukuran foto unit maksimal 5 MB.");
            event.target.value = "";
            return;
        }

        setError("");

        updateUnit(id, "gambarFile", file);

        updateUnit(
            id,
            "gambarPreview",
            URL.createObjectURL(file)
        );
    };

    // VALIDASI JADWAL
    const validasiJadwal = () => {
        for (const unit of unitLapangan) {
            if (!Array.isArray(unit.jadwalMingguan)) {
                setError(
                    `Jadwal operasional ${unit.nama} belum tersedia.`
                );
                return false;
            }

            for (const jadwal of unit.jadwalMingguan) {
                if (jadwal.tutupHari) continue;

                if (!jadwal.buka || !jadwal.tutup) {
                    setError(
                        `Lengkapi jam operasional ${unit.nama} pada hari ${jadwal.hari}.`
                    );
                    return false;
                }

                if (jadwal.tutup <= jadwal.buka) {
                    setError(
                        `Jam tutup harus lebih besar daripada jam buka untuk ${unit.nama} pada hari ${jadwal.hari}.`
                    );
                    return false;
                }
            }
        }

        return true;
    };

    // VALIDASI DAN SUBMIT
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.nama.trim()) {
            setError("Nama venue wajib diisi.");
            return;
        }

        if (!form.lokasi.trim()) {
            setError("Kota atau lokasi venue wajib diisi.");
            return;
        }

        if (!form.alamat.trim()) {
            setError("Alamat lengkap wajib diisi.");
            return;
        }

        if (form.kategori.length === 0) {
            setError("Pilih minimal satu kategori olahraga.");
            return;
        }

        if (!form.harga || Number(form.harga) <= 0) {
            setError("Harga lapangan harus lebih dari Rp0.");
            return;
        }

        if (
            form.mapsUrl.trim() &&
            !/^https?:\/\/.+/i.test(form.mapsUrl.trim())
        ) {
            setError("Masukkan link Google Maps yang valid.");
            return;
        }

        if (unitLapangan.length === 0) {
            setError("Tambahkan minimal satu unit lapangan.");
            return;
        }

        for (let i = 0; i < unitLapangan.length; i++) {
            const unit = unitLapangan[i];

            if (!unit.nama.trim()) {
                setError(`Nama unit ke-${i + 1} wajib diisi.`);
                return;
            }

            if (!unit.tipeLapangan) {
                setError(
                    `Pilih tipe lapangan untuk ${unit.nama}.`
                );
                return;
            }

            if (!unit.jenisPermukaan) {
                setError(
                    `Pilih permukaan untuk ${unit.nama}.`
                );
                return;
            }
        }

        if (!validasiJadwal()) {
            return;
        }

        setLoading(true);

        try {
            // Mengubah foto menjadi Data URL
            const gambarUtamaData = gambarUtama
                ? await bacaFile(gambarUtama)
                : "";

            const fotoData = await Promise.all(
                fotoTambahan.map((file) => bacaFile(file))
            );

            // DATA UNIT DAN JADWAL
            const unitData = await Promise.all(
                unitLapangan.map(async (unit) => ({
                    id: unit.id,
                    nama: unit.nama.trim(),
                    tipeLapangan: unit.tipeLapangan,
                    jenisPermukaan: unit.jenisPermukaan,

                    gambar: unit.gambarFile
                        ? await bacaFile(unit.gambarFile)
                        : "",

                    jadwalMingguan: unit.jadwalMingguan.map(
                        (jadwal) => ({
                            hari: jadwal.hari,
                            buka: jadwal.tutupHari
                                ? null
                                : jadwal.buka,
                            tutup: jadwal.tutupHari
                                ? null
                                : jadwal.tutup,
                            tutupHari: jadwal.tutupHari,
                        })
                    ),
                }))
            );

            // PAYLOAD VENUE
            const payload = {
                nama: form.nama.trim(),
                lokasi: form.lokasi.trim(),
                alamat: form.alamat.trim(),
                mapsUrl: form.mapsUrl.trim(),

                kategori: form.kategori,

                harga: Number(form.harga),

                fasilitas: form.fasilitas,

                deskripsi: form.deskripsi.trim(),

                gambar: gambarUtamaData || fotoData[0] || "",

                foto: fotoData,

                unitLapangan: unitData,
            };

            const result = await apiRequest(
                "/mitra/lapangan",
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                }
            );

            if (result?.success === false) {
                throw new Error(
                    result.message ||
                    "Gagal menambahkan lapangan."
                );
            }

            setSuccess(
                isEnglish
                    ? "Venue successfully registered!"
                    : "Lapangan berhasil didaftarkan!"
            );

            setTimeout(() => {
                router.push("/mitra/lapangan");
            }, 1200);
        } catch (err) {
            console.error(
                "Gagal mendaftarkan lapangan:",
                err
            );

            setError(
                err.message ||
                (isEnglish
                    ? "Failed to register venue."
                    : "Gagal mendaftarkan lapangan.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F7F9F7] px-4 py-8 text-[#202B25] dark:bg-[#111A15] dark:text-white sm:px-6 lg:px-10">
                <div className="mx-auto max-w-4xl space-y-7">

                    {/* HEADER */}
                    <section>
                        <Link
                            href="/mitra/lapangan"
                            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#146B45] dark:text-gray-400"
                        >
                            &lt;
                            {isEnglish
                                ? "Back to Venue List"
                                : "Kembali ke Daftar Lapangan"}
                        </Link>

                        <span className="rounded-full bg-[#EAF5EF] px-3 py-1.5 text-xs font-semibold text-[#146B45] dark:bg-green-900/30 dark:text-green-400">
                            {isEnglish
                                ? "Partner Area"
                                : "Area Mitra"}
                        </span>

                        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                            {isEnglish
                                ? "Register New Venue"
                                : "Tambah Lapangan"}
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {isEnglish
                                ? "Complete the information below to register your sports venue."
                                : "Lengkapi informasi berikut untuk mendaftarkan venue olahraga milikmu."}
                        </p>
                    </section>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* 01 INFORMASI VENUE */}
                        <section className={sectionClass}>
                            <div className="mb-6">
                                <h2 className="text-lg font-bold">
                                    01. Informasi Venue
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
                                        value={form.nama}
                                        onChange={(e) =>
                                            updateForm(
                                                "nama",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Contoh: Unity Sports Center"
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Kota / Lokasi *
                                    </label>

                                    <input
                                        type="text"
                                        value={form.lokasi}
                                        onChange={(e) =>
                                            updateForm(
                                                "lokasi",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Contoh: Semarang"
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Alamat Lengkap *
                                    </label>

                                    <textarea
                                        rows={3}
                                        value={form.alamat}
                                        onChange={(e) =>
                                            updateForm(
                                                "alamat",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Masukkan alamat lengkap venue..."
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Google Maps URL
                                    </label>

                                    <input
                                        type="url"
                                        value={form.mapsUrl}
                                        onChange={(e) =>
                                            updateForm(
                                                "mapsUrl",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://maps.app.goo.gl/..."
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 02 KATEGORI */}
                        <section className={sectionClass}>
                            <div className="mb-5">
                                <h2 className="text-lg font-bold">
                                    02. Kategori Olahraga
                                </h2>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Pilih semua jenis olahraga yang tersedia di venue.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {kategoriOlahraga.map((kategori) => {
                                    const selected =
                                        form.kategori.includes(kategori);

                                    return (
                                        <button
                                            key={kategori}
                                            type="button"
                                            onClick={() =>
                                                toggleKategori(kategori)
                                            }
                                            className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${selected
                                                    ? "border-[#146B45] bg-[#EAF5EF] text-[#146B45] dark:border-green-400 dark:bg-green-900/30 dark:text-green-400"
                                                    : "border-gray-200 bg-white text-gray-500 hover:border-[#146B45] dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                                                }`}
                                        >
                                            {selected && "✓ "}
                                            {kategori}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* 03 UNIT LAPANGAN */}
                        <section className={sectionClass}>
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        03. Unit Lapangan
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Atur tipe, permukaan, foto, dan jadwal operasional setiap unit lapangan.
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

                            <div className="space-y-5">
                                {unitLapangan.map((unit, index) => (
                                    <div
                                        key={unit.id}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/[0.03]"
                                    >
                                        {/* HEADER UNIT */}
                                        <div className="mb-5 flex items-center justify-between gap-3">
                                            <div>
                                                <span className="text-xs font-semibold text-[#146B45] dark:text-green-400">
                                                    UNIT {index + 1}
                                                </span>

                                                <h3 className="mt-1 font-bold">
                                                    {unit.nama || `Area ${index + 1}`}
                                                </h3>
                                            </div>

                                            {unitLapangan.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        hapusUnit(unit.id)
                                                    }
                                                    className="rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    Hapus Unit
                                                </button>
                                            )}
                                        </div>

                                        {/* INFORMASI UNIT */}
                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label className={labelClass}>
                                                    Nama Unit *
                                                </label>

                                                <input
                                                    type="text"
                                                    value={unit.nama}
                                                    onChange={(e) =>
                                                        updateUnit(
                                                            unit.id,
                                                            "nama",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Contoh: Area 1 / Court A"
                                                    className={inputClass}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>
                                                    Tipe Lapangan *
                                                </label>

                                                <select
                                                    value={unit.tipeLapangan}
                                                    onChange={(e) =>
                                                        updateUnit(
                                                            unit.id,
                                                            "tipeLapangan",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                >
                                                    <option value="">
                                                        Pilih tipe
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
                                                        updateUnit(
                                                            unit.id,
                                                            "jenisPermukaan",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                >
                                                    <option value="">
                                                        Pilih permukaan
                                                    </option>

                                                    {jenisPermukaan.map(
                                                        (jenis) => (
                                                            <option
                                                                key={jenis}
                                                                value={jenis}
                                                            >
                                                                {jenis}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        {/* 04 JADWAL OPERASIONAL */}
                                        <div className="mt-7 border-t border-gray-200 pt-6 dark:border-white/10">
                                            <div className="mb-5">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-[#202B25] dark:text-white">
                                                        Jadwal Operasional
                                                    </h4>

                                                    <span className="rounded-full bg-[#EAF5EF] px-2.5 py-1 text-[10px] font-bold text-[#146B45] dark:bg-green-900/30 dark:text-green-400">
                                                        PER UNIT
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                                    Atur hari dan jam operasional untuk {unit.nama || `Area ${index + 1}`}.
                                                    Jadwal ini akan menjadi acuan waktu booking penyewa.
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                {unit.jadwalMingguan.map(
                                                    (jadwal) => (
                                                        <div
                                                            key={jadwal.hari}
                                                            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"
                                                        >
                                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                                {/* HARI DAN STATUS */}
                                                                <div className="flex items-center justify-between gap-3 sm:w-40">
                                                                    <span className="text-sm font-semibold">
                                                                        {isEnglish
                                                                            ? terjemahanHari[jadwal.hari]
                                                                            : jadwal.hari}
                                                                    </span>

                                                                    <label className="flex cursor-pointer items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!jadwal.tutupHari}
                                                                            onChange={(e) =>
                                                                                updateJadwalUnit(
                                                                                    unit.id,
                                                                                    jadwal.hari,
                                                                                    "tutupHari",
                                                                                    !e.target.checked
                                                                                )
                                                                            }
                                                                            className="h-4 w-4 accent-[#146B45]"
                                                                        />

                                                                        <span
                                                                            className={`text-xs font-semibold ${jadwal.tutupHari
                                                                                    ? "text-red-500"
                                                                                    : "text-[#146B45] dark:text-green-400"
                                                                                }`}
                                                                        >
                                                                            {jadwal.tutupHari
                                                                                ? isEnglish
                                                                                    ? "Closed"
                                                                                    : "Tutup"
                                                                                : isEnglish
                                                                                    ? "Open"
                                                                                    : "Buka"}
                                                                        </span>
                                                                    </label>
                                                                </div>

                                                                {/* JAM OPERASIONAL */}
                                                                {!jadwal.tutupHari ? (
                                                                    <div className="grid flex-1 grid-cols-2 gap-3">
                                                                        <div>
                                                                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                                                                {isEnglish
                                                                                    ? "Opening Time"
                                                                                    : "Jam Buka"}
                                                                            </label>

                                                                            <input
                                                                                type="time"
                                                                                value={jadwal.buka}
                                                                                onChange={(e) =>
                                                                                    updateJadwalUnit(
                                                                                        unit.id,
                                                                                        jadwal.hari,
                                                                                        "buka",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                className={inputClass}
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                                                                                {isEnglish
                                                                                    ? "Closing Time"
                                                                                    : "Jam Tutup"}
                                                                            </label>

                                                                            <input
                                                                                type="time"
                                                                                value={jadwal.tutup}
                                                                                onChange={(e) =>
                                                                                    updateJadwalUnit(
                                                                                        unit.id,
                                                                                        jadwal.hari,
                                                                                        "tutup",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                className={inputClass}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex-1 rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-medium text-red-500 dark:bg-red-900/10">
                                                                        {isEnglish
                                                                            ? "This unit is closed on this day."
                                                                            : "Unit tidak beroperasi pada hari ini."}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            <div className="mt-4 rounded-xl bg-[#EAF5EF] p-4 dark:bg-green-900/20">
                                                <p className="text-xs leading-relaxed text-[#146B45] dark:text-green-400">
                                                    <strong>Informasi:</strong>{" "}
                                                    {isEnglish
                                                        ? "Customers will only be able to select booking times within this unit's operating hours."
                                                        : "Penyewa nantinya hanya bisa memilih jam booking sesuai jadwal operasional unit ini."}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 05 FOTO UNIT */}
                                        <div className="mt-7 border-t border-gray-200 pt-6 dark:border-white/10">
                                            <label className={labelClass}>
                                                Foto Unit
                                            </label>

                                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 transition hover:border-[#146B45] dark:border-white/20 dark:bg-white/5">
                                                <span className="text-2xl">
                                                    +
                                                </span>

                                                <span className="mt-2 text-sm font-semibold text-[#146B45] dark:text-green-400">
                                                    Pilih Foto Unit
                                                </span>

                                                <span className="mt-1 text-xs text-gray-400">
                                                    JPG, PNG, WEBP - Maksimal 5 MB
                                                </span>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        handleFotoUnit(
                                                            unit.id,
                                                            e
                                                        )
                                                    }
                                                    className="hidden"
                                                />
                                            </label>

                                            {unit.gambarPreview && (
                                                <div className="relative mt-4">
                                                    <img
                                                        src={unit.gambarPreview}
                                                        alt={unit.nama}
                                                        className="h-40 w-full rounded-xl object-cover"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            updateUnit(
                                                                unit.id,
                                                                "gambarFile",
                                                                null
                                                            );

                                                            updateUnit(
                                                                unit.id,
                                                                "gambarPreview",
                                                                ""
                                                            );
                                                        }}
                                                        className="absolute right-3 top-3 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white"
                                                    >
                                                        Hapus Foto
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 04 HARGA DAN FASILITAS */}
                        <section className={sectionClass}>
                            <h2 className="mb-6 text-lg font-bold">
                                04. Harga dan Fasilitas
                            </h2>

                            <div>
                                <label className={labelClass}>
                                    Harga per Sesi (Rupiah) *
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                                        Rp
                                    </span>

                                    <input
                                        type="number"
                                        min="1"
                                        value={form.harga}
                                        onChange={(e) =>
                                            updateForm(
                                                "harga",
                                                e.target.value
                                            )
                                        }
                                        placeholder="160000"
                                        className={`${inputClass} pl-12`}
                                        required
                                    />
                                </div>

                                {form.harga &&
                                    Number(form.harga) > 0 && (
                                        <p className="mt-2 text-xs font-medium text-[#146B45] dark:text-green-400">
                                            {new Intl.NumberFormat(
                                                "id-ID",
                                                {
                                                    style: "currency",
                                                    currency: "IDR",
                                                    maximumFractionDigits: 0,
                                                }
                                            ).format(Number(form.harga))}
                                            /Sesi
                                        </p>
                                    )}
                            </div>

                            <div className="mt-6">
                                <label className={labelClass}>
                                    Fasilitas yang Tersedia
                                </label>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {daftarFasilitas.map(
                                        (fasilitas) => {
                                            const selected =
                                                form.fasilitas.includes(
                                                    fasilitas
                                                );

                                            return (
                                                <label
                                                    key={fasilitas}
                                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${selected
                                                            ? "border-[#146B45] bg-[#EAF5EF] text-[#146B45] dark:border-green-400 dark:bg-green-900/20 dark:text-green-400"
                                                            : "border-gray-200 text-gray-500 hover:border-[#146B45] dark:border-white/10 dark:text-gray-300"
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selected}
                                                        onChange={() =>
                                                            toggleFasilitas(
                                                                fasilitas
                                                            )
                                                        }
                                                        className="accent-[#146B45]"
                                                    />

                                                    {fasilitas}
                                                </label>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 05 FOTO VENUE */}
                        <section className={sectionClass}>
                            <div className="mb-5">
                                <h2 className="text-lg font-bold">
                                    05. Foto Lapangan
                                </h2>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Pilih foto langsung dari Pictures atau folder lainnya di laptop.
                                </p>
                            </div>

                            {/* FOTO UTAMA */}
                            <div>
                                <label className={labelClass}>
                                    Foto Utama
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition hover:border-[#146B45] hover:bg-[#EAF5EF]/50 dark:border-white/20 dark:bg-white/5">
                                    <span className="mb-3 text-4xl">
                                        +
                                    </span>

                                    <span className="text-sm font-semibold text-[#146B45] dark:text-green-400">
                                        Pilih Foto Utama
                                    </span>

                                    <span className="mt-2 text-xs text-gray-400">
                                        JPG, JPEG, PNG, WEBP (Maks. 5 MB)
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleGambarUtama}
                                        className="hidden"
                                    />
                                </label>

                                {previewUtama && (
                                    <div className="relative mt-4">
                                        <img
                                            src={previewUtama}
                                            alt="Preview foto utama"
                                            className="h-56 w-full rounded-2xl object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setGambarUtama(null);
                                                setPreviewUtama("");
                                            }}
                                            className="absolute right-3 top-3 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white"
                                        >
                                            Hapus Foto
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* FOTO GALERI */}
                            <div className="mt-7">
                                <label className={labelClass}>
                                    Foto Galeri (Maksimal 5)
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition hover:border-[#146B45] hover:bg-[#EAF5EF]/50 dark:border-white/20 dark:bg-white/5">
                                    <span className="mb-3 text-4xl">
                                        +
                                    </span>

                                    <span className="text-sm font-semibold text-[#146B45] dark:text-green-400">
                                        Pilih Foto Tambahan
                                    </span>

                                    <span className="mt-2 text-xs text-gray-400">
                                        Bisa memilih beberapa foto sekaligus.
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFotoTambahan}
                                        className="hidden"
                                    />
                                </label>

                                {previewFoto.length > 0 && (
                                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                        {previewFoto.map(
                                            (foto, index) => (
                                                <div
                                                    key={index}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={foto}
                                                        alt={`Foto tambahan ${index + 1}`}
                                                        className="h-36 w-full rounded-xl object-cover"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            hapusFotoTambahan(
                                                                index
                                                            )
                                                        }
                                                        className="absolute right-2 top-2 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 06 DESKRIPSI */}
                        <section className={sectionClass}>
                            <h2 className="mb-5 text-lg font-bold">
                                06. Deskripsi Lapangan
                            </h2>

                            <label className={labelClass}>
                                Deskripsi
                            </label>

                            <textarea
                                rows={5}
                                maxLength={1000}
                                value={form.deskripsi}
                                onChange={(e) =>
                                    updateForm(
                                        "deskripsi",
                                        e.target.value
                                    )
                                }
                                placeholder="Ceritakan keunggulan, suasana, dan informasi lapangan..."
                                className={inputClass}
                            />

                            <p className="mt-2 text-right text-xs text-gray-400">
                                {form.deskripsi.length}/1000
                            </p>
                        </section>

                        {/* PESAN ERROR */}
                        {error && (
                            <div
                                role="alert"
                                className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400"
                            >
                                {error}
                            </div>
                        )}

                        {/* PESAN SUKSES */}
                        {success && (
                            <div
                                role="status"
                                className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-900/10 dark:text-green-400"
                            >
                                {success}
                            </div>
                        )}

                        {/* TOMBOL */}
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href="/mitra/lapangan"
                                className="rounded-2xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-2xl bg-[#146B45] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#105638] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? isEnglish
                                        ? "Registering..."
                                        : "Mendaftarkan..."
                                    : isEnglish
                                        ? "Register Venue"
                                        : "Daftarkan Lapangan"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    );
}