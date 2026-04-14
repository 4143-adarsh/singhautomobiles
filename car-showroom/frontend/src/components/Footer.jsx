import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">

      {/* Top CTA Strip */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📞</span>
            <div>
              <p className="text-white font-bold text-lg leading-none">+91 70915 91501</p>
              <p className="text-orange-100 text-xs">Call us Mon–Sat 9AM–7PM · Sun 10AM–5PM</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="tel:+917091591501" className="bg-white text-orange-600 font-bold px-5 py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors">
              Call Now
            </a>
            <a href="https://wa.me/917091591501" target="_blank" rel="noopener noreferrer"
              className="bg-orange-700/40 border border-orange-400/30 text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-orange-700/60 transition-colors backdrop-blur">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-white">SA</div>
              <div>
                <span className="font-bold text-xl text-white block" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Singh <span className="text-orange-500">Automobiles</span>
                </span>
                <span className="text-slate-500 text-[9px] uppercase tracking-widest">Car Showroom · Chhapra</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Bihar's trusted pre-owned car showroom. Every car is inspected, verified, and fairly priced. We have been helping families drive home their dream car since 2015. Visit us at Shyam Chowk, Chhapra.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">📍</span>
                <div>
                  <p className="text-slate-300 text-sm font-medium">Showroom Address</p>
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5">
                    Shyam Chowk, Chhapra,<br />Bihar – 841301, India
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-500 flex-shrink-0">👤</span>
                <div>
                  <p className="text-slate-500 text-xs">Owner</p>
                  <p className="text-slate-300 text-sm font-medium">Pintu Singh</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-500 flex-shrink-0">📞</span>
                <a href="tel:+917091591501" className="text-slate-300 text-sm hover:text-orange-400 transition-colors">
                  +91 70915 91501
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-500 flex-shrink-0">📧</span>
                <a href="mailto:info@singhautomobiles.in" className="text-slate-300 text-sm hover:text-orange-400 transition-colors">
                  info@singhautomobiles.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-500 flex-shrink-0">🕐</span>
                <p className="text-slate-400 text-xs">Mon–Sat: 9:00 AM – 7:00 PM · Sun: 10:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Browse All Cars' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/inquiry', label: 'Submit Inquiry' },
                { to: '/admin/login', label: 'Admin Login' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-orange-400 text-sm transition-colors flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-orange-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse By */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Browse By</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Petrol Cars', to: '/?fuel_type=Petrol' },
                { label: 'Diesel Cars', to: '/?fuel_type=Diesel' },
                { label: 'Electric Cars', to: '/?fuel_type=Electric' },
                { label: 'Under 5 Lakh', to: '/?max_price=500000' },
                { label: 'Under 10 Lakh', to: '/?max_price=1000000' },
                { label: 'SUVs', to: '/?search=SUV' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-400 hover:text-orange-400 text-sm transition-colors flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-orange-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Our Services</h4>
            <ul className="space-y-2.5 mb-8">
              {['Car Buying', 'Car Selling', 'RC Transfer', 'Car Financing', 'Test Drives', 'Car Valuation'].map(s => (
                <li key={s} className="text-slate-400 text-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500/50 rounded-full flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            <h4 className="text-white font-semibold mb-3 uppercase text-xs tracking-widest">Follow Us</h4>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'Facebook', icon: 'FB', color: 'bg-blue-700', href: '#' },
                { label: 'Instagram', icon: 'IG', color: 'bg-pink-600', href: '#' },
                { label: 'YouTube', icon: 'YT', color: 'bg-red-600', href: '#' },
                { label: 'WhatsApp', icon: 'WA', color: 'bg-emerald-600', href: 'https://wa.me/917091591501' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  className={`${s.color} w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold hover:opacity-80 hover:scale-105 transition-all`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { icon: '🛡️', text: '150-Point Inspected' },
              { icon: '📄', text: 'Free RC Transfer' },
              { icon: '🔄', text: '7-Day Returns' },
              { icon: '💳', text: 'Easy EMI Available' },
              { icon: '⭐', text: '4.8 Star Rated' },
              { icon: '🏆', text: 'Trusted Since 2015' },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-2 text-slate-500 text-xs">
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-600 text-xs text-center sm:text-left">
            © {year} Singh Automobiles, Chhapra. All rights reserved. | Owner: Pintu Singh
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(item => (
              <span key={item} className="text-slate-600 hover:text-slate-400 text-xs cursor-pointer transition-colors">{item}</span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
