// pages/rekomendasi.js
import Head from "next/head";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import Link from "next/link";
import { useState, useMemo } from "react";
import { getAllKabupaten, getAllRekomendasi, getKomoditasList } from "../lib/data";

export default function RekomendasiPage({ kabupatenAll, rekomendasiAll }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProv, setSelectedProv] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("semua"); // semua, kuat, lemah

  const provList = useMemo(() => {
    const set = new Set(kabupatenAll.map((k) => k.provinsi));
    return [...set].sort();
  }, [kabupatenAll]);

  const rekMap = useMemo(() => {
    return Object.fromEntries(rekomendasiAll.map((r) => [r.kode_kab, r]));
  }, [rekomendasiAll]);

  const tableData = useMemo(() => {
    const list = [];
    for (const kab of kabupatenAll) {
      const rek = rekMap[kab.kode_kab];
      if (!rek) continue;

      if (selectedKategori === "semua" || selectedKategori === "kuat") {
        for (const k of rek.rekomendasi_kuat || []) {
          list.push({
            kode_kab: kab.kode_kab,
            nama_kab: kab.nama_kab,
            provinsi: kab.provinsi,
            komoditas: k,
            kategori: "Kuat",
            distribusi: rek.saran_distribusi?.[k] || [],
          });
        }
      }

      if (selectedKategori === "semua" || selectedKategori === "lemah") {
        for (const k of rek.rekomendasi_lemah || []) {
          list.push({
            kode_kab: kab.kode_kab,
            nama_kab: kab.nama_kab,
            provinsi: kab.provinsi,
            komoditas: k,
            kategori: "Lemah",
            distribusi: rek.saran_distribusi?.[k] || [],
          });
        }
      }
    }
    return list;
  }, [kabupatenAll, rekMap, selectedKategori]);

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchProv = !selectedProv || item.provinsi === selectedProv;
      const matchSearch =
        !searchTerm ||
        item.nama_kab.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.komoditas.toLowerCase().includes(searchTerm.toLowerCase());
      return matchProv && matchSearch;
    });
  }, [tableData, selectedProv, searchTerm]);

  return (
    <Layout>
      <Head>
        <title>Peta Rekomendasi Diversifikasi & Decision Engine — AgriDiv</title>
      </Head>

      {/* HEADER */}
      <section className="grain relative overflow-hidden rounded-3xl glass-panel px-6 py-10 md:py-12 mb-8 animate-fade-in shadow-xl">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-extrabold text-[#bef264] bg-[#bef264]/15 border border-[#bef264]/30 px-4 py-1.5 rounded-full mb-4">
          ⚙️ Decision Engine AgriDiv
        </span>
        <h1 className="text-[32px] md:text-[44px] leading-tight font-black tracking-tight text-white drop-shadow-md">
          Peta Rekomendasi Diversifikasi Tanam
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-emerald-100/80 max-w-2xl font-medium">
          Decision engine menggabungkan pilar kesesuaian biofisik lahan (S1/S2) dengan prospek ekonomi pasar menanjak. Dihasilkan 3.800 rekomendasi tanam terukur di 447 kabupaten/kota.
        </p>
      </section>

      {/* STATS SUMMARY */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Rekomendasi" value="3,800" sub="Pasangan kab–komoditas" color="#bef264" icon="🌱" iconBg="bg-emerald-500/20 text-[#bef264] border border-emerald-500/30" />
        <StatCard label="Kabupaten Terjangkau" value="447 / 515" sub="Rata-rata 8.5 opsi per kab" color="#38bdf8" icon="📍" iconBg="bg-sky-500/20 text-sky-300 border border-sky-500/30" />
        <StatCard label="Prospek Tinggi (>0.7)" value="640" sub="Sangat direkomendasikan" color="#fbbf24" icon="⭐" iconBg="bg-amber-500/20 text-amber-300 border border-amber-500/30" />
        <StatCard label="Tidak Cocok Lahan" value="6,803" sub="Filter pembatas biofisik" color="#f43f5e" icon="🚫" iconBg="bg-rose-500/20 text-rose-300 border border-rose-500/30" />
      </section>

      {/* SEARCH & FILTER CONTROLS */}
      <section className="glass-panel rounded-3xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="w-full md:w-auto flex-1 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari kabupaten atau komoditas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-[#0c2417]/80 border border-white/20 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-[#bef264] placeholder:text-emerald-200/40 shadow-inner"
            />
            <select
              value={selectedProv}
              onChange={(e) => setSelectedProv(e.target.value)}
              className="bg-[#0c2417]/80 border border-white/20 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-[#bef264] cursor-pointer"
            >
              <option value="" className="bg-[#0c2417] text-white">Semua Provinsi</option>
              {provList.map((p) => (
                <option key={p} value={p} className="bg-[#0c2417] text-white">{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 glass-card p-1.5 rounded-2xl border border-white/15 w-full md:w-auto justify-center">
            <button
              onClick={() => setSelectedKategori("semua")}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition ${selectedKategori === "semua" ? "bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white shadow-md" : "text-emerald-100/80 hover:text-white"}`}
            >
              Semua ({tableData.length})
            </button>
            <button
              onClick={() => setSelectedKategori("kuat")}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition ${selectedKategori === "kuat" ? "bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white shadow-md" : "text-emerald-100/80 hover:text-white"}`}
            >
              Kuat
            </button>
            <button
              onClick={() => setSelectedKategori("lemah")}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition ${selectedKategori === "lemah" ? "bg-amber-600 text-white shadow-md" : "text-emerald-100/80 hover:text-white"}`}
            >
              Lemah
            </button>
          </div>
        </div>

        {/* REKOMENDASI TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-black uppercase tracking-wider text-emerald-200/70 bg-black/20">
                <th className="py-3.5 px-4">Kabupaten/Kota</th>
                <th className="py-3.5 px-4">Provinsi</th>
                <th className="py-3.5 px-4">Komoditas Rekomendasi</th>
                <th className="py-3.5 px-4">Kategori Prospek</th>
                <th className="py-3.5 px-4">Saran Distribusi Pasar</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs">
              {filteredData.slice(0, 50).map((row) => (
                <tr key={`${row.kode_kab}-${row.komoditas}`} className="hover:bg-white/5 transition">
                  <td className="py-3.5 px-4 font-black text-white">{row.nama_kab}</td>
                  <td className="py-3.5 px-4 text-emerald-200/80 font-semibold">{row.provinsi}</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#bef264]">🌱 {row.komoditas}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${row.kategori === "Kuat" ? "bg-emerald-500/20 text-[#bef264] border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"}`}>
                      {row.kategori === "Kuat" ? "⭐ Kuat (Signifikan)" : "⚡ Prospek Lemah"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-200/80 font-medium">
                    {row.distribusi.length > 0 ? (
                      <span className="text-[11px] bg-black/30 px-2.5 py-1 rounded-lg text-white font-bold border border-white/10">
                        📦 Ke: {row.distribusi.slice(0, 2).join(", ")}
                      </span>
                    ) : (
                      <span className="text-emerald-200/40 italic">Pasar Lokal</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/kabupaten/${row.kode_kab}`} className="text-[#bef264] font-black hover:underline">
                      Detail →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length > 50 && (
            <div className="text-center py-4 text-xs font-semibold text-emerald-200/60 border-t border-white/10">
              Menampilkan 50 dari {filteredData.length} hasil rekomendasi. Gunakan filter untuk mempersempit pencarian.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      kabupatenAll: getAllKabupaten(),
      rekomendasiAll: getAllRekomendasi(),
      komoditasList: getKomoditasList(),
    },
  };
}
