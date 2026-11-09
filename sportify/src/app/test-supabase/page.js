
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabasePage() {
  const [status, setStatus] = useState("Memeriksa koneksi...");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("sport_categories")
        .select("*")
        .limit(5);

      if (error) {
        setStatus("Koneksi atau query gagal");
        setError(error.message);
        return;
      }

      setStatus("Koneksi Supabase berhasil!");
      setData(data);
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">
          Pengujian Koneksi Supabase
        </h1>

        <p className="mb-4">
          Status: <strong>{status}</strong>
        </p>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            <p className="font-semibold">Pesan error:</p>
            <p>{error}</p>
          </div>
        )}

        {data.length > 0 && (
          <div>
            <h2 className="mb-2 font-semibold">
              Data sport_categories:
            </h2>

            <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {!error && data.length === 0 && status === "Koneksi Supabase berhasil!" && (
          <p>
            Koneksi berhasil, tetapi tabel belum memiliki data yang dapat
            dibaca.
          </p>
        )}
      </div>
    </main>
  );
}
