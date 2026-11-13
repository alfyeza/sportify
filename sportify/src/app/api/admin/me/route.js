import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { admin } = await getAdminFromRequest(request);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: "Sesi admin tidak valid atau telah kedaluwarsa.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      admin,
    });
  } catch (error) {
    console.error("Admin auth check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}

