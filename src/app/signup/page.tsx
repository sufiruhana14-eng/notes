"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { NotebookPen } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <h1 className="mb-2 text-lg font-semibold text-neutral-900">
            Cek email kamu
          </h1>
          <p className="text-sm text-neutral-600">
            Kami sudah kirim link konfirmasi ke <strong>{email}</strong>.
            Klik link itu buat aktifin akun, terus login.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-neutral-900 underline"
          >
            Balik ke login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-yellow-900">
            <NotebookPen size={24} />
          </div>
          <h1 className="text-xl font-semibold text-neutral-900">
            Bikin akun baru
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              placeholder="kamu@email.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              placeholder="minimal 6 karakter"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-500">
          Udah punya akun?{" "}
          <Link href="/login" className="font-medium text-neutral-900 underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
