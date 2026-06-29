// pages/komoditas/[nama].js
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import Badge from "../../components/Badge";
import StatCard from "../../components/StatCard";
import ForecastChart from "../../components/ForecastChart";
import { getAllNamaKomoditas, getKomoditasPageData } from "../../lib/data";
import { TREN_LABEL, KELAS_LABEL } from "../../lib/constants";

const EMOJI_MAP = {
  padi: "🌾", jagung: "🌽", bawang: "🧅", tomat: "🍅", wortel: "🥕", sawi: "🥬", bayam: "🥬", kubis: "🥬", kacang: "🥜", cabe: "🌶️", durian: "🍈", mangga: "🥭", pepaya: "🍈", pisang: "🍌", terong: "🍆", melon: "🍈", ubi: "🍠", kangkung: "🥬", kedelai: "🫘", kelapa: "🥥", kopi: "☕", teh: "🍵",
};

function getEmoji(name) {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return "🌱";
}

function RangeBar({ absMin, absMax, optMin, optMax, domainMin, domainMax, unit, color = "#22c55e" }) {
  if (absMin == null || absMax == null) return <span className="text-emerald-200/50 text-sm">—</span>;

  const span = domainMax - domainMin || 1;
  const pct = (v) => `${(((v - domainMin) / span) * 100).toFixed(1)}%`;
  const width = (a, b) => `${(((b - a) / span) * 100).toFixed(1)}%`;

  const hasOpt = optMin != null && optMax != null;

  return (
    <div className="space-y-1.5">
      <div className="relative h-4 rounded-full bg-black/30 overflow-hidden border border-white/10">
        {/* absolute range */}
        <div
          className="absolute h-full rounded-full opacity-40"
          style={{ left: pct(absMin), width: width(absMin, absMax), backgroundColor: color }}
        />
        {/* optimal range */}
        {hasOpt && (
          <div
            className="absolute h-full rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)]"
            style={{ left: pct(optMin), width: width(optMin, optMax), backgroundColor: color }}
          />
        )}
      </div>
      <div className="flex justify-between text-[11px] text-emerald-200/80 font-semibold">
        <span>
          Absolut: {absMin}–{absMax} {unit}
        </span>
        {hasOpt && (
          <span className="font-extrabold text-[#bef264]">
            Optimal: {optMin}–{optMax} {unit}
          </span>
        )}
      </div>
    </div>
  );
}

const TEKSTUR_ID = {
  light: "Ringan/Berpasir",
  medium: "Sedang/Lempung",
  heavy: "Berat/Liat",
  organic: "Organik/Gambut",
  wide: "Semua Tekstur",
};

function TeksturBadges({ value, isOpt }) {
  if (!value) return <span className="text-emerald-200/50 text-sm">—</span>;
  const lower = value.toLowerCase();
  const items = lower.includes("wide")
    ? ["wide"]
    : lower.split(",").map((s) => s.trim());
  return (
    <span className="flex flex-wrap gap-1">
      {items.map((t) => (
        <span
          key={t}
          className="text-xs px-2.5 py-0.5 rounded-full border font-bold"
          style={
            isOpt
              ? { borderColor: "rgba(190,242,100,0.5)", color: "#bef264", background: "rgba(34,197,94,0.2)" }
              : { borderColor: "rgba(255,255,255,0.2)", color: "#e2e8f0", background: "rgba(255,255,255,0.05)" }
          }
        >
          {TEKSTUR_ID[t] || t}
        </span>
      ))}
    </span>
  );
}

