// components/SuitabilityTable.js
import { useState } from "react";
import Link from "next/link";

const COMMODITY_META = {
  padi: { emoji: "🌾", type: "Tanaman Pangan" },
  jagung: { emoji: "🌽", type: "Tanaman Pangan" },
  kedelai: { emoji: "🫘", type: "Tanaman Pangan" },
  "kacang tanah": { emoji: "🥜", type: "Tanaman Pangan" },
  "kacang hijau": { emoji: "🫘", type: "Tanaman Pangan" },
  "kacang panjang": { emoji: "🫘", type: "Hortikultura" },
  "ubi kayu": { emoji: "🍠", type: "Tanaman Pangan" },
  "ubi jalar": { emoji: "🍠", type: "Tanaman Pangan" },
  tebu: { emoji: "🎋", type: "Perkebunan" },
  "kelapa sawit": { emoji: "🌴", type: "Perkebunan" },
  kelapa: { emoji: "🥥", type: "Perkebunan" },
  karet: { emoji: "🌿", type: "Perkebunan" },
  kakao: { emoji: "🍫", type: "Perkebunan" },
  kopi: { emoji: "☕", type: "Perkebunan" },
  teh: { emoji: "🍵", type: "Perkebunan" },
  pisang: { emoji: "🍌", type: "Hortikultura" },
  mangga: { emoji: "🥭", type: "Hortikultura" },
  nanas: { emoji: "🍍", type: "Hortikultura" },
  pepaya: { emoji: "🍈", type: "Hortikultura" },
  durian: { emoji: "🍈", type: "Hortikultura" },
  cabai: { emoji: "🌶️", type: "Hortikultura" },
  bawang: { emoji: "🧅", type: "Hortikultura" },
  tomat: { emoji: "🍅", type: "Hortikultura" },
  kentang: { emoji: "🥔", type: "Hortikultura" },
  wortel: { emoji: "🥕", type: "Hortikultura" },
  sawi: { emoji: "🥬", type: "Hortikultura" },
  bayam: { emoji: "🥬", type: "Hortikultura" },
  semangka: { emoji: "🍉", type: "Hortikultura" },
  melon: { emoji: "🍈", type: "Hortikultura" },
  lada: { emoji: "🌶️", type: "Perkebunan" },
  cengkeh: { emoji: "🌸", type: "Perkebunan" },
  pala: { emoji: "🌰", type: "Perkebunan" },
  vanili: { emoji: "🌿", type: "Perkebunan" },
  jahe: { emoji: "🫚", type: "Hortikultura" },
  kunyit: { emoji: "🫚", type: "Hortikultura" },
  kapas: { emoji: "🪴", type: "Perkebunan" },
  tembakau: { emoji: "🍃", type: "Perkebunan" },
};

const CANONICAL_MAP = {
  "Bawang Merah": "Bawang merah",
  "Bawang Putih": "Bawang putih",
  "Cabe": "Cabe rawit",
  "Sawi": "Sawi Putih",
};

function getCanonicalName(name) {
  return CANONICAL_MAP[name] || name;
}

function getCommMeta(name) {
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(COMMODITY_META)) {
    if (lower.includes(k)) return v;
  }
  return { emoji: "🌱", type: "Lainnya" };
}

const CLS_THEME = {
  S1: {
    border: "border-emerald-500/40 hover:border-[#bef264]",
    badge: "bg-emerald-500/20 text-[#bef264] font-extrabold border border-emerald-500/40",
    label: "S1"
  },
  S2: {
    border: "border-amber-500/40 hover:border-amber-400",
    badge: "bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40",
    label: "S2"
  },
  N: {
    border: "border-rose-500/40 hover:border-rose-400",
    badge: "bg-rose-500/20 text-rose-300 font-extrabold border border-rose-500/40",
    label: "N"
  }
};

export default function SuitabilityTable({ kelas }) {
  const [filter, setFilter] = useState("ALL");

  const entries = Object.entries(kelas || {}).sort((a, b) => {
    const order = { S1: 0, S2: 1, N: 2 };
    return order[a[1]] - order[b[1]];
  });

  const filtered = filter === "ALL" ? entries : entries.filter(([, k]) => k === filter);

  const getFilterStyle = (f) => {
    if (filter === f) {
      return "bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white font-black shadow-md border border-[#bef264]/40";
    }
    return "glass-card text-emerald-100/70 border-white/10 hover:border-white/20 hover:text-white";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 animate-fade-in-up">
        {[
          { key: "ALL", label: "Semua Komoditas" },
          { key: "S1", label: "Sangat Sesuai (S1)" },
          { key: "S2", label: "Cukup Sesuai (S2)" },
          { key: "N", label: "Tidak Sesuai (N)" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-[12.5px] font-bold px-4 py-2 rounded-2xl transition-all duration-300 ${getFilterStyle(f.key)}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(([kom, k]) => {
            const meta = getCommMeta(kom);
            const style = CLS_THEME[k] || CLS_THEME["N"];
            return (
              <Link
                key={kom}
                href={`/komoditas/${encodeURIComponent(getCanonicalName(kom))}`}
                className={`glass-card rounded-3xl p-4 flex items-center justify-between gap-3 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${style.border} animate-fade-in-up`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-11 h-11 rounded-2xl bg-[#22c55e]/15 flex items-center justify-center text-[18px] shrink-0 border border-[#22c55e]/20">
                    {meta.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-extrabold text-white truncate">{kom}</div>
                    <div className="text-[11.5px] text-emerald-200/60 font-bold">{meta.type}</div>
                  </div>
                </div>
                <span className={`shrink-0 rounded-2xl px-3 py-1.5 text-[12px] ${style.badge}`}>
                  {style.label}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 glass-panel rounded-3xl border border-dashed border-white/15 animate-fade-in-up">
          <p className="text-sm text-emerald-200/50 font-semibold">Tidak ada komoditas pada kategori ini.</p>
        </div>
      )}
    </div>
  );
}
