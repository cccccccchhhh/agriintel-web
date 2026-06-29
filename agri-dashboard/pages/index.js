// pages/index.js
import Head from "next/head";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Link from "next/link";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { getKabupatenList, getKomoditasList, getStats, getAllKabupatenLite, getAllRekomendasi } from "../lib/data";
import { TREN_LABEL } from "../lib/constants";

const ChoroplethMap = dynamic(() => import("../components/ChoroplethMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 glass-card animate-pulse rounded-2xl flex items-center justify-center text-emerald-200/60 font-bold">
      Memuat Peta Interaktif Indonesia...
    </div>
  ),
});

export default function Home({ kabupatenList, komoditasList, stats, allKabupaten }) {
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
        <title>AgriDiv — Platform Rekomendasi Diversifikasi Pertanian Presisi</title>
      </Head>

      {/* HERO SECTION - ULTRA PREMIUM UNIFIED FLOATING GLASS */}
      <section className="grain relative overflow-hidden rounded-3xl glass-panel px-6 py-14 md:py-20 text-center mb-10 animate-fade-in shadow-2xl border-2 border-[#bef264]/30">
        {/* Glow Ambient Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#22c55e]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#bef264]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-[13px] font-black text-[#bef264] bg-[#bef264]/20 border border-[#bef264]/40 px-5 py-2 rounded-full mb-6 animate-float shadow-[0_0_15px_rgba(190,242,100,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bef264] animate-pulse"></span>
            Sistem Keputusan Presisi · {stats.n_kabupaten_total} Kabupaten/Kota Terintegrasi
          </span>
          
          <h1 className="text-[38px] md:text-[58px] leading-[1.1] font-black tracking-tight text-white max-w-4xl mx-auto drop-shadow-lg">
            Platform Rekomendasi Diversifikasi Tanam<br />
            untuk <span className="bg-gradient-to-r from-[#22c55e] via-emerald-200 to-[#bef264] bg-clip-text text-transparent relative">Ketahanan Pangan Indonesia</span>
          </h1>
          
          <p className="mt-6 text-[16px] md:text-[18px] leading-relaxed text-emerald-100/90 max-w-2xl mx-auto font-medium">
            Mengintegrasikan pemodelan iklim musiman (SARIMAX), kesesuaian biofisik lahan (FAO/ECOCROP), dan Explainable AI (SHAP) untuk mitigasi risiko iklim serta optimalisasi pendapatan petani.
          </p>

          {/* UNIFIED MASTER FLOATING SEARCH & FILTER CAPSULE BAR */}
          <div className="mt-10 max-w-2xl mx-auto space-y-3">
            <SearchBar
              kabupatenList={filteredKabupaten}
              autoFocus
              showChips={true}
              mode="kabupaten"
              placeholder="Cari kabupaten/kota, mis. Garut…"
              provinsi={provinsi}
              setProvinsi={setProvinsi}
              provinsiList={provinsiList}
            />
            {provinsi && (
              <p className="text-[13px] text-[#bef264] font-black animate-fade-in pt-1">
                📍 Menampilkan <strong>{filteredKabupaten.length}</strong> kabupaten/kota di <strong>{provinsi}</strong>.{" "}
                <button onClick={() => setProvinsi("")} className="underline text-emerald-200/80 hover:text-white ml-1">
                  Reset Filter
                </button>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* STAT CARDS SECTION */}
      <section id="wilayah" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label={provinsi ? "Wilayah Dianalisis" : "Total Kabupaten/Kota"}
          value={displayStats.n_kabupaten_total}
          icon="📍"
          iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30"
        />
        <StatCard
          label="Rekomendasi Kuat (S1)"
          value={displayStats.n_kabupaten_rekomendasi_kuat}
          sub="wilayah dengan opsi prospek tinggi"
          color="#bef264"
          icon="✅"
          iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30"
        />
        <StatCard
          label="Rekomendasi Lemah (S2)"
          value={displayStats.n_kabupaten_rekomendasi_lemah}
          sub="wilayah berprospek moderat"
          color="#fbbf24"
          icon="⚠️"
          iconBg="bg-amber-500/20 text-amber-300 border border-amber-500/30"
        />
        <StatCard
          label="Komoditas Terverifikasi"
          value={displayStats.n_komoditas}
          color="#38bdf8"
          icon="🌾"
          iconBg="bg-sky-500/20 text-sky-300 border border-sky-500/30"
        />
      </section>

      {/* PETA INTERAKTIF INDONESIA SECTION */}
      <section className="glass-panel rounded-3xl p-6 mb-10 shadow-xl animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="text-[12px] font-extrabold uppercase tracking-[0.25em] text-[#bef264] mb-1">Sebaran Geografis Kesesuaian</div>
            <h2 className="text-[22px] md:text-[26px] font-black text-white">Peta Pemetaan Kesesuaian Komoditas Indonesia</h2>
            <p className="text-[13px] text-emerald-200/80 mt-1 font-medium">Arahkan kursor pada wilayah untuk melihat akumulasi komoditas sesuai (S1/S2), atau klik untuk mengakses laporan spasial lengkap.</p>
          </div>
        </div>
        <ChoroplethMap kabupatenData={allKabupaten} />
      </section>

      {/* BLOK KOMODITAS TREN */}
      <section id="komoditas" className="glass-panel rounded-3xl p-6 mb-10 shadow-xl animate-fade-in delay-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="text-[12px] font-extrabold uppercase tracking-[0.25em] text-[#bef264] mb-1">Dinamika Ekonomi Pasar</div>
            <h2 className="text-[22px] md:text-[26px] font-black text-white">Kluster Komoditas Berdasarkan Tren Permintaan</h2>
            <p className="text-[13px] text-emerald-200/80 mt-1 font-medium">Pilih kategori tren untuk menganalisis pergerakan konsumsi nasional dan proyeksi pertumbuhan tiap kelompok tanaman.</p>
          </div>
          <Link href="/komoditas" className="inline-flex items-center gap-2 rounded-full border border-[#bef264]/40 bg-[#22c55e]/20 px-5 py-2.5 text-[13px] font-extrabold text-[#bef264] shadow-md hover:bg-[#22c55e]/35 transition-all duration-300">
            Buka Portal Komoditas →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Naik Signifikan", label: "Pertumbuhan Signifikan", value: trendCounts.naik_signifikan || 0, tone: "bg-emerald-950/60 border-emerald-500/40", accent: "text-[#bef264]" },
            { title: "Naik Lemah", label: "Pertumbuhan Moderat", value: trendCounts.naik_lemah || 0, tone: "bg-amber-950/60 border-amber-500/40", accent: "text-amber-300" },
            { title: "Turun Lemah", label: "Kelesuan Moderat", value: trendCounts.turun_lemah || 0, tone: "bg-orange-950/60 border-orange-500/40", accent: "text-orange-300" },
            { title: "Turun Signifikan", label: "Kelesuan Signifikan", value: trendCounts.turun_signifikan || 0, tone: "bg-rose-950/60 border-rose-500/40", accent: "text-rose-300" },
          ].map((card) => (
            <div key={card.title} className={`${card.tone} rounded-3xl border p-5 shadow-lg backdrop-blur-md`}>
              <div className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-emerald-200/70 mb-2">{card.label}</div>
              <div className={`text-[36px] font-black ${card.accent}`}>{card.value}</div>
              <p className="text-[12px] text-emerald-200/70 mt-2 font-medium">Komoditas dalam kluster ini.</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="tentang" className="grid gap-6 lg:grid-cols-3 mb-10 animate-fade-in delay-150">
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-[#bef264] border border-emerald-500/30 flex items-center justify-center text-2xl mb-4">📊</div>
          <h3 className="text-[18px] font-black text-white mb-2">Integrasi Data Multi-Pilar</h3>
          <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">Memadukan data iklim historis BMKG, survei tanah FAO, dan tren konsumsi BPS untuk keputusan berbasis sains.</p>
        </div>
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-[#bef264] border border-emerald-500/30 flex items-center justify-center text-2xl mb-4">🌾</div>
          <h3 className="text-[18px] font-black text-white mb-2">Presisi Agroekologi Wilayah</h3>
          <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">Evaluasi kesesuaian spesifik hingga tingkat kabupaten untuk mencegah kegagalan tanam akibat salah komoditas.</p>
        </div>
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-[#bef264] border border-emerald-500/30 flex items-center justify-center text-2xl mb-4">⚡</div>
          <h3 className="text-[18px] font-black text-white mb-2">Transparansi Model (XAI)</h3>
          <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">Dilengkapi atribusi SHAP waterfall untuk menyajikan alasan kuantitatif di balik setiap angka rekomendasi.</p>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c2417] via-[#143d27] to-[#166534] border border-[#bef264]/40 px-8 py-12 md:py-14 text-center shadow-2xl animate-fade-in delay-200 mb-6">
        <div className="grain absolute inset-0 opacity-10"></div>
        <div className="relative z-10">
          <h3 className="text-[26px] md:text-[36px] font-black tracking-tight text-white leading-tight">
            Ingin Menganalisis Kesesuaian Lahan Mandiri?
          </h3>
          <p className="text-[15px] text-emerald-100/90 mt-3.5 max-w-xl mx-auto font-semibold leading-relaxed">
            Gunakan kalkulator berbasis aturan (Rule-Based Evaluation) untuk memasukkan parameter pH, curah hujan, suhu, dan elevasi spesifik lahan Anda.
          </p>
          <Link
            href="/ruled-based"
            className="mt-7 inline-flex items-center gap-2 bg-gradient-to-r from-[#bef264] to-[#a3e635] hover:brightness-110 text-[#08140c] text-[15px] font-black px-7 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(190,242,100,0.4)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Evaluasi Lahan Anda Sekarang →
          </Link>
          <p className="text-[12px] text-emerald-200/80 mt-3.5 font-bold">Gratis · Tanpa Autentikasi · Hasil Instan</p>
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

  const allKabupaten = getAllKabupatenLite();

  return {
    props: {
      kabupatenList: kabupatenListWithFlags,
      komoditasList,
      stats: getStats(),
      allKabupaten,
    },
  };
}
