// pages/compare.js
import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import Badge from "../components/Badge";
import { getAllKabupaten, getAllRekomendasi } from "../lib/data";
import { KELAS_LABEL, TREN_LABEL } from "../lib/constants";

// ── Helpers ────────────────────────────────────────────────────────────────────
const TEKSTUR_ID = {
  heavy: "Berat/Liat",
  medium: "Sedang/Lempung",
  light: "Ringan/Berpasir",
  organic: "Organik/Gambut",
};

function fmtTekstur(t) {
  return TEKSTUR_ID[t] || t || "—";
}

// ── Kabupaten search dropdown ──────────────────────────────────────────────────
function KabupatenSelect({ label, value, onChange, kabupatenList, excludeKode }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return kabupatenList.filter((k) => k.kode_kab !== excludeKode).slice(0, 80);
    const q = query.toLowerCase();
    return kabupatenList
      .filter((k) => k.kode_kab !== excludeKode && (k.nama_kab.toLowerCase().includes(q) || k.provinsi.toLowerCase().includes(q)))
      .slice(0, 50);
  }, [query, kabupatenList, excludeKode]);

  const selected = kabupatenList.find((k) => k.kode_kab === value);

  return (
    <div className="relative">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <span className="text-sm font-medium text-gray-800 truncate">
            {selected.nama_kab}
            <span className="font-normal text-gray-400 ml-1">({selected.provinsi})</span>
          </span>
        ) : (
          <span className="text-sm text-gray-400">Pilih kabupaten…</span>
        )}
        <svg className="w-4 h-4 text-gray-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b">
            <input
              autoFocus
              className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 outline-none"
              placeholder="Cari kabupaten atau provinsi…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {filtered.map((k) => (
              <li
                key={k.kode_kab}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-green-50 flex justify-between items-center"
                onClick={() => {
                  onChange(k.kode_kab);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span className="font-medium">{k.nama_kab}</span>
                <span className="text-gray-400 text-xs ml-2 shrink-0">{k.provinsi}</span>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-sm text-gray-400">Tidak ditemukan.</li>
            )}
          </ul>
          {selected && (
            <div className="border-t p-2">
              <button
                className="text-xs text-red-500 hover:underline"
                onClick={(e) => { e.stopPropagation(); onChange(null); setOpen(false); }}
              >
                Hapus pilihan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Profil row ─────────────────────────────────────────────────────────────────
function ProfilRow({ label, valA, valB, highlight }) {
  const diff = highlight && valA != null && valB != null && String(valA) !== String(valB);
  return (
    <tr className={`border-t border-gray-100 ${diff ? "bg-yellow-50" : ""}`}>
      <td className="px-3 py-2 text-xs text-gray-500 font-medium w-36">{label}</td>
      <td className="px-3 py-2 text-sm font-semibold text-gray-800">{valA ?? "—"}</td>
      <td className="px-3 py-2 text-sm font-semibold text-gray-800">{valB ?? "—"}</td>
    </tr>
  );
}

// ── Kesesuaian side-by-side table ──────────────────────────────────────────────
function KesesuaianCompare({ kelasA, kelasB }) {
  const [filter, setFilter] = useState("ALL");

  const allKomoditas = useMemo(() => {
    const keys = new Set([...Object.keys(kelasA || {}), ...Object.keys(kelasB || {})]);
    return [...keys].sort();
  }, [kelasA, kelasB]);

  const ORDER = { S1: 0, S2: 1, N: 2, undefined: 3 };
  const sorted = [...allKomoditas].sort((a, b) => {
    const diff = ORDER[kelasA?.[a]] - ORDER[kelasA?.[b]];
    return diff !== 0 ? diff : a.localeCompare(b);
  });

  const filtered = sorted.filter((kom) => {
    const a = kelasA?.[kom];
    const b = kelasB?.[kom];
    if (filter === "DIFF") return a !== b;
    if (filter === "ALL") return true;
    return a === filter || b === filter;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {[
          { val: "ALL", label: "Semua" },
          { val: "S1", label: "S1 di salah satu" },
          { val: "S2", label: "S2 di salah satu" },
          { val: "DIFF", label: "Ada perbedaan" },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`text-xs px-3 py-1 rounded-full border ${
              filter === f.val
                ? "bg-green-700 text-white border-green-700"
                : "border-gray-300 text-gray-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-50 text-gray-500 text-left text-xs">
            <tr>
              <th className="px-3 py-2">Komoditas</th>
              <th className="px-3 py-2">Kab A</th>
              <th className="px-3 py-2">Kab B</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((kom) => {
              const a = kelasA?.[kom];
              const b = kelasB?.[kom];
              const isDiff = a !== b;
              return (
                <tr key={kom} className={`border-t border-gray-100 ${isDiff ? "bg-yellow-50" : ""}`}>
                  <td className="px-3 py-2 font-medium text-gray-800">{kom}</td>
                  <td className="px-3 py-2">
                    {a ? (
                      <Badge text={a} color={KELAS_LABEL[a]?.color || "#6b7280"} />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {b ? (
                      <Badge text={b} color={KELAS_LABEL[b]?.color || "#6b7280"} />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-gray-400 text-center">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Baris kuning = kesesuaian berbeda antara kedua kabupaten.
      </p>
    </div>
  );
}

// ── Rekomendasi side-by-side ───────────────────────────────────────────────────
function RekomendasiCompare({ rekA, rekB }) {
  if (!rekA && !rekB) return <p className="text-gray-400 text-sm">Data rekomendasi tidak tersedia.</p>;

  const sections = [
    { key: "rekomendasi_kuat", label: "Rekomendasi Kuat", color: "#16a34a", bg: "bg-green-50", border: "border-green-200" },
    { key: "rekomendasi_lemah", label: "Rekomendasi Lemah", color: "#ca8a04", bg: "bg-yellow-50", border: "border-yellow-200" },
    { key: "tidak_direkomendasikan", label: "Cocok Lahan, Demand Lemah", color: "#dc2626", bg: "bg-red-50", border: "border-red-200" },
  ];

  return (
    <div className="space-y-4">
      {sections.map(({ key, label, color, bg, border }) => {
        const listA = rekA?.[key] || [];
        const listB = rekB?.[key] || [];
        if (listA.length === 0 && listB.length === 0) return null;

        const allItems = [...new Set([...listA, ...listB])].sort();
        return (
          <div key={key} className={`rounded-xl border ${border} ${bg} p-4`}>
            <h3 className="font-semibold mb-3 text-sm" style={{ color }}>{label}</h3>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 mb-2">
              <div>Komoditas</div>
              <div>Kab A</div>
              <div>Kab B</div>
            </div>
            {allItems.map((kom) => {
              const inA = listA.includes(kom);
              const inB = listB.includes(kom);
              return (
                <div key={kom} className={`grid grid-cols-3 gap-2 text-sm py-1 border-t border-white/60 ${inA !== inB ? "font-semibold" : ""}`}>
                  <div className="text-gray-800">{kom}</div>
                  <div>{inA ? <Badge text="Ya" color={color} /> : <span className="text-gray-300">—</span>}</div>
                  <div>{inB ? <Badge text="Ya" color={color} /> : <span className="text-gray-300">—</span>}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ComparePage({ kabupatenList, kabupatenMap, rekomendasiMap }) {
  const [kodeA, setKodeA] = useState(null);
  const [kodeB, setKodeB] = useState(null);

  const kabA = kodeA ? kabupatenMap[kodeA] : null;
  const kabB = kodeB ? kabupatenMap[kodeB] : null;
  const rekA = kodeA ? rekomendasiMap[kodeA] : null;
  const rekB = kodeB ? rekomendasiMap[kodeB] : null;

  const bothSelected = kabA && kabB;

  return (
    <Layout>
      <Head>
        <title>Bandingkan Kabupaten — AgriRekomendasi</title>
      </Head>

      <h1 className="text-2xl font-bold text-green-900 mb-1">Bandingkan 2 Kabupaten</h1>
      <p className="text-gray-500 text-sm mb-6">
        Pilih dua kabupaten untuk membandingkan profil wilayah, kesesuaian lahan, dan rekomendasi komoditas secara berdampingan.
      </p>

      {/* Selector */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <KabupatenSelect
          label="Kabupaten A"
          value={kodeA}
          onChange={setKodeA}
          kabupatenList={kabupatenList}
          excludeKode={kodeB}
        />
        <KabupatenSelect
          label="Kabupaten B"
          value={kodeB}
          onChange={setKodeB}
          kabupatenList={kabupatenList}
          excludeKode={kodeA}
        />
      </div>

      {!bothSelected && (
        <div className="text-center py-16 text-gray-400">
          Pilih dua kabupaten untuk mulai membandingkan.
        </div>
      )}

      {bothSelected && (
        <>
          {/* Header nama */}
          <div className="grid grid-cols-3 gap-2 mb-6 items-end">
            <div />
            <div className="bg-green-700 text-white rounded-xl px-4 py-3 text-center">
              <div className="text-xs opacity-75 mb-0.5">Kabupaten A</div>
              <div className="font-bold text-sm leading-tight">{kabA.nama_kab}</div>
              <div className="text-xs opacity-75">{kabA.provinsi}</div>
              <Link href={`/kabupaten/${kabA.kode_kab}`} className="text-xs underline opacity-80 mt-1 inline-block">
                Lihat detail →
              </Link>
            </div>
            <div className="bg-blue-700 text-white rounded-xl px-4 py-3 text-center">
              <div className="text-xs opacity-75 mb-0.5">Kabupaten B</div>
              <div className="font-bold text-sm leading-tight">{kabB.nama_kab}</div>
              <div className="text-xs opacity-75">{kabB.provinsi}</div>
              <Link href={`/kabupaten/${kabB.kode_kab}`} className="text-xs underline opacity-80 mt-1 inline-block">
                Lihat detail →
              </Link>
            </div>
          </div>

          {/* Profil Wilayah */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-green-900">Profil Wilayah</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="px-3 py-2 text-left w-36">Indikator</th>
                    <th className="px-3 py-2 text-left">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-700 mr-1" />
                      {kabA.nama_kab}
                    </th>
                    <th className="px-3 py-2 text-left">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-700 mr-1" />
                      {kabB.nama_kab}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ProfilRow label="pH Tanah" valA={kabA.ph} valB={kabB.ph} highlight />
                  <ProfilRow
                    label="Elevasi"
                    valA={kabA.dem != null ? `${kabA.dem} m` : null}
                    valB={kabB.dem != null ? `${kabB.dem} m` : null}
                    highlight
                  />
                  <ProfilRow
                    label="Tekstur Tanah"
                    valA={fmtTekstur(kabA.tekstur_eng)}
                    valB={fmtTekstur(kabB.tekstur_eng)}
                    highlight
                  />
                  <ProfilRow
                    label="Suhu Rata-rata"
                    valA={kabA.suhu_mean != null ? `${kabA.suhu_mean}°C` : null}
                    valB={kabB.suhu_mean != null ? `${kabB.suhu_mean}°C` : null}
                    highlight
                  />
                  <ProfilRow
                    label="Curah Hujan/thn"
                    valA={kabA.ch_tahunan_mm != null ? `${Math.round(kabA.ch_tahunan_mm)} mm` : null}
                    valB={kabB.ch_tahunan_mm != null ? `${Math.round(kabB.ch_tahunan_mm)} mm` : null}
                    highlight
                  />
                  <ProfilRow
                    label="Komoditas Cocok"
                    valA={kabA.n_komoditas_cocok != null ? `${kabA.n_komoditas_cocok} komoditas` : null}
                    valB={kabB.n_komoditas_cocok != null ? `${kabB.n_komoditas_cocok} komoditas` : null}
                    highlight
                  />
                </tbody>
              </table>
              <p className="text-xs text-gray-400 px-3 py-2 border-t">
                Baris kuning = nilai berbeda antara kedua kabupaten.
              </p>
            </div>
          </section>

          {/* Kesesuaian Lahan */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-green-900">Kesesuaian Lahan per Komoditas</h2>
            <KesesuaianCompare kelasA={kabA.kelas} kelasB={kabB.kelas} />
          </section>

          {/* Rekomendasi */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-green-900">Rekomendasi Komoditas</h2>
            <RekomendasiCompare rekA={rekA} rekB={rekB} />
          </section>
        </>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const kabupatenAll = getAllKabupaten();
  const rekomendasiAll = getAllRekomendasi();

  const kabupatenList = kabupatenAll.map((k) => ({
    kode_kab: k.kode_kab,
    nama_kab: k.nama_kab,
    provinsi: k.provinsi,
  })).sort((a, b) => a.nama_kab.localeCompare(b.nama_kab));

  const kabupatenMap = Object.fromEntries(kabupatenAll.map((k) => [k.kode_kab, k]));
  const rekomendasiMap = Object.fromEntries(rekomendasiAll.map((r) => [r.kode_kab, r]));

  return { props: { kabupatenList, kabupatenMap, rekomendasiMap } };
}
