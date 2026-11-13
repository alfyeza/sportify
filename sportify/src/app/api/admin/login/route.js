import { NextResponse } from "next/server";
import { authenticateAdmin, createAdminSession } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    const admin = authenticateAdmin(username.trim(), password);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Username atau password salah.",
        },
        { status: 401 }
      );
    }

    // Buat session token 7 hari
    const { token, expiresAt } = createAdminSession(admin.id, 7);

    const response = NextResponse.json({
      success: true,
      message: "Login admin berhasil.",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });

    // Pasang HTTP-Only cookie untuk keamanan
    response.cookies.set("sportify_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal pada server.",
      },
      { status: 500 }
    );
  }
}

