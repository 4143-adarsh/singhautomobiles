import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/Loader';

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-white text-xl">
              AE
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4 font-display">Admin Panel</h1>
          <p className="text-slate-400 mt-2">Sign in to manage your showroom</p>
        </div>

        {/* Form card */}
        <div className="card p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="admin@singhautomobiles.in"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
            >
              {loading ? <><Spinner size="sm" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-xs text-slate-500 text-center mb-2">Default credentials</p>
            <p className="text-xs text-slate-400 text-center">
              <span className="text-slate-300">admin@singhautomobiles.in</span> / <span className="text-slate-300">Admin@123</span>
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-slate-500 hover:text-orange-400 text-sm transition-colors">
            ← Back to Showroom
          </Link>
        </p>
      </div>
    </div>
  );
}
