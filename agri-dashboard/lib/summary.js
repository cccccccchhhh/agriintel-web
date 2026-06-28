// lib/summary.js

function describeTekstur(t) {
  const map = { heavy: "berat (liat)", medium: "sedang (lempung)", light: "ringan (berpasir)", organic: "organik (gambut)" };
  return map[t] || t || "tidak diketahui";
}

function describePh(ph) {
  if (ph == null) return "";
  if (ph < 5.5) return "asam";
  if (ph < 6.5) return "agak asam";
  if (ph < 7.5) return "netral";
  return "basa";
}

export function buatSummary(kab, rekom) {
  if (!kab) return "";

  const parts = [];
  parts.push(
    `Kabupaten ${kab.nama_kab}${kab.provinsi ? ` (${kab.provinsi})` : ""} memiliki tanah dengan pH sekitar ` +
      `${kab.ph ?? "-"} (${describePh(kab.ph)}), elevasi rata-rata ${kab.dem ?? "-"} mdpl, dan tekstur tanah ` +
      `${describeTekstur(kab.tekstur_eng)}.`
  );

  parts.push(
    `Berdasarkan forecast, curah hujan tahunan diproyeksikan sekitar ${Math.round(kab.ch_tahunan_mm || 0)} mm/tahun ` +
      `dengan suhu rata-rata ${kab.suhu_mean ?? "-"}°C.`
  );

  const nS1 = Object.values(kab.kelas || {}).filter((k) => k === "S1").length;
  parts.push(
    `Wilayah ini cocok untuk ${kab.n_komoditas_cocok} dari 24 komoditas yang dianalisis` +
      (nS1 > 0 ? `, dengan ${nS1} komoditas tergolong sangat cocok (S1).` : ".")
  );

  if (rekom?.rekomendasi_kuat?.length) {
    parts.push(
      `Dari sisi permintaan pasar, ${rekom.rekomendasi_kuat.join(", ")} ` +
        `direkomendasikan kuat untuk ditanam karena tren konsumsi nasionalnya naik secara signifikan.`
    );
  }
  if (rekom?.rekomendasi_lemah?.length) {
    parts.push(
      `${rekom.rekomendasi_lemah.join(", ")} juga dapat dipertimbangkan, meski tren permintaannya ` +
        `masih belum cukup kuat secara statistik (data historis permintaan baru tersedia 7-8 tahun).`
    );
  }
  if (rekom?.tidak_direkomendasikan?.length) {
    parts.push(
      `Sebaliknya, ${rekom.tidak_direkomendasikan.join(", ")} sebenarnya cocok secara iklim/tanah, ` +
        `namun permintaan pasarnya cenderung tidak mendukung untuk saat ini.`
    );
  }

  const firstKuat = rekom?.rekomendasi_kuat?.[0];
  if (firstKuat && rekom.saran_distribusi?.[firstKuat]?.length) {
    parts.push(
      `Hasil panen ${firstKuat} dapat dipertimbangkan untuk didistribusikan ke ` +
        `${rekom.saran_distribusi[firstKuat].join(", ")} yang memiliki proyeksi permintaan tertinggi.`
    );
  }

  return parts.join(" ");
}
