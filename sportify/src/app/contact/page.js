"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

export default function ContactPage() {
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const [form, setForm] = useState({
        nama: "",
        email: "",
        subjek: "",
        pesan: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const content = {
        label: isEnglish ? "CONTACT US" : "HUBUNGI KAMI",
        title: isEnglish ? "We're Here to" : "Kami Siap",
        highlight: isEnglish ? "Help You" : "Membantu Anda",
        description: isEnglish
            ? "Have questions, suggestions, or need assistance? Feel free to contact the Sportify team."
            : "Punya pertanyaan, saran, atau membutuhkan bantuan? Jangan ragu untuk menghubungi tim Sportify.",
        formTitle: isEnglish ? "Send Us a Message" : "Kirim Pesan kepada Kami",
        formDescription: isEnglish
            ? "Fill out the form below and tell us how we can help."
            : "Isi formulir berikut dan ceritakan apa yang bisa kami bantu.",
        name: isEnglish ? "Full Name" : "Nama Lengkap",
        email: "Email",
        subject: isEnglish ? "Subject" : "Subjek",
        message: isEnglish ? "Your Message" : "Pesan Anda",
        namePlaceholder: isEnglish ? "Enter your full name" : "Masukkan nama lengkap",
        emailPlaceholder: isEnglish ? "Enter your email address" : "Masukkan alamat email",
        subjectPlaceholder: isEnglish ? "What is this about?" : "Apa yang ingin Anda tanyakan?",
        messagePlaceholder: isEnglish
            ? "Write your message here..."
            : "Tuliskan pesan Anda di sini...",
        send: isEnglish ? "Send Message" : "Kirim Pesan",
        successTitle: isEnglish ? "Message Received!" : "Pesan Berhasil Disiapkan!",
        successDescription: isEnglish
            ? "Thank you for contacting Sportify. Your message has been recorded in this demo form."
            : "Terima kasih telah menghubungi Sportify. Pesan Anda telah tercatat pada formulir demo ini.",
        reset: isEnglish ? "Send Another Message" : "Kirim Pesan Lain",
        helpTitle: isEnglish ? "Need Quick Help?" : "Butuh Bantuan Cepat?",
        helpDescription: isEnglish
            ? "You can also visit our Help Center to find answers to frequently asked questions."
            : "Anda juga bisa mengunjungi Pusat Bantuan untuk menemukan jawaban dari pertanyaan yang sering diajukan.",
        helpButton: isEnglish ? "Visit Help Center" : "Kunjungi Pusat Bantuan",
        required: isEnglish
            ? "Please complete all fields."
            : "Mohon lengkapi semua kolom.",
    };

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (
            !form.nama.trim() ||
            !form.email.trim() ||
            !form.subjek.trim() ||
            !form.pesan.trim()
        ) {
            alert(content.required);
            return;
        }

        setSubmitted(true);
    }

    function resetForm() {
        setForm({
            nama: "",
            email: "",
            subjek: "",
            pesan: "",
        });

        setSubmitted(false);
    }

    const inputClass =
        "w-full px-4 py-3.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--text-muted)] text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition";

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden transition-colors duration-300">
                {/* HERO */}
                <section className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-soft-mint text-primary text-xs sm:text-sm font-semibold tracking-wider">
                            {content.label}
                        </span>

                        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-main)] leading-tight">
                            {content.title}{" "}
                            <span className="text-primary">
                                {content.highlight}
                            </span>
                        </h1>

                        <p className="mt-5 text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                            {content.description}
                        </p>
                    </div>

                    <div className="liquid-about-decoration liquid-about-decoration-one" />
                    <div className="liquid-about-decoration liquid-about-decoration-two" />
                </section>

                {/* CONTACT CONTENT */}
                <section className="px-4 sm:px-6 pb-16 sm:pb-20">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
                        {/* LEFT INFORMATION */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <span className="text-sm font-semibold text-primary">
                                    SPORTIFY
                                </span>

                                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] mt-2">
                                    {isEnglish
                                        ? "Let's Talk About Sports"
                                        : "Mari Bicara tentang Olahraga"}
                                </h2>

                                <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-3 leading-relaxed">
                                    {isEnglish
                                        ? "We value your feedback. Your questions and suggestions help us improve the Sportify experience."
                                        : "Kami menghargai setiap masukan dari Anda. Pertanyaan dan saran yang diberikan membantu kami meningkatkan pengalaman menggunakan Sportify."}
                                </p>
                            </div>

                            {/* HELP CARD */}
                            <div className="liquid-about-card rounded-3xl p-6 sm:p-7">
                                <div className="w-12 h-12 rounded-2xl bg-soft-mint flex items-center justify-center text-primary text-xl mb-5">
                                    ?
                                </div>

                                <h3 className="text-lg font-bold text-[var(--text-main)]">
                                    {content.helpTitle}
                                </h3>

                                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                                    {content.helpDescription}
                                </p>

                                <Link
                                    href="/bantuan"
                                    className="inline-flex items-center gap-2 mt-5 text-primary font-semibold text-sm hover:gap-3 transition-all"
                                >
                                    {content.helpButton}
                                    <span>&gt;</span>
                                </Link>
                            </div>

                            {/* PROMOTION CARD */}
                            <div className="rounded-3xl bg-primary text-white p-6 sm:p-7 relative overflow-hidden">
                                <div className="relative z-10">
                                    <span className="text-xs font-semibold tracking-widest text-green-100">
                                        SPORTIFY
                                    </span>

                                    <h3 className="text-xl sm:text-2xl font-bold mt-3">
                                        {isEnglish
                                            ? "Your Sports Journey Starts Here"
                                            : "Perjalanan Olahraga Anda Dimulai di Sini"}
                                    </h3>

                                    <p className="text-sm text-green-50 mt-3 leading-relaxed">
                                        {isEnglish
                                            ? "Find your favorite sports venue and book your next game with Sportify."
                                            : "Temukan lapangan olahraga favorit dan pesan jadwal bermain Anda bersama Sportify."}
                                    </p>

                                    <Link
                                        href="/lapangan"
                                        className="inline-flex items-center gap-2 mt-5 bg-white text-primary px-5 py-3 rounded-xl text-sm font-semibold hover:bg-soft-mint transition"
                                    >
                                        {isEnglish ? "Explore Venues" : "Jelajahi Lapangan"}
                                        <span>&gt;</span>
                                    </Link>
                                </div>

                                <div className="absolute -right-12 -bottom-16 w-48 h-48 rounded-full border-[30px] border-white/10" />
                                <div className="absolute right-10 -top-12 w-28 h-28 rounded-full bg-white/10" />
                            </div>
                        </div>

                        {/* RIGHT FORM */}
                        <div className="lg:col-span-3">
                            <div className="liquid-about-card rounded-3xl p-5 sm:p-8 lg:p-10">
                                {!submitted ? (
                                    <>
                                        <div className="mb-7">
                                            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                                                {content.formTitle}
                                            </h2>

                                            <p className="text-sm text-[var(--text-secondary)] mt-2">
                                                {content.formDescription}
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            {/* NAME */}
                                            <div>
                                                <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                                                    {content.name}
                                                </label>

                                                <input
                                                    type="text"
                                                    name="nama"
                                                    value={form.nama}
                                                    onChange={handleChange}
                                                    placeholder={content.namePlaceholder}
                                                    className={inputClass}
                                                />
                                            </div>

                                            {/* EMAIL */}
                                            <div>
                                                <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                                                    {content.email}
                                                </label>

                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder={content.emailPlaceholder}
                                                    className={inputClass}
                                                />
                                            </div>

                                            {/* SUBJECT */}
                                            <div>
                                                <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                                                    {content.subject}
                                                </label>

                                                <input
                                                    type="text"
                                                    name="subjek"
                                                    value={form.subjek}
                                                    onChange={handleChange}
                                                    placeholder={content.subjectPlaceholder}
                                                    className={inputClass}
                                                />
                                            </div>

                                            {/* MESSAGE */}
                                            <div>
                                                <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                                                    {content.message}
                                                </label>

                                                <textarea
                                                    name="pesan"
                                                    value={form.pesan}
                                                    onChange={handleChange}
                                                    placeholder={content.messagePlaceholder}
                                                    rows={5}
                                                    className={`${inputClass} resize-none`}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                                            >
                                                {content.send}
                                                <span className="ml-2">&gt;</span>
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="py-12 sm:py-16 text-center">
                                        <div className="w-16 h-16 rounded-full bg-soft-mint text-primary flex items-center justify-center text-3xl mx-auto mb-6">
                                            ✓
                                        </div>

                                        <h2 className="text-2xl font-bold text-[var(--text-main)]">
                                            {content.successTitle}
                                        </h2>

                                        <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-sm mx-auto leading-relaxed">
                                            {content.successDescription}
                                        </p>

                                        <button
                                            onClick={resetForm}
                                            className="mt-7 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-secondary transition"
                                        >
                                            {content.reset}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}