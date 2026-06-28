// lib/classify.js
//
// Port JS dari logic rule-based S1/S2/N di notebook (limiting factor principle).
// Dipakai khusus di tab "Rule-Based Manual" — petani isi sebagian/semua dari 5 indikator
// (pH, curah hujan tahunan, suhu, elevasi, tekstur), yang kosong diisi default dari
// kabupaten yang dipilih.

function parseTeksturSet(s) {
  if (!s) return null;
  const lower = String(s).toLowerCase();
  if (lower.includes("wide")) return new Set(["light", "medium", "heavy", "organic"]);
  return new Set(lower.split(",").map((t) => t.trim()));
}

/**
 * Klasifikasi S1/S2/N untuk 1 komoditas berdasarkan 5 indikator.
 * @param {object} indikator - { ph, ch_tahunan_mm, suhu_c, elevasi_m, tekstur }
 * @param {object} lurRow - 1 baris dari lur.json
 * @returns {{ kelas: 'S1'|'S2'|'N'|null, limiting_factors: string[] }}
 */
export function klasifikasiKomoditas(indikator, lurRow) {
  const tiers = [];
  const limitingFactors = [];

  // pH
  if (indikator.ph != null && lurRow.ph_abs_min != null) {
    if (indikator.ph >= lurRow.ph_opt_min && indikator.ph <= lurRow.ph_opt_maks) {
      tiers.push("S1");
    } else if (indikator.ph >= lurRow.ph_abs_min && indikator.ph <= lurRow.ph_abs_maks) {
      tiers.push("S2");
      limitingFactors.push("pH di luar rentang optimal");
    } else {
      tiers.push("N");
      limitingFactors.push("pH di luar rentang yang masih bisa ditoleransi");
    }
  }

  // Curah hujan tahunan (mm/thn)
  if (indikator.ch_tahunan_mm != null && lurRow.ch_abs_min_mmthn != null) {
    if (indikator.ch_tahunan_mm >= lurRow.ch_opt_min_mmthn && indikator.ch_tahunan_mm <= lurRow.ch_opt_maks_mmthn) {
      tiers.push("S1");
    } else if (indikator.ch_tahunan_mm >= lurRow.ch_abs_min_mmthn && indikator.ch_tahunan_mm <= lurRow.ch_abs_maks_mmthn) {
      tiers.push("S2");
      limitingFactors.push("Curah hujan di luar rentang optimal");
    } else {
      tiers.push("N");
      limitingFactors.push("Curah hujan di luar rentang yang masih bisa ditoleransi");
    }
  }

  // Suhu
  if (indikator.suhu_c != null && lurRow.suhu_abs_min_c != null) {
    if (indikator.suhu_c >= lurRow.suhu_opt_min_c && indikator.suhu_c <= lurRow.suhu_opt_maks_c) {
      tiers.push("S1");
    } else if (indikator.suhu_c >= lurRow.suhu_abs_min_c && indikator.suhu_c <= lurRow.suhu_abs_maks_c) {
      tiers.push("S2");
      limitingFactors.push("Suhu di luar rentang optimal");
    } else {
      tiers.push("N");
      limitingFactors.push("Suhu di luar rentang yang masih bisa ditoleransi");
    }
  }

  // Elevasi (cuma batas maksimum, gak ada "optimal" di ECOCROP -> S2-level saja)
  if (indikator.elevasi_m != null && lurRow.altitude_maks_m != null) {
    if (indikator.elevasi_m <= lurRow.altitude_maks_m) {
      tiers.push("S2");
    } else {
      tiers.push("N");
      limitingFactors.push("Elevasi melebihi batas maksimum");
    }
  }

  // Tekstur tanah
  if (indikator.tekstur && lurRow.tekstur_opt) {
    const optSet = parseTeksturSet(lurRow.tekstur_opt);
    const absSet = parseTeksturSet(lurRow.tekstur_abs);
    if (optSet && optSet.has(indikator.tekstur)) {
      tiers.push("S1");
    } else if (absSet && absSet.has(indikator.tekstur)) {
      tiers.push("S2");
      limitingFactors.push("Tekstur tanah di luar preferensi optimal");
    } else if (optSet || absSet) {
      tiers.push("N");
      limitingFactors.push("Tekstur tanah tidak sesuai");
    }
  }

  if (tiers.length === 0) return { kelas: null, limiting_factors: [] };
  if (tiers.includes("N")) return { kelas: "N", limiting_factors: limitingFactors };
  if (tiers.includes("S2")) return { kelas: "S2", limiting_factors: limitingFactors };
  return { kelas: "S1", limiting_factors: [] };
}

/**
 * Jalankan klasifikasi ke SEMUA komoditas di lurList.
 * @param {object} indikator
 * @param {object[]} lurList - data/lur.json
 * @returns {Array<{ nama_komoditas, kelas, limiting_factors }>}
 */
export function klasifikasiSemuaKomoditas(indikator, lurList) {
  return lurList
    .map((lurRow) => {
      const { kelas, limiting_factors } = klasifikasiKomoditas(indikator, lurRow);
      return { nama_komoditas: lurRow.nama_komoditas, nama_demand: lurRow.nama_demand, kelas, limiting_factors };
    })
    .filter((r) => r.kelas !== null)
    .sort((a, b) => {
      const order = { S1: 0, S2: 1, N: 2 };
      return order[a.kelas] - order[b.kelas];
    });
}

export const TEKSTUR_OPTIONS = [
  { value: "light", label: "Ringan / Berpasir (light)" },
  { value: "medium", label: "Sedang / Lempung (medium)" },
  { value: "heavy", label: "Berat / Liat (heavy)" },
  { value: "organic", label: "Organik / Gambut (organic)" },
];
