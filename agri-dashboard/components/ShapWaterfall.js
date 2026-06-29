// components/ShapWaterfall.js
import React from "react";

export default function ShapWaterfall({ caseStudy = {} }) {
  const { kabupaten = "Wilayah", komoditas = "Komoditas", base_value = 0.5, output_value = 0.5, status = "-", contributions = [] } = caseStudy || {};

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#bef264] bg-[#22c55e]/20 px-3 py-1 rounded-lg border border-[#22c55e]/30">
            Explainable AI (SHAP Waterfall)
          </span>
          <h3 className="text-xl font-black text-white mt-2.5">
            Prediksi Prospek: {komoditas} ({kabupaten})
          </h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-[#bef264]">{(output_value * 100).toFixed(0)}%</div>
          <div className="text-xs font-extrabold text-white bg-[#22c55e]/30 px-3 py-1 rounded-full inline-block mt-1 border border-[#22c55e]/40">
            {status}
          </div>
        </div>
      </div>

      <p className="text-xs text-emerald-200/70 leading-relaxed font-medium">
        Grafik atribusi di bawah ini menjelaskan transisi dari <strong className="text-white">Base Expectation ({base_value * 100}%)</strong> ke <strong className="text-[#bef264]">Output Prediction ({output_value * 100}%)</strong> melalui kontribusi masing-masing faktor pendorong (merah/hijau).
      </p>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-200/60 bg-black/20 px-4 py-2 rounded-xl border border-white/10">
          <span>Nilai Dasar Ekspektasi Model (Base Value)</span>
          <span className="font-mono text-white">{(base_value * 100).toFixed(0)}%</span>
        </div>

        {(contributions || []).map((item) => {
          const isPos = item.value > 0;
          const valStr = isPos ? `+${(item.value * 100).toFixed(0)}%` : `${(item.value * 100).toFixed(0)}%`;
          return (
            <div key={item.feature} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all glass-card">
              <div className="space-y-0.5 max-w-md">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isPos ? "bg-[#22c55e]" : "bg-rose-500"}`} />
                  <span className="text-xs font-extrabold text-white">{item.feature}</span>
                </div>
                <p className="text-[11px] text-emerald-200/60 pl-5 font-medium">{item.desc}</p>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className={`text-xs font-mono font-black px-3 py-1 rounded-xl border ${isPos ? "bg-emerald-500/20 text-[#bef264] border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border-rose-500/30"}`}>
                  {valStr}
                </span>
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between text-xs font-extrabold text-white bg-emerald-500/20 px-4 py-2.5 rounded-2xl border border-emerald-500/30 mt-3">
          <span>Hasil Prediksi Akhir Prospek Permintaan (Output Value)</span>
          <span className="font-mono text-sm text-[#bef264] font-black">{(output_value * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
