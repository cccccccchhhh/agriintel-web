// pages/studi-kasus.js
import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import ShapWaterfall from "../components/ShapWaterfall";
import { getPermintaanData, getKabupatenDetail, getRekomendasi } from "../lib/data";

export default function StudiKasus({ permintaanData, sumbaKab, sumbaRek }) {
  const { case_study_shap } = permintaanData;

  return (
    <Layout>
      <Head>
        <title>Studi Kasus: Sumba Tengah, NTT — AgriDiv</title>
      </Head>

      {/* HERO SECTION */}
      <section className="grain relative overflow-hidden rounded-3xl glass-panel px-6 py-10 md:py-14 mb-8 shadow-xl">
        <span className="inline-flex items-center gap-2 text-[12px] font-extrabold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-4 py-1.5 rounded-full mb-4">
          🏝️ Showcase Utama Esai
        </span>
        <h1 className="text-[32px] md:text-[46px] leading-tight font-black tracking-tight text-white drop-shadow-md">
          Studi Kasus: Kabupaten Sumba Tengah, NTT
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-emerald-100/80 max-w-2xl font-medium">
          Transformasi dari kerentanan monokultur subsisten di wilayah semikering terpapar iklim ENSO menjadi ketangguhan pangan berbasis 17 opsi diversifikasi komoditas terukur.
        </p>
      </section>

      {/* OVERVIEW METRICS */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="glass-panel rounded-3xl p-5 shadow-xl text-center">
          <div className="text-xs font-bold text-emerald-200/70 uppercase tracking-wider mb-1">Total Opsi Diversifikasi</div>
          <div className="text-3xl font-black text-[#bef264]">17 Komoditas</div>
          <div className="text-xs text-emerald-100/70 mt-1 font-medium">Dari 28 komoditas dianalisis</div>
        </div>
        <div className="glass-panel rounded-3xl p-5 shadow-xl text-center">
          <div className="text-xs font-bold text-emerald-200/70 uppercase tracking-wider mb-1">Rekomendasi Terkuat</div>
          <div className="text-3xl font-black text-amber-300">Cabe Rawit</div>
          <div className="text-xs text-amber-200 mt-1 font-extrabold">Prospek Naik 91% (S2)</div>
        </div>
        <div className="glass-panel rounded-3xl p-5 shadow-xl text-center">
          <div className="text-xs font-bold text-emerald-200/70 uppercase tracking-wider mb-1">Curah Hujan & Agroklimat</div>
          <div className="text-3xl font-black text-sky-300">1,940 mm/thn</div>
          <div className="text-xs text-emerald-100/70 mt-1 font-medium">Suhu rata-rata 25.8 °C</div>
        </div>
      </div>

      {/* SHAP WATERFALL DEEP DIVE */}
      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-7">
          <ShapWaterfall caseStudy={case_study_shap} />
        </div>
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-black text-white text-lg mb-3">Daftar Komoditas Rekomendasi</h3>
            <p className="text-xs text-emerald-200/70 mb-4 font-medium leading-relaxed">
              Komoditas dengan tingkat kesesuaian biofisik S1/S2 dan tren prospek ekonomi positif di Sumba Tengah:
            </p>
            <div className="flex flex-wrap gap-2">
              {(sumbaRek?.rekomendasi_lemah || []).concat(sumbaRek?.rekomendasi_kuat || []).map((c) => (
                <span key={c} className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-[#bef264] border border-emerald-500/40 shadow-sm">
                  🌱 {c}
                </span>
              ))}
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-white/10">
            <Link
              href="/kabupaten/467" 
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#bef264] to-[#a3e635] text-[#08140c] font-black text-xs py-3.5 px-4 rounded-xl hover:brightness-110 transition-all shadow-md"
            >
              Lihat Profil Agroklimat Lengkap Sumba Tengah →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const permintaanData = getPermintaanData();
  const sumbaKab = getKabupatenDetail(467) || null;
  const sumbaRek = getRekomendasi(467) || { rekomendasi_kuat: ["Cabe Rawit"], rekomendasi_lemah: ["Buncis", "Jagung", "Jeruk", "Kangkung", "Labu", "Mangga", "Mentimun", "Pepaya", "Pisang", "Sawi", "Semangka", "Terong", "Wortel", "Bawang Merah", "Kubis", "Kacang Panjang"] };

  return {
    props: {
      permintaanData,
      sumbaKab,
      sumbaRek,
    },
  };
}
