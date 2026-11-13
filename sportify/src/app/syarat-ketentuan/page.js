"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

export default function SyaratKetentuanPage() {
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const sections = isEnglish
        ? [
            {
                title: "1. Acceptance of Terms",
                content:
                    "By accessing and using Sportify, you agree to comply with these Terms and Conditions. If you do not agree, please discontinue using the platform.",
            },
            {
                title: "2. User Accounts",
                content:
                    "Users are responsible for providing accurate information when registering an account and maintaining the confidentiality of their login credentials. Users are responsible for activities conducted through their accounts.",
            },
            {
                title: "3. Booking Services",
                content:
                    "Sportify provides a platform to help users find and book sports venues. Booking availability, schedules, prices, and facilities are subject to the information provided by each venue partner.",
            },
            {
                title: "4. Booking Accuracy",
                content:
                    "Users are responsible for checking their booking details before confirming a reservation, including the venue, court unit, date, time, and duration.",
            },
            {
                title: "5. User Responsibilities",
                content:
                    "Users must use Sportify responsibly, provide accurate information, respect venue rules, and avoid activities that may disrupt the services or harm other users.",
            },
            {
                title: "6. Venue Partner Responsibilities",
                content:
                    "Venue partners are responsible for maintaining accurate information about their facilities, prices, schedules, and availability.",
            },
            {
                title: "7. Service Availability",
                content:
                    "Sportify aims to provide reliable services but does not guarantee uninterrupted access. Certain features may be temporarily unavailable due to maintenance or technical issues.",
            },
            {
                title: "8. Changes to Terms",
                content:
                    "Sportify may update these Terms and Conditions when necessary. Updated terms will be published on this page.",
            },
        ]
        : [
            {
                title: "1. Persetujuan Ketentuan",
                content:
                    "Dengan mengakses dan menggunakan Sportify, pengguna dianggap telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini. Apabila tidak menyetujui ketentuan tersebut, pengguna dapat berhenti menggunakan platform.",
            },
            {
                title: "2. Akun Pengguna",
                content:
                    "Pengguna bertanggung jawab untuk memberikan informasi yang benar saat melakukan pendaftaran serta menjaga kerahasiaan informasi login. Pengguna juga bertanggung jawab atas aktivitas yang dilakukan melalui akunnya.",
            },
            {
                title: "3. Layanan Pemesanan",
                content:
                    "Sportify menyediakan platform untuk membantu pengguna mencari dan memesan lapangan olahraga. Ketersediaan jadwal, harga, dan fasilitas mengikuti informasi yang diberikan oleh masing-masing mitra lapangan.",
            },
            {
                title: "4. Ketepatan Informasi Pemesanan",
                content:
                    "Pengguna bertanggung jawab untuk memeriksa detail pemesanan sebelum mengonfirmasi reservasi, termasuk nama lapangan, unit lapangan, tanggal, waktu, dan durasi pemesanan.",
            },
            {
                title: "5. Tanggung Jawab Pengguna",
                content:
                    "Pengguna wajib menggunakan Sportify secara bertanggung jawab, memberikan informasi yang benar, mematuhi peraturan lapangan, serta tidak melakukan tindakan yang dapat mengganggu layanan atau merugikan pengguna lain.",
            },
            {
                title: "6. Tanggung Jawab Mitra Lapangan",
                content:
                    "Mitra lapangan bertanggung jawab untuk memastikan informasi mengenai fasilitas, harga, jadwal, dan ketersediaan lapangan yang ditampilkan telah sesuai dengan kondisi sebenarnya.",
            },
            {
                title: "7. Ketersediaan Layanan",
                content:
                    "Sportify berupaya menyediakan layanan yang dapat diakses dengan baik, tetapi tidak menjamin layanan selalu tersedia tanpa gangguan. Beberapa fitur dapat mengalami penghentian sementara karena pemeliharaan atau kendala teknis.",
            },
            {
                title: "8. Perubahan Ketentuan",
                content:
                    "Sportify dapat memperbarui Syarat & Ketentuan ini apabila diperlukan. Ketentuan terbaru akan ditampilkan melalui halaman ini.",
            },
        ];

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[var(--bg-main)] px-4 sm:px-6 py-14 sm:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-flex px-4 py-2 rounded-full bg-soft-mint text-primary text-xs sm:text-sm font-semibold tracking-wider">
                            SPORTIFY
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-main)] mt-6">
                            {isEnglish
                                ? "Terms & Conditions"
                                : "Syarat & Ketentuan"}
                        </h1>

                        <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
                            {isEnglish
                                ? "Please read these terms carefully before using Sportify services."
                                : "Silakan baca ketentuan berikut sebelum menggunakan layanan Sportify."}
                        </p>
                    </div>

                    <div className="liquid-about-card rounded-3xl p-5 sm:p-8 lg:p-10">
                        <div className="mb-8 pb-6 border-b border-[var(--border-main)]">
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {isEnglish
                                    ? "These terms govern your access to and use of the Sportify platform, including its court discovery and booking features."
                                    : "Syarat & Ketentuan ini mengatur penggunaan platform Sportify, termasuk fitur pencarian dan pemesanan lapangan olahraga."}
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