// components/ForecastChart.js
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ForecastChart({ labels = [], values = [], name = "Forecast", unit = "", color = "#22c55e", chartType = "area" }) {
  const safeLabels = labels || [];
  const safeValues = values || [];
  const data = safeLabels.map((label, index) => ({ bulan: label, value: safeValues[index] ?? null }));
  const gradientId = `colorGrad_${(name || "chart").replace(/\W+/g, "")}`;

  const commonProps = {
    data,
    margin: { top: 12, right: 8, left: -14, bottom: 0 },
  };

  const chartBody = chartType === "line" ? (
    <Line
      type="monotone"
      dataKey="value"
      stroke={color}
      strokeWidth={2.5}
      dot={{ r: 4, stroke: "#ffffff", strokeWidth: 3 }}
      activeDot={{ r: 5, stroke: "#ffffff", strokeWidth: 3 }}
      animationDuration={1100}
      animationEasing="ease"
    />
  ) : (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="8%" stopColor={color} stopOpacity={0.35} />
          <stop offset="95%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={2.5}
        fillOpacity={1}
        fill={`url(#${gradientId})`}
        activeDot={{ r: 4, stroke: "#ffffff", strokeWidth: 3 }}
        animationDuration={1100}
        animationEasing="ease"
      />
    </>
  );

  const ChartComponent = chartType === "line" ? LineChart : AreaChart;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ChartComponent {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.15)" />
        <XAxis
          dataKey="bulan"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#a7f3d0", fontWeight: 700 }}
          dy={8}
        />
        <YAxis
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#a7f3d0", fontWeight: 700 }}
          unit={` ${unit}`}
          dx={-4}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0c2417",
            border: "1px solid rgba(190,242,100,0.4)",
            borderRadius: "16px",
            boxShadow: "0 14px 35px rgba(0,0,0,0.5)",
            fontFamily: "inherit",
          }}
          labelStyle={{ color: "#ffffff", fontWeight: 800, fontSize: "11px", marginBottom: "4px" }}
          itemStyle={{ color: "#bef264", fontWeight: 700, fontSize: "12px", padding: 0 }}
          formatter={(v) => [`${v} ${unit}`, name]}
        />
        {chartBody}
      </ChartComponent>
    </ResponsiveContainer>
  );
}
