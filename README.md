# Contoh undangan statis

Undangan ini dibuat dengan HTML, CSS, dan JavaScript biasa. Tidak memakai Next.js, TypeScript, API route, server-side rendering, paket npm, atau environment variable.

## Jalankan build

Gunakan Node.js 18 atau yang lebih baru:

```sh
npm run build
```

Build menyalin halaman ke `dist/`. Semua gambar/ilustrasi yang dipakai berada di `public/assets-dummy/`; skrip build menyalinnya ke lokasi aset pada hasil `dist/`. Path gambar di HTML/CSS relatif terhadap halaman. Tidak ada aset audio pada contoh ini.

## Deploy ke GitHub

Buka terminal pada folder `outputs`. Jika folder ini belum menjadi repository:

```sh
git init
git add .
git commit -m "Prepare invitation for deployment"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Ganti URL repository dengan alamat repository GitHub Anda. Jika repository sudah ada, cukup commit perubahan dan push ke branch yang dipakai.

## Deploy ke Vercel

1. Masuk ke Vercel dan pilih **Add New → Project**.
2. Import repository GitHub yang baru dibuat.
3. Pilih **Other** sebagai Framework Preset dan `.` sebagai Root Directory jika `outputs` adalah root repository.
4. Gunakan Build Command `npm run build` dan Output Directory `dist`. Nilai ini sudah dicantumkan di `vercel.json`.
5. Pilih **Deploy**. Push baru ke branch produksi akan memicu deployment berikutnya.

Vercel menyajikan isi output directory sebagai aset statis; konfigurasi build dan output dapat disimpan di `vercel.json`. Lihat [konfigurasi Vercel](https://vercel.com/docs/project-configuration/vercel-json) dan [panduan deploy repository](https://vercel.com/docs/git).

## Catatan framework

Proyek ini tidak memakai fitur server, jadi tidak ada API route atau `searchParams` server-side yang perlu dipertahankan. Build statis biasa cocok untuk Vercel. `output: 'export'` adalah opsi khusus Next.js dan tidak diperlukan di proyek ini; jika kelak dipindahkan ke Next.js tanpa fitur server, opsi tersebut dapat dipakai untuk ekspor statis.
