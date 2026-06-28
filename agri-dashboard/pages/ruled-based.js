// pages/ruled-based.js
import { useState, useMemo } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import Badge from "../components/Badge";
import { getKabupatenList, getAllKabupatenLite, getLurList } from "../lib/data";
import { KELAS_LABEL } from "../lib/constants";
import { klasifikasiSemuaKomoditas, TEKSTUR_OPTIONS } from "../lib/classify";

export default function RuledBasedPage({ kabupatenList, kabupatenData, lurList }) {
  const [kodeKab, setKodeKab] = useState("");
  const [ph, setPh] = useState("");
  const [ch, setCh] = useState("");
  const [suhu, setSuhu] = useState("");
  const [elevasi, setElevasi] = useState("");
  const [tekstur, setTekstur] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const kabDefault = useMemo(
    () => kabupatenData.find((k) => k.kode_kab === Number(kodeKab)) || null,
    [kodeKab, kabupatenData]
  );

  const indikatorFinal = useMemo(() => {
    return {
      ph: ph !== "" ? parseFloat(ph) : kabDefault?.ph ?? null,
      ch_tahunan_mm: ch !== "" ? parseFloat(ch) : kabDefault?.ch_tahunan_mm ?? null,
      suhu_c: suhu !== "" ? parseFloat(suhu) : kabDefault?.suhu_mean ?? null,
      elevasi_m: elevasi !== "" ? parseFloat(elevasi) : kabDefault?.dem ?? null,
      tekstur: tekstur !== "" ? tekstur : kabDefault?.tekstur_eng ?? null,
    };
  }, [ph, ch, suhu, elevasi, tekstur, kabDefault]);

  const hasil = useMemo(() => {
    if (!submitted) return [];
    return klasifikasiSemuaKomoditas(indikatorFinal, lurList);
  }, [submitted, indikatorFinal, lurList]);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  const fieldFilled = (v) => v !== "";

  return (
    <Layout>
      <Head>
        <title>Cek Manual — AgriRekomendasi</title>
      </Head>

      <h1 className="text-2xl font-bold text-green-900 mb-2">Cek Kesesuaian Lahan Manual</h1>
      <p className="text-gray-500 mb-6 max-w-2xl">
        Sudah ukur sendiri kondisi lahan kamu? Isi salah satu/semua indikator di bawah — kalau ada
        yang dikosongkan, sistem akan otomatis memakai data rata-rata kabupaten yang kamu pilih
        sebagai nilai default.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-5 mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Kabupaten/Kota (untuk nilai default)
          </label>
          <select
            value={kodeKab}
            onChange={(e) => setKodeKab(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">-- Pilih kabupaten --</option>
            {kabupatenList.map((k) => (
              <option key={k.kode_kab} value={k.kode_kab}>
                {k.nama_kab} ({k.provinsi})
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="pH Tanah"
            value={ph}
            onChange={setPh}
            placeholder={kabDefault ? `Default: ${kabDefault.ph ?? "-"}` : "contoh: 6.2"}
            type="number"
            step="0.1"
            filled={fieldFilled(ph)}
          />
          <Field
            label="Curah Hujan Tahunan (mm/tahun)"
            value={ch}
            onChange={setCh}
            placeholder={kabDefault ? `Default: ${Math.round(kabDefault.ch_tahunan_mm ?? 0)}` : "contoh: 2000"}
            type="number"
            filled={fieldFilled(ch)}
          />
          <Field
            label="Suhu Rata-rata (°C)"
            value={suhu}
            onChange={setSuhu}
            placeholder={kabDefault ? `Default: ${kabDefault.suhu_mean ?? "-"}` : "contoh: 27"}
            type="number"
            step="0.1"
            filled={fieldFilled(suhu)}
          />
          <Field
            label="Elevasi (mdpl)"
            value={elevasi}
            onChange={setElevasi}
            placeholder={kabDefault ? `Default: ${kabDefault.dem ?? "-"}` : "contoh: 250"}
            type="number"
            filled={fieldFilled(elevasi)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tekstur Tanah {fieldFilled(tekstur) ? "" : kabDefault ? `(Default: ${kabDefault.tekstur_eng ?? "-"})` : ""}
            </label>
            <select
              value={tekstur}
              onChange={(e) => setTekstur(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">-- Pakai default --</option>
              {TEKSTUR_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-800"
        >
          Cek Kesesuaian
        </button>
      </form>

      {submitted && (
        <section>
          <h2 className="text-lg font-semibold text-green-900 mb-2">Indikator yang dipakai</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 text-sm">
            <IndikatorChip label="pH" value={indikatorFinal.ph} fromInput={fieldFilled(ph)} />
            <IndikatorChip label="Curah Hujan" value={indikatorFinal.ch_tahunan_mm} unit="mm/thn" fromInput={fieldFilled(ch)} />
            <IndikatorChip label="Suhu" value={indikatorFinal.suhu_c} unit="°C" fromInput={fieldFilled(suhu)} />
            <IndikatorChip label="Elevasi" value={indikatorFinal.elevasi_m} unit="mdpl" fromInput={fieldFilled(elevasi)} />
            <IndikatorChip label="Tekstur" value={indikatorFinal.tekstur} fromInput={fieldFilled(tekstur)} />
          </div>

          <h2 className="text-lg font-semibold text-green-900 mb-3">Hasil Klasifikasi</h2>
          {hasil.length === 0 ? (
            <p className="text-gray-400">
              Belum ada indikator yang cukup untuk diklasifikasikan. Isi minimal 1 indikator atau
              pilih kabupaten dulu.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {hasil.map((h) => (
                <div key={h.nama_komoditas} className="bg-white rounded-lg border border-gray-100 p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{h.nama_komoditas}</span>
                    <Badge text={h.kelas} color={KELAS_LABEL[h.kelas]?.color} />
                  </div>
                  {h.limiting_factors.length > 0 && (
                    <p className="text-xs text-gray-500">{h.limiting_factors.join("; ")}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </Layout>
  );
}

function Field({ label, value, onChange, placeholder, type, step, filled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 ${
          filled ? "border-green-400 bg-green-50" : "border-gray-300"
        }`}
      />
    </div>
  );
}

function IndikatorChip({ label, value, unit, fromInput }) {
  return (
    <div className={`rounded-lg p-2 border ${fromInput ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">
        {value ?? "-"} {unit || ""}
      </div>
      <div className="text-[10px] text-gray-400">{fromInput ? "diisi manual" : "default kabupaten"}</div>
    </div>
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
