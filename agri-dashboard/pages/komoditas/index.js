import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import Badge from "../../components/Badge";
import StatCard from "../../components/StatCard";
import ForecastChart from "../../components/ForecastChart";
import { useMemo, useState } from "react";
import { getKomoditasList } from "../../lib/data";
import { TREN_LABEL } from "../../lib/constants";

export default function KomoditasDashboard({ komoditasList, trenGroups }) {
  const [activeTrend, setActiveTrend] = useState("naik_signifikan");
  const trends = [
    { key: "naik_signifikan", label: "Naik Signifikan", description: "Permintaan naik kuat", tone: "bg-[#dcfce7]", accent: "text-[#15803d]" },
    { key: "naik_lemah", label: "Naik Lemah", description: "Permintaan naik perlahan", tone: "bg-[#fef9c3]", accent: "text-[#a16207]" },
    { key: "turun_lemah", label: "Turun Lemah", description: "Permintaan turun ringan", tone: "bg-[#ffedd5]", accent: "text-[#c2410c]" },
    { key: "turun_signifikan", label: "Turun Signifikan", description: "Permintaan turun cepat", tone: "bg-[#fee2e2]", accent: "text-[#b91c1c]" },
  ]; 

  const selectedItems = useMemo(() => trenGroups[activeTrend] || [], [activeTrend, trenGroups]);
  const topItems = selectedItems.slice(0, 5);

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
        <title>Dashboard Komoditas — AgriRekomendasi</title>
      </Head>

      <section className="grain border border-[#166534]/10 rounded-3xl bg-white/50 backdrop-blur-sm px-6 py-8 mb-6 animate-fade-in">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-bold text-[#166534] bg-[#22c55e]/12 border border-[#166534]/15 px-3 py-1 rounded-full mb-3.5">
          📈 Komoditas Insights
        </span>
        <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-tight text-[#143d27] leading-tight">
          Jelajahi Komoditas Berdasarkan Trend Demand
        </h1>
        <p className="text-[14.5px] text-[#46604f] mt-3 max-w-2xl font-medium leading-relaxed">
          Gunakan dashboard ini untuk menilai komoditas dengan permintaan naik, turun, atau stabil, lalu buka halaman detailnya untuk rekomendasi wilayah dan syarat tumbuh.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[280px_1fr] mb-10">
        <div className="space-y-4">
          <div className="rounded-3xl border border-[#166534]/10 bg-white p-5 shadow-sm">
            <h2 className="text-[16px] font-extrabold text-[#143d27] mb-4">Pilih Kategori Tren</h2>
            <div className="space-y-3">
              {trends.map((trend) => (
                <button
                  key={trend.key}
                  type="button"
                  onClick={() => setActiveTrend(trend.key)}
                  className={`w-full text-left rounded-2xl px-4 py-4 transition-all duration-300 border ${activeTrend === trend.key ? "border-[#166534] bg-[#ecfdf5] shadow-sm" : "border-[#d1fae5]/80 bg-white hover:bg-[#f7fdf7]"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[13px] uppercase tracking-[0.2em] text-[#6a8174] mb-1">{trend.label}</div>
                      <div className="font-extrabold text-[#143d27]">{trend.description}</div>
                    </div>
                    <span className={`text-xl ${trend.accent}`}>•</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#166534]/10 bg-white p-5 shadow-sm">
            <h2 className="text-[16px] font-extrabold text-[#143d27] mb-4">Ringkasan Tren</h2>
            <div className="space-y-2 text-[14px] text-[#4f6354]">
              <p>Kategori ini berisi <strong>{selectedItems.length}</strong> komoditas.</p>
              <p>Sentimen tren dipilih berdasarkan data permintaan pasar nasional.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[#166534]/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.25em] text-[#6a8174]">Komoditas Utama</p>
                <h2 className="text-[22px] font-extrabold text-[#143d27]">{trenGroups[activeTrend]?.[0]?.komoditas || "Tidak ada data"}</h2>
              </div>
              <Link href={`/komoditas/${encodeURIComponent(trenGroups[activeTrend]?.[0]?.komoditas || "")}`} className="inline-flex items-center gap-2 rounded-full border border-[#166534]/15 bg-white px-4 py-2 text-[13px] font-bold text-[#166534] shadow-sm transition-all duration-300 hover:bg-[#f3faf2]">
                Buka Detail Komoditas
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Jumlah Komoditas" value={selectedItems.length} color="#166534" icon="📊" iconBg="bg-[#dcfce7] text-[#15803d]" />
              <StatCard label="Slope Rata-rata" value={`${((selectedItems.reduce((acc, item) => acc + item.slope, 0) / Math.max(1, selectedItems.length)) * 100).toFixed(2)}%`} color="#16a34a" icon="📈" iconBg="bg-[#dcfce7] text-[#15803d]" />
              <div className="rounded-3xl border border-[#166534]/10 p-4 bg-[#f8faf5]">
                <h3 className="text-[14px] font-bold text-[#143d27] mb-3">Contoh Komoditas</h3>
                {topItems.length ? (
                  <ul className="space-y-2 text-[#4f6354] text-sm">
                    {topItems.map((item) => (
                      <li key={item.komoditas} className="rounded-2xl border border-[#e7f5e9] bg-white p-3 flex items-center justify-between gap-3">
                        <span>{item.komoditas}</span>
                        <Badge text={TREN_LABEL[item.tren]?.label || item.tren} color={TREN_LABEL[item.tren]?.color || "#6b7280"} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">Tidak ada data untuk kategori ini.</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#166534]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.25em] text-[#6a8174]">Trend Snapshot</p>
                <h2 className="text-[20px] font-extrabold text-[#143d27]">Contoh Grafik Permintaan</h2>
              </div>
              <span className="text-[13px] text-[#6a8174]">{trenGroups[activeTrend]?.[0]?.komoditas || "—"}</span>
            </div>
            {example ? (
              <ForecastChart
                labels={["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]}
                values={chartValues}
                name={example.komoditas}
                unit="pt"
                color="#16a34a"
                chartType="line"
              />
            ) : (
              <div className="text-gray-400 text-sm">Grafik tidak tersedia.</div>
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
