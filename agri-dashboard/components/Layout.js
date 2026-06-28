// components/Layout.js
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-800 text-white sticky top-0 z-20 shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">
            🌾 AgriRekomendasi
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <Link href="/ruled-based" className="hover:underline">
              Cek Manual
            </Link>
            <Link href="/compare" className="hover:underline">
              Bandingkan
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="text-center text-xs text-gray-500 py-6 border-t">
        Rekomendasi dihasilkan dari model forecasting (SARIMAX) & klasifikasi rule-based FAO/ECOCROP
        (S1/S2/N). Bukan satu-satunya acuan — konsultasikan juga ke penyuluh pertanian setempat.
      </footer>
    </div>
  );
}
