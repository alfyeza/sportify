import { cookies } from "next/headers";
import { verifyAdminSession } from "./db.js";

/**
 * Memverifikasi apakah request berasal dari Admin yang terautentikasi
 * Mendukung header Authorization Bearer maupun HTTP cookie sportify_admin_token
 */
export async function getAdminFromRequest(request) {
  // 1. Cek Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const admin = verifyAdminSession(token);
    if (admin) return { admin, token };
  }

  // 2. Cek cookie sportify_admin_token
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("sportify_admin_token");
    if (tokenCookie && tokenCookie.value) {
      const admin = verifyAdminSession(tokenCookie.value);
      if (admin) return { admin, token: tokenCookie.value };
    }
  } catch (err) {
    // Abaikan jika konteks cookie tidak tersedia
  }

  return { admin: null, token: null };
}

