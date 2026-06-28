// components/RecommendationBox.js
const STYLE = {
  kuat: { bg: "bg-green-50", border: "border-green-300", title: "✅ Rekomendasi Kuat", titleColor: "text-green-700" },
  lemah: { bg: "bg-yellow-50", border: "border-yellow-300", title: "⚠️ Rekomendasi Lemah", titleColor: "text-yellow-700" },
  tidak: { bg: "bg-red-50", border: "border-red-200", title: "❌ Cocok Iklim, Demand Tidak Mendukung", titleColor: "text-red-600" },
};

export default function RecommendationBox({ type, items, distribusi, descriptions }) {
  const s = STYLE[type];
  if (!items || items.length === 0) return null;

  return (
    <div className={`rounded-xl border ${s.border} ${s.bg} p-4`}>
      <h3 className={`font-semibold mb-2 ${s.titleColor}`}>{s.title}</h3>
      <ul className="space-y-2">
        {items.map((kom) => (
          <li key={kom} className="text-sm">
            <span className="font-medium">{kom}</span>
            {descriptions?.[type] && <p className="text-gray-500 text-xs mt-0.5">{descriptions[type]}</p>}
            {distribusi && distribusi[kom] && distribusi[kom].length > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                Saran distribusi: <span className="font-medium">{distribusi[kom].join(", ")}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
