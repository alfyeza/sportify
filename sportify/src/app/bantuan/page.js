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

            <main className="min-h-screen bg-background overflow-hidden">
                {/* HERO */}
                <section className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-soft-mint text-primary text-xs sm:text-sm font-semibold tracking-wider">
                            {t.heroLabel}
                        </span>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-dark-text mt-6 leading-tight">
                            {t.heroTitle}
                            <span className="block text-primary">
                                {t.heroHighlight}
                            </span>
                        </h1>

                        <p className="max-w-2xl mx-auto mt-5 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                            {t.heroDescription}
                        </p>

                        {/* SEARCH */}
                        <div className="max-w-2xl mx-auto mt-9">
                            <div className="liquid-about-card flex items-center gap-3 p-2 sm:p-3 rounded-2xl">
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
                                    className="w-full min-w-0 bg-transparent outline-none border-none text-sm sm:text-base text-dark-text placeholder:text-gray-400 py-2"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setOpenIndex(null);
                                        }}
                                        className="px-3 py-2 text-gray-500 hover:text-primary"
                                        aria-label="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="liquid-about-decoration liquid-about-decoration-one" />
                    <div className="liquid-about-decoration liquid-about-decoration-two" />
                </section>

                {/* FAQ SECTION */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
                    {/* CATEGORY */}
                    <div className="text-center mb-9">
                        <span className="text-primary font-semibold text-xs sm:text-sm tracking-widest">
                            SPORTIFY HELP CENTER
                        </span>

                        <h2 className="text-2xl sm:text-3xl font-bold text-dark-text mt-3">
                            {t.categoryTitle}
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
                        {[t.allCategories, ...t.categories].map((category) => {
                            const active = selectedCategory === category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setOpenIndex(null);
                                    }}
                                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${active
                                            ? "bg-primary text-white shadow-lg shadow-green-900/15"
                                            : "bg-white/80 text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>

                    {/* FAQ TITLE */}
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-dark-text">
                            {t.faqTitle}
                        </h2>

                        <p className="text-sm sm:text-base text-gray-500 mt-2">
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
                                        className="liquid-about-card overflow-hidden rounded-2xl transition-all duration-300"
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
                                                <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-xl bg-soft-mint text-primary font-bold">
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
                                                    <div className="border-t border-gray-100 pt-4">
                                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
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
                        <div className="liquid-about-card rounded-2xl p-8 sm:p-12 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-soft-mint text-primary flex items-center justify-center text-2xl font-bold mx-auto">
                                ?
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-dark-text mt-5">
                                {t.noResults}
                            </h3>

                            <p className="text-sm sm:text-base text-gray-500 mt-2">
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
                <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
                    <div className="liquid-about-cta px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
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
                                className="inline-flex items-center mt-7 bg-white text-primary font-semibold px-6 sm:px-8 py-3 rounded-full hover:bg-soft-mint transition duration-300 shadow-lg text-sm sm:text-base"
                            >
                                {t.contactButton}
                                <span className="ml-2">→</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}