import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../utils/api';
import CarCard from '../../components/CarCard';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'];
const CURRENT_YEAR = new Date().getFullYear();

function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="bg-slate-800 animate-pulse" style={{ aspectRatio: '16/10' }} />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-800 rounded-lg animate-pulse w-3/4" />
        <div className="h-3 bg-slate-800 rounded-lg animate-pulse w-1/2" />
        <div className="grid grid-cols-3 gap-1.5">
          {[0,1,2].map(i => <div key={i} className="h-10 bg-slate-800 rounded-lg animate-pulse" />)}
        </div>
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-9 bg-slate-800 rounded-xl animate-pulse" />
          <div className="flex-1 h-9 bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function StatItem({ value, label, icon }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          {value}
        </span>
      </div>
      <span className="text-slate-400 text-xs uppercase tracking-widest">{label}</span>
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
        active
          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

function ActiveTag({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-medium px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-orange-200 transition-colors">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-6">
        <div className="text-7xl opacity-20 select-none">🚗</div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        No cars found
      </h3>
      <p className="text-slate-400 text-sm mb-8 max-w-xs">
        We could not find any cars matching your current filters. Try adjusting your search or resetting all filters.
      </p>
      <button
        onClick={onReset}
        className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
      >
        Reset All Filters
      </button>
    </div>
  );
}

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [activeFuel, setActiveFuel] = useState('');
  const [activeBrand, setActiveBrand] = useState('');
  const [activeTransmission, setActiveTransmission] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [activeYear, setActiveYear] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const listingsRef = useRef(null);

  useEffect(() => {
    api.get('/cars/meta/brands').then(r => setBrands(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const count = [activeStatus, activeFuel, activeBrand, activeTransmission, minPrice, maxPrice, activeYear, searchTerm]
      .filter(Boolean).length;
    setActiveFiltersCount(count);
  }, [activeStatus, activeFuel, activeBrand, activeTransmission, minPrice, maxPrice, activeYear, searchTerm]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeStatus) params.status = activeStatus;
      if (activeFuel) params.fuel_type = activeFuel;
      if (activeBrand) params.brand = activeBrand;
      if (activeYear) params.year = activeYear;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/cars', { params });
      let data = res.data.data || [];

      if (activeTransmission) {
        data = data.filter(c => c.transmission === activeTransmission);
      }

      data = [...data].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'year_desc') return b.year - a.year;
        if (sortBy === 'km_asc') return a.kilometers_driven - b.kilometers_driven;
        return 0;
      });

      setCars(data);
      setTotalCount(data.length);
      setAvailableCount(data.filter(c => c.status === 'Available').length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeStatus, activeFuel, activeBrand, activeYear, minPrice, maxPrice, searchTerm, activeTransmission, sortBy]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const resetAll = () => {
    setActiveStatus(''); setActiveFuel(''); setActiveBrand('');
    setActiveTransmission(''); setMinPrice(''); setMaxPrice('');
    setActiveYear(''); setSearchTerm(''); setSearchInput(''); setSortBy('newest');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const years = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR - i);

  return (
    <div className="min-h-screen bg-slate-950">

      <section className="relative overflow-hidden pt-16 pb-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0d1a2d] to-slate-950" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
        <div className="absolute top-20 right-[10%] w-96 h-96 bg-orange-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 left-[5%] w-72 h-72 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-400 text-sm font-medium tracking-wide">Singh Automobiles · Chhapra, Bihar</span>
            </div>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.08] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Drive Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
                Dream Car
              </span>
              <br />
              <span className="text-slate-300 text-4xl sm:text-5xl md:text-6xl">For Less.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
              Every vehicle is inspected, verified, and fairly priced. No hidden surprises — just quality cars with full history. Visit us at Shyam Chowk, Chhapra.
            </p>
            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search brand, model, title..."
                  className="w-full bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-100 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-slate-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 whitespace-nowrap text-sm"
              >
                Search
              </button>
            </form>
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-0 divide-x divide-slate-800 border border-slate-800 rounded-2xl bg-slate-900/60 backdrop-blur w-fit overflow-hidden">
            <StatItem value="100+" label="Cars Listed" icon="🚗" />
            <StatItem value="500+" label="Happy Buyers" icon="😊" />
            <StatItem value="5★" label="Avg Rating" icon="⭐" />
            <StatItem value="Free" label="Inspection" icon="✅" />
          </div>
        </div>
        <div className="h-16 bg-gradient-to-b from-transparent to-slate-950" />
      </section>

      <section className="sticky top-16 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586a1 1 0 00-.293-.707L1.293 6.707A1 1 0 011 6V4z" />
              </svg>
              <span className="text-slate-400 text-xs font-medium hidden sm:block">Filter</span>
            </div>
            <div className="w-px h-5 bg-slate-800 flex-shrink-0" />
            <FilterPill label="All" active={!activeStatus} onClick={() => setActiveStatus('')} />
            <FilterPill label="Available" active={activeStatus === 'Available'} onClick={() => setActiveStatus(activeStatus === 'Available' ? '' : 'Available')} />
            <FilterPill label="Sold" active={activeStatus === 'Sold'} onClick={() => setActiveStatus(activeStatus === 'Sold' ? '' : 'Sold')} />
            <div className="w-px h-5 bg-slate-800 flex-shrink-0" />
            {FUEL_TYPES.map(f => (
              <FilterPill key={f} label={f} active={activeFuel === f} onClick={() => setActiveFuel(activeFuel === f ? '' : f)} />
            ))}
            <div className="w-px h-5 bg-slate-800 flex-shrink-0" />
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                showAdvanced || activeFiltersCount > 0
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              More
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-orange-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button onClick={resetAll} className="flex-shrink-0 flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all
              </button>
            )}
          </div>

          {showAdvanced && (
            <div className="pb-4 border-t border-slate-800/60 pt-4">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Brand</label>
                  <select value={activeBrand} onChange={e => setActiveBrand(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 min-w-[130px]">
                    <option value="">All Brands</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Transmission</label>
                  <select value={activeTransmission} onChange={e => setActiveTransmission(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 min-w-[130px]">
                    <option value="">Any</option>
                    {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Year</label>
                  <select value={activeYear} onChange={e => setActiveYear(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 min-w-[110px]">
                    <option value="">Any Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Min Price</label>
                  <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    placeholder="e.g. 300000"
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 w-36 placeholder-slate-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Max Price</label>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    placeholder="e.g. 2000000"
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 w-36 placeholder-slate-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Sort By</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 min-w-[160px]">
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="year_desc">Year: Newest</option>
                    <option value="km_asc">Lowest KM First</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section ref={listingsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            {loading ? (
              <div className="h-6 w-48 bg-slate-800 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {cars.length === 0 ? 'No Results' : (
                    searchTerm ? `Results for "${searchTerm}"` :
                    activeFuel || activeBrand || activeStatus ? 'Filtered Results' : 'All Available Cars'
                  )}
                </h2>
                {cars.length > 0 && (
                  <span className="bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">
                    {availableCount} available of {totalCount}
                  </span>
                )}
              </div>
            )}
          </div>
          {!loading && activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeStatus && <ActiveTag label={activeStatus} onRemove={() => setActiveStatus('')} />}
              {activeFuel && <ActiveTag label={activeFuel} onRemove={() => setActiveFuel('')} />}
              {activeBrand && <ActiveTag label={activeBrand} onRemove={() => setActiveBrand('')} />}
              {activeTransmission && <ActiveTag label={activeTransmission} onRemove={() => setActiveTransmission('')} />}
              {activeYear && <ActiveTag label={activeYear} onRemove={() => setActiveYear('')} />}
              {minPrice && <ActiveTag label={`Min ${Number(minPrice).toLocaleString('en-IN')}`} onRemove={() => setMinPrice('')} />}
              {maxPrice && <ActiveTag label={`Max ${Number(maxPrice).toLocaleString('en-IN')}`} onRemove={() => setMaxPrice('')} />}
              {searchTerm && <ActiveTag label={searchTerm} onRemove={() => { setSearchTerm(''); setSearchInput(''); }} />}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : cars.length === 0 ? (
          <EmptyState onReset={resetAll} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cars.map((car, index) => (
              <div key={car.id} className="animate-fadeInUp"
                style={{ animationDelay: `${Math.min(index * 50, 400)}ms`, animationFillMode: 'both' }}>
                <CarCard car={car} index={index} />
              </div>
            ))}
          </div>
        )}
      </section>

      {!loading && cars.length > 0 && (
        <section className="bg-slate-900/50 border-t border-slate-800 py-14 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Why Buy From Singh Automobiles?
              </h2>
              <p className="text-slate-400 text-sm">Everything you need for a confident purchase</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🔍', title: 'Inspected Cars', desc: 'Every car undergoes a thorough multi-point inspection before listing.' },
                { icon: '📋', title: 'Full History', desc: 'Service records, ownership history, and accident reports provided.' },
                { icon: '💰', title: 'Fair Pricing', desc: 'Market-transparent prices. No hidden costs or surprise fees.' },
                { icon: '🤝', title: 'After-Sale Support', desc: 'Our team is available to assist you even after purchase.' },
              ].map(item => (
                <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors duration-300 group">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-semibold text-sm mb-1.5 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
