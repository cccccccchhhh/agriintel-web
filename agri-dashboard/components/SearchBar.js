// components/SearchBar.js
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/router";

export default function SearchBar({ kabupatenList, autoFocus = false }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const boxRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return kabupatenList
      .filter(
        (k) =>
          k.nama_kab.toLowerCase().includes(q) ||
          (k.provinsi && k.provinsi.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query, kabupatenList]);

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goTo(kab) {
    setQuery(kab.nama_kab);
    setOpen(false);
    router.push(`/kabupaten/${kab.kode_kab}`);
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <input
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Cari nama kabupaten/kota... (contoh: Aceh Barat)"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-30 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-72 overflow-y-auto">
          {results.map((k) => (
            <li
              key={k.kode_kab}
              onClick={() => goTo(k)}
              className="px-4 py-2 hover:bg-green-50 cursor-pointer flex justify-between"
            >
              <span className="font-medium">{k.nama_kab}</span>
              <span className="text-gray-400 text-sm">{k.provinsi}</span>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-30 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 px-4 py-3 text-gray-400 text-sm">
          Kabupaten tidak ditemukan
        </div>
      )}
    </div>
  );
}
