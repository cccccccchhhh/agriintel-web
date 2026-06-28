# 🌾 AgriRekomendasi — Dashboard Rekomendasi Tanam

Bare-minimum Next.js dashboard buat petani: cari kabupaten → lihat profil lahan, forecast cuaca,
kesesuaian lahan (S1/S2/N), dan rekomendasi tanam (kuat/lemah) berbasis tren demand nasional.

## Struktur Project

```
agri-dashboard/
├── data/                    <- JSON hasil convert dari deploy_bundle CSV (sudah di-generate)
│   ├── kabupaten.json       <- profil tanah/cuaca + kelas S1/S2/N tiap kabupaten
│   ├── kabupaten_list.json  <- daftar ringkas buat search/dropdown
│   ├── rekomendasi.json     <- rekomendasi kuat/lemah + saran distribusi
│   ├── komoditas.json       <- tren demand nasional + syarat tumbuh per komoditas
│   ├── lur.json             <- syarat tumbuh mentah (dipakai tool Cek Manual)
│   ├── forecast_iklim.json  <- forecast curah hujan & suhu 12 bulan per kabupaten
│   └── stats.json           <- statistik ringkasan nasional (landing page)
├── scripts/
│   └── prepare_data.py      <- regenerate file di atas dari CSV deploy_bundle terbaru
├── lib/
│   ├── data.js              <- helper baca JSON (server-side only, getStaticProps)
│   ├── constants.js         <- label/warna tren & kelas (aman dipakai client)
│   ├── classify.js          <- logic S1/S2/N versi JS (dipakai tool Cek Manual)
│   └── summary.js           <- generator ringkasan bahasa manusia
├── components/               <- semua komponen UI
└── pages/
    ├── index.js              <- landing page (search + statistik + tren nasional)
    ├── kabupaten/[kode].js   <- dashboard per kabupaten (fitur utama)
    └── ruled-based.js        <- tool "Cek Manual" (isi indikator sendiri)
```

## Update Data (kalau notebook/model di-rerun lagi)

1. Download ulang `deploy_bundle.zip` dari Colab, extract folder `data_clean/`.
2. Jalankan:
   ```bash
   cd scripts
   python3 prepare_data.py /path/to/deploy_bundle/data_clean ../data
   ```
3. Commit perubahan di folder `data/`, push, Vercel auto-redeploy.

**File CSV yang dibutuhkan** (semua harus ada di folder yang di-pass ke `prepare_data.py`):
```
prediksi_komoditas_per_kabupaten.csv
rekomendasi_tanam_distribusi.csv
demand_grand_summary.csv
lur_expanded.csv
curah_hujan_forecast_12bln.csv
suhu_forecast_12bln.csv
```

## Jalanin Lokal

```bash
npm install
npm run dev
# buka http://localhost:3000
```

## Deploy ke Vercel

**Opsi A — via dashboard Vercel (paling gampang):**
1. Push project ini ke GitHub (repo baru).
2. Buka [vercel.com/new](https://vercel.com/new), import repo itu.
3. Framework Preset otomatis terdeteksi "Next.js" — biarkan default, klik Deploy.

**Opsi B — via CLI:**
```bash
npm install -g vercel
vercel        # ikuti prompt, pilih default settings
vercel --prod # buat production deploy
```

Gak perlu environment variable apapun — semua data statis (JSON), gak ada database/API eksternal.

## Catatan Desain

- **Semua halaman statis (SSG)** — di-generate pas `next build`, bukan server-rendered tiap
  request. Cepat & murah di-hosting Vercel (gratis tier cukup).
- **493 halaman kabupaten** di-generate semua (`getStaticPaths` + `fallback: false`). Build time
  ~10-15 detik, gak masalah.
- Tool **"Cek Manual"** (`/ruled-based`) jalan 100% di client (JS murni, `lib/classify.js`),
  gak hit server/API apapun — replika persis logic rule-based S1/S2/N dari notebook Python.
- Belum ada peta choropleth (butuh GeoJSON Indonesia, cukup berat) — bisa ditambah di iterasi
  berikutnya kalau mau.
- Chart pakai [recharts](https://recharts.org) — ringan, cukup buat line chart sederhana.

## Keterbatasan yang Perlu Diketahui (jujur ke pembaca/penguji)

- Rekomendasi "lemah" itu artinya tren demand secara titik-estimasi positif, tapi confidence
  interval 95% dari slope-nya masih menyentuh nol (n historis cuma 7-8 tahun) — bukan berarti
  pasti salah, cuma belum cukup bukti statistik buat dibilang "signifikan".
- ~23 kabupaten (dari 493) gak punya data forecast cuaca lengkap (histori terlalu pendek) —
  halaman kabupaten itu akan tetap tampil, tapi section forecast cuaca dikosongkan otomatis.
