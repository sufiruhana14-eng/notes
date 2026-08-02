# Notes App

Web notes ala Mac Notes: login, folder, rich text editor, auto-save, search.
Stack: Next.js + Supabase + Vercel.

## 1. Setup Supabase

1. Buka [supabase.com](https://supabase.com) → New Project.
2. Masuk ke **SQL Editor** → New query → tempel isi file `supabase/schema.sql` → Run.
   Ini bikin tabel `folders` & `notes` plus Row Level Security (tiap user cuma bisa lihat notes-nya sendiri).
3. Masuk ke **Authentication → Providers**, pastikan **Email** aktif.
   - (Opsional) Matikan "Confirm email" di **Authentication → Sign In / Providers → Email** kalau mau langsung login tanpa verifikasi email dulu pas testing.
4. Masuk ke **Project Settings → API**, catat:
   - `Project URL` → jadi `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → jadi `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Jalanin lokal

1. Copy `.env.local.example` jadi `.env.local`, isi dengan value dari langkah di atas.
2. `npm install`
3. `npm run dev` → buka `http://localhost:3000`

## 3. Deploy

**Upload ke GitHub** (manual via web, sesuai kebiasaan):
1. Bikin repo baru di GitHub.
2. Upload semua isi folder `notes-app` ini (drag & drop di halaman repo, atau "uploading an existing file").
   Pastikan `.env.local` **tidak** ikut ke-upload (sudah otomatis di-ignore kalau pakai `git`, tapi kalau upload manual via web, cek dulu).

**Deploy ke Vercel:**
1. Buka [vercel.com/new](https://vercel.com/new) → import repo GitHub tadi.
2. Di step "Environment Variables", tambahin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy.
4. Balik ke Supabase → **Authentication → URL Configuration** → tambahin domain Vercel kamu (`https://xxx.vercel.app`) ke **Site URL** dan **Redirect URLs**, biar link konfirmasi email & callback jalan di production.

Tiap kali habis ubah kode dan upload ulang ke GitHub, jangan lupa cek Vercel auto-redeploy atau redeploy manual.

## Struktur

- `src/proxy.ts` — proteksi route (redirect ke `/login` kalau belum login), setara "middleware" di Next.js 16.
- `src/lib/supabase/` — Supabase client (browser, server, proxy).
- `src/app/login`, `src/app/signup` — halaman auth email+password.
- `src/app/notes` — halaman utama, fetch data awal di server lalu render `NotesApp`.
- `src/components/NotesApp.tsx` — state utama: folders, notes, search, auto-save.
- `src/components/Sidebar.tsx` — daftar folder + notes + search box.
- `src/components/NoteEditor.tsx` — rich text editor (Tiptap).
- `supabase/schema.sql` — schema tabel + RLS policies.
