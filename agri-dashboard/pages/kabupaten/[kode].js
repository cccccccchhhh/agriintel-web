// pages/kabupaten/[kode].js
import Head from "next/head";
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
        <p className="text-center text-gray-400 py-20">Data kabupaten tidak ditemukan.</p>
      </Layout>
    );
  }

  const summary = buatSummary(kab, rekom);

  return (
    <Layout>
      <Head>
        <title>{kab.nama_kab} — AgriRekomendasi</title>
      </Head>

      <div className="mb-6">
        <SearchBar kabupatenList={kabupatenList} />
      </div>

      {/* KABUPATEN HEADER */}
      <section className="grain border border-[#166534]/10 rounded-3xl bg-white/50 backdrop-blur-sm px-6 py-8 mb-6 animate-fade-in">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-[#6a8174] mb-2.5">
              <span>📍 Provinsi {kab.provinsi}</span>
              {kab.pulau && (
                <>
                  <span className="text-[#166534]/30">•</span>
                  <span>Pulau {kab.pulau}</span>
                </>
              )}
            </div>
            <h1 className="text-[32px] md:text-[36px] font-extrabold tracking-tight text-[#143d27] leading-none">
              {kab.nama_kab}
            </h1>
            <p className="text-[14px] text-[#46604f] mt-3 font-semibold">
              Profil agroekologi & kesesuaian lahan · Diperbarui 2026
            </p>
          </div>
          {rekom && (
            <div className="flex items-center gap-2.5 bg-[#16a34a]/10 border-2 border-[#16a34a]/20 rounded-2xl px-4 py-2.5 animate-pulse-soft">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></span>
              <span className="text-[13.5px] font-extrabold text-[#15803d]">
                {rekom.rekomendasi_kuat?.length ?? 0} komoditas direkomendasikan kuat
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Section A: Profil Wilayah */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="pH Tanah" value={kab.ph ?? "-"} icon="🧪" iconBg="bg-green-50 text-green-700" sub="ideal" />
        <StatCard label="Elevasi" value={kab.dem != null ? `${kab.dem} mdpl` : "-"} icon="⛰️" iconBg="bg-purple-50 text-purple-700" sub="tinggi" />
        <StatCard label="Tekstur Tanah" value={kab.tekstur_eng ?? "-"} icon="🪨" iconBg="bg-amber-50 text-amber-700" sub="drainase baik" />
        <StatCard label="Suhu Rata-rata" value={kab.suhu_mean != null ? `${kab.suhu_mean}°C` : "-"} icon="🌡️" iconBg="bg-red-50 text-red-700" sub="sejuk" />
        <StatCard label="Curah Hujan/thn" value={kab.ch_tahunan_mm != null ? `${Math.round(kab.ch_tahunan_mm)} mm` : "-"} icon="🌧️" iconBg="bg-blue-50 text-blue-700" sub="stabil" />
      </section>

      {/* Section B: Forecast Cuaca */}
      {forecast && (
        <section className="mb-10">
          <h2 className="text-[18px] md:text-[20px] font-extrabold mb-4 text-[#143d27]">Forecast Cuaca 12 Bulan ke Depan</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-[#166534]/10 p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-[14px] font-extrabold text-[#1a2e22] mb-3">Curah Hujan (mm/bulan)</h3>
              <ForecastChart
                labels={forecast.label}
                values={forecast.curah_hujan_mm}
                name="Curah Hujan"
                unit="mm"
                color="#0284c7"
              />
            </div>
            <div className="bg-white rounded-3xl border border-[#166534]/10 p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-[14px] font-extrabold text-[#1a2e22] mb-3">Suhu Rata-rata (°C)</h3>
              <ForecastChart
                labels={forecast.label}
                values={forecast.suhu_c}
                name="Suhu"
                unit="°C"
                color="#d97706"
              />
            </div>
          </div>
        </section>
      )}

      {/* Section C: Kesesuaian Lahan */}
      <section className="mb-10">
        <h2 className="text-[18px] md:text-[20px] font-extrabold mb-4 text-[#143d27]">
          Kesesuaian Lahan per Komoditas (S1/S2/N)
        </h2>
        <SuitabilityTable kelas={kab.kelas} />
      </section>

      {/* Section D: Rekomendasi */}
      {rekom && (
        <section className="mb-10">
          <h2 className="text-[18px] md:text-[20px] font-extrabold mb-4 text-[#143d27]">
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
      <section className="mb-10 bg-[#dcfce7] border border-[#16a34a]/25 rounded-3xl p-6 md:p-8 animate-fade-in shadow-sm">
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center text-white text-[15px]">💬</span>
          <h2 className="text-[16px] font-extrabold text-[#143d27]">Ringkasan untuk Petani</h2>
        </div>
        <p className="text-[15.5px] md:text-[16.5px] leading-relaxed text-[#235c38] font-semibold">
          {summary}
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="bg-[#166534] hover:bg-[#12502a] text-white text-[13.5px] font-bold px-5 py-2.5 rounded-xl hover:shadow-sm transition-all duration-300">
            Unduh Laporan Lengkap
          </button>
          <Link href="/compare" className="bg-white border border-[#166534]/20 text-[#166534] text-[13.5px] font-bold px-5 py-2.5 rounded-xl hover:border-[#166534]/40 hover:bg-[#faf9f4] transition-all duration-300 flex items-center justify-center">
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
