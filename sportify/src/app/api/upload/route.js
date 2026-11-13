import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { getAdminFromRequest } from "@/lib/auth";

export async function POST(request) {
  try {
    // Verifikasi admin
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

    const formData = await request.formData();
    const files = formData.getAll("file");

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada file yang diunggah.",
        },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Pastikan folder uploads tersedia
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Abaikan jika folder sudah ada
    }

    const uploadedUrls = [];

    for (const file of files) {
      if (typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = file.name || "image.jpg";
      const ext = path.extname(originalName).toLowerCase() || ".jpg";

      // Validasi ekstensi yang diizinkan
      const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"];
      if (!allowedExts.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            message: `Format file ${ext} tidak didukung. Harap unggah format JPG, PNG, atau WebP.`,
          },
          { status: 400 }
        );
      }

      const randomSuffix = crypto.randomBytes(6).toString("hex");
      const fileName = `venue-${Date.now()}-${randomSuffix}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${fileName}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedUrls.length} file berhasil diunggah.`,
      url: uploadedUrls[0],
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengunggah file: " + error.message,
      },
      { status: 500 }
    );
  }
}

