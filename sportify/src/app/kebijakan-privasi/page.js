"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

export default function KebijakanPrivasiPage() {
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const sections = isEnglish
        ? [
            {
                title: "1. Information We Collect",
                content:
                    "Sportify may collect information provided by users when creating an account, using our services, or contacting our team. This may include your name, email address, phone number, and booking information.",
            },
            {
                title: "2. How We Use Your Information",
                content:
                    "The information collected is used to manage user accounts, process court bookings, provide customer support, improve our services, and communicate important information related to your use of Sportify.",
            },
            {
                title: "3. Information Security",
                content:
                    "We strive to protect user information through reasonable security measures. However, no electronic data transmission or storage system can be guaranteed to be completely secure.",
            },
            {
                title: "4. Information Sharing",
                content:
                    "User information may be shared with relevant venue partners when necessary to support booking services. We do not intend to sell personal information to third parties.",
            },
            {
                title: "5. Cookies and Local Storage",
                content:
                    "Sportify may use browser storage technologies to remember preferences, such as language settings and certain login-related information, to improve the user experience.",
            },
            {
                title: "6. User Rights",
                content:
                    "Users may request information about their personal data, ask for corrections, or request account deletion through the available contact channels, subject to applicable requirements.",
            },
            {
                title: "7. Policy Updates",
                content:
                    "This Privacy Policy may be updated from time to time. Any changes will be published on this page.",
            },
        ]
        : [
            {
                title: "1. Informasi yang Kami Kumpulkan",
                content:
                    "Sportify dapat mengumpulkan informasi yang diberikan pengguna saat membuat akun, menggunakan layanan, atau menghubungi tim kami. Informasi tersebut dapat mencakup nama, alamat email, nomor telepon, dan informasi pemesanan.",
            },
            {
                title: "2. Penggunaan Informasi",
                content:
                    "Informasi yang dikumpulkan digunakan untuk mengelola akun pengguna, memproses pemesanan lapangan, memberikan bantuan pelanggan, meningkatkan layanan, serta menyampaikan informasi penting terkait penggunaan Sportify.",
            },
            {
                title: "3. Keamanan Informasi",
                content:
                    "Kami berupaya melindungi informasi pengguna melalui langkah-langkah keamanan yang wajar. Namun, tidak ada sistem penyimpanan maupun pengiriman data elektronik yang dapat dijamin sepenuhnya aman.",
            },
            {
                title: "4. Pembagian Informasi",
                content:
                    "Informasi pengguna dapat dibagikan kepada mitra lapangan terkait apabila diperlukan untuk mendukung layanan pemesanan. Kami tidak bermaksud menjual informasi pribadi pengguna kepada pihak ketiga.",
            },
            {
                title: "5. Cookies dan Penyimpanan Lokal",
                content:
                    "Sportify dapat menggunakan teknologi penyimpanan pada browser untuk mengingat preferensi pengguna, seperti pengaturan bahasa dan informasi tertentu yang berkaitan dengan proses login.",
            },
            {
                title: "6. Hak Pengguna",
                content:
                    "Pengguna dapat mengajukan permintaan informasi mengenai data pribadinya, meminta perbaikan data, atau mengajukan penghapusan akun melalui saluran kontak yang tersedia sesuai ketentuan yang berlaku.",
            },
            {
                title: "7. Perubahan Kebijakan",
                content:
                    "Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu. Setiap perubahan akan ditampilkan melalui halaman ini.",
            },
        ];

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[var(--bg-main)] px-4 sm:px-6 py-14 sm:py-20 transition-colors duration-300">
                <div className="max-w-4xl mx-auto">
                    {/* HEADER */}
                    <div className="text-center mb-12">
                        <span className="inline-flex px-4 py-2 rounded-full bg-soft-mint text-primary text-xs sm:text-sm font-semibold tracking-wider">
                            SPORTIFY
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-main)] mt-6">
                            {isEnglish ? "Privacy Policy" : "Kebijakan Privasi"}
                        </h1>

                        <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
                            {isEnglish
                                ? "Learn how Sportify collects, uses, and protects your personal information."
                                : "Ketahui bagaimana Sportify mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda."}
                        </p>
                    </div>

                    {/* PRIVACY CONTENT */}
                    <div className="liquid-about-card rounded-3xl p-5 sm:p-8 lg:p-10">
                        <div className="mb-8 pb-6 border-b border-[var(--border-main)]">
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {isEnglish
                                    ? "Your privacy matters to us. This policy explains how information is handled when you use the Sportify platform."
                                    : "Privasi Anda merupakan hal penting bagi kami. Kebijakan ini menjelaskan bagaimana informasi dikelola ketika Anda menggunakan platform Sportify."}
                            </p>
                        </div>

                        <div className="space-y-8">
                            {sections.map((section, index) => (
                                <section key={index}>
                                    <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] mb-3">
                                        {section.title}
                                    </h2>

                                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-8">
                                        {section.content}
                                    </p>
                                </section>
                            ))}
                        </div>

                        {/* LAST UPDATED */}
                        <div className="mt-10 pt-6 border-t border-[var(--border-main)]">
                            <p className="text-xs text-[var(--text-muted)]">
                                {isEnglish
                                    ? "Last updated: November 2026"
                                    : "Terakhir diperbarui: November 2026"}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}