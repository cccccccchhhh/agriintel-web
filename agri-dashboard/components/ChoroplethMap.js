// components/ChoroplethMap.js — client-only, loaded via next/dynamic
import { useState, useEffect, useCallback, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useRouter } from "next/router";

const GEO_URL = "/geo/kabupaten.json";

// ── Name aliases: our nama_kab (uppercase) → GeoJSON WADMKK (uppercase) ───────
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

// ── Color scale: 0 komoditas = light green, 24 = dark green, null = gray ──────
const COLOR_MIN = "#dcfce7"; // green-100
const COLOR_MAX = "#14532d"; // green-900
const COLOR_MISS = "#e5e7eb"; // gray-200
const COLOR_HOVER = "#fef08a"; // yellow-200

function lerpColor(hex1, hex2, t) {
  const parse = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

function getColor(n, max) {
  if (n == null) return COLOR_MISS;
  return lerpColor(COLOR_MIN, COLOR_MAX, max > 0 ? n / max : 0);
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ content, pos }) {
  if (!content) return null;
  return (
    <div
      className="pointer-events-none fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-[200px]"
      style={{ left: pos.x + 14, top: pos.y - 10 }}
    >
      <div className="font-semibold">{content.nama}</div>
      <div className="text-gray-300">{content.provinsi}</div>
      {content.n != null ? (
        <div className="mt-1 text-green-300">{content.n} komoditas cocok</div>
      ) : (
        <div className="mt-1 text-gray-400 italic">data tidak tersedia</div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ChoroplethMap({ kabupatenData }) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hoveredWADMKK, setHoveredWADMKK] = useState(null);
  const containerRef = useRef(null);

  // Build lookup: GeoJSON WADMKK (uppercase) → { kode_kab, n_komoditas_cocok, nama_kab, provinsi }
  const lookup = useCallback(() => {
    const map = {};
    for (const kab of kabupatenData) {
      const key = (ALIAS[kab.nama_kab] ?? kab.nama_kab).toUpperCase().trim();
      map[key] = {
        kode_kab: kab.kode_kab,
        n: kab.n_komoditas_cocok ?? null,
        nama: kab.nama_kab,
        provinsi: kab.provinsi,
      };
    }
    return map;
  }, [kabupatenData]);

  const kabMap = lookup();
  const maxN = Math.max(...kabupatenData.map((k) => k.n_komoditas_cocok ?? 0));

  function resolve(props) {
    const key = (props.WADMKK ?? "").toUpperCase().trim();
    return kabMap[key] ?? null;
  }

  function handleMouseMove(e) {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-sky-50 rounded-xl overflow-hidden border border-gray-200"
      onMouseMove={handleMouseMove}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [118, -2], scale: 1050 }}
        width={800}
        height={420}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const props = geo.properties;
              const wadmkk = (props.WADMKK ?? "").toUpperCase().trim();
              const data = resolve(props);
              const isHovered = hoveredWADMKK === wadmkk;
              const fill = isHovered ? COLOR_HOVER : getColor(data?.n ?? null, maxN);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#fff"
                  strokeWidth={0.3}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={() => {
                    setHoveredWADMKK(wadmkk);
                    setTooltip(
                      data
                        ? { nama: data.nama, provinsi: data.provinsi, n: data.n }
                        : { nama: props.WADMKK, provinsi: props.WADMPR, n: null }
                    );
                  }}
                  onMouseLeave={() => {
                    setHoveredWADMKK(null);
                    setTooltip(null);
                  }}
                  onClick={() => {
                    if (data?.kode_kab) router.push(`/kabupaten/${data.kode_kab}`);
                  }}
                  className={data?.kode_kab ? "cursor-pointer" : "cursor-default"}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-3 py-2 text-xs shadow">
        <div className="font-semibold text-gray-600 mb-1">Jumlah Komoditas Cocok</div>
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-28 rounded"
            style={{
              background: `linear-gradient(to right, ${COLOR_MIN}, ${COLOR_MAX})`,
            }}
          />
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
