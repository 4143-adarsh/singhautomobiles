import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import { PageLoader } from '../../components/Loader';

const STATUS_COLORS = {
  New: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Read: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Replied: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export default function ManageInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await api.get('/inquiries', { params });
      setInquiries(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, [filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/inquiries/${id}`, { status });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
      showToast(`Marked as ${status}`);
    } catch (err) {
      showToast('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    setDeleting(id);
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      showToast('Inquiry deleted');
    } catch (err) {
      showToast('Failed to delete');
    } finally {
      setDeleting(null);
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
          <h2 className="text-2xl font-bold text-white">Manage Inquiries</h2>
          <p className="text-slate-400 text-sm">{inquiries.length} total inquiries</p>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select-field w-auto">
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Read">Read</option>
          <option value="Replied">Replied</option>
        </select>
      </div>

      {loading ? <PageLoader /> : inquiries.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-white">No inquiries yet</h3>
          <p className="text-slate-400 text-sm mt-2">Customer inquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map(inq => (
            <div key={inq.id} className="card overflow-hidden">
              {/* Inquiry header - always visible */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Status indicator */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  inq.status === 'New' ? 'bg-orange-400' :
                  inq.status === 'Read' ? 'bg-blue-400' : 'bg-emerald-400'
                }`}></div>

                {/* Customer info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{inq.full_name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[inq.status]}`}>
                      {inq.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-400">
                    <span>📧 {inq.email}</span>
                    <span>📞 {inq.phone}</span>
                    <span>📍 {inq.city}</span>
                    {inq.car_title && <span className="text-orange-400/80">🚗 {inq.car_title}</span>}
                  </div>
                </div>

                {/* Date + actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-500">{formatDate(inq.created_at)}</span>

                  {/* Status change */}
                  <select
                    value={inq.status}
                    onChange={e => handleStatusChange(inq.id, e.target.value)}
                    className="select-field text-xs py-1.5 w-auto"
                  >
                    <option>New</option>
                    <option>Read</option>
                    <option>Replied</option>
                  </select>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Toggle details"
                  >
                    <svg className={`w-4 h-4 transition-transform ${expanded === inq.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(inq.id)}
                    disabled={deleting === inq.id}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    {deleting === inq.id ? (
                      <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded message */}
              {expanded === inq.id && inq.message && (
                <div className="px-6 pb-5 border-t border-slate-800 pt-4">
                  <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Message</p>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 rounded-xl p-4">{inq.message}</p>
                </div>
              )}
              {expanded === inq.id && !inq.message && (
                <div className="px-6 pb-4 border-t border-slate-800 pt-4">
                  <p className="text-slate-500 text-sm italic">No message provided.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
