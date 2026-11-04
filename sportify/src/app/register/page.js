import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            PlayCourt
          </Link>

          <h1 className="text-2xl font-bold text-dark-text mt-6">
            Buat Akun Baru
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Daftar sekarang dan mulai pesan lapangan favoritmu.
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nama Lengkap
            </label>

            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Masukkan email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Nomor HP
            </label>

            <input
              type="tel"
              placeholder="Masukkan nomor HP"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Buat password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Konfirmasi Password
            </label>

            <input
              type="password"
              placeholder="Ulangi password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="button"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-primary">
            ← Kembali ke Beranda
          </Link>
        </div>

      </div>
    </main>
  );
}