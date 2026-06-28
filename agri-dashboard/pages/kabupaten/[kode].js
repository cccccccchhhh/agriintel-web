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

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-green-900">{kab.nama_kab}</h1>
        <p className="text-gray-500">{kab.provinsi}</p>
      </header>

      {/* Section A: Profil Wilayah */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <StatCard label="pH Tanah" value={kab.ph ?? "-"} />
        <StatCard label="Elevasi" value={kab.dem != null ? `${kab.dem} m` : "-"} />
        <StatCard label="Tekstur Tanah" value={kab.tekstur_eng ?? "-"} />
        <StatCard label="Suhu Rata-rata" value={kab.suhu_mean != null ? `${kab.suhu_mean}°C` : "-"} />
        <StatCard label="Curah Hujan/thn" value={kab.ch_tahunan_mm != null ? `${Math.round(kab.ch_tahunan_mm)} mm` : "-"} />
      </section>

      {/* Section B: Forecast Cuaca */}
      {forecast && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-green-900">Forecast Cuaca 12 Bulan ke Depan</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Curah Hujan (mm/bulan)</h3>
              <ForecastChart
                labels={forecast.label}
                values={forecast.curah_hujan_mm}
                name="Curah Hujan"
                unit="mm"
                color="#0369a1"
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Suhu Rata-rata (°C)</h3>
              <ForecastChart
                labels={forecast.label}
                values={forecast.suhu_c}
                name="Suhu"
                unit="°C"
                color="#dc2626"
              />
            </div>
          </div>
        </section>
      )}

      {/* Section C: Kesesuaian Lahan */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-green-900">
          Kesesuaian Lahan per Komoditas (S1/S2/N)
        </h2>
        <SuitabilityTable kelas={kab.kelas} />
      </section>

      {/* Section D: Rekomendasi */}
      {rekom && (
        <section className="mb-10 grid md:grid-cols-3 gap-4">
          <RecommendationBox
            type="kuat"
            items={rekom.rekomendasi_kuat}
            distribusi={rekom.saran_distribusi}
            descriptions={{ kuat: "Tren permintaan nasional naik signifikan (CI 95%)" }}
          />
          <RecommendationBox
            type="lemah"
            items={rekom.rekomendasi_lemah}
            distribusi={rekom.saran_distribusi}
            descriptions={{ lemah: "Tren positif, tapi belum signifikan secara statistik" }}
          />
          <RecommendationBox type="tidak" items={rekom.tidak_direkomendasikan} />
        </section>
      )}

      {/* Section F: Summary Bahasa Manusia */}
      <section className="mb-10 bg-green-50 border border-green-200 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-green-900 mb-2">📝 Ringkasan</h2>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
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
