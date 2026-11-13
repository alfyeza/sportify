const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const KATEGORI_VALID = [
  "Padel",
  "Tennis",
  "Badminton",
  "Mini Soccer",
];

// =====================================================
// HELPER
// =====================================================

function getStorage(key, fallback = []) {
  try {
    if (typeof window === "undefined") return fallback;

    return JSON.parse(
      localStorage.getItem(key) || JSON.stringify(fallback)
    );
  } catch {
    return fallback;
  }
}

function getCurrentUser() {
  return getStorage("sportify_user", null);
}

function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

function getBody(options) {
  try {
    if (!options.body) return {};

    if (options.body instanceof FormData) {
      return Object.fromEntries(options.body.entries());
    }

    return JSON.parse(options.body);
  } catch {
    throw new Error("Format data tidak valid.");
  }
}

function saveVenues(venues) {
  localStorage.setItem(
    "sportify_mitra_venues",
    JSON.stringify(venues)
  );
}

function saveUser(user) {
  localStorage.setItem("sportify_user", JSON.stringify(user));

  if (user.role) {
    localStorage.setItem("sportify_role", user.role);
  }

  window.dispatchEvent(new Event("sportify-auth-change"));
}

function requireLogin() {
  const token = getToken();

  if (!token) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  return token;
}

function requireMitra() {
  requireLogin();

  const user = getCurrentUser();

  const role =
    user?.role ||
    localStorage.getItem("sportify_role") ||
    "";

  if (role.toLowerCase() !== "mitra") {
    throw new Error(
      "Akses ditolak. Fitur ini hanya untuk Mitra."
    );
  }

  return user;
}

function validateKategori(kategori) {
  if (!Array.isArray(kategori) || kategori.length === 0) {
    throw new Error("Pilih minimal satu kategori olahraga.");
  }

  const kategoriTidakValid = kategori.filter(
    (item) => !KATEGORI_VALID.includes(item)
  );

  if (kategoriTidakValid.length > 0) {
    throw new Error("Kategori olahraga tidak valid.");
  }
}

// =====================================================
// MOCK API
// =====================================================

