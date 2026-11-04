import Image from "next/image";
import Link from "next/link";

export default function CardLapangan({
  id,
  nama,
  lokasi,
  harga,
  fasilitas,
  gambar,
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">

      {/* Foto Lapangan */}
      <div className="relative h-52 w-full">
        <Image
          src={gambar}
          alt={nama}
          fill
          className="object-cover"
        />
      </div>

      {/* Informasi Lapangan */}
      <div className="p-5">

        <h3 className="text-xl font-bold text-dark-text">
          {nama}
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          📍 {lokasi}
        </p>

        {/* Fasilitas */}
        <div className="flex flex-wrap gap-2 mt-4">
          {fasilitas.map((item) => (
            <span
              key={item}
              className="text-xs bg-soft-mint text-primary px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Harga dan Tombol */}
        <div className="flex justify-between items-center mt-5">

          <div>
            <p className="text-xs text-gray-500">
              Harga sewa
            </p>

            <p className="text-lg font-bold text-primary">
              Rp {harga.toLocaleString("id-ID")}
              <span className="text-xs font-normal text-gray-500">
                /jam
              </span>
            </p>
          </div>

          <Link
            href={`/lapangan/${id}`}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition text-sm"
          >
            Lihat Detail
          </Link>

        </div>
      </div>
    </div>
  );
}