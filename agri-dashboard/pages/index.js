// pages/index.js
import Head from "next/head";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Link from "next/link";
import { useState, useMemo } from "react";
import { getKabupatenList, getKomoditasList, getStats, getAllNamaKomoditas, getAllRekomendasi } from "../lib/data";
import { TREN_LABEL } from "../lib/constants";

export default function Home({ kabupatenList, komoditasList, stats, namaKomoditasMap }) {
  const [provinsi, setProvinsi] = useState("");
  const sortedKomoditas = [...komoditasList].sort((a, b) => b.slope - a.slope);

  const provinsiList = useMemo(() => {
    const set = new Set(kabupatenList.map((k) => k.provinsi));
    return [...set].sort();
  }, [kabupatenList]);

  const filteredKabupaten = useMemo(
    () => (provinsi ? kabupatenList.filter((k) => k.provinsi === provinsi) : kabupatenList),
    [provinsi, kabupatenList]
  );

  const displayStats = useMemo(() => {
    if (!provinsi) return stats;
    return {
      n_kabupaten_total: filteredKabupaten.length,
      n_kabupaten_rekomendasi_kuat: filteredKabupaten.filter((k) => k.has_kuat).length,
      n_kabupaten_rekomendasi_lemah: filteredKabupaten.filter((k) => k.has_lemah).length,
      n_komoditas: stats.n_komoditas,
    };
  }, [provinsi, filteredKabupaten, stats]);

  return (
    <Layout>
      <Head>
        <title>AgriRekomendasi — Rekomendasi Tanam Berbasis Data</title>
      </Head>

      <section className="text-center py-8">
        <h1 className="text-3xl font-bold mb-2 text-green-900">
          Rekomendasi Komoditas Tanam untuk Petani Indonesia
        </h1>
        <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
          Cari kabupaten/kota kamu untuk melihat rekomendasi komoditas tanam berdasarkan forecast
          cuaca, kesesuaian lahan (FAO/ECOCROP), dan tren permintaan pasar nasional.
        </p>
        <div className="flex flex-col items-center gap-3">
          <select
            value={provinsi}
            onChange={(e) => setProvinsi(e.target.value)}
            className="w-full max-w-xl border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-700"
          >
            <option value="">Semua Provinsi</option>
            {provinsiList.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <SearchBar kabupatenList={filteredKabupaten} autoFocus />
        </div>
        {provinsi && (
          <p className="text-sm text-green-700 mt-3">
            Menampilkan <strong>{filteredKabupaten.length}</strong> kabupaten/kota di{" "}
            <strong>{provinsi}</strong>.{" "}
            <button onClick={() => setProvinsi("")} className="underline text-gray-500">
              Reset
            </button>
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        <StatCard
          label={provinsi ? "Kab/Kota di Provinsi Ini" : "Kabupaten/Kota Dianalisis"}
          value={displayStats.n_kabupaten_total}
        />
        <StatCard
          label="Rekomendasi Kuat"
          value={displayStats.n_kabupaten_rekomendasi_kuat}
          sub="kabupaten punya ≥1 komoditas"
          color="#16a34a"
        />
        <StatCard
          label="Rekomendasi Lemah"
          value={displayStats.n_kabupaten_rekomendasi_lemah}
          sub="kabupaten punya ≥1 komoditas"
          color="#ca8a04"
        />
        <StatCard label="Komoditas Dianalisis" value={displayStats.n_komoditas} color="#0369a1" />
      </section>

      <section className="my-10">
        <h2 className="text-xl font-semibold mb-3 text-green-900">Tren Permintaan Nasional per Komoditas</h2>
        <p className="text-sm text-gray-500 mb-4">
          Diurutkan dari tren kenaikan tercepat. Klasifikasi tren berdasarkan confidence interval
          95% dari slope regresi (lihat catatan metodologi).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-2">Komoditas</th>
                <th className="px-4 py-2">Tren</th>
                <th className="px-4 py-2">Slope (per tahun)</th>
                <th className="px-4 py-2">Model</th>
              </tr>
            </thead>
            <tbody>
              {sortedKomoditas.map((k) => (
                <tr key={k.komoditas} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium">
                    {namaKomoditasMap[k.komoditas] ? (
                      <Link
                        href={`/komoditas/${encodeURIComponent(namaKomoditasMap[k.komoditas])}`}
                        className="text-green-700 hover:underline"
                      >
                        {k.komoditas}
                      </Link>
                    ) : (
                      k.komoditas
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Badge text={TREN_LABEL[k.tren]?.label || k.tren} color={TREN_LABEL[k.tren]?.color || "#6b7280"} />
                  </td>
                  <td className="px-4 py-2 text-gray-600">{k.slope > 0 ? "+" : ""}{(k.slope * 100).toFixed(2)}%</td>
                  <td className="px-4 py-2 text-gray-400 text-xs">{k.model_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="text-center my-10">
        <p className="text-gray-500 mb-3">Sudah ukur sendiri kondisi lahan kamu?</p>
        <Link
          href="/ruled-based"
          className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800"
        >
          Coba Cek Manual →
        </Link>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const komoditasList = getKomoditasList();
  const namaKomoditasLur = getAllNamaKomoditas();

  const namaKomoditasMap = {};
  for (const k of komoditasList) {
    const lower = k.komoditas.toLowerCase();
    const match = namaKomoditasLur.find(
      (nama) => nama.toLowerCase() === lower || lower.includes(nama.toLowerCase())
    );
    if (match) namaKomoditasMap[k.komoditas] = match;
  }

  const rekomendasiAll = getAllRekomendasi();
  const rekMap = Object.fromEntries(rekomendasiAll.map((r) => [r.kode_kab, r]));

  const kabupatenList = getKabupatenList().map((k) => {
    const rek = rekMap[k.kode_kab];
    return {
      ...k,
      has_kuat: rek ? (rek.rekomendasi_kuat?.length ?? 0) > 0 : false,
      has_lemah: rek ? (rek.rekomendasi_lemah?.length ?? 0) > 0 : false,
    };
  });

  return {
    props: {
      kabupatenList,
      komoditasList,
      stats: getStats(),
      namaKomoditasMap,
    },
  };
}
