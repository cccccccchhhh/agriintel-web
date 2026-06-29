// components/SearchBar.js
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/router";

const FALLBACK_COMMODITIES = [
  { name: "Padi", icon: "🌾" },
  { name: "Jagung", icon: "🌽" },
  { name: "Cabai Merah", icon: "🌶️" },
  { name: "Bawang Merah", icon: "🧅" },
  { name: "Kopi Arabika", icon: "☕" },
  { name: "Kedelai", icon: "🫘" },
  { name: "Kakao", icon: "🍫" },
  { name: "Tomat", icon: "🍅" },
  { name: "Kentang", icon: "🥔" },
  { name: "Wortel", icon: "🥕" },
];

function getCommodityIcon(name) {
  const lower = name.toLowerCase();
  if (lower.includes("padi")) return "🌾";
  if (lower.includes("jagung")) return "🌽";
  if (lower.includes("cabai") || lower.includes("cabe")) return "🌶️";
  if (lower.includes("bawang")) return "🧅";
  if (lower.includes("kopi")) return "☕";
  if (lower.includes("kedelai")) return "🫘";
  if (lower.includes("kakao")) return "🍫";
  if (lower.includes("tomat")) return "🍅";
  if (lower.includes("kentang")) return "🥔";
  if (lower.includes("wortel")) return "🥕";
  if (lower.includes("durian")) return "🍈";
  if (lower.includes("buah")) return "🍈";
  return "🌱";
}

