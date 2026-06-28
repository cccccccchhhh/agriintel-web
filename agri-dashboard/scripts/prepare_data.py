"""
prepare_data.py — Convert deploy_bundle CSV ke JSON yang dipakai Next.js app.

Cara pakai (kalau data di Colab kamu update lagi, regenerate JSON-nya):
    python3 scripts/prepare_data.py /path/to/deploy_bundle/data_clean ./data

Output:
    data/kabupaten.json       -- 1 baris per kabupaten: profil tanah/cuaca + kelas S1/S2/N tiap komoditas
    data/rekomendasi.json     -- 1 baris per kabupaten: rekomendasi kuat/lemah + saran distribusi
    data/komoditas.json       -- 1 baris per komoditas: tren demand nasional + syarat tumbuh (LUR)
    data/lur.json             -- syarat tumbuh mentah (dipakai tool Rule-Based manual)
    data/forecast_iklim.json  -- {kode_kab: {curah_hujan: [12 angka], suhu: [12 angka], bulan: [1..12]}}
    data/kabupaten_list.json  -- daftar ringkas {kode_kab, nama_kab, provinsi} buat search/autocomplete
"""
import sys, os, json, math
import pandas as pd
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else "../source_data"
OUT = sys.argv[2] if len(sys.argv) > 2 else "../data"
os.makedirs(OUT, exist_ok=True)


