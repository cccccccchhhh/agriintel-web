// components/ChoroplethMap.js — client-only, loaded via next/dynamic
import { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useRouter } from "next/router";

const GEO_URL = "/geo/kabupaten.json";

const PROJ_CONFIG = { center: [118, -2], scale: 950 };

const ALIAS = {
  "FAKFAK": "FAK FAK",
  "JAKARTA BARAT": "KOTA ADMINISTRASI JAKARTA BARAT",
  "JAKARTA PUSAT": "KOTA ADMINISTRASI JAKARTA PUSAT",
  "JAKARTA SELATAN": "KOTA ADMINISTRASI JAKARTA SELATAN",
  "JAKARTA TIMUR": "KOTA ADMINISTRASI JAKARTA TIMUR",
  "JAKARTA UTARA": "KOTA ADMINISTRASI JAKARTA UTARA",
  "KOTA PADANG SIDIMPUAN": "KOTA PADANG SIDEMPUAN",
  "KOTA PANGKALPINANG": "KOTA PANGKAL PINANG",
  "KOTA TANJUNGPINANG": "KOTA TANJUNG PINANG",
  "MUKOMUKO": "MUKO MUKO",
  "PANGKAJENE DAN KEPULAUAN": "PANGKAJENE KEPULAUAN",
  "TOBA SAMOSIR": "TOBA",
  "TOJO UNA-UNA": "TOJO UNA UNA",
  "TOLITOLI": "TOLI TOLI",
};

// ── Dark Emerald Theme Color helpers ───────────────────────────────────────────
const COLOR_MIN  = "#113822"; // Dark Moss
const COLOR_MAX  = "#22c55e"; // Vibrant Emerald
const COLOR_MISS = "#1f2937"; // Dark grey
const COLOR_HOVER= "#bef264"; // Neon Lime highlight

function lerpColor(hex1, hex2, t) {
  const p = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = p(hex1);
  const [r2, g2, b2] = p(hex2);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}

function getColor(n, max) {
  if (n == null) return COLOR_MISS;
  if (max === 0)  return COLOR_MIN;
  return lerpColor(COLOR_MIN, COLOR_MAX, n / max);
}

function Tooltip({ content, pos }) {
  if (!content) return null;
  return (
    <div
      className="pointer-events-none fixed z-50 bg-[#0c2417]/95 text-white text-xs rounded-2xl px-4 py-3 shadow-2xl border border-[#bef264]/40 backdrop-blur-xl"
      style={{ left: pos.x + 14, top: pos.y - 10 }}
    >
      <div className="font-extrabold text-white text-sm">{content.nama}</div>
      <div className="text-emerald-200/70 text-[11px] font-medium">{content.provinsi}</div>
      {content.n != null
        ? <div className="mt-1.5 text-[#bef264] font-bold">🌱 {content.n} komoditas cocok</div>
        : <div className="mt-1.5 text-emerald-200/50 italic">data tidak tersedia</div>}
    </div>
  );
}

export default function ChoroplethMap({ kabupatenData = [] }) {
  const router = useRouter();
  const [tooltip, setTooltip]     = useState(null);
  const [tooltipPos, setPos]      = useState({ x: 0, y: 0 });
  const [hoveredKey, setHovered]  = useState(null);

  const kabMap = useMemo(() => {
    const m = {};
    for (const kab of kabupatenData || []) {
      const key = (ALIAS[kab.nama_kab] ?? kab.nama_kab).toUpperCase().trim();
      m[key] = { kode_kab: kab.kode_kab, n: kab.n_komoditas_cocok ?? null, nama: kab.nama_kab, provinsi: kab.provinsi };
    }
    return m;
  }, [kabupatenData]);

  const maxN = useMemo(
    () => Math.max(1, ...(kabupatenData || []).map((k) => k.n_komoditas_cocok ?? 0)),
    [kabupatenData]
  );

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-white/15 shadow-xl glass-card"
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={PROJ_CONFIG}
        width={800}
        height={400}
        style={{ width: "100%", height: "auto" }}
      >
        {/* Ocean background */}
        <rect width={800} height={400} fill="#06120b" />

        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              if (!geo.geometry) return null;
              const wadmkk = (geo.properties.WADMKK ?? "").toUpperCase().trim();
              const data   = kabMap[wadmkk] ?? null;
              const fill   = hoveredKey === wadmkk ? COLOR_HOVER : getColor(data?.n ?? null, maxN);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#08140c"
                  strokeWidth={0.5}
                  style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                  onMouseEnter={() => {
                    setHovered(wadmkk);
                    setTooltip(
                      data
                        ? { nama: data.nama, provinsi: data.provinsi, n: data.n }
                        : { nama: geo.properties.WADMKK, provinsi: geo.properties.WADMPR, n: null }
                    );
                  }}
                  onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                  onClick={() => data?.kode_kab && router.push(`/kabupaten/${data.kode_kab}`)}
                  className={data?.kode_kab ? "cursor-pointer transition-colors duration-200" : "cursor-default"}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip content={tooltip} pos={tooltipPos} />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[#0c2417]/90 backdrop-blur-xl rounded-2xl px-4 py-3 text-xs shadow-2xl border border-white/15">
        <div className="font-bold text-white mb-1.5">Komoditas Cocok (S1/S2)</div>
        <div className="flex items-center gap-2.5">
          <div className="h-3 w-28 rounded-full" style={{ background: `linear-gradient(to right, ${COLOR_MIN}, ${COLOR_MAX})` }} />
          <span className="text-[#bef264] font-mono font-bold">0 → {maxN}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-2.5 w-3.5 rounded-sm" style={{ background: COLOR_MISS }} />
          <span className="text-emerald-200/60 text-[11px] font-medium">Data tidak tersedia</span>
        </div>
      </div>
    </div>
  );
}
