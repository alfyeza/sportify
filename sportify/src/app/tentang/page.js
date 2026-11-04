import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TentangPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <section className="bg-soft-mint py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-primary font-semibold mb-3">
              Tentang PlayCourt
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-dark-text">
              Olahraga Jadi Lebih Mudah Bersama PlayCourt
            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
              PlayCourt merupakan platform pemesanan lapangan olahraga
              yang membantu masyarakat menemukan dan memesan tempat
              olahraga dengan lebih mudah, praktis, dan cepat, khususnya
              di wilayah Semarang.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-dark-text mb-5">
              Mengapa PlayCourt?
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              Mencari lapangan olahraga terkadang membutuhkan waktu
              karena informasi lokasi, harga, dan fasilitas tersebar
              di berbagai tempat.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Melalui PlayCourt, pengguna dapat mencari berbagai
              pilihan tempat olahraga berdasarkan kategori,
              melihat informasi lapangan, dan menemukan tempat
              yang sesuai dengan kebutuhan.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-primary mb-5">
              Layanan PlayCourt
            </h3>

            <div className="space-y-4">
              {[
                "Pencarian lapangan olahraga",
                "Filter berdasarkan kategori olahraga",
                "Informasi lokasi dan fasilitas",
                "Detail harga sewa lapangan",
                "Informasi foto tempat olahraga",
              ].map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 text-center text-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold">
              Temukan Lapangan Olahraga Favoritmu!
            </h2>

            <p className="mt-4 text-green-100">
              Mulai cari tempat olahraga yang sesuai dengan kebutuhanmu
              melalui PlayCourt.
            </p>

            <Link
              href="/lapangan"
              className="inline-block mt-7 bg-white text-primary font-semibold px-7 py-3 rounded-lg hover:bg-soft-mint transition"
            >
              Lihat Lapangan
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}