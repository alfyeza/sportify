import { NextResponse } from "next/server";
import { deleteAdminSession } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

export async function POST(request) {
  try {
    const { token } = await getAdminFromRequest(request);

    if (token) {
      deleteAdminSession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil.",
    });

    // Hapus cookie sesi
    response.cookies.set("sportify_admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat logout.",
      },
      { status: 500 }
    );
  }
}

