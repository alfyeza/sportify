import { NextResponse } from "next/server";
import { getLapanganById, updateLapangan, deleteLapangan } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const venue = getLapanganById(id);

    if (!venue) {
      return NextResponse.json(
        {
          success: false,
          message: `Lapangan dengan ID "${id}" tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: venue,
    });
  } catch (error) {
    console.error(`GET /api/lapangan/[id] error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { admin } = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak. Anda harus login sebagai admin.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updated = updateLapangan(id, body);

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: `Lapangan dengan ID "${id}" tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Lapangan "${updated.nama}" berhasil diperbarui.`,
      data: updated,
    });
  } catch (error) {
    console.error(`PUT /api/lapangan/[id] error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui data lapangan: " + error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { admin } = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak. Anda harus login sebagai admin.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = deleteLapangan(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: `Lapangan dengan ID "${id}" tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Lapangan ID ${id} berhasil dihapus dari database.`,
    });
  } catch (error) {
    console.error(`DELETE /api/lapangan/[id] error:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus data lapangan: " + error.message,
      },
      { status: 500 }
    );
  }
}

