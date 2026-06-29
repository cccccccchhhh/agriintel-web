// pages/strategi-kebijakan.js
import Head from "next/head";
import Layout from "../components/Layout";

export default function StrategiKebijakan() {
  return (
    <Layout>
      <Head>
        <title>Strategi Kebijakan & Integrasi KATAM — AgriDiv</title>
      </Head>

      {/* HEADER SECTION */}
      <section className="grain relative overflow-hidden rounded-3xl glass-panel px-6 py-10 md:py-12 mb-8 animate-fade-in shadow-xl">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-extrabold text-[#bef264] bg-[#bef264]/15 border border-[#bef264]/30 px-4 py-1.5 rounded-full mb-4">
          🏛️ Implementasi Kelembagaan & Kebijakan
        </span>
        <h1 className="text-[32px] md:text-[44px] leading-tight font-black tracking-tight text-white drop-shadow-md">
          Strategi Kebijakan & Integrasi KATAM
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-emerald-100/80 max-w-2xl font-medium">
          Menerjemahkan prototipe analitis menjadi infrastruktur pengambilan keputusan yang melembaga di Kementerian Pertanian dan Bappenas demi mendukung Kedaulatan Pangan Indonesia Emas 2045.
        </p>
      </section>

      {/* THREE PHASES IMPLEMENTATION ROADMAP */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 mb-10 shadow-xl">
        <div className="border-b border-white/10 pb-4 mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#bef264] bg-[#22c55e]/20 px-3 py-1 rounded-lg border border-[#22c55e]/30">
            Peta Jalan Implementasi (3 Fase)
          </span>
          <h2 className="text-2xl font-black text-white mt-2.5">
            Rencana Penyelenggaraan Bertahap
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/40 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-3 -bottom-3 text-8xl font-black text-white/5 select-none">1</div>
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] text-white font-black flex items-center justify-center text-base mb-4 shadow-md">
                F1
              </div>
              <h3 className="font-black text-lg text-white mb-2">Fase 1: Pilot Terfokus</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed mb-4 font-medium">
                Uji coba di wilayah berurgensi tertinggi seperti Provinsi Nusa Tenggara Timur (NTT). Memvalidasi rekomendasi spesifik (misal: cabai rawit di Sumba Tengah) bersama penyuluh dan petani lokal.
              </p>
            </div>
            <span className="inline-block text-[11px] font-extrabold text-[#bef264] bg-emerald-500/20 px-3 py-1 rounded-lg w-fit border border-emerald-500/30">
              📍 Output: Validasi Lapangan NTT
            </span>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-sky-500/30 bg-sky-950/40 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-3 -bottom-3 text-8xl font-black text-white/5 select-none">2</div>
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white font-black flex items-center justify-center text-base mb-4 shadow-md">
                F2
              </div>
              <h3 className="font-black text-lg text-white mb-2">Fase 2: Integrasi Kelembagaan</h3>
              <p className="text-xs text-sky-200/70 leading-relaxed mb-4 font-medium">
                Menautkan AgriDiv dengan platform KATAM Terpadu (Kementerian Pertanian) untuk menambahkan dimensi analisis ekonomi & permintaan pasar yang selama ini belum tersedia.
              </p>
            </div>
            <span className="inline-block text-[11px] font-extrabold text-sky-300 bg-sky-500/20 px-3 py-1 rounded-lg w-fit border border-sky-500/30">
              🔗 Output: Penyempurnaan KATAM
            </span>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-amber-950/40 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-3 -bottom-3 text-8xl font-black text-white/5 select-none">3</div>
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black flex items-center justify-center text-base mb-4 shadow-md">
                F3
              </div>
              <h3 className="font-black text-lg text-white mb-2">Fase 3: Penskalaan Nasional</h3>
              <p className="text-xs text-amber-200/70 leading-relaxed mb-4 font-medium">
                Menjadikan luaran AgriDiv sebagai peta diversifikasi nasional untuk mengarahkan alokasi subsidi benih, insentif tani, dan perencanaan Bappenas berbasis data presisi.
              </p>
            </div>
            <span className="inline-block text-[11px] font-extrabold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-lg w-fit border border-amber-500/30">
              🇮🇩 Output: Peta Diversifikasi Bappenas
            </span>
          </div>
        </div>
      </section>

      {/* KATAM VS AGRIDIV COMPARISON TABLE */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 mb-10 shadow-xl">
        <div className="border-b border-white/10 pb-4 mb-6">
          <h2 className="text-xl font-black text-white">
            Perbandingan Nilai Tambah: KATAM Terpadu vs AgriDiv
          </h2>
          <p className="text-xs text-emerald-200/70 mt-1 font-medium">
            Bagaimana AgriDiv melengkapi dan menyempurnakan sistem kalender tanam eksisting milik Kementerian Pertanian.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-emerald-200/70 font-black uppercase tracking-wider">
                <th className="py-3.5 px-4">Dimensi Evaluasi</th>
                <th className="py-3.5 px-4 bg-white/5 text-emerald-200/80">KATAM Terpadu (Kementan Eksisting)</th>
                <th className="py-3.5 px-4 bg-emerald-500/20 text-[#bef264]">AgriDiv (Inovasi Proposal)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-medium">
              <tr>
                <td className="py-4 px-4 font-extrabold text-white">Cakupan Komoditas</td>
                <td className="py-4 px-4 text-emerald-200/70 bg-white/5">Terbatas (~3 komoditas utama: padi, jagung, kedelai)</td>
                <td className="py-4 px-4 text-[#bef264] bg-emerald-500/10 font-black">28 Komoditas Pangan & Hortikultura Lengkap</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-extrabold text-white">Dimensi Analisis</td>
                <td className="py-4 px-4 text-emerald-200/70 bg-white/5">Fokus Biofisik & Iklim (Musim Tanam)</td>
                <td className="py-4 px-4 text-[#bef264] bg-emerald-500/10 font-black">Biofisik Lahan + Permintaan Ekonomi Pasar (XAI)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-extrabold text-white">Transparansi Model</td>
                <td className="py-4 px-4 text-emerald-200/70 bg-white/5">Rekomendasi Deterministik Standar</td>
                <td className="py-4 px-4 text-[#bef264] bg-emerald-500/10 font-black">Explainable AI (SHAP Waterfall) Transparan</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-extrabold text-white">Dampak Risikan Ekonomi</td>
                <td className="py-4 px-4 text-emerald-200/70 bg-white/5">Risiko Overproduksi & Fluktuasi Harga Pasar</td>
                <td className="py-4 px-4 text-[#bef264] bg-emerald-500/10 font-black">Manajemen Risiko Portofolio (+15–25% Pendapatan Tani)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