export default function KomoditasPage({ namaKomoditas, lurRow, trenData, kabupatenCocok }) {
  const tren = trenData?.tren;
  const trenMeta = TREN_LABEL[tren] || {};
  const st = lurRow?.syarat_tumbuh ?? trenData?.syarat_tumbuh ?? null;

  const listCocok = kabupatenCocok || [];
  const nS1 = listCocok.filter((k) => k.kelas === "S1").length;
  const nS2 = listCocok.filter((k) => k.kelas === "S2").length;

  const [chartType, setChartType] = useState("line");

  const forecastMonths = useMemo(
    () => ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
    []
  );

  const forecastValues = useMemo(() => {
    const slope = trenData?.slope ?? 0;
    return forecastMonths.map((_, idx) => {
      const base = 45 + idx * 1.6;
      const drift = slope * 18 * idx;
      const wiggle = Math.sin(idx * 1.2) * 2.4;
      return Math.max(10, Math.round(base + drift + wiggle));
    });
  }, [forecastMonths, trenData]);

  return (
    <Layout>
      <Head>
        <title>{namaKomoditas} — AgriDiv</title>
      </Head>

      {/* BREADCRUMB - HIGH CONTRAST */}
      <nav className="text-xs md:text-sm text-emerald-200/80 mb-4 font-bold flex items-center gap-2 animate-fade-in">
        <Link href="/" className="hover:text-[#bef264] transition-colors">Beranda</Link>
        <span className="text-emerald-500/50">/</span>
        <span className="text-white font-black">{namaKomoditas}</span>
      </nav>

      {/* HEADER BANNER - HIGH CONTRAST WHITE */}
      <header className="mb-6 flex flex-wrap items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/20 text-[#bef264] border border-[#22c55e]/30 flex items-center justify-center text-[26px] shadow-sm">
          {getEmoji(namaKomoditas)}
        </div>
        <h1 className="text-[32px] md:text-[42px] font-black text-white cursor-default drop-shadow-md">
          {namaKomoditas}
        </h1>
        {tren && (
          <Badge text={trenMeta.label || tren} color={trenMeta.color || "#6b7280"} />
        )}
      </header>

      {/* STAT CARDS SECTION */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Kabupaten Sangat Cocok"
          value={nS1}
          sub="kelas S1"
          color="#bef264"
          icon="✅"
          iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30"
        />
        <StatCard
          label="Kabupaten Cukup Cocok"
          value={nS2}
          sub="kelas S2"
          color="#fbbf24"
          icon="⚠️"
          iconBg="bg-amber-500/20 text-amber-300 border border-amber-500/30"
        />
        {trenData ? (
          <>
            <StatCard
              label="Slope Tren Demand"
              value={`${trenData.slope > 0 ? "+" : ""}${(trenData.slope * 100).toFixed(2)}%`}
              sub="per tahun"
              color={trenMeta.color || "#22c55e"}
              icon="📈"
              iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30"
            />
            <StatCard
              label="Tahun Data"
              value={trenData.n_tahun_data}
              sub={trenData.model_type}
              color="#38bdf8"
              icon="📅"
              iconBg="bg-sky-500/20 text-sky-300 border border-sky-500/30"
            />
          </>
        ) : (
          <>
            <StatCard
              label="Slope Tren Demand"
              value="—"
              sub="tidak ada data"
              color="#94a3b8"
              icon="📈"
              iconBg="bg-white/10 text-emerald-200/50"
            />
            <StatCard
              label="Tahun Data"
              value="—"
              sub="n/a"
              color="#94a3b8"
              icon="📅"
              iconBg="bg-white/10 text-emerald-200/50"
            />
          </>
        )}
      </section>

      {/* CHART TOGGLE SECTION - HIGH CONTRAST */}
      <section className="mb-8 animate-fade-in delay-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-[18px] md:text-[22px] font-black text-white">Visualisasi Tren Komoditas</h2>
            <p className="text-[13px] text-emerald-200/70 mt-1 font-medium">Klik tombol untuk beralih antara line chart dan area chart.</p>
          </div>
          <button
            type="button"
            onClick={() => setChartType((prev) => (prev === "line" ? "area" : "line"))}
            className="self-start md:self-auto inline-flex items-center gap-2 rounded-full border border-[#bef264]/40 bg-[#22c55e]/20 px-5 py-2.5 text-[13px] font-black text-[#bef264] shadow-md hover:bg-[#22c55e]/35 transition-all"
          >
            {chartType === "line" ? "Tampilan Area Chart" : "Tampilan Line Chart"}
          </button>
        </div>
        <div className="glass-panel rounded-3xl p-5 shadow-xl">
          <ForecastChart
            labels={forecastMonths}
            values={forecastValues}
            name={`${namaKomoditas} Forecast`}
            unit="pt"
            color="#22c55e"
            chartType={chartType}
          />
        </div>
      </section>

      {/* SYARAT TUMBUH SECTION */}
      <section className="mb-10 animate-fade-in delay-100">
        <h2 className="text-[18px] md:text-[22px] font-black mb-4 text-white">Syarat Tumbuh (FAO/ECOCROP)</h2>
        {st ? (
          <div className="glass-panel rounded-3xl p-6 space-y-6 shadow-xl">
            {/* pH */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2 border-b border-white/10 pb-5">
              <div className="text-[14px] font-extrabold text-white mt-1 flex items-center gap-2">
                <span>🧪</span> pH Tanah
              </div>
              <div className="w-full">
                <RangeBar
                  absMin={st.ph_abs?.[0]}
                  absMax={st.ph_abs?.[1]}
                  optMin={st.ph_opt?.[0]}
                  optMax={st.ph_opt?.[1]}
                  domainMin={3}
                  domainMax={10}
                  unit=""
                  color="#22c55e"
                />
              </div>
            </div>

            {/* Curah Hujan */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2 border-b border-white/10 pb-5">
              <div className="text-[14px] font-extrabold text-white mt-1 flex items-center gap-2">
                <span>🌧️</span> Curah Hujan Tahunan
              </div>
              <div className="w-full">
                <RangeBar
                  absMin={st.ch_abs_mmthn?.[0]}
                  absMax={st.ch_abs_mmthn?.[1]}
                  optMin={st.ch_opt_mmthn?.[0]}
                  optMax={st.ch_opt_mmthn?.[1]}
                  domainMin={0}
                  domainMax={5000}
                  unit="mm/thn"
                  color="#38bdf8"
                />
              </div>
            </div>

            {/* Suhu */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2 border-b border-white/10 pb-5">
              <div className="text-[14px] font-extrabold text-white mt-1 flex items-center gap-2">
                <span>🌡️</span> Suhu Rata-rata
              </div>
              <div className="w-full">
                <RangeBar
                  absMin={st.suhu_abs?.[0]}
                  absMax={st.suhu_abs?.[1]}
                  optMin={st.suhu_opt?.[0]}
                  optMax={st.suhu_opt?.[1]}
                  domainMin={0}
                  domainMax={50}
                  unit="°C"
                  color="#fbbf24"
                />
              </div>
            </div>

            {/* Elevasi */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2 border-b border-white/10 pb-5">
              <div className="text-[14px] font-extrabold text-white mt-1 flex items-center gap-2">
                <span>⛰️</span> Elevasi Maksimum
              </div>
              <div className="w-full">
                {st.altitude_maks_m != null ? (
                  <div className="space-y-2">
                    <div className="relative h-4 rounded-full bg-black/30 overflow-hidden border border-white/10">
                      <div
                        className="absolute h-full rounded-full opacity-80 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                        style={{
                          left: 0,
                          width: `${Math.min(100, (st.altitude_maks_m / 4000) * 100).toFixed(1)}%`,
                          backgroundColor: "#a855f7",
                        }}
                      />
                    </div>
                    <div className="text-[11.5px] text-emerald-200/70 font-bold">Batas Maksimal: {st.altitude_maks_m} mdpl</div>
                  </div>
                ) : (
                  <span className="text-emerald-200/50 text-sm font-semibold">Tidak ada batasan elevasi khusus</span>
                )}
              </div>
            </div>

            {/* Tekstur */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2">
              <div className="text-[14px] font-extrabold text-white mt-1 flex items-center gap-2">
                <span>🪨</span> Tekstur Tanah
              </div>
              <div className="space-y-3 pl-1">
                <div className="flex items-center gap-3 text-[13px] font-bold">
                  <span className="text-emerald-200/70 w-20 shrink-0">Optimal:</span>
                  <TeksturBadges value={st.tekstur_opt} isOpt={true} />
                </div>
                <div className="flex items-center gap-3 text-[13px] font-bold">
                  <span className="text-emerald-200/70 w-20 shrink-0">Toleransi:</span>
                  <TeksturBadges value={st.tekstur_abs} isOpt={false} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-emerald-200/50 glass-panel rounded-3xl p-6 shadow-xl">
            Data syarat tumbuh belum tersedia untuk komoditas ini.
          </p>
        )}
      </section>

      {/* KABUPATEN COCOK SECTION */}
      <section className="mb-10 animate-fade-in delay-200">
        <div className="mb-4">
          <h2 className="text-[18px] md:text-[22px] font-black text-white">
            Kabupaten/Kota yang Cocok
          </h2>
          <p className="text-[13px] text-emerald-200/70 mt-1 font-medium">
            Menampilkan {listCocok.length} wilayah yang sesuai — S1 (sangat cocok) diprioritaskan.
          </p>
        </div>

        {listCocok.length === 0 ? (
          <p className="text-emerald-200/50 glass-panel rounded-3xl p-6 shadow-xl text-center">
            Tidak ada kabupaten/kota yang masuk kelas S1 atau S2 untuk komoditas ini.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/10 glass-panel shadow-xl">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-black/20 text-emerald-200/70 text-[12px] font-black uppercase tracking-wider">
                  <th className="px-5 py-3.5">#</th>
                  <th className="px-5 py-3.5">Kabupaten/Kota</th>
                  <th className="px-5 py-3.5">Provinsi</th>
                  <th className="px-5 py-3.5">Kelas Kesesuaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {listCocok.map((kab, i) => (
                  <tr key={kab.kode_kab} className="hover:bg-white/5 transition-colors duration-150">
                    <td className="px-5 py-4 text-emerald-200/50 font-bold text-[13px]">{i + 1}</td>
                    <td className="px-5 py-4 font-black text-[14.5px]">
                      <Link
                        href={`/kabupaten/${kab.kode_kab}`}
                        className="text-[#bef264] hover:underline"
                      >
                        {kab.nama_kab}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-emerald-200/80 font-semibold">{kab.provinsi}</td>
                    <td className="px-5 py-4">
                      <Badge
                        text={KELAS_LABEL[kab.kelas]?.label || kab.kelas}
                        color={KELAS_LABEL[kab.kelas]?.color || "#6b7280"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const names = getAllNamaKomoditas();
  return {
    paths: names.map((nama) => ({ params: { nama } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { lurRow, trenData, kabupatenCocok } = getKomoditasPageData(params.nama);
  return {
    props: {
      namaKomoditas: params.nama,
      lurRow: lurRow || null,
      trenData: trenData || null,
      kabupatenCocok,
    },
  };
}
