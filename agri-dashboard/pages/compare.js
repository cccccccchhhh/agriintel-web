// pages/compare.js
import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import Badge from "../components/Badge";
import { getKabupatenList, getAllKabupaten, getAllRekomendasi } from "../lib/data";
import { KELAS_LABEL } from "../lib/constants";

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

function ProfileRow({ label, valA, valB, diff }) {
  return (
    <tr className={`border-t border-white/10 transition-colors ${diff ? "bg-amber-500/20" : ""}`}>
      <td className="px-4 py-3.5 text-[12.5px] text-emerald-200/70 font-bold w-40">{label}</td>
      <td className="px-4 py-3.5 text-[14.5px] font-black text-white">{valA ?? "—"}</td>
      <td className="px-4 py-3.5 text-[14.5px] font-black text-white">{valB ?? "—"}</td>
    </tr>
  );
}

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
      return "bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white font-black shadow-md border border-[#bef264]";
    }
    return "glass-card text-emerald-100/70 border-white/15 hover:text-white";
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
            className={`text-[12px] font-extrabold px-4 py-2 rounded-xl transition-all duration-300 ${getFilterStyle(f.val)}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl glass-panel border border-white/15 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead className="bg-black/20 text-emerald-200/70 text-[11px] font-black uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Komoditas</th>
              <th className="px-4 py-3.5">Kesesuaian Kab A</th>
              <th className="px-4 py-3.5">Kesesuaian Kab B</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-xs">
            {filtered.map((kom) => {
              const a = kelasA?.[kom];
              const b = kelasB?.[kom];
              const isDiff = a !== b;
              return (
                <tr key={kom} className={`hover:bg-white/5 transition-colors ${isDiff ? "bg-amber-500/20" : ""}`}>
                  <td className="px-4 py-3.5 font-extrabold text-[14.5px] text-white flex items-center gap-2">
                    <span>{getEmoji(kom)}</span>
                    <span>{kom}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    {a ? (
                      <Badge text={a} color={KELAS_LABEL[a]?.color || "#6b7280"} />
                    ) : (
                      <span className="text-emerald-200/40 text-xs font-bold">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {b ? (
                      <Badge text={b} color={KELAS_LABEL[b]?.color || "#6b7280"} />
                    ) : (
                      <span className="text-emerald-200/40 text-xs font-bold">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-emerald-200/40 text-center font-bold">
                  Tidak ada data komoditas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11.5px] text-amber-300 font-bold">
        💡 Baris berlatar transparan kuning menandakan tingkat kesesuaian lahan berbeda antara kedua kabupaten.
      </p>
    </div>
  );
}

function RekomendasiCompare({ rekA, rekB }) {
  if (!rekA && !rekB) return <p className="text-emerald-200/40 text-sm font-semibold">Data rekomendasi tidak tersedia.</p>;

  const sections = [
    { key: "rekomendasi_kuat", label: "Rekomendasi Kuat (Kesesuaian S1 & Demand Naik)", icon: "✓", border: "border-emerald-500/40", bg: "bg-emerald-950/50", textCls: "text-[#bef264]" },
    { key: "rekomendasi_lemah", label: "Rekomendasi Lemah (Kesesuaian S2 & Demand Naik)", icon: "!", border: "border-amber-500/40", bg: "bg-amber-950/50", textCls: "text-amber-300" },
    { key: "tidak_direkomendasikan", label: "Tidak Direkomendasikan (Lahan Tidak Mendukung / Demand Turun)", icon: "✕", border: "border-rose-500/40", bg: "bg-rose-950/50", textCls: "text-rose-300" },
  ];

  return (
    <div className="space-y-6">
      {sections.map(({ key, label, icon, border, bg, textCls }) => {
        const listA = rekA?.[key] || [];
        const listB = rekB?.[key] || [];
        if (listA.length === 0 && listB.length === 0) return null;

        const allItems = [...new Set([...listA, ...listB])].sort();
        return (
          <div key={key} className={`rounded-2xl border p-5 shadow-xl ${border} ${bg} backdrop-blur-md`}>
            <h3 className={`font-black text-[14.5px] mb-4 flex items-center gap-2 ${textCls}`}>
              <span className="w-6 h-6 rounded-lg bg-black/40 shadow-sm flex items-center justify-center text-[13px]">{icon}</span>
              {label}
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-white/10 glass-card">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-black text-emerald-200/70 uppercase tracking-wider">
                    <th className="px-4 py-2.5">Komoditas</th>
                    <th className="px-4 py-2.5">Kabupaten A</th>
                    <th className="px-4 py-2.5">Kabupaten B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs">
                  {allItems.map((kom) => {
                    const inA = listA.includes(kom);
                    const inB = listB.includes(kom);
                    return (
                      <tr key={kom} className={`text-[13.5px] ${inA !== inB ? "font-black text-white bg-white/10" : "text-emerald-100/80"}`}>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <span>{getEmoji(kom)}</span>
                          <span>{kom}</span>
                        </td>
                        <td className="px-4 py-3">
                          {inA ? <span className="font-black text-[#bef264]">Ya (Direkomendasikan)</span> : <span className="text-emerald-200/40 font-bold">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {inB ? <span className="font-black text-[#bef264]">Ya (Direkomendasikan)</span> : <span className="text-emerald-200/40 font-bold">—</span>}
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
        <title>Bandingkan Kabupaten — AgriDiv</title>
      </Head>

      {/* HEADER BANNER */}
      <section className="grain relative overflow-hidden rounded-3xl glass-panel px-6 py-8 mb-6 animate-fade-in shadow-xl">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-extrabold text-[#bef264] bg-[#bef264]/15 border border-[#bef264]/30 px-3.5 py-1 rounded-full mb-3">
          ⚖️ Perbandingan Wilayah
        </span>
        <h1 className="text-[28px] md:text-[36px] font-black tracking-tight text-white leading-tight">
          Bandingkan 2 Kabupaten
        </h1>
        <p className="text-[14.5px] text-emerald-100/80 mt-2 max-w-2xl font-medium leading-relaxed">
          Pilih dua kabupaten/kota untuk menganalisis profil agroekologi, tingkat kecocokan lahan, dan rekomendasi komoditas tanam secara berdampingan.
        </p>
      </section>

      {/* Kabupaten Selectors */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in">
        <label className="block">
          <span className="text-[12px] font-black text-[#bef264] uppercase tracking-wider mb-2 block">Kabupaten A</span>
          <select
            value={kodeA || ""}
            onChange={(e) => setKodeA(e.target.value || null)}
            className="w-full rounded-2xl bg-[#0c2417]/90 border-2 border-white/20 px-4 py-3 text-[14px] font-bold text-white outline-none focus:border-[#bef264]"
          >
            <option value="" className="bg-[#0c2417] text-white">Pilih kabupaten/kota…</option>
            {kabupatenList.map((k) => (
              <option key={k.kode_kab} value={k.kode_kab} disabled={k.kode_kab === kodeB} className="bg-[#0c2417] text-white">
                {k.nama_kab} ({k.provinsi})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[12px] font-black text-sky-300 uppercase tracking-wider mb-2 block">Kabupaten B</span>
          <select
            value={kodeB || ""}
            onChange={(e) => setKodeB(e.target.value || null)}
            className="w-full rounded-2xl bg-[#0c2417]/90 border-2 border-white/20 px-4 py-3 text-[14px] font-bold text-white outline-none focus:border-sky-300"
          >
            <option value="" className="bg-[#0c2417] text-white">Pilih kabupaten/kota…</option>
            {kabupatenList.map((k) => (
              <option key={k.kode_kab} value={k.kode_kab} disabled={k.kode_kab === kodeA} className="bg-[#0c2417] text-white">
                {k.nama_kab} ({k.provinsi})
              </option>
            ))}
          </select>
        </label>
      </div>

      {bothSelected ? (
        <div className="space-y-10 animate-fade-in-up">
          {/* PROFILE COMPARISON TABLE */}
          <section className="glass-panel rounded-3xl p-6 shadow-xl">
            <h2 className="text-[18px] font-black text-white mb-4">Profil Agroekologi</h2>
            <div className="overflow-x-auto rounded-2xl border border-white/15 glass-card">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 text-emerald-200/70 text-[11px] font-black uppercase tracking-wider">
                    <th className="px-4 py-3.5">Parameter</th>
                    <th className="px-4 py-3.5 text-[#bef264]">{kabA.nama_kab}</th>
                    <th className="px-4 py-3.5 text-sky-300">{kabB.nama_kab}</th>
                  </tr>
                </thead>
                <tbody>
                  <ProfileRow label="Provinsi" valA={kabA.provinsi} valB={kabB.provinsi} diff={kabA.provinsi !== kabB.provinsi} />
                  <ProfileRow label="pH Tanah" valA={kabA.ph} valB={kabB.ph} diff={kabA.ph !== kabB.ph} />
                  <ProfileRow label="Curah Hujan/thn" valA={kabA.ch_tahunan_mm != null ? `${Math.round(kabA.ch_tahunan_mm)} mm` : null} valB={kabB.ch_tahunan_mm != null ? `${Math.round(kabB.ch_tahunan_mm)} mm` : null} diff={kabA.ch_tahunan_mm !== kabB.ch_tahunan_mm} />
                  <ProfileRow label="Suhu Rata-rata" valA={kabA.suhu_mean != null ? `${kabA.suhu_mean} °C` : null} valB={kabB.suhu_mean != null ? `${kabB.suhu_mean} °C` : null} diff={kabA.suhu_mean !== kabB.suhu_mean} />
                  <ProfileRow label="Elevasi" valA={kabA.dem != null ? `${kabA.dem} mdpl` : null} valB={kabB.dem != null ? `${kabB.dem} mdpl` : null} diff={kabA.dem !== kabB.dem} />
                  <ProfileRow label="Tekstur Tanah" valA={fmtTekstur(kabA.tekstur_eng)} valB={fmtTekstur(kabB.tekstur_eng)} diff={kabA.tekstur_eng !== kabB.tekstur_eng} />
                </tbody>
              </table>
            </div>
          </section>

          {/* KESESUAIAN SIDE BY SIDE */}
          <section className="glass-panel rounded-3xl p-6 shadow-xl">
            <h2 className="text-[18px] font-black text-white mb-4">Perbandingan Kesesuaian Lahan (S1/S2/N)</h2>
            <KesesuaianCompare kelasA={kabA.kelas} kelasB={kabB.kelas} />
          </section>

          {/* REKOMENDASI SIDE BY SIDE */}
          <section className="glass-panel rounded-3xl p-6 shadow-xl">
            <h2 className="text-[18px] font-black text-white mb-4">Perbandingan Rekomendasi Komoditas</h2>
            <RekomendasiCompare rekA={rekA} rekB={rekB} />
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed border-white/20 glass-panel animate-fade-in">
          <div className="text-5xl mb-4 animate-bounce-slow">⚖️</div>
          <p className="font-black text-white text-lg mb-1">Pilih Dua Kabupaten</p>
          <p className="text-[13.5px] text-emerald-200/70 font-medium max-w-sm px-4">
            Pilih Kabupaten A dan Kabupaten B pada menu di atas untuk menampilkan analisis perbandingan side-by-side.
          </p>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const kabupatenList = getKabupatenList();
  const allKab = getAllKabupaten();
  const allRek = getAllRekomendasi();

  const kabupatenMap = Object.fromEntries(allKab.map((k) => [k.kode_kab, k]));
  const rekomendasiMap = Object.fromEntries(allRek.map((r) => [r.kode_kab, r]));

  return {
    props: {
      kabupatenList,
      kabupatenMap,
      rekomendasiMap,
    },
  };
}
