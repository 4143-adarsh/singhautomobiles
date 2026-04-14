import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatKm, getImageUrl } from '../utils/helpers';

export default function CarCard({ car, index = 0 }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fuelIcons = {
    Petrol: '⛽',
    Diesel: '🛢️',
    Electric: '⚡',
    Hybrid: '🔋',
    CNG: '💨',
    LPG: '🔵',
  };

  const fuelColors = {
    Petrol: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Diesel: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Electric: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Hybrid: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    CNG: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    LPG: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  };

  return (
    <div
      className="group relative flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-orange-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10"
      style={{ animationDelay: `${index * 60}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image Container ── */}
      <div className="relative overflow-hidden bg-slate-800" style={{ aspectRatio: '16/10' }}>
        <img
          src={imgError ? 'https://placehold.co/640x400/1e293b/334155?text=No+Photo' : getImageUrl(car.main_image)}
          alt={car.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark gradient overlay — always present, deepens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Top-left: Owners badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-slate-900/80 backdrop-blur-sm text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-700/60">
            {car.number_of_owners === 1 ? '1st Owner' : `${car.number_of_owners} Owners`}
          </span>
        </div>

        {/* Top-right: Status badge */}
        <div className="absolute top-3 right-3">
          {car.status === 'Available' ? (
            <span className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-sm text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-red-500/20 backdrop-blur-sm text-red-400 text-xs font-semibold px-3 py-1 rounded-full border border-red-500/30">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
              Sold
            </span>
          )}
        </div>

        {/* Bottom overlay: Price + year */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-orange-400 font-bold text-2xl leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {formatPrice(car.price)}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">{car.year} · {car.brand}</p>
            </div>
            {/* Fuel type pill */}
            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${fuelColors[car.fuel_type] || 'text-slate-400 bg-slate-700 border-slate-600'}`}>
              {fuelIcons[car.fuel_type] || '⛽'} {car.fuel_type}
            </span>
          </div>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3
          className="font-semibold text-white leading-snug text-sm group-hover:text-orange-300 transition-colors duration-300 line-clamp-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {car.title}
        </h3>

        {/* Specs strip */}
        <div className="grid grid-cols-3 gap-1.5">
          <SpecChip icon={
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          } label={formatKm(car.kilometers_driven)} />
          <SpecChip icon={
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          } label={car.transmission} />
          <SpecChip icon={
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          } label={car.year} />
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-800 group-hover:bg-orange-500/20 transition-colors duration-300" />

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/cars/${car.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 py-2.5 rounded-xl transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Details
          </Link>
          {car.status === 'Available' ? (
            <Link
              to={`/inquiry/${car.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-orange-500 hover:bg-orange-400 text-white py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Enquire
            </Link>
          ) : (
            <span className="flex-1 flex items-center justify-center text-xs font-medium text-slate-600 bg-slate-800/50 border border-slate-800 py-2.5 rounded-xl cursor-not-allowed">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SpecChip({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-slate-800/60 border border-slate-700/50 rounded-lg py-2 px-1">
      <span className="text-slate-500">{icon}</span>
      <span className="text-slate-400 text-xs font-medium text-center leading-tight truncate w-full text-center">{label}</span>
    </div>
  );
}
