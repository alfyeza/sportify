"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/translations";

export default function BantuanPage() {
    const { language } = useLanguage();
    const t = translations[language]?.bantuan || translations.id.bantuan;

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(t.allCategories);
    const [openIndex, setOpenIndex] = useState(null);

    const filteredFaqs = useMemo(() => {
        return t.faqs.filter((faq) => {
            const matchesCategory =
                selectedCategory === t.allCategories ||
                faq.category === selectedCategory;

            const keyword = search.toLowerCase();

            const matchesSearch =
                faq.question.toLowerCase().includes(keyword) ||
                faq.answer.toLowerCase().includes(keyword);

            return matchesCategory && matchesSearch;
        });
    }, [t, search, selectedCategory]);

    return (
        <>
            <Navbar />

            <main
                className="min-h-screen overflow-hidden help-page"
                style={{
                    backgroundColor: "var(--bg-main)",
                    color: "var(--text-main)",
                }}
            >
                {/* HERO */}
                <section className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-24 help-hero">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <span className="help-label inline-flex items-center px-4 py-2 rounded-full bg-soft-mint text-primary text-xs sm:text-sm font-semibold tracking-wider">
                            {t.heroLabel}
                        </span>

                        <h1 className="help-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-6 leading-tight text-dark-text">
                            {t.heroTitle}
                            <span className="block text-primary">
                                {t.heroHighlight}
                            </span>
                        </h1>

                        <p
                            className="help-description max-w-2xl mx-auto mt-5 text-sm sm:text-base md:text-lg leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {t.heroDescription}
                        </p>

                        {/* SEARCH */}
                        <div className="help-search max-w-2xl mx-auto mt-9">
                            <div className="liquid-about-card flex items-center gap-3 p-2 sm:p-3 rounded-2xl transition-all duration-300">
                                <span className="text-xl text-primary pl-3">
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setOpenIndex(null);
                                    }}
                                    placeholder={t.searchPlaceholder}
                                    className="w-full min-w-0 bg-transparent outline-none border-none text-sm sm:text-base py-2"
                                    style={{
                                        color: "var(--input-text)",
                                        caretColor: "var(--text-main)",
                                    }}
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setOpenIndex(null);
                                        }}
                                        className="px-3 py-2 transition hover:text-primary"
                                        style={{ color: "var(--text-secondary)" }}
                                        aria-label="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="liquid-about-decoration liquid-about-decoration-one help-decoration-one" />
                    <div className="liquid-about-decoration liquid-about-decoration-two help-decoration-two" />
                </section>

                {/* FAQ SECTION */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 help-faq-section">
                    {/* CATEGORY */}
                    <div className="text-center mb-9 help-section-heading">
                        <span className="text-primary font-semibold text-xs sm:text-sm tracking-widest">
                            SPORTIFY HELP CENTER
                        </span>

                        <h2 className="text-2xl sm:text-3xl font-bold text-dark-text mt-3">
                            {t.categoryTitle}
                        </h2>
                    </div>

                    {/* CATEGORY BUTTONS */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
                        {[t.allCategories, ...t.categories].map((category, index) => {
                            const active = selectedCategory === category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setOpenIndex(null);
                                    }}
                                    className={`help-category-button px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${active
                                        ? "bg-primary text-white shadow-lg shadow-green-900/15"
                                        : "border hover:border-primary hover:text-primary"
                                        }`}
                                    style={
                                        active
                                            ? { animationDelay: `${index * 60}ms` }
                                            : {
                                                backgroundColor: "var(--bg-card)",
                                                color: "var(--text-secondary)",
                                                borderColor: "var(--border-main)",
                                                animationDelay: `${index * 60}ms`,
                                            }
                                    }
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>

                    {/* FAQ TITLE */}
                    <div className="mb-6 help-faq-heading">
                        <h2 className="text-xl sm:text-2xl font-bold text-dark-text">
                            {t.faqTitle}
                        </h2>

                        <p
                            className="text-sm sm:text-base mt-2"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {t.faqDescription}
                        </p>
                    </div>

                    {/* FAQ LIST */}
                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-3">
                            {filteredFaqs.map((faq, index) => {
                                const isOpen = openIndex === index;

                                return (
                                    <div
                                        key={`${faq.category}-${faq.question}`}
                                        className="liquid-about-card help-faq-card overflow-hidden rounded-2xl transition-all duration-300"
                                        style={{
                                            animationDelay: `${index * 70}ms`,
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenIndex(isOpen ? null : index)
                                            }
                                            className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                                            aria-expanded={isOpen}
                                        >
                                            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                                                <span className="help-question-icon flex items-center justify-center shrink-0 w-8 h-8 rounded-xl bg-soft-mint text-primary font-bold">
                                                    ?
                                                </span>

                                                <div className="min-w-0">
                                                    <span className="text-[10px] sm:text-xs font-semibold text-primary tracking-wide">
                                                        {faq.category}
                                                    </span>

                                                    <h3 className="text-sm sm:text-base font-semibold text-dark-text mt-1 leading-relaxed">
                                                        {faq.question}
                                                    </h3>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isOpen
                                                    ? "bg-primary text-white rotate-180"
                                                    : "bg-soft-mint text-primary"
                                                    }`}
                                            >
                                                ↓
                                            </span>
                                        </button>

                                        <div
                                            className={`grid transition-all duration-300 ease-in-out ${isOpen
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="px-4 sm:px-5 pb-5 pl-14 sm:pl-[4.5rem]">
                                                    <div
                                                        className="border-t pt-4"
                                                        style={{
                                                            borderColor: "var(--border-soft)",
                                                        }}
                                                    >
                                                        <p
                                                            className="text-sm sm:text-base leading-relaxed"
                                                            style={{
                                                                color: "var(--text-secondary)",
                                                            }}
                                                        >
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* EMPTY STATE */
                        <div className="liquid-about-card help-empty-state rounded-2xl p-8 sm:p-12 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-soft-mint text-primary flex items-center justify-center text-2xl font-bold mx-auto">
                                ?
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-dark-text mt-5">
                                {t.noResults}
                            </h3>

                            <p
                                className="text-sm sm:text-base mt-2"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {t.noResultsDescription}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setSelectedCategory(t.allCategories);
                                    setOpenIndex(null);
                                }}
                                className="mt-5 text-primary font-semibold text-sm hover:underline"
                            >
                                {language === "en" ? "Reset filters" : "Reset Filter"}
                            </button>
                        </div>
                    )}
                </section>

                {/* CONTACT CTA */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 help-contact-section">
                    <div className="liquid-about-cta help-contact-card px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
                        <div className="relative z-10 max-w-3xl mx-auto text-center">
                            <span className="text-green-100 text-xs sm:text-sm font-semibold tracking-widest">
                                SPORTIFY SUPPORT
                            </span>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-4 leading-tight">
                                {t.contactTitle}
                            </h2>

                            <p className="mt-4 text-green-100 text-sm sm:text-base leading-relaxed">
                                {t.contactDescription}
                            </p>

                            <Link
                                href="/contact"
                                className="help-contact-button inline-flex items-center mt-7 bg-white text-primary font-semibold px-6 sm:px-8 py-3 rounded-full hover:bg-soft-mint transition duration-300 shadow-lg text-sm sm:text-base"
                            >
                                {t.contactButton}
                                <span className="ml-2">→</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx global>{`
                @keyframes helpFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(28px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes helpFadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes helpFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-13px);
                    }
                }

                @keyframes helpPop {
                    from {
                        opacity: 0;
                        transform: scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .help-hero {
                    animation: helpFadeIn 0.8s ease both;
                }

                .help-label {
                    animation: helpFadeUp 0.7s ease both;
                }

                .help-title {
                    animation: helpFadeUp 0.8s ease 0.1s both;
                }

                .help-description {
                    animation: helpFadeUp 0.8s ease 0.2s both;
                }

                .help-search {
                    animation: helpFadeUp 0.8s ease 0.3s both;
                }

                .help-search > div {
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease,
                        border-color 0.3s ease;
                }

                .help-search > div:focus-within {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 30px rgba(20, 107, 69, 0.12);
                }

                .help-decoration-one {
                    animation: helpFloat 6s ease-in-out infinite;
                }

                .help-decoration-two {
                    animation: helpFloat 7s ease-in-out infinite reverse;
                }

                .help-section-heading,
                .help-faq-heading {
                    animation: helpFadeUp 0.7s ease both;
                }

                .help-category-button {
                    animation: helpFadeUp 0.5s ease both;
                }

                .help-category-button:hover {
                    transform: translateY(-3px);
                }

                .help-faq-card {
                    animation: helpFadeUp 0.55s ease both;
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease,
                        border-color 0.3s ease;
                }

                .help-faq-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 28px rgba(20, 107, 69, 0.08);
                }

                .help-question-icon {
                    transition: transform 0.3s ease;
                }

                .help-faq-card:hover .help-question-icon {
                    transform: rotate(-8deg) scale(1.08);
                }

                .help-empty-state {
                    animation: helpPop 0.4s ease both;
                }

                .help-contact-section {
                    animation: helpFadeUp 0.8s ease both;
                }

                .help-contact-card {
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                }

                .help-contact-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 45px rgba(20, 107, 69, 0.18);
                }

                .help-contact-button {
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease,
                        background-color 0.3s ease;
                }

                .help-contact-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
                }

                .help-contact-button:active {
                    transform: scale(0.97);
                }

                @media (prefers-reduced-motion: reduce) {
                    .help-page *,
                    .help-page *::before,
                    .help-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </>
    );
}