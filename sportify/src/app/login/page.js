import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            PlayCourt
          </Link>

          <h1 className="text-2xl font-bold text-dark-text mt-6">
            Selamat Datang!
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Login untuk mulai memesan lapangan olahraga.
          </p>
        </div>

        <form className="space-y-5">
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
              Password
            </label>

            <input
              type="password"
              placeholder="Masukkan password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="button"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Daftar sekarang
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