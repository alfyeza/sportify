import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardLapangan from "@/components/CardLapangan";
import { daftarLapangan } from "@/lib/lapangan";

const kategoriOlahraga = [
  "Padel",
  "Tennis",
  "Mini Soccer",
  "Badminton",
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-soft-mint">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="text-primary font-semibold mb-4">
            PLAYCOURT - SEMARANG
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-dark-text leading-tight">
            Temukan dan Pesan
            <br />
            Tempat Olahraga Favoritmu
          </h1>

          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Cari dan sewa berbagai tempat olahraga di Kota Semarang
            dengan mudah, cepat, dan praktis.
          </p>

          <a
            href="/lapangan"
            className="inline-block mt-8 bg-primary text-white px-8 py-3 rounded-xl hover:bg-secondary transition"
          >
            Cari Lapangan
          </a>
        </div>
      </section>

      {/* KATEGORI OLAHRAGA */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark-text">
            Pilih Olahraga Favoritmu
          </h2>

          <p className="text-gray-500 mt-3">
            Berbagai pilihan tempat olahraga tersedia di Semarang.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {kategoriOlahraga.map((kategori) => (
            <button
              key={kategori}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-dark-text hover:bg-primary hover:text-white transition"
            >
              {kategori}
            </button>
          ))}
        </div>
      </section>

      {/* DAFTAR LAPANGAN */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-dark-text">
              Tempat Olahraga di Semarang
            </h2>

            <p className="text-gray-500 mt-3">
              Temukan tempat olahraga yang sesuai dengan kebutuhanmu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {daftarLapangan.map((lapangan) => (
              <CardLapangan
                key={lapangan.id}
                {...lapangan}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AJAKAN PEMESANAN */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-primary rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Siap Berolahraga Hari Ini?
          </h2>

          <p className="text-green-100 mt-4">
            Temukan tempat olahraga dan pesan jadwalmu sekarang.
          </p>

          <a
            href="/lapangan"
            className="inline-block mt-8 bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-soft-mint transition"
          >
            Pesan Sekarang
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}