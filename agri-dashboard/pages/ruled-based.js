// pages/ruled-based.js
import { useState, useMemo } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { getKabupatenList, getAllKabupatenLite, getLurList } from "../lib/data";
import { klasifikasiSemuaKomoditas, TEKSTUR_OPTIONS } from "../lib/classify";

// ── Komoditas emoji lookup ─────────────────────────────────────────────────────
const EMOJI_MAP = {
  padi: "🌾", jagung: "🌽", kedelai: "🫘", "kacang tanah": "🥜",
  "kacang hijau": "🫘", "kacang panjang": "🫘", ubi: "🍠",
  tebu: "🎋", "kelapa sawit": "🌴", kelapa: "🥥",
  karet: "🌿", kakao: "🍫", kopi: "☕", teh: "🍵",
  pisang: "🍌", mangga: "🥭", nanas: "🍍", pepaya: "🍈",
  durian: "🍈", cabai: "🌶️", bawang: "🧅", tomat: "🍅",
  kentang: "🥔", wortel: "🥕", sawi: "🥬", bayam: "🥬",
  semangka: "🍉", melon: "🍈", lada: "🌶️", cengkeh: "🌸",
  pala: "🌰", vanili: "🌿", jahe: "🫚", kunyit: "🫚",
  kapas: "🪴", tembakau: "🍃",
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
  S1: { badge: "bg-emerald-500/20 text-[#bef264] border border-emerald-500/40 font-extrabold", card: "border-emerald-500/40 hover:border-[#bef264] hover:shadow-xl", lf: "text-[#bef264] font-extrabold" },
  S2: { badge: "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold", card: "border-amber-500/40 hover:border-amber-400 hover:shadow-xl", lf: "text-amber-300 font-extrabold" },
  N:  { badge: "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-extrabold", card: "border-rose-500/40 hover:border-rose-400 hover:shadow-xl", lf: "text-rose-300 font-extrabold" },
};
const SORT_ORDER = { S1: 0, S2: 1, N: 2 };

