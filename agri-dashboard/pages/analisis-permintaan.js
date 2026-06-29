// pages/analisis-permintaan.js
import Head from "next/head";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import ShapSummary from "../components/ShapSummary";
import ShapWaterfall from "../components/ShapWaterfall";
import { getPermintaanData } from "../lib/data";

export default function AnalisisPermintaan({ permintaanData }) {
  const { metrics, feature_importance, case_study_shap } = permintaanData;

  return (
    <Layout>
      <Head>
        <title>Analisis Permintaan Pasar & XAI — AgriDiv</title>
      </Head>

      {/* HEADER SECTION */}
      <section className="grain relative overflow-hidden rounded-3xl glass-panel px-6 py-10 md:py-12 mb-8 animate-fade-in shadow-xl">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-extrabold text-[#bef264] bg-[#bef264]/15 border border-[#bef264]/30 px-4 py-1.5 rounded-full mb-4">
          🧠 Explainable AI & Machine Learning
        </span>
        <h1 className="text-[32px] md:text-[44px] leading-tight font-black tracking-tight text-white drop-shadow-md">
          Analisis Permintaan Pasar berbasis XAI
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-emerald-100/80 max-w-2xl font-medium">
          AgriDiv menggabungkan pemodelan machine learning (XGBoost) dengan nilai interpretabilitas SHAP (Shapley Additive exPlanations) untuk memberikan rekomendasi tanam yang transparan dan dapat dipertanggungjawabkan kepada petani.
        </p>
      </section>

      {/* METRICS METODOLOGI SECTION */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Akurasi Regresi Vol. Konsumsi"
          value={`R² ${metrics.r2_regression}`}
          sub="Presisi peramalan besaran konsumsi"
          color="#bef264"
          icon="📈"
          iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30"
        />
        <StatCard
          label="Arah Tren Permintaan (AUC)"
          value={metrics.auc_direction}
          sub="Kemampuan prediksi arah (naik/turun)"
          color="#38bdf8"
          icon="🎯"
          iconBg="bg-sky-500/20 text-sky-300 border border-sky-500/30"
        />
        <StatCard
          label="Klasifikasi Level Pasar (AUC)"
          value={metrics.auc_level}
          sub="Pengelompokan potensi wilayah"
          color="#fbbf24"
          icon="⚡"
          iconBg="bg-amber-500/20 text-amber-300 border border-amber-500/30"
        />
        <StatCard
          label="Pasangan Dianalisis"
          value={metrics.sample_size.toLocaleString()}
          sub="Kombinasi kabupaten–komoditas"
          color="#2dd4bf"
          icon="🔢"
          iconBg="bg-teal-500/20 text-teal-300 border border-teal-500/30"
        />
      </section>

      {/* MAIN XAI GRID */}
      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 shadow-xl">
          <ShapSummary features={feature_importance} />
        </div>
        <div className="lg:col-span-7 space-y-6">
          <ShapWaterfall caseStudy={case_study_shap} />
          
          <div className="glass-card rounded-3xl p-6 border border-[#bef264]/30 shadow-xl bg-[#0c2417]/90 backdrop-blur-xl">
            <h4 className="font-black text-[#bef264] text-base mb-2">💡 Mengapa Explainable AI (XAI) Penting?</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
              Banyak sistem rekomendasi berbasis AI gagal diadopsi petani karena berwujud <em>black-box</em>. Dengan integrasi SHAP di AgriDiv, petani dan penyuluh pertanian dapat melihat faktor biofisik dan ekonomis secara transparan yang mendasari setiap angka probabilitas.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      permintaanData: getPermintaanData(),
    },
  };
}
