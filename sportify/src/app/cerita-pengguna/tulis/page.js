"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { apiRequest } from "@/lib/api";

export default function TulisCeritaPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [kategori, setKategori] = useState("");
    const [cerita, setCerita] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const kategoriPilihan = [
        {
            value: "Kemudahan Booking",
            label: isEnglish ? "Booking Experience" : "Kemudahan Booking",
        },
        {
            value: "Tampilan Website",
            label: isEnglish ? "Website Design" : "Tampilan Website",
        },
        {
            value: "Informasi Lapangan",
            label: isEnglish ? "Court Information" : "Informasi Lapangan",
        },
        {
            value: "Pengalaman Pengguna",
            label: isEnglish ? "User Experience" : "Pengalaman Pengguna",
        },
        {
            value: "Lainnya",
            label: isEnglish ? "Others" : "Lainnya",
        },
    ];

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        if (!localStorage.getItem("token")) {
            router.push(
                `/login?redirect=${encodeURIComponent(
                    "/cerita-pengguna/tulis"
                )}`
            );
            return;
        }

        if (rating === 0) {
            setError(
                isEnglish
                    ? "Please select a rating first."
                    : "Silakan pilih rating terlebih dahulu."
            );
            return;
        }

        if (!kategori) {
            setError(
                isEnglish
                    ? "Please select an experience category."
                    : "Silakan pilih kategori pengalaman."
            );
            return;
        }

        if (cerita.trim().length < 20) {
            setError(
                isEnglish
                    ? "Your story must contain at least 20 characters."
                    : "Cerita harus berisi minimal 20 karakter."
            );
            return;
        }

        try {
            setLoading(true);

            await apiRequest("/cerita-pengguna", {
                method: "POST",
                body: JSON.stringify({
                    rating,
                    kategori,
                    cerita: cerita.trim(),
                }),
            });

            setSuccess(true);
        } catch (err) {
            setError(
                err.message ||
                (isEnglish
                    ? "Failed to submit your story."
                    : "Gagal mengirim cerita.")
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[var(--bg-main)] px-5 py-12 sm:py-16 transition-colors duration-300">
                <div className="mx-auto max-w-3xl">
                    {/* BREADCRUMB */}
                    <Link
                        href="/cerita-pengguna"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-primary dark:hover:text-green-400"
                    >
                        <span>{"<"}</span>
                        {isEnglish
                            ? "Back to User Stories"
                            : "Kembali ke Cerita Pengguna"}
                    </Link>

                    {success ? (
                        /* SUCCESS STATE */
                        <div className="liquid-card rounded-[2rem] border border-[var(--border-main)] bg-[var(--bg-card)] px-6 py-14 text-center shadow-sm sm:px-12">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-4xl text-primary dark:text-green-400">
                                ✓
                            </div>

                            <h1 className="mt-7 text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
                                {isEnglish
                                    ? "Story Submitted!"
                                    : "Cerita Berhasil Dikirim!"}
                            </h1>

                            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                                {isEnglish
                                    ? "Thank you for sharing your experience with Sportify. Your story will be reviewed before being published."
                                    : "Terima kasih sudah berbagi pengalaman bersama Sportify. Ceritamu akan diperiksa terlebih dahulu sebelum ditampilkan."}
                            </p>

                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link
                                    href="/cerita-pengguna"
                                    className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-secondary"
                                >
                                    {isEnglish
                                        ? "See User Stories"
                                        : "Lihat Cerita Pengguna"}
                                </Link>

                                <Link
                                    href="/"
                                    className="rounded-full border border-[var(--border-main)] px-7 py-3.5 text-sm font-semibold text-[var(--text-main)] transition hover:bg-[var(--bg-soft)]"
                                >
                                    {isEnglish ? "Back to Home" : "Kembali ke Home"}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* HEADER */}
                            <div className="mb-9 text-center">
                                <span className="inline-block rounded-full bg-green-500/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-primary dark:text-green-400">
                                    SHARE YOUR STORY
                                </span>

                                <h1 className="mt-5 text-3xl font-bold text-[var(--text-main)] sm:text-4xl">
                                    {isEnglish
                                        ? "Share Your Experience"
                                        : "Bagikan Pengalamanmu"}
                                </h1>

                                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
                                    {isEnglish
                                        ? "Tell us about your experience using Sportify. Your story can help us improve and inspire other users."
                                        : "Ceritakan pengalamanmu selama menggunakan Sportify. Ceritamu bisa membantu kami berkembang dan menginspirasi pengguna lainnya."}
                                </p>
                            </div>

                            {/* FORM */}
                            <form
                                onSubmit={handleSubmit}
                                className="liquid-card rounded-[2rem] border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm sm:p-9"
                            >
                                {/* RATING */}
                                <div className="mb-9">
                                    <label className="block text-base font-bold text-[var(--text-main)]">
                                        {isEnglish
                                            ? "How was your experience?"
                                            : "Bagaimana pengalamanmu?"}
                                    </label>

                                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                        {isEnglish
                                            ? "Give a rating based on your experience with Sportify."
                                            : "Berikan penilaian berdasarkan pengalamanmu menggunakan Sportify."}
                                    </p>

                                    <div className="mt-5 flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className={`text-4xl transition hover:scale-110 sm:text-5xl ${star <= (hoverRating || rating)
                                                        ? "text-yellow-400"
                                                        : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                                aria-label={`${star} stars`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>

                                    <p className="mt-3 text-sm font-medium text-primary dark:text-green-400">
                                        {rating === 0
                                            ? isEnglish
                                                ? "Select your rating"
                                                : "Pilih ratingmu"
                                            : isEnglish
                                                ? `${rating} out of 5 stars`
                                                : `${rating} dari 5 bintang`}
                                    </p>
                                </div>

                                {/* CATEGORY */}
                                <div className="mb-8">
                                    <label
                                        htmlFor="kategori"
                                        className="mb-3 block text-base font-bold text-[var(--text-main)]"
                                    >
                                        {isEnglish
                                            ? "Experience Category"
                                            : "Kategori Pengalaman"}
                                    </label>

                                    <select
                                        id="kategori"
                                        value={kategori}
                                        onChange={(e) => setKategori(e.target.value)}
                                        className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-4 text-sm text-[var(--input-text)] outline-none transition focus:border-primary focus:ring-2 focus:ring-green-500/10"
                                    >
                                        <option value="">
                                            {isEnglish
                                                ? "Select a category"
                                                : "Pilih kategori pengalaman"}
                                        </option>

                                        {kategoriPilihan.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* STORY */}
                                <div className="mb-8">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <label
                                            htmlFor="cerita"
                                            className="text-base font-bold text-[var(--text-main)]"
                                        >
                                            {isEnglish
                                                ? "Your Story"
                                                : "Ceritakan Pengalamanmu"}
                                        </label>

                                        <span className="text-xs text-[var(--text-muted)]">
                                            {cerita.length}/1000
                                        </span>
                                    </div>

                                    <textarea
                                        id="cerita"
                                        value={cerita}
                                        onChange={(e) =>
                                            setCerita(e.target.value.slice(0, 1000))
                                        }
                                        rows={7}
                                        maxLength={1000}
                                        placeholder={
                                            isEnglish
                                                ? "Tell us what you like about Sportify, your booking experience, or suggestions for improvement..."
                                                : "Ceritakan apa yang kamu sukai dari Sportify, pengalaman saat melakukan booking, atau saran untuk pengembangan website..."
                                        }
                                        className="w-full resize-none rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-4 text-sm leading-7 text-[var(--input-text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-primary focus:ring-2 focus:ring-green-500/10"
                                    />

                                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                                        {isEnglish
                                            ? "Minimum 20 characters. Maximum 1000 characters."
                                            : "Minimal 20 karakter dan maksimal 1000 karakter."}
                                    </p>
                                </div>

                                {/* INFO */}
                                <div className="mb-8 flex gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
                                    <span className="text-xl text-primary dark:text-green-400">
                                        i
                                    </span>

                                    <p className="text-xs leading-6 text-[var(--text-secondary)]">
                                        {isEnglish
                                            ? "Your story will be reviewed by the Sportify team before appearing publicly. Please share honest and respectful feedback."
                                            : "Cerita yang kamu kirim akan diperiksa oleh tim Sportify sebelum ditampilkan secara publik. Pastikan ceritamu jujur dan menggunakan bahasa yang sopan."}
                                    </p>
                                </div>

                                {/* ERROR */}
                                {error && (
                                    <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                                        {error}
                                    </div>
                                )}

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? isEnglish
                                            ? "Submitting..."
                                            : "Mengirim Cerita..."
                                        : isEnglish
                                            ? "Submit My Story"
                                            : "Kirim Ceritaku"}

                                    {!loading && <span>&gt;</span>}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}