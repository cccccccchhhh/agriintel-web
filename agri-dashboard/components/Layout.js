// components/Layout.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Layout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/rekomendasi", label: "Peta Rekomendasi" },
    { href: "/proyeksi-iklim", label: "Proyeksi Iklim" },
    { href: "/komoditas", label: "Komoditas" },
    { href: "/analisis-permintaan", label: "Permintaan (XAI)" },
    { href: "/studi-kasus", label: "Studi Kasus" },
    { href: "/strategi-kebijakan", label: "Kebijakan" },
    { href: "/ruled-based", label: "Cek Lahan" },
    { href: "/compare", label: "Bandingkan" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      {/* HEADER NAV - FLOATING GLASS BAR */}
      <header className="sticky top-0 z-50 bg-[#08180e]/85 backdrop-blur-2xl border-b border-[#bef264]/25 transition-all duration-300 shadow-2xl">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center text-white text-xl transition-transform duration-300 group-hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.45)] border border-[#bef264]/40">
              🌿
            </div>
            <span className="font-black text-[22px] tracking-tight bg-gradient-to-r from-white via-emerald-100 to-[#bef264] bg-clip-text text-transparent transition-all duration-300 drop-shadow-sm">
              AgriDiv
            </span>
          </Link>

          {/* DESKTOP NAV - ULTRA PREMIUM FLOATING PILLS */}
          <nav className="hidden xl:flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-[12.5px] transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#15803d] text-white font-black border-2 border-[#bef264] shadow-[0_0_22px_rgba(34,197,94,0.5)] scale-[1.03]"
                      : "bg-[#0f321f]/90 text-white font-extrabold border border-white/20 hover:bg-[#22c55e]/30 hover:border-[#bef264] hover:text-white hover:scale-[1.02] shadow-sm"
                  }`}
                >
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse"></span>}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT CTA BUTTON */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="hidden sm:block text-[13px] font-black px-5 py-2.5 rounded-full bg-gradient-to-r from-[#bef264] to-[#a3e635] text-[#08140c] hover:brightness-110 transition-all duration-300 shadow-[0_0_25px_rgba(190,242,100,0.45)] whitespace-nowrap hover:scale-[1.02]">
              Masuk Portal
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-2.5 rounded-2xl text-white bg-[#0f321f] hover:bg-[#22c55e]/30 border border-white/20"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {menuOpen && (
          <div className="xl:hidden border-t border-white/20 bg-[#08180e]/95 backdrop-blur-2xl px-6 py-5 space-y-2.5 shadow-2xl animate-fade-in-up">
            <div className="grid grid-cols-2 gap-2.5">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3.5 py-2.5 rounded-full text-xs text-center transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white font-black border-2 border-[#bef264] shadow-md"
                        : "bg-[#0f321f] text-white font-extrabold border border-white/20 hover:bg-[#22c55e]/30"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <button className="w-full mt-3 text-xs font-black py-3 rounded-full bg-gradient-to-r from-[#bef264] to-[#a3e635] text-[#08140c] shadow-md">
              Masuk Portal
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 animate-fade-in">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#bef264]/20 bg-[#08180e]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center text-white text-[13px]">
              🌿
            </div>
            <span className="font-black text-white tracking-tight">AgriDiv</span>
          </div>
          <span className="text-center md:text-left leading-relaxed max-w-md font-medium text-emerald-100">
            © 2026 AgriDiv · Platform Ketahanan Pangan Berbasis Peramalan Iklim (SARIMAX), Kesesuaian Lahan (FAO/ECOCROP) & XAI (SHAP).
          </span>
          <div className="flex gap-6 font-bold">
            <Link href="/" className="hover:text-[#bef264] transition-colors">Beranda</Link>
            <Link href="/ruled-based" className="hover:text-[#bef264] transition-colors">Cek Lahan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
