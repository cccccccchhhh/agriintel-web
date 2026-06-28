// lib/data.js
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getKabupatenList() {
  return readJSON("kabupaten_list.json");
}

export function getKabupatenDetail(kodeKab) {
  const list = readJSON("kabupaten.json");
  return list.find((k) => k.kode_kab === Number(kodeKab)) || null;
}

export function getAllKabupaten() {
  return readJSON("kabupaten.json");
}

export function getAllKabupatenLite() {
  const list = readJSON("kabupaten.json");
  return list.map(({ kelas, ...rest }) => rest);
}

export function getRekomendasi(kodeKab) {
  const list = readJSON("rekomendasi.json");
  return list.find((r) => r.kode_kab === Number(kodeKab)) || null;
}

export function getAllRekomendasi() {
  return readJSON("rekomendasi.json");
}

export function getKomoditasList() {
  return readJSON("komoditas.json");
}

export function getLurList() {
  return readJSON("lur.json");
}

export function getForecastIklim(kodeKab) {
  const all = readJSON("forecast_iklim.json");
  return all[String(kodeKab)] || null;
}

export function getStats() {
  return readJSON("stats.json");
}
