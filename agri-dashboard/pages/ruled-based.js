// pages/ruled-based.js
import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { getKabupatenList, getAllKabupatenLite, getLurList } from "../lib/data";
import { klasifikasiSemuaKomoditas, TEKSTUR_OPTIONS } from "../lib/classify";

// ── Komoditas emoji lookup ─────────────────────────────────────────────────────
const EMOJI_MAP = {
  "padi": "🌾", "jagung": "🌽", "kedelai": "🫘", "kacang tanah": "🥜",
  "kacang hijau": "🫘", "kacang panjang": "🫘", "ubi kayu": "🍠",
  "ubi jalar": "🍠", "tebu": "🎋", "kelapa sawit": "🌴", "kelapa": "🥥",
  "karet": "🌿", "kakao": "🍫", "kopi": "☕", "teh": "🍵",
  "pisang": "🍌", "mangga": "🥭", "nanas": "🍍", "pepaya": "🍈",
  "durian": "🍈", "cabai": "🌶️", "bawang merah": "🧅", "bawang putih": "🧄",
  "tomat": "🍅", "kentang": "🥔", "wortel": "🥕", "sawi": "🥬",
  "bayam": "🥬", "semangka": "🍉", "melon": "🍈", "lada": "🌶️",
  "cengkeh": "🌸", "pala": "🌰", "vanili": "🌿", "jahe": "🫚",
  "kunyit": "🫚", "kapas": "🪴", "tembakau": "🍃",
};

function getEmoji(nama) {
  const lower = (nama || "").toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return "🌱";
}

// ── Kelas styles ───────────────────────────────────────────────────────────────
const KELAS_STY = {
  S1: { badge: "bg-[#16a34a]/15 text-[#15803d]", card: "border-[#16a34a]/25", lf: "text-[#3f7553] font-semibold" },
  S2: { badge: "bg-[#eab308]/18 text-[#a16207]", card: "border-[#eab308]/30", lf: "text-[#8a6d1f] font-semibold" },
  N:  { badge: "bg-[#dc2626]/12 text-[#b91c1c]", card: "border-[#dc2626]/20", lf: "text-[#9a3b3b] font-semibold" },
};
const SORT_ORDER = { S1: 0, S2: 1, N: 2 };

