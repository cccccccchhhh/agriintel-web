// pages/index.js
import Head from "next/head";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Link from "next/link";
import { useState, useMemo } from "react";
import { getKabupatenList, getKomoditasList, getStats, getAllRekomendasi } from "../lib/data";
import { TREN_LABEL } from "../lib/constants";

export default function Home({ kabupatenList, komoditasList, stats }) {
  const [provinsi, setProvinsi] = useState("");
  const sortedKomoditas = [...komoditasList].sort((a, b) => b.slope - a.slope);
  const trendCounts = useMemo(
    () =>
      sortedKomoditas.reduce((acc, item) => {
        acc[item.tren] = (acc[item.tren] || 0) + 1;
        return acc;
      }, {}),
    [sortedKomoditas]
  );

  const provinsiList = useMemo(() => {
    const set = new Set(kabupatenList.map((k) => k.provinsi));
    return [...set].sort();
  }, [kabupatenList]);

  const filteredKabupaten = useMemo(
    () => (provinsi ? kabupatenList.filter((k) => k.provinsi === provinsi) : kabupatenList),
    [provinsi, kabupatenList]
  );

  const displayStats = useMemo(() => {
    if (!provinsi) return stats;
    return {
      n_kabupaten_total: filteredKabupaten.length,
      n_kabupaten_rekomendasi_kuat: filteredKabupaten.filter((k) => k.has_kuat).length,
      n_kabupaten_rekomendasi_lemah: filteredKabupaten.filter((k) => k.has_lemah).length,
      n_komoditas: stats.n_komoditas,
    };
  }, [provinsi, filteredKabupaten, stats]);


  return (
    <Layout>
      <Head>
        <title>AgriRekomendasi — Rekomendasi Tanam Berbasis Data</title>
      </Head>

      {/* HERO SECTION */}
      <section className="grain relative overflow-hidden rounded-3xl border border-[#166534]/10 bg-white/50 backdrop-blur-sm px-6 py-12 md:py-16 text-center mb-8 animate-fade-in">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-bold text-[#166534] bg-[#22c55e]/12 border border-[#166534]/15 px-4 py-1.5 rounded-full mb-6 animate-float">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
          Data terkini · {stats.n_kabupaten_total} kabupaten/kota
        </span>
        <h1 className="text-[36px] md:text-[48px] leading-[1.1] font-extrabold tracking-tight text-[#143d27] max-w-3xl mx-auto animate-float">
          Rekomendasi Komoditas Tanam<br />
          untuk <span className="text-[#166534] relative">Petani Indonesia<span className="absolute left-0 -bottom-1 w-full h-[6px] bg-[#22c55e]/30 rounded-full -z-10"></span></span>
        </h1>
        <p className="mt-5 text-[15px] md:text-[16px] leading-relaxed text-[#46604f] max-w-xl mx-auto font-medium">
          Cari tahu komoditas paling cocok untuk wilayahmu berdasarkan data iklim, kesesuaian tanah, dan tren harga pasar nasional.
        </p>

        {/* SEARCH BAR & FILTER PROVINSI */}
        <div className="mt-8 max-w-xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              className="w-full sm:w-48 bg-white border border-[#166534]/20 rounded-3xl px-4 py-3 text-[14px] font-bold text-[#1a2e22] outline-none focus:border-[#166534]/40 focus:ring-2 focus:ring-[#166534]/10 transition-shadow duration-300 shadow-[0_15px_35px_-25px_rgba(22,101,52,0.45)]"
            >
              <option value="">Semua Provinsi</option>
              {provinsiList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="flex-1">
              <SearchBar kabupatenList={filteredKabupaten} autoFocus showChips={true} />
            </div>
          </div>
          {provinsi && (
            <p className="text-[12.5px] text-[#166534] font-bold animate-fade-in">
              📍 Menampilkan <strong>{filteredKabupaten.length}</strong> kabupaten/kota di <strong>{provinsi}</strong>.{" "}
              <button onClick={() => setProvinsi("")} className="underline text-[#8a9e92] hover:text-[#166534] ml-1">
                Reset Filter
              </button>
            </p>
          )}
        </div>
      </section>

      {/* STAT CARDS SECTION */}
      <section id="wilayah" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label={provinsi ? "Kab/Kota di Provinsi Ini" : "Kabupaten/Kota Dianalisis"}
          value={displayStats.n_kabupaten_total}
          icon="📍"
          iconBg="bg-[#22c55e]/15 text-[#166534]"
        />
        <StatCard
          label="Rekomendasi Kuat"
          value={displayStats.n_kabupaten_rekomendasi_kuat}
          sub="kabupaten dengan ≥1 komoditas kuat"
          color="#16a34a"
          icon="✅"
          iconBg="bg-[#16a34a]/12 text-[#16a34a]"
        />
        <StatCard
          label="Rekomendasi Lemah"
          value={displayStats.n_kabupaten_rekomendasi_lemah}
          sub="kabupaten dengan ≥1 komoditas lemah"
          color="#ca8a04"
          icon="⚠️"
          iconBg="bg-[#eab308]/15 text-[#ca8a04]"
        />
        <StatCard
          label="Komoditas Dianalisis"
          value={displayStats.n_komoditas}
          color="#0369a1"
          icon="🌾"
          iconBg="bg-[#0369a1]/10 text-[#0369a1]"
        />
      </section>

      <section id="komoditas" className="bg-white rounded-3xl border border-[#166534]/10 p-6 mb-10 shadow-sm animate-fade-in delay-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#6a8174] mb-2">Komoditas Dashboard</div>
            <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#143d27]">Blok Komoditas Berdasarkan Tren Permintaan</h2>
            <p className="text-[13px] text-[#6a8174] mt-1">Pilih kategori untuk melihat komoditas naik atau turun, lalu buka detail untuk melihat grafik demand dan syarat tumbuh.</p>
          </div>
          <Link href="/komoditas" className="inline-flex items-center gap-2 rounded-full border border-[#166534]/15 bg-white px-4 py-2 text-[13px] font-bold text-[#166534] shadow-sm hover:shadow-md transition-all duration-300">
            Buka Dashboard Komoditas
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Naik Signifikan", label: "Naik Signifikan", value: trendCounts.naik_signifikan || 0, tone: "bg-[#dcfce7]", accent: "text-[#15803d]" },
            { title: "Naik Lemah", label: "Naik Lemah", value: trendCounts.naik_lemah || 0, tone: "bg-[#fef9c3]", accent: "text-[#a16207]" },
            { title: "Turun Lemah", label: "Turun Lemah", value: trendCounts.turun_lemah || 0, tone: "bg-[#ffedd5]", accent: "text-[#c2410c]" },
            { title: "Turun Signifikan", label: "Turun Signifikan", value: trendCounts.turun_signifikan || 0, tone: "bg-[#fee2e2]", accent: "text-[#b91c1c]" },
          ].map((card) => (
            <div key={card.title} className={`${card.tone} rounded-3xl border border-[#166534]/10 p-5 shadow-sm`}>
              <div className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#4f6354] mb-2">{card.label}</div>
              <div className={`text-[32px] font-extrabold ${card.accent}`}>{card.value}</div>
              <p className="text-[13px] text-[#526558] mt-2">Komoditas dalam kategori ini.</p>
            </div>
          ))}
        </div>
      </section>

      {/* KOMODITAS PREVIEW SECTION */}
      <section className="bg-white rounded-3xl border border-[#166534]/10 p-6 mb-10 shadow-sm animate-fade-in delay-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#6a8174] mb-2">Ringkasan Komoditas</div>
            <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#143d27]">Komoditas Paling Menonjol</h2>
            <p className="text-[13px] text-[#6a8174] mt-1">Lihat komoditas dengan tren demand terkuat dan temukan detail kecocokan untuk setiap pilihan.</p>
          </div>
          <Link href="/komoditas" className="inline-flex items-center gap-2 rounded-full border border-[#166534]/15 bg-white px-4 py-2 text-[13px] font-bold text-[#166534] shadow-sm hover:shadow-md transition-all duration-300">
            Jelajahi Dashboard Komoditas
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sortedKomoditas.slice(0, 6).map((k) => (
            <Link
              key={k.komoditas}
              href={`/komoditas/${encodeURIComponent(k.komoditas)}`}
              className="group block rounded-3xl border border-[#166534]/10 bg-[#f8faf5] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[13px] uppercase tracking-[0.2em] text-[#6a8174] mb-2">{k.tren.replace("_", " ")}</p>
                  <h3 className="text-[18px] font-extrabold text-[#143d27]">{k.komoditas}</h3>
                </div>
                <span className="text-[24px]">🌾</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-[13px] text-[#4f6354]">
                <span className="font-semibold">Slope: {(k.slope * 100).toFixed(2)}%</span>
                <Badge text={TREN_LABEL[k.tren]?.label || k.tren} color={TREN_LABEL[k.tren]?.color || "#6b7280"} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="tentang" className="grid gap-6 lg:grid-cols-3 mb-10 animate-fade-in delay-150">
        <div className="glass-panel rounded-3xl p-6 border border-[#166534]/10 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#16a34a]/10 text-[#166534] flex items-center justify-center text-xl mb-4">📊</div>
          <h3 className="text-[18px] font-extrabold text-[#143d27] mb-2">Data Pertanian Terpercaya</h3>
          <p className="text-sm text-[#536d5c] leading-relaxed">Analisis iklim, tanah, dan permintaan pasar digabungkan untuk rekomendasi komoditas yang lebih relevan.</p>
        </div>
        <div className="glass-panel rounded-3xl p-6 border border-[#166534]/10 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#bef264]/10 text-[#166534] flex items-center justify-center text-xl mb-4">🌾</div>
          <h3 className="text-[18px] font-extrabold text-[#143d27] mb-2">Fokus Wilayah & Komoditas</h3>
          <p className="text-sm text-[#536d5c] leading-relaxed">Pilih kabupaten atau komoditas untuk melihat rekomendasi dan detail kecocokan secara cepat.</p>
        </div>
        <div className="glass-panel rounded-3xl p-6 border border-[#166534]/10 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#236a3d]/10 text-[#166534] flex items-center justify-center text-xl mb-4">⚡</div>
          <h3 className="text-[18px] font-extrabold text-[#143d27] mb-2">Cepat & Mudah Digunakan</h3>
          <p className="text-sm text-[#536d5c] leading-relaxed">Desain halaman bersih dan intuitif, cocok untuk petani yang ingin keputusan cepat tanpa kompleksitas.</p>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-[#166534] px-8 py-12 md:py-14 text-center shadow-[0_12px_40px_-15px_rgba(22,101,52,0.4)] animate-fade-in delay-200 mb-6">
        <div className="grain absolute inset-0 opacity-15"></div>
        <div className="relative z-10">
          <h3 className="text-[26px] md:text-[32px] font-extrabold tracking-tight text-white leading-tight">
            Punya lahan sendiri tapi bingung mau ditanami apa?
          </h3>
          <p className="text-[15px] text-[#bfe6cb] mt-3.5 max-w-xl mx-auto font-semibold leading-relaxed">
            Masukkan kondisi tanah, curah hujan, elevasi, dan suhu secara manual untuk mendapatkan kalkulasi kesesuaian lahan yang akurat.
          </p>
          <Link
            href="/ruled-based"
            className="mt-6 inline-flex items-center gap-2 bg-[#bef264] hover:bg-[#a3e635] text-[#143d27] text-[15px] font-extrabold px-6 py-3 rounded-2xl shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Cek Lahan Anda Sekarang →
          </Link>
          <p className="text-[12px] text-[#9fd3b0] mt-3 font-semibold">Gratis · Tanpa Perlu Registrasi</p>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const komoditasList = getKomoditasList();
  const rekomendasiAll = getAllRekomendasi();
  const rekMap = Object.fromEntries(rekomendasiAll.map((r) => [r.kode_kab, r]));

  const kabupatenListWithFlags = getKabupatenList().map((k) => {
    const rek = rekMap[k.kode_kab];
    return {
      ...k,
      has_kuat: rek ? (rek.rekomendasi_kuat?.length ?? 0) > 0 : false,
      has_lemah: rek ? (rek.rekomendasi_lemah?.length ?? 0) > 0 : false,
    };
  });

  return {
    props: {
      kabupatenList: kabupatenListWithFlags,
      komoditasList,
      stats: getStats(),
    },
  };
}
