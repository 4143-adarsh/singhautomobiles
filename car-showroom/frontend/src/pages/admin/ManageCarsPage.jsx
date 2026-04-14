import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatPrice, formatKm, getImageUrl, formatDate } from '../../utils/helpers';
import { PageLoader } from '../../components/Loader';

export default function ManageCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      const res = await api.get('/cars', { params });
      setCars(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, [filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/cars/${id}`);
      setCars(prev => prev.filter(c => c.id !== id));
      showToast('Car deleted successfully');
    } catch (err) {
      showToast('Failed to delete car');
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (car) => {
    const newStatus = car.status === 'Available' ? 'Sold' : 'Available';
    try {
      await api.put(`/cars/${car.id}`, {
        ...car,
        status: newStatus,
      });
      setCars(prev => prev.map(c => c.id === car.id ? { ...c, status: newStatus } : c));
      showToast(`Marked as ${newStatus}`);
    } catch (err) {
      showToast('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-slate-700 text-white px-5 py-3 rounded-xl shadow-xl animate-fadeInUp">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Vehicles</h2>
          <p className="text-slate-400 text-sm">{cars.length} vehicles in inventory</p>
        </div>
        <Link to="/admin/cars/add" className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Vehicle
        </Link>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title, brand, model..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary px-4">Search</button>
        </form>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select-field w-auto">
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <PageLoader />
      ) : cars.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🚗</div>
          <h3 className="text-lg font-semibold text-white mb-2">No cars found</h3>
          <p className="text-slate-400 mb-4">Add your first vehicle to get started.</p>
          <Link to="/admin/cars/add" className="btn-primary inline-block">Add Vehicle</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Car</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Details</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                          <img src={getImageUrl(car.main_image)} alt={car.title}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.src = 'https://placehold.co/56x40/1e293b/475569?text=car'; }} />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm leading-tight">{car.title}</p>
                          <p className="text-slate-500 text-xs">{car.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      <p>{car.year} · {car.fuel_type} · {car.transmission}</p>
                      <p className="text-xs text-slate-500">{formatKm(car.kilometers_driven)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-orange-400 font-semibold text-sm">{formatPrice(car.price)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(car)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:scale-105 cursor-pointer ${
                          car.status === 'Available'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                        }`}
                        title="Click to toggle status"
                      >
                        {car.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(car.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/cars/${car.id}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          title="View public page"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </Link>
                        <Link
                          to={`/admin/cars/edit/${car.id}`}
                          className="p-2 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(car.id, car.title)}
                          disabled={deleting === car.id}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          {deleting === car.id ? (
                            <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