def clean_nan(obj):
    """Rekursif ganti NaN/inf jadi None biar valid JSON."""
    if isinstance(obj, dict):
        return {k: clean_nan(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [clean_nan(v) for v in obj]
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    if isinstance(obj, (np.floating,)):
        v = float(obj)
        return None if (math.isnan(v) or math.isinf(v)) else v
    if isinstance(obj, (np.integer,)):
        return int(obj)
    return obj


def dump(name, obj):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(clean_nan(obj), f, ensure_ascii=False, separators=(",", ":"))
    print(f"  -> {path}  ({os.path.getsize(path)/1024:.1f} KB)")


# =====================================================================
# 1) prediksi_komoditas_per_kabupaten.csv -> kabupaten.json
# =====================================================================
pred = pd.read_csv(os.path.join(SRC, "prediksi_komoditas_per_kabupaten.csv"))
kelas_cols = [c for c in pred.columns if c.startswith("kelas_")]
KOMODITAS_LIST = sorted([c.replace("kelas_", "") for c in kelas_cols])

kabupaten_rows = []
for _, r in pred.iterrows():
    kelas = {k: (r[f"kelas_{k}"] if pd.notna(r[f"kelas_{k}"]) else "N") for k in KOMODITAS_LIST}
    kabupaten_rows.append({
        "kode_kab": int(r["kode_kab"]),
        "nama_kab": r["nama_kab"] if pd.notna(r["nama_kab"]) else f"Kab-{int(r['kode_kab'])}",
        "provinsi": r["provinsi"] if pd.notna(r["provinsi"]) else None,
        "ph": round(float(r["ph"]), 2) if pd.notna(r["ph"]) else None,
        "dem": round(float(r["dem"]), 1) if pd.notna(r["dem"]) else None,
        "tekstur_eng": r["tekstur_eng"] if pd.notna(r["tekstur_eng"]) else None,
        "ch_tahunan_mm": round(float(r["ch_tahunan_sum"]), 1) if pd.notna(r["ch_tahunan_sum"]) else None,
        "suhu_mean": round(float(r["suhu_mean"]), 1) if pd.notna(r["suhu_mean"]) else None,
        "n_komoditas_cocok": int(r["n_komoditas"]) if pd.notna(r["n_komoditas"]) else 0,
        "kelas": kelas,
    })
dump("kabupaten.json", kabupaten_rows)
dump("kabupaten_list.json", [
    {"kode_kab": r["kode_kab"], "nama_kab": r["nama_kab"], "provinsi": r["provinsi"]}
    for r in kabupaten_rows
])

# =====================================================================
# 2) rekomendasi_tanam_distribusi.csv -> rekomendasi.json
# =====================================================================
rekom = pd.read_csv(os.path.join(SRC, "rekomendasi_tanam_distribusi.csv"))


def split_list(s):
    if pd.isna(s) or s == "-":
        return []
    return [x.strip() for x in s.split(",") if x.strip()]


def parse_distribusi(s):
    """'Buncis -> A, B, C | Pisang -> D, E' -> {'Buncis': ['A','B','C'], 'Pisang': ['D','E']}"""
    if pd.isna(s) or s == "-":
        return {}
    out = {}
    for part in s.split("|"):
        part = part.strip()
        if "->" not in part:
            continue
        kom, wil = part.split("->", 1)
        out[kom.strip()] = [w.strip() for w in wil.split(",") if w.strip()]
    return out


rekom_rows = []
for _, r in rekom.iterrows():
    rekom_rows.append({
        "kode_kab": int(r["kode_kab"]),
        "rekomendasi_kuat": split_list(r["rekomendasi_kuat"]),
        "rekomendasi_lemah": split_list(r["rekomendasi_lemah"]),
        "tidak_direkomendasikan": split_list(r["cocok_tapi_demand_tidak_mendukung"]),
        "saran_distribusi": parse_distribusi(r["saran_distribusi"]),
    })
dump("rekomendasi.json", rekom_rows)

# =====================================================================
# 3) demand_grand_summary.csv + lur_expanded.csv -> komoditas.json & lur.json
# =====================================================================
grand = pd.read_csv(os.path.join(SRC, "demand_grand_summary.csv"))
lur = pd.read_csv(os.path.join(SRC, "lur_expanded.csv"))

lur_by_komoditas = {row["nama_komoditas"]: row for _, row in lur.iterrows()}

komoditas_rows = []
for _, r in grand.iterrows():
    nama_kom = r["komoditas"]
    # demand_grand_summary pakai nama kapital awal beda dikit dgn lur (case-insensitive match)
    lur_row = None
    for k, v in lur_by_komoditas.items():
        if k.lower() == str(nama_kom).lower():
            lur_row = v
            break
    komoditas_rows.append({
        "komoditas": nama_kom,
        "n_tahun_data": int(r["n"]),
        "model_type": r["model_type"],
        "slope": round(float(r["slope"]), 5),
        "ci_low": round(float(r["ci_low"]), 5),
        "ci_high": round(float(r["ci_high"]), 5),
        "tren": r["tren"],
        "syarat_tumbuh": ({
            "ph_opt": [lur_row["ph_opt_min"], lur_row["ph_opt_maks"]],
            "ph_abs": [lur_row["ph_abs_min"], lur_row["ph_abs_maks"]],
            "ch_opt_mmthn": [lur_row["ch_opt_min_mmthn"], lur_row["ch_opt_maks_mmthn"]],
            "ch_abs_mmthn": [lur_row["ch_abs_min_mmthn"], lur_row["ch_abs_maks_mmthn"]],
            "suhu_opt": [lur_row["suhu_opt_min_c"], lur_row["suhu_opt_maks_c"]],
            "suhu_abs": [lur_row["suhu_abs_min_c"], lur_row["suhu_abs_maks_c"]],
            "altitude_maks_m": lur_row["altitude_maks_m"],
            "tekstur_opt": lur_row["tekstur_opt"],
            "tekstur_abs": lur_row["tekstur_abs"],
        } if lur_row is not None else None),
    })
dump("komoditas.json", komoditas_rows)

lur_rows = []
for _, r in lur.iterrows():
    lur_rows.append({
        "nama_komoditas": r["nama_komoditas"],
        "nama_demand": r["nama_demand"],
        "grup": r["grup"],
        "ph_opt_min": r["ph_opt_min"], "ph_opt_maks": r["ph_opt_maks"],
        "ph_abs_min": r["ph_abs_min"], "ph_abs_maks": r["ph_abs_maks"],
        "ch_opt_min_mmthn": r["ch_opt_min_mmthn"], "ch_opt_maks_mmthn": r["ch_opt_maks_mmthn"],
        "ch_abs_min_mmthn": r["ch_abs_min_mmthn"], "ch_abs_maks_mmthn": r["ch_abs_maks_mmthn"],
        "suhu_opt_min_c": r["suhu_opt_min_c"], "suhu_opt_maks_c": r["suhu_opt_maks_c"],
        "suhu_abs_min_c": r["suhu_abs_min_c"], "suhu_abs_maks_c": r["suhu_abs_maks_c"],
        "altitude_maks_m": r["altitude_maks_m"],
        "tekstur_opt": r["tekstur_opt"], "tekstur_abs": r["tekstur_abs"],
    })
dump("lur.json", lur_rows)

# =====================================================================
# 4) curah_hujan_forecast_12bln.csv + suhu_forecast_12bln.csv -> forecast_iklim.json
# =====================================================================
ch = pd.read_csv(os.path.join(SRC, "curah_hujan_forecast_12bln.csv"))
sh = pd.read_csv(os.path.join(SRC, "suhu_forecast_12bln.csv"))

DAYS = {1:31,2:28.25,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31}
ch["bulanan_mm"] = ch["curah_hujan_mm_forecast"] * ch["bulan"].map(DAYS)

forecast = {}
for kode in pd.concat([ch["kode_kab"], sh["kode_kab"]]).unique():
    kode = int(kode)
    ch_k = ch[ch["kode_kab"] == kode].sort_values(["tahun", "bulan"])
    sh_k = sh[sh["kode_kab"] == kode].sort_values(["tahun", "bulan"])
    if len(ch_k) == 0 and len(sh_k) == 0:
        continue
    forecast[str(kode)] = {
        "label": [f"{int(t)}-{int(b):02d}" for t, b in zip(ch_k["tahun"], ch_k["bulan"])] if len(ch_k) else
                 [f"{int(t)}-{int(b):02d}" for t, b in zip(sh_k["tahun"], sh_k["bulan"])],
        "curah_hujan_mm": [round(float(v), 1) for v in ch_k["bulanan_mm"]] if len(ch_k) else [],
        "suhu_c": [round(float(v), 2) for v in sh_k["suhu_rata_c_forecast"]] if len(sh_k) else [],
        "method_ch": ch_k["method"].iloc[0] if len(ch_k) else None,
        "method_suhu": sh_k["method"].iloc[0] if len(sh_k) else None,
    }
dump("forecast_iklim.json", forecast)

# =====================================================================
# 5) Stat ringkasan nasional (buat landing page)
# =====================================================================
n_total = len(rekom)
n_kuat = (rekom["rekomendasi_kuat"] != "-").sum()
n_lemah = (rekom["rekomendasi_lemah"] != "-").sum()
n_any = ((rekom["rekomendasi_kuat"] != "-") | (rekom["rekomendasi_lemah"] != "-")).sum()
tren_counts = grand["tren"].value_counts().to_dict()

stats = {
    "n_kabupaten_total": int(n_total),
    "n_kabupaten_rekomendasi_kuat": int(n_kuat),
    "n_kabupaten_rekomendasi_lemah": int(n_lemah),
    "n_kabupaten_ada_rekomendasi": int(n_any),
    "n_komoditas": len(KOMODITAS_LIST),
    "tren_demand_counts": {k: int(v) for k, v in tren_counts.items()},
}
dump("stats.json", stats)

print(f"\nSelesai. {len(kabupaten_rows)} kabupaten, {len(KOMODITAS_LIST)} komoditas.")