// ── Sub-components ─────────────────────────────────────────────────────────────
function InputField({ label, unit, value, onChange, placeholder, type, step, manual }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[12.5px] font-extrabold text-emerald-100 mb-1.5">
        {label}
        {unit && <span className="text-[11px] font-medium text-emerald-200/60">{unit}</span>}
      </span>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl px-3.5 py-2.5 text-[14px] font-black text-white outline-none transition-all duration-300 border-2 placeholder:text-emerald-200/40 ${
          manual
            ? "bg-[#22c55e]/20 border-[#bef264] focus:ring-2 focus:ring-[#bef264]/40"
            : "bg-[#0c2417]/80 border-white/20 focus:border-[#bef264]"
        }`}
      />
      <span className={`block text-[10.5px] font-extrabold mt-1 ${manual ? "text-[#bef264]" : "text-emerald-200/50"}`}>
        {manual ? "● diisi manual" : "default kabupaten"}
      </span>
    </label>
  );
}

function Chip({ icon, label, value, manual }) {
  return (
    <div className={`inline-flex items-center gap-2.5 glass-card rounded-xl border px-3.5 py-2 transition-all duration-300 ${
      manual ? "border-[#bef264] text-[#bef264] bg-[#22c55e]/20" : "border-white/15 text-white"
    }`}>
      <span className="text-[15px]">{icon}</span>
      <span>
        <span className="block text-[11px] font-medium text-emerald-200/70 leading-tight">{label}</span>
        <span className="block text-[13.5px] font-black text-white leading-tight">{value ?? "—"}</span>
      </span>
      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
        manual ? "bg-[#bef264] text-black" : "bg-white/15 text-emerald-200"
      }`}>
        {manual ? "manual" : "default"}
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
    <Layout>
      <Head>
        <title>Cek Lahan Manual — AgriDiv</title>
      </Head>

      {/* HEADER BANNER */}
      <section className="grain relative overflow-hidden rounded-3xl glass-panel px-6 py-8 mb-6 animate-fade-in shadow-xl">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-extrabold text-[#bef264] bg-[#bef264]/15 border border-[#bef264]/30 px-3.5 py-1 rounded-full mb-3">
          🧭 Mode Manual
        </span>
        <h1 className="text-[28px] md:text-[36px] font-black tracking-tight text-white leading-tight">
          Cek Kesesuaian Lahan Manual
        </h1>
        <p className="text-[14.5px] text-emerald-100/80 mt-2 max-w-2xl font-medium leading-relaxed">
          Pilih kabupaten terdekat untuk memuat data default agroekologi secara otomatis, lalu sesuaikan parameter tanah & iklim sesuai kondisi real lahan Anda.
        </p>
      </section>

      {/* BODY GRID */}
      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        
        {/* INPUT PARAMETERS FORM */}
        <div className="glass-panel rounded-3xl p-6 lg:sticky lg:top-20 animate-fade-in-up shadow-xl">
          <h2 className="text-[16px] font-black text-white mb-1">Parameter Lahan Anda</h2>
          <p className="text-[12.5px] text-emerald-200/70 mb-5 font-bold">Field bergaris hijau neon = diisi manual.</p>

          <div className="space-y-4">
            <label className="block">
              <span className="block text-[12.5px] font-extrabold text-emerald-100 mb-1.5">Pilih Kabupaten Acuan</span>
              <select
                value={kodeKab}
                onChange={(e) => setKodeKab(e.target.value)}
                className="w-full bg-[#0c2417]/90 border-2 border-white/20 rounded-xl px-3.5 py-2.5 text-[14px] font-bold text-white outline-none focus:border-[#bef264] transition cursor-pointer"
              >
                <option value="" className="bg-[#0c2417] text-white">— Pilih kabupaten —</option>
                {kabupatenList.map((k) => (
                  <option key={k.kode_kab} value={k.kode_kab} className="bg-[#0c2417] text-white">
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

            <label className="block">
              <span className="block text-[12.5px] font-extrabold text-emerald-100 mb-1.5">Tekstur Tanah</span>
              <select
                value={tekstur}
                onChange={(e) => setTekstur(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 text-[14px] font-bold text-white outline-none transition-all duration-300 border-2 cursor-pointer appearance-none ${
                  m.tekstur
                    ? "bg-[#22c55e]/20 border-[#bef264] focus:ring-2 focus:ring-[#bef264]/40"
                    : "bg-[#0c2417]/90 border-white/20 focus:border-[#bef264]"
                }`}
              >
                <option value="" className="bg-[#0c2417] text-white">— Pakai default{kabDefault && !m.tekstur ? ` (${kabDefault.tekstur_eng ?? "—"})` : ""} —</option>
                {TEKSTUR_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#0c2417] text-white">{t.label}</option>
                ))}
              </select>
              <span className={`block text-[10.5px] font-extrabold mt-1 ${m.tekstur ? "text-[#bef264]" : "text-emerald-200/50"}`}>
                {m.tekstur ? "● diisi manual" : "default kabupaten"}
              </span>
            </label>

            <button
              type="button"
              onClick={handleReset}
              className="w-full mt-4 text-[13px] font-extrabold text-[#bef264] border border-[#bef264]/40 rounded-xl py-2.5 hover:bg-[#22c55e]/20 transition-all duration-200"
            >
              ↺ Reset Parameter
            </button>
          </div>
        </div>

        {/* CLASSIFICATION RESULTS OUTPUT */}
        <div className="space-y-6">
          {hasAnyData ? (
            <div className="space-y-6">
              
              {/* CURRENT WORKING CHIPS */}
              <div className="animate-fade-in">
                <h2 className="text-[15px] font-black text-white mb-3">Indikator Lahan Digunakan</h2>
                <div className="flex flex-wrap gap-2.5">
                  <Chip icon="🧪" label="pH Tanah"
                    value={indikatorFinal.ph != null ? String(indikatorFinal.ph) : null}
                    manual={m.ph} />
                  <Chip icon="🌧️" label="Curah Hujan"
                    value={indikatorFinal.ch_tahunan_mm != null ? `${Math.round(indikatorFinal.ch_tahunan_mm)} mm` : null}
                    manual={m.ch} />
                  <Chip icon="🌡️" label="Suhu Rata-rata"
                    value={indikatorFinal.suhu_c != null ? `${indikatorFinal.suhu_c} °C` : null}
                    manual={m.suhu} />
                  <Chip icon="⛰️" label="Elevasi"
                    value={indikatorFinal.elevasi_m != null ? `${indikatorFinal.elevasi_m} mdpl` : null}
                    manual={m.elevasi} />
                  <Chip icon="🪨" label="Tekstur Lahan"
                    value={indikatorFinal.tekstur}
                    manual={m.tekstur} />
                </div>
              </div>

              {/* CLASSIFICATION RESULTS */}
              <div className="animate-fade-in delay-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h2 className="text-[16px] font-black text-white">Kesesuaian Komoditas (FAO/ECOCROP)</h2>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-emerald-200/80">
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#bef264]" />S1 Sangat Sesuai</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />S2 Cukup Sesuai</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />N Tidak Sesuai</span>
                  </div>
                </div>

                {hasil.length === 0 ? (
                  <p className="text-[14px] text-emerald-200/50 font-semibold">
                    Data tidak cukup untuk melakukan kalkulasi.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {hasil.map((h) => {
                      const sty = KELAS_STY[h.kelas] || KELAS_STY["N"];
                      return (
                        <div
                          key={h.nama_komoditas}
                          className={`glass-card rounded-2xl border p-4 flex items-start gap-3 transition-all duration-300 hover:-translate-y-0.5 ${sty.card} animate-fade-in-up`}
                        >
                          <span className="w-11 h-11 rounded-xl bg-[#22c55e]/20 flex items-center justify-center text-[20px] shrink-0 border border-[#22c55e]/30">
                            {getEmoji(h.nama_komoditas)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[14.5px] font-black text-white truncate">{h.nama_komoditas}</span>
                              <span className={`shrink-0 text-[11px] font-black px-2.5 py-1 rounded-lg ${sty.badge}`}>
                                {h.kelas}
                              </span>
                            </div>
                            {h.limiting_factors.length > 0 ? (
                              <div className={`text-[11.5px] mt-2 leading-relaxed ${sty.lf}`}>
                                ⚠️ {h.limiting_factors.join(" · ")}
                              </div>
                            ) : (
                              <div className="text-[11.5px] mt-2 leading-relaxed text-[#bef264] font-extrabold">
                                ✓ Semua parameter sesuai
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* EMPTY PLACEHOLDER STATE */
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed border-white/20 glass-panel animate-fade-in">
              <div className="text-5xl mb-4 animate-bounce-slow">🌱</div>
              <p className="font-black text-white text-lg mb-1">Silakan Pilih Kabupaten Acuan</p>
              <p className="text-[13.5px] text-emerald-200/70 font-medium max-w-sm px-4">
                Hasil perhitungan kecocokan jenis tanah & iklim dengan tanaman akan langsung muncul otomatis di sini.
              </p>
            </div>
          )}
        </div>

      </div>
    </Layout>
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
