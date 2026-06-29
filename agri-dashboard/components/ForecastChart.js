// components/ForecastChart.js
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ForecastChart({ labels, values, name, unit, color = "#16a34a" }) {
  const data = labels.map((l, i) => ({ bulan: l, [name]: values[i] }));
  const gradientId = `colorGrad_${name.replace(/\s+/g, "")}`;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#166534" strokeOpacity={0.06} />
        <XAxis
          dataKey="bulan"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#6a8174", fontWeight: 600 }}
          dy={8}
        />
        <YAxis
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#6a8174", fontWeight: 600 }}
          unit={` ${unit}`}
          dx={-4}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(22,101,52,0.12)",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -10px rgba(22,101,52,0.15)",
            fontFamily: "inherit",
          }}
          labelStyle={{ color: "#143d27", fontWeight: 800, fontSize: "11px", marginBottom: "4px" }}
          itemStyle={{ color: color, fontWeight: 700, fontSize: "12px", padding: 0 }}
          formatter={(v) => [`${v} ${unit}`, name]}
        />
        <Area
          type="monotone"
          dataKey={name}
          stroke={color}
          strokeWidth={2.5}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
