const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint, options = {}) {
  // Jika backend belum dikonfigurasi, gunakan mock API untuk demo
  if (!API_URL) {
    if (typeof window !== "undefined") {
      const method = options.method || "GET";

      // 1. Mock Cerita Pengguna
      if (endpoint === "/cerita-pengguna") {
        // Ambil daftar cerita
        if (method === "GET") {
          const stories = JSON.parse(
            localStorage.getItem("sportify_stories") || "[]"
          );

          return {
            success: true,
            data: stories,
          };
        }

        // Kirim cerita baru
        if (method === "POST") {
          const token = localStorage.getItem("token");

          if (!token) {
            throw new Error("Silakan login terlebih dahulu.");
          }

          const body = JSON.parse(options.body || "{}");

          let user = {};

          try {
            user = JSON.parse(
              localStorage.getItem("sportify_user") || "{}"
            );
          } catch {
            user = {};
          }

          if (!body.rating || !body.cerita?.trim()) {
            throw new Error("Rating dan cerita wajib diisi.");
          }

          const stories = JSON.parse(
            localStorage.getItem("sportify_stories") || "[]"
          );

          const newStory = {
            id: "STR-" + Date.now(),
            nama: user.fullName || "Pengguna Sportify",
            email: user.email || "",
            rating: Number(body.rating),
            cerita: body.cerita.trim(),
            kategori:
              body.kategori || "Pengalaman Menggunakan Sportify",
            tanggal: new Date().toISOString(),
            status: "pending",
          };

          stories.unshift(newStory);

          localStorage.setItem(
            "sportify_stories",
            JSON.stringify(stories)
          );

          return {
            success: true,
            data: newStory,
            message:
              "Cerita berhasil dikirim dan menunggu persetujuan.",
          };
        }
      }

      // 2. Mock Login
      if (endpoint === "/auth/login" && method === "POST") {
        const body = JSON.parse(options.body || "{}");

        const existingUsers = JSON.parse(
          localStorage.getItem("sportify_users") || "[]"
        );

        const found = existingUsers.find(
          (u) =>
            u.email.toLowerCase() ===
            (body.email || "").toLowerCase()
        );

        const user = found || {
          fullName: (body.email || "user")
            .split("@")[0]
            .replace(/[._]/g, " "),
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

      // 3. Mock Register
      if (endpoint === "/auth/register" && method === "POST") {
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

        localStorage.setItem(
          "sportify_users",
          JSON.stringify(existingUsers)
        );

        const token = "mock-token-" + Date.now();

        localStorage.setItem("token", token);
        localStorage.setItem(
          "sportify_user",
          JSON.stringify(newUser)
        );

        window.dispatchEvent(new Event("sportify-auth-change"));

        return {
          success: true,
          token,
          user: newUser,
          message: "Registrasi berhasil (mode demo)",
        };
      }

      // 4. Mock Profile / Me
      if (
        endpoint === "/auth/me" &&
        (!options.method || method === "GET")
      ) {
        const savedUser = localStorage.getItem("sportify_user");

        if (savedUser) {
          try {
            return {
              success: true,
              user: JSON.parse(savedUser),
            };
          } catch {
            // Abaikan kesalahan JSON
          }
        }

        const fallbackUser = {
          fullName: "Pengguna Sportify",
          email: "user@sportify.id",
          phone: "081234567890",
        };

        return {
          success: true,
          user: fallbackUser,
        };
      }

      // 5. Mock Update Profile
      if (
        (endpoint === "/auth/me" ||
          endpoint === "/auth/profile") &&
        (method === "PUT" || method === "PATCH")
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

        const updated = {
          ...currentUser,
          ...body,
        };

        localStorage.setItem(
          "sportify_user",
          JSON.stringify(updated)
        );

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

  // Request ke backend asli
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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