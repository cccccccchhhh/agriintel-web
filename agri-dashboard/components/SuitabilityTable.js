// components/SuitabilityTable.js
import { useState } from "react";
import Badge from "./Badge";
import { KELAS_LABEL } from "../lib/constants";

export default function SuitabilityTable({ kelas }) {
  const [filter, setFilter] = useState("ALL");
  const entries = Object.entries(kelas).sort((a, b) => {
    const order = { S1: 0, S2: 1, N: 2 };
    return order[a[1]] - order[b[1]];
  });
  const filtered = filter === "ALL" ? entries : entries.filter(([, k]) => k === filter);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {["ALL", "S1", "S2", "N"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded-full border ${
              filter === f ? "bg-green-700 text-white border-green-700" : "border-gray-300 text-gray-600"
            }`}
          >
            {f === "ALL" ? "Semua" : f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {filtered.map(([kom, k]) => (
          <div
            key={kom}
            className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 bg-white"
          >
            <span className="text-sm">{kom}</span>
            <Badge text={k} color={KELAS_LABEL[k]?.color || "#6b7280"} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 mt-2">Tidak ada komoditas pada kategori ini.</p>
      )}
    </div>
  );
}