// ── Sub-components ─────────────────────────────────────────────────────────────
function InputField({ label, unit, value, onChange, placeholder, type, step, manual }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[12.5px] font-semibold text-[#3c5547] mb-1.5">
        {label}
        {unit && <span className="text-[11px] font-medium text-[#a7bbae]">{unit}</span>}
      </span>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl px-3.5 py-2.5 text-[14px] font-semibold text-[#1a2e22] outline-none transition ${
          manual
            ? "bg-[#16a34a]/6 border-2 border-[#16a34a]/45 focus:border-[#16a34a]"
            : "bg-[#faf7f0] border border-[#166534]/15 focus:border-[#166534]/40"
        }`}
      />
      <span className={`block text-[10.5px] font-semibold mt-1 ${manual ? "text-[#15803d]" : "text-[#a7bbae]"}`}>
        {manual ? "● diisi manual" : "default kabupaten"}
      </span>
    </label>
  );
}

function Chip({ icon, label, value, manual }) {
  return (
    <div className={`inline-flex items-center gap-2.5 bg-white rounded-xl border px-3.5 py-2 ${
      manual ? "border-[#16a34a]/35" : "border-[#166534]/10"
    }`}>
      <span className="text-[15px]">{icon}</span>
      <span>
        <span className="block text-[11px] font-medium text-[#8a9e92] leading-tight">{label}</span>
        <span className="block text-[14px] font-extrabold text-[#143d27] leading-tight">{value ?? "—"}</span>
      </span>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        manual ? "bg-[#16a34a]/12 text-[#15803d]" : "bg-[#166534]/6 text-[#8a9e92]"
      }`}>
        {manual ? "diisi manual" : "default kabupaten"}
      </span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function RuledBasedPage({ kabupatenList, kabupatenData, lurList }) {
  const [kodeKab, setKodeKab] = useState("");
  const [ph, setPh] = useState("");
  const [ch, setCh] = useState("");
  const [suhu, setSuhu] = useState("");
  const [elevasi, setElevasi] = useState("");
  const [tekstur, setTekstur] = useState("");

  const kabDefault = useMemo(
    () => kabupatenData.find((k) => k.kode_kab === Number(kodeKab)) || null,
    [kodeKab, kabupatenData]
  );

  const indikatorFinal = useMemo(() => ({
    ph: ph !== "" ? parseFloat(ph) : kabDefault?.ph ?? null,
    ch_tahunan_mm: ch !== "" ? parseFloat(ch) : kabDefault?.ch_tahunan_mm ?? null,
    suhu_c: suhu !== "" ? parseFloat(suhu) : kabDefault?.suhu_mean ?? null,
    elevasi_m: elevasi !== "" ? parseFloat(elevasi) : kabDefault?.dem ?? null,
    tekstur: tekstur !== "" ? tekstur : kabDefault?.tekstur_eng ?? null,
  }), [ph, ch, suhu, elevasi, tekstur, kabDefault]);

  const hasAnyData = Object.values(indikatorFinal).some((v) => v !== null);

  const hasil = useMemo(() => {
    if (!hasAnyData) return [];
    return klasifikasiSemuaKomoditas(indikatorFinal, lurList)
      .sort((a, b) => (SORT_ORDER[a.kelas] ?? 3) - (SORT_ORDER[b.kelas] ?? 3));
  }, [indikatorFinal, lurList, hasAnyData]);

  function handleReset() {
    setPh(""); setCh(""); setSuhu(""); setElevasi(""); setTekstur("");
  }

  const m = { ph: ph !== "", ch: ch !== "", suhu: suhu !== "", elevasi: elevasi !== "", tekstur: tekstur !== "" };

  return (
    <>
      <Head>
        <title>Cek Manual — AgriRekomendasi</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
          input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
          input[type=number] { -moz-appearance: textfield; }
          .grain { background-image: radial-gradient(rgba(22,101,52,0.05) 1px, transparent 1px); background-size: 22px 22px; }
        `}</style>
      </Head>

      <div className="min-h-screen bg-[#faf7f0] text-[#1a2e22]">

        {/* TOP BAR */}
        <header className="bg-white border-b border-[#166534]/10">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center text-white text-[15px]">🌱</div>
              <span className="font-extrabold text-[16px] tracking-tight text-[#166534]">TaniRekom</span>
            </div>
            <Link href="/" className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#3c5547] hover:text-[#166534] transition">
              ← Kembali
            </Link>
          </div>
        </header>

        {/* HEADER */}
        <section className="grain border-b border-[#166534]/10">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#166534] bg-[#22c55e]/12 border border-[#166534]/15 px-3 py-1 rounded-full mb-4">
              🧭 Mode manual
            </span>
            <h1 className="text-[32px] font-extrabold tracking-tight text-[#143d27] leading-tight">
              Cek Kesesuaian Lahan Manual
            </h1>
            <p className="text-[15px] text-[#46604f] mt-2.5 max-w-2xl">
              Pilih kabupaten untuk mengisi data otomatis, lalu sesuaikan parameter sesuai kondisi lahanmu sendiri. Hasil klasifikasi diperbarui otomatis.
            </p>
          </div>
        </section>

        {/* BODY */}
        <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[380px_1fr] gap-6 items-start">

          {/* FORM */}
          <div className="bg-white rounded-2xl border border-[#166534]/10 p-6 lg:sticky lg:top-6">
            <h2 className="text-[16px] font-extrabold text-[#143d27] mb-1">Parameter Lahan</h2>
            <p className="text-[12.5px] text-[#8a9e92] mb-5">Field berwarna hijau = diisi manual.</p>

            <label className="block mb-4">
              <span className="block text-[12.5px] font-semibold text-[#3c5547] mb-1.5">Kabupaten</span>
              <select
                value={kodeKab}
                onChange={(e) => setKodeKab(e.target.value)}
                className="w-full bg-[#faf7f0] border border-[#166534]/15 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-[#1a2e22] outline-none focus:border-[#166534]/45 transition cursor-pointer"
              >
                <option value="">— Pilih kabupaten —</option>
                {kabupatenList.map((k) => (
                  <option key={k.kode_kab} value={k.kode_kab}>
                    {k.nama_kab} ({k.provinsi})
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="pH Tanah" type="number" step="0.1"
                value={ph} onChange={setPh} manual={m.ph}
                placeholder={kabDefault ? `${kabDefault.ph ?? "—"}` : "cth: 6.2"}
              />
              <InputField
                label="Curah Hujan" unit="mm/thn" type="number"
                value={ch} onChange={setCh} manual={m.ch}
                placeholder={kabDefault ? `${Math.round(kabDefault.ch_tahunan_mm ?? 0)}` : "cth: 2000"}
              />
              <InputField
                label="Suhu" unit="°C" type="number" step="0.1"
                value={suhu} onChange={setSuhu} manual={m.suhu}
                placeholder={kabDefault ? `${kabDefault.suhu_mean ?? "—"}` : "cth: 27"}
              />
              <InputField
                label="Elevasi" unit="mdpl" type="number"
                value={elevasi} onChange={setElevasi} manual={m.elevasi}
                placeholder={kabDefault ? `${kabDefault.dem ?? "—"}` : "cth: 250"}
              />
            </div>

            <label className="block mt-3">
              <span className="block text-[12.5px] font-semibold text-[#3c5547] mb-1.5">Tekstur Tanah</span>
              <select
                value={tekstur}
                onChange={(e) => setTekstur(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 text-[14px] font-semibold text-[#1a2e22] outline-none transition cursor-pointer ${
                  m.tekstur
                    ? "bg-[#16a34a]/6 border-2 border-[#16a34a]/45 focus:border-[#16a34a]"
                    : "bg-[#faf7f0] border border-[#166534]/15 focus:border-[#166534]/40"
                }`}
              >
                <option value="">— Pakai default{kabDefault && !m.tekstur ? ` (${kabDefault.tekstur_eng ?? "—"})` : ""} —</option>
                {TEKSTUR_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <span className={`block text-[10.5px] font-semibold mt-1 ${m.tekstur ? "text-[#15803d]" : "text-[#a7bbae]"}`}>
                {m.tekstur ? "● diisi manual" : "default kabupaten"}
              </span>
            </label>

            <button
              type="button"
              onClick={handleReset}
              className="w-full mt-6 text-[13px] font-semibold text-[#166534] border border-[#166534]/20 rounded-xl py-2.5 hover:bg-[#166534]/5 transition"
            >
              ↺ Reset ke default kabupaten
            </button>
          </div>

          {/* RESULTS */}
          <div>
            {hasAnyData ? (
              <>
                {/* CHIPS */}
                <div className="mb-6">
                  <h2 className="text-[15px] font-extrabold text-[#143d27] mb-3">Indikator yang Digunakan</h2>
                  <div className="flex flex-wrap gap-2.5">
                    <Chip icon="🧪" label="pH Tanah"
                      value={indikatorFinal.ph != null ? String(indikatorFinal.ph) : null}
                      manual={m.ph} />
                    <Chip icon="🌧️" label="Curah Hujan"
                      value={indikatorFinal.ch_tahunan_mm != null ? `${Math.round(indikatorFinal.ch_tahunan_mm)} mm` : null}
                      manual={m.ch} />
                    <Chip icon="🌡️" label="Suhu"
                      value={indikatorFinal.suhu_c != null ? `${indikatorFinal.suhu_c} °C` : null}
                      manual={m.suhu} />
                    <Chip icon="⛰️" label="Elevasi"
                      value={indikatorFinal.elevasi_m != null ? `${indikatorFinal.elevasi_m} mdpl` : null}
                      manual={m.elevasi} />
                    <Chip icon="🪨" label="Tekstur"
                      value={indikatorFinal.tekstur}
                      manual={m.tekstur} />
                  </div>
                </div>

                {/* CLASSIFICATION GRID */}
                <h2 className="text-[15px] font-extrabold text-[#143d27] mb-1">Hasil Klasifikasi Komoditas</h2>
                <div className="flex items-center gap-4 text-[11.5px] font-medium text-[#5a7265] mb-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />S1 Sangat sesuai
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />S2 Cukup sesuai
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />N Tidak sesuai
                  </span>
                </div>

                {hasil.length === 0 ? (
                  <p className="text-[14px] text-[#8a9e92]">
                    Data tidak cukup untuk mengklasifikasikan komoditas.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {hasil.map((h) => {
                      const sty = KELAS_STY[h.kelas] || KELAS_STY["N"];
                      return (
                        <div key={h.nama_komoditas} className={`bg-white rounded-2xl border p-4 flex items-start gap-3 ${sty.card}`}>
                          <span className="w-11 h-11 rounded-xl bg-[#166534]/6 flex items-center justify-center text-[20px] shrink-0">
                            {getEmoji(h.nama_komoditas)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[14.5px] font-bold text-[#1a2e22] truncate">{h.nama_komoditas}</span>
                              <span className={`shrink-0 text-[12px] font-extrabold px-2.5 py-1 rounded-lg ${sty.badge}`}>
                                {h.kelas}
                              </span>
                            </div>
                            {h.limiting_factors.length > 0 && (
                              <div className={`text-[12px] mt-1.5 leading-snug ${sty.lf}`}>
                                {h.limiting_factors.join(" · ")}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-[#166534]/10">
                <div className="text-5xl mb-4">🌱</div>
                <p className="font-extrabold text-[#143d27] mb-1">Pilih kabupaten atau isi indikator</p>
                <p className="text-[13.5px] text-[#8a9e92]">
                  Hasil kesesuaian lahan akan muncul otomatis di sini
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      kabupatenList: getKabupatenList(),
      kabupatenData: getAllKabupatenLite(),
      lurList: getLurList(),
    },
  };
}
