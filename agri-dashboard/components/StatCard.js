// components/StatCard.js
export default function StatCard({ label, value, sub, color = "#143d27", icon, iconBg }) {
  return (
    <div className="bg-white rounded-2xl border border-[#166534]/10 p-5 shadow-sm hover:shadow-[0_12px_30px_-18px_rgba(22,101,52,0.35)] hover:-translate-y-1 hover:border-[#166534]/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] animate-fade-in-up">
      <div>
        <div className="flex items-center justify-between">
          {icon ? (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[18px] ${iconBg || "bg-[#166534]/8 text-[#166534]"}`}>
              {icon}
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#22c55e]/10 flex items-center justify-center text-[18px] text-[#166534]">
              📊
            </div>
          )}
          {sub && !sub.includes("kabupaten") && !sub.includes("tren") && (
            <span className="text-[11px] font-semibold text-[#8a9e92] px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
              {sub}
            </span>
          )}
        </div>
        <div className="text-[28px] font-extrabold tracking-tight leading-none mt-4" style={{ color }}>
          {value}
        </div>
      </div>
      <div>
        <div className="text-[13px] font-bold text-[#6a8174] mt-2.5 leading-snug">
          {label}
        </div>
        {sub && (sub.includes("kabupaten") || sub.includes("tren") || sub.includes("per") || sub.includes("kelas")) && (
          <div className="text-[11px] text-[#8a9e92] mt-1 font-medium leading-normal">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
