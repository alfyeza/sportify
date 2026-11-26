import { supabase } from "./supabase";

const KATEGORI_VALID = ["Padel", "Tennis", "Badminton", "Mini Soccer"];

// =====================================================
// HELPER & FORMATTER
// =====================================================

function getBody(options) {
  try {
    if (!options?.body) return {};
    if (options.body instanceof FormData) {
      return Object.fromEntries(options.body.entries());
    }
    return typeof options.body === "string"
      ? JSON.parse(options.body)
      : options.body;
  } catch {
    throw new Error("Format data tidak valid.");
  }
}

function syncUserCache(user) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("sportify_user", JSON.stringify(user));
    if (user.role) localStorage.setItem("sportify_role", user.role);
  } else {
    localStorage.removeItem("sportify_user");
    localStorage.removeItem("sportify_role");
    localStorage.removeItem("token");
  }
  window.dispatchEvent(new Event("sportify-auth-change"));
}

function mapProfileToUser(profile) {
  return {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone || "",
    role: profile.role || "penyewa",
    avatarUrl: profile.avatar_url || "",
  };
}

function mapLapangan(row) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    nama: row.nama,
    kategori: Array.isArray(row.kategori) ? row.kategori : [row.kategori].filter(Boolean),
    lokasi: row.lokasi,
    alamat: row.alamat,
    deskripsi: row.deskripsi || "",
    fasilitas: Array.isArray(row.fasilitas) ? row.fasilitas : [],
    harga: Number(row.harga),
    jamBuka: row.jam_buka,
    jamTutup: row.jam_tutup,
    fotoUrl: row.foto_url || "/images/lapangan/default.jpg",
    gambar: row.foto_url || "/images/lapangan/default.jpg",
    fotoDetail: Array.isArray(row.foto_detail) ? row.foto_detail : [],
    status: row.status,
    tanggalDibuat: row.created_at,
    tanggalDiperbarui: row.updated_at,
  };
}

function mapBooking(row) {
  const statusMap = {
    menunggu: "Pending",
    menunggu_konfirmasi: "Pending",
    dikonfirmasi: "Confirmed",
    selesai: "Completed",
    dibatalkan: "Cancelled",
    ditolak: "Rejected",
  };
  const paymentMap = {
    belum_bayar: "Pending",
    menunggu_pembayaran: "Pending",
    menunggu_verifikasi: "Pending",
    lunas: "Paid",
    gagal: "Failed",
    dibatalkan: "Cancelled",
  };

  const jamFormatted = `${(row.jam_mulai || "").slice(0, 5)} - ${(row.jam_selesai || "").slice(0, 5)}`;
  const namaTempat = row.lapangan?.nama || "Lapangan Olahraga";
  const namaKategori = Array.isArray(row.lapangan?.kategori)
    ? row.lapangan.kategori.join(", ")
    : row.lapangan?.kategori || "Olahraga";

  return {
    id: row.id,
    kodeBooking: row.kode_booking,
    bookingId: row.kode_booking || row.id,
    userId: row.user_id,
    lapanganId: row.lapangan_id,
    tempat: namaTempat,
    lapangan: namaTempat,
    kategori: namaKategori,
    tanggal: row.tanggal_main,
    tanggalMain: row.tanggal_main,
    jam: jamFormatted,
    jamMulai: row.jam_mulai,
    jamSelesai: row.jam_selesai,
    durasi: `${row.durasi_jam} Jam`,
    durasiJam: Number(row.durasi_jam),
    total: Number(row.total_biaya),
    totalBiaya: Number(row.total_biaya),
    statusBooking: statusMap[row.status_pemesanan] || row.status_pemesanan,
    statusPemesanan: row.status_pemesanan,
    statusPembayaran: paymentMap[row.status_pembayaran] || row.status_pembayaran,
    statusBayarDb: row.status_pembayaran,
    buktiBayarPath: row.bukti_bayar_path || "",
    catatan: row.catatan || "",
    pemesan: row.profiles
      ? {
        fullName: row.profiles.full_name,
        email: row.profiles.email,
        phone: row.profiles.phone,
      }
      : null,
    lapanganDetail: row.lapangan ? mapLapangan(row.lapangan) : null,
    createdAt: row.created_at,
  };
}
export async function getBuktiBayarSignedUrl(pathOrUrl, expiresIn = 60) {
  if (!pathOrUrl) return null;
  if (typeof pathOrUrl === "string" && pathOrUrl.startsWith("http")) {
    return pathOrUrl;
  }

  const bucket = pathOrUrl.includes("/") ? pathOrUrl.split("/")[0] : "bukti-pembayaran";
  const objectPath = pathOrUrl.includes("/")
    ? pathOrUrl.split("/").slice(1).join("/")
    : pathOrUrl;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresIn);

  if (error) {
    console.error("Gagal membuat signed URL bukti bayar:", error.message);
    return null;
  }

  return data?.signedUrl || null;
}
function validateKategori(kategori) {
  const list = Array.isArray(kategori) ? kategori : [kategori];
  if (list.length === 0) {
    throw new Error("Pilih minimal satu kategori olahraga.");
  }
  const invalid = list.filter((item) => !KATEGORI_VALID.includes(item));
  if (invalid.length > 0) {
    throw new Error("Kategori olahraga tidak valid. Pilihan: " + KATEGORI_VALID.join(", "));
  }
  return list;
}

