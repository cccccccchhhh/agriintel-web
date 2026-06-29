import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import Badge from "../../components/Badge";
import StatCard from "../../components/StatCard";
import ForecastChart from "../../components/ForecastChart";
import { useMemo, useState } from "react";
import { getKomoditasList } from "../../lib/data";
import { TREN_LABEL } from "../../lib/constants";

export default function KomoditasDashboard({ komoditasList, trenGroups }) {
  const [activeTrend, setActiveTrend] = useState("naik_signifikan");
  const trends = [
    { key: "naik_signifikan", label: "Naik Signifikan", description: "Permintaan naik kuat", tone: "bg-emerald-950/60 border-emerald-500/40", accent: "text-[#bef264]" },
    { key: "naik_lemah", label: "Naik Lemah", description: "Permintaan naik perlahan", tone: "bg-amber-950/60 border-amber-500/40", accent: "text-amber-300" },
    { key: "turun_lemah", label: "Turun Lemah", description: "Permintaan turun ringan", tone: "bg-orange-950/60 border-orange-500/40", accent: "text-orange-300" },
    { key: "turun_signifikan", label: "Turun Signifikan", description: "Permintaan turun cepat", tone: "bg-rose-950/60 border-rose-500/40", accent: "text-rose-300" },
  ]; 

  const selectedItems = useMemo(() => trenGroups[activeTrend] || [], [activeTrend, trenGroups]);
  const topItems = selectedItems.slice(0, 6);

  const example = topItems[0] || komoditasList[0] || null;
  const chartValues = useMemo(() => {
    if (!example) return [];
    const slope = example.slope || 0;
    return [45, 48, 50, 52, 54, 57, 60, 61, 63, 64, 67, 70].map((value, idx) => {
      return Math.max(10, Math.round(value + slope * idx * 6 + Math.sin(idx * 1.2) * 2));
    });
  }, [example]);

  return (
    <Layout>
      <Head>
        <title>Dashboard Komoditas — AgriDiv</title>
      </Head>

      <section className="grain relative overflow-hidden rounded-3xl glass-panel px-6 py-8 mb-6 animate-fade-in shadow-xl">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-extrabold text-[#bef264] bg-[#bef264]/15 border border-[#bef264]/30 px-3.5 py-1 rounded-full mb-3">
          📈 Komoditas Insights
        </span>
        <h1 className="text-[28px] md:text-[36px] font-black tracking-tight text-white leading-tight">
          Jelajahi Komoditas Berdasarkan Trend Demand
        </h1>
        <p className="text-[14.5px] text-emerald-100/80 mt-3 max-w-2xl font-medium leading-relaxed">
          Gunakan dashboard ini untuk menilai komoditas dengan permintaan naik, turun, atau stabil, lalu buka halaman detailnya untuk rekomendasi wilayah dan syarat tumbuh.
        </p>
        <div className="mt-8 max-w-xl mx-auto">
          <SearchBar
            komoditasList={komoditasList}
            mode="komoditas"
            placeholder="Cari komoditas, mis. Bayam…"
            showChips={false}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[280px_1fr] mb-10 items-start">
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-5 shadow-xl">
            <h2 className="text-[16px] font-black text-white mb-4">Pilih Kategori Tren</h2>
            <div className="space-y-3">
              {trends.map((trend) => (
                <button
                  key={trend.key}
                  type="button"
                  onClick={() => setActiveTrend(trend.key)}
                  className={`w-full text-left rounded-2xl px-4 py-4 transition-all duration-300 border ${activeTrend === trend.key ? "border-[#bef264] bg-[#22c55e]/25 shadow-lg" : "border-white/15 glass-card hover:border-white/30"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[12px] uppercase tracking-[0.2em] text-emerald-200/70 font-extrabold mb-1">{trend.label}</div>
                      <div className="font-extrabold text-white">{trend.description}</div>
                    </div>
                    <span className={`text-xl ${trend.accent}`}>•</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5 shadow-xl">
            <h2 className="text-[16px] font-black text-white mb-3">Ringkasan Tren</h2>
            <div className="space-y-2 text-[14px] text-emerald-100/80 font-medium">
              <p>Kategori ini berisi <strong className="text-[#bef264]">{selectedItems.length}</strong> komoditas.</p>
              <p>Sentimen tren dipilih berdasarkan data permintaan pasar nasional.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <p className="text-[12px] uppercase tracking-[0.25em] text-[#bef264] font-extrabold">Komoditas Utama Kluster</p>
                <h2 className="text-[22px] font-black text-white">{trenGroups[activeTrend]?.[0]?.komoditas || "Tidak ada data"}</h2>
              </div>
              <Link href={`/komoditas/${encodeURIComponent(trenGroups[activeTrend]?.[0]?.komoditas || "")}`} className="inline-flex items-center gap-2 rounded-full border border-[#bef264]/40 bg-[#22c55e]/20 px-5 py-2.5 text-[13px] font-extrabold text-[#bef264] shadow-md hover:bg-[#22c55e]/35 transition-all">
                Buka Detail Komoditas →
              </Link>
            </div>

            {/* PROPORTIONAL STAT CARDS ROW */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatCard label="Jumlah Komoditas" value={selectedItems.length} sub="tanaman dalam kluster ini" color="#bef264" icon="📊" iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30" />
              <StatCard label="Slope Rata-rata" value={`${((selectedItems.reduce((acc, item) => acc + item.slope, 0) / Math.max(1, selectedItems.length)) * 100).toFixed(2)}%`} sub="pertumbuhan tahunan rerata" color="#22c55e" icon="📈" iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30" />
            </div>

            {/* DEDICATED SAMPLE COMMODITIES GRID */}
            <div className="border-t border-white/10 pt-5">
              <h3 className="text-[14px] font-extrabold text-white mb-3">Contoh Komoditas Dalam Kluster Ini</h3>
              {topItems.length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {topItems.map((item) => (
                    <Link key={item.komoditas} href={`/komoditas/${encodeURIComponent(item.komoditas)}`} className="rounded-2xl border border-white/15 glass-card p-3.5 flex items-center justify-between gap-3 hover:border-[#bef264] transition-all">
                      <span className="font-extrabold text-white text-[13.5px] truncate">{item.komoditas}</span>
                      <Badge text={TREN_LABEL[item.tren]?.label || item.tren} color={TREN_LABEL[item.tren]?.color || "#6b7280"} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-200/50 text-xs">Tidak ada data untuk kategori ini.</p>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.25em] text-[#bef264] font-extrabold">Trend Snapshot</p>
                <h2 className="text-[20px] font-black text-white">Contoh Grafik Permintaan</h2>
              </div>
              <span className="text-[13px] text-emerald-200/80 font-bold">{trenGroups[activeTrend]?.[0]?.komoditas || "—"}</span>
            </div>
            {example ? (
              <ForecastChart
                labels={["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]}
                values={chartValues}
                name={example.komoditas}
                unit="pt"
                color="#22c55e"
                chartType="line"
              />
            ) : (
              <div className="text-emerald-200/50 text-sm">Grafik tidak tersedia.</div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const komoditasList = getKomoditasList();
  const trenGroups = komoditasList.reduce((acc, kom) => {
    acc[kom.tren] = acc[kom.tren] || [];
    acc[kom.tren].push(kom);
    return acc;
  }, {});

  return {
    props: {
      komoditasList,
      trenGroups,
    },
  };
}
