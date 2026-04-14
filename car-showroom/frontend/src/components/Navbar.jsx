import React, { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Browse Cars', exact: true },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488";
const PH_PATH = "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-slate-950/50 border-b border-slate-800/80' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-white text-sm group-hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/30">
              SA
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg text-white leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                Singh <span className="text-orange-500">Automobiles</span>
              </span>
              <span className="text-slate-500 text-[9px] uppercase tracking-widest leading-none">Car Showroom · Chhapra</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink key={link.to} to={link.to} end={link.exact}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://wa.me/917091591501" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-400 text-sm font-medium px-4 py-2 rounded-lg transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d={WA_PATH} />
              </svg>
              WhatsApp
            </a>
            <a href="tel:+917091591501" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={PH_PATH} />
              </svg>
              +91 70915 91501
            </a>
            <div className="w-px h-5 bg-slate-800" />
            <Link to="/admin/login" className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-orange-500/20">
              Admin
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 border border-slate-800 rounded-2xl mb-4 p-4 flex flex-col gap-2 shadow-2xl">
            {NAV_LINKS.map(link => (
              <NavLink key={link.to} to={link.to} end={link.exact}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-orange-500/15 text-orange-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="h-px bg-slate-800 my-1" />
            <a href="tel:+917091591501" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 text-sm">
              📞 +91 70915 91501
            </a>
            <a href="https://wa.me/917091591501" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-400 bg-emerald-500/10 text-sm font-medium">
              💬 Chat on WhatsApp
            </a>
            <Link to="/admin/login" className="bg-orange-500 text-white text-center py-3 rounded-xl font-semibold text-sm">
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
