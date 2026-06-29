// components/OniChart.js
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

export default function OniChart({ data }) {
  return (
    <div className="glass-panel rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-300 bg-sky-500/20 px-3 py-1 rounded-lg border border-sky-500/30">
            Siklus Iklim ENSO (SARIMAX Exogenous)
          </span>
          <h3 className="text-xl font-black text-white mt-2">
            Indeks ONI (Oceanic Niño Index) 2023–2024
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"/> El Niño (&gt; 0.5)</span>
          <span className="flex items-center gap-1.5 text-sky-400"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"/> La Niña (&lt; -0.5)</span>
        </div>
      </div>

      <p className="text-xs text-emerald-200/70 leading-relaxed font-medium">
        Indeks ONI digunakan sebagai variabel eksogen dalam model deret waktu SARIMAX untuk menangkap dinamika kekeringan akibat El Niño di 494 kabupaten/kota di Indonesia (RMSE suhu: 0.346 °C, RMSE curah hujan: 3.293 mm/hari).
      </p>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorElNino" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="periode" tick={{ fontSize: 10, fill: "#a7f3d0" }} />
            <YAxis domain={[-1.5, 2.5]} tick={{ fontSize: 10, fill: "#a7f3d0" }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-[#0c2417] text-white p-3 rounded-2xl shadow-2xl border border-[#bef264]/40 text-xs space-y-1">
                      <div className="font-extrabold text-white">{dataPoint.periode}</div>
                      <div className="text-[#bef264] font-mono font-black">ONI Index: {dataPoint.oni}</div>
                      <div className="text-amber-300 font-bold">Fase: {dataPoint.fase}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={0.5} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "+0.5 El Niño", fill: "#f43f5e", fontSize: 10, position: "insideTopRight", fontWeight: "bold" }} />
            <ReferenceLine y={-0.5} stroke="#0ea5e9" strokeDasharray="3 3" label={{ value: "-0.5 La Niña", fill: "#0ea5e9", fontSize: 10, position: "insideBottomRight", fontWeight: "bold" }} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
            <Area type="monotone" dataKey="oni" stroke="#22c55e" strokeWidth={2.5} fill="url(#colorElNino)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
