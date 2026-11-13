import { NextResponse } from "next/server";
import { getAllLapangan, createLapangan } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q")?.toLowerCase() || "";
    const kategori = searchParams.get("kategori") || "";

    let venues = getAllLapangan();

    if (kategori && kategori !== "Semua") {
      venues = venues.filter((v) => {
        const cats = Array.isArray(v.kategori) ? v.kategori : [v.kategori];
        return cats.some((c) => c.toLowerCase() === kategori.toLowerCase());
      });
    }

    if (search) {
      venues = venues.filter((v) => {
        const text = [
          v.nama,
          v.lokasi,
          v.alamat,
          v.deskripsi,
          ...(Array.isArray(v.kategori) ? v.kategori : []),
          ...(Array.isArray(v.fasilitas) ? v.fasilitas : []),
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(search);
      });
    }

    return NextResponse.json({
      success: true,
      data: venues,
      total: venues.length,
    });
  } catch (error) {
    console.error("GET /api/lapangan error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data lapangan dari database.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // 1. Verifikasi hak akses admin
    const { admin } = await getAdminFromRequest(request);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak. Anda harus login sebagai admin untuk menambah lapangan.",
        },
        { status: 401 }
      );
    }

    // 2. Baca body input
    const body = await request.json();

    // Validasi field wajib
    if (!body.nama || !body.nama.trim()) {
      return NextResponse.json(
        { success: false, message: "Nama venue wajib diisi." },
        { status: 400 }
      );
    }

    if (!body.lokasi || !body.lokasi.trim()) {
      return NextResponse.json(
        { success: false, message: "Kota / Lokasi venue wajib diisi." },
        { status: 400 }
      );
    }

    if (!body.alamat || !body.alamat.trim()) {
      return NextResponse.json(
        { success: false, message: "Alamat lengkap venue wajib diisi." },
        { status: 400 }
      );
    }

    if (body.harga === undefined || body.harga === null || Number(body.harga) <= 0) {
      return NextResponse.json(
        { success: false, message: "Harga sewa per sesi harus berupa angka lebih dari 0." },
        { status: 400 }
      );
    }

    // 3. Simpan ke database
    const newVenue = createLapangan({
      nama: body.nama,
      lokasi: body.lokasi,
      alamat: body.alamat,
      mapsUrl: body.mapsUrl || "",
      kategori: Array.isArray(body.kategori)
        ? body.kategori
        : body.kategori
          ? [body.kategori]
          : ["Umum"],
      harga: Number(body.harga),
      deskripsi: body.deskripsi || "",
      fasilitas: Array.isArray(body.fasilitas) ? body.fasilitas : [],
      foto: Array.isArray(body.foto) ? body.foto : [],
      gambar: body.gambar || (Array.isArray(body.foto) && body.foto[0]) || "",
      kontak: body.kontak || "",
      unitLapangan: Array.isArray(body.unitLapangan) ? body.unitLapangan : [],
      rating: Number(body.rating) || 5.0,
      jumlahRating: Number(body.jumlahRating) || 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Venue "${newVenue.nama}" berhasil ditambahkan ke database.`,
        data: newVenue,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/lapangan error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan data lapangan: " + error.message,
      },
      { status: 500 }
    );
  }
}

