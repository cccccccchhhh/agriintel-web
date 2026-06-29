// pages/kabupaten/[kode].js
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import StatCard from "../../components/StatCard";
import SuitabilityTable from "../../components/SuitabilityTable";
import RecommendationBox from "../../components/RecommendationBox";
import ForecastChart from "../../components/ForecastChart";
import {
  getKabupatenList,
  getKabupatenDetail,
  getRekomendasi,
  getForecastIklim,
} from "../../lib/data";
import { buatSummary } from "../../lib/summary";

export default function KabupatenPage({ kabupatenList, kab, rekom, forecast }) {
  if (!kab) {
    return (
      <Layout>
        <p className="text-center text-emerald-200/60 py-20 font-bold">Data kabupaten tidak ditemukan.</p>
      </Layout>
    );
  }

  const summary = buatSummary(kab, rekom);

  return (
    <Layout>
      <Head>
        <title>{kab.nama_kab} — AgriDiv</title>
      </Head>

      <div className="mb-6">
        <SearchBar kabupatenList={kabupatenList} />
      </div>

      {/* KABUPATEN HEADER */}
      <section className="grain glass-panel rounded-3xl px-6 py-8 mb-6 animate-fade-in shadow-xl">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-emerald-200/70 mb-2">
              <span>📍 Provinsi {kab.provinsi}</span>
              {kab.pulau && (
                <>
                  <span className="text-emerald-500/40">•</span>
                  <span>Pulau {kab.pulau}</span>
                </>
              )}
            </div>
            <h1 className="text-[32px] md:text-[42px] font-black tracking-tight text-white leading-none">
              {kab.nama_kab}
            </h1>
            <p className="text-[14px] text-emerald-100/70 mt-3 font-medium">
              Profil agroekologi & kesesuaian lahan · Diperbarui 2026
            </p>
          </div>
          {rekom && (
            <div className="flex items-center gap-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-4 py-2.5 animate-pulse-soft">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bef264]"></span>
              <span className="text-[13.5px] font-extrabold text-[#bef264]">
                {rekom.rekomendasi_kuat?.length ?? 0} komoditas direkomendasikan kuat
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Section A: Profil Wilayah */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="pH Tanah" value={kab.ph ?? "-"} icon="🧪" iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30" sub="ideal" />
        <StatCard label="Elevasi" value={kab.dem != null ? `${kab.dem} mdpl` : "-"} icon="⛰️" iconBg="bg-purple-500/20 text-purple-300 border border-purple-500/30" sub="tinggi" />
        <StatCard label="Tekstur Tanah" value={kab.tekstur_eng ?? "-"} icon="🪨" iconBg="bg-amber-500/20 text-amber-300 border border-amber-500/30" sub="drainase baik" />
        <StatCard label="Suhu Rata-rata" value={kab.suhu_mean != null ? `${kab.suhu_mean}°C` : "-"} icon="🌡️" iconBg="bg-rose-500/20 text-rose-300 border border-rose-500/30" sub="sejuk" />
        <StatCard label="Curah Hujan/thn" value={kab.ch_tahunan_mm != null ? `${Math.round(kab.ch_tahunan_mm)} mm` : "-"} icon="🌧️" iconBg="bg-sky-500/20 text-sky-300 border border-sky-500/30" sub="stabil" />
      </section>

      {/* Section B: Forecast Cuaca */}
      {forecast && (
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-[18px] md:text-[22px] font-black text-white">Forecast Cuaca 12 Bulan ke Depan</h2>
              <p className="text-[13px] text-emerald-200/70 mt-1 font-medium">Visualisasi tren iklim musiman berbasis SARIMAX.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-3xl p-5 shadow-xl">
              <h3 className="text-[14px] font-extrabold text-white mb-3">Curah Hujan (mm/bulan)</h3>
              <ForecastChart
                labels={forecast.label}
                values={forecast.curah_hujan_mm}
                name="Curah Hujan"
                unit="mm"
                color="#38bdf8"
                chartType="line"
              />
            </div>
            <div className="glass-panel rounded-3xl p-5 shadow-xl">
              <h3 className="text-[14px] font-extrabold text-white mb-3">Suhu Rata-rata (°C)</h3>
              <ForecastChart
                labels={forecast.label}
                values={forecast.suhu_c}
                name="Suhu"
                unit="°C"
                color="#fbbf24"
                chartType="line"
              />
            </div>
          </div>
        </section>
      )}

      {/* Section C: Kesesuaian Lahan */}
      <section className="mb-10">
        <h2 className="text-[18px] md:text-[22px] font-black mb-4 text-white">
          Kesesuaian Lahan per Komoditas (S1/S2/N)
        </h2>
        <SuitabilityTable kelas={kab.kelas} />
      </section>

      {/* Section D: Rekomendasi */}
      {rekom && (
        <section className="mb-10">
          <h2 className="text-[18px] md:text-[22px] font-black mb-4 text-white">
            Rekomendasi Komoditas Tanam
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <RecommendationBox
              type="kuat"
              items={rekom.rekomendasi_kuat}
              distribusi={rekom.saran_distribusi}
              descriptions={{ kuat: "Kesesuaian lahan S1 dan tren demand pasar naik signifikan (CI 95%)" }}
            />
            <RecommendationBox
              type="lemah"
              items={rekom.rekomendasi_lemah}
              distribusi={rekom.saran_distribusi}
              descriptions={{ lemah: "Tren positif, namun secara statistik belum signifikan" }}
            />
            <RecommendationBox
              type="tidak"
              items={rekom.tidak_direkomendasikan}
              descriptions={{ tidak: "Lahan kurang cocok atau demand pasar melemah" }}
            />
          </div>
        </section>
      )}

      {/* Section F: Summary Bahasa Manusia */}
      <section className="mb-10 bg-gradient-to-r from-[#0c2417] via-[#143d27] to-[#166534] border border-[#bef264]/30 rounded-3xl p-6 md:p-8 animate-fade-in shadow-xl">
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="w-8 h-8 rounded-xl bg-[#bef264] flex items-center justify-center text-black text-[15px] font-black">💬</span>
          <h2 className="text-[18px] font-black text-white">Ringkasan untuk Petani</h2>
        </div>
        <p className="text-[15.5px] md:text-[16.5px] leading-relaxed text-[#bef264] font-bold">
          {summary}
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => typeof window !== "undefined" && window.print()}
            className="bg-gradient-to-r from-[#bef264] to-[#a3e635] hover:brightness-110 text-[#08140c] text-[13.5px] font-black px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md"
          >
            <span>📥 Unduh / Cetak Laporan Lengkap</span>
          </button>

          <Link href="/compare" className="glass-card text-emerald-100 border-white/20 text-[13.5px] font-bold px-5 py-2.5 rounded-xl hover:border-[#bef264] hover:text-[#bef264] transition-all duration-300 flex items-center justify-center">
            Bandingkan Wilayah Lain
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const list = getKabupatenList();
  return {
    paths: list.map((k) => ({ params: { kode: String(k.kode_kab) } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const kab = getKabupatenDetail(params.kode);
  const rekom = getRekomendasi(params.kode);
  const forecast = getForecastIklim(params.kode);
  return {
    props: {
      kabupatenList: getKabupatenList(),
      kab,
      rekom,
      forecast,
    },
  };
}
