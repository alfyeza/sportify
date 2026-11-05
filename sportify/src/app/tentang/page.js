
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TentangPage() {
  const layanan = [
    "Pencarian lapangan olahraga",
    "Filter berdasarkan kategori olahraga",
    "Informasi lokasi dan fasilitas",
    "Detail harga sewa lapangan",
    "Informasi foto tempat olahraga",
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background overflow-hidden">

        {/* Hero Section */}
        <section className="liquid-about-hero">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 py-6 sm:py-8">
            <span className="liquid-about-label text-[10px] sm:text-xs">
              TENTANG SPORTIFY
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-dark-text mt-5 sm:mt-6 leading-tight">
              Olahraga Jadi Lebih Mudah
              <span className="block text-primary">
                Bersama Sportify
              </span>
            </h1>

            <p className="mt-5 sm:mt-7 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              Sportify merupakan platform pemesanan lapangan olahraga
              yang membantu masyarakat menemukan dan memesan tempat
              olahraga dengan lebih mudah, praktis, dan cepat,
              khususnya di wilayah Semarang.
            </p>

            <Link
              href="/lapangan"
              className="liquid-primary-button inline-flex mt-7 sm:mt-9 text-sm sm:text-base"
            >
              Jelajahi Lapangan
              <span>→</span>
            </Link>
          </div>

          <div className="liquid-about-decoration liquid-about-decoration-one" />
          <div className="liquid-about-decoration liquid-about-decoration-two" />
        </section>

        {/* Mengapa Sportify */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">

            {/* Penjelasan */}
            <div>
              <span className="text-primary font-semibold text-xs sm:text-sm tracking-widest">
                KENALI SPORTIFY
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-text mt-3 mb-5 sm:mb-6 leading-tight">
                Mengapa Memilih Sportify?
              </h2>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
                Mencari lapangan olahraga terkadang membutuhkan waktu
                karena informasi lokasi, harga, dan fasilitas tersebar
                di berbagai tempat.
              </p>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Melalui Sportify, pengguna dapat mencari berbagai
                pilihan tempat olahraga berdasarkan kategori,
                melihat informasi lapangan, dan menemukan tempat
                yang sesuai dengan kebutuhan.
              </p>
            </div>

            {/* Layanan */}
            <div className="liquid-about-card w-full p-5 sm:p-7 lg:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-7">
                <div className="liquid-about-icon shrink-0">
                  <span>✦</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-dark-text">
                    Layanan Sportify
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Kemudahan dalam satu platform
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {layanan.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 sm:gap-4 items-start"
                  >
                    <span className="liquid-about-check shrink-0">
                      ✓
                    </span>

                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 lg:pb-20">
          <div className="liquid-about-cta px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <span className="text-green-100 text-[10px] sm:text-sm font-semibold tracking-widest">
                SPORTIFY SEMARANG
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-4 leading-tight">
                Temukan Lapangan Olahraga Favoritmu!
              </h2>

              <p className="mt-4 sm:mt-5 text-green-100 text-sm sm:text-base leading-relaxed">
                Mulai cari tempat olahraga yang sesuai dengan
                kebutuhanmu melalui Sportify.
              </p>

              <Link
                href="/lapangan"
                className="inline-flex items-center mt-7 sm:mt-8 bg-white text-primary font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-soft-mint transition duration-300 shadow-lg text-sm sm:text-base"
              >
                Lihat Lapangan
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
