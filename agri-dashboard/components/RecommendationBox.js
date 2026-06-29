// components/RecommendationBox.js
const EMOJI_MAP = {
  padi: "🌾", jagung: "🌽", kedelai: "🫘", "kacang tanah": "🥜",
  "kacang hijau": "🫘", "kacang panjang": "🫘", ubi: "🍠",
  tebu: "🎋", "kelapa sawit": "🌴", kelapa: "🥥",
  karet: "🌿", kakao: "🍫", kopi: "☕", teh: "🍵",
  pisang: "🍌", mangga: "🥭", nanas: "🍍", pepaya: "🍈",
  durian: "🍈", cabai: "🌶️", bawang: "🧅", tomat: "🍅",
  kentang: "🥔", wortel: "🥕", sawi: "🥬", bayam: "🥬",
  semangka: "🍉", melon: "🍈", lada: "🌶️", cengkeh: "🌸",
  pala: "🌰", vanili: "🌿", jahe: "🫚", kunyit: "🫚",
  kapas: "🪴", tembakau: "🍃",
};

function getEmoji(name) {
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(k)) return v;
  }
  return "🌱";
}

const STYLE = {
  kuat: {
    boxCls: "bg-emerald-950/60 border-emerald-500/40 shadow-lg backdrop-blur-md",
    iconCls: "bg-[#22c55e] text-black font-black shadow-sm",
    titleCls: "text-[#bef264] font-black",
    noteCls: "text-emerald-200/80 font-semibold",
    title: "Direkomendasikan Kuat",
    icon: "✓",
    note: "Kesesuaian tinggi dan harga pasar sedang naik. Prioritaskan komoditas ini."
  },
  lemah: {
    boxCls: "bg-amber-950/60 border-amber-500/40 shadow-lg backdrop-blur-md",
    iconCls: "bg-[#f59e0b] text-black font-black shadow-sm",
    titleCls: "text-amber-300 font-black",
    noteCls: "text-amber-200/80 font-semibold",
    title: "Rekomendasi Lemah",
    icon: "!",
    note: "Masih bisa ditanam, namun hasil dan keuntungan cenderung kurang optimal."
  },
  tidak: {
    boxCls: "bg-rose-950/60 border-rose-500/40 shadow-lg backdrop-blur-md",
    iconCls: "bg-[#f43f5e] text-black font-black shadow-sm",
    titleCls: "text-rose-300 font-black",
    noteCls: "text-rose-200/80 font-semibold",
    title: "Tidak Mendukung",
    icon: "✕",
    note: "Iklim dan karakter lahan tidak sesuai atau demand pasar melemah. Sebaiknya dihindari."
  }
};

export default function RecommendationBox({ type, items, distribusi, descriptions }) {
  const s = STYLE[type] || STYLE.lemah;
  const hasItems = items && items.length > 0;

  return (
    <div className={`rounded-3xl border p-6 transition-all duration-300 hover:shadow-xl animate-fade-in-up flex flex-col justify-between ${s.boxCls}`}>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[15px] ${s.iconCls}`}>
            {s.icon}
          </span>
          <h3 className={`text-[16px] ${s.titleCls}`}>
            {s.title}
          </h3>
        </div>

        {hasItems ? (
          <ul className="space-y-3 pl-1">
            {items.map((kom) => (
              <li key={kom} className="flex flex-col gap-1 text-[14px] font-bold text-white">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] shrink-0">{getEmoji(kom)}</span>
                  <span>{kom}</span>
                </div>
                {descriptions?.[type] && (
                  <p className="text-[11.5px] text-emerald-200/70 ml-6 leading-snug font-normal">
                    {descriptions[type]}
                  </p>
                )}
                {distribusi && distribusi[kom] && distribusi[kom].length > 0 && (
                  <p className="text-[11.5px] text-emerald-200/70 ml-6 leading-snug font-normal">
                    📍 Sentra distribusi: <span className="font-bold text-[#bef264]">{distribusi[kom].join(", ")}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-4 text-center text-xs font-semibold text-emerald-200/40 italic bg-black/30 rounded-2xl border border-dashed border-white/10">
            Tidak ada komoditas dalam kategori ini
          </div>
        )}
      </div>

      <p className={`text-[12px] mt-5 leading-relaxed ${s.noteCls}`}>
        {s.note}
      </p>
    </div>
  );
}