async function getAuthenticatedProfile() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    syncUserCache(null);
    throw new Error("Silakan login terlebih dahulu.");
  }

  const { data: profile, error: profError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profError || !profile) {
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Pengguna",
      phone: user.user_metadata?.phone || "",
      role: user.user_metadata?.role || "penyewa",
    };
  }

  return profile;
}

// =====================================================
// API REQUEST UTAMA (TERHUBUNG KE SUPABASE)
// =====================================================

export async function apiRequest(endpoint, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const [cleanPath, queryString] = endpoint.split("?");
  const params = new URLSearchParams(queryString || "");

  // -----------------------------------------------------
  // 1. AUTH: LOGIN
  // -----------------------------------------------------
  if (cleanPath === "/auth/login" && method === "POST") {
    const body = getBody(options);
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      throw new Error("Email dan password wajib diisi.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error("Email atau password salah.");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    const mappedUser = mapProfileToUser(
      profile || {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || email.split("@")[0],
        phone: data.user.user_metadata?.phone || "",
        role: data.user.user_metadata?.role || "penyewa",
      }
    );

    if (typeof window !== "undefined" && data.session?.access_token) {
      localStorage.setItem("token", data.session.access_token);
    }
    syncUserCache(mappedUser);

    return {
      success: true,
      token: data.session?.access_token,
      user: mappedUser,
      message: "Login berhasil.",
    };
  }

  // -----------------------------------------------------
  // 2. AUTH: REGISTER
  // -----------------------------------------------------
  if (cleanPath === "/auth/register" && method === "POST") {
    const body = getBody(options);
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    const fullName = (body.fullName || "").trim();
    const role = body.role || "penyewa";

    if (!fullName) throw new Error("Nama lengkap wajib diisi.");
    if (!email || !password) throw new Error("Email dan password wajib diisi.");
    if (password.length < 6) throw new Error("Password minimal 6 karakter.");
    if (!["penyewa", "mitra"].includes(role)) {
      throw new Error("Role pengguna tidak valid.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: body.phone || "",
          role,
        },
      },
    });

    if (error) {
      throw new Error(error.message || "Gagal mendaftar.");
    }

    const mappedUser = {
      id: data.user?.id,
      fullName,
      email,
      phone: body.phone || "",
      role,
    };

    if (typeof window !== "undefined" && data.session?.access_token) {
      localStorage.setItem("token", data.session.access_token);
    }
    syncUserCache(mappedUser);

    return {
      success: true,
      token: data.session?.access_token || null,
      user: mappedUser,
      message: "Registrasi berhasil. Silakan masuk.",
    };
  }

  // -----------------------------------------------------
  // 3. AUTH: LOGOUT
  // -----------------------------------------------------
  if (cleanPath === "/auth/logout" && method === "POST") {
    await supabase.auth.signOut();
    syncUserCache(null);
    return { success: true, message: "Logout berhasil." };
  }

  // -----------------------------------------------------
  // 4. AUTH: ME & UPDATE PROFILE
  // -----------------------------------------------------
  if (cleanPath === "/auth/me" && method === "GET") {
    const profile = await getAuthenticatedProfile();
    const mappedUser = mapProfileToUser(profile);
    syncUserCache(mappedUser);
    return { success: true, user: mappedUser };
  }

  if (
    ["/auth/me", "/auth/profile", "/users/profile"].includes(cleanPath) &&
    ["PUT", "PATCH"].includes(method)
  ) {
    const profile = await getAuthenticatedProfile();
    const body = getBody(options);

    const { data: updated, error } = await supabase
      .from("profiles")
      .update({
        full_name: body.fullName?.trim() || profile.full_name,
        phone: body.phone !== undefined ? body.phone : profile.phone,
      })
      .eq("id", profile.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const mappedUser = mapProfileToUser(updated);
    syncUserCache(mappedUser);

    return {
      success: true,
      user: mappedUser,
      message: "Profil berhasil diperbarui.",
    };
  }

  // -----------------------------------------------------
  // 5. CERITA PENGGUNA (TESTIMONI PUBLIK)
  // -----------------------------------------------------
  if (cleanPath === "/cerita-pengguna") {
    if (method === "GET") {
      const { data, error } = await supabase
        .from("cerita_pengguna")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return {
        success: true,
        data: data.map((item) => ({
          ...item,
          tanggal: item.created_at,
        })),
      };
    }

    if (method === "POST") {
      const profile = await getAuthenticatedProfile();
      const body = getBody(options);
      const rating = Number(body.rating);
      const cerita = (body.cerita || "").trim();

      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating harus antara 1 sampai 5.");
      }
      if (cerita.length < 20 || cerita.length > 1000) {
        throw new Error("Cerita harus terdiri dari 20 sampai 1000 karakter.");
      }

      const { data, error } = await supabase
        .from("cerita_pengguna")
        .insert({
          user_id: profile.id,
          nama: profile.full_name,
          email: profile.email,
          rating,
          cerita,
          kategori: body.kategori || "Pengalaman Menggunakan Sportify",
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      return {
        success: true,
        data: { ...data, tanggal: data.created_at },
        message: "Cerita berhasil dikirim.",
      };
    }
  }

  // -----------------------------------------------------
  // 6. DAFTAR & DETAIL LAPANGAN PUBLIK
  // -----------------------------------------------------
  if (cleanPath === "/lapangan" && method === "GET") {
    let query = supabase
      .from("lapangan")
      .select("*", { count: "exact" })
      .eq("status", "aktif")
      .order("created_at", { ascending: false });

    const kategoriFilter = params.get("kategori");
    if (kategoriFilter && kategoriFilter !== "Semua") {
      query = query.contains("kategori", [kategoriFilter]);
    }

    const searchQuery = params.get("q") || params.get("search");
    if (searchQuery && searchQuery.trim()) {
      query = query.or(
        `nama.ilike.%${searchQuery.trim()}%,lokasi.ilike.%${searchQuery.trim()}%,alamat.ilike.%${searchQuery.trim()}%`
      );
    }

    const page = parseInt(params.get("page") || "1", 10);
    const limit = parseInt(params.get("limit") || "50", 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return {
      success: true,
      data: (data || []).map(mapLapangan),
      total: count || 0,
      page,
      limit,
    };
  }

  if (cleanPath.startsWith("/lapangan/") && method === "GET") {
    const id = cleanPath.replace("/lapangan/", "");
    const { data, error } = await supabase
      .from("lapangan")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) throw new Error("Lapangan tidak ditemukan.");
    return { success: true, data: mapLapangan(data) };
  }

  // -----------------------------------------------------
  // 7. CEK JADWAL / SLOT TERISI
  // -----------------------------------------------------
  if (cleanPath === "/jadwal" && method === "GET") {
    const lapanganId = params.get("lapangan_id");
    const tanggal = params.get("tanggal");

    if (!lapanganId || !tanggal) {
      throw new Error("Parameter lapangan_id dan tanggal wajib diisi.");
    }

    try {
      const { data, error } = await supabase.rpc("get_slot_terisi", {
        p_lapangan_id: lapanganId,
        p_tanggal: tanggal,
      });

      if (!error && data) {
        return { success: true, data };
      }
    } catch {
      // Fallback manual jika RPC belum dibuat di Supabase
    }

    const [bookingsRes, blocksRes] = await Promise.all([
      supabase
        .from("pemesanan")
        .select("jam_mulai, jam_selesai, status_pemesanan")
        .eq("lapangan_id", lapanganId)
        .eq("tanggal_main", tanggal)
        .neq("status_pemesanan", "dibatalkan"),
      supabase
        .from("blokir_jadwal")
        .select("jam_mulai, jam_selesai, alasan")
        .eq("lapangan_id", lapanganId)
        .eq("tanggal", tanggal),
    ]);

    const combinedSlots = [
      ...(bookingsRes.data || []).map((b) => ({
        jam_mulai: b.jam_mulai,
        jam_selesai: b.jam_selesai,
        tipe: "pemesanan",
        keterangan: b.status_pemesanan,
      })),
      ...(blocksRes.data || []).map((bl) => ({
        jam_mulai: bl.jam_mulai,
        jam_selesai: bl.jam_selesai,
        tipe: "blokir",
        keterangan: bl.alasan,
      })),
    ];

    return { success: true, data: combinedSlots };
  }

  // -----------------------------------------------------
  // 8. PEMESANAN / BOOKING
  // -----------------------------------------------------
  if (cleanPath === "/booking") {
    const profile = await getAuthenticatedProfile();

    if (method === "GET") {
      let query = supabase
        .from("pemesanan")
        .select("*, lapangan(nama, lokasi, kategori, harga, foto_url, owner_id), profiles(full_name, email, phone)")
        .order("created_at", { ascending: false });

      if (profile.role === "penyewa") {
        query = query.eq("user_id", profile.id);
      } else if (profile.role !== "admin") {
        const { data: venues } = await supabase
          .from("lapangan")
          .select("id")
          .eq("owner_id", profile.id);
        const venueIds = (venues || []).map((v) => v.id);
        if (venueIds.length === 0) {
          return { success: true, data: [] };
        }
        query = query.in("lapangan_id", venueIds);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { success: true, data: (data || []).map(mapBooking) };
    }

    if (method === "POST") {
      const body = getBody(options);
      if (!body.lapangan_id || !body.tanggal_main || !body.jam_mulai || !body.jam_selesai) {
        throw new Error("Data pemesanan belum lengkap (lapangan, tanggal, jam wajib diisi).");
      }

      const durasi = Number(body.durasi_jam) || 1;
      const totalBiaya = Number(body.total_biaya);
      if (durasi <= 0 || totalBiaya < 0) {
        throw new Error("Durasi atau total biaya tidak valid.");
      }

      const { data: conflictBooking } = await supabase
        .from("pemesanan")
        .select("id")
        .eq("lapangan_id", body.lapangan_id)
        .eq("tanggal_main", body.tanggal_main)
        .neq("status_pemesanan", "dibatalkan")
        .or(
          `and(jam_mulai.gte.${body.jam_mulai},jam_mulai.lt.${body.jam_selesai}),and(jam_selesai.gt.${body.jam_mulai},jam_selesai.lte.${body.jam_selesai})`
        )
        .limit(1);

      if (conflictBooking && conflictBooking.length > 0) {
        throw new Error("Jadwal bentrok: Lapangan sudah dipesan pada slot waktu tersebut.");
      }

      const kodeBooking = body.kode_booking || `SPT-${Math.floor(100000 + Math.random() * 900000)}`;

      const { data, error } = await supabase
        .from("pemesanan")
        .insert({
          kode_booking: kodeBooking,
          user_id: profile.id,
          lapangan_id: body.lapangan_id,
          tanggal_main: body.tanggal_main,
          jam_mulai: body.jam_mulai,
          jam_selesai: body.jam_selesai,
          durasi_jam: durasi,
          total_biaya: totalBiaya,
          catatan: body.catatan || "",
          status_pemesanan: "menunggu",
          status_pembayaran: "belum_bayar",
        })
        .select("*, lapangan(nama, lokasi, kategori, harga, foto_url), profiles(full_name, email, phone)")
        .single();

      if (error) {
        if (error.message.includes("Benturan Jadwal") || error.message.includes("conflict")) {
          throw new Error("Benturan Jadwal: Lapangan tidak tersedia pada jam tersebut.");
        }
        throw new Error(error.message);
      }

      return {
        success: true,
        data: mapBooking(data),
        message: "Pemesanan berhasil dibuat dan menunggu konfirmasi pengelola.",
      };
    }
  }

  if (cleanPath.startsWith("/booking/")) {
    const bookingId = cleanPath.replace("/booking/", "").split("/")[0];
    const profile = await getAuthenticatedProfile();

    if (method === "GET") {
      const { data, error } = await supabase
        .from("pemesanan")
        .select("*, lapangan(nama, lokasi, kategori, harga, foto_url), profiles(full_name, email, phone)")
        .eq("id", bookingId)
        .single();

      if (error || !data) throw new Error("Data pemesanan tidak ditemukan.");
      return { success: true, data: mapBooking(data) };
    }

    if (["PUT", "PATCH"].includes(method)) {
      const body = getBody(options);
      const allowedUpdates = {};

      if (profile.role === "penyewa") {
        if (body.status_pemesanan === "dibatalkan" || body.action === "cancel") {
          allowedUpdates.status_pemesanan = "dibatalkan";
          allowedUpdates.status_pembayaran = "dibatalkan";
        }
        if (body.bukti_bayar_path) {
          allowedUpdates.bukti_bayar_path = body.bukti_bayar_path;
          allowedUpdates.status_pembayaran = "menunggu_verifikasi";
        }
      } else {
        if (body.status_pemesanan) allowedUpdates.status_pemesanan = body.status_pemesanan;
        if (body.status_pembayaran) allowedUpdates.status_pembayaran = body.status_pembayaran;
        if (body.bukti_bayar_path) allowedUpdates.bukti_bayar_path = body.bukti_bayar_path;
      }

      const { data, error } = await supabase
        .from("pemesanan")
        .update(allowedUpdates)
        .eq("id", bookingId)
        .select("*, lapangan(nama, lokasi, kategori, harga, foto_url), profiles(full_name, email, phone)")
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) {
        throw new Error("Gagal memperbarui pesanan. Pastikan kebijakan akses database (RLS) sudah dijalankan.");
      }

      return {
        success: true,
        data: mapBooking(data),
        message: "Status pemesanan berhasil diperbarui.",
      };
    }
  }

  // -----------------------------------------------------
  // 9. DASHBOARD REKAP SEWA & STATISTIK MITRA / ADMIN
  // -----------------------------------------------------
  if (cleanPath === "/mitra/dashboard" && method === "GET") {
    const profile = await getAuthenticatedProfile();
    if (!["mitra", "admin"].includes(profile.role)) {
      throw new Error("Akses ditolak. Fitur ini hanya untuk Pengelola/Mitra.");
    }

    let venueQuery = supabase.from("lapangan").select("id");
    if (profile.role !== "admin") {
      venueQuery = venueQuery.eq("owner_id", profile.id);
    }

    const { data: venues } = await venueQuery;
    const venueIds = (venues || []).map((v) => v.id);

    let bookingQuery = supabase
      .from("pemesanan")
      .select("*, lapangan(nama, lokasi, kategori, harga), profiles(full_name, email, phone)")
      .order("created_at", { ascending: false });

    if (profile.role !== "admin") {
      if (venueIds.length > 0) {
        bookingQuery = bookingQuery.in("lapangan_id", venueIds);
      } else {
        return {
          success: true,
          data: {
            statistik: {
              totalPendapatan: 0,
              totalPemesanan: 0,
              bookingHariIni: 0,
              totalLapangan: 0,
              menungguKonfirmasi: 0,
              dikonfirmasi: 0,
              selesai: 0,
            },
            daftarBooking: [],
          },
        };
      }
    }

    const { data: allBookings, error: bErr } = await bookingQuery;
    if (bErr) throw new Error(bErr.message);

    const bookings = allBookings || [];
    const todayStr = new Date().toISOString().split("T")[0];
    let totalPendapatan = 0;
    let totalBookingHariIni = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let completedCount = 0;

    bookings.forEach((b) => {
      const biaya = Number(b.total_biaya) || 0;
      if (b.status_pembayaran === "lunas" || b.status_pemesanan === "selesai" || b.status_pemesanan === "dikonfirmasi") {
        totalPendapatan += biaya;
      }
      if (b.tanggal_main === todayStr) {
        totalBookingHariIni++;
      }
      if (b.status_pemesanan === "menunggu" || b.status_pemesanan === "menunggu_konfirmasi") {
        pendingCount++;
      } else if (b.status_pemesanan === "dikonfirmasi") {
        confirmedCount++;
      } else if (b.status_pemesanan === "selesai") {
        completedCount++;
      }
    });

    return {
      success: true,
      data: {
        statistik: {
          totalPendapatan,
          totalPemesanan: bookings.length,
          bookingHariIni: totalBookingHariIni,
          totalLapangan: venueIds.length,
          menungguKonfirmasi: pendingCount,
          dikonfirmasi: confirmedCount,
          selesai: completedCount,
        },
        daftarBooking: bookings.slice(0, 10).map(mapBooking),
      },
    };
  }

  // -----------------------------------------------------
  // 10. KELOLA & VERIFIKASI LAPANGAN MITRA / ADMIN
  // -----------------------------------------------------
  if (
    cleanPath === "/mitra/lapangan" ||
    cleanPath.startsWith("/mitra/lapangan/")
  ) {
    const profile = await getAuthenticatedProfile();
    if (!["mitra", "admin"].includes(profile.role)) {
      throw new Error("Akses ditolak. Fitur ini hanya untuk Pengelola/Mitra.");
    }

    if (cleanPath === "/mitra/lapangan" && method === "GET") {
      let query = supabase
        .from("lapangan")
        .select("*")
        .order("created_at", { ascending: false });

      if (profile.role !== "admin") {
        query = query.eq("owner_id", profile.id);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return {
        success: true,
        data: (data || []).map(mapLapangan),
        message: "Daftar lapangan berhasil dimuat.",
      };
    }

    if (cleanPath === "/mitra/lapangan" && method === "POST") {
      const body = getBody(options);
      if (!body.nama?.trim()) throw new Error("Nama venue wajib diisi.");
      if (!body.lokasi?.trim()) throw new Error("Lokasi wajib diisi.");
      if (!body.alamat?.trim()) throw new Error("Alamat lengkap wajib diisi.");

      const kategori = validateKategori(body.kategori);
      const harga = Number(body.harga);
      if (!Number.isFinite(harga) || harga <= 0) {
        throw new Error("Harga per sesi harus lebih dari 0.");
      }

      const initialStatus = profile.role === "admin" ? "aktif" : "menunggu_verifikasi";

      const { data, error } = await supabase
        .from("lapangan")
        .insert({
          owner_id: profile.id,
          nama: body.nama.trim(),
          lokasi: body.lokasi.trim(),
          alamat: body.alamat.trim(),
          deskripsi: body.deskripsi || "",
          fasilitas: Array.isArray(body.fasilitas) ? body.fasilitas : [],
          kategori,
          harga,
          jam_buka: body.jamBuka || "08:00",
          jam_tutup: body.jamTutup || "22:00",
          foto_url: body.fotoUrl || body.gambar || "/images/lapangan/default.jpg",
          status: initialStatus,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return {
        success: true,
        data: mapLapangan(data),
        message:
          profile.role === "admin"
            ? "Lapangan berhasil ditambahkan dan langsung aktif."
            : "Lapangan berhasil ditambahkan dan menunggu verifikasi Admin.",
      };
    }

    const venueId = cleanPath.replace("/mitra/lapangan/", "").split("/")[0];

    if (method === "GET") {
      const { data, error } = await supabase
        .from("lapangan")
        .select("*")
        .eq("id", venueId)
        .single();

      if (error || !data) throw new Error("Lapangan tidak ditemukan.");
      return { success: true, data: mapLapangan(data) };
    }

    if (method === "PUT" || method === "PATCH") {
      const body = getBody(options);
      const updates = {};

      if (body.nama !== undefined) updates.nama = body.nama.trim();
      if (body.lokasi !== undefined) updates.lokasi = body.lokasi.trim();
      if (body.alamat !== undefined) updates.alamat = body.alamat.trim();
      if (body.deskripsi !== undefined) updates.deskripsi = body.deskripsi;
      if (body.fasilitas !== undefined) updates.fasilitas = body.fasilitas;
      if (body.fotoUrl !== undefined) updates.foto_url = body.fotoUrl;
      if (body.gambar !== undefined && !body.fotoUrl) updates.foto_url = body.gambar;
      if (body.jamBuka !== undefined) updates.jam_buka = body.jamBuka;
      if (body.jamTutup !== undefined) updates.jam_tutup = body.jamTutup;

      if (body.status !== undefined) {
        if (["aktif", "ditolak", "menunggu_verifikasi"].includes(body.status) && profile.role !== "admin") {
          throw new Error("Hanya Administrator yang dapat mengubah status verifikasi lapangan.");
        }
        updates.status = body.status;
      }

      if (body.kategori !== undefined) updates.kategori = validateKategori(body.kategori);
      if (body.harga !== undefined) {
        const harga = Number(body.harga);
        if (!Number.isFinite(harga) || harga <= 0) {
          throw new Error("Harga per sesi harus lebih dari 0.");
        }
        updates.harga = harga;
      }

      const { data, error } = await supabase
        .from("lapangan")
        .update(updates)
        .eq("id", venueId)
        .select()
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) {
        throw new Error("Gagal memperbarui lapangan. Pastikan kebijakan akses database (RLS) sudah dijalankan.");
      }

      return {
        success: true,
        data: mapLapangan(data),
        message: "Data lapangan berhasil diperbarui.",
      };
    }

    if (method === "DELETE") {
      const { error } = await supabase
        .from("lapangan")
        .delete()
        .eq("id", venueId);

      if (error) throw new Error(error.message);
      return {
        success: true,
        message: "Lapangan berhasil dihapus.",
      };
    }
  }

  // -----------------------------------------------------
  // 11. BLOKIR JADWAL MITRA / ADMIN
  // -----------------------------------------------------
  if (
    cleanPath === "/mitra/blokir-jadwal" ||
    cleanPath.startsWith("/mitra/blokir-jadwal/")
  ) {
    const profile = await getAuthenticatedProfile();
    if (!["mitra", "admin"].includes(profile.role)) {
      throw new Error("Akses ditolak. Fitur ini hanya untuk Pengelola/Mitra.");
    }

    if (cleanPath === "/mitra/blokir-jadwal" && method === "GET") {
      const { data, error } = await supabase
        .from("blokir_jadwal")
        .select("*, lapangan(nama)")
        .order("tanggal", { ascending: true });

      if (error) throw new Error(error.message);
      return { success: true, data: data || [] };
    }

    if (cleanPath === "/mitra/blokir-jadwal" && method === "POST") {
      const body = getBody(options);
      if (!body.lapangan_id || !body.tanggal || !body.jam_mulai || !body.jam_selesai || !body.alasan) {
        throw new Error("Semua kolom blokir jadwal wajib diisi.");
      }

      const { data, error } = await supabase
        .from("blokir_jadwal")
        .insert({
          lapangan_id: body.lapangan_id,
          tanggal: body.tanggal,
          jam_mulai: body.jam_mulai,
          jam_selesai: body.jam_selesai,
          alasan: body.alasan.trim(),
          created_by: profile.id,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return {
        success: true,
        data,
        message: "Jadwal berhasil diblokir.",
      };
    }

    if (method === "DELETE") {
      const blokirId = cleanPath.replace("/mitra/blokir-jadwal/", "");
      const { error } = await supabase
        .from("blokir_jadwal")
        .delete()
        .eq("id", blokirId);

      if (error) throw new Error(error.message);
      return { success: true, message: "Blokir jadwal berhasil dihapus." };
    }
  }

  // -----------------------------------------------------
  // 12. KEUANGAN & PENCAIRAN DANA MITRA / ADMIN
  // -----------------------------------------------------
  if (
    cleanPath === "/mitra/keuangan" ||
    cleanPath === "/mitra/pencairan" ||
    cleanPath === "/mitra/keuangan/pencairan" ||
    cleanPath.startsWith("/mitra/pencairan/")
  ) {
    const profile = await getAuthenticatedProfile();
    if (!["mitra", "admin"].includes(profile.role)) {
      throw new Error("Akses ditolak. Fitur ini hanya untuk Pengelola/Mitra.");
    }

    if (method === "GET") {
      let venueQuery = supabase.from("lapangan").select("id");
      if (profile.role !== "admin") {
        venueQuery = venueQuery.eq("owner_id", profile.id);
      }
      const { data: venues } = await venueQuery;
      const venueIds = (venues || []).map((v) => v.id);

      let bookingQuery = supabase
        .from("pemesanan")
        .select("*, lapangan(nama, lokasi, kategori, harga), profiles(full_name, email, phone)")
        .order("created_at", { ascending: false });

      if (profile.role !== "admin") {
        if (venueIds.length > 0) {
          bookingQuery = bookingQuery.in("lapangan_id", venueIds);
        } else {
          bookingQuery = null;
        }
      }

      const bookingsRes = bookingQuery ? await bookingQuery : { data: [], error: null };
      if (bookingsRes.error) throw new Error(bookingsRes.error.message);

      let pencairanQuery = supabase
        .from("pencairan_dana")
        .select("*, profiles:mitra_id(full_name, email)")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return { success: true, data: data || [] };
    }
  }
}