async function mockApiRequest(endpoint, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  // =====================================================
  // 1. MOCK CERITA PENGGUNA
  // =====================================================

  if (endpoint === "/cerita-pengguna") {
    if (method === "GET") {
      return {
        success: true,
        data: getStorage("sportify_stories"),
      };
    }

    if (method === "POST") {
      requireLogin();

      const body = getBody(options);
      const user = getCurrentUser();

      if (!body.rating || !body.cerita?.trim()) {
        throw new Error("Rating dan cerita wajib diisi.");
      }

      const rating = Number(body.rating);

      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating harus antara 1 sampai 5.");
      }

      const cerita = body.cerita.trim();

      if (cerita.length < 20 || cerita.length > 1000) {
        throw new Error(
          "Cerita harus terdiri dari 20 sampai 1000 karakter."
        );
      }

      const stories = getStorage("sportify_stories");

      const newStory = {
        id: "STR-" + Date.now(),
        nama: user?.fullName || "Pengguna Sportify",
        email: user?.email || "",
        rating,
        cerita,
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
        message: "Cerita berhasil dikirim dan menunggu persetujuan.",
      };
    }
  }

  // =====================================================
  // 2. MOCK LOGIN
  // =====================================================

  if (endpoint === "/auth/login" && method === "POST") {
    const body = getBody(options);

    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      throw new Error("Email dan password wajib diisi.");
    }

    const existingUsers = getStorage("sportify_users");

    const found = existingUsers.find(
      (user) => user.email?.toLowerCase() === email
    );

    // Akun demo hanya untuk pengujian frontend.
    // Login sungguhan harus diverifikasi oleh backend.
    if (found && found.password !== password) {
      throw new Error("Email atau password salah.");
    }

    const user = found
      ? {
        id: found.id,
        fullName: found.fullName,
        email: found.email,
        phone: found.phone,
        role: found.role,
      }
      : {
        id: "USR-" + Date.now(),
        fullName: email.split("@")[0].replace(/[._]/g, " "),
        email,
        phone: "081234567890",
        role: "penyewa",
      };

    const token = "mock-token-" + Date.now();

    localStorage.setItem("token", token);
    saveUser(user);

    return {
      success: true,
      token,
      user,
      message: "Login berhasil (mode demo).",
    };
  }

  // =====================================================
  // 3. MOCK REGISTER
  // =====================================================

  if (endpoint === "/auth/register" && method === "POST") {
    const body = getBody(options);

    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!body.fullName?.trim()) {
      throw new Error("Nama lengkap wajib diisi.");
    }

    if (!email || !password) {
      throw new Error("Email dan password wajib diisi.");
    }

    if (!["penyewa", "mitra"].includes(body.role || "penyewa")) {
      throw new Error("Role pengguna tidak valid.");
    }

    const existingUsers = getStorage("sportify_users");

    const emailExists = existingUsers.some(
      (user) => user.email?.toLowerCase() === email
    );

    if (emailExists) {
      throw new Error("Email sudah terdaftar.");
    }

    const newUser = {
      id: "USR-" + Date.now(),
      fullName: body.fullName.trim(),
      email,
      phone: body.phone || "",
      password,
      role: body.role || "penyewa",
    };

    existingUsers.push(newUser);

    localStorage.setItem(
      "sportify_users",
      JSON.stringify(existingUsers)
    );

    const { password: ignoredPassword, ...safeUser } = newUser;

    const token = "mock-token-" + Date.now();

    localStorage.setItem("token", token);
    saveUser(safeUser);

    return {
      success: true,
      token,
      user: safeUser,
      message: "Registrasi berhasil (mode demo).",
    };
  }

  // =====================================================
  // 4. MOCK PROFILE / ME
  // =====================================================

  if (endpoint === "/auth/me" && method === "GET") {
    requireLogin();

    const user = getCurrentUser();

    if (!user) {
      throw new Error("Data pengguna tidak ditemukan.");
    }

    return {
      success: true,
      user,
    };
  }

  // =====================================================
  // 5. MOCK UPDATE PROFILE
  // =====================================================

  if (
    [
      "/auth/me",
      "/auth/profile",
      "/users/profile",
    ].includes(endpoint) &&
    ["PUT", "PATCH"].includes(method)
  ) {
    requireLogin();

    const body = getBody(options);
    const currentUser = getCurrentUser();

    if (!currentUser) {
      throw new Error("Data pengguna tidak ditemukan.");
    }

    const updated = {
      ...currentUser,
      ...body,

      // Role dan email tidak boleh diganti melalui profil.
      role: currentUser.role,
      email: currentUser.email,
    };

    saveUser(updated);

    return {
      success: true,
      user: updated,
      message: "Profil berhasil diperbarui.",
    };
  }

  // =====================================================
  // 6. MOCK KELOLA LAPANGAN MITRA
  // =====================================================

  if (
    endpoint === "/mitra/lapangan" ||
    endpoint.startsWith("/mitra/lapangan/")
  ) {
    const currentUser = requireMitra();

    const ownerId =
      currentUser.id ||
      currentUser.email ||
      "mitra-default";

    let venues = getStorage("sportify_mitra_venues");

    // GET DAFTAR LAPANGAN

    if (
      endpoint === "/mitra/lapangan" &&
      method === "GET"
    ) {
      const myVenues = venues.filter(
        (venue) => venue.ownerId === ownerId
      );

      return {
        success: true,
        data: myVenues,
        message: "Daftar lapangan berhasil dimuat.",
      };
    }

    // POST TAMBAH LAPANGAN

    if (
      endpoint === "/mitra/lapangan" &&
      method === "POST"
    ) {
      const body = getBody(options);

      if (!body.nama?.trim()) {
        throw new Error("Nama venue wajib diisi.");
      }

      if (!body.lokasi?.trim()) {
        throw new Error("Lokasi wajib diisi.");
      }

      if (!body.alamat?.trim()) {
        throw new Error("Alamat lengkap wajib diisi.");
      }

      validateKategori(body.kategori);

      const harga = Number(body.harga);

      if (!Number.isFinite(harga) || harga <= 0) {
        throw new Error("Harga per sesi harus lebih dari 0.");
      }

      const newVenue = {
        ...body,
        id: "VEN-" + Date.now(),
        ownerId,
        harga,
        status: "pending",
        tanggalDibuat: new Date().toISOString(),
        tanggalDiperbarui: new Date().toISOString(),
      };

      venues.unshift(newVenue);
      saveVenues(venues);

      return {
        success: true,
        data: newVenue,
        message: "Lapangan berhasil ditambahkan.",
      };
    }

    // AMBIL ID LAPANGAN DARI URL

    const venueId = decodeURIComponent(
      endpoint.replace("/mitra/lapangan/", "").split("/")[0]
    );

    const venueIndex = venues.findIndex(
      (venue) =>
        String(venue.id) === String(venueId) &&
        venue.ownerId === ownerId
    );

    if (venueIndex === -1) {
      throw new Error("Lapangan tidak ditemukan.");
    }

    // GET DETAIL LAPANGAN

    if (method === "GET") {
      return {
        success: true,
        data: venues[venueIndex],
      };
    }

    // PUT / PATCH EDIT LAPANGAN

    if (method === "PUT" || method === "PATCH") {
      const body = getBody(options);

      const updatedVenue = {
        ...venues[venueIndex],
        ...body,
        id: venues[venueIndex].id,
        ownerId,
        harga:
          body.harga !== undefined
            ? Number(body.harga)
            : venues[venueIndex].harga,
        tanggalDiperbarui: new Date().toISOString(),
      };

      if (body.kategori !== undefined) {
        validateKategori(body.kategori);
      }

      if (
        !Number.isFinite(updatedVenue.harga) ||
        updatedVenue.harga <= 0
      ) {
        throw new Error("Harga per sesi harus lebih dari 0.");
      }

      venues[venueIndex] = updatedVenue;
      saveVenues(venues);

      return {
        success: true,
        data: updatedVenue,
        message: "Data lapangan berhasil diperbarui.",
      };
    }

    // DELETE LAPANGAN

    if (method === "DELETE") {
      const deletedVenue = venues[venueIndex];

      venues.splice(venueIndex, 1);
      saveVenues(venues);

      return {
        success: true,
        data: deletedVenue,
        message: "Lapangan berhasil dihapus.",
      };
    }
  }

  throw new Error(
    `Endpoint ${endpoint} belum tersedia pada mock API.`
  );
}

// =====================================================
// API REQUEST UTAMA
// =====================================================

export async function apiRequest(endpoint, options = {}) {
  // MODE DEMO TANPA BACKEND

  if (!API_URL) {
    if (typeof window === "undefined") {
      throw new Error("API hanya dapat dijalankan di browser dalam mode demo.");
    }

    return mockApiRequest(endpoint, options);
  }

  // REQUEST KE BACKEND ASLI

  try {
    const token = getToken();
    const isFormData =
      typeof FormData !== "undefined" &&
      options.body instanceof FormData;

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    // Jangan memasang Content-Type untuk FormData.
    // Browser akan membuat boundary multipart secara otomatis.
    if (!isFormData && options.body !== undefined) {
      headers["Content-Type"] =
        headers["Content-Type"] || "application/json";
    }

    const response = await fetch(
      `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
      {
        ...options,
        headers,
      }
    );

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.error ||
        "Terjadi kesalahan pada server."
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