// components/StatCard.js
export default function StatCard({ label, value, sub, color = "#143d27", icon, iconBg }) {
  return (
    <div className="bg-white rounded-3xl border border-[#166534]/10 p-5 shadow-sm hover:shadow-[0_12px_30px_-18px_rgba(22,101,52,0.35)] hover:-translate-y-1 hover:border-[#166534]/25 transition-all duration-300 flex flex-col justify-between min-h-[150px] animate-fade-in-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-[18px] ${iconBg || "bg-[#166534]/8 text-[#166534]"}`}>
            {icon || "📊"}
          </div>
          <div>
            <div className="text-[13px] text-[#6a8174] font-semibold">{label}</div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="text-[30px] font-extrabold tracking-tight leading-none" style={{ color }}>
          {value}
        </div>
        {sub && (
          <div className="text-[12px] text-[#8a9e92] mt-2 font-medium leading-relaxed">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
