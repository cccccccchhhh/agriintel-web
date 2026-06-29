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

function getCommMeta(name) {
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(COMMODITY_META)) {
    if (lower.includes(k)) return v;
  }
  return { emoji: "🌱", type: "Lainnya" };
}

const CLS_THEME = {
  S1: {
    border: "border-[#16a34a]/25 hover:border-[#16a34a]/50 hover:shadow-[0_8px_20px_-8px_rgba(22,163,74,0.25)]",
    badge: "bg-[#16a34a]/12 text-[#15803d]",
    label: "S1"
  },
  S2: {
    border: "border-[#eab308]/30 hover:border-[#eab308]/60 hover:shadow-[0_8px_20px_-8px_rgba(234,179,8,0.25)]",
    badge: "bg-[#eab308]/15 text-[#a16207]",
    label: "S2"
  },
  N: {
    border: "border-[#dc2626]/20 hover:border-[#dc2626]/40",
    badge: "bg-[#dc2626]/10 text-[#b91c1c]",
    label: "N"
  }
};

export default function SuitabilityTable({ kelas }) {
  const [filter, setFilter] = useState("ALL");

  const entries = Object.entries(kelas).sort((a, b) => {
    const order = { S1: 0, S2: 1, N: 2 };
    return order[a[1]] - order[b[1]];
  });

  const filtered = filter === "ALL" ? entries : entries.filter(([, k]) => k === filter);

  const getFilterStyle = (f) => {
    if (filter === f) {
      return "bg-[#166534] text-white shadow-sm";
    }
    return "bg-white border border-[#166534]/15 text-[#3c5547] hover:border-[#166534]/35 hover:bg-[#f3f8f4]";
  };

  return (
    <div className="space-y-6">
      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-2 animate-fade-in">
        {[
          { key: "ALL", label: "Semua Komoditas" },
          { key: "S1", label: "Sangat Sesuai (S1)" },
          { key: "S2", label: "Cukup Sesuai (S2)" },
          { key: "N", label: "Tidak Sesuai (N)" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-[12.5px] font-bold px-4 py-2 rounded-xl transition-all duration-300 ${getFilterStyle(f.key)}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* CARD GRID */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(([kom, k]) => {
            const meta = getCommMeta(kom);
            const style = CLS_THEME[k] || CLS_THEME["N"];
            return (
              <Link
                key={kom}
                href={`/komoditas/${encodeURIComponent(kom)}`}
                className={`bg-white rounded-2xl border p-4 flex items-center justify-between gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer ${style.border} animate-fade-in-up`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-[#166534]/6 flex items-center justify-center text-[18px] shrink-0">
                    {meta.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-extrabold text-[#1a2e22] truncate">{kom}</div>
                    <div className="text-[11px] text-[#8a9e92] font-semibold">{meta.type}</div>
                  </div>
                </div>
                <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-extrabold transition-all duration-200 ${style.badge}`}>
                  {style.label}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-[#166534]/15 animate-fade-in">
          <p className="text-sm text-gray-500 font-semibold">Tidak ada komoditas pada kategori ini.</p>
        </div>
      )}
    </div>
  );
}
