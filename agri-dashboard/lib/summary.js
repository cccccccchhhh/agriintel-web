// lib/summary.js

function describeTekstur(t) {
  const map = { heavy: "berat (liat)", medium: "sedang (lempung)", light: "ringan (berpasir)", organic: "organik (gambut)" };
  return map[t] || t || "tidak diketahui";
}

function describePh(ph) {
  if (ph == null) return "";
  if (ph < 5.5) return "asam";
  if (ph < 6.5) return "agak asam (optimum)";
  if (ph < 7.5) return "netral (sangat baik)";
  return "basa";
}

export function buatSummary(kab, rekom) {
  if (!kab) return "";

  const parts = [];
  parts.push(
    `Berdasarkan analisis agroekologi presisi, Kabupaten ${kab.nama_kab}${kab.provinsi ? ` (${kab.provinsi})` : ""} memiliki karakteristik tanah dengan reaksi pH sekitar ` +
      `${kab.ph ?? "-"} (${describePh(kab.ph)}), ketinggian rata-rata ${kab.dem ?? "-"} mdpl, serta dominasi tekstur tanah ` +
      `${describeTekstur(kab.tekstur_eng)}.`
  );

  parts.push(
    `Proyeksi iklim SARIMAX menunjukkan rata-rata akumulasi curah hujan tahunan mencapai ${Math.round(kab.ch_tahunan_mm || 0)} mm/tahun ` +
      `dengan temperatur udara rerata ${kab.suhu_mean ?? "-"}°C.`
  );

  const nS1 = Object.values(kab.kelas || {}).filter((k) => k === "S1").length;
  parts.push(
    `Secara keseluruhan, biofisik lahan wilayah ini mendukung pertumbuhan ${kab.n_komoditas_cocok} dari 28 komoditas unggulan nasional yang dianalisis` +
      (nS1 > 0 ? `, di mana ${nS1} komoditas di antaranya tergolong dalam kelas Kesesuaian Sangat Sesuai (S1).` : ".")
  );

  if (rekom?.rekomendasi_kuat?.length) {
    parts.push(
      `Diintegrasikan dengan Decision Engine AgriDiv, komoditas ${rekom.rekomendasi_kuat.join(", ")} ` +
        `direkomendasikan kuat untuk ditanam karena didukung oleh tren peningkatan permintaan pasar nasional yang signifikan (CI 95%).`
    );
  }
  if (rekom?.rekomendasi_lemah?.length) {
    parts.push(
      `Komoditas seperti ${rekom.rekomendasi_lemah.join(", ")} dapat dijadikan opsi alternatif diversifikasi, meski tren pertumbuhan ekonominya ` +
        `masih berada pada tingkat moderat.`
    );
  }
  if (rekom?.tidak_direkomendasikan?.length) {
    parts.push(
      `Sementara itu, ${rekom.tidak_direkomendasikan.join(", ")} tidak direkomendasikan untuk pengembangan skala luas saat ini ` +
        `akibat adanya pembatas biofisik tanah atau kelesuan tren permintaan pasar.`
    );
  }

  const firstKuat = rekom?.rekomendasi_kuat?.[0];
  if (firstKuat && rekom.saran_distribusi?.[firstKuat]?.length) {
    parts.push(
      `Untuk optimalisasi rantai pasok dan stabilitas harga panen, komoditas ${firstKuat} diproyeksikan memiliki alokasi distribusi pasar potensial menuju ` +
        `${rekom.saran_distribusi[firstKuat].join(", ")}.`
    );
  }

  return parts.join(" ");
}
