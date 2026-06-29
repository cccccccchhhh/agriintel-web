// components/Layout.js
import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();

  const isLinkActive = (path) => {
    return router.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f0] text-[#1a2e22]">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-[#faf7f0]/85 backdrop-blur-md border-b border-[#166534]/10 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white text-lg transition-transform duration-300 group-hover:scale-110 shadow-sm">
              🌱
            </div>
            <span className="font-extrabold text-[18px] tracking-tight text-[#166534] transition-colors duration-300 group-hover:text-[#12502a]">
              AgriRekomendasi
            </span>
          </Link>
          <nav className="flex items-center gap-6 md:gap-8 text-[14px] font-semibold">
            <Link
              href="/"
              className={`transition-colors duration-200 hover:text-[#166534] ${
                isLinkActive("/") ? "text-[#166534] relative after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[3px] after:bg-[#166534] after:rounded-full" : "text-[#3c5547]"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/ruled-based"
              className={`transition-colors duration-200 hover:text-[#166534] ${
                isLinkActive("/ruled-based") ? "text-[#166534] relative after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[3px] after:bg-[#166534] after:rounded-full" : "text-[#3c5547]"
              }`}
            >
              Cek Manual
            </Link>
            <Link
              href="/compare"
              className={`transition-colors duration-200 hover:text-[#166534] ${
                isLinkActive("/compare") ? "text-[#166534] relative after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[3px] after:bg-[#166534] after:rounded-full" : "text-[#3c5547]"
              }`}
            >
              Bandingkan
            </Link>
          </nav>
          <div className="hidden sm:block">
            <button className="text-[13px] font-bold px-4 py-2 rounded-xl border border-[#166534]/25 text-[#166534] hover:bg-[#166534] hover:text-white hover:shadow-sm transition-all duration-300">
              Mitra Petani
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 animate-fade-in">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#166534]/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#6a8174]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#166534] flex items-center justify-center text-white text-[13px]">
              🌱
            </div>
            <span className="font-bold text-[#166534]">AgriRekomendasi</span>
          </div>
          <span className="text-center md:text-left leading-relaxed max-w-md">
            © 2026 AgriRekomendasi · Dihasilkan dari forecasting (SARIMAX) & klasifikasi FAO/ECOCROP. Konsultasikan juga ke penyuluh pertanian setempat.
          </span>
          <div className="flex gap-5 font-semibold">
            <Link href="/" className="hover:text-[#166534] transition-colors">Beranda</Link>
            <Link href="/ruled-based" className="hover:text-[#166534] transition-colors">Cek Lahan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
