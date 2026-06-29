// components/SearchBar.js
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/router";

const COMMODITIES = [
  { name: "Padi", icon: "🌾", meta: "Tanaman Pangan", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
  { name: "Jagung", icon: "🌽", meta: "Tanaman Pangan", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
  { name: "Cabai Merah", icon: "🌶️", meta: "Hortikultura", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
  { name: "Bawang Merah", icon: "🧅", meta: "Hortikultura", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
  { name: "Kopi Arabika", icon: "☕", meta: "Perkebunan", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
  { name: "Kedelai", icon: "🫘", meta: "Tanaman Pangan", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
  { name: "Kakao", icon: "🍫", meta: "Perkebunan", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
  { name: "Tomat", icon: "🍅", meta: "Hortikultura", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
  { name: "Kentang", icon: "🥔", meta: "Hortikultura", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
  { name: "Wortel", icon: "🥕", meta: "Hortikultura", kind: "Komoditas", iconBg: "bg-[#166534]/8 text-[#166534]" },
];

export default function SearchBar({ kabupatenList, autoFocus = false, showChips = false }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const boxRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedComms = COMMODITIES.filter((c) => c.name.toLowerCase().includes(q));
    const matchedKabs = (kabupatenList || [])
      .filter((k) => k.nama_kab.toLowerCase().includes(q) || (k.provinsi && k.provinsi.toLowerCase().includes(q)))
      .map((k) => ({
        name: k.nama_kab,
        meta: k.provinsi || "Kabupaten/Kota",
        kind: "Wilayah",
        icon: "📍",
        iconBg: "bg-[#22c55e]/15 text-[#166534]",
        kode_kab: k.kode_kab,
      }));

    return [...matchedComms, ...matchedKabs].slice(0, 5);
  }, [query, kabupatenList]);

  const handlePick = (item) => {
    setQuery(item.name);
    setOpen(false);
    if (item.kind === "Komoditas") {
      router.push(`/komoditas/${encodeURIComponent(item.name)}`);
    } else {
      router.push(`/kabupaten/${item.kode_kab}`);
    }
  };

  const handleSearchClick = () => {
    if (suggestions.length > 0) {
      handlePick(suggestions[0]);
    }
  };

  const chips = [
    { label: "Garut", search: "Garut" },
    { label: "Padi", search: "Padi" },
    { label: "Cabai Merah", search: "Cabai Merah" },
    { label: "Bandung", search: "Bandung" },
  ];

  return (
    <div ref={boxRef} className="relative w-full max-w-xl mx-auto text-left z-30">
      <div className="flex items-center gap-3 bg-white rounded-2xl border-2 border-[#166534]/15 shadow-[0_8px_30px_-12px_rgba(22,101,52,0.25)] focus-within:border-[#166534]/45 focus-within:shadow-[0_8px_30px_-8px_rgba(22,101,52,0.35)] transition-all duration-300 px-4 py-2.5">
        <span className="text-[#9bb0a3] text-[18px]">🔍</span>
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Cari kabupaten atau komoditas, mis. Garut, Padi…"
          className="flex-1 bg-transparent outline-none text-[15px] py-1.5 placeholder:text-[#a7bbae] text-[#1a2e22] font-medium"
        />
        <button
          type="button"
          onClick={handleSearchClick}
          className="shrink-0 bg-[#166534] hover:bg-[#12502a] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl hover:shadow-sm transition-all duration-300"
        >
          Cari
        </button>
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-3xl border border-[#166534]/12 shadow-[0_20px_50px_-15px_rgba(22,101,52,0.3)] overflow-hidden z-40 animate-fade-in-up">
          {suggestions.length > 0 ? (
            suggestions.map((s, idx) => (
              <button
                key={idx}
                onMouseDown={() => handlePick(s)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f3f8f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]/25 transition text-left border-b border-[#166534]/6 last:border-0"
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-[15px] ${s.iconBg}`}>
                  {s.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] font-semibold text-[#1a2e22] truncate">{s.name}</span>
                  <span className="block text-[12px] text-[#7d9387] font-medium truncate">{s.meta}</span>
                </span>
                <span className="text-[11px] font-bold text-[#a7bbae] uppercase tracking-wider">{s.kind}</span>
              </button>
            ))
          ) : (
            <div className="px-5 py-4 text-center text-gray-400 text-sm">
              <span className="block text-2xl mb-1">🍃</span>
              Tidak ditemukan kabupaten atau komoditas.
            </div>
          )}
        </div>
      )}

      {showChips && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center animate-fade-in delay-100">
          {chips.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(c.search);
                setOpen(true);
              }}
              className="text-[12.5px] font-semibold text-[#3c5547] bg-white border border-[#166534]/12 hover:border-[#166534]/35 hover:bg-[#f3f8f4] px-3.5 py-1.5 rounded-full shadow-sm transition-all duration-200"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
