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
    boxCls: "bg-[#16a34a]/8 border-[#16a34a]/25",
    iconCls: "bg-[#16a34a] text-white",
    titleCls: "text-[#15803d]",
    noteCls: "text-[#3f7553]",
    title: "Direkomendasikan Kuat",
    icon: "✓",
    note: "Kesesuaian tinggi dan harga pasar sedang naik. Prioritaskan komoditas ini."
  },
  lemah: {
    boxCls: "bg-[#eab308]/8 border-[#eab308]/30",
    iconCls: "bg-[#eab308] text-white",
    titleCls: "text-[#a16207]",
    noteCls: "text-[#8a6d1f]",
    title: "Rekomendasi Lemah",
    icon: "!",
    note: "Masih bisa ditanam, namun hasil dan keuntungan cenderung kurang optimal."
  },
  tidak: {
    boxCls: "bg-[#dc2626]/7 border-[#dc2626]/22",
    iconCls: "bg-[#dc2626] text-white",
    titleCls: "text-[#b91c1c]",
    noteCls: "text-[#9a3b3b]",
    title: "Tidak Mendukung",
    icon: "✕",
    note: "Iklim dan karakter lahan tidak sesuai atau demand pasar melemah. Sebaiknya dihindari."
  }
};

export default function RecommendationBox({ type, items, distribusi, descriptions }) {
  const s = STYLE[type];
  if (!items || items.length === 0) return null;

  return (
    <div className={`rounded-3xl border p-5 transition-all duration-300 hover:shadow-[0_18px_45px_-28px_rgba(22,101,52,0.28)] animate-fade-in-up ${s.boxCls}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[15px] font-extrabold ${s.iconCls}`}>
          {s.icon}
        </span>
        <h3 className={`text-[16px] font-extrabold ${s.titleCls}`}>
          {s.title}
        </h3>
      </div>

      <ul className="space-y-3 pl-1">
        {items.map((kom) => (
          <li key={kom} className="flex flex-col gap-1 text-[14px] font-semibold text-[#1a2e22]">
            <div className="flex items-center gap-2">
              <span className="text-[16px] shrink-0">{getEmoji(kom)}</span>
              <span>{kom}</span>
            </div>
            {descriptions?.[type] && (
              <p className="text-[11px] text-[#4b5563] ml-6 leading-snug">
                {descriptions[type]}
              </p>
            )}
            {distribusi && distribusi[kom] && distribusi[kom].length > 0 && (
              <p className="text-[11px] text-[#4b5563] ml-6 leading-snug">
                📍 Sentra distribusi: <span className="font-bold text-[#1f2937]">{distribusi[kom].join(", ")}</span>
              </p>
            )}
          </li>
        ))}
      </ul>

      <p className={`text-[12px] mt-5 leading-relaxed font-semibold ${s.noteCls}`}>
        {s.note}
      </p>
    </div>
  );
}
