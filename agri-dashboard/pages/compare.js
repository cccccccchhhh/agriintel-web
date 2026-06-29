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

const EMOJI_MAP = {
  padi: "🌾", jagung: "🌽", kedelai: "🫘", "kacang tanah": "🥜",
  "kacang hijau": "🫘", ubi: "🍠", tebu: "🎋", "kelapa sawit": "🌴",
  kelapa: "🥥", karet: "🌿", kakao: "🍫", kopi: "☕", teh: "🍵",
  pisang: "🍌", mangga: "🥭", nanas: "🍍", pepaya: "🍈",
  durian: "🍈", cabai: "🌶️", bawang: "🧅", tomat: "🍅",
  kentang: "🥔", wortel: "🥕", sawi: "🥬", bayam: "🥬",
  semangka: "🍉", melon: "🍈", lada: "🌶️", cengkeh: "🌸",
  pala: "🌰", vanili: "🌿", jahe: "🫚", kunyit: "🫚",
  kapas: "🪴", tembakau: "🍃",
};

function getEmoji(nama) {
  const lower = (nama || "").toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return "🌱";
}

// ── Kabupaten search dropdown ──────────────────────────────────────────────────
function KabupatenSelect({ label, value, onChange, kabupatenList, excludeKode, colorTheme }) {
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
    <div className="relative w-full">
      <div className="text-[12px] font-bold text-[#6a8174] uppercase tracking-wider mb-2">{label}</div>
      <div
        className={`border-2 rounded-2xl px-4 py-3 bg-white cursor-pointer flex items-center justify-between shadow-sm transition-all duration-300 hover:shadow-md ${
          open ? "border-[#166534]/40 ring-2 ring-[#166534]/5" : "border-[#166534]/15"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <span className="text-[14.5px] font-bold text-gray-800 truncate">
            📍 {selected.nama_kab}
            <span className="font-semibold text-gray-400 ml-1.5 text-xs">({selected.provinsi})</span>
          </span>
        ) : (
          <span className="text-[14px] text-gray-400 font-semibold">Pilih kabupaten/kota…</span>
        )}
        <svg className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-40 mt-2 w-full bg-white rounded-2xl border border-[#166534]/12 shadow-[0_20px_50px_-15px_rgba(22,101,52,0.3)] overflow-hidden animate-fade-in">
          <div className="p-3 border-b border-gray-100">
            <input
              autoFocus
              className="w-full text-[14px] border border-[#166534]/15 rounded-xl px-3 py-2 outline-none focus:border-[#166534]/40"
              placeholder="Cari kabupaten atau provinsi…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-56 overflow-y-auto pl-0 my-0">
            {filtered.map((k) => (
              <li
                key={k.kode_kab}
                className="px-4 py-2.5 text-[14px] font-semibold cursor-pointer hover:bg-[#f3f8f4] hover:text-[#166534] flex justify-between items-center transition-colors duration-150"
                onClick={() => {
                  onChange(k.kode_kab);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span>{k.nama_kab}</span>
                <span className="text-gray-400 text-xs ml-2 shrink-0 font-medium">{k.provinsi}</span>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-4 text-[13.5px] text-gray-400 text-center font-medium">Tidak ditemukan.</li>
            )}
          </ul>
          {selected && (
            <div className="border-t border-gray-100 p-2 text-center bg-gray-50/50">
              <button
                className="text-xs text-red-500 hover:underline font-bold"
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
    <tr className={`border-t border-[#166534]/6 transition-colors ${diff ? "bg-[#eab308]/6" : ""}`}>
      <td className="px-4 py-3 text-[12.5px] text-gray-500 font-bold w-40">{label}</td>
      <td className="px-4 py-3 text-[14.5px] font-bold text-gray-800">{valA ?? "—"}</td>
      <td className="px-4 py-3 text-[14.5px] font-bold text-gray-800">{valB ?? "—"}</td>
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

  const getFilterStyle = (f) => {
    if (filter === f) {
      return "bg-[#166534] text-white shadow-sm";
    }
    return "bg-white border border-[#166534]/15 text-[#3c5547] hover:border-[#166534]/35 hover:bg-[#f3f8f4]";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 animate-fade-in">
        {[
          { val: "ALL", label: "Semua Komoditas" },
          { val: "S1", label: "Sangat Sesuai (S1)" },
          { val: "S2", label: "Cukup Sesuai (S2)" },
          { val: "DIFF", label: "Ada Perbedaan" },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`text-[12px] font-bold px-3.5 py-1.5 rounded-xl transition-all duration-300 ${getFilterStyle(f.val)}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#166534]/8 bg-white shadow-sm">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead className="bg-[#f3f8f4] text-[#5a7265] text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Komoditas</th>
              <th className="px-4 py-3">Kesesuaian Kab A</th>
              <th className="px-4 py-3">Kesesuaian Kab B</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((kom) => {
              const a = kelasA?.[kom];
              const b = kelasB?.[kom];
              const isDiff = a !== b;
              return (
                <tr key={kom} className={`border-t border-[#166534]/6 hover:bg-gray-50/50 transition-colors ${isDiff ? "bg-[#eab308]/6" : ""}`}>
                  <td className="px-4 py-3 font-bold text-[14.5px] text-gray-800 flex items-center gap-2">
                    <span>{getEmoji(kom)}</span>
                    <span>{kom}</span>
                  </td>
                  <td className="px-4 py-3">
                    {a ? (
                      <Badge text={a} color={KELAS_LABEL[a]?.color || "#6b7280"} />
                    ) : (
                      <span className="text-gray-300 text-xs font-bold">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {b ? (
                      <Badge text={b} color={KELAS_LABEL[b]?.color || "#6b7280"} />
                    ) : (
                      <span className="text-gray-300 text-xs font-bold">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-gray-400 text-center font-bold">
                  Tidak ada data komoditas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11.5px] text-[#6a8174] font-semibold">
        💡 Baris berlatar kuning menandakan tingkat kesesuaian lahan berbeda antara kedua kabupaten.
      </p>
    </div>
  );
}

// ── Rekomendasi side-by-side ───────────────────────────────────────────────────
function RekomendasiCompare({ rekA, rekB }) {
  if (!rekA && !rekB) return <p className="text-gray-400 text-sm font-semibold">Data rekomendasi tidak tersedia.</p>;

  const sections = [
    { key: "rekomendasi_kuat", label: "Rekomendasi Kuat (Kesesuaian S1 & Demand Naik)", icon: "✓", border: "border-[#16a34a]/25", bg: "bg-[#16a34a]/8", textCls: "text-[#15803d]" },
    { key: "rekomendasi_lemah", label: "Rekomendasi Lemah (Kesesuaian S2 & Demand Naik)", icon: "!", border: "border-[#eab308]/30", bg: "bg-[#eab308]/8", textCls: "text-[#a16207]" },
    { key: "tidak_direkomendasikan", label: "Tidak Direkomendasikan (Lahan Tidak Mendukung / Demand Turun)", icon: "✕", border: "border-[#dc2626]/22", bg: "bg-[#dc2626]/7", textCls: "text-[#b91c1c]" },
  ];

  return (
    <div className="space-y-6">
      {sections.map(({ key, label, icon, border, bg, textCls }) => {
        const listA = rekA?.[key] || [];
        const listB = rekB?.[key] || [];
        if (listA.length === 0 && listB.length === 0) return null;

        const allItems = [...new Set([...listA, ...listB])].sort();
        return (
          <div key={key} className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-300 ${border} ${bg}`}>
            <h3 className={`font-extrabold text-[14.5px] mb-4 flex items-center gap-2 ${textCls}`}>
              <span className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-[13px]">{icon}</span>
              {label}
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-white/50 bg-white/40">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-white text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2.5">Komoditas</th>
                    <th className="px-4 py-2.5">Kabupaten A</th>
                    <th className="px-4 py-2.5">Kabupaten B</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((kom) => {
                    const inA = listA.includes(kom);
                    const inB = listB.includes(kom);
                    return (
                      <tr key={kom} className={`border-t border-white/50 text-[13.5px] ${inA !== inB ? "font-extrabold text-gray-900 bg-white/20" : "text-gray-700"}`}>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <span>{getEmoji(kom)}</span>
                          <span>{kom}</span>
                        </td>
                        <td className="px-4 py-3">
                          {inA ? <span className="font-bold text-[#166534]">Ya (Direkomendasikan)</span> : <span className="text-gray-300 font-semibold">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {inB ? <span className="font-bold text-[#166534]">Ya (Direkomendasikan)</span> : <span className="text-gray-300 font-semibold">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

      {/* HEADER BANNER */}
      <section className="grain border border-[#166534]/10 rounded-3xl bg-white/50 backdrop-blur-sm px-6 py-8 mb-6 animate-fade-in">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-bold text-[#166534] bg-[#22c55e]/12 border border-[#166534]/15 px-3 py-1 rounded-full mb-3.5">
          ⚖️ Perbandingan Wilayah
        </span>
        <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-tight text-[#143d27] leading-tight">
          Bandingkan 2 Kabupaten
        </h1>
        <p className="text-[14.5px] text-[#46604f] mt-2 max-w-2xl font-medium leading-relaxed">
          Pilih dua kabupaten/kota untuk menganalisis profil agroekologi, tingkat kecocokan lahan, dan rekomendasi komoditas tanam secara berdampingan.
        </p>
      </section>

      {/* Kabupaten Selectors */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in">
        <label className="block">
          <span className="text-[12px] font-bold text-[#6a8174] uppercase tracking-wider mb-2 block">Kabupaten A</span>
          <select
            value={kodeA || ""}
            onChange={(e) => setKodeA(e.target.value || null)}
            className="w-full rounded-2xl border border-[#166534]/15 bg-white px-4 py-3 text-[14px] font-bold text-[#1a2e22] outline-none transition-all duration-300 focus:border-[#166534]/40 focus:ring-2 focus:ring-[#166534]/10"
          >
            <option value="">Pilih kabupaten/kota…</option>
            {kabupatenList.map((k) => (
              <option key={k.kode_kab} value={k.kode_kab} disabled={k.kode_kab === kodeB}>
                {k.nama_kab} ({k.provinsi})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[12px] font-bold text-[#6a8174] uppercase tracking-wider mb-2 block">Kabupaten B</span>
          <select
            value={kodeB || ""}
            onChange={(e) => setKodeB(e.target.value || null)}
            className="w-full rounded-2xl border border-[#166534]/15 bg-white px-4 py-3 text-[14px] font-bold text-[#1a2e22] outline-none transition-all duration-300 focus:border-[#166534]/40 focus:ring-2 focus:ring-[#166534]/10"
          >
            <option value="">Pilih kabupaten/kota…</option>
            {kabupatenList.map((k) => (
              <option key={k.kode_kab} value={k.kode_kab} disabled={k.kode_kab === kodeA}>
                {k.nama_kab} ({k.provinsi})
              </option>
            ))}
          </select>
        </label>
      </div>

      {!bothSelected ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed border-[#166534]/15 bg-white/40 animate-fade-in">
          <div className="text-5xl mb-4 animate-bounce-slow">⚖️</div>
          <p className="font-extrabold text-[#143d27] text-lg mb-1">Pilih Dua Kabupaten</p>
          <p className="text-[13.5px] text-[#8a9e92] font-semibold max-w-sm px-4">
            Pilih kabupaten A dan kabupaten B di atas untuk mulai melakukan perbandingan berdampingan.
          </p>
        </div>
      ) : (
        <div className="space-y-10 animate-fade-in">
          {/* Header nama */}
          <div className="grid grid-cols-3 gap-3 mb-6 items-stretch">
            <div className="flex items-center justify-center rounded-2xl border border-[#166534]/10 bg-white/50 text-[14px] font-extrabold text-[#143d27] p-3 text-center">
              📍 Peta Wilayah
            </div>
            <div className="bg-[#166534] text-white rounded-2xl px-4 py-4 text-center shadow-sm flex flex-col justify-between items-center group cursor-pointer transition-all duration-300 hover:shadow-md">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-widest opacity-80 mb-1">Kabupaten A</div>
                <div className="font-extrabold text-[15px] leading-tight mb-1">{kabA.nama_kab}</div>
                <div className="text-xs opacity-75 font-semibold">{kabA.provinsi}</div>
              </div>
              <Link href={`/kabupaten/${kabA.kode_kab}`} className="text-xs underline font-bold opacity-90 hover:opacity-100 mt-3 inline-block transition-opacity">
                Lihat detail →
              </Link>
            </div>
            <div className="bg-[#0369a1] text-white rounded-2xl px-4 py-4 text-center shadow-sm flex flex-col justify-between items-center group cursor-pointer transition-all duration-300 hover:shadow-md">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-widest opacity-80 mb-1">Kabupaten B</div>
                <div className="font-extrabold text-[15px] leading-tight mb-1">{kabB.nama_kab}</div>
                <div className="text-xs opacity-75 font-semibold">{kabB.provinsi}</div>
              </div>
              <Link href={`/kabupaten/${kabB.kode_kab}`} className="text-xs underline font-bold opacity-90 hover:opacity-100 mt-3 inline-block transition-opacity">
                Lihat detail →
              </Link>
            </div>
          </div>

          {/* Profil Wilayah */}
          <section className="bg-white rounded-3xl border border-[#166534]/10 overflow-hidden shadow-sm p-6">
            <h2 className="text-[18px] md:text-[20px] font-extrabold mb-4 text-[#143d27]">Profil Agroekologi Wilayah</h2>
            <div className="overflow-x-auto rounded-2xl border border-[#166534]/8">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-[#f3f8f4] text-[#5a7265] text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Indikator</th>
                    <th className="px-4 py-3">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#166534] mr-2" />
                      {kabA.nama_kab}
                    </th>
                    <th className="px-4 py-3">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#0369a1] mr-2" />
                      {kabB.nama_kab}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ProfilRow label="🧪 pH Tanah" valA={kabA.ph} valB={kabB.ph} highlight />
                  <ProfilRow
                    label="⛰️ Elevasi Lahan"
                    valA={kabA.dem != null ? `${kabA.dem} mdpl` : null}
                    valB={kabB.dem != null ? `${kabB.dem} mdpl` : null}
                    highlight
                  />
                  <ProfilRow
                    label="🪨 Tekstur Tanah"
                    valA={fmtTekstur(kabA.tekstur_eng)}
                    valB={fmtTekstur(kabB.tekstur_eng)}
                    highlight
                  />
                  <ProfilRow
                    label="🌡️ Suhu Rata-rata"
                    valA={kabA.suhu_mean != null ? `${kabA.suhu_mean}°C` : null}
                    valB={kabB.suhu_mean != null ? `${kabB.suhu_mean}°C` : null}
                    highlight
                  />
                  <ProfilRow
                    label="🌧️ Curah Hujan/thn"
                    valA={kabA.ch_tahunan_mm != null ? `${Math.round(kabA.ch_tahunan_mm)} mm` : null}
                    valB={kabB.ch_tahunan_mm != null ? `${Math.round(kabB.ch_tahunan_mm)} mm` : null}
                    highlight
                  />
                  <ProfilRow
                    label="🌾 Komoditas Cocok"
                    valA={kabA.n_komoditas_cocok != null ? `${kabA.n_komoditas_cocok} komoditas` : null}
                    valB={kabB.n_komoditas_cocok != null ? `${kabB.n_komoditas_cocok} komoditas` : null}
                    highlight
                  />
                </tbody>
              </table>
            </div>
            <p className="text-[11.5px] text-[#6a8174] font-semibold mt-3">
              💡 Baris berlatar kuning menandakan indikator memiliki nilai yang berbeda di lapangan.
            </p>
          </section>

          {/* Kesesuaian Lahan */}
          <section className="bg-white rounded-3xl border border-[#166534]/10 p-6 shadow-sm">
            <h2 className="text-[18px] md:text-[20px] font-extrabold mb-4 text-[#143d27]">Perbandingan Kesesuaian Lahan</h2>
            <KesesuaianCompare kelasA={kabA.kelas} kelasB={kabB.kelas} />
          </section>

          {/* Rekomendasi */}
          <section className="bg-white rounded-3xl border border-[#166534]/10 p-6 shadow-sm">
            <h2 className="text-[18px] md:text-[20px] font-extrabold mb-4 text-[#143d27]">Rekomendasi Komoditas Tanam</h2>
            <RekomendasiCompare rekA={rekA} rekB={rekB} />
          </section>
        </div>
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
