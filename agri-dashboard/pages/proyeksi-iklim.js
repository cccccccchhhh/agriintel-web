// pages/proyeksi-iklim.js
import Head from "next/head";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import OniChart from "../components/OniChart";
import { getOniData } from "../lib/data";

export default function ProyeksiIklim({ oniData }) {
  return (
    <Layout>
      <Head>
        <title>Proyeksi Iklim ENSO & SARIMAX — AgriDiv</title>
      </Head>

      {/* HEADER SECTION */}
      <section className="grain relative overflow-hidden rounded-3xl glass-panel px-6 py-10 md:py-12 mb-8 animate-fade-in shadow-xl">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-extrabold text-sky-300 bg-sky-500/20 border border-sky-500/30 px-4 py-1.5 rounded-full mb-4">
          🌧️ Forecasting Iklim Musiman (SARIMAX)
        </span>
        <h1 className="text-[32px] md:text-[44px] leading-tight font-black tracking-tight text-white drop-shadow-md">
          Proyeksi Iklim & Dinamika ENSO
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-emerald-100/80 max-w-2xl font-medium">
          Dampak El Niño–Southern Oscillation (ENSO) berulang kali memangkas produksi pangan nasional. AgriDiv mengintegrasikan indeks ONI sebagai variabel eksogen untuk memprediksi curah hujan dan suhu 12 bulan ke depan di 494 kabupaten/kota.
        </p>
      </section>

      {/* METRICS SECTION */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Galat Suhu (RMSE)"
          value="0.346 °C"
          sub="Tingkat akurasi sangat tinggi"
          color="#bef264"
          icon="🌡️"
          iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30"
        />
        <StatCard
          label="Galat Curah Hujan (RMSE)"
          value="3.293 mm"
          sub="Galat harian rata-rata"
          color="#38bdf8"
          icon="🌧️"
          iconBg="bg-sky-500/20 text-sky-300 border border-sky-500/30"
        />
        <StatCard
          label="Kabupaten Terjangkau"
          value="494 / 515"
          sub="96% wilayah nasional ter-cover"
          color="#fbbf24"
          icon="📍"
          iconBg="bg-amber-500/20 text-amber-300 border border-amber-500/30"
        />
        <StatCard
          label="Horizon Peramalan"
          value="12 Bulan"
          sub="Proyeksi deret waktu musiman"
          color="#2dd4bf"
          icon="📅"
          iconBg="bg-teal-500/20 text-teal-300 border border-teal-500/30"
        />
      </section>

      {/* ONI CHART */}
      <div className="mb-10">
        <OniChart data={oniData} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      oniData: getOniData(),
    },
  };
}
