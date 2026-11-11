const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint, options = {}) {
  // Jika URL backend belum dikonfigurasi, gunakan mock auth fallback di browser untuk demo/prototyping
  if (!API_URL) {
    if (typeof window !== "undefined") {
      // 1. Mock Login
      if (endpoint === "/auth/login" && options.method === "POST") {
        const body = JSON.parse(options.body || "{}");
        const existingUsers = JSON.parse(
          localStorage.getItem("sportify_users") || "[]"
        );
        const found = existingUsers.find(
          (u) => u.email.toLowerCase() === (body.email || "").toLowerCase()
        );

        const user = found || {
          fullName: (body.email || "user").split("@")[0].replace(/[._]/g, " "),
          email: body.email,
          phone: "081234567890",
        };

        const token = "mock-token-" + Date.now();
        localStorage.setItem("token", token);
        localStorage.setItem("sportify_user", JSON.stringify(user));
        window.dispatchEvent(new Event("sportify-auth-change"));

        return {
          success: true,
          token,
          user,
          message: "Login berhasil (mode demo)",
        };
      }

      // 2. Mock Register
      if (endpoint === "/auth/register" && options.method === "POST") {
        const body = JSON.parse(options.body || "{}");
        const existingUsers = JSON.parse(
          localStorage.getItem("sportify_users") || "[]"
        );

        const newUser = {
          fullName: body.fullName || body.name || "User Sportify",
          email: body.email,
          phone: body.phone || "081234567890",
          password: body.password,
        };

        existingUsers.push(newUser);
        localStorage.setItem("sportify_users", JSON.stringify(existingUsers));

        const token = "mock-token-" + Date.now();
        localStorage.setItem("token", token);
        localStorage.setItem("sportify_user", JSON.stringify(newUser));
        window.dispatchEvent(new Event("sportify-auth-change"));

        return {
          success: true,
          token,
          user: newUser,
          message: "Registrasi berhasil (mode demo)",
        };
      }

      // 3. Mock Profile / Me
      if (endpoint === "/auth/me" && (!options.method || options.method === "GET")) {
        const savedUser = localStorage.getItem("sportify_user");
        if (savedUser) {
          try {
            return { success: true, user: JSON.parse(savedUser) };
          } catch {
            // ignore JSON parse error
          }
        }

        const fallbackUser = {
          fullName: "Pengguna Sportify",
          email: "user@sportify.id",
          phone: "081234567890",
        };
        return { success: true, user: fallbackUser };
      }

      // 4. Mock Update Profile
      if (
        (endpoint === "/auth/me" || endpoint === "/auth/profile") &&
        (options.method === "PUT" || options.method === "PATCH")
      ) {
        const body = JSON.parse(options.body || "{}");
        let currentUser = {};
        try {
          currentUser = JSON.parse(
            localStorage.getItem("sportify_user") || "{}"
          );
        } catch {
          currentUser = {};
        }

        const updated = { ...currentUser, ...body };
        localStorage.setItem("sportify_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("sportify-auth-change"));

        return {
          success: true,
          user: updated,
          message: "Profil berhasil diperbarui",
        };
      }
    }

    throw new Error("URL Backend belum dikonfigurasi.");
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || "Terjadi kesalahan pada server."
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke server. Periksa koneksi internet."
      );
    }

    throw error;
  }
}
