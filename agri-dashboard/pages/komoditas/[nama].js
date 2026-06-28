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

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:underline">Beranda</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{namaKomoditas}</span>
      </nav>

      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-green-900">{namaKomoditas}</h1>
        {tren && (
          <Badge text={trenMeta.label || tren} color={trenMeta.color || "#6b7280"} />
        )}
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Kabupaten Sangat Cocok"
          value={nS1}
          sub="kelas S1"
          color="#16a34a"
        />
        <StatCard
          label="Kabupaten Cukup Cocok"
          value={nS2}
          sub="kelas S2"
          color="#ca8a04"
        />
        {trenData && (
          <>
            <StatCard
              label="Slope Tren Demand"
              value={`${trenData.slope > 0 ? "+" : ""}${(trenData.slope * 100).toFixed(2)}%`}
              sub="per tahun"
              color={trenMeta.color || "#6b7280"}
            />
            <StatCard
              label="Tahun Data"
              value={trenData.n_tahun_data}
              sub={trenData.model_type}
              color="#0369a1"
            />
          </>
        )}
      </section>

      {/* Syarat Tumbuh */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-green-900">Syarat Tumbuh (FAO/ECOCROP)</h2>
        {st ? (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-6">
            {/* pH */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">pH Tanah</div>
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

            {/* Curah Hujan */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Curah Hujan Tahunan</div>
              <RangeBar
                absMin={st.ch_abs_mmthn?.[0]}
                absMax={st.ch_abs_mmthn?.[1]}
                optMin={st.ch_opt_mmthn?.[0]}
                optMax={st.ch_opt_mmthn?.[1]}
                domainMin={0}
                domainMax={5000}
                unit="mm/thn"
                color="#0369a1"
              />
            </div>

            {/* Suhu */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Suhu Rata-rata</div>
              <RangeBar
                absMin={st.suhu_abs?.[0]}
                absMax={st.suhu_abs?.[1]}
                optMin={st.suhu_opt?.[0]}
                optMax={st.suhu_opt?.[1]}
                domainMin={0}
                domainMax={50}
                unit="°C"
                color="#dc2626"
              />
            </div>

            {/* Elevasi */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Elevasi Maksimum</div>
              {st.altitude_maks_m != null ? (
                <div className="space-y-1">
                  <div className="relative h-4 rounded bg-gray-100 overflow-hidden">
                    <div
                      className="absolute h-full rounded opacity-50"
                      style={{
                        left: 0,
                        width: `${((st.altitude_maks_m / 5000) * 100).toFixed(1)}%`,
                        backgroundColor: "#7c3aed",
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-gray-500">Maks: {st.altitude_maks_m} mdpl</div>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Tidak ada batasan elevasi</span>
              )}
            </div>

            {/* Tekstur */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Tekstur Tanah</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-16 shrink-0">Optimal:</span>
                  <TeksturBadges value={st.tekstur_opt} isOpt={true} />
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-16 shrink-0">Absolut:</span>
                  <TeksturBadges value={st.tekstur_abs} isOpt={false} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 bg-white rounded-xl shadow-sm p-5">
            Data syarat tumbuh belum tersedia untuk komoditas ini.
          </p>
        )}
      </section>

      {/* Kabupaten Cocok */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-1 text-green-900">
          Kabupaten/Kota yang Cocok
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {kabupatenCocok.length} kabupaten/kota — S1 (sangat cocok) ditampilkan lebih dulu.
        </p>

        {kabupatenCocok.length === 0 ? (
          <p className="text-gray-400">Tidak ada kabupaten dengan kelas S1 atau S2.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Kabupaten/Kota</th>
                  <th className="px-4 py-2">Provinsi</th>
                  <th className="px-4 py-2">Kelas</th>
                </tr>
              </thead>
              <tbody>
                {kabupatenCocok.map((kab, i) => (
                  <tr key={kab.kode_kab} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2 font-medium">
                      <Link
                        href={`/kabupaten/${kab.kode_kab}`}
                        className="text-green-700 hover:underline"
                      >
                        {kab.nama_kab}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-gray-500">{kab.provinsi}</td>
                    <td className="px-4 py-2">
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
