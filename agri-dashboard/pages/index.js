// pages/index.js
import Head from "next/head";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import ForecastChart from "../components/ForecastChart";
import Link from "next/link";
import { useState, useMemo } from "react";
import { getKabupatenList, getKomoditasList, getStats, getAllNamaKomoditas, getAllRekomendasi } from "../lib/data";
import { TREN_LABEL } from "../lib/constants";

const EMOJI_MAP = {
  padi: "🌾", jagung: "🌽", kedelai: "🫘", "kacang tanah": "🥜",
  "kacang hijau": "🫘", ubi: "🍠", tebu: "🎋", "kelapa sawit": "🌴",
  kelapa: "🥥", karet: "🌿", kakao: "🍫", kopi: "☕", teh: "🍵",
  pisang: "🍌", mangga: "🥭", nanas: "🍍", pepaya: "🍈",
  durian: "🍈", cabai: "🌶️", bawang: "🧅", tomat: "🍅",
  kentang: "🥔", wortel: "🥕", sawi: "🥬", bayam: "🥬",
  semangka: "🍉", melon: "🍈", lada: "🌶️", cengkeh: "🌸",
  pala: "🌰", vanili: "🌿", jahe: "🫚", kunyit: "🫚",
  kapas: "🪴", tembakau: "🍃",
};

function getEmoji(name) {
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(k)) return v;
  }
  return "🌱";
}

export default function Home({ kabupatenList, komoditasList, stats, namaKomoditasMap }) {
  const [provinsi, setProvinsi] = useState("");
  const [selectedKomoditas, setSelectedKomoditas] = useState(null);
  const [chartType, setChartType] = useState("line");
  const sortedKomoditas = [...komoditasList].sort((a, b) => b.slope - a.slope);

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

  const selectedForecastValues = useMemo(() => {
    const kom = selectedKomoditas || sortedKomoditas[0] || { slope: 0 };
    const slope = kom.slope ?? 0;
    return ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"].map((_, idx) => {
      const base = 44 + idx * 1.4;
      const drift = slope * 16 * idx;
      const wave = Math.sin(idx * 1.15) * 2.2;
      return Math.max(12, Math.round(base + drift + wave));
    });
  }, [selectedKomoditas, sortedKomoditas]);

  const selectedKomoditasName = selectedKomoditas ? selectedKomoditas.komoditas : (sortedKomoditas[0]?.komoditas || "Komoditas");

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

      {/* COMMODITY CHART PANEL */}
      <section id="komoditas" className="bg-white rounded-3xl border border-[#166534]/10 p-6 mb-10 shadow-sm animate-fade-in delay-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#6a8174] mb-2">Preview Komoditas</div>
            <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#143d27] animate-float">{selectedKomoditasName}</h2>
            <p className="text-[13px] text-[#6a8174] mt-1">Klik nama komoditas di tabel untuk memuat forecast line chart.</p>
          </div>
          <button
            type="button"
            onClick={() => setChartType((prev) => (prev === "line" ? "area" : "line"))}
            className="inline-flex items-center gap-2 rounded-full border border-[#166534]/15 bg-white px-4 py-2 text-[13px] font-bold text-[#166534] shadow-sm hover:shadow-md transition-all duration-300"
          >
            {chartType === "line" ? "Switch ke Area" : "Switch ke Line"}
          </button>
        </div>
        <div className="rounded-3xl border border-[#166534]/10 bg-[#f9faf7] p-4">
          <ForecastChart
            labels={["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]}
            values={selectedForecastValues}
            name={selectedKomoditasName}
            unit="pt"
            color="#16a34a"
            chartType={chartType}
          />
        </div>
      </section>

      {/* COMMODITY TRENDS TABLE */}
      <section className="bg-white rounded-3xl border border-[#166534]/10 overflow-hidden shadow-sm p-6 mb-10 animate-fade-in delay-100">
        <div className="mb-5">
          <h2 className="text-[20px] font-extrabold text-[#143d27]">Tren Permintaan Nasional per Komoditas</h2>
          <p className="text-[13px] text-[#6a8174] mt-1 font-semibold">
            Klasifikasi berdasarkan slope regresi tren harga pasar nasional tahunan (confidence interval 95%).
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#166534]/8">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#f3f8f4] text-[#5a7265] text-[12px] font-bold uppercase tracking-wider">
                <th className="px-5 py-3.5">Komoditas</th>
                <th className="px-5 py-3.5">Tren Harga</th>
                <th className="px-5 py-3.5">Slope Kenaikan</th>
                <th className="px-5 py-3.5">Model Forecasting</th>
              </tr>
            </thead>
            <tbody>
              {sortedKomoditas.map((k, idx) => (
                <tr key={k.komoditas} className="border-t border-[#166534]/6 hover:bg-[#faf9f4]/60 transition-colors duration-150">
                  <td className="px-5 py-4 font-bold text-[14.5px] text-[#1a2e22]">
                    <button
                      type="button"
                      onClick={() => setSelectedKomoditas(k)}
                      className="flex items-center gap-2 text-left text-[#166534] hover:text-[#12502a] hover:underline focus:outline-none"
                    >
                      <span className="text-[16px]">{getEmoji(k.komoditas)}</span>
                      <span>{k.komoditas}</span>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      text={TREN_LABEL[k.tren]?.label || k.tren}
                      color={TREN_LABEL[k.tren]?.color || "#6b7280"}
                    />
                  </td>
                  <td className="px-5 py-4 font-extrabold text-[14px] text-gray-700 tabular-nums">
                    {k.slope > 0 ? "+" : ""}{(k.slope * 100).toFixed(2)}% <span className="text-[11px] font-medium text-gray-400">/thn</span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    {k.model_type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  const namaKomoditasLur = getAllNamaKomoditas();

  const namaKomoditasMap = {};
  for (const k of komoditasList) {
    const lower = k.komoditas.toLowerCase();
    const match = namaKomoditasLur.find(
      (nama) => nama.toLowerCase() === lower || lower.includes(nama.toLowerCase())
    );
    if (match) namaKomoditasMap[k.komoditas] = match;
  }

  const rekomendasiAll = getAllRekomendasi();
  const rekMap = Object.fromEntries(rekomendasiAll.map((r) => [r.kode_kab, r]));

  const kabupatenList = getKabupatenList().map((k) => {
    const rek = rekMap[k.kode_kab];
    return {
      ...k,
      has_kuat: rek ? (rek.rekomendasi_kuat?.length ?? 0) > 0 : false,
      has_lemah: rek ? (rek.rekomendasi_lemah?.length ?? 0) > 0 : false,
    };
  });

  return {
    props: {
      kabupatenList,
      komoditasList,
      stats: getStats(),
      namaKomoditasMap,
    },
  };
}
