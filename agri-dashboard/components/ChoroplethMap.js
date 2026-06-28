// components/ChoroplethMap.js — client-only, loaded via next/dynamic
import { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useRouter } from "next/router";

const GEO_URL = "/geo/kabupaten.json";

// Indonesia bounding box: lon 95°–141°, lat -11°–6°
// ViewBox: 800×400. Center at [118, -2].
// scale=950 → 46° * π/180 * 950 ≈ 763px (fits in 800)
// No rotate needed — just center on [118, -2] directly.
const PROJ_CONFIG = { center: [118, -2], scale: 950 };

// ── Name aliases: nama_kab (UPPERCASE) → GeoJSON WADMKK (UPPERCASE) ───────────
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

// ── Color helpers ─────────────────────────────────────────────────────────────
const COLOR_MIN  = "#dcfce7"; // green-100 (few komoditas)
const COLOR_MAX  = "#166534"; // green-800 (many komoditas)
const COLOR_MISS = "#d1d5db"; // gray-300  (no data)
const COLOR_HOVER= "#fef08a"; // yellow-200

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

// ── Tooltip (fixed to cursor) ─────────────────────────────────────────────────
function Tooltip({ content, pos }) {
  if (!content) return null;
  return (
    <div
      className="pointer-events-none fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg"
      style={{ left: pos.x + 14, top: pos.y - 10 }}
    >
      <div className="font-semibold">{content.nama}</div>
      <div className="text-gray-300 text-[10px]">{content.provinsi}</div>
      {content.n != null
        ? <div className="mt-1 text-green-300">{content.n} komoditas cocok</div>
        : <div className="mt-1 text-gray-400 italic">data tidak tersedia</div>}
    </div>
  );
}

// ── Map ───────────────────────────────────────────────────────────────────────
export default function ChoroplethMap({ kabupatenData }) {
  const router = useRouter();
  const [tooltip, setTooltip]     = useState(null);
  const [tooltipPos, setPos]      = useState({ x: 0, y: 0 });
  const [hoveredKey, setHovered]  = useState(null);

  const kabMap = useMemo(() => {
    const m = {};
    for (const kab of kabupatenData) {
      const key = (ALIAS[kab.nama_kab] ?? kab.nama_kab).toUpperCase().trim();
      m[key] = { kode_kab: kab.kode_kab, n: kab.n_komoditas_cocok ?? null, nama: kab.nama_kab, provinsi: kab.provinsi };
    }
    return m;
  }, [kabupatenData]);

  const maxN = useMemo(
    () => Math.max(1, ...kabupatenData.map((k) => k.n_komoditas_cocok ?? 0)),
    [kabupatenData]
  );

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-gray-200"
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={PROJ_CONFIG}
        width={800}
        height={400}
        style={{ width: "100%", height: "auto" }}
      >
        {/* Ocean background — SVG <rect>, not CSS background */}
        <rect width={800} height={400} fill="#bfdbfe" />

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
                  stroke="#fff"
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
                  className={data?.kode_kab ? "cursor-pointer" : "cursor-default"}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip content={tooltip} pos={tooltipPos} />

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-3 py-2 text-xs shadow">
        <div className="font-semibold text-gray-600 mb-1">Komoditas Cocok (S1/S2)</div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-28 rounded" style={{ background: `linear-gradient(to right, ${COLOR_MIN}, ${COLOR_MAX})` }} />
          <span className="text-gray-500">0 → {maxN}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="h-3 w-4 rounded" style={{ background: COLOR_MISS }} />
          <span className="text-gray-400">Data tidak tersedia</span>
        </div>
      </div>
    </div>
  );
}
