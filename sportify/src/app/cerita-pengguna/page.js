"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { apiRequest } from "@/lib/api";
import { useLanguage } from "@/components/LanguageProvider";

export default function CeritaPenggunaPage() {
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [cerita, setCerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        ambilCerita();
    }, []);

    async function ambilCerita() {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest("/cerita-pengguna");
            const data = response.data || [];

            setCerita(
                data.filter((item) => item.status === "approved")
            );
        } catch (err) {
            setError(err.message || "Gagal mengambil cerita pengguna.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[var(--bg-main)] transition-colors duration-300">
                {/* HEADER */}
                <section className="relative overflow-hidden bg-[var(--bg-soft)] px-5 py-20 text-center sm:py-24">
                    <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />

                    <div className="relative mx-auto max-w-3xl">
                        <span className="mb-5 inline-block rounded-full border border-green-600/20 bg-green-600/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-primary dark:text-green-400">
                            USER STORIES
                        </span>

                        <h1 className="text-3xl font-bold leading-tight text-[var(--text-main)] sm:text-5xl">
                            {isEnglish
                                ? "Stories From Our Users"
                                : "Cerita dari Pengguna Kami"}
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                            {isEnglish
                                ? "Discover experiences and stories from people who have used Sportify."
                                : "Kenali pengalaman dan cerita dari orang-orang yang telah menggunakan Sportify."}
                        </p>

                        <Link
                            href="/cerita-pengguna/tulis"
                            className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-1 hover:bg-secondary"
                        >
                            {isEnglish ? "Share Your Story" : "Bagikan Pengalamanmu"}
                            <span className="ml-2">&gt;</span>
                        </Link>
                    </div>
                </section>

                {/* DAFTAR CERITA */}
                <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
                    <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold tracking-[0.2em] text-primary dark:text-green-400">
                                COMMUNITY VOICES
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
                                {isEnglish ? "What They Say" : "Apa Kata Mereka?"}
                            </h2>

                            <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                {isEnglish
                                    ? "Real experiences from the Sportify community."
                                    : "Pengalaman dari komunitas pengguna Sportify."}
                            </p>
                        </div>

                        <span className="text-sm text-[var(--text-muted)]">
                            {cerita.length} {isEnglish ? "stories" : "cerita"}
                        </span>
                    </div>

                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                            <p className="text-sm text-red-500">{error}</p>

                            <button
                                onClick={ambilCerita}
                                className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
                            >
                                {isEnglish ? "Try Again" : "Coba Lagi"}
                            </button>
                        </div>
                    ) : cerita.length === 0 ? (
                        <div className="rounded-3xl border border-[var(--border-main)] bg-[var(--bg-card)] px-6 py-16 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-3xl text-primary dark:text-green-400">
                                ✦
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-[var(--text-main)]">
                                {isEnglish
                                    ? "No stories yet"
                                    : "Belum Ada Cerita"}
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                                {isEnglish
                                    ? "Be the first to share your experience with Sportify!"
                                    : "Jadilah orang pertama yang membagikan pengalaman menggunakan Sportify!"}
                            </p>

                            <Link
                                href="/cerita-pengguna/tulis"
                                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
                            >
                                {isEnglish ? "Write a Story" : "Tulis Cerita"}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {cerita.map((item) => (
                                <article
                                    key={item.id}
                                    className="liquid-card rounded-3xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-primary dark:text-green-400">
                                            {item.kategori}
                                        </span>

                                        <span className="text-xs text-[var(--text-muted)]">
                                            {new Date(item.tanggal).toLocaleDateString(
                                                isEnglish ? "en-US" : "id-ID",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-6 flex gap-1 text-lg text-yellow-400">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <span key={index}>
                                                {index < item.rating ? "★" : "☆"}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="mt-4 min-h-28 text-sm leading-7 text-[var(--text-secondary)]">
                                        "{item.cerita}"
                                    </p>

                                    <div className="mt-6 border-t border-[var(--border-main)] pt-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/10 font-bold text-primary dark:text-green-400">
                                                {(item.nama || "P").charAt(0).toUpperCase()}
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-[var(--text-main)]">
                                                    {item.nama}
                                                </h3>

                                                <p className="text-xs text-[var(--text-muted)]">
                                                    Sportify User
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA */}
                <section className="px-5 pb-20">
                    <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-primary px-7 py-12 text-center text-white sm:px-12">
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            {isEnglish
                                ? "Have a Story to Tell?"
                                : "Punya Cerita untuk Dibagikan?"}
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/80">
                            {isEnglish
                                ? "Your experience could inspire others to discover Sportify."
                                : "Pengalamanmu mungkin bisa menginspirasi orang lain untuk mengenal Sportify."}
                        </p>

                        <Link
                            href="/cerita-pengguna/tulis"
                            className="mt-7 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary transition hover:bg-green-50"
                        >
                            {isEnglish ? "Share Your Story" : "Bagikan Ceritamu"}
                            <span className="ml-2">&gt;</span>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}