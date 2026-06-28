// components/ForecastChart.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ForecastChart({ labels, values, name, unit, color = "#16a34a" }) {
  const data = labels.map((l, i) => ({ bulan: l, [name]: values[i] }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="bulan" fontSize={11} tick={{ fill: "#666" }} />
        <YAxis fontSize={11} tick={{ fill: "#666" }} unit={unit} />
        <Tooltip formatter={(v) => `${v} ${unit}`} />
        <Legend />
        <Line type="monotone" dataKey={name} stroke={color} strokeWidth={2} dot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
