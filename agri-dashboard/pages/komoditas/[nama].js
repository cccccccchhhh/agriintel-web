// pages/komoditas/[nama].js
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import Badge from "../../components/Badge";
import StatCard from "../../components/StatCard";
import { getAllNamaKomoditas, getKomoditasPageData } from "../../lib/data";
import { TREN_LABEL, KELAS_LABEL } from "../../lib/constants";

// ── Range Bar ──────────────────────────────────────────────────────────────────
// Renders a horizontal bar showing [abs_min … opt_min … opt_max … abs_max] on a
// fixed domain. Absolute range is light-coloured, optimal range is darker.
function RangeBar({ absMin, absMax, optMin, optMax, domainMin, domainMax, unit, color = "#16a34a" }) {
  if (absMin == null || absMax == null) return <span className="text-gray-400 text-sm">—</span>;

  const span = domainMax - domainMin || 1;
  const pct = (v) => `${(((v - domainMin) / span) * 100).toFixed(1)}%`;
  const width = (a, b) => `${(((b - a) / span) * 100).toFixed(1)}%`;

  const hasOpt = optMin != null && optMax != null;

  return (
    <div className="space-y-1">
      <div className="relative h-4 rounded bg-gray-100 overflow-hidden">
        {/* absolute range */}
        <div
          className="absolute h-full rounded opacity-30"
          style={{ left: pct(absMin), width: width(absMin, absMax), backgroundColor: color }}
        />
        {/* optimal range */}
        {hasOpt && (
          <div
            className="absolute h-full rounded"
            style={{ left: pct(optMin), width: width(optMin, optMax), backgroundColor: color }}
          />
        )}
      </div>
      <div className="flex justify-between text-[11px] text-gray-500">
        <span>
          Absolut: {absMin}–{absMax} {unit}
        </span>
        {hasOpt && (
          <span className="font-medium" style={{ color }}>
            Optimal: {optMin}–{optMax} {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Tekstur Badge list ─────────────────────────────────────────────────────────
const TEKSTUR_ID = {
  light: "Ringan/Berpasir",
  medium: "Sedang/Lempung",
  heavy: "Berat/Liat",
  organic: "Organik/Gambut",
  wide: "Semua Tekstur",
};

function TeksturBadges({ value, isOpt }) {
  if (!value) return <span className="text-gray-400 text-sm">—</span>;
  const lower = value.toLowerCase();
  const items = lower.includes("wide")
    ? ["wide"]
    : lower.split(",").map((s) => s.trim());
  return (
    <span className="flex flex-wrap gap-1">
      {items.map((t) => (
        <span
          key={t}
          className="text-xs px-2 py-0.5 rounded-full border"
          style={
            isOpt
              ? { borderColor: "#16a34a", color: "#16a34a", background: "#16a34a1A" }
              : { borderColor: "#9ca3af", color: "#6b7280", background: "#f3f4f6" }
          }
        >
          {TEKSTUR_ID[t] || t}
        </span>
      ))}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function KomoditasPage({ namaKomoditas, lurRow, trenData, kabupatenCocok }) {
  const tren = trenData?.tren;
  const trenMeta = TREN_LABEL[tren] || {};
  const st = lurRow?.syarat_tumbuh ?? trenData?.syarat_tumbuh ?? null;

  const nS1 = kabupatenCocok.filter((k) => k.kelas === "S1").length;
  const nS2 = kabupatenCocok.filter((k) => k.kelas === "S2").length;

  return (
    <Layout>
      <Head>
        <title>{namaKomoditas} — AgriRekomendasi</title>
      </Head>

      {/* BREADCRUMB */}
      <nav className="text-xs md:text-sm text-gray-400 mb-4 font-bold flex items-center gap-1.5 animate-fade-in">
        <Link href="/" className="hover:text-[#166534] transition-colors">Beranda</Link>
        <span>/</span>
        <span className="text-gray-600">{namaKomoditas}</span>
      </nav>

      {/* HEADER BANNER */}
      <header className="mb-6 flex flex-wrap items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-[#166534]/10 flex items-center justify-center text-[22px]">
          {getEmoji(namaKomoditas)}
        </div>
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#143d27]">{namaKomoditas}</h1>
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
          color="#16a34a"
          icon="✅"
          iconBg="bg-green-50 text-green-700"
        />
        <StatCard
          label="Kabupaten Cukup Cocok"
          value={nS2}
          sub="kelas S2"
          color="#ca8a04"
          icon="⚠️"
          iconBg="bg-yellow-50 text-yellow-700"
        />
        {trenData ? (
          <>
            <StatCard
              label="Slope Tren Demand"
              value={`${trenData.slope > 0 ? "+" : ""}${(trenData.slope * 100).toFixed(2)}%`}
              sub="per tahun"
              color={trenMeta.color || "#6b7280"}
              icon="📈"
              iconBg="bg-[#166534]/8 text-[#166534]"
            />
            <StatCard
              label="Tahun Data"
              value={trenData.n_tahun_data}
              sub={trenData.model_type}
              color="#0369a1"
              icon="📅"
              iconBg="bg-blue-50 text-blue-700"
            />
          </>
        ) : (
          <>
            <StatCard
              label="Slope Tren Demand"
              value="—"
              sub="tidak ada data"
              color="#6b7280"
              icon="📈"
              iconBg="bg-gray-100 text-gray-500"
            />
            <StatCard
              label="Tahun Data"
              value="—"
              sub="n/a"
              color="#6b7280"
              icon="📅"
              iconBg="bg-gray-100 text-gray-500"
            />
          </>
        )}
      </section>

      {/* SYARAT TUMBUH SECTION */}
      <section className="mb-10 animate-fade-in delay-100">
        <h2 className="text-[18px] md:text-[20px] font-extrabold mb-4 text-[#143d27]">Syarat Tumbuh (FAO/ECOCROP)</h2>
        {st ? (
          <div className="bg-white rounded-3xl border border-[#166534]/10 p-6 space-y-6 shadow-sm">
            {/* pH */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2 border-b border-gray-100 pb-5">
              <div className="text-[14px] font-extrabold text-[#1a2e22] mt-1 flex items-center gap-1.5">
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
                  color="#16a34a"
                />
              </div>
            </div>

            {/* Curah Hujan */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2 border-b border-gray-100 pb-5">
              <div className="text-[14px] font-extrabold text-[#1a2e22] mt-1 flex items-center gap-1.5">
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
                  color="#0284c7"
                />
              </div>
            </div>

            {/* Suhu */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2 border-b border-gray-100 pb-5">
              <div className="text-[14px] font-extrabold text-[#1a2e22] mt-1 flex items-center gap-1.5">
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
                  color="#d97706"
                />
              </div>
            </div>

            {/* Elevasi */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2 border-b border-gray-100 pb-5">
              <div className="text-[14px] font-extrabold text-[#1a2e22] mt-1 flex items-center gap-1.5">
                <span>⛰️</span> Elevasi Maksimum
              </div>
              <div className="w-full">
                {st.altitude_maks_m != null ? (
                  <div className="space-y-2">
                    <div className="relative h-4 rounded-full bg-gray-100 overflow-hidden border border-gray-200/50">
                      <div
                        className="absolute h-full rounded-full opacity-60"
                        style={{
                          left: 0,
                          width: `${Math.min(100, (st.altitude_maks_m / 4000) * 100).toFixed(1)}%`,
                          backgroundColor: "#7c3aed",
                        }}
                      />
                    </div>
                    <div className="text-[11.5px] text-gray-500 font-bold">Batas Maksimal: {st.altitude_maks_m} mdpl</div>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm font-semibold">Tidak ada batasan elevasi khusus</span>
                )}
              </div>
            </div>

            {/* Tekstur */}
            <div className="grid md:grid-cols-[160px_1fr] items-start gap-2">
              <div className="text-[14px] font-extrabold text-[#1a2e22] mt-1 flex items-center gap-1.5">
                <span>🪨</span> Tekstur Tanah
              </div>
              <div className="space-y-3 pl-1">
                <div className="flex items-center gap-3 text-[13px] font-bold">
                  <span className="text-[#6a8174] w-20 shrink-0">Optimal:</span>
                  <TeksturBadges value={st.tekstur_opt} isOpt={true} />
                </div>
                <div className="flex items-center gap-3 text-[13px] font-bold">
                  <span className="text-[#6a8174] w-20 shrink-0">Toleransi:</span>
                  <TeksturBadges value={st.tekstur_abs} isOpt={false} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 bg-white rounded-3xl border border-[#166534]/10 p-6 shadow-sm">
            Data syarat tumbuh belum tersedia untuk komoditas ini.
          </p>
        )}
      </section>

      {/* KABUPATEN COCOK SECTION */}
      <section className="mb-10 animate-fade-in delay-200">
        <div className="mb-4">
          <h2 className="text-[18px] md:text-[20px] font-extrabold text-[#143d27]">
            Kabupaten/Kota yang Cocok
          </h2>
          <p className="text-[13px] text-[#6a8174] mt-1 font-semibold">
            Menampilkan {kabupatenCocok.length} wilayah yang sesuai — S1 (sangat cocok) diprioritaskan.
          </p>
        </div>

        {kabupatenCocok.length === 0 ? (
          <p className="text-gray-400 bg-white rounded-3xl border border-[#166534]/10 p-6 shadow-sm text-center">
            Tidak ada kabupaten/kota yang masuk kelas S1 atau S2 untuk komoditas ini.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-[#166534]/8">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-[#f3f8f4] text-[#5a7265] text-[12px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">#</th>
                  <th className="px-5 py-3.5">Kabupaten/Kota</th>
                  <th className="px-5 py-3.5">Provinsi</th>
                  <th className="px-5 py-3.5">Kelas Kesesuaian</th>
                </tr>
              </thead>
              <tbody>
                {kabupatenCocok.map((kab, i) => (
                  <tr key={kab.kode_kab} className="border-t border-[#166534]/6 hover:bg-[#faf9f4]/60 transition-colors duration-150">
                    <td className="px-5 py-4 text-gray-400 font-bold text-[13px]">{i + 1}</td>
                    <td className="px-5 py-4 font-bold text-[14.5px]">
                      <Link
                        href={`/kabupaten/${kab.kode_kab}`}
                        className="text-[#166534] hover:underline"
                      >
                        {kab.nama_kab}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-gray-500 font-semibold">{kab.provinsi}</td>
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