export default function SearchBar({
  kabupatenList = [],
  komoditasList = [],
  autoFocus = false,
  showChips = false,
  mode = "mixed",
  placeholder,
  provinsi,
  setProvinsi,
  provinsiList = [],
}) {
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

  const availableKomoditas = useMemo(() => {
    if (komoditasList.length) {
      return komoditasList.map((kom) => ({
        name: kom.komoditas,
        icon: getCommodityIcon(kom.komoditas),
        meta: "Komoditas",
        kind: "Komoditas",
        iconBg: "bg-[#22c55e]/20 text-[#bef264] border border-[#22c55e]/30",
      }));
    }
    return FALLBACK_COMMODITIES.map((item) => ({
      name: item.name,
      icon: item.icon,
      meta: "Komoditas",
      kind: "Komoditas",
      iconBg: "bg-[#22c55e]/20 text-[#bef264] border border-[#22c55e]/30",
    }));
  }, [komoditasList]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedKabs = (kabupatenList || [])
      .filter((k) => k.nama_kab.toLowerCase().includes(q) || (k.provinsi && k.provinsi.toLowerCase().includes(q)))
      .map((k) => ({
        name: k.nama_kab,
        meta: k.provinsi || "Kabupaten/Kota",
        kind: "Wilayah",
        icon: "📍",
        iconBg: "bg-[#22c55e]/20 text-[#bef264] border border-[#22c55e]/30",
        kode_kab: k.kode_kab,
      }));

    const matchedComms = availableKomoditas.filter((c) => c.name.toLowerCase().includes(q));
    let items = [];
    if (mode === "komoditas") {
      items = matchedComms;
    } else if (mode === "kabupaten") {
      items = matchedKabs;
    } else {
      items = [...matchedComms, ...matchedKabs];
    }

    return items.slice(0, 6);
  }, [query, kabupatenList, availableKomoditas, mode]);

  const handlePick = (item) => {
    setQuery(item.name);
    setOpen(false);
    if (item.kind === "Komoditas") {
      router.push(`/komoditas/${encodeURIComponent(item.name)}`);
    } else if (item.kind === "Wilayah") {
      router.push(`/kabupaten/${item.kode_kab}`);
    }
  };

  const handleSearchClick = () => {
    if (suggestions.length > 0) {
      handlePick(suggestions[0]);
    }
  };

  const chips = useMemo(() => {
    if (mode === "komoditas") {
      return availableKomoditas.slice(0, 4).map((item) => ({ label: item.name, search: item.name }));
    }
    return [
      { label: "Garut", search: "Garut" },
      { label: "Bandung", search: "Bandung" },
      { label: "Malang", search: "Malang" },
      { label: "Yogyakarta", search: "Yogyakarta" },
    ];
  }, [mode, availableKomoditas]);

  const finalPlaceholder = placeholder || (mode === "komoditas" ? "Cari komoditas, mis. Bayam…" : "Cari kabupaten/kota, mis. Garut…");

  return (
    <div ref={boxRef} className="relative w-full max-w-2xl mx-auto text-left z-30">
      {/* UNIFIED MASTER FLOATING GLASS CAPSULE BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-[#0a2617]/95 rounded-3xl sm:rounded-full border-2 border-[#bef264]/50 shadow-[0_0_35px_rgba(34,197,94,0.3)] focus-within:border-[#bef264] transition-all duration-300 p-2 sm:p-2.5 backdrop-blur-2xl gap-2 sm:gap-3">
        
        {/* INTEGRATED PROVINSI SELECTOR */}
        {setProvinsi && (
          <div className="flex items-center gap-2 px-3 sm:pl-4 sm:pr-2 py-2 sm:py-0 sm:border-r border-white/15 shrink-0">
            <span className="text-[16px]">🗺️</span>
            <select
              value={provinsi || ""}
              onChange={(e) => setProvinsi(e.target.value)}
              className="bg-transparent text-[13.5px] font-black text-white outline-none cursor-pointer appearance-none pr-6 relative z-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23bef264'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right center",
                backgroundSize: "14px",
              }}
            >
              <option value="" className="bg-[#0c2417] text-white">Semua Provinsi</option>
              {provinsiList.map((p) => (
                <option key={p} value={p} className="bg-[#0c2417] text-white">{p}</option>
              ))}
            </select>
          </div>
        )}

        {/* SEARCH INPUT AREA */}
        <div className="flex items-center gap-2.5 flex-1 px-3 sm:px-2 py-1">
          <span className="text-[#bef264] text-[18px]">🔍</span>
          <input
            autoFocus={autoFocus}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={finalPlaceholder}
            className="w-full bg-transparent outline-none text-[15px] py-1 placeholder:text-emerald-200/50 text-white font-bold"
          />
        </div>

        {/* ACTION BUTTON */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="shrink-0 bg-gradient-to-r from-[#bef264] via-[#a3e635] to-[#84cc16] text-[#08140c] font-black text-[14px] px-6 py-3 rounded-full hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(190,242,100,0.45)] hover:scale-[1.03]"
        >
          Cari
        </button>
      </div>

      {/* AUTOCOMPLETE SUGGESTIONS POPUP */}
      {open && query.trim() && (
        <div className="absolute left-0 right-0 mt-3 bg-[#0a2617]/95 backdrop-blur-2xl rounded-3xl border-2 border-[#bef264]/40 shadow-2xl overflow-hidden z-40 animate-fade-in-up">
          {suggestions.length > 0 ? (
            suggestions.map((s) => (
              <button
                key={s.kode_kab || s.name}
                onMouseDown={() => handlePick(s)}
                className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-[#22c55e]/25 transition text-left border-b border-white/10 last:border-0"
              >
                <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[16px] shadow-sm ${s.iconBg}`}>
                  {s.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14.5px] font-black text-white truncate">{s.name}</span>
                  <span className="block text-[12px] text-emerald-200/80 font-semibold truncate">{s.meta}</span>
                </span>
                <span className="text-[11px] font-black text-[#bef264] uppercase tracking-wider bg-[#bef264]/20 px-3 py-1 rounded-full border border-[#bef264]/30">{s.kind}</span>
              </button>
            ))
          ) : (
            <div className="px-5 py-5 text-center text-emerald-200/60 text-sm font-semibold">
              <span className="block text-3xl mb-1">🍃</span>
              Tidak ada hasil yang cocok dengan kata kunci.
            </div>
          )}
        </div>
      )}

      {/* QUICK CHIPS RE-DESIGNED */}
      {showChips && (
        <div className="flex flex-wrap gap-2.5 mt-4 justify-center animate-fade-in delay-100">
          <span className="text-[12px] font-black text-emerald-200/60 self-center mr-1">Rekomendasi Cepat:</span>
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                setQuery(c.search);
                setOpen(true);
              }}
              className="text-[12.5px] font-black text-white bg-[#0f3421]/90 border border-white/20 hover:border-[#bef264] hover:bg-[#22c55e]/30 hover:text-[#bef264] px-4 py-1.5 rounded-full shadow-md transition-all duration-300 backdrop-blur-md hover:scale-[1.05]"
            >
              📍 {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
