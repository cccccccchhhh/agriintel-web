// components/StatCard.js
export default function StatCard({ label, value, sub, color, icon, iconBg }) {
  return (
    <div className="glass-card rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between animate-fade-in-up group relative overflow-hidden h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[18px] transition-transform duration-300 group-hover:scale-110 shadow-sm shrink-0 ${iconBg || "bg-[#22c55e]/20 text-[#bef264] border border-[#22c55e]/30"}`}>
            {icon || "📊"}
          </div>
          <div>
            <div className="text-[12.5px] text-emerald-100/80 font-extrabold leading-snug">{label}</div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-[28px] md:text-[32px] font-black tracking-tight leading-none text-white drop-shadow-md" style={color ? { color } : {}}>
          {value}
        </div>
        {sub && (
          <div className="text-[11.5px] text-emerald-200/70 mt-1.5 font-bold leading-relaxed">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
