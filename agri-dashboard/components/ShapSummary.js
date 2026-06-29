// components/ShapSummary.js
import React from "react";

export default function ShapSummary({ features = [] }) {
  const safeFeatures = features || [];
  const maxImp = safeFeatures.length > 0 ? Math.max(...safeFeatures.map((f) => f.importance || 0)) : 1;

  return (
    <div className="space-y-4">
      <div className="border-b border-white/10 pb-3">
        <h3 className="font-extrabold text-lg text-white">Global Feature Importance (XGBoost + SHAP)</h3>
        <p className="text-xs text-emerald-200/70 mt-1 font-medium leading-relaxed">
          Atribusi rata-rata kontribusi absolut setiap variabel terhadap prediksi tingkat dan arah permintaan pasar.
        </p>
      </div>
      <div className="space-y-3.5">
        {safeFeatures.map((item) => {
          const pct = Math.round(((item.importance || 0) / (maxImp || 1)) * 100);
          return (
            <div key={item.feature} className="group">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-white font-bold">{item.feature}</span>
                <span className="text-[#bef264] font-mono font-black">{((item.importance || 0) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-black/30 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-[#22c55e] to-[#bef264] h-full rounded-full transition-all duration-500 group-hover:brightness-110 shadow-sm"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[11px] text-emerald-200/60 mt-1 italic font-medium">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
