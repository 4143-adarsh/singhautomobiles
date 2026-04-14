import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

function StatCard({ title, value, icon, color, sublabel }) {
  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-3xl font-bold text-white font-display">{value ?? '—'}</p>
        {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, inqRes] = await Promise.all([
          api.get('/inquiries/stats'),
          api.get('/inquiries?limit=5'),
        ]);
        setStats(statsRes.data.data);
        setRecentInquiries(inqRes.data.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-6 h-28 skeleton"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-slate-400 text-sm mt-1">Welcome back to Singh Automobiles Admin Panel</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Cars" value={stats?.totalCars} icon="🚗" color="bg-blue-500/20" />
        <StatCard title="Available" value={stats?.availableCars} icon="✅" color="bg-emerald-500/20" />
        <StatCard title="Sold" value={stats?.soldCars} icon="🔖" color="bg-orange-500/20" />
        <StatCard title="Inquiries" value={stats?.totalInquiries} icon="💬"
          color="bg-purple-500/20"
          sublabel={stats?.newInquiries ? `${stats.newInquiries} new` : null}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/cars/add" className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New Vehicle
          </Link>
          <Link to="/admin/cars" className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Manage Cars
          </Link>
          <Link to="/admin/inquiries" className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            View Inquiries
            {stats?.newInquiries > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stats.newInquiries}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Inquiries</h3>
          <Link to="/admin/inquiries" className="text-orange-400 hover:text-orange-300 text-sm">
            View All →
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            No inquiries yet.
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Car</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inq, i) => (
                    <tr key={inq.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/30'}`}>
                      <td className="px-4 py-3">
                        <p className="text-white font-medium text-sm">{inq.full_name}</p>
                        <p className="text-slate-500 text-xs">{inq.city}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-300 text-sm">{inq.email}</p>
                        <p className="text-slate-500 text-xs">{inq.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm">
                        {inq.car_title || <span className="text-slate-600">General</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          inq.status === 'New' ? 'bg-orange-500/20 text-orange-400' :
                          inq.status === 'Read' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>{inq.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(inq.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